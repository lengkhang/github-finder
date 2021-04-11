import { Octokit } from '@octokit/rest';
import SearchHistory from '../models/searchHistory';
import { SEARCH_TYPE } from '../constants';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  previews: ['mercy-preview']
});

const saveQueryIntoDatabase = async ({ userId, searchType, searchTexts }) => {
  try {
    const searchHistory = new SearchHistory({ type: searchType, texts: searchTexts, userId });

    await searchHistory.save();
  } catch (err) {
    console.log('==> Save to db failed:', err.message);

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

export const getAllSearchHistories = async (req, res) => {
  const { pageNo = 1, pageSize } = req.query || {};

  try {
    const [ total, searchHistory ] = await Promise.all([
      SearchHistory.countDocuments(),
      findSearchHistory({ pageSize: parseInt(pageSize), pageNo: parseInt(pageNo) })
    ]);

    return res.status(200).json({ success: true, items: searchHistory, total });
  } catch (err) {
    console.error('==> Error:', err);
    return res.status(500).json({ success: false, error: err });
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
    console.error('==> Error:', err);
    return res.status(500).json({ error: { message: err.message } });
  }
};