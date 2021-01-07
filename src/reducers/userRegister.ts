import { IActionWith, IBaseState } from '../Models';
import { USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_REGISTER_FAILURE, SET_USER_REGISTER_FORM_ERRORS } from '../types/index';

const initialState: IBaseState = {
    errors: null,
    isLoading: false,
}

export default (prevState: IBaseState = initialState, action: IActionWith) => {
    let state = prevState;
    switch (action.type) {
        case USER_REGISTER_REQUEST:
            state = {
                ...prevState,
                isLoading: true,
            };
            break;
        case USER_REGISTER_SUCCESS:
            state = {
                ...prevState,
                errors: null,
                isLoading: false,
            };
            break;
        case USER_REGISTER_FAILURE:
            state = {
                ...prevState,
                errors: action.error.errors,
                isLoading: false,
            };
            break;
        case SET_USER_REGISTER_FORM_ERRORS:
            state = {
                ...prevState,
                errors: action.payload,
                isLoading: false,
            };
            break;
        default:
            state = prevState;
            break;
    }

    return state;
}
