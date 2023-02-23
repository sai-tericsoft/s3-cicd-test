import {ILoggedInUser} from "../../shared/models/account.model";

export const SET_LOGGED_USER_DATA = "SET_LOGGED_USER_DATA";
export const UPDATE_LAST_ACTIVITY_TIME = "UPDATE_LAST_ACTIVITY_TIME";
export const SET_LOGGED_IN_USER_TOKEN = "SET_LOGGED_IN_USER_TOKEN";
export const SET_SYSTEM_LOCKED = "SET_SYSTEM_LOCKED";
export const LOGOUT = "LOGOUT";

export const setLoggedInUserData = (userData: ILoggedInUser) => {
    return {
        type: SET_LOGGED_USER_DATA,
        payload: userData
    }
};

export const setLoggedInUserToken = (token: string) => {
    return {
        type: SET_LOGGED_IN_USER_TOKEN,
        payload: token
    }
};

export const setSystemLocked = (isLocked: boolean, type:'auto' | 'manual' | undefined ) => {
    return {
        type: SET_SYSTEM_LOCKED,
        payload: {isLocked, type}
    }
};

export const updateLastActivityTime = () => {
    return {
        type: UPDATE_LAST_ACTIVITY_TIME
    }
};


export const logout = () => {
    return {
        type: LOGOUT,
    }
};
