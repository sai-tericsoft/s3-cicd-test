import {IActionModel} from "../../shared/models/action.model";
import {
    GET_CLIENT_MEDICAL_INTERVENTION_DETAILS,
    GET_INTERVENTION_ATTACHMENT_LIST,
    GET_MEDICAL_INTERVENTION_DETAILS,
    GET_MEDICAL_INTERVENTION_LIST,
    GET_MEDICAL_RECORD_PROGRESS_REPORT_DETAILS,
    GET_MEDICAL_RECORD_STATS,
    GET_PROGRESS_REPORT_VIEW_DETAILS,
    REFRESH_MEDICAL_RECORD_ATTACHMENT_LIST,
    SET_CLIENT_MEDICAL_INTERVENTION_DETAILS,
    SET_INTERVENTION_ATTACHMENT_LIST,
    SET_MEDICAL_INTERVENTION_DETAILS,
    SET_MEDICAL_INTERVENTION_LIST,
    SET_MEDICAL_RECORD_PROGRESS_REPORT_DETAILS,
    SET_PROGRESS_REPORT_VIEW_DETAILS,
    SET_MEDICAL_RECORD_STATS,
    GET_MEDICAL_RECORD_VIEW_EXERCISE_RECORD,
    SET_MEDICAL_RECORD_VIEW_EXERCISE_RECORD,
    GET_MEDICAL_RECORD_SOAP_NOTE_LIST,
    SET_MEDICAL_RECORD_SOAP_NOTE_LIST
} from "../actions/chart-notes.action";
import {CommonService} from "../../shared/services";

export interface IChartNotesReducerState {
    isMedicalInterventionDetailsLoading: boolean,
    isMedicalInterventionDetailsLoaded: boolean,
    isMedicalInterventionDetailsLoadingFailed: boolean,
    medicalInterventionDetails?: any,
    isAttachmentListLoading: boolean,
    isAttachmentListLoaded: boolean,
    isAttachmentListLoadingFailed: boolean,
    attachmentList?: any,
    isClientMedicalInterventionDetailsLoading: boolean,
    isClientMedicalInterventionDetailsLoaded: boolean,
    isClientMedicalInterventionDetailsLoadingFailed: boolean,
    clientMedicalInterventionDetails?: any,
    isProgressReportDetailsLoading: boolean,
    isProgressReportDetailsLoaded: boolean,
    isProgressReportDetailsLoadingFailed: boolean,
    progressReportDetails?: any,
    isClientMedicalRecordProgressReportDetailsLoading: boolean,
    isClientMedicalRecordProgressReportDetailsLoaded: boolean,
    isClientMedicalRecordProgressReportDetailsLoadingFailed: boolean,
    clientMedicalRecordProgressReportDetails?: any,
    isMedicalInterventionListLoading: boolean,
    isMedicalInterventionListLoaded: boolean,
    isMedicalInterventionListLoadingFailed: boolean,
    medicalInterventionList?: any,
    isMedicalRecordStatsLoading: boolean,
    isMedicalRecordStatsLoaded: boolean,
    isMedicalRecordStatsLoadingFailed: boolean,
    medicalRecordStats: any[],
    refreshTokenForMedicalRecordAttachments: string,
    isMedicalRecordViewExerciseRecordLoading: boolean,
    isMedicalRecordViewExerciseRecordLoaded: boolean,
    isMedicalRecordViewExerciseRecordLoadingFailed: boolean,
    medicalRecordViewExerciseRecord: any,
    isMedicalRecordSoapNoteListLoading: boolean,
    isMedicalRecordSoapNoteListLoaded: boolean,
    isMedicalRecordSoapNoteListLoadingFailed: boolean,
    medicalRecordSoapNoteList?: any,
}

