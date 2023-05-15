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

const SystemSettingsService = {
    SaveSystemSettingsAPICall,
    GetSystemSettingsAPICall
}

export default SystemSettingsService;
