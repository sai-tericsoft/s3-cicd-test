import {ISystemSettingsConfig} from "../../shared/models/account.model";

export const GET_SYSTEM_SETTINGS = 'GET_SYSTEM_SETTINGS';
export const SET_SYSTEM_SETTINGS = 'SET_SYSTEM_SETTINGS';

export const getSystemSettings = () => {
    return {type: GET_SYSTEM_SETTINGS};
};

export const setSystemSettings = (systemSettings?: ISystemSettingsConfig) => {
    return {
        type: SET_SYSTEM_SETTINGS, payload: {
            systemSettings
        }
    };
};

