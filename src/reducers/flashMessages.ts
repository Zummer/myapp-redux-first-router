import {AnyAction} from 'redux';
import {IFlashMessage} from '../Models';
import {ADD_FLASH_MESSAGE, DELETE_FLASH_MESSAGE} from '../types';

export default (prevState: IFlashMessage[] = [], action: AnyAction) => {
  let state = prevState;

  switch (action.type) {
    case ADD_FLASH_MESSAGE:
      state = [...prevState, action.payload];
      break;
    case DELETE_FLASH_MESSAGE:
      state = prevState.filter((message) => message.id !== action.payload);
      break;
    default:
      state = prevState;
      break;
  }

  return state;
};
