import { combineReducers } from 'redux';
import repositories from './repositories';
import user from './user';

const rootReducer = combineReducers({
  repositories,
  user
});

export default rootReducer;