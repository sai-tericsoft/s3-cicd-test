import {ApiService} from "../index";
import {APIConfig} from "../../../constants";

const LoginAPICall = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.LOGIN.METHOD](APIConfig.LOGIN.URL, payload);
}

const ResumeSessionAPICall = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.VERIFY_PASSWORD.METHOD](APIConfig.VERIFY_PASSWORD.URL, payload);
}

const CheckLoginAPICall = (token: string) => {
    // @ts-ignore
    return ApiService[APIConfig.CHECK_LOGIN.METHOD](APIConfig.CHECK_LOGIN.URL, {}, {Authorization: "Bearer " + token});
}

const LogoutAPICall = () => {
    // @ts-ignore
    return ApiService[APIConfig.LOGOUT.METHOD](APIConfig.LOGOUT.URL);
}
const SendForgotPasswordMail = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.SEND_FORGOT_PASSWORD_MAIL.METHOD](APIConfig.SEND_FORGOT_PASSWORD_MAIL.URL, payload);
}
const SendVerificationOtp = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.SEND_VERIFICATION_OTP.METHOD](APIConfig.SEND_VERIFICATION_OTP.URL, payload);
}
const SetNewPassword = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.UPDATE_PASSWORD.METHOD](APIConfig.UPDATE_PASSWORD.URL, payload);
}

const AccountService = {
    LoginAPICall,
    CheckLoginAPICall,
    LogoutAPICall,
    ResumeSessionAPICall,
    SendForgotPasswordMail,
    SendVerificationOtp,
    SetNewPassword,
}

export default AccountService;
