import { ILoggedInUser } from "../../shared/models/account.model";

export const SET_LOGGED_USER_DATA = "SET_LOGGED_USER_DATA";
export const SET_LOGGED_IN_USER_TOKEN = "SET_LOGGED_IN_USER_TOKEN";
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

export const logout = () => {
    return {
        type: LOGOUT,
    }
};
