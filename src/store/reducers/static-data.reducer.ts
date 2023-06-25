import {
    GET_8_MINUTE_RULE_CHART,
    GET_BODY_PART_LIST,
    GET_CASE_STATUS_LIST,
    GET_COMMUNICATION_MODE_TYPE_LIST,
    GET_CONCUSSION_FILE_TYPES,
    GET_CONSULTATION_DURATION_LIST,
    GET_EMPLOYMENT_STATUS_LIST,
    GET_FACILITY_LIST_LITE,
    GET_FAQ_LIST,
    GET_FILES_UNEDITABLE_AFTER_OPTIONS_LIST,
    GET_GENDER_LIST,
    GET_INJURY_TYPE_LIST,
    GET_LANGUAGE_LIST,
    GET_MEDICAL_HISTORY_OPTIONS_LIST,
    GET_MEDICAL_RECORD_DOCUMENT_TYPES,
    GET_MUSCULOSKELETAL_HISTORY_OPTIONS_LIST,
    GET_PHONE_TYPE_LIST,
    GET_PRIMARY_REMAINDER_HOURS_LIST,
    GET_PROGRESS_REPORT_STATS_LIST,
    GET_REFERRAL_TYPE_LIST,
    GET_RELATIONSHIP_LIST,
    GET_RESCHEDULED_HOURS_LIST,
    GET_RESCHEDULED_TIMES_LIST,
    GET_ROLE_LIST,
    GET_SECONDARY_REMAINDER_HOURS_LIST,
    GET_SOCIAL_MEDIA_PLATFORM_LIST,
    GET_SURGICAL_HISTORY_OPTIONS_LIST,
    GET_SYSTEM_AUTO_LOCK_DURATION_OPTIONS_LIST,
    GET_USER_MENTIONS_LIST,
    GET_VALID_DAYS_LIST,
    SET_8_MINUTE_RULE_CHART,
    SET_APPOINTMENT_STATUS,
    SET_APPOINTMENT_TYPES,
    SET_BODY_PART_LIST,
    SET_CASE_STATUS_LIST,
    SET_COMMUNICATION_MODE_TYPE_LIST,
    SET_CONCUSSION_FILE_TYPES,
    SET_CONSULTATION_DURATION_LIST,
    SET_EMPLOYMENT_STATUS_LIST,
    SET_FACILITY_LIST_LITE,
    SET_FAQ_LIST,
    SET_FILES_UNEDITABLE_AFTER_OPTIONS_LIST,
    SET_GENDER_LIST,
    SET_INJURY_TYPE_LIST,
    SET_LANGUAGE_LIST,
    SET_MEDICAL_HISTORY_OPTIONS_LIST,
    SET_MEDICAL_RECORD_DOCUMENT_TYPES,
    SET_MUSCULOSKELETAL_HISTORY_OPTIONS_LIST,
    SET_PAYMENT_MODES,
    SET_PHONE_TYPE_LIST,
    SET_PRIMARY_REMAINDER_HOURS_LIST,
    SET_PROGRESS_REPORT_STATS_LIST,
    SET_REFERRAL_TYPE_LIST,
    SET_RELATIONSHIP_LIST,
    SET_RESCHEDULED_HOURS_LIST,
    SET_RESCHEDULED_TIMES_LIST,
    SET_ROLE_LIST,
    SET_SECONDARY_REMAINDER_HOURS_LIST,
    SET_SOCIAL_MEDIA_PLATFORM_LIST,
    SET_SURGICAL_HISTORY_OPTIONS_LIST,
    SET_SYSTEM_AUTO_LOCK_DURATION_OPTIONS_LIST,
    SET_USER_MENTIONS_LIST,
    SET_VALID_DAYS_LIST,
} from "../actions/static-data.action";
import {IActionModel} from "../../shared/models/action.model";
import {ICommonType} from "../../shared/models/static-data.model";
import {
    IConcussionFileType,
    IMedicalRecordDocumentType,
    ISystemAutoLockDurationOption
} from "../../shared/models/common.model";

