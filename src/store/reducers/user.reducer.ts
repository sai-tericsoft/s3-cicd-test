import {IActionModel} from "../../shared/models/action.model";
import {IUser} from "../../shared/models/user.model";
import {
    GET_ALL_PROVIDERS_LIST,
    GET_USER_BASIC_DETAILS,
    SET_ALL_PROVIDERS_LIST,
    SET_USER_BASIC_DETAILS,
} from "../actions/user.action";

export interface IUserReducerState {
    allProvidersList: IUser[],
    isAllProvidersListLoading: boolean,
    isAllProvidersListLoaded: boolean,

    userBasicDetails?: any,
    isUserBasicDetailsLoading: boolean,
    isUserBasicDetailsLoaded: boolean,
    isUserBasicDetailsLoadingFailed: boolean,
}


const initialData: IUserReducerState = {
    allProvidersList: [],
    isAllProvidersListLoading: false,
    isAllProvidersListLoaded: false,

    userBasicDetails: undefined,
    isUserBasicDetailsLoading: false,
    isUserBasicDetailsLoaded: false,
    isUserBasicDetailsLoadingFailed: false,
};

const UserReducer = (state = initialData, action: IActionModel): IUserReducerState => {
    switch (action.type) {
        case GET_ALL_PROVIDERS_LIST:
            state = {
                ...state,
                isAllProvidersListLoading: true,
                isAllProvidersListLoaded: false,
            };
            return state;
        case SET_ALL_PROVIDERS_LIST:
            state = {
                ...state,
                isAllProvidersListLoading: false,
                isAllProvidersListLoaded: true,
                allProvidersList: action.payload.allProvidersList
            };
            return state;
        case GET_USER_BASIC_DETAILS:
            state = {
                ...state,
                userBasicDetails: undefined,
                isUserBasicDetailsLoading: true,
                isUserBasicDetailsLoaded: false,
                isUserBasicDetailsLoadingFailed: false,
            };
            return state;
        case SET_USER_BASIC_DETAILS:
            state = {
                ...state,
                isUserBasicDetailsLoading: false,
                isUserBasicDetailsLoaded: !!action.payload.userBasicDetails,
                isUserBasicDetailsLoadingFailed: !action.payload.userBasicDetails,
                userBasicDetails: action.payload.userBasicDetails
            };
            return state;
        default:
            return state;
    }
};

export default UserReducer;