const initialData: IChartNotesReducerState = {
    isMedicalInterventionDetailsLoading: false,
    isMedicalInterventionDetailsLoaded: false,
    isMedicalInterventionDetailsLoadingFailed: false,
    medicalInterventionDetails: undefined,
    isAttachmentListLoading: false,
    isAttachmentListLoaded: false,
    isAttachmentListLoadingFailed: false,
    attachmentList: undefined,
    isClientMedicalInterventionDetailsLoading: false,
    isClientMedicalInterventionDetailsLoaded: false,
    isClientMedicalInterventionDetailsLoadingFailed: false,
    clientMedicalInterventionDetails: undefined,
    isProgressReportDetailsLoading: false,
    isProgressReportDetailsLoaded: false,
    isProgressReportDetailsLoadingFailed: false,
    progressReportDetails: undefined,
    isClientMedicalRecordProgressReportDetailsLoading: false,
    isClientMedicalRecordProgressReportDetailsLoaded: false,
    isClientMedicalRecordProgressReportDetailsLoadingFailed: false,
    clientMedicalRecordProgressReportDetails: undefined,
    isMedicalInterventionListLoading: false,
    isMedicalInterventionListLoaded: false,
    isMedicalInterventionListLoadingFailed: false,
    medicalInterventionList: [],
    isMedicalRecordStatsLoading: false,
    isMedicalRecordStatsLoaded: false,
    isMedicalRecordStatsLoadingFailed: false,
    medicalRecordStats: [],
    refreshTokenForMedicalRecordAttachments: CommonService.getRandomID(3),
    isMedicalRecordViewExerciseRecordLoading: false,
    isMedicalRecordViewExerciseRecordLoaded: false,
    isMedicalRecordViewExerciseRecordLoadingFailed: false,
    medicalRecordViewExerciseRecord: undefined,
    isMedicalRecordSoapNoteListLoading: false,
    isMedicalRecordSoapNoteListLoaded: false,
    isMedicalRecordSoapNoteListLoadingFailed: false,
    medicalRecordSoapNoteList: [],
};

