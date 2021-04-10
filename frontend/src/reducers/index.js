import { combineReducers } from 'redux';
import repositories from './repositories';
import user from './user';
import searchHistory from './searchHistory';

const rootReducer = combineReducers({
  repositories,
  user,
  searchHistory
});

export default rootReducer;