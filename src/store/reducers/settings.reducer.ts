import {IActionModel} from "../../shared/models/action.model";
import {ISystemSettingsConfig} from "../../shared/models/account.model";
import {GET_SYSTEM_SETTINGS, SET_SYSTEM_SETTINGS} from "../actions/settings.action";

export interface ISettingsReducerState {
    isSystemSettingsLoading: boolean,
    isSystemSettingsLoaded: boolean,
    systemSettings?: ISystemSettingsConfig,
}

const INITIAL_STATE: ISettingsReducerState = {
    isSystemSettingsLoading: false,
    isSystemSettingsLoaded: false,
    systemSettings: undefined,
};

const settingsReducer = (state: ISettingsReducerState = INITIAL_STATE, action: IActionModel): ISettingsReducerState => {
    switch (action.type) {
        case GET_SYSTEM_SETTINGS:
            state = {
                ...state,
                isSystemSettingsLoading: true,
                isSystemSettingsLoaded: false,
            };
            return state;
        case SET_SYSTEM_SETTINGS:
            state = {
                ...state,
                isSystemSettingsLoading: false,
                isSystemSettingsLoaded: true,
                systemSettings: action.payload.systemSettings
            };
            return state;
        default:
            return state;
    }
};

export default settingsReducer;

