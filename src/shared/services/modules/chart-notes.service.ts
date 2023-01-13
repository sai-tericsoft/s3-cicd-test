import {ApiService} from "../index";
import {APIConfig} from "../../../constants";

const MedicalRecordAddAPICall = (clientId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.MEDICAL_RECORD_ADD.METHOD](APIConfig.MEDICAL_RECORD_ADD.URL(clientId), payload, {'Content-Type': 'multipart/form-data'});
}
const MedicalRecordEditAPICall = (medicalId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.MEDICAL_RECORD_EDIT.METHOD](APIConfig.MEDICAL_RECORD_EDIT.URL(medicalId), payload);
}
const MedicalRecordDetailsAPICall = (medicalId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CLIENT_MEDICAL_DETAIL.METHOD](APIConfig.CLIENT_MEDICAL_DETAIL.URL(medicalId), payload);
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

const ExerciseLogAttachmentListAPICall = (interventionId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.EXERCISE_LOG_ATTACHMENT_LIST.METHOD](APIConfig.EXERCISE_LOG_ATTACHMENT_LIST.URL(interventionId), payload)
}

const RemoveExerciseLogAttachmentAPICall = (attachmentId: string, id: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.REMOVE_ATTACHMENT.METHOD](APIConfig.REMOVE_ATTACHMENT.URL(attachmentId, id), payload)
}

const SaveMedicalInterventionExerciseLogAPICall = (medicalInterventionId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.SAVE_MEDICAL_INTERVENTION_EXERCISE_LOG.METHOD](APIConfig.SAVE_MEDICAL_INTERVENTION_EXERCISE_LOG.URL(medicalInterventionId), payload);
}


const AddSurgeryRecordAPICall = (medicalRecordId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.ADD_SURGERY_RECORD.METHOD](APIConfig.ADD_SURGERY_RECORD.URL(medicalRecordId), payload, {'Content-Type': 'multipart/form-data'});
}
const UpdateSurgeryRecordAPICall = (surgeryRecordId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.UPDATE_SURGERY_RECORD.METHOD](APIConfig.UPDATE_SURGERY_RECORD.URL(surgeryRecordId), payload);
}

const AddSurgeryRecordAttachmentAPICall = (surgeryRecordId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.ADD_SURGERY_RECORD_ATTACHMENT.METHOD](APIConfig.ADD_SURGERY_RECORD_ATTACHMENT.URL(surgeryRecordId), payload, {'Content-Type': 'multipart/form-data'})
}
const RemoveSurgeryRecordAttachmentAPICall = (surgeryRecordId: string, attachmentId: string) => {
    // @ts-ignore
    return ApiService[APIConfig.REMOVE_SURGERY_RECORD_ATTACHMENT.METHOD](APIConfig.REMOVE_SURGERY_RECORD_ATTACHMENT.URL(surgeryRecordId, attachmentId))
}

const FetchSurgeryRecordAPICall = (surgeryRecordId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.GET_SURGERY_RECORD.METHOD](APIConfig.GET_SURGERY_RECORD.URL(surgeryRecordId), payload);
}


const AddExerciseLogAttachment = (interventionId: string | undefined, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.ADD_EXERCISE_LOG_ATTACHMENT.METHOD](APIConfig.ADD_EXERCISE_LOG_ATTACHMENT.URL(interventionId), payload, {'Content-Type': 'multipart/form-data'});
}
const FetchMedicalInterventionExerciseLogAPICall = (medicalInterventionId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.GET_MEDICAL_INTERVENTION_EXERCISE_LOG_DETAILS.METHOD](APIConfig.GET_MEDICAL_INTERVENTION_EXERCISE_LOG_DETAILS.URL(medicalInterventionId), payload);
}

const FetchClientMedicalInterventionEAPICall = (medicalInterventionId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.GET_CLIENT_MEDICAL_INTERVENTION_DETAILS.METHOD](APIConfig.GET_CLIENT_MEDICAL_INTERVENTION_DETAILS.URL(medicalInterventionId), payload);
}

const AddMedicalInterventionICDCodesAPICall = (medicalInterventionId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.SAVE_MEDICAL_INTERVENTION_ICD_CODES.METHOD](APIConfig.SAVE_MEDICAL_INTERVENTION_ICD_CODES.URL(medicalInterventionId), payload);
}

const AddProgressReportUnderMedicalRecordAPICall = (medicalRecordId: string, payload: any) => {
    return ApiService[APIConfig.ADD_PROGRESS_REPORT_UNDER_MEDICAL_RECORD.METHOD](APIConfig.ADD_PROGRESS_REPORT_UNDER_MEDICAL_RECORD.URL(medicalRecordId), payload);
}

const UpdateProgressReportUnderMedicalRecordAPICall = (progressReportId: string, payload: any) => {
    return ApiService[APIConfig.UPDATE_PROGRESS_REPORT_UNDER_MEDICAL_RECORD.METHOD](APIConfig.UPDATE_PROGRESS_REPORT_UNDER_MEDICAL_RECORD.URL(progressReportId), payload);
}

const ChartNotesService = {
    MedicalRecordAddAPICall,
    MedicalRecordEditAPICall,
    MedicalRecordDetailsAPICall,
    MedicalInterventionBasicDetailsUpdateAPICall,
    FetchMedicalInterventionBasicDetailsAPICall,
    SaveMedicalInterventionROMConfigForABodyPartAPICall,
    DeleteBodyPartUnderMedicalInterventionROMConfigAPICall,
    SaveMedicalInterventionSpecialTestForABodyPartAPICall,
    DeleteBodyPartUnderMedicalInterventionSpecialTestAPICall,
    ExerciseLogAttachmentListAPICall,
    RemoveExerciseLogAttachmentAPICall,
    SaveMedicalInterventionExerciseLogAPICall,
    AddExerciseLogAttachment,
    FetchMedicalInterventionExerciseLogAPICall,
    FetchClientMedicalInterventionEAPICall,
    AddMedicalInterventionICDCodesAPICall,
    AddSurgeryRecordAPICall,
    FetchSurgeryRecordAPICall,
    AddSurgeryRecordAttachmentAPICall,
    UpdateSurgeryRecordAPICall,
    RemoveSurgeryRecordAttachmentAPICall,
    AddProgressReportUnderMedicalRecordAPICall,
    UpdateProgressReportUnderMedicalRecordAPICall
}

export default ChartNotesService;
