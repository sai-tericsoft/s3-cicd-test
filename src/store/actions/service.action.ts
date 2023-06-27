import {IUser} from "../../shared/models/user.model";

export const GET_SERVICE_PROVIDER_LIST = 'GET_SERVICE_PROVIDER_LIST';
export const SET_SERVICE_PROVIDER_LIST = 'SET_SERVICE_PROVIDER_LIST';
export const GET_ALL_SERVICE_LIST = 'GET_ALL_SERVICE_LIST';
export const SET_ALL_SERVICE_LIST = 'SET_ALL_SERVICE_LIST';

export const GET_SERVICE_LIST_LITE = 'GET_SERVICE_LIST_LITE';
export const SET_SERVICE_LIST_LITE = 'SET_SERVICE_LIST_LITE';


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

export const getAllServiceList = () => {
    return {
        type: GET_ALL_SERVICE_LIST
    };
}
export const setAllServiceList = (allServiceList: any) => {
    return {
        type: SET_ALL_SERVICE_LIST, payload: {
            allServiceList
        }
    };
}

export const getAllServiceListLite = () => {
    return {
        type: GET_SERVICE_LIST_LITE
    };
}
export const setAllServiceListLite = (serviceListLite: any) => {
    console.log(serviceListLite);
    return {
        type: SET_SERVICE_LIST_LITE, payload: {
            serviceListLite
        }
    };
}
