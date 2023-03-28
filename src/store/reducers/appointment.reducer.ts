import {GET_APPOINTMENT_LIST_LITE, SET_APPOINTMENT_LIST_LITE} from "../actions/appointment.action";


export interface IAppointmentReducerState {
    isAppointmentListLiteLoading: boolean,
    isAppointmentListLiteLoaded: boolean,
    isAppointmentListLiteLoadingFailed: boolean,
    appointmentListLite: any
}

const initialData: IAppointmentReducerState = {
    isAppointmentListLiteLoading: false,
    isAppointmentListLiteLoaded: false,
    isAppointmentListLiteLoadingFailed: false,
    appointmentListLite: undefined
}

const appointmentReducer = (state: IAppointmentReducerState = initialData, action: any) => {
    console.log(action);
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
            state = {
                ...state,
                isAppointmentListLiteLoading: false,
                isAppointmentListLiteLoaded: !!action.payload.appointmentListLite,
                isAppointmentListLiteLoadingFailed: !action.payload.appointmentListLite,
                appointmentListLite: action.payload.appointmentListLite
            }
            return state;
        default:
            return state;
    }
}

export default appointmentReducer
