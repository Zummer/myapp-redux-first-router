import {IActionWith, IBaseState} from '../Models';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  SET_LOGIN_FORM_ERRORS,
} from '../types/index';

const initialState: IBaseState = {
  errors: null,
  isLoading: false,
};

export default (prevState: IBaseState = initialState, action: IActionWith) => {
  let state = prevState;
  switch (action.type) {
    case LOGIN_REQUEST:
      state = {
        ...prevState,
        isLoading: true,
      };
      break;
    case LOGIN_SUCCESS:
      state = {
        ...prevState,
        errors: null,
        isLoading: false,
      };
      break;
    case LOGIN_FAILURE:
      state = {
        ...prevState,
        errors: action.error.errors,
        isLoading: false,
      };
      break;
    case SET_LOGIN_FORM_ERRORS:
      state = {
        ...prevState,
        errors: action.payload,
        isLoading: false,
      };
      break;
    default:
      state = prevState;
      break;
  }

  return state;
};