export interface IStaticDataReducerState {
    statusList: ICommonType[],
    medicalStatusList: ICommonType[],
    isConsultationDurationListLoading: boolean,
    isConsultationDurationListLoaded: boolean,
    consultationDurationList: any[],
    isGenderListLoading: boolean,
    isGenderListLoaded: boolean,
    genderList: any[],
    isCaseStatusLoading: boolean,
    isCaseStatusLoaded: boolean,
    caseStatusList: any[],
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
    isProgressReportStatListLoading: boolean,
    isProgressReportStatListLoaded: boolean,
    progressReportStatList: any[],
    isEightMinuteRuleChartLoading: boolean,
    isEightMinuteRuleChartLoaded: boolean,
    eightMinuteRuleChart: any[],
    isConcussionFileTypesLoading: boolean,
    isConcussionFileTypesLoaded: boolean,
    concussionFileTypes: IConcussionFileType[],
    isMedicalRecordDocumentTypesLoading: boolean,
    isMedicalRecordDocumentTypesLoaded: boolean,
    medicalRecordDocumentTypes: IMedicalRecordDocumentType[],
    appointmentTypes?: any[],
    appointmentStatus?: any[],
    paymentModes?: any[],
    systemAutoLockDurationOptionList: ISystemAutoLockDurationOption[],
    isSystemAutoLockDurationOptionListLoading?: boolean,
    isSystemAutoLockDurationOptionListLoaded?: boolean,
    filesUneditableAfterOptionList: ISystemAutoLockDurationOption[],
    isFilesUneditableAfterOptionListLoading?: boolean,
    isFilesUneditableAfterOptionListLoaded?: boolean,
    isFaqListLoading: boolean,
    isFaqListLoaded: boolean,
    isFaqListLoadingFailed: boolean,
    faqList: any[],

    primaryRemainderHoursList: any[],
    isPrimaryRemainderHoursListLoading: boolean,
    isPrimaryRemainderHoursListLoaded: boolean,

    secondaryRemainderHoursList: any[],
    isSecondaryRemainderHoursListLoading: boolean,
    isSecondaryRemainderHoursListLoaded: boolean,

    userMentionsList: any[],
    isUserMentionsListLoading: boolean,
    isUserMentionsListLoaded: boolean,

    reschedulingHoursList: any[],
    isReschedulingHoursListLoading: boolean,
    isReschedulingHoursListLoaded: boolean,

    reschedulingTimesList: any[],
    isReschedulingTimesListLoading: boolean,
    isReschedulingTimesListLoaded: boolean,

    isValidDaysListLoading: boolean,
    isValidDaysListLoaded: boolean,
    validDaysList: any[],

    facilityListLite: any[],
    isFacilityListLiteLoading: boolean,
    isFacilityListLiteLoaded: boolean,

    isRoleListLoading: boolean,
    isRoleListLoaded: boolean,
    roleList: any[],
}

