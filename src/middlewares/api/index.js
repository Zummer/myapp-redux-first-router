import {callApi} from './callApi';
import {CALL_API} from '../../types';

function isBrowser() {
    return typeof window !== 'undefined';
}

export default (store) => (next) => async (action) => {
    const callAPI = action[CALL_API];

    if (typeof callAPI === 'undefined') {
        return next(action);
    }

    const {endpoint, payload, method, types, queryParams, requestBody} = callAPI;

    // final action
    const actionWith = (obj) => {
        const finalAction = {
            ...action,
            ...obj,
        };

        delete finalAction[CALL_API];

        return finalAction;
    };

    const [requestType, successType, failureType] = types;
    const token = (isBrowser() && localStorage.jwtToken) || (payload && payload.jwToken);

    next(
        actionWith({
            type: requestType,
            status: 'SEND',
        })
    );

    try {
        const response = await callApi(endpoint, method, token, queryParams, requestBody);

        return next(
            actionWith({
                type: successType,
                payload,
                status: 'SUCCESS',
                payload: {
                    ...payload,
                    response,
                },
            })
        );
    } catch (error) {
        return next(
            actionWith({
                type: failureType,
                error,
                errorMessage: error.message || 'Something bad happened',
                status: 'FAIL',
            })
        );
    }
};
