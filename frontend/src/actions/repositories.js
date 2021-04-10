import { SEARCH_REPOSITORIES, SEARCH_REPOSITORIES_CLEAR } from '../constants/repositories';

export const searchRepositories = ({ texts, type }) => (
  {
    type: SEARCH_REPOSITORIES,
    data: {
      texts,
      type
    }
  }
);

export const clearSearch = () => (
  {
    type: SEARCH_REPOSITORIES_CLEAR
  }
);