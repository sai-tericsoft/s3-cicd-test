import {
    GET_BODY_PART_LIST,
    GET_COMMUNICATION_MODE_TYPE_LIST,
    GET_CONSULTATION_DURATION_LIST,
    GET_EMPLOYMENT_STATUS_LIST,
    GET_GENDER_LIST,
    GET_INJURY_TYPE_LIST,
    GET_LANGUAGE_LIST,
    GET_MEDICAL_HISTORY_OPTIONS_LIST,
    GET_MUSCULOSKELETAL_HISTORY_OPTIONS_LIST,
    GET_PHONE_TYPE_LIST,
    GET_REFERRAL_TYPE_LIST,
    GET_RELATIONSHIP_LIST,
    GET_SOCIAL_MEDIA_PLATFORM_LIST,
    GET_SURGICAL_HISTORY_OPTIONS_LIST,
    SET_BODY_PART_LIST,
    SET_COMMUNICATION_MODE_TYPE_LIST,
    SET_CONSULTATION_DURATION_LIST,
    SET_EMPLOYMENT_STATUS_LIST,
    SET_GENDER_LIST,
    SET_INJURY_TYPE_LIST,
    SET_LANGUAGE_LIST,
    SET_MEDICAL_HISTORY_OPTIONS_LIST,
    SET_MUSCULOSKELETAL_HISTORY_OPTIONS_LIST,
    SET_PHONE_TYPE_LIST,
    SET_REFERRAL_TYPE_LIST,
    SET_RELATIONSHIP_LIST,
    SET_SOCIAL_MEDIA_PLATFORM_LIST,
    SET_SURGICAL_HISTORY_OPTIONS_LIST
} from "../actions/static-data.action";
import {IActionModel} from "../../shared/models/action.model";
import {ICommonType} from "../../shared/models/static-data.model";

