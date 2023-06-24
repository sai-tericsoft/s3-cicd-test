import {IConsultationDuration} from "../../shared/models/static-data.model";
import {
    I8MinuteRuleChartItem,
    IBodyPart,
    ICaseStatus,
    ICommunicationModeType,
    IConcussionFileType,
    IEmploymentStatus,
    IFilesUneditableAfterOption,
    IGender,
    IInjuryType,
    ILanguage,
    IMedicalHistoryOption,
    IMedicalRecordDocumentType,
    IMusculoskeletalHistoryOption,
    IPhoneType,
    IProgressReportStat,
    IReferralType,
    IRelationship,
    ISocialMediaPlatform,
    ISurgicalHistoryOption,
    ISystemAutoLockDurationOption
} from "../../shared/models/common.model";

export const GET_CONSULTATION_DURATION_LIST = 'GET_CONSULTATION_DURATION_LIST';
export const SET_CONSULTATION_DURATION_LIST = 'SET_CONSULTATION_DURATION_LIST';

export const GET_GENDER_LIST = 'GET_GENDER_LIST';
export const SET_GENDER_LIST = 'SET_GENDER_LIST';

export const GET_CONCUSSION_FILE_TYPES = 'GET_CONCUSSION_FILE_TYPES';
export const SET_CONCUSSION_FILE_TYPES = 'SET_CONCUSSION_FILE_TYPES';

export const GET_EMPLOYMENT_STATUS_LIST = 'GET_EMPLOYMENT_STATUS_LIST';
export const SET_EMPLOYMENT_STATUS_LIST = 'SET_EMPLOYMENT_STATUS_LIST';

export const GET_LANGUAGE_LIST = 'GET_LANGUAGE_LIST';
export const SET_LANGUAGE_LIST = 'SET_LANGUAGE_LIST';

export const GET_RELATIONSHIP_LIST = 'GET_RELATIONSHIP_LIST';
export const SET_RELATIONSHIP_LIST = 'SET_RELATIONSHIP_LIST';

export const GET_PHONE_TYPE_LIST = 'GET_PHONE_TYPE_LIST';
export const SET_PHONE_TYPE_LIST = 'SET_PHONE_TYPE_LIST';

export const GET_MEDICAL_HISTORY_OPTIONS_LIST = 'GET_MEDICAL_HISTORY_OPTIONS_LIST';
export const SET_MEDICAL_HISTORY_OPTIONS_LIST = 'SET_MEDICAL_HISTORY_OPTIONS_LIST';

export const GET_SURGICAL_HISTORY_OPTIONS_LIST = 'GET_SURGICAL_HISTORY_OPTIONS_LIST';
export const SET_SURGICAL_HISTORY_OPTIONS_LIST = 'SET_SURGICAL_HISTORY_OPTIONS_LIST';

export const GET_MUSCULOSKELETAL_HISTORY_OPTIONS_LIST = 'GET_MUSCULOSKELETAL_HISTORY_OPTIONS_LIST';
export const SET_MUSCULOSKELETAL_HISTORY_OPTIONS_LIST = 'SET_MUSCULOSKELETAL_HISTORY_OPTIONS_LIST';

export const GET_COMMUNICATION_MODE_TYPE_LIST = 'GET_COMMUNICATION_MODE_TYPE_LIST';
export const SET_COMMUNICATION_MODE_TYPE_LIST = 'SET_COMMUNICATION_MODE_TYPE_LIST';

export const GET_REFERRAL_TYPE_LIST = 'GET_REFERRAL_TYPE_LIST';
export const SET_REFERRAL_TYPE_LIST = 'SET_REFERRAL_TYPE_LIST';

export const GET_SOCIAL_MEDIA_PLATFORM_LIST = 'GET_SOCIAL_MEDIA_PLATFORM_LIST';
export const SET_SOCIAL_MEDIA_PLATFORM_LIST = 'SET_SOCIAL_MEDIA_PLATFORM_LIST';

export const GET_BODY_PART_LIST = 'GET_BODY_PART_LIST';
export const SET_BODY_PART_LIST = 'SET_BODY_PART_LIST';

export const GET_INJURY_TYPE_LIST = 'GET_INJURY_TYPE_LIST';
export const SET_INJURY_TYPE_LIST = 'SET_INJURY_TYPE_LIST';

export const GET_CASE_STATUS_LIST = 'GET_CASE_STATUS_LIST';
export const SET_CASE_STATUS_LIST = 'SET_CASE_STATUS_LIST';

export const GET_PROGRESS_REPORT_STATS_LIST = 'GET_PROGRESS_REPORT_STATS_LIST';
export const SET_PROGRESS_REPORT_STATS_LIST = 'SET_PROGRESS_REPORT_STATS_LIST';

