import {AnyAction, Dispatch} from 'redux';
import {IFlashMessage} from '../Models';
import {ADD_FLASH_MESSAGE, DELETE_FLASH_MESSAGE} from '../types';

const FLASH_MESSAGE_SHOW_TIMEOUT = 5000;

/**
 * Добавляет всплывающее сообщение.
 * @param message Coобщение.
 * @param timeout Время показа сообщения.
 */
export const addFlashMessage = (
  message: IFlashMessage,
  timeout: number = FLASH_MESSAGE_SHOW_TIMEOUT
) => (dispatch: Dispatch): void => {
  dispatch({
    type: ADD_FLASH_MESSAGE,
    payload: message,
  });

  setTimeout(() => {
    dispatch(deleteFlashMessage(message.id));
  }, timeout);
};

export function deleteFlashMessage(id: string): AnyAction {
  return {
    type: DELETE_FLASH_MESSAGE,
    payload: id,
  };
}
