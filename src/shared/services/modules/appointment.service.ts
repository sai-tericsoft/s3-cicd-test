import {ApiService} from "../index";
import {APIConfig} from "../../../constants";

const getAppointmentList = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.APPOINTMENT_LIST.METHOD](APIConfig.APPOINTMENT_LIST.URL, payload);
}
const getAppointmentCalendarList = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.APPOINTMENT_CALENDAR_LIST.METHOD](APIConfig.APPOINTMENT_CALENDAR_LIST.URL, payload);
}

const getAppointment = (appointmentId: any) => {
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

const getAppointmentListLite = (payload: any) => {
    // @ts-ignore
    console.log(payload);
    return ApiService[APIConfig.APPOINTMENT_LIST_LITE.METHOD](APIConfig.APPOINTMENT_LIST_LITE.URL, payload);
}

const getAppointmentSetting = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.GET_APPOINTMENT_SETTINGS.METHOD](APIConfig.GET_APPOINTMENT_SETTINGS.URL, payload);
}

const setAppointmentSetting = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.SET_APPOINTMENT_SETTINGS.METHOD](APIConfig.SET_APPOINTMENT_SETTINGS.URL, payload);
}

const getAvailableCouponList = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.GET_AVAILABLE_COUPONS_LIST.METHOD](APIConfig.GET_AVAILABLE_COUPONS_LIST.URL, payload);
}

const checkAppointmentExistsToBlock = (providerId: any, payload: any) => {
    return ApiService[APIConfig.CHECK_SLOTS_EXISTS_TO_BLOCK.METHOD](APIConfig.CHECK_SLOTS_EXISTS_TO_BLOCK.URL(providerId), payload);
}

const BlockCalender = (providerId: any, payload: any) => {
    return ApiService[APIConfig.BLOCK_SLOTS.METHOD](APIConfig.BLOCK_SLOTS.URL(providerId), payload);
}

const AppointmentService = {
    addAppointment,
    appointmentPayment,
    appointmentCancel,
    appointmentReschedule,
    getAppointmentCalendarList,
    getAppointmentList,
    getAppointment,
    appointmentCheckin,
    appointmentStart,
    appointmentStop,
    appointmentNoShow,
    getAppointmentFormStatus,
    getAppointmentListLite,
    getAppointmentSetting,
    setAppointmentSetting,
    getAvailableCouponList,
    checkAppointmentExistsToBlock,
    BlockCalender
}

export default AppointmentService;
