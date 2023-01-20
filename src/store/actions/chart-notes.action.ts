export const GET_CLIENT_FAVOURITE_CODES = 'GET_CLIENT_FAVOURITE_CODES';
export const SET_CLIENT_FAVOURITE_CODES = 'SET_CLIENT_FAVOURITE_CODES';
export const GET_MEDICAL_INTERVENTION_DETAILS = 'GET_MEDICAL_INTERVENTION_DETAILS';
export const SET_MEDICAL_INTERVENTION_DETAILS = 'SET_MEDICAL_INTERVENTION_DETAILS';
export const GET_CLIENT_MEDICAL_INTERVENTION_DETAILS = 'GET_CLIENT_MEDICAL_INTERVENTION_DETAILS';
export const SET_CLIENT_MEDICAL_INTERVENTION_DETAILS = 'SET_CLIENT_MEDICAL_INTERVENTION_DETAILS';

export const GET_INTERVENTION_ATTACHMENT_LIST = 'GET_INTERVENTION_ATTACHMENT_LIST';
export const SET_INTERVENTION_ATTACHMENT_LIST = 'SET_INTERVENTION_ATTACHMENT_LIST';
export const GET_PROGRESS_REPORT_VIEW_DETAILS = 'GET_PROGRESS_REPORT_VIEW_DETAILS';
export const SET_PROGRESS_REPORT_VIEW_DETAILS = 'SET_PROGRESS_REPORT_VIEW_DETAILS';

export const GET_MEDICAL_RECORD_PROGRESS_REPORT_DETAILS = 'GET_MEDICAL_RECORD_PROGRESS_REPORT_DETAILS';
export const SET_MEDICAL_RECORD_PROGRESS_REPORT_DETAILS = 'SET_MEDICAL_RECORD_PROGRESS_REPORT_DETAILS';
export const REFRESH_SURGERY_RECORDS = 'REFRESH_SURGERY_RECORDS';

export const GET_MEDICAL_INTERVENTION_LIST = 'GET_MEDICAL_INTERVENTION_LIST';
export const SET_MEDICAL_INTERVENTION_LIST = 'SET_MEDICAL_INTERVENTION_LIST';

export const GET_MEDICAL_RECORD_STATS = 'GET_MEDICAL_RECORD_STATS';
export const SET_MEDICAL_RECORD_STATS = 'SET_MEDICAL_RECORD_STATS';

export const GET_MEDICAL_RECORD_SOAP_NOTE_LIST = 'GET_MEDICAL_RECORD_SOAP_NOTE_LIST';
export const SET_MEDICAL_RECORD_SOAP_NOTE_LIST = 'SET_MEDICAL_RECORD_SOAP_NOTE_LIST';


export const refreshSurgeryRecords = () => {
    return {
        type: REFRESH_SURGERY_RECORDS
    };
};

export const getClientFavouriteCodes = () => {
    return {
        type: GET_CLIENT_FAVOURITE_CODES, payload: {}
    };
};

export const setClientFavouriteCode = (favouriteCodeList: any) => {
    return {
        type: SET_CLIENT_FAVOURITE_CODES, payload: {
            favouriteCodeList
        }
    };
};

export const getMedicalInterventionDetails = (medicalInterventionId: string) => {
    return {
        type: GET_MEDICAL_INTERVENTION_DETAILS, payload: {
            medicalInterventionId,
        }
    };
}

export const setMedicalInterventionDetails = (medicalInterventionDetails: any) => { // TODO type properly
    return {
        type: SET_MEDICAL_INTERVENTION_DETAILS, payload: {
            medicalInterventionDetails
        }
    };
};

export const getInterventionAttachmentList = (interventionId: any) => {
    return {
        type: GET_INTERVENTION_ATTACHMENT_LIST, payload: {
            interventionId
        }
    }
};

export const setInterventionAttachmentList = (interventionAttachmentList: any) => {
    return {
        type: SET_INTERVENTION_ATTACHMENT_LIST, payload: {
            interventionAttachmentList
        }
    }
};

export const getClientMedicalInterventionDetails = (medicalInterventionId: string) => {
    return {
        type: GET_CLIENT_MEDICAL_INTERVENTION_DETAILS, payload: {
            medicalInterventionId
        }
    };
};

export const setClientMedicalInterventionDetails = (clientMedicalInterventionDetails: any) => { // TODO type properly
    return {
        type: SET_CLIENT_MEDICAL_INTERVENTION_DETAILS, payload: {
            clientMedicalInterventionDetails
        }
    };
};

export const getProgressReportViewDetails = (interventionId: string) => {
    return {
        type: GET_PROGRESS_REPORT_VIEW_DETAILS, payload: {
            interventionId
        }
    };
}

export const setProgressReportViewDetails = (progressReportDetails: any) => {
    return {
        type: SET_PROGRESS_REPORT_VIEW_DETAILS, payload: {
            progressReportDetails
        }
    };
}

export const getMedicalRecordProgressReportDetails = (progressReportId: string) => {
    return {
        type: GET_MEDICAL_RECORD_PROGRESS_REPORT_DETAILS, payload: {
            progressReportId
        }
    };
};

export const setMedicalRecordProgressReportDetails = (clientMedicalRecordProgressReportDetails: any) => { // TODO type properly
    return {
        type: SET_MEDICAL_RECORD_PROGRESS_REPORT_DETAILS, payload: {
            clientMedicalRecordProgressReportDetails
        }
    };
};

export const getMedicalInterventionList = (medicalRecordId: string) => {
    return {
        type: GET_MEDICAL_INTERVENTION_LIST, payload: {
            medicalRecordId
        }
    };
};

export const setMedicalInterventionList = (medicalInterventionList: any) => { // TODO type properly
    return {
        type: SET_MEDICAL_INTERVENTION_LIST, payload: {
            medicalInterventionList
        }
    };
};

export const getMedicalRecordStats = (medicalRecordId: string) => {
    return {
        type: GET_MEDICAL_RECORD_STATS, payload: {
            medicalRecordId
        }
    };
};

export const setMedicalRecordStats = (medicalRecordStats: any) => { // TODO type properly
    return {
        type: SET_MEDICAL_RECORD_STATS, payload: {
            medicalRecordStats
        }
    };
};

export const getMedicalRecordSoapNoteList = (payload: any) => {
    return {
        type: GET_MEDICAL_RECORD_SOAP_NOTE_LIST, payload
    };
};

export const setMedicalRecordSoapNoteList = (medicalRecordSoapNoteList: any) => {
    return {
        type: SET_MEDICAL_RECORD_SOAP_NOTE_LIST, payload: {
            medicalRecordSoapNoteList
        }
    }
};
