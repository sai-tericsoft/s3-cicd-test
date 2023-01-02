import {ApiService} from "../index";
import {APIConfig} from "../../../constants";

const getUserList = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.USER_LIST.METHOD](APIConfig.USER_LIST.URL, payload);
}

const getUserListLite = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.USER_LIST_LITE.METHOD](APIConfig.USER_LIST_LITE.URL, payload);
}

const UserService = {
    getUserList,
    getUserListLite
}

export default UserService;
