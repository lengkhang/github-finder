import { SEARCH_REPOSITORIES, SEARCH_REPOSITORIES_CLEAR } from '../constants/repositories';

export const searchRepositories = ({ texts, type, pageNo, pageSize }) => (
  {
    type: SEARCH_REPOSITORIES,
    data: {
      texts,
      type,
      pageNo,
      pageSize
    }
  }
);

export const clearSearch = () => (
  {
    type: SEARCH_REPOSITORIES_CLEAR
  }
);