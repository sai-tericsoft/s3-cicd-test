import {
    GET_CONSULTATION_DURATION_LIST,
    GET_EMPLOYMENT_STATUS_LIST,
    GET_GENDER_LIST,
    GET_LANGUAGE_LIST,
    GET_PHONE_TYPE_LIST,
    GET_RELATIONSHIP_LIST,
    SET_CONSULTATION_DURATION_LIST,
    SET_EMPLOYMENT_STATUS_LIST,
    SET_GENDER_LIST,
    SET_LANGUAGE_LIST,
    SET_PHONE_TYPE_LIST,
    SET_RELATIONSHIP_LIST
} from "../actions/static-data.action";
import {IActionModel} from "../../shared/models/action.model";

export interface IStaticDataReducerState {
    isConsultationDurationListLoading: boolean,
    isConsultationDurationListLoaded: boolean,
    consultationDurationList: any[],
    isGenderListLoading: boolean,
    isGenderListLoaded: boolean,
    genderList: any[],
    isEmploymentStatusListLoading: boolean,
    isEmploymentStatusListLoaded: boolean,
    employmentStatusList: any[],
    isPhoneTypeListLoading: boolean,
    isPhoneTypeListLoaded: boolean,
    phoneTypeList: any[],
    isLanguageListLoading: boolean,
    isLanguageListLoaded: boolean,
    languageList: any[],
    isRelationshipListLoading: boolean,
    isRelationshipListLoaded: boolean,
    relationshipList: any[],
}


const initialData: IStaticDataReducerState = {
    isConsultationDurationListLoading: false,
    isConsultationDurationListLoaded: false,
    consultationDurationList: [],
    isGenderListLoading: false,
    isGenderListLoaded: false,
    genderList: [],
    isEmploymentStatusListLoading: false,
    isEmploymentStatusListLoaded: false,
    employmentStatusList: [],
    isPhoneTypeListLoading: false,
    isPhoneTypeListLoaded: false,
    phoneTypeList: [],
    isLanguageListLoading: false,
    isLanguageListLoaded: false,
    languageList: [],
    isRelationshipListLoading: false,
    isRelationshipListLoaded: false,
    relationshipList: [],
};

const StaticDataReducer = (state = initialData, action: IActionModel): IStaticDataReducerState => {
    switch (action.type) {
        case GET_CONSULTATION_DURATION_LIST:
            state = {
                ...state,
                isConsultationDurationListLoading: true,
                isConsultationDurationListLoaded: false,
            };
            return state;
        case SET_CONSULTATION_DURATION_LIST:
            state = {
                ...state,
                isConsultationDurationListLoading: false,
                isConsultationDurationListLoaded: true,
                consultationDurationList: action.payload.consultationDurationList
            };
            return state;
        case GET_GENDER_LIST:
            state = {
                ...state,
                isGenderListLoading: true,
                isGenderListLoaded: false,
            };
            return state;
        case SET_GENDER_LIST:
            state = {
                ...state,
                isGenderListLoading: false,
                isGenderListLoaded: true,
                genderList: action.payload.genderList
            };
            return state;
        case GET_LANGUAGE_LIST:
            state = {
                ...state,
                isLanguageListLoading: true,
                isLanguageListLoaded: false,
            };
            return state;
        case SET_LANGUAGE_LIST:
            state = {
                ...state,
                isLanguageListLoading: false,
                isLanguageListLoaded: true,
                languageList: action.payload.languageList
            };
            return state;
        case GET_EMPLOYMENT_STATUS_LIST:
            state = {
                ...state,
                isEmploymentStatusListLoading: true,
                isEmploymentStatusListLoaded: false,
            };
            return state;
        case SET_EMPLOYMENT_STATUS_LIST:
            state = {
                ...state,
                isEmploymentStatusListLoading: false,
                isEmploymentStatusListLoaded: true,
                employmentStatusList: action.payload.employmentStatusList
            };
            return state;
        case GET_PHONE_TYPE_LIST:
            state = {
                ...state,
                isPhoneTypeListLoading: true,
                isPhoneTypeListLoaded: false,
            };
            return state;
        case SET_PHONE_TYPE_LIST:
            state = {
                ...state,
                isPhoneTypeListLoading: false,
                isPhoneTypeListLoaded: true,
                phoneTypeList: action.payload.phoneTypeList
            };
            return state;
        case GET_RELATIONSHIP_LIST:
            state = {
                ...state,
                isRelationshipListLoading: true,
                isRelationshipListLoaded: false,
            };
            return state;
        case SET_RELATIONSHIP_LIST:
            state = {
                ...state,
                isRelationshipListLoading: false,
                isRelationshipListLoaded: true,
                relationshipList: action.payload.relationshipList
            };
            return state;
        default:
            return state;
    }
};

export default StaticDataReducer;
