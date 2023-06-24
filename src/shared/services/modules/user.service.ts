import {ApiService} from "../index";
import {APIConfig} from "../../../constants";

const getUserList = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.USER_LIST.METHOD](APIConfig.USER_LIST.URL, payload);
}

const getUserAdd = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.USER_ADD.METHOD](APIConfig.USER_ADD.URL, payload);
}


const getUserListLite = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.USER_LIST_LITE.METHOD](APIConfig.USER_LIST_LITE.URL, payload);
}

const getUserAvailableDatesList = (providerId: string) => {
    // @ts-ignore
    return ApiService[APIConfig.USER_AVAILABLE_DATES_LIST.METHOD](APIConfig.USER_AVAILABLE_DATES_LIST.URL(providerId));
}

const getUserAvailableTimesList = (providerId: string, date: string) => {
    // @ts-ignore
    return ApiService[APIConfig.USER_AVAILABLE_TIMES_LIST.METHOD](APIConfig.USER_AVAILABLE_TIMES_LIST.URL(providerId, date));
}

const getUserBasicDetails = (userId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.USER_DETAILS.METHOD](APIConfig.USER_DETAILS.URL(clientId), payload);
}

const UserService = {
    getUserList,
    getUserListLite,
    getUserAvailableDatesList,
    getUserAvailableTimesList,
    getUserAdd,
    getUserBasicDetails
}

export default UserService;
