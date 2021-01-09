import {redirect} from 'redux-first-router';
import {v4} from 'uuid';
import {addFlashMessage} from './actions/flashMessages';
import {EFlashMessageType} from './Enums';
import {isAllowed, isServer} from './utils';

export default {
  onBeforeChange: (dispatch, getState, {action}) => {
    const allowed = isAllowed(action.type, getState());
    const {auth, page} = getState();

    if (!allowed) {
      const action = auth.isAuthenticated
        ? redirect({type: page})
        : redirect({type: 'LOGIN'});
      dispatch(action);

      dispatch(
        addFlashMessage({
          id: v4(),
          type: EFlashMessageType.ERROR,
          text: 'У вас недостаточно прав для просмотра этой страницы!',
        })
      );
    }
  },
  onAfterChange: (dispatch, getState) => {
    const {type} = getState().location;

    if (type === 'LOGIN' && !isServer) {
      setTimeout(() => {
        dispatch(
          addFlashMessage({
            id: v4(),
            type: EFlashMessageType.SUCCESS,
            text: alertMessage,
          })
        );
      }, 200);
    }
  },
};

const alertMessage = 'Давайте залогинимся!';
