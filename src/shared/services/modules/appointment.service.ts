import {ApiService} from "../index";
import {APIConfig} from "../../../constants";

const getAppointmentList = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.APPOINTMENT_LIST.METHOD](APIConfig.APPOINTMENT_LIST.URL, payload);
}

const getAppointment = (appointmentId: string) => {
    // @ts-ignore
    return ApiService[APIConfig.APPOINTMENT_VIEW.METHOD](APIConfig.APPOINTMENT_VIEW.URL(appointmentId));
}
const addAppointment = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.APPOINTMENT_ADD.METHOD](APIConfig.APPOINTMENT_ADD.URL, payload);
}
const appointmentPayment = (appointmentId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.APPOINTMENT_PAYMENT.METHOD](APIConfig.APPOINTMENT_PAYMENT.URL(appointmentId), payload);
}
const appointmentReschedule = (appointmentId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.APPOINTMENT_RESCHEDULE.METHOD](APIConfig.APPOINTMENT_RESCHEDULE.URL(appointmentId), payload);
}
const appointmentCancel = (appointmentId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.APPOINTMENT_CANCEL.METHOD](APIConfig.APPOINTMENT_CANCEL.URL(appointmentId), payload);
}

const AppointmentService = {
    addAppointment,
    appointmentPayment,
    appointmentCancel,
    appointmentReschedule,
    getAppointmentList,
    getAppointment
}

export default AppointmentService;
