import {ApiService} from "../index";
import {APIConfig} from "../../../constants";

const SaveSystemSettingsAPICall = (payload: any)  => {
    // @ts-ignore
    return ApiService[APIConfig.SAVE_SYSTEM_SETTINGS.METHOD](APIConfig.SAVE_SYSTEM_SETTINGS.URL, payload);
}

const GetSystemSettingsAPICall = (payload: any)  => {
    // @ts-ignore
    return ApiService[APIConfig.GET_SYSTEM_SETTINGS.METHOD](APIConfig.GET_SYSTEM_SETTINGS.URL, payload);
}

const NewMessageAPICall  = (payload:any)=>{
    // @ts-ignore
    return ApiService[APIConfig.SYSTEM_SETTING_NEW_MESSAGE.METHOD](APIConfig.SYSTEM_SETTING_NEW_MESSAGE.URL, payload);


}

const SystemSettingsService = {
    SaveSystemSettingsAPICall,
    GetSystemSettingsAPICall,
    NewMessageAPICall
}

export default SystemSettingsService;
