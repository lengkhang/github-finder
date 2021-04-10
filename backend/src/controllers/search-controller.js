import { Octokit } from '@octokit/rest';
import Search from '../models/search';  //TODO: rename to SearchHistory?

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  previews: ["mercy-preview"]
});

export const getSearch = async (req, res) => {
  //TODO: Validate query string using JOI?
  const { language, topic, pageNo = 1, pageSize } = req.query || {};

  console.log('==> pageNo, pageSize:', pageNo, pageSize, language, topic)
  const languages = language && language.split(',');
  const topics = topic && topic.split(',');

  //http://localhost:3001/api/search?language=c%2B%2B%2Cjava&pageSize=100&pageNo=2
  //http://localhost:3001/api/search?topic=ruby,graphql&pageSize=100&pageNo=1
  const query = language
    ? languages.map(language => `language:${language}`).join('+')
    : topics.map(topic => `topic:${topic}`).join('+');

  console.log('==> query:', query);

  try {
    const result = await octokit.rest.search.repos({
      q: query,
      page: parseInt(pageNo),
      per_page: parseInt(pageSize)
    });
  
    return res.status(200).json({ total: result.data.total_count, items: result.data.items });
  } catch (err) {
    return res.status(500).json({ error: { message: err.message } });
  }
};