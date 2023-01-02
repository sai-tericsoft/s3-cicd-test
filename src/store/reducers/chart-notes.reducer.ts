import {IActionModel} from "../../shared/models/action.model";
import {GET_MEDICAL_INTERVENTION_DETAILS, SET_MEDICAL_INTERVENTION_DETAILS} from "../actions/chart-notes.action";

export interface IChartNotesReducerState {
    isMedicalInterventionDetailsLoading: boolean,
    isMedicalInterventionDetailsLoaded: boolean,
    isMedicalInterventionDetailsLoadingFailed: boolean,
    medicalInterventionDetails?: any,
}

const initialData: IChartNotesReducerState = {
    isMedicalInterventionDetailsLoading: false,
    isMedicalInterventionDetailsLoaded: false,
    isMedicalInterventionDetailsLoadingFailed: false,
    medicalInterventionDetails: undefined
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
        default:
            return state;
    }
};

export default ChartNotesReducer;