export const GET_8_MINUTE_RULE_CHART = 'GET_8_MINUTE_RULE_CHART';
export const SET_8_MINUTE_RULE_CHART = 'SET_8_MINUTE_RULE_CHART';

export const GET_MEDICAL_RECORD_DOCUMENT_TYPES = 'GET_MEDICAL_RECORD_DOCUMENT_TYPES';
export const SET_MEDICAL_RECORD_DOCUMENT_TYPES = 'SET_MEDICAL_RECORD_DOCUMENT_TYPES';


export const GET_APPOINTMENT_TYPES = 'GET_APPOINTMENT_TYPES';
export const SET_APPOINTMENT_TYPES = 'SET_APPOINTMENT_TYPES';

export const GET_APPOINTMENT_STATUS = 'GET_APPOINTMENT_STATUS';
export const SET_APPOINTMENT_STATUS = 'SET_APPOINTMENT_STATUS';

export const GET_PAYMENT_MODES = 'GET_PAYMENT_MODES';
export const SET_PAYMENT_MODES = 'SET_PAYMENT_MODES';

export const GET_SYSTEM_AUTO_LOCK_DURATION_OPTIONS_LIST = 'GET_SYSTEM_AUTO_LOCK_DURATION_OPTIONS_LIST';
export const SET_SYSTEM_AUTO_LOCK_DURATION_OPTIONS_LIST = 'SET_SYSTEM_AUTO_LOCK_DURATION_OPTIONS_LIST';

export const GET_FILES_UNEDITABLE_AFTER_OPTIONS_LIST = 'GET_FILES_UNEDITABLE_AFTER_OPTIONS_LIST';
export const SET_FILES_UNEDITABLE_AFTER_OPTIONS_LIST = 'SET_FILES_UNEDITABLE_AFTER_OPTIONS_LIST';

export const GET_FAQ_LIST = 'GET_FAQ_LIST';
export const SET_FAQ_LIST = 'SET_FAQ_LIST';
export const GET_PRIMARY_REMAINDER_HOURS_LIST = 'GET_PRIMARY_REMAINDER_HOURS_LIST';
export const SET_PRIMARY_REMAINDER_HOURS_LIST = 'SET_PRIMARY_REMAINDER_HOURS_LIST';

export const GET_SECONDARY_REMAINDER_HOURS_LIST = 'GET_SECONDARY_REMAINDER_HOURS_LIST';
export const SET_SECONDARY_REMAINDER_HOURS_LIST = 'SET_SECONDARY_REMAINDER_HOURS_LIST';

export const GET_RESCHEDULED_HOURS_LIST = 'GET_RESCHEDULED_HOURS_LIST';
export const SET_RESCHEDULED_HOURS_LIST = 'SET_RESCHEDULED_HOURS_LIST';

export const GET_RESCHEDULED_TIMES_LIST = 'GET_RESCHEDULED_TIMES_LIST';
export const SET_RESCHEDULED_TIMES_LIST = 'SET_RESCHEDULED_TIMES_LIST';

export const GET_USER_MENTIONS_LIST = 'GET_USER_MENTIONS_LIST';
export const SET_USER_MENTIONS_LIST = 'SET_USER_MENTIONS_LIST';

export const GET_VALID_DAYS_LIST = 'GET_VALID_DAYS_LIST';
export const SET_VALID_DAYS_LIST = 'SET_VALID_DAYS_LIST';

export const GET_FACILITY_LIST_LITE = 'GET_FACILITY_LIST_LITE';
export const SET_FACILITY_LIST_LITE = 'SET_FACILITY_LIST_LITE';

export const getConsultationDurationList = () => {
    return {type: GET_CONSULTATION_DURATION_LIST};
};

export const setConsultationDurationList = (consultationDurationList: IConsultationDuration[]) => {
    return {
        type: SET_CONSULTATION_DURATION_LIST, payload: {
            consultationDurationList
        }
    };
};

export const getGenderList = () => {
    return {type: GET_GENDER_LIST};
};

export const setGenderList = (genderList: IGender[]) => {
    return {
        type: SET_GENDER_LIST, payload: {
            genderList
        }
    };
};


export const getPhoneTypeList = () => {
    return {type: GET_PHONE_TYPE_LIST};
};

export const setPhoneTypeList = (phoneTypeList: IPhoneType[]) => {
    return {
        type: SET_PHONE_TYPE_LIST, payload: {
            phoneTypeList
        }
    };
};

export const getLanguageList = () => {
    return {type: GET_LANGUAGE_LIST};
};

export const setLanguageList = (languageList: ILanguage[]) => {
    return {
        type: SET_LANGUAGE_LIST, payload: {
            languageList
        }
    };
};

export const getEmploymentStatusList = () => {
    return {type: GET_EMPLOYMENT_STATUS_LIST};
};

