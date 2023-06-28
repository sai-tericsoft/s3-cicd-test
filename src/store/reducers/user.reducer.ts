import {IActionModel} from "../../shared/models/action.model";
import {IUser} from "../../shared/models/user.model";
import {
    GET_ALL_PROVIDERS_LIST,
    GET_USER_BASIC_DETAILS,
    GET_USER_SLOTS,
    SET_ALL_PROVIDERS_LIST,
    SET_USER_BASIC_DETAILS,
    SET_USER_SLOTS,
} from "../actions/user.action";

export interface IUserReducerState {
    allProvidersList: IUser[],
    isAllProvidersListLoading: boolean,
    isAllProvidersListLoaded: boolean,

    userBasicDetails?: any,
    isUserBasicDetailsLoading: boolean,
    isUserBasicDetailsLoaded: boolean,
    isUserBasicDetailsLoadingFailed: boolean,

    userSlots?: any
    isUserSlotsLoading: boolean,
    isUserSlotsLoaded: boolean,
    isUserSlotsLoadingFailed: boolean,
}


const initialData: IUserReducerState = {
    allProvidersList: [],
    isAllProvidersListLoading: false,
    isAllProvidersListLoaded: false,

    userBasicDetails: undefined,
    isUserBasicDetailsLoading: false,
    isUserBasicDetailsLoaded: false,
    isUserBasicDetailsLoadingFailed: false,

    userSlots: [],
    isUserSlotsLoading: false,
    isUserSlotsLoaded: false,
    isUserSlotsLoadingFailed: false,
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

        case GET_USER_SLOTS:
            state = {
                ...state,
                userSlots: undefined,
                isUserSlotsLoading: true,
                isUserSlotsLoaded: false,
                isUserSlotsLoadingFailed: false,
            };
            return state;
        case SET_USER_SLOTS:
            state = {
                ...state,
                isUserSlotsLoading: false,
                isUserSlotsLoaded: !!action.payload.userSlots,
                isUserSlotsLoadingFailed: !action.payload.userSlots,
                userSlots: action.payload.userSlots
            };
            return state;
        default:
            return state;
    }
};

export default UserReducer;
