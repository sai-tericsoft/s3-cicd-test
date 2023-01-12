import {IActionModel} from "../../shared/models/action.model";
import {
    GET_INTERVENTION_ATTACHMENT_LIST,
    GET_MEDICAL_INTERVENTION_DETAILS, SET_INTERVENTION_ATTACHMENT_LIST,
    GET_CLIENT_MEDICAL_INTERVENTION_DETAILS,
    SET_CLIENT_MEDICAL_INTERVENTION_DETAILS,
    SET_MEDICAL_INTERVENTION_DETAILS, GET_PROGRESS_REPORT_VIEW_DETAILS, SET_PROGRESS_REPORT_VIEW_DETAILS
} from "../actions/chart-notes.action";

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

};

const ChartNotesReducer = (state = initialData, action: IActionModel): IChartNotesReducerState => {
    switch (action.type) {
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
                isAttachmentListLoading:false,
                isAttachmentListLoaded:!!action.payload.interventionAttachmentList,
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

        default:
            return state;
    }
};

export default ChartNotesReducer;
