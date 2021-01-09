import {IActionWith, IAuthState} from 'src/Models';
import {USER_LOGGED_IN, USER_LOGGED_OUT} from 'src/types';

const initialState: IAuthState = {
  isAuthenticated: false,
  user: null,
};

export default (prevState: IAuthState = initialState, action: IActionWith) => {
  let state = prevState;

  switch (action.type) {
    case USER_LOGGED_IN:
      state = {
        isAuthenticated: true,
        user: action.payload,
      };
      break;
    case USER_LOGGED_OUT:
      state = {
        ...initialState,
      };
      break;
    default:
      state = prevState;
      break;
  }

  return state;
};
