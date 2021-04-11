import Joi from 'joi';
import SearchHistory from '../models/searchHistory';
import { SEARCH_TYPE, ERROR_CODE } from '../constants';
import { parseToInteger } from '../lib/joiCustomValidation';

const saveQueryIntoDatabase = async ({ userId, searchType, searchTexts }) => {
  try {
    const searchHistory = new SearchHistory({ type: searchType, texts: searchTexts, userId });

    await searchHistory.save();
  } catch (err) {
    throw new Error(err.message);
  }
};

const findSearchHistory = ({ pageSize, pageNo }) => {
  return SearchHistory.find()
    .limit(pageSize)
    .skip(pageSize * (pageNo - 1))
    .sort('-createdAt');
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

    const [ total, searchHistory ] = await Promise.all([
      SearchHistory.countDocuments(),
      findSearchHistory({ pageSize, pageNo })
    ]);

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