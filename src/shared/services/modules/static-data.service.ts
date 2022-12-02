import {ApiService} from "../index";
import {APIConfig} from "../../../constants";

const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const yesNoOptions = ["Yes", "No"];

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

const StaticDataService = {
    weekDays,
    yesNoOptions,
    getConsultationDurationList,
    getGenderList,
    getPhoneTypeList,
    getEmployeeStatusList,
    getLanguageList,
    getRelationshipStatusList,
    getMedicalHistoryOptionsList,
    getSurgicalHistoryOptionsList
}

export default StaticDataService;
