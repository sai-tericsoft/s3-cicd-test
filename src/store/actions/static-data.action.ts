import {IConsultationDuration} from "../../shared/models/static-data.model";
import {
    IBodyPart, ICaseStatus,
    ICommunicationModeType,
    IEmploymentStatus,
    IGender, IInjuryType,
    ILanguage,
    IMedicalHistoryOption, IMusculoskeletalHistoryOption,
    IPhoneType, IProgressReportStat, IReferralType,
    IRelationship, ISocialMediaPlatform, ISurgicalHistoryOption
} from "../../shared/models/common.model";

export const GET_CONSULTATION_DURATION_LIST = 'GET_CONSULTATION_DURATION_LIST';
export const SET_CONSULTATION_DURATION_LIST = 'SET_CONSULTATION_DURATION_LIST';

export const GET_GENDER_LIST = 'GET_GENDER_LIST';
export const SET_GENDER_LIST = 'SET_GENDER_LIST';

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

export const GET_CASE_STATUS_LIST =  'GET_CASE_STATUS_LIST';
export const SET_CASE_STATUS_LIST =  'SET_CASE_STATUS_LIST';

export const GET_PROGRESS_REPORT_STATS_LIST =  'GET_PROGRESS_REPORT_STATS_LIST';
export const SET_PROGRESS_REPORT_STATS_LIST =  'SET_PROGRESS_REPORT_STATS_LIST';


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

export const getCaseStatusList =()=>{
    return {type : GET_CASE_STATUS_LIST}
}

export const setCaseStatusList = (caseStatusList : ICaseStatus[])=>{
    return {
        type : SET_CASE_STATUS_LIST , payload :{
            caseStatusList
        }
    }
}

export const getProgressReportStatsList =()=>{
    return {type : GET_PROGRESS_REPORT_STATS_LIST}
}

export const setProgressReportStatsList = (progressReportStatList : IProgressReportStat[])=>{
    return {
        type : SET_PROGRESS_REPORT_STATS_LIST , payload :{
            progressReportStatList
        }
    }
}
