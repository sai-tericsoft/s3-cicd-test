import {IActionModel} from "../../shared/models/action.model";
import {
    LOGOUT,
    SET_LOGGED_IN_USER_TOKEN,
    SET_LOGGED_USER_DATA,
    SET_SYSTEM_LOCKED,
    UPDATE_LAST_ACTIVITY_TIME
} from "../actions/account.action";
import {CommonService} from "../../shared/services";
import {Misc} from "../../constants";
import Communications from "../../shared/services/communications.service";
import {ILoggedInUser} from "../../shared/models/account.model";
import moment from "moment";

export interface IAccountReducerState {
    systemLockReason?: 'auto' | 'manual' | null | string;
    isSystemLocked?: boolean;
    lastActivityTime?: number;
    currentUser?: ILoggedInUser;
    token?: string | null;
}

const INITIAL_STATE: IAccountReducerState = {
    isSystemLocked: CommonService._localStorage.getItem(Misc.IS_SYSTEM_LOCKED) === 'true',
    systemLockReason: CommonService._localStorage.getItem(Misc.SYSTEM_LOCK_REASON),
    currentUser: undefined,
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
        case UPDATE_LAST_ACTIVITY_TIME:
            return {
                ...state,
                lastActivityTime: moment().unix(),
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
                token: undefined,
                currentUser: undefined
            };
        case SET_SYSTEM_LOCKED:
            const systemLockedConfig = action.payload;
            CommonService._localStorage.setItem(Misc.IS_SYSTEM_LOCKED, systemLockedConfig.isLocked);
            CommonService._localStorage.setItem(Misc.SYSTEM_LOCK_REASON, systemLockedConfig.type);
            return {
                ...state,
                systemLockReason: systemLockedConfig.type,
                isSystemLocked: systemLockedConfig.isLocked,
            };
        default:
            return state;
    }
};

export default accountReducer;

