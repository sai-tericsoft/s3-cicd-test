import {ApiService} from "../index";
import {APIConfig} from "../../../constants";

const LoginAPICall = (payload: any)  => {
    // @ts-ignore
    return ApiService[APIConfig.LOGIN.METHOD](APIConfig.LOGIN.URL, payload);
}

const CheckLoginAPICall = (token: string) => {
    // @ts-ignore
    return ApiService[APIConfig.CHECK_LOGIN.METHOD](APIConfig.CHECK_LOGIN.URL, {}, {Authorization: "Bearer " + token});
}

const LogoutAPICall = () => {
    // @ts-ignore
    return ApiService[APIConfig.LOGOUT.METHOD](APIConfig.LOGOUT.URL);
}

const AccountService = {
    LoginAPICall,
    CheckLoginAPICall,
    LogoutAPICall
}

export default AccountService;
