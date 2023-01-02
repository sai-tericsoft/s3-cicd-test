import {ApiService} from "../index";
import {APIConfig} from "../../../constants";
import RouteConfigService from "../route-config.service";
import {IClientDetailsSteps, IClientFormSteps} from "../../models/client.model";

const ClientBasicDetailsAPICall = (clientId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CLIENT_BASIC_DETAILS.METHOD](APIConfig.CLIENT_BASIC_DETAILS.URL(clientId), payload);
}

const ClientMedicalDetailsApiCall=(clientId: string, payload: any)=>{
    // @ts-ignore
    return ApiService[APIConfig.CLIENT_MEDICAL_DETAILS.METHOD](APIConfig.CLIENT_MEDICAL_DETAILS.URL(clientId), payload);
}

const ClientMedicalRecordApiCall=(clientId: string, payload: any)=>{
    // @ts-ignore
    return ApiService[APIConfig.CLIENT_MEDICAL_RECORD.METHOD](APIConfig.CLIENT_MEDICAL_RECORD.URL(clientId), payload);
}


const ClientAccountDetailsApiCall=(clientId: string, payload: any)=>{
    // @ts-ignore
    return ApiService[APIConfig.CLIENT_ACCOUNT_DETAILS.METHOD](APIConfig.CLIENT_ACCOUNT_DETAILS.URL(clientId), payload);
}

const ClientBasicDetailsAddAPICall = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CLIENT_BASIC_DETAILS_ADD.METHOD](APIConfig.CLIENT_BASIC_DETAILS_ADD.URL, payload);
}

const ClientPersonalHabitsAddAPICall = (clientId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CLIENT_PERSONAL_HABITS_ADD.METHOD](APIConfig.CLIENT_PERSONAL_HABITS_ADD.URL(clientId), payload);
}

const ClientAllergiesAddAPICall = (clientId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CLIENT_ALLERGIES_ADD.METHOD](APIConfig.CLIENT_ALLERGIES_ADD.URL(clientId), payload);
}

const ClientMedicalSupplementsAddAPICall = (clientId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CLIENT_MEDICAL_SUPPLEMENTS_ADD.METHOD](APIConfig.CLIENT_MEDICAL_SUPPLEMENTS_ADD.URL(clientId), payload);
}

const ClientMedicalHistoryAddAPICall = (clientId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CLIENT_MEDICAL_HISTORY_ADD.METHOD](APIConfig.CLIENT_MEDICAL_HISTORY_ADD.URL(clientId), payload);
}


const ClientSurgicalHistoryAddAPICall = (clientId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CLIENT_SURGICAL_HISTORY_ADD.METHOD](APIConfig.CLIENT_SURGICAL_HISTORY_ADD.URL(clientId), payload);
}

const ClientMedicalFemaleOnlyAddAPICall = (clientId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CLIENT_MEDICAL_FEMALE_ONLY_ADD.METHOD](APIConfig.CLIENT_MEDICAL_FEMALE_ONLY_ADD.URL(clientId), payload);
}

const ClientMedicalProviderInformationAddAPICall = (clientId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CLIENT_MEDICAL_PROVIDER_ADD.METHOD](APIConfig.CLIENT_MEDICAL_PROVIDER_ADD.URL(clientId), payload);
}

const ClientMusculoskeletalHistoryAddAPICall = (clientId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CLIENT_MUSCULOSKELETAL_HISTORY_ADD.METHOD](APIConfig.CLIENT_MUSCULOSKELETAL_HISTORY_ADD.URL(clientId), payload);
}

const ClientAccountDetailsAddAPICall = (clientId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CLIENT_ACCOUNT_PREFERENCES_ADD.METHOD](APIConfig.CLIENT_ACCOUNT_PREFERENCES_ADD.URL(clientId), payload);
}

const ClientAccountDetailsEditAPICall = (clientId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CLIENT_ACCOUNT_PREFERENCES_EDIT.METHOD](APIConfig.CLIENT_ACCOUNT_PREFERENCES_EDIT.URL(clientId), payload);
}

const ClientBasicDetailsEditAPICall = (clientId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CLIENT_BASIC_DETAILS_EDIT.METHOD](APIConfig.CLIENT_BASIC_DETAILS_EDIT.URL(clientId), payload);
}

const NavigateToClientDetails = (clientId: string, step: IClientDetailsSteps) => {
    return RouteConfigService.ClientDetails(clientId) + "?currentStep=" + step;
}

const NavigateToClientEdit = (clientId: string, step: IClientFormSteps) => {
    return RouteConfigService.ClientEdit(clientId) + "?currentStep=" + step;
}

const ClientService={
    ClientBasicDetailsAddAPICall,
    ClientBasicDetailsAPICall,
    ClientPersonalHabitsAddAPICall,
    ClientAllergiesAddAPICall,
    ClientMedicalSupplementsAddAPICall,
    ClientMedicalHistoryAddAPICall,
    ClientSurgicalHistoryAddAPICall,
    ClientMedicalFemaleOnlyAddAPICall,
    ClientMedicalProviderInformationAddAPICall,
    ClientMusculoskeletalHistoryAddAPICall,
    ClientMedicalDetailsApiCall,
    ClientAccountDetailsAddAPICall,
    ClientAccountDetailsApiCall,
    ClientBasicDetailsEditAPICall,
    NavigateToClientEdit,
    NavigateToClientDetails,
    ClientAccountDetailsEditAPICall,
    ClientMedicalRecordApiCall
}

export default ClientService;