const ChartNotesReducer = (state = initialData, action: IActionModel): IChartNotesReducerState => {
    switch (action.type) {
        case REFRESH_MEDICAL_RECORD_ATTACHMENT_LIST:
            state = {...state, refreshTokenForMedicalRecordAttachments: CommonService.getRandomID(3)}
            return state;
        case GET_MEDICAL_INTERVENTION_DETAILS:
            state = {
                ...state,
                isMedicalInterventionDetailsLoading: true,
                isMedicalInterventionDetailsLoaded: false,
                isMedicalInterventionDetailsLoadingFailed: false,
            };
            return state;
        case SET_MEDICAL_INTERVENTION_DETAILS:
            state = {
                ...state,
                isMedicalInterventionDetailsLoading: false,
                isMedicalInterventionDetailsLoaded: !!action.payload.medicalInterventionDetails,
                isMedicalInterventionDetailsLoadingFailed: !action.payload.medicalInterventionDetails,
                medicalInterventionDetails: action.payload.medicalInterventionDetails
            };
            return state;
        case GET_INTERVENTION_ATTACHMENT_LIST :
            state = {
                ...state,
                isAttachmentListLoading: true,
                isAttachmentListLoaded: false,
                isAttachmentListLoadingFailed: false
            }
            return state;
        case SET_INTERVENTION_ATTACHMENT_LIST :
            console.log(action.payload)
            state = {
                ...state,
                isAttachmentListLoading: false,
                isAttachmentListLoaded: !!action.payload.interventionAttachmentList,
                isAttachmentListLoadingFailed: !action.payload.interventionAttachmentList,
                attachmentList: action.payload.interventionAttachmentList
            }
            return state;
        case GET_CLIENT_MEDICAL_INTERVENTION_DETAILS:
            state = {
                ...state,
                isClientMedicalInterventionDetailsLoading: true,
                isClientMedicalInterventionDetailsLoaded: false,
                isClientMedicalInterventionDetailsLoadingFailed: false,
            };
            return state;
        case SET_CLIENT_MEDICAL_INTERVENTION_DETAILS:
            state = {
                ...state,
                isClientMedicalInterventionDetailsLoading: false,
                isClientMedicalInterventionDetailsLoaded: !!action.payload.clientMedicalInterventionDetails,
                isClientMedicalInterventionDetailsLoadingFailed: !action.payload.clientMedicalInterventionDetails,
                clientMedicalInterventionDetails: action.payload.clientMedicalInterventionDetails
            };
            return state;
        case GET_MEDICAL_RECORD_PROGRESS_REPORT_DETAILS:
            state = {
                ...state,
                isClientMedicalRecordProgressReportDetailsLoading: true,
                isClientMedicalRecordProgressReportDetailsLoaded: false,
                isClientMedicalRecordProgressReportDetailsLoadingFailed: false,
            };
            return state;
        case SET_MEDICAL_RECORD_PROGRESS_REPORT_DETAILS:
            state = {
                ...state,
                isClientMedicalRecordProgressReportDetailsLoading: false,
                isClientMedicalRecordProgressReportDetailsLoaded: !!action.payload.clientMedicalRecordProgressReportDetails,
                isClientMedicalRecordProgressReportDetailsLoadingFailed: !action.payload.clientMedicalRecordProgressReportDetails,
                clientMedicalRecordProgressReportDetails: action.payload.clientMedicalRecordProgressReportDetails
            };
            return state;
        case GET_PROGRESS_REPORT_VIEW_DETAILS:
            state = {
                ...state,
                isProgressReportDetailsLoading: true,
                isProgressReportDetailsLoaded: false,
                isProgressReportDetailsLoadingFailed: false,
            }
            return state;

        case SET_PROGRESS_REPORT_VIEW_DETAILS:
            state = {
                ...state,
                isProgressReportDetailsLoading: false,
                isProgressReportDetailsLoaded: !!action.payload.progressReportDetails,
                isProgressReportDetailsLoadingFailed: !action.payload.progressReportDetails,
                progressReportDetails: action.payload.progressReportDetails
            }
            return state;
        case GET_MEDICAL_INTERVENTION_LIST:
            state = {
                ...state,
                isMedicalInterventionListLoading: true,
                isMedicalInterventionListLoaded: false,
                isMedicalInterventionListLoadingFailed: false,
            };
            return state;
        case SET_MEDICAL_INTERVENTION_LIST:
            state = {
                ...state,
                isMedicalInterventionListLoading: false,
                isMedicalInterventionListLoaded: !!action.payload.medicalInterventionList,
                isMedicalInterventionListLoadingFailed: !action.payload.medicalInterventionList,
                medicalInterventionList: action.payload.medicalInterventionList
            };
            return state;
        case GET_MEDICAL_RECORD_STATS:
            state = {
                ...state,
                isMedicalRecordStatsLoading: true,
                isMedicalRecordStatsLoaded: false,
                isMedicalRecordStatsLoadingFailed: false,
            };
            return state;
        case SET_MEDICAL_RECORD_STATS:
            state = {
                ...state,
                isMedicalRecordStatsLoading: false,
                isMedicalRecordStatsLoaded: !!action.payload.medicalRecordStats,
                isMedicalRecordStatsLoadingFailed: !action.payload.medicalRecordStats,
                medicalRecordStats: action.payload.medicalRecordStats,
            };
            return state;
        case GET_MEDICAL_RECORD_VIEW_EXERCISE_RECORD:
            state = {
                ...state,
                isMedicalRecordViewExerciseRecordLoading: true,
                isMedicalRecordViewExerciseRecordLoaded: false,
                isMedicalRecordViewExerciseRecordLoadingFailed: false,
            }
            return state;
        case SET_MEDICAL_RECORD_VIEW_EXERCISE_RECORD:
            state = {
                ...state,
                isMedicalRecordViewExerciseRecordLoading: false,
                isMedicalRecordViewExerciseRecordLoaded: !!action.payload.medicalRecordViewExerciseRecord,
                isMedicalRecordViewExerciseRecordLoadingFailed: !action.payload.medicalRecordViewExerciseRecord,
                medicalRecordViewExerciseRecord: action.payload.medicalRecordViewExerciseRecord
            }
            return state;
        case GET_MEDICAL_RECORD_SOAP_NOTE_LIST:
            state = {
                ...state,
                isMedicalRecordSoapNoteListLoading: true,
                isMedicalRecordSoapNoteListLoaded: false,
                isMedicalRecordSoapNoteListLoadingFailed: false,
            }
            return state;
        case SET_MEDICAL_RECORD_SOAP_NOTE_LIST:
            state = {
                ...state,
                isMedicalRecordSoapNoteListLoading: false,
                isMedicalRecordSoapNoteListLoaded: !!action.payload.medicalRecordSoapNoteList,
                isMedicalRecordSoapNoteListLoadingFailed: !action.payload.medicalRecordSoapNoteList,
                medicalRecordSoapNoteList: action.payload.medicalRecordSoapNoteList
            }
            return state;
        default:
            return state;
    }
};

export default ChartNotesReducer;
