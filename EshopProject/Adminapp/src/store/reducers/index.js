import { combineReducers } from 'redux';
import authReducer from './authReducer';
import otherReducers from './otherReducers';

export default combineReducers({
  auth: authReducer,
  other: otherReducers,
});
