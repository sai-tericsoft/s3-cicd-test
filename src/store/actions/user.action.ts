import {IUser} from "../../shared/models/user.model";

export const GET_ALL_PROVIDERS_LIST = 'GET_ALL_PROVIDERS_LIST';
export const SET_ALL_PROVIDERS_LIST = 'SET_ALL_PROVIDERS_LIST';


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