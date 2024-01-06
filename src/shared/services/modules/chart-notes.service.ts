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

const SaveMedicalInterventionROMConfigAPICall = (medicalInterventionId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.SAVE_MEDICAL_INTERVENTION_ROM_CONFIG.METHOD](APIConfig.SAVE_MEDICAL_INTERVENTION_ROM_CONFIG.URL(medicalInterventionId), payload);
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

const SaveMedicalInterventionSpecialTestAPICall = (medicalInterventionId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.SAVE_MEDICAL_INTERVENTION_SPECIAL_TEST_CONFIG.METHOD](APIConfig.SAVE_MEDICAL_INTERVENTION_SPECIAL_TEST_CONFIG.URL(medicalInterventionId), payload);
}

const ExerciseLogAttachmentListAPICall = (interventionId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.EXERCISE_LOG_ATTACHMENT_LIST.METHOD](APIConfig.EXERCISE_LOG_ATTACHMENT_LIST.URL(interventionId), payload)
}

const MedicalRecordFilesListAPICall = (medicalRecordId: string) => {
    // @ts-ignore
    return ApiService[APIConfig.GET_MEDICAL_RECORD_FILES_LIST.METHOD](APIConfig.GET_MEDICAL_RECORD_FILES_LIST.URL(medicalRecordId))
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

const SurgeryRecordDeleteAPICall = (surgeryRecordId: string) => {
    // @ts-ignore
    return ApiService[APIConfig.DELETE_SURGERY_RECORD.METHOD](APIConfig.DELETE_SURGERY_RECORD.URL(surgeryRecordId))
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

const FetchClientMedicalInterventionAPICall = (medicalInterventionId: string, payload: any) => {
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

const MedicalRecordSoapNoteListAPICall = (medicalRecordId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.GET_MEDICAL_RECORD_SOAP_NOTE_LIST.METHOD](APIConfig.GET_MEDICAL_RECORD_SOAP_NOTE_LIST.URL(medicalRecordId), {status: 'completed'});
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
    return ApiService[APIConfig.DRY_NEEDLING_FILE_ATTACHMENT_ADD.METHOD](APIConfig.DRY_NEEDLING_FILE_ATTACHMENT_ADD.URL(dryNeedlingFileId), payload, {'Content-Type': 'multipart/form-data'});
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
    return ApiService[APIConfig.CONCUSSION_FILE_ATTACHMENT_ADD.METHOD](APIConfig.CONCUSSION_FILE_ATTACHMENT_ADD.URL(concussionFileId), payload, {'Content-Type': 'multipart/form-data'});
}

const ConcussionFileDocumentDelete = (concussionFileId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.DELETE_CONCUSSION_DOCUMENT.METHOD](APIConfig.DELETE_CONCUSSION_DOCUMENT.URL(concussionFileId), payload);
}

const DryNeedlingDocumentDelete = (dryNeedlingFileId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.DELETE_DRY_NEEDLING_DOCUMENT.METHOD](APIConfig.DELETE_DRY_NEEDLING_DOCUMENT.URL(dryNeedlingFileId), payload);
}

const MedicalRecordDocumentAddAPICall = (medicalRecordId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.ADD_MEDICAL_RECORD_DOCUMENT.METHOD](APIConfig.ADD_MEDICAL_RECORD_DOCUMENT.URL(medicalRecordId), payload, {'Content-Type': 'multipart/form-data'});
}

const MedicalRecordDocumentEditAPICall = (medicalRecordDocumentId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.EDIT_MEDICAL_RECORD_DOCUMENT.METHOD](APIConfig.EDIT_MEDICAL_RECORD_DOCUMENT.URL(medicalRecordDocumentId), payload);
}

const MedicalRecordDocumentDetailsAPICall = (medicalRecordDocumentId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.MEDICAL_RECORD_DOCUMENT_DETAILS.METHOD](APIConfig.MEDICAL_RECORD_DOCUMENT_DETAILS.URL(medicalRecordDocumentId), payload);
}

const MedicalRecordDocumentDeleteAttachmentAPICall = (medicalRecordDocumentId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.MEDICAL_RECORD_DOCUMENT_ATTACHMENT_DELETE.METHOD](APIConfig.MEDICAL_RECORD_DOCUMENT_ATTACHMENT_DELETE.URL(medicalRecordDocumentId), payload);
}

