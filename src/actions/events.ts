import {AnyAction} from 'redux';
import {
  CALL_API,
  CALL_API_ACTION,
  NEW_EVENT_FAILURE,
  NEW_EVENT_REQUEST,
  NEW_EVENT_SUCCESS,
} from 'src/types';

export function createEvent(event: any): AnyAction {
  return {
    type: CALL_API_ACTION,
    [CALL_API]: {
      types: [NEW_EVENT_REQUEST, NEW_EVENT_SUCCESS, NEW_EVENT_FAILURE],
      method: 'POST',
      endpoint: '/events',
      payload: {event},
      requestBody: event,
    },
  };
}
