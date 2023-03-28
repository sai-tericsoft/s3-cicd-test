export const GET_APPOINTMENT_LIST_LITE = 'GET_APPOINTMENT_LIST_LITE';
export const SET_APPOINTMENT_LIST_LITE = 'SET_APPOINTMENT_LIST_LITE';

export const getAppointmentListLite = (payload: any) => {
    console.log(payload);
    return {
        type: GET_APPOINTMENT_LIST_LITE, payload: payload
    };
};

export const setAppointmentListLite = (payload: any) => {
    console.log(payload);
    return {
        type: SET_APPOINTMENT_LIST_LITE, payload: payload
    };
};
