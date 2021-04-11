import { Octokit } from '@octokit/rest';
import Joi from 'joi';
import SearchHistory from '../models/searchHistory';
import { SEARCH_TYPE, ERROR_CODE } from '../constants';
import { parseToInteger } from '../lib/joiCustomValidation';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  previews: ['mercy-preview']
});

const getValidatedData = (query) => {
  const schema = Joi.object({
    language: Joi.string(),
    topic: Joi.string(),
    pageSize: Joi.string().required().custom(parseToInteger),
    pageNo: Joi.string().required().custom(parseToInteger)
  });

  const { value: validatedValue, error } = schema.validate(query);

  if (error) {
    const err = new Error(error);
    err.code = ERROR_CODE.VALIDATION;

    throw err;
  } else if (!validatedValue.language && !validatedValue.topic) {
    const err = new Error('ValidationError: Either "language" and "topic" must contain value');
    err.code = ERROR_CODE.VALIDATION;

    throw err;
  }

  return validatedValue;
}

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

export const getSearch = async (req, res) => {
  try {
    const { id: userId } = req.currentUser;
    const { language, topic, pageSize, pageNo } = getValidatedData(req.query);
    // const { language, topic, pageNo = 1, pageSize } = req.query || {};

    console.log('==> pageNo, pageSize:', pageNo, pageSize, language, topic)
    const languages = language && language.split(',');
    const topics = topic && topic.split(',');
    const searchType = languages ? SEARCH_TYPE.LANGUAGE : SEARCH_TYPE.TOPIC;
    const searchTexts = getSearchTexts(searchType, languages, topics);
    const query = searchTexts.map(text => `${searchType}:${text}`).join('+');

    console.log('==> query:', query);

    const result = await octokit.rest.search.repos({
      q: query,
      page: parseInt(pageNo),
      'per_page': parseInt(pageSize)
    });

    await saveQueryIntoDatabase({ userId, searchType, searchTexts });

    //TODO: whitelist data.items to return
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