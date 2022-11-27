import {GET_CONSULTATION_DURATION_LIST, SET_CONSULTATION_DURATION_LIST} from "../actions/static-data.action";
import {IActionModel} from "../../shared/models/action.model";

export interface IStaticDataReducerState {
    isConsultationDurationListLoading: boolean,
    isConsultationDurationListLoaded: boolean,
    consultationDurationList: any[],
}


const initialData: IStaticDataReducerState = {
    isConsultationDurationListLoading: false,
    isConsultationDurationListLoaded: false,
    consultationDurationList: [],
};

const StaticDataReducer = (state = initialData, action: IActionModel): IStaticDataReducerState => {
    switch (action.type) {
        case GET_CONSULTATION_DURATION_LIST:
            state = {
                ...state,
                isConsultationDurationListLoading: true,
                isConsultationDurationListLoaded: false,
            };
            return state;
        case SET_CONSULTATION_DURATION_LIST:
            state = {
                ...state,
                isConsultationDurationListLoading: false,
                isConsultationDurationListLoaded: true,
                consultationDurationList: action.payload.consultationDurationList
            };
            return state;
        default:
            return state;
    }
};

export default StaticDataReducer;
