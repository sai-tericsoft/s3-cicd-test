import {ApiService} from "../index";
import {APIConfig} from "../../../constants";

const MedicalRecordAddAPICall = (clientId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.MEDICAL_RECORD_ADD.METHOD](APIConfig.MEDICAL_RECORD_ADD.URL(clientId), payload, {'Content-Type': 'multipart/form-data'});
}

const MedicalInterventionBasicDetailsUpdateAPICall = (medicalInterventionId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.MEDICAL_INTERVENTION_BASIC_DETAILS_UPDATE.METHOD](APIConfig.MEDICAL_INTERVENTION_BASIC_DETAILS_UPDATE.URL(medicalInterventionId), payload);
}

const FetchMedicalInterventionBasicDetailsAPICall = (medicalInterventionId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.GET_MEDICAL_INTERVENTION_BASIC_DETAILS.METHOD](APIConfig.GET_MEDICAL_INTERVENTION_BASIC_DETAILS.URL(medicalInterventionId), payload);
}

const SaveMedicalInterventionROMConfigForABodyPartAPICall = (medicalInterventionId: string, bodyPartId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.SAVE_MEDICAL_INTERVENTION_ROM_CONFIG_FOR_A_BODY_PART.METHOD](APIConfig.SAVE_MEDICAL_INTERVENTION_ROM_CONFIG_FOR_A_BODY_PART.URL(medicalInterventionId, bodyPartId), payload);
}

const DeleteBodyPartUnderMedicalInterventionROMConfigAPICall = (medicalInterventionId: string, bodyPartId: string) => {
    // @ts-ignore
    return ApiService[APIConfig.DELETE_BODY_PART_UNDER_MEDICAL_INTERVENTION_ROM_CONFIG.METHOD](APIConfig.DELETE_BODY_PART_UNDER_MEDICAL_INTERVENTION_ROM_CONFIG.URL(medicalInterventionId, bodyPartId), {});
}

const SaveMedicalInterventionSpecialTestForABodyPartAPICall = (medicalInterventionId: string, bodyPartId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.SAVE_MEDICAL_INTERVENTION_SPECIAL_TEST_FOR_A_BODY_PART.METHOD](APIConfig.SAVE_MEDICAL_INTERVENTION_SPECIAL_TEST_FOR_A_BODY_PART.URL(medicalInterventionId, bodyPartId), payload);
}

const DeleteBodyPartUnderMedicalInterventionSpecialTestAPICall = (medicalInterventionId: string, bodyPartId: string) => {
    // @ts-ignore
    return ApiService[APIConfig.DELETE_BODY_PART_UNDER_MEDICAL_INTERVENTION_SPECIAL_TEST.METHOD](APIConfig.DELETE_BODY_PART_UNDER_MEDICAL_INTERVENTION_SPECIAL_TEST.URL(medicalInterventionId, bodyPartId), {});
}

const SaveMedicalInterventionExerciseLogAPICall = (medicalInterventionId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.SAVE_MEDICAL_INTERVENTION_EXERCISE_LOG.METHOD](APIConfig.SAVE_MEDICAL_INTERVENTION_EXERCISE_LOG.URL(medicalInterventionId), payload);
}
const ChartNotesService = {
    MedicalRecordAddAPICall,
    MedicalInterventionBasicDetailsUpdateAPICall,
    FetchMedicalInterventionBasicDetailsAPICall,
    SaveMedicalInterventionROMConfigForABodyPartAPICall,
    DeleteBodyPartUnderMedicalInterventionROMConfigAPICall,
    SaveMedicalInterventionSpecialTestForABodyPartAPICall,
    DeleteBodyPartUnderMedicalInterventionSpecialTestAPICall,
    SaveMedicalInterventionExerciseLogAPICall
}
export default ChartNotesService;
