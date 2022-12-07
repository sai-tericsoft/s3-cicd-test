import {IUser} from "../../shared/models/user.model";

export const GET_SERVICE_PROVIDER_LIST = 'GET_SERVICE_PROVIDER_LIST';
export const SET_SERVICE_PROVIDER_LIST = 'SET_SERVICE_PROVIDER_LIST';

export const getServiceProviderList = (serviceId: string) => {
    return {
        type: GET_SERVICE_PROVIDER_LIST, payload: {
            serviceId
        }
    };
};

export const setServiceProviderList = (serviceProviderList: IUser[] | undefined) => {
    return {
        type: SET_SERVICE_PROVIDER_LIST, payload: {
            serviceProviderList
        }
    };
};
