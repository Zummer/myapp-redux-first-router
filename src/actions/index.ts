import {NOT_FOUND} from 'redux-first-router';
import {
  CALL_API,
  CALL_API_ACTION,
  LOAD_MY_DATA_REQUEST,
  LOAD_MY_DATA_SUCCESS,
  LOAD_MY_DATA_FAILURE,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAILURE,
  SET_USER_REGISTER_FORM_ERRORS,
} from '../types';
import {IUserRegisterParams} from '../Models';
import {AnyAction, Dispatch} from 'redux';
import {EFlashMessageType, ERequestActionStatus} from '../Enums';
import {addFlashMessage} from './flashMessages';
import {v4 as uuid} from 'uuid';

export const setFormErrors = (errors: any): AnyAction => ({
  type: SET_USER_REGISTER_FORM_ERRORS,
  payload: errors,
});

export const userRegisterRequest = (userRegisterParams: IUserRegisterParams) => async (dispatch: Dispatch): Promise<void> =>
{
  try {
    const action: any = await dispatch({
      type: CALL_API_ACTION,
      [CALL_API]: {
        types: [USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_REGISTER_FAILURE],
        method: 'POST',
        endpoint: '/register',
        payload: {userRegisterParams},
        requestBody: userRegisterParams,
      },
    });

    switch (action.status) {
      case ERequestActionStatus.SUCCESS:
        dispatch(goHome());
        addFlashMessage({
          id: uuid(),
          type: EFlashMessageType.SUCCESS,
          text: 'Вы успешно зарегистрировались!',
        })(dispatch);
        break;
      case ERequestActionStatus.FAIL:
        addFlashMessage({
          id: uuid(),
          type: EFlashMessageType.ERROR,
          text: 'Регистрация не получилась!',
        })(dispatch);
        break;
      default:
        break;
    }

  } catch (error) {
    console.log(error);
  }
}  



// try dispatching these from the redux devTools
export const getVideoActionCreator = (category, jwToken) => async (dispatch) =>
{
  try {
    const action = await dispatch({
      [CALL_API]: {
        types: [LOAD_MY_DATA_REQUEST, LOAD_MY_DATA_SUCCESS, LOAD_MY_DATA_FAILURE],
        method: 'GET',
        endpoint: `/videos/${category}`,
        payload: {category, jwToken},
      },
    });
    const videos = action.payload && action.payload.response;

    if (videos && videos.length === 0) {
        dispatch({type: 'NOT_FOUND'});
    }
  } catch (err) {
      console.log(err);
  }
}
  

export const goToPage = (type, category) => ({
  type,
  payload: category && {category},
});

export const goHome = () => ({
  type: 'HOME',
});

export const goToAdmin = () => ({
  type: 'ADMIN',
});

export const notFound = () => ({
  type: NOT_FOUND,
});

export const visitCategory = (category) => ({
  type: 'LIST',
  payload: {category},
});

export const visitVideo = (slug) => ({
  type: 'VIDEO',
  payload: {slug},
});
