import {IConsultationDuration} from "../../shared/models/static-data.model";
import {IEmploymentStatus, IGender, ILanguage, IPhoneType, IRelationship} from "../../shared/models/common.model";

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

