import {
    GET_APPOINTMENT_LIST_LITE,
    GET_APPOINTMENT_SETTINGS,
    SET_APPOINTMENT_LIST_LITE,
    SET_APPOINTMENT_SETTINGS
} from "../actions/appointment.action";


export interface IAppointmentReducerState {
    isAppointmentListLiteLoading: boolean,
    isAppointmentListLiteLoaded: boolean,
    isAppointmentListLiteLoadingFailed: boolean,
    appointmentListLite: any

    isAppointmentSettingsLoading: boolean,
    isAppointmentSettingsLoaded: boolean,
    appointmentSettings: any
}

const initialData: IAppointmentReducerState = {
    isAppointmentListLiteLoading: false,
    isAppointmentListLiteLoaded: false,
    isAppointmentListLiteLoadingFailed: false,
    appointmentListLite: undefined,

    isAppointmentSettingsLoading: false,
    isAppointmentSettingsLoaded: false,
    appointmentSettings: undefined
}

const appointmentReducer = (state: IAppointmentReducerState = initialData, action: any) => {
    switch (action.type) {
        case GET_APPOINTMENT_LIST_LITE :
            state = {
                ...state,
                isAppointmentListLiteLoading: true,
                isAppointmentListLiteLoaded: false,
                isAppointmentListLiteLoadingFailed: false,
            };
            return state;
        case SET_APPOINTMENT_LIST_LITE:
            console.log(action.payload);
            state = {
                ...state,
                isAppointmentListLiteLoading: false,
                isAppointmentListLiteLoaded: !!action.payload.appointmentListLite,
                isAppointmentListLiteLoadingFailed: !action.payload.appointmentListLite,
                appointmentListLite: action.payload.appointmentListLite
            }
            return state;
        case GET_APPOINTMENT_SETTINGS:
            state = {
                ...state,
                isAppointmentSettingsLoading: true,
                isAppointmentSettingsLoaded: false,
            };
            return state;
        case SET_APPOINTMENT_SETTINGS:
            state = {
                ...state,
                isAppointmentSettingsLoading: false,
                isAppointmentSettingsLoaded: true,
                appointmentSettings: action.payload.appointmentSettings
            }
            return state;
        default:
            return state;
    }
}

export default appointmentReducer
