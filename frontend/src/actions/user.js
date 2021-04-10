import { USER_CHANGED } from '../constants/user';

export const userSelected = (data) => (
  {
    type: USER_CHANGED,
    data
  }
);