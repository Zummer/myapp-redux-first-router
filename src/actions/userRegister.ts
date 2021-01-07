import {
  CALL_API,
  CALL_API_ACTION,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAILURE,
  SET_USER_REGISTER_FORM_ERRORS,
} from '../types';
import {IUserRegisterParams} from '../Models';
import {AnyAction, Dispatch} from 'redux';
import {EFlashMessageType, ERequestActionStatus} from '../Enums';
import {addFlashMessage} from './flashMessages';
import {v4} from 'uuid';
import {goHome} from './index';

export const setUserRegisterFormErrors = (errors: any): AnyAction => ({
  type: SET_USER_REGISTER_FORM_ERRORS,
  payload: errors,
});

export const userRegisterRequest = (
  userRegisterParams: IUserRegisterParams
) => async (dispatch: Dispatch): Promise<void> => {
  try {
    const action: any = await dispatch({
      type: CALL_API_ACTION,
      [CALL_API]: {
        types: [
          USER_REGISTER_REQUEST,
          USER_REGISTER_SUCCESS,
          USER_REGISTER_FAILURE,
        ],
        method: 'POST',
        endpoint: '/register',
        payload: {userRegisterParams},
        requestBody: userRegisterParams,
      },
    });

    switch (action.status) {
      case ERequestActionStatus.SUCCESS:
        dispatch(goHome());
        addFlashMessage(
          {
            id: v4(),
            type: EFlashMessageType.SUCCESS,
            text:
              'Вы успешно зарегистрировались! Проверьте почту и активируйте пользователя.',
          },
          10000
        )(dispatch);
        break;
      case ERequestActionStatus.FAIL:
        addFlashMessage({
          id: v4(),
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
};