export const setEmploymentStatusList = (employmentStatusList: IEmploymentStatus[]) => {
    return {
        type: SET_EMPLOYMENT_STATUS_LIST, payload: {
            employmentStatusList
        }
    };
};

export const getRelationShipList = () => {
    return {type: GET_RELATIONSHIP_LIST};
};

export const setRelationShipList = (relationshipList: IRelationship[]) => {
    return {
        type: SET_RELATIONSHIP_LIST, payload: {
            relationshipList
        }
    };
};

export const getMedicalHistoryOptionsList = () => {
    return {type: GET_MEDICAL_HISTORY_OPTIONS_LIST};
};

export const setMedicalHistoryOptionsList = (medicalHistoryOptionsList: IMedicalHistoryOption[]) => {
    return {
        type: SET_MEDICAL_HISTORY_OPTIONS_LIST, payload: {
            medicalHistoryOptionsList
        }
    };
};

export const getSurgicalHistoryOptionsList = () => {
    return {type: GET_SURGICAL_HISTORY_OPTIONS_LIST};
};

export const setSurgicalHistoryOptionsList = (surgicalHistoryOptionsList: ISurgicalHistoryOption[]) => {
    return {
        type: SET_SURGICAL_HISTORY_OPTIONS_LIST, payload: {
            surgicalHistoryOptionsList
        }
    };
};

export const getMusculoskeletalHistoryOptionsList = () => {
    return {type: GET_MUSCULOSKELETAL_HISTORY_OPTIONS_LIST};
};

export const setMusculoskeletalHistoryOptionsList = (musculoskeletalHistoryOptionsList: IMusculoskeletalHistoryOption[]) => {
    return {
        type: SET_MUSCULOSKELETAL_HISTORY_OPTIONS_LIST, payload: {
            musculoskeletalHistoryOptionsList
        }
    };
};

export const getReferralTypeList = () => {
    return {type: GET_REFERRAL_TYPE_LIST};
};

export const setReferralTypeList = (referralTypeList: IReferralType[]) => {
    return {
        type: SET_REFERRAL_TYPE_LIST, payload: {
            referralTypeList
        }
    };
};

export const getSocialMediaPlatformList = () => {
    return {type: GET_SOCIAL_MEDIA_PLATFORM_LIST};
};

export const setSocialMediaPlatformList = (socialMediaPlatformList: ISocialMediaPlatform[]) => {
    return {
        type: SET_SOCIAL_MEDIA_PLATFORM_LIST, payload: {
            socialMediaPlatformList
        }
    };
};

export const getCommunicationModeTypeList = () => {
    return {type: GET_COMMUNICATION_MODE_TYPE_LIST};
};

export const setCommunicationModeTypeList = (communicationModeTypeList: ICommunicationModeType[]) => {
    return {
        type: SET_COMMUNICATION_MODE_TYPE_LIST, payload: {
            communicationModeTypeList
        }
    };
};


export const getBodyPartsList = () => {
    return {type: GET_BODY_PART_LIST};
};

export const setBodyPartsList = (bodyPartList: IBodyPart[]) => {
    return {
        type: SET_BODY_PART_LIST, payload: {
            bodyPartList
        }
    };
};

export const getInjuryTypeList = () => {
    return {type: GET_INJURY_TYPE_LIST};
};

export const setInjuryTypeList = (injuryTypeList: IInjuryType[]) => {
    return {
        type: SET_INJURY_TYPE_LIST, payload: {
            injuryTypeList
        }
    };
};

export const getCaseStatusList = () => {
    return {type: GET_CASE_STATUS_LIST}
}

export const setCaseStatusList = (caseStatusList: ICaseStatus[]) => {
    return {
        type: SET_CASE_STATUS_LIST, payload: {
            caseStatusList
        }
    }
}

export const getProgressReportStatsList = () => {
    return {type: GET_PROGRESS_REPORT_STATS_LIST}
}

export const setProgressReportStatsList = (progressReportStatList: IProgressReportStat[]) => {
    return {
        type: SET_PROGRESS_REPORT_STATS_LIST, payload: {
            progressReportStatList
        }
    }
}

export const get8MinuteRuleChart = () => {
    return {type: GET_8_MINUTE_RULE_CHART}
}

export const set8MinuteRuleChart = (eightMinuteRuleChart: I8MinuteRuleChartItem[]) => {
    return {
        type: SET_8_MINUTE_RULE_CHART, payload: {
            eightMinuteRuleChart
        }
    }
}

export const getConcussionFileTypes = () => {
    return {type: GET_CONCUSSION_FILE_TYPES}
}

export const setConcussionFileTypes = (concussionFileTypes: IConcussionFileType[]) => {
    return {
        type: SET_CONCUSSION_FILE_TYPES, payload: {
            concussionFileTypes
        }
    }
}

