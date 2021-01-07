import { AnyAction, Dispatch } from "redux";
import { IFlashMessage } from "../Models";
import { ADD_FLASH_MESSAGE, DELETE_FLASH_MESSAGE } from "../types";

export const addFlashMessage = (message: IFlashMessage) => (dispatch: Dispatch): void => {
        dispatch({
            type: ADD_FLASH_MESSAGE,
            payload: message, 
        });

        setTimeout(() => {
            dispatch(deleteFlashMessage(message.id));
        }, 5000);
    };

export function deleteFlashMessage(id: string): AnyAction {
    return {
        type: DELETE_FLASH_MESSAGE,
        payload: id, 
    };
}