export interface IStaticDataReducerState {
    statusList: ICommonType[],
    medicalStatusList: ICommonType[],
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
    isMedicalHistoryOptionsListLoading: boolean,
    isMedicalHistoryOptionsListLoaded: boolean,
    medicalHistoryOptionsList: any[],
    isSurgicalHistoryOptionsListLoading: boolean,
    isSurgicalHistoryOptionsListLoaded: boolean,
    surgicalHistoryOptionsList: any[],
    isMusculoskeletalHistoryOptionsListLoading: boolean,
    isMusculoskeletalHistoryOptionsListLoaded: boolean,
    musculoskeletalHistoryOptionsList: any[],
    isSocialMediaPlatformListLoading: boolean,
    isSocialMediaPlatformListLoaded: boolean,
    socialMediaPlatformList: any[],
    isReferralTypeListLoading: boolean,
    isReferralTypeListLoaded: boolean,
    referralTypeList: any[],
    isCommunicationModeTypeListLoading: boolean,
    isCommunicationModeTypeListLoaded: boolean,
    communicationModeTypeList: any[],
    isBodyPartListLoading: boolean,
    isBodyPartListLoaded: boolean,
    bodyPartList: any[],
    isInjuryTypeListLoading: boolean,
    isInjuryTypeListLoaded: boolean,
    injuryTypeList: any[],
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
    isMedicalHistoryOptionsListLoading: false,
    isMedicalHistoryOptionsListLoaded: false,
    medicalHistoryOptionsList: [],
    isSurgicalHistoryOptionsListLoading: false,
    isSurgicalHistoryOptionsListLoaded: false,
    surgicalHistoryOptionsList: [],
    isMusculoskeletalHistoryOptionsListLoading: false,
    isMusculoskeletalHistoryOptionsListLoaded: false,
    musculoskeletalHistoryOptionsList: [],
    isSocialMediaPlatformListLoading: false,
    isSocialMediaPlatformListLoaded: false,
    socialMediaPlatformList: [],
    isReferralTypeListLoading: false,
    isReferralTypeListLoaded: false,
    referralTypeList: [],
    isCommunicationModeTypeListLoading: false,
    isCommunicationModeTypeListLoaded: false,
    communicationModeTypeList: [],
    isBodyPartListLoading: false,
    isBodyPartListLoaded: false,
    bodyPartList: [],
    isInjuryTypeListLoading: false,
    isInjuryTypeListLoaded: false,
    injuryTypeList: [],
    statusList: [
        {
            code: true,
            title: "Active"
        },
        {
            code: false,
            title: "Inactive"
        }
    ],
    medicalStatusList: [
        {
            code: 'open',
            title: "Open/Active"
        },
        {
            code: 'closed',
            title: "Closed/Inactive"
        }
        ],
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
        case GET_MEDICAL_HISTORY_OPTIONS_LIST:
            state = {
                ...state,
                isMedicalHistoryOptionsListLoading: true,
                isMedicalHistoryOptionsListLoaded: false,
            };
            return state;
        case SET_MEDICAL_HISTORY_OPTIONS_LIST:
            state = {
                ...state,
                isMedicalHistoryOptionsListLoading: false,
                isMedicalHistoryOptionsListLoaded: true,
                medicalHistoryOptionsList: action.payload.medicalHistoryOptionsList
            };
            return state;
        case GET_SURGICAL_HISTORY_OPTIONS_LIST:
            state = {
                ...state,
                isSurgicalHistoryOptionsListLoading: true,
                isSurgicalHistoryOptionsListLoaded: false,
            };
            return state;
        case SET_SURGICAL_HISTORY_OPTIONS_LIST:
            state = {
                ...state,
                isSurgicalHistoryOptionsListLoading: false,
                isSurgicalHistoryOptionsListLoaded: true,
                surgicalHistoryOptionsList: action.payload.surgicalHistoryOptionsList
            };
            return state;
        case GET_MUSCULOSKELETAL_HISTORY_OPTIONS_LIST:
            state = {
                ...state,
                isMusculoskeletalHistoryOptionsListLoading: true,
                isMusculoskeletalHistoryOptionsListLoaded: false,
            };
            return state;
        case SET_MUSCULOSKELETAL_HISTORY_OPTIONS_LIST:
            state = {
                ...state,
                isMusculoskeletalHistoryOptionsListLoading: false,
                isMusculoskeletalHistoryOptionsListLoaded: true,
                musculoskeletalHistoryOptionsList: action.payload.musculoskeletalHistoryOptionsList
            };
            return state;
        case GET_SOCIAL_MEDIA_PLATFORM_LIST:
            state = {
                ...state,
                isSocialMediaPlatformListLoading: true,
                isSocialMediaPlatformListLoaded: false,
            };
            return state;
        case SET_SOCIAL_MEDIA_PLATFORM_LIST:
            state = {
                ...state,
                isSocialMediaPlatformListLoading: false,
                isSocialMediaPlatformListLoaded: true,
                socialMediaPlatformList: action.payload.socialMediaPlatformList
            };
            return state;
        case GET_REFERRAL_TYPE_LIST:
            state = {
                ...state,
                isReferralTypeListLoading: true,
                isReferralTypeListLoaded: false,
            };
            return state;
        case SET_REFERRAL_TYPE_LIST:
            state = {
                ...state,
                isReferralTypeListLoading: false,
                isReferralTypeListLoaded: true,
                referralTypeList: action.payload.referralTypeList
            };
            return state;
        case GET_COMMUNICATION_MODE_TYPE_LIST:
            state = {
                ...state,
                isCommunicationModeTypeListLoading: true,
                isCommunicationModeTypeListLoaded: false,
            };
            return state;
        case SET_COMMUNICATION_MODE_TYPE_LIST:
            state = {
                ...state,
                isCommunicationModeTypeListLoading: false,
                isCommunicationModeTypeListLoaded: true,
                communicationModeTypeList: action.payload.communicationModeTypeList
            };
            return state;
        case GET_BODY_PART_LIST:
            state = {
                ...state,
                isBodyPartListLoading: true,
                isBodyPartListLoaded: false,
            };
            return state;
        case SET_BODY_PART_LIST:
            state = {
                ...state,
                isBodyPartListLoading: false,
                isBodyPartListLoaded: true,
                bodyPartList: action.payload.bodyPartList
            };
            return state;
        case GET_INJURY_TYPE_LIST:
            state = {
                ...state,
                isInjuryTypeListLoading: true,
                isInjuryTypeListLoaded: false,
            };
            return state;
        case SET_INJURY_TYPE_LIST:
            state = {
                ...state,
                isInjuryTypeListLoading: false,
                isInjuryTypeListLoaded: true,
                injuryTypeList: action.payload.injuryTypeList
            };
            return state;
        default:
            return state;
    }
};

export default StaticDataReducer;
