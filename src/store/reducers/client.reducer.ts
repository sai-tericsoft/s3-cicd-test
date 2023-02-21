import {IActionModel} from "../../shared/models/action.model";
import {
    IClientAccountDetails,
    IClientBasicDetails,
    IClientMedicalDetails, IClientMedicalRecord
} from "../../shared/models/client.model";
import {
    GET_CLIENT_ACCOUNT_DETAILS,
    GET_CLIENT_BASIC_DETAILS,
    GET_CLIENT_MEDICAL_DETAILS,
    GET_CLIENT_MEDICAL_RECORD,
    SET_CLIENT_MEDICAL_RECORD,
    SET_CLIENT_ACCOUNT_DETAILS,
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
    clientMedicalRecord?: IClientMedicalRecord,
    isClientAccountDetailsLoading: boolean,
    isClientAccountDetailsLoaded: boolean,
    isClientAccountDetailsLoadingFailed: boolean,
    clientAccountDetails?: IClientAccountDetails,
    isClientMedicalRecordLoading: boolean,
    isClientMedicalRecordLoaded: boolean,
    isClientMedicalRecordLoadingFailed: boolean,
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
    clientMedicalRecord: undefined,
    isClientAccountDetailsLoading: false,
    isClientAccountDetailsLoaded: false,
    isClientAccountDetailsLoadingFailed: false,
    clientAccountDetails: undefined,
    isClientMedicalRecordLoading: false,
    isClientMedicalRecordLoaded: false,
    isClientMedicalRecordLoadingFailed: false,

};

const ClientReducer = (state = initialData, action: IActionModel): IClientReducerState => {
    switch (action.type) {
        case GET_CLIENT_BASIC_DETAILS:
            state = {
                ...state,
                clientBasicDetails: undefined,
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

        case GET_CLIENT_MEDICAL_RECORD:
            state = {
                ...state,
                isClientMedicalRecordLoading: true,
                isClientMedicalRecordLoaded: false,
                isClientMedicalRecordLoadingFailed: false,
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
        case SET_CLIENT_MEDICAL_RECORD:
            state = {
                ...state,
                isClientMedicalRecordLoading: false,
                isClientMedicalRecordLoaded: !!action.payload.clientMedicalRecord,
                isClientMedicalRecordLoadingFailed: !action.payload.clientMedicalRecord,
                clientMedicalRecord: action.payload.clientMedicalRecord
            };
            return state;
        default:
            return state;
    }
};

export default ClientReducer;
