import {NOT_FOUND} from 'redux-first-router';
import {
  CALL_API,
  LOAD_MY_DATA_REQUEST,
  LOAD_MY_DATA_SUCCESS,
  LOAD_MY_DATA_FAILURE,
} from '../types';

// try dispatching these from the redux devTools
export const getVideoActionCreator = (category, jwToken) => async (
  dispatch
) => {
  try {
    const action = await dispatch({
      [CALL_API]: {
        types: [
          LOAD_MY_DATA_REQUEST,
          LOAD_MY_DATA_SUCCESS,
          LOAD_MY_DATA_FAILURE,
        ],
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
};

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
