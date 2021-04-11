import { LOAD_SEARCH_HISTORY } from '../constants/searchHistory';

export const loadSearchHistory = ({ pageNo = 1, pageSize }) => (
  {
    type: LOAD_SEARCH_HISTORY,
    data: {
      pageNo,
      pageSize
    }
  }
);