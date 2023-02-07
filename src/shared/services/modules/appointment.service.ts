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
const appointmentCheckin = (appointmentId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.APPOINTMENT_CHECKIN.METHOD](APIConfig.APPOINTMENT_CHECKIN.URL(appointmentId), payload);
}
const appointmentNoShow = (appointmentId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.APPOINTMENT_NOSHOW.METHOD](APIConfig.APPOINTMENT_NOSHOW.URL(appointmentId), payload);
}
const appointmentStart = (appointmentId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.APPOINTMENT_START.METHOD](APIConfig.APPOINTMENT_START.URL(appointmentId), payload);
}
const appointmentStop = (appointmentId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.APPOINTMENT_STOP.METHOD](APIConfig.APPOINTMENT_STOP.URL(appointmentId), payload);
}
const getAppointmentFormStatus = (appointmentId: string) => {
    // @ts-ignore
    return ApiService[APIConfig.APPOINTMENT_FORM_STATUS.METHOD](APIConfig.APPOINTMENT_FORM_STATUS.URL(appointmentId));
}

const AppointmentService = {
    addAppointment,
    appointmentPayment,
    appointmentCancel,
    appointmentReschedule,
    getAppointmentList,
    getAppointment,
    appointmentCheckin,
    appointmentStart,
    appointmentStop,
    appointmentNoShow,
    getAppointmentFormStatus
}

export default AppointmentService;