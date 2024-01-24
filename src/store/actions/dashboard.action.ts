export const GET_ALL_MESSAGE_HISTORY = 'GET_ALL_MESSAGE_HISTORY';
export const SET_ALL_MESSAGE_HISTORY = 'SET_ALL_MESSAGE_HISTORY';

export const getAllMessageHistory = (type: boolean) => {
    return {
        type: GET_ALL_MESSAGE_HISTORY,
        payload: {
            type
        }
    }
};

export const setAllMessageHistory = (messageHistory: any) => {
    return {
        type: SET_ALL_MESSAGE_HISTORY, payload: {
            messageHistory
        }
    };
}