export const getMedicalRecordDocumentTypes = () => {
    return {type: GET_MEDICAL_RECORD_DOCUMENT_TYPES}
}

export const setMedicalRecordDocumentTypes = (medicalRecordDocumentTypes: IMedicalRecordDocumentType[]) => {
    return {
        type: SET_MEDICAL_RECORD_DOCUMENT_TYPES, payload: {
            medicalRecordDocumentTypes
        }
    }
}


export const getAppointmentTypes = () => {
    return {type: GET_APPOINTMENT_TYPES};
};

export const setAppointmentTypes = (appointmentTypes: any[]) => {
    return {
        type: SET_APPOINTMENT_TYPES, payload: {
            appointmentTypes
        }
    };
};
export const getAppointmentStatus = () => {
    return {type: GET_APPOINTMENT_STATUS};
};

export const setAppointmentStatus = (appointmentStatus: any[]) => {
    return {
        type: SET_APPOINTMENT_STATUS, payload: {
            appointmentStatus
        }
    };
};

export const getSystemAutoLockDurationOptionsList = () => {
    return {type: GET_SYSTEM_AUTO_LOCK_DURATION_OPTIONS_LIST};
};

export const setSystemAutoLockDurationOptionsList = (systemAutoLockDurationOptionList: ISystemAutoLockDurationOption[]) => {
    return {
        type: SET_SYSTEM_AUTO_LOCK_DURATION_OPTIONS_LIST, payload: {
            systemAutoLockDurationOptionList
        }
    };
};

export const getFilesUneditableAfterOptionsList = () => {
    return {type: GET_FILES_UNEDITABLE_AFTER_OPTIONS_LIST};
};

export const setFilesUneditableAfterOptionsList = (filesUneditableAfterOptionList: IFilesUneditableAfterOption[]) => {
    return {
        type: SET_FILES_UNEDITABLE_AFTER_OPTIONS_LIST, payload: {
            filesUneditableAfterOptionList
        }
    };
};

export const getPaymentModes = () => {
    return {type: GET_PAYMENT_MODES};
};

export const setPaymentModes = (paymentModes: any[]) => {
    return {
        type: SET_PAYMENT_MODES, payload: {
            paymentModes
        }
    };
};

export const getFAQList = () => {
    return {type: GET_FAQ_LIST};
};

export const setFAQList = (faqList: any) => {
    return {
        type: SET_FAQ_LIST, payload: {
            faqList
        }
    };
}

export const getPrimaryRemainderHoursList = () => {
    return {type: GET_PRIMARY_REMAINDER_HOURS_LIST};
}

export const setPrimaryRemainderHoursList = (primaryRemainderHoursList: any[]) => {
    return {
        type: SET_PRIMARY_REMAINDER_HOURS_LIST, payload: {
            primaryRemainderHoursList
        }
    };
};

export const getSecondaryRemainderHoursList = () => {
    return {type: GET_SECONDARY_REMAINDER_HOURS_LIST};
}

export const setSecondaryRemainderHoursList = (secondaryRemainderHoursList: any[]) => {
    return {
        type: SET_SECONDARY_REMAINDER_HOURS_LIST, payload: {
            secondaryRemainderHoursList
        }
    };
};


export const getRescheduledHoursList = () => {
    return {type: GET_RESCHEDULED_HOURS_LIST};
}

export const setRescheduledHoursList = (reschedulingHoursList: any[]) => {
    return {
        type: SET_RESCHEDULED_HOURS_LIST, payload: {
            reschedulingHoursList
        }
    };
};

export const getRescheduledTimesList = () => {
    return {type: GET_RESCHEDULED_TIMES_LIST};
}

export const setRescheduledTimesList = (reschedulingTimesList: any[]) => {
    return {
        type: SET_RESCHEDULED_TIMES_LIST, payload: {
            reschedulingTimesList
        }
    };
};

export const getUserMentionsList = () => {
    return {type: GET_USER_MENTIONS_LIST};
}

export const setUserMentionsList = (userMentions: any[]) => {
    return {
        type: SET_USER_MENTIONS_LIST, payload: {
            userMentions
        }
    };
}

export const getValidDaysList = () => {
    return {type: GET_VALID_DAYS_LIST}
}

export const setValidDaysList = (validDaysList: any[]) => {
    return {
        type: SET_VALID_DAYS_LIST, payload: {
            validDaysList
        }
    }
}

export const getFacilityListLite = () => {
    return {type: GET_FACILITY_LIST_LITE};
}

export const setFacilityListLite = (facilityListLiteData: any[]) => {
    return {
        type: SET_FACILITY_LIST_LITE, payload: {
            facilityListLiteData
        }
    };
}
