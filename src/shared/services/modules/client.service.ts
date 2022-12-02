import {ApiService} from "../index";
import {APIConfig} from "../../../constants";

const ClientBasicDetailsAddAPICall = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CLIENT_BASIC_DETAILS_ADD.METHOD](APIConfig.CLIENT_BASIC_DETAILS_ADD.URL, payload);
}

const ClientDetailsAPICall = (clientId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CLIENT_DETAILS.METHOD](APIConfig.CLIENT_DETAILS.URL(clientId), payload);
}

const ClientPersonalHabitsAddAPICall = (clientId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CLIENT_PERSONAL_HABITS_ADD.METHOD](APIConfig.CLIENT_PERSONAL_HABITS_ADD.URL(clientId), payload);
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



const ClientService={
    ClientBasicDetailsAddAPICall,
    ClientDetailsAPICall,
    ClientPersonalHabitsAddAPICall,
    ClientMedicalSupplementsAddAPICall,
    ClientMedicalHistoryAddAPICall,
    ClientSurgicalHistoryAddAPICall,
    ClientMedicalFemaleOnlyAddAPICall,
    ClientMedicalProviderInformationAddAPICall
}
export default ClientService;