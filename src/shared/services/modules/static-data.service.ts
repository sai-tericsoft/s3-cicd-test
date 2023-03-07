import {ApiService} from "../index";
import {APIConfig} from "../../../constants";
import moment from "moment";

const today = moment();
const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const yesNoOptions = [{
    title: "Yes",
    code: true
}, {
    title: "No",
    code: false
}];

const resultOptions = [{
    title: "Positive",
    code: "Positive"
}, {
    title: "Negative",
    code: "Negative"
}];

const unitsOfCare = [{
    title: "1",
    code: "1"
}, {
    title: "2",
    code: "2"
}, {
    title: "3",
    code: "3"
}, {
    title: "4",
    code: "4"
}, {
    title: "5",
    code: "5"
}, {
    title: "6",
    code: "6"
}, {
    title: "7",
    code: "7"
}, {
    title: "8",
    code: "8"
}
];

const getConsultationDurationList = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CONSULTATION_DURATION_LIST.METHOD](APIConfig.CONSULTATION_DURATION_LIST.URL, payload);
}

const getGenderList = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.GENDER_LIST.METHOD](APIConfig.GENDER_LIST.URL, payload);
}

const getPhoneTypeList = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.PHONE_TYPE_LIST.METHOD](APIConfig.PHONE_TYPE_LIST.URL, payload);
}

const getLanguageList = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.LANGUAGE_LIST.METHOD](APIConfig.LANGUAGE_LIST.URL, payload);
}

const getEmployeeStatusList = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.EMPLOYMENT_STATUS_LIST.METHOD](APIConfig.EMPLOYMENT_STATUS_LIST.URL, payload);
}

const getRelationshipStatusList = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.RELATIONSHIP_LIST.METHOD](APIConfig.RELATIONSHIP_LIST.URL, payload);
}

const getMedicalHistoryOptionsList = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.MEDICAL_HISTORY_OPTIONS_LIST.METHOD](APIConfig.MEDICAL_HISTORY_OPTIONS_LIST.URL, payload);
}

const getSurgicalHistoryOptionsList = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.SURGICAL_HISTORY_OPTIONS_LIST.METHOD](APIConfig.SURGICAL_HISTORY_OPTIONS_LIST.URL, payload);
}

const getMusculoskeletalHistoryOptionsList = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.MUSCULOSKELETAL_HISTORY_OPTIONS_LIST.METHOD](APIConfig.MUSCULOSKELETAL_HISTORY_OPTIONS_LIST.URL, payload);
}

const getSocialMediaPlatformList = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.SOCIAL_MEDIA_PLATFORM_LIST.METHOD](APIConfig.SOCIAL_MEDIA_PLATFORM_LIST.URL, payload);
}

const getReferralTypeList = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.REFERRAL_TYPE_LIST.METHOD](APIConfig.REFERRAL_TYPE_LIST.URL, payload);
}

const getCommunicationModeTypeList = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.COMMUNICATION_MODE_TYPE_LIST.METHOD](APIConfig.COMMUNICATION_MODE_TYPE_LIST.URL, payload);
}

const getBodyPartList = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.BODY_PART_LIST.METHOD](APIConfig.BODY_PART_LIST.URL, payload);
}

const getInjuryTypeList = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.INJURY_TYPE_LIST.METHOD](APIConfig.INJURY_TYPE_LIST.URL, payload);
}

const getCaseStatusList = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CASE_STATUS_LIST.METHOD](APIConfig.CASE_STATUS_LIST.URL, payload)
}

const getProgressReportStatList = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.PROGRESS_REPORT_STATS_LIST.METHOD](APIConfig.PROGRESS_REPORT_STATS_LIST.URL, payload)
}

const get8MinuteRuleChartData = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CLIENT_EIGHT_MINUTES_RULE_CHART.METHOD](APIConfig.CLIENT_EIGHT_MINUTES_RULE_CHART.URL, payload)
}

const getConcussionFileTypes = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CONCUSSION_FILE_TYPES.METHOD](APIConfig.CONCUSSION_FILE_TYPES.URL, payload)
}

const getMedicalRecordDocumentTypes = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.MEDICAL_RECORD_DOCUMENT_TYPES.METHOD](APIConfig.MEDICAL_RECORD_DOCUMENT_TYPES.URL, payload)
}


const getAppointmentTypes = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.APPOINTMENT_TYPES.METHOD](APIConfig.APPOINTMENT_TYPES.URL, payload)
}

const getAppointmentStatus = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.APPOINTMENT_STATUS.METHOD](APIConfig.APPOINTMENT_STATUS.URL, payload)
}

const getPaymentModes = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.PAYMENT_MODES.METHOD](APIConfig.PAYMENT_MODES.URL, payload)
}

const getSystemAutoLockDurationOptionsList = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.GET_SYSTEM_AUTO_LOCK_DURATION_OPTIONS_LIST.METHOD](APIConfig.GET_SYSTEM_AUTO_LOCK_DURATION_OPTIONS_LIST.URL, payload)
}

const getFilesUneditableAfterOptionsList = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.GET_FILES_UNEDITABLE_AFTER_OPTIONS_LIST.METHOD](APIConfig.GET_FILES_UNEDITABLE_AFTER_OPTIONS_LIST.URL, payload)
}

const StaticDataService = {
    today,
    weekDays,
    yesNoOptions,
    resultOptions,
    unitsOfCare,
    getConsultationDurationList,
    getGenderList,
    getPhoneTypeList,
    getEmployeeStatusList,
    getLanguageList,
    getRelationshipStatusList,
    getMedicalHistoryOptionsList,
    getSurgicalHistoryOptionsList,
    getMusculoskeletalHistoryOptionsList,
    getSocialMediaPlatformList,
    getReferralTypeList,
    getCommunicationModeTypeList,
    getBodyPartList,
    getInjuryTypeList,
    getCaseStatusList,
    getProgressReportStatList,
    get8MinuteRuleChartData,
    getConcussionFileTypes,
    getMedicalRecordDocumentTypes,

    getPaymentModes,
    getAppointmentStatus,
    getAppointmentTypes,
    getSystemAutoLockDurationOptionsList,
    getFilesUneditableAfterOptionsList
}

export default StaticDataService;
