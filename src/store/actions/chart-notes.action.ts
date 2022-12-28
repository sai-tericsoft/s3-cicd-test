export const GET_MEDICAL_INTERVENTION_DETAILS = 'GET_MEDICAL_INTERVENTION_DETAILS';
export const SET_MEDICAL_INTERVENTION_DETAILS = 'SET_MEDICAL_INTERVENTION_DETAILS';

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
