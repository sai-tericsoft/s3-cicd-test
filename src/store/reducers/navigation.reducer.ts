import {IActionModel} from "../../shared/models/action.model";
import {SET_CURRENT_NAV_PARAMS, SET_SIDE_MENU_VIEW} from "../actions/navigation.action";

export interface INavigationReducerState {
    sideMenuView: "compact" | "default";
    canNavigateBack?: boolean;
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
    sideMenuView: "default",
    canNavigateBack: false,
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
                canNavigateBack: action.payload.canNavigateBack,
                prevNavParams: {
                    title: state.currentNavParams.title,
                    meta: state.currentNavParams.meta,
                },
                currentNavParams: {
                    title: action.payload.title,
                    meta: action.payload.meta,
                }
            };
        case SET_SIDE_MENU_VIEW:
            return {
                ...state,
                sideMenuView: action.payload.sideMenuView
            };
        default:
            return state;
    }
};

export default navigationReducer;

