import {IActionModel} from "../../shared/models/action.model";
import {
    LOGOUT, SET_LOGGED_IN_USER_TOKEN, SET_LOGGED_USER_DATA
} from "../actions/account.action";
import {CommonService} from "../../shared/services";
import {Misc} from "../../constants";
import Communications from "../../shared/services/communications.service";

export interface IAccountReducerState {
    currentUser: any;
    token: string | null;
}

const INITIAL_STATE: IAccountReducerState = {
    currentUser: CommonService._localStorage.getItem(Misc.LOCAL_STORAGE_LOGGED_IN_USER_DATA),
    token: CommonService._localStorage.getItem(Misc.LOCAL_STORAGE_JWT_TOKEN)
};

const accountReducer = (state: IAccountReducerState = INITIAL_STATE, action: IActionModel): IAccountReducerState => {
    switch (action.type) {
        case SET_LOGGED_USER_DATA:
            const loggedInUser = action.payload;
            CommonService._localStorage.setItem(Misc.LOCAL_STORAGE_LOGGED_IN_USER_DATA, loggedInUser);
            return {
                ...state,
                currentUser: loggedInUser,
            };
        case SET_LOGGED_IN_USER_TOKEN:
            const token = action.payload;
            CommonService._localStorage.setItem(Misc.LOCAL_STORAGE_JWT_TOKEN, token);
            Communications.updateLoginUserTokenSubject.next(token);
            return {
                ...state,
                token: token,
            };
        case LOGOUT:
            CommonService._localStorage.removeItem(Misc.LOCAL_STORAGE_LOGGED_IN_USER_DATA);
            CommonService._localStorage.removeItem(Misc.LOCAL_STORAGE_JWT_TOKEN);
            Communications.updateLoginUserTokenSubject.next('');
            return {
                ...state,
                token: null,
                currentUser: null
            };
        default:
            return state;
    }
};

export default accountReducer;

