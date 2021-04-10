import { LOAD_SEARCH_HISTORY, LOAD_SEARCH_HISTORY_SUCCESS, LOAD_SEARCH_HISTORY_FAIL } from '../constants/searchHistory';
import { USER_CHANGED } from '../constants/user';

const INITIAL_STATE = {
  items: [],
  total: 0,
  isLoading: false,
  error: null
};

const searchHistory = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOAD_SEARCH_HISTORY:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case LOAD_SEARCH_HISTORY_SUCCESS:
      return {
        ...state,
        items: action.data.items,
        total: action.data.total,
        isLoading: false
      };

    case LOAD_SEARCH_HISTORY_FAIL:
      return {
        ...state,
        items: [],
        error: action.message,
        isLoading: false
      };

    case USER_CHANGED:
      return INITIAL_STATE;

    default:
      return state;
  }
};

export default searchHistory;