const MedicalRecordDocumentAddAttachmentAPICall = (medicalRecordDocumentId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.MEDICAL_RECORD_DOCUMENT_ATTACHMENT_ADD.METHOD](APIConfig.MEDICAL_RECORD_DOCUMENT_ATTACHMENT_ADD.URL(medicalRecordDocumentId), payload, {'Content-Type': 'multipart/form-data'});
}

const MedicalRecordViewExerciseRecordPICall = (medicalRecordId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.MEDICAL_RECORD_VIEW_EXERCISE_LOG.METHOD](APIConfig.MEDICAL_RECORD_VIEW_EXERCISE_LOG.URL(medicalRecordId), payload, {'Content-Type': 'multipart/form-data'});
}

const MedicalRecordInterventionListAPICall = (medicalRecordId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.GET_MEDICAL_RECORD_INTERVENTION_LIST.METHOD](APIConfig.GET_MEDICAL_RECORD_INTERVENTION_LIST.URL(medicalRecordId), payload);
}
const ImportSoapNoteAPICall = (selectedInterventionId: string, medicalInterventionId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.IMPORT_SOAP_NOTE_API_CALL.METHOD](APIConfig.IMPORT_SOAP_NOTE_API_CALL.URL(selectedInterventionId, medicalInterventionId), payload);
}

const MedicalRecordConsolidatedInterventionAndAttachmentsListAPICall = (medicalRecordId: string) => {
    // @ts-ignore
    return ApiService[APIConfig.MEDICAL_RECORD_CONSOLIDATED_INTERVENTIONS_AND_ATTACHMENTS.METHOD](APIConfig.MEDICAL_RECORD_CONSOLIDATED_INTERVENTIONS_AND_ATTACHMENTS.URL(medicalRecordId));
}

const MedicalRecordListLiteAPICall = (clientId: string, payload: any = {}) => {
    // @ts-ignore
    return ApiService[APIConfig.MEDICAL_RECORD_LIST_LITE.METHOD](APIConfig.MEDICAL_RECORD_LIST_LITE.URL(clientId), payload);
}

const TransferMedicalRecordAPICall = (clientId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.TRANSFER_MEDICAL_RECORD.METHOD](APIConfig.TRANSFER_MEDICAL_RECORD.URL(clientId), payload);
}

const TransferSoapNoteAPICall = (medicalInterventionId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.TRANSFER_SOAP_NOTE.METHOD](APIConfig.TRANSFER_SOAP_NOTE.URL(medicalInterventionId), payload);
}

const MedicalInterventionNotifyAdminAPICall = (medicalInterventionId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.MEDICAL_INTERVENTION_NOTIFY_ADMIN.METHOD](APIConfig.MEDICAL_INTERVENTION_NOTIFY_ADMIN.URL(medicalInterventionId), payload);
}

const MedicalRecordNotifyAdminAPICall = (medicalRecordId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.MEDICAL_RECORD_NOTIFY_ADMIN.METHOD](APIConfig.MEDICAL_RECORD_NOTIFY_ADMIN.URL(medicalRecordId), payload);
}

const ReOpenMedicalRecordAPICall = (medicalRecordId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.RE_OPEN_MEDICAL_RECORD.METHOD](APIConfig.RE_OPEN_MEDICAL_RECORD.URL(medicalRecordId), payload);
}

const GetAllAddedICD11CodeList = (medicalRecordId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.GET_ADDED_ICD_CODES.METHOD](APIConfig.GET_ADDED_ICD_CODES.URL(medicalRecordId), payload);

}

const DiscardSoapNote = (interventionId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.DISCARD_SOAP_NOTE.METHOD](APIConfig.DISCARD_SOAP_NOTE.URL(interventionId), payload);
}

const DeleteDocument = (documentId: string) => {
// @ts-ignore
    return ApiService[APIConfig.DELETE_DOCUMENT.METHOD](APIConfig.DELETE_DOCUMENT.URL(documentId))
}

const PrintProgressReportAPICall = (progressReportId: any,payload:any) => {
    return ApiService[APIConfig.PRINT_PROGRESS_REPORT.METHOD](APIConfig.PRINT_PROGRESS_REPORT.URL(progressReportId),payload);
}

