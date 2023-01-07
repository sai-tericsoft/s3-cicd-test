import {GET_CLIENT_FAVOURITE_CODES, SET_CLIENT_FAVOURITE_CODES} from "../actions/chart-notes.action";
import _ from "lodash";


export interface IChartNoteReducerState {
    isFavouriteCodeListLoading: boolean,
    isFavouriteCodeListLoaded: boolean,
    isFavouriteCodeListLoadingFailed: boolean,
    favouriteCodeList: any
}

const initialData: IChartNoteReducerState = {
    isFavouriteCodeListLoading: false,
    isFavouriteCodeListLoaded: false,
    isFavouriteCodeListLoadingFailed: false,
    favouriteCodeList: undefined
}

 const chartNoteReducer = (state: IChartNoteReducerState = initialData, action: any) => {
    switch (action.type) {
        case GET_CLIENT_FAVOURITE_CODES :
            state = {
                ...state,
                isFavouriteCodeListLoading: true,
                isFavouriteCodeListLoaded: false,
                isFavouriteCodeListLoadingFailed: false,
            };
            return state;
        case SET_CLIENT_FAVOURITE_CODES:
            console.log(action.payload, 'action.payload');
            state = {
                ...state,
                isFavouriteCodeListLoading: false,
                isFavouriteCodeListLoaded: !!action.payload.favouriteCodeList,
                isFavouriteCodeListLoadingFailed: !action.payload.favouriteCodeList,
                favouriteCodeList: action.payload.favouriteCodeList
            }
            return state;
        default:
            return state;
    }
}

export  default chartNoteReducer