const initialData: IStaticDataReducerState = {
    isConsultationDurationListLoading: false,
    isConsultationDurationListLoaded: false,
    consultationDurationList: [],
    isGenderListLoading: false,
    isGenderListLoaded: false,
    genderList: [],
    isCaseStatusLoading: false,
    isCaseStatusLoaded: false,
    caseStatusList: [],
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
            code: 'all',
            title: "All"
        },
        {
            code: true,
            title: "Active"
        },
        {
            code: false,
            title: "Inactive"
        }
    ],
    medicalStatusList: [],
    isProgressReportStatListLoading: false,
    isProgressReportStatListLoaded: false,
    progressReportStatList: [],
    isEightMinuteRuleChartLoading: false,
    isEightMinuteRuleChartLoaded: false,
    eightMinuteRuleChart: [],
    isConcussionFileTypesLoading: false,
    isConcussionFileTypesLoaded: false,
    concussionFileTypes: [],
    isMedicalRecordDocumentTypesLoading: false,
    isMedicalRecordDocumentTypesLoaded: false,
    medicalRecordDocumentTypes: [],
    appointmentTypes: [],
    appointmentStatus: [],
    paymentModes: [],
    systemAutoLockDurationOptionList: [],
    isSystemAutoLockDurationOptionListLoading: false,
    isSystemAutoLockDurationOptionListLoaded: false,
    filesUneditableAfterOptionList: [],
    isFilesUneditableAfterOptionListLoading: false,
    isFilesUneditableAfterOptionListLoaded: false,
    isFaqListLoading: false,
    isFaqListLoaded: false,
    isFaqListLoadingFailed: false,
    faqList: [],

    primaryRemainderHoursList: [],
    isPrimaryRemainderHoursListLoading: false,
    isPrimaryRemainderHoursListLoaded: false,

    reschedulingHoursList: [],
    isReschedulingHoursListLoading: false,
    isReschedulingHoursListLoaded: false,

    reschedulingTimesList: [],
    isReschedulingTimesListLoading: false,
    isReschedulingTimesListLoaded: false,

    userMentionsList: [],
    isUserMentionsListLoading: false,
    isUserMentionsListLoaded: false,

    secondaryRemainderHoursList: [],
    isSecondaryRemainderHoursListLoading: false,
    isSecondaryRemainderHoursListLoaded: false,

    isValidDaysListLoading: false,
    isValidDaysListLoaded: false,
    validDaysList: [],

    facilityListLite: [],
    isFacilityListLiteLoading: false,
    isFacilityListLiteLoaded: false,

    isRoleListLoading: false,
    isRoleListLoaded: false,
    roleList: [],
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
        case GET_CASE_STATUS_LIST:
            state = {
                ...state,
                isGenderListLoading: true,
                isCaseStatusLoaded: false
            }
            return state;
        case SET_CASE_STATUS_LIST:
            state = {
                ...state,
                isGenderListLoading: false,
                isCaseStatusLoaded: true,
                caseStatusList: action.payload.caseStatusList
            }
            return state;
        case GET_PROGRESS_REPORT_STATS_LIST:
            state = {
                ...state,
                isProgressReportStatListLoading: true,
                isProgressReportStatListLoaded: false
            }
            return state;
        case SET_PROGRESS_REPORT_STATS_LIST:
            state = {
                ...state,
                isProgressReportStatListLoading: false,
                isProgressReportStatListLoaded: true,
                progressReportStatList: action.payload.progressReportStatList
            }
            return state;
        case GET_8_MINUTE_RULE_CHART:
            state = {
                ...state,
                isEightMinuteRuleChartLoading: true,
                isEightMinuteRuleChartLoaded: false
            }
            return state;
        case SET_8_MINUTE_RULE_CHART:
            state = {
                ...state,
                isEightMinuteRuleChartLoading: false,
                isEightMinuteRuleChartLoaded: true,
                eightMinuteRuleChart: action.payload.eightMinuteRuleChart
            }
            return state;
        case GET_CONCUSSION_FILE_TYPES:
            state = {
                ...state,
                isConcussionFileTypesLoading: true,
                isConcussionFileTypesLoaded: false
            }
            return state;
        case SET_CONCUSSION_FILE_TYPES:
            state = {
                ...state,
                isConcussionFileTypesLoading: false,
                isConcussionFileTypesLoaded: true,
                concussionFileTypes: action.payload.concussionFileTypes
            }
            return state;
        case GET_MEDICAL_RECORD_DOCUMENT_TYPES:
            state = {
                ...state,
                isMedicalRecordDocumentTypesLoading: true,
                isMedicalRecordDocumentTypesLoaded: false
            }
            return state;
        case SET_MEDICAL_RECORD_DOCUMENT_TYPES:
            state = {
                ...state,
                isMedicalRecordDocumentTypesLoading: false,
                isMedicalRecordDocumentTypesLoaded: true,
                medicalRecordDocumentTypes: action.payload.medicalRecordDocumentTypes
            }
            return state;
        case SET_APPOINTMENT_TYPES:
            state = {
                ...state,
                appointmentTypes: action.payload.appointmentTypes
            };
            return state;
        case SET_APPOINTMENT_STATUS:
            state = {
                ...state,
                appointmentStatus: action.payload.appointmentStatus
            };
            return state;
        case SET_PAYMENT_MODES:
            state = {
                ...state,
                paymentModes: action.payload.paymentModes
            };
            return state;
        case GET_SYSTEM_AUTO_LOCK_DURATION_OPTIONS_LIST:
            state = {
                ...state,
                isSystemAutoLockDurationOptionListLoading: true,
                isSystemAutoLockDurationOptionListLoaded: false
            }
            return state;
        case SET_SYSTEM_AUTO_LOCK_DURATION_OPTIONS_LIST:
            state = {
                ...state,
                isSystemAutoLockDurationOptionListLoading: false,
                isSystemAutoLockDurationOptionListLoaded: true,
                systemAutoLockDurationOptionList: action.payload.systemAutoLockDurationOptionList
            }
            return state;
        case GET_FILES_UNEDITABLE_AFTER_OPTIONS_LIST:
            state = {
                ...state,
                isFilesUneditableAfterOptionListLoading: true,
                isFilesUneditableAfterOptionListLoaded: false
            }
            return state;
        case SET_FILES_UNEDITABLE_AFTER_OPTIONS_LIST:
            state = {
                ...state,
                isFilesUneditableAfterOptionListLoading: false,
                isFilesUneditableAfterOptionListLoaded: true,
                filesUneditableAfterOptionList: action.payload.filesUneditableAfterOptionList
            }
            return state;
        case GET_FAQ_LIST:
            state = {
                ...state,
                isFaqListLoading: true,
                isFaqListLoaded: false,
                isFaqListLoadingFailed: false
            }
            return state;
        case SET_FAQ_LIST:
            state = {
                ...state,
                isFaqListLoading: false,
                isFaqListLoaded: true,
                isFaqListLoadingFailed: false,
                faqList: action.payload.faqList
            }
            return state;
        case GET_PRIMARY_REMAINDER_HOURS_LIST:
            state = {
                ...state,
                isPrimaryRemainderHoursListLoading: true,
                isPrimaryRemainderHoursListLoaded: false
            }
            return state;

        case SET_PRIMARY_REMAINDER_HOURS_LIST:
            state = {
                ...state,
                isPrimaryRemainderHoursListLoading: false,
                isPrimaryRemainderHoursListLoaded: true,
                primaryRemainderHoursList: action.payload.primaryRemainderHoursList
            }
            return state;
        case GET_SECONDARY_REMAINDER_HOURS_LIST:
            state = {
                ...state,
                isSecondaryRemainderHoursListLoading: true,
                isSecondaryRemainderHoursListLoaded: false
            }
            return state;

        case SET_SECONDARY_REMAINDER_HOURS_LIST:
            state = {
                ...state,
                isSecondaryRemainderHoursListLoading: false,
                isSecondaryRemainderHoursListLoaded: true,
                secondaryRemainderHoursList: action.payload.secondaryRemainderHoursList
            }
            return state;
        case GET_RESCHEDULED_HOURS_LIST:
            state = {
                ...state,
                isReschedulingHoursListLoading: true,
                isReschedulingHoursListLoaded: false
            }
            return state;
        case SET_RESCHEDULED_HOURS_LIST:
            state = {
                ...state,
                isReschedulingHoursListLoading: false,
                isReschedulingHoursListLoaded: true,
                reschedulingHoursList: action.payload.reschedulingHoursList
            }
            return state;

        case GET_RESCHEDULED_TIMES_LIST:
            state = {
                ...state,
                isReschedulingTimesListLoading: true,
                isReschedulingTimesListLoaded: false
            }
            return state;
        case SET_RESCHEDULED_TIMES_LIST:
            state = {
                ...state,
                isReschedulingTimesListLoading: false,
                isReschedulingTimesListLoaded: true,
                reschedulingTimesList: action.payload.reschedulingTimesList
            }
            return state;

        case GET_USER_MENTIONS_LIST:
            state = {
                ...state,
                isUserMentionsListLoading: true,
                isUserMentionsListLoaded: false
            }
            return state;
        case SET_USER_MENTIONS_LIST:
            state = {
                ...state,
                isUserMentionsListLoading: false,
                isUserMentionsListLoaded: true,
                userMentionsList: action.payload.userMentions
            }
            return state;
        case GET_VALID_DAYS_LIST:
            state = {
                ...state,
                isValidDaysListLoading: true,
                isValidDaysListLoaded: false
            }
            return state;

        case SET_VALID_DAYS_LIST:
            state = {
                ...state,
                isValidDaysListLoading: false,
                isValidDaysListLoaded: true,
                validDaysList: action.payload.validDaysList
            }
            return state;

        case GET_FACILITY_LIST_LITE:
            state = {
                ...state,
                isFacilityListLiteLoading: true,
                isFacilityListLiteLoaded: false
            }
            return state;
        case SET_FACILITY_LIST_LITE:
            state = {
                ...state,
                isFacilityListLiteLoading: false,
                isFacilityListLiteLoaded: true,
                facilityListLite: action.payload.facilityListLiteData
            }
            return state;
        case GET_ROLE_LIST:
            state = {
                ...state,
                isRoleListLoading: true,
                isRoleListLoaded: false,
            };
            return state;
        case SET_ROLE_LIST:
            state = {
                ...state,
                isRoleListLoading: false,
                isRoleListLoaded: true,
                roleList: action.payload.roleList
            };
            return state;
        default:
            return state;
    }
};

export default StaticDataReducer;
