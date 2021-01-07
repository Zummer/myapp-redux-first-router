import {callApi} from './callApi';
import {CALL_API} from '../../types';
import {IActionWith} from '../../Models';
import {ERequestActionStatus} from '../../Enums';

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
  const actionWith = (obj: IActionWith): IActionWith => {
    const finalAction = {
      ...action,
      ...obj,
    };

    delete finalAction[CALL_API];

    return finalAction;
  };

  const [requestType, successType, failureType] = types;
  const token =
    (isBrowser() && localStorage.jwtToken) || (payload && payload.jwToken);

  next(
    actionWith({
      type: requestType,
      status: ERequestActionStatus.SEND,
    })
  );

  try {
    const response = await callApi(
      endpoint,
      method,
      token,
      queryParams,
      requestBody
    );

    return next(
      actionWith({
        type: successType,
        status: ERequestActionStatus.SUCCESS,
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
        status: ERequestActionStatus.FAIL,
      })
    );
  }
};
