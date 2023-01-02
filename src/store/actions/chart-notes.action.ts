export const GET_MEDICAL_INTERVENTION_DETAILS = 'GET_MEDICAL_INTERVENTION_DETAILS';
export const SET_MEDICAL_INTERVENTION_DETAILS = 'SET_MEDICAL_INTERVENTION_DETAILS';

export const GET_INTERVENTION_ATTACHMENT_LIST = 'GET_INTERVENTION_ATTACHMENT_LIST';
export const SET_INTERVENTION_ATTACHMENT_LIST = 'SET_INTERVENTION_ATTACHMENT_LIST';

export const getMedicalInterventionDetails = (medicalInterventionId: string) => {
    return {
        type: GET_MEDICAL_INTERVENTION_DETAILS, payload: {
            medicalInterventionId
        }
    };
};

export const setMedicalInterventionDetails = (medicalInterventionDetails: any) => { // TODO type properly
    return {
        type: SET_MEDICAL_INTERVENTION_DETAILS, payload: {
            medicalInterventionDetails
        }
    };
};

export const getInterventionAttachmentList = (interventionId: string) => {
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
}