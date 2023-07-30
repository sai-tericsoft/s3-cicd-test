import {
    IClientAccountDetails,
    IClientBasicDetails,
    IClientMedicalDetails, IClientMedicalRecord
} from "../../shared/models/client.model";

export const GET_CLIENT_BASIC_DETAILS = 'GET_CLIENT_BASIC_DETAILS';
export const GET_CLIENT_MEDICAL_DETAILS = 'GET_CLIENT_MEDICAL_DETAILS';
export const GET_CLIENT_ACCOUNT_DETAILS = 'GET_CLIENT_ACCOUNT_DETAILS';
export const GET_CLIENT_MEDICAL_RECORD = 'GET_CLIENT_MEDICAL_RECORD';
export const SET_CLIENT_BASIC_DETAILS = 'SET_CLIENT_BASIC_DETAILS';
export const SET_CLIENT_MEDICAL_DETAILS = 'SET_CLIENT_MEDICAL_DETAILS';
export const SET_CLIENT_ACCOUNT_DETAILS = 'SET_CLIENT_ACCOUNT_DETAILS';
export const SET_CLIENT_MEDICAL_RECORD = 'SET_CLIENT_MEDICAL_RECORD';

export const getClientBasicDetails = (clientId: string) => {
    return {
        type: GET_CLIENT_BASIC_DETAILS, payload: {
            clientId
        }
    };
};

export const setClientBasicDetails = (clientBasicDetails: IClientBasicDetails | undefined) => {
    return {
        type: SET_CLIENT_BASIC_DETAILS, payload: {
            clientBasicDetails
        }
    };
};

export const getClientMedicalDetails = (clientId: string) => {
    return {
        type: GET_CLIENT_MEDICAL_DETAILS, payload: {
            clientId
        }
    };
};

export const setClientMedicalDetails = (clientMedicalDetails: IClientMedicalDetails | undefined) => {
    return {
        type: SET_CLIENT_MEDICAL_DETAILS, payload: {
            clientMedicalDetails
        }
    };
};

export const getClientAccountDetails = (clientId: string) => {
    return {
        type: GET_CLIENT_ACCOUNT_DETAILS, payload: {
            clientId
        }
    };
};

export const setClientAccountDetails = (clientAccountDetails: IClientAccountDetails | undefined) => {
    return {
        type: SET_CLIENT_ACCOUNT_DETAILS, payload: {
            clientAccountDetails
        }
    };
};

export const getClientMedicalRecord = (medicalRecordId: string) => {
    return {
        type: GET_CLIENT_MEDICAL_RECORD, payload: {
            medicalRecordId
        }
    };
};

export const setClientMedicalRecord = (clientMedicalRecord: IClientMedicalRecord | undefined) => {
    return {
        type: SET_CLIENT_MEDICAL_RECORD, payload: {
            clientMedicalRecord
        }
    };
};