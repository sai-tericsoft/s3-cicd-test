import {IConsultationDuration} from "../../shared/models/static-data.model";

export const GET_CONSULTATION_DURATION_LIST = 'GET_CONSULTATION_DURATION_LIST';
export const SET_CONSULTATION_DURATION_LIST = 'SET_CONSULTATION_DURATION_LIST';

export const getConsultationDurationList = () => {
    return {type: GET_CONSULTATION_DURATION_LIST};
};
export const setConsultationDurationList = (consultationDurationList: IConsultationDuration[]) => {
    console.log(consultationDurationList);
    return {type: SET_CONSULTATION_DURATION_LIST,  payload: {
            consultationDurationList
        }};
};

