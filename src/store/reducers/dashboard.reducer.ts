import {IActionModel} from "../../shared/models/action.model";
import {GET_ALL_MESSAGE_HISTORY, SET_ALL_MESSAGE_HISTORY} from "../actions/dashboard.action";

export interface IDashboardReducerState {
    isMessageHistoryLoading: boolean,
    isMessageHistoryLoaded: boolean,
    isMessageHistoryFailed: boolean,
    messageHistory?: any[]
};

const initialData: IDashboardReducerState = {
    isMessageHistoryLoading: false,
    isMessageHistoryLoaded: false,
    isMessageHistoryFailed: false,
    messageHistory: undefined
};

export const DashboardReducer = (state: IDashboardReducerState = initialData, action: IActionModel): any => {
    switch (action.type) {
        case  GET_ALL_MESSAGE_HISTORY:
            state = {
                ...state,
                isMessageHistoryLoading: true,
                isMessageHistoryLoaded: false,
                isMessageHistoryFailed: false,
                messageHistory: undefined
            };
            return state;
        case SET_ALL_MESSAGE_HISTORY:
            console.log('messageHistory', action.payload)
            state = {
                ...state,
                isMessageHistoryLoading: false,
                isMessageHistoryLoaded: true,
                isMessageHistoryFailed: false,
                messageHistory: action.payload.messageHistory
            }
            return state;
        default :
            return state
    }
}