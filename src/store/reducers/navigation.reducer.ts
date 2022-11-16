import {IActionModel} from "../../shared/models/action.model";
import {
    LOGOUT, SET_LOGGED_IN_USER_TOKEN, SET_LOGGED_USER_DATA
} from "../actions/account.action";
import {CommonService} from "../../shared/services";
import {Misc} from "../../constants";
import Communications from "../../shared/services/communications.service";
import {SET_CURRENT_NAV_PARAMS} from "../actions/navigation.action";

export interface INavigationReducerState {
    currentNavParams: {
        title: string,
        meta: any
    };
    prevNavParams?: {
        title: string,
        meta: any
    };
}

const INITIAL_STATE: INavigationReducerState = {
    currentNavParams: {
        title: "",
        meta: undefined
    }
};

const navigationReducer = (state: INavigationReducerState = INITIAL_STATE, action: IActionModel): INavigationReducerState => {
    switch (action.type) {
        case SET_CURRENT_NAV_PARAMS:
            return {
                ...state,
                prevNavParams: {
                    title: state.currentNavParams.title,
                    meta: state.currentNavParams.meta,
                },
                currentNavParams: {
                    title: action.payload.title,
                    meta: action.payload.meta,
                }
            };
        default:
            return state;
    }
};

export default navigationReducer;

