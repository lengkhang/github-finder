import { Octokit } from '@octokit/rest';
import Joi from 'joi';
import SearchHistory from '../models/searchHistory';
import { SEARCH_TYPE, ERROR_CODE } from '../constants';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  previews: ['mercy-preview']
});

const saveQueryIntoDatabase = async ({ userId, searchType, searchTexts }) => {
  try {
    const searchHistory = new SearchHistory({ type: searchType, texts: searchTexts, userId });

    await searchHistory.save();
  } catch (err) {
    throw new Error(err.message);
  }
};

const getSearchTexts = (searchType, languages, topics) => {
  const searchTextMapType = {
    [SEARCH_TYPE.LANGUAGE]: languages,
    [SEARCH_TYPE.TOPIC]: topics
  };

  return searchTextMapType[searchType];
}

const findSearchHistory = ({ pageSize, pageNo }) => {
  return SearchHistory.find()
    .limit(pageSize)
    .skip(pageSize * (pageNo - 1))
    .sort('-createdAt');
};

const parseToInteger = (value, helpers) => {
  const valueInInt = parseInt(value);

  if (valueInInt > 0) {
    return valueInInt;
  }

  return helpers.error("any.invalid");
};

const getValidatedData = (query) => {
  const schema = Joi.object({
    pageSize: Joi.string().required().custom(parseToInteger),
    pageNo: Joi.string().required().custom(parseToInteger)
  });

  const { value: validatedValue, error } = schema.validate(query);

  if (error) {
    const err = new Error(error);
    err.code = ERROR_CODE.VALIDATION;

    throw err;
  }

  return validatedValue;
}

export const getAllSearchHistories = async (req, res) => {
  try {
    const { pageSize, pageNo } = getValidatedData(req.query);

    console.log('==> start db');
    const [ total, searchHistory ] = await Promise.all([
      SearchHistory.countDocuments(),
      findSearchHistory({ pageSize, pageNo })
    ]);

    console.log('==> end db:', { items: searchHistory, total });

    return res.status(200).json({ items: searchHistory, total });
  } catch (err) {
    console.log('==> Error:', err);
    let statusCode = 500;

    if (err.code === ERROR_CODE.VALIDATION) {
      statusCode = 422;
    }

    return res.status(statusCode).json({ 
      error: {
        message: err.message
      }
    });
  }
};

//http://localhost:3001/api/search?language=c%2B%2B%2Cjava&pageSize=100&pageNo=2
//http://localhost:3001/api/search?topic=ruby,graphql&pageSize=100&pageNo=1
export const getSearch = async (req, res) => {
  //TODO: Validate query string using JOI?
  const { id: userId } = req.currentUser;
  const { language, topic, pageNo = 1, pageSize } = req.query || {};

  console.log('==> pageNo, pageSize:', pageNo, pageSize, language, topic)
  const languages = language && language.split(',');
  const topics = topic && topic.split(',');
  const searchType = languages ? SEARCH_TYPE.LANGUAGE : SEARCH_TYPE.TOPIC;
  const searchTexts = getSearchTexts(searchType, languages, topics);

  const query = searchTexts.map(text => `${searchType}:${text}`).join('+');

  console.log('==> query:', query);

  try {
    const result = await octokit.rest.search.repos({
      q: query,
      page: parseInt(pageNo),
      'per_page': parseInt(pageSize)
    });

    await saveQueryIntoDatabase({ userId, searchType, searchTexts });

    return res.status(200).json({ total: result.data.total_count, items: result.data.items });
  } catch (err) {
    console.log('==> Error:', err);
    let statusCode = 500;

    if (err.code === ERROR_CODE.VALIDATION) {
      statusCode = 422;
    }

    return res.status(statusCode).json({ 
      error: {
        message: err.message
      }
    });
  }
};