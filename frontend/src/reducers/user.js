import { USER_CHANGED } from '../constants/user';

const INITIAL_STATE = {
  current: null
};

const repositories = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USER_CHANGED:
      return {
        ...state,
        current: action.data
      };

    default:
      return state;
  }
};

export default repositories;