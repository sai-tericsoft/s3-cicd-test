import {IActionModel} from "../../shared/models/action.model";
import {
    IClientAccountDetails,
    IClientBasicDetails,
    IClientMedicalDetails
} from "../../shared/models/client.model";
import {
    GET_CLIENT_ACCOUNT_DETAILS,
    GET_CLIENT_BASIC_DETAILS,
    GET_CLIENT_MEDICAL_DETAILS, SET_CLIENT_ACCOUNT_DETAILS,
    SET_CLIENT_BASIC_DETAILS,
    SET_CLIENT_MEDICAL_DETAILS
} from "../actions/client.action";

export interface IClientReducerState {
    isClientBasicDetailsLoading: boolean,
    isClientBasicDetailsLoaded: boolean,
    isClientBasicDetailsLoadingFailed: boolean,
    clientBasicDetails?: IClientBasicDetails,
    isClientMedicalDetailsLoading: boolean,
    isClientMedicalDetailsLoaded: boolean,
    isClientMedicalDetailsLoadingFailed: boolean,
    clientMedicalDetails?: IClientMedicalDetails,
    isClientAccountDetailsLoading: boolean,
    isClientAccountDetailsLoaded: boolean,
    isClientAccountDetailsLoadingFailed: boolean,
    clientAccountDetails?: IClientAccountDetails,
}


const initialData: IClientReducerState = {
    isClientBasicDetailsLoading: false,
    isClientBasicDetailsLoaded: false,
    isClientBasicDetailsLoadingFailed: false,
    clientBasicDetails: undefined,
    isClientMedicalDetailsLoading: false,
    isClientMedicalDetailsLoaded: false,
    isClientMedicalDetailsLoadingFailed: false,
    clientMedicalDetails: undefined,
    isClientAccountDetailsLoading: false,
    isClientAccountDetailsLoaded: false,
    isClientAccountDetailsLoadingFailed: false,
    clientAccountDetails: undefined,
};

const ClientReducer = (state = initialData, action: IActionModel): IClientReducerState => {
    switch (action.type) {
        case GET_CLIENT_BASIC_DETAILS:
            state = {
                ...state,
                isClientBasicDetailsLoading: true,
                isClientBasicDetailsLoaded: false,
                isClientBasicDetailsLoadingFailed: false,
            };
            return state;
        case SET_CLIENT_BASIC_DETAILS:
            state = {
                ...state,
                isClientBasicDetailsLoading: false,
                isClientBasicDetailsLoaded: !!action.payload.clientBasicDetails,
                isClientBasicDetailsLoadingFailed: !action.payload.clientBasicDetails,
                clientBasicDetails: action.payload.clientBasicDetails
            };
            return state;
        case GET_CLIENT_MEDICAL_DETAILS:
            state = {
                ...state,
                isClientMedicalDetailsLoading: true,
                isClientMedicalDetailsLoaded: false,
                isClientMedicalDetailsLoadingFailed: false,
            };
            return state;
        case SET_CLIENT_MEDICAL_DETAILS:
            state = {
                ...state,
                isClientMedicalDetailsLoading: false,
                isClientMedicalDetailsLoaded: !!action.payload.clientMedicalDetails,
                isClientMedicalDetailsLoadingFailed: !action.payload.clientMedicalDetails,
                clientMedicalDetails: action.payload.clientMedicalDetails
            };
            return state;
        case GET_CLIENT_ACCOUNT_DETAILS:
            state = {
                ...state,
                isClientAccountDetailsLoading: true,
                isClientAccountDetailsLoaded: false,
                isClientAccountDetailsLoadingFailed: false,
            };
            return state;
        case SET_CLIENT_ACCOUNT_DETAILS:
            state = {
                ...state,
                isClientAccountDetailsLoading: false,
                isClientAccountDetailsLoaded: !!action.payload.clientAccountDetails,
                isClientAccountDetailsLoadingFailed: !action.payload.clientAccountDetails,
                clientAccountDetails: action.payload.clientAccountDetails
            };
            return state;
        default:
            return state;
    }
};

export default ClientReducer;