const GetCPTCodesAPICall = (interventionID: string, payload: any) => {
    return ApiService[APIConfig.GET_SELECTED_CPT_CODES.METHOD](APIConfig.GET_SELECTED_CPT_CODES.URL(interventionID), payload);
}
const getMedicalRecordActivityLogs = (medicalRecordId: string, payload: any) => {
    return ApiService[APIConfig.GET_MEDICAL_RECORD_ACTIVITY_LOGS.METHOD](APIConfig.GET_MEDICAL_RECORD_ACTIVITY_LOGS.URL(medicalRecordId), payload);
}

const PrintExerciseRecord = (medicalRecordId: string,payload:any) => {
    return ApiService[APIConfig.PRINT_EXERCISE_RECORD.METHOD](APIConfig.PRINT_EXERCISE_RECORD.URL(medicalRecordId),payload);
}

const PrintSurgeryRecord = (medicalRecordId:string,surgeryRecordId:string,payload:any) => {
    return ApiService[APIConfig.PRINT_SURGERY_RECORD.METHOD](APIConfig.PRINT_SURGERY_RECORD.URL(medicalRecordId,surgeryRecordId),payload);
}

const PrintDocument = (medicalRecordId:string,documentId:string,payload:any) => {
    return ApiService[APIConfig.PRINT_DOCUMENT.METHOD](APIConfig.PRINT_DOCUMENT.URL(medicalRecordId,documentId),payload);
}

const PrintExerciseLog = (medicalInterventionId:string,payload:any) => {
    return ApiService[APIConfig.PRINT_EXERCISE_LOG.METHOD](APIConfig.PRINT_EXERCISE_LOG.URL(medicalInterventionId),payload);
}

const DeleteProgressReport = (progressReportId:string) => {
    return ApiService[APIConfig.DELETE_PROGRESS_REPORT.METHOD](APIConfig.DELETE_PROGRESS_REPORT.URL(progressReportId));
}

const PrintInjuryConditionForm = (medicalRecordId:string,payload:any) => {
    return ApiService[APIConfig.PRINT_INJURY_CONDITION_FORM.METHOD](APIConfig.PRINT_INJURY_CONDITION_FORM.URL(medicalRecordId),payload);
}

const PrintSOAPNote = (medicalInterventionId:string,payload:any) => {
    return ApiService[APIConfig.PRINT_SOAP_NOTE.METHOD](APIConfig.PRINT_SOAP_NOTE.URL(medicalInterventionId),payload);
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
    FetchClientMedicalInterventionAPICall,
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
    MedicalRecordSoapNoteListAPICall,
    DryNeedlingFileEditAPICall,
    DryNeedlingFileDetailsAPICall,
    DryNeedlingFileDeleteAttachmentAPICall,
    DryNeedlingFileAddAttachmentAPICall,
    TransferSoapNoteAPICall,
    ConcussionFileAddAPICall,
    ConcussionFileEditAPICall,
    ConcussionFileDetailsAPICall,
    ConcussionFileDeleteAttachmentAPICall,
    ConcussionFileAddAttachmentAPICall,
    MedicalRecordDocumentAddAPICall,
    MedicalRecordDocumentEditAPICall,
    MedicalRecordDocumentDetailsAPICall,
    MedicalRecordDocumentDeleteAttachmentAPICall,
    MedicalRecordDocumentAddAttachmentAPICall,
    MedicalRecordViewExerciseRecordPICall,
    MedicalRecordInterventionListAPICall,
    ImportSoapNoteAPICall,
    MedicalRecordConsolidatedInterventionAndAttachmentsListAPICall,
    MedicalRecordListLiteAPICall,
    TransferMedicalRecordAPICall,
    MedicalInterventionNotifyAdminAPICall,
    MedicalRecordNotifyAdminAPICall,
    MedicalRecordFilesListAPICall,
    ReOpenMedicalRecordAPICall,
    GetAllAddedICD11CodeList,
    SaveMedicalInterventionROMConfigAPICall,
    DiscardSoapNote,
    SaveMedicalInterventionSpecialTestAPICall,
    DeleteDocument,
    SurgeryRecordDeleteAPICall,
    PrintProgressReportAPICall,
    GetCPTCodesAPICall,
    ConcussionFileDocumentDelete,
    DryNeedlingDocumentDelete,
    getMedicalRecordActivityLogs,
    PrintExerciseRecord,
    PrintSurgeryRecord,
    PrintDocument,
    PrintExerciseLog,
    DeleteProgressReport,
    PrintInjuryConditionForm,
    PrintSOAPNote
}

export default ChartNotesService;
