import { SEARCH_REPOSITORIES, SEARCH_REPOSITORIES_SUCCESS, SEARCH_REPOSITORIES_FAILED, SEARCH_REPOSITORIES_CLEAR } from '../constants/repositories';

const INITIAL_STATE = {
  items: [],
  total: 0,
  isLoading: false,
  error: null
};

const repositories = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SEARCH_REPOSITORIES:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case SEARCH_REPOSITORIES_SUCCESS:
      return {
        ...state,
        items: action.data.items,
        total: action.data.total,
        isLoading: false
      };

    case SEARCH_REPOSITORIES_FAILED:
      return {
        ...state,
        items: [],
        error: action.message,
        isLoading: false
      };

    case SEARCH_REPOSITORIES_CLEAR:
      return {
        ...state,
        items: [],
        total: 0
      };

    default:
      return state;
  }
};

export default repositories;