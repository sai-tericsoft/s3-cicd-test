import {IUser} from "../../shared/models/user.model";

export const GET_ALL_PROVIDERS_LIST = 'GET_ALL_PROVIDERS_LIST';
export const SET_ALL_PROVIDERS_LIST = 'SET_ALL_PROVIDERS_LIST';

export const GET_USER_BASIC_DETAILS = 'GET_USER_BASIC_DETAILS';
export const SET_USER_BASIC_DETAILS = 'SET_USER_BASIC_DETAILS';

export const getAllProvidersList = () => {
    return {type: GET_ALL_PROVIDERS_LIST};
};

export const setAllProvidersList = (allProvidersList: IUser[]) => {
    return {
        type: SET_ALL_PROVIDERS_LIST, payload: {
            allProvidersList
        }
    };
};

export const getUserBasicDetails = (userId: string) => {
    return {
        type: GET_USER_BASIC_DETAILS, payload: {
            userId
        }
    };
};

export const setUserBasicDetails = (userBasicDetails: any) => {
    console.log(userBasicDetails);
    return {
        type: SET_USER_BASIC_DETAILS, payload: {
            userBasicDetails
        }
    };
};