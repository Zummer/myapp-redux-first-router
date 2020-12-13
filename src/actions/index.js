import {NOT_FOUND} from 'redux-first-router';
import {CALL_API, LOAD_MY_DATA_REQUEST, LOAD_MY_DATA_SUCCESS, LOAD_MY_DATA_FAILURE} from '../types';

// try dispatching these from the redux devTools

export const getVideoActionCreator = (category, jwToken) => (dispatch) =>
    dispatch({
        [CALL_API]: {
            types: [LOAD_MY_DATA_REQUEST, LOAD_MY_DATA_SUCCESS, LOAD_MY_DATA_FAILURE],
            method: 'GET',
            endpoint: `/videos/${category}`,
            payload: {category, jwToken},
        },
    });

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
