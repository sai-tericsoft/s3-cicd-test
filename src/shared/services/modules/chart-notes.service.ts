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

const AddExerciseLogAttachment = (interventionId: string, payload: any) => {
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
const RepeatLastInterventionAPICall = (medicalRecordId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.REPEAT_LAST_INTERVENTION.METHOD](APIConfig.REPEAT_LAST_INTERVENTION.URL(medicalRecordId), payload);
}

const AddNewMedicalInterventionAPICall = (medicalRecordId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.ADD_NEW_MEDICAL_INTERVENTION.METHOD](APIConfig.ADD_NEW_MEDICAL_INTERVENTION.URL(medicalRecordId), payload);
}

const ProgressReportViewDetailsAPICall = (interventionId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.PROGRESS_REPORT_VIEW_DETAILS.METHOD](APIConfig.PROGRESS_REPORT_VIEW_DETAILS.URL(interventionId), payload);
}

const SaveMedicalInterventionCPTCodesAPICall = (medicalInterventionId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.SAVE_MEDICAL_INTERVENTION_CPT_CODES.METHOD](APIConfig.SAVE_MEDICAL_INTERVENTION_CPT_CODES.URL(medicalInterventionId), payload);
}

const CheckoutAMedicalInterventionAPICall = (medicalInterventionId: string) => {
    // @ts-ignore
    return ApiService[APIConfig.CHECKOUT_MEDICAL_INTERVENTION.METHOD](APIConfig.CHECKOUT_MEDICAL_INTERVENTION.URL(medicalInterventionId));
}

const AddProgressReportUnderMedicalRecordAPICall = (medicalRecordId: string, payload: any) => {
    return ApiService[APIConfig.ADD_PROGRESS_REPORT_UNDER_MEDICAL_RECORD.METHOD](APIConfig.ADD_PROGRESS_REPORT_UNDER_MEDICAL_RECORD.URL(medicalRecordId), payload);
}

const UpdateProgressReportUnderMedicalRecordAPICall = (progressReportId: string, payload: any) => {
    return ApiService[APIConfig.UPDATE_PROGRESS_REPORT_UNDER_MEDICAL_RECORD.METHOD](APIConfig.UPDATE_PROGRESS_REPORT_UNDER_MEDICAL_RECORD.URL(progressReportId), payload);
}

const MedicalRecordProgressReportDetailsAPICall = (progressReportId: string, payload: any) => {
    return ApiService[APIConfig.GET_PROGRESS_REPORT_UNDER_MEDICAL_RECORD.METHOD](APIConfig.GET_PROGRESS_REPORT_UNDER_MEDICAL_RECORD.URL(progressReportId), payload);
}

const MedicalInterventionListAPICall = (medicalRecordId: string, payload: any) => {
    return ApiService[APIConfig.CLIENT_MEDICAL_INTERVENTION_LIST.METHOD](APIConfig.CLIENT_MEDICAL_INTERVENTION_LIST.URL(medicalRecordId), payload);
}

const MedicalRecordStatsAPICall = (medicalRecordId: string, payload: any) => {
    return ApiService[APIConfig.MEDICAL_RECORD_STATS.METHOD](APIConfig.MEDICAL_RECORD_STATS.URL(medicalRecordId), payload);
}

const DryNeedlingFileAddAPICall = (medicalInterventionId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.ADD_DRY_NEEDLING_FILE.METHOD](APIConfig.ADD_DRY_NEEDLING_FILE.URL(medicalInterventionId), payload, {'Content-Type': 'multipart/form-data'});
}

const DryNeedlingFileEditAPICall = (dryNeedlingFileId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.EDIT_DRY_NEEDLING_FILE.METHOD](APIConfig.EDIT_DRY_NEEDLING_FILE.URL(dryNeedlingFileId), payload);
}

const DryNeedlingFileDetailsAPICall = (dryNeedlingFileId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.DRY_NEEDLING_FILE_DETAILS.METHOD](APIConfig.DRY_NEEDLING_FILE_DETAILS.URL(dryNeedlingFileId), payload);
}

const DryNeedlingFileDeleteAttachmentAPICall = (dryNeedlingFileId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.DRY_NEEDLING_FILE_ATTACHMENT_DELETE.METHOD](APIConfig.DRY_NEEDLING_FILE_ATTACHMENT_DELETE.URL(dryNeedlingFileId), payload);
}

const DryNeedlingFileAddAttachmentAPICall = (dryNeedlingFileId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.DRY_NEEDLING_FILE_ATTACHMENT_ADD.METHOD](APIConfig.DRY_NEEDLING_FILE_ATTACHMENT_ADD.URL(dryNeedlingFileId), payload,{'Content-Type': 'multipart/form-data'});
}

const ConcussionFileAddAPICall = (medicalInterventionId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.ADD_CONCUSSION_FILE.METHOD](APIConfig.ADD_CONCUSSION_FILE.URL(medicalInterventionId), payload, {'Content-Type': 'multipart/form-data'});
}

const ConcussionFileEditAPICall = (concussionFileId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.EDIT_CONCUSSION_FILE.METHOD](APIConfig.EDIT_CONCUSSION_FILE.URL(concussionFileId), payload);
}

const ConcussionFileDetailsAPICall = (concussionFileId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CONCUSSION_FILE_DETAILS.METHOD](APIConfig.CONCUSSION_FILE_DETAILS.URL(concussionFileId), payload);
}

const ConcussionFileDeleteAttachmentAPICall = (concussionFileId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CONCUSSION_FILE_ATTACHMENT_DELETE.METHOD](APIConfig.CONCUSSION_FILE_ATTACHMENT_DELETE.URL(concussionFileId), payload);
}

const ConcussionFileAddAttachmentAPICall = (concussionFileId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CONCUSSION_FILE_ATTACHMENT_ADD.METHOD](APIConfig.CONCUSSION_FILE_ATTACHMENT_ADD.URL(concussionFileId), payload,{'Content-Type': 'multipart/form-data'});
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
    UpdateProgressReportUnderMedicalRecordAPICall,
    RepeatLastInterventionAPICall,
    AddNewMedicalInterventionAPICall,
    ProgressReportViewDetailsAPICall,
    SaveMedicalInterventionCPTCodesAPICall,
    CheckoutAMedicalInterventionAPICall,
    MedicalRecordProgressReportDetailsAPICall,
    MedicalInterventionListAPICall,
    MedicalRecordStatsAPICall,
    DryNeedlingFileAddAPICall,
    DryNeedlingFileEditAPICall,
    DryNeedlingFileDetailsAPICall,
    DryNeedlingFileDeleteAttachmentAPICall,
    DryNeedlingFileAddAttachmentAPICall,
    ConcussionFileAddAPICall,
    ConcussionFileEditAPICall,
    ConcussionFileDetailsAPICall,
    ConcussionFileDeleteAttachmentAPICall,
    ConcussionFileAddAttachmentAPICall
}

export default ChartNotesService;
