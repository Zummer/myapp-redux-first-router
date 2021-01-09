import {AnyAction} from 'redux';
import {IFlashMessage} from '../Models';
import {ADD_FLASH_MESSAGE, DELETE_FLASH_MESSAGE} from '../types';
import {components} from './page';

export default (prevState: IFlashMessage[] = [], action: AnyAction) => {
  let state = prevState;

  // если экшн - переход на страницу, то сбрасываем все флэшки
  const PAGE = 'PAGE';
  const type = components[action.type] ? PAGE : action.type;

  switch (type) {
    case ADD_FLASH_MESSAGE:
      state = [...prevState, action.payload];
      break;
    case DELETE_FLASH_MESSAGE:
      state = prevState.filter((message) => message.id !== action.payload);
      break;
    case PAGE:
      state = [];
      break;
    default:
      state = prevState;
      break;
  }

  return state;
};
