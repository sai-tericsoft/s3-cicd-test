export const GET_APPOINTMENT_LIST_LITE = 'GET_APPOINTMENT_LIST_LITE';
export const SET_APPOINTMENT_LIST_LITE = 'SET_APPOINTMENT_LIST_LITE';

export const GET_APPOINTMENT_SETTINGS = 'GET_APPOINTMENT_SETTINGS';
export const SET_APPOINTMENT_SETTINGS = 'SET_APPOINTMENT_SETTINGS';

export const getAppointmentListLite = (payload: any) => {
    console.log(payload);
    return {
        type: GET_APPOINTMENT_LIST_LITE, payload: payload
    };
};

export const setAppointmentListLite = (payload: any) => {
    return {
        type: SET_APPOINTMENT_LIST_LITE, payload: {
            appointmentListLite: payload
        }
    };
};

export const getAppointmentSettings = () => {
    return {
        type: GET_APPOINTMENT_SETTINGS
    };
};

export const setAppointmentSettings = (appointmentSettings: any) => {
    return {
        type: SET_APPOINTMENT_SETTINGS, payload: {
            appointmentSettings
        }
    };
};

