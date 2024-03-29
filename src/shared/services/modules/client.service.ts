import {ApiService} from "../index";
import {APIConfig} from "../../../constants";
import RouteConfigService from "../route-config.service";
import {IClientDetailsSteps, IClientFormSteps} from "../../models/client.model";

const ClientBasicDetailsAPICall = (clientId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CLIENT_BASIC_DETAILS.METHOD](APIConfig.CLIENT_BASIC_DETAILS.URL(clientId), payload);
}

const ClientMedicalDetailsApiCall = (clientId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CLIENT_MEDICAL_DETAILS.METHOD](APIConfig.CLIENT_MEDICAL_DETAILS.URL(clientId), payload);
}

const ClientMedicalRecordApiCall = (clientId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CLIENT_MEDICAL_RECORD.METHOD](APIConfig.CLIENT_MEDICAL_RECORD.URL(clientId), payload);
}


const ClientAccountDetailsApiCall = (clientId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CLIENT_ACCOUNT_DETAILS.METHOD](APIConfig.CLIENT_ACCOUNT_DETAILS.URL(clientId), payload);
}

const ClientBasicDetailsAddAPICall = (payload: any) => {
    console.log('payload', payload);
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
// const ClientBasicDetailsAddAPICall = (clientId: string, payload: any) => {
//     // @ts-ignore
//     return ApiService[APIConfig.CLIENT_BASIC_DETAILS_EDIT.METHOD](APIConfig.CLIENT_BASIC_DETAILS_EDIT.URL(clientId), payload);
// }
const NavigateToClientDetails = (clientId: string, step: IClientDetailsSteps,lastPosition?:string) => {
    return RouteConfigService.ClientProfileDetails(clientId) + "?currentStep=" + step+"&lastPosition="+lastPosition;
}

const NavigateToClientEdit = (clientId: string, step: IClientFormSteps) => {
    return RouteConfigService.ClientEdit(clientId) + "?currentStep=" + step;
}

const AddFavouriteCode = (codeId: string, payload: any) => {
    return ApiService[APIConfig.ICD_CODE_FAVOURITE_ADD.METHOD](APIConfig.ICD_CODE_FAVOURITE_ADD.URL(codeId), payload);

}
const RemoveFavouriteCode = (codeId: string, payload: any) => {
    return ApiService[APIConfig.ICD_CODE_FAVOURITE_REMOVE.METHOD](APIConfig.ICD_CODE_FAVOURITE_REMOVE.URL(codeId), payload);
}
const GetAllFavouriteCodes = () => {
    return ApiService[APIConfig.ICD_CODE_FAVOURITE_LIST.METHOD](APIConfig.ICD_CODE_FAVOURITE_LIST.URL);
}
const GetClientListLite = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.GET_CLIENT_LIST_LITE.METHOD](APIConfig.GET_CLIENT_LIST_LITE.URL, payload);
}
const GetClientMedicalRecordList = (clientId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.GET_MEDICAL_RECORD_LIST_LITE.METHOD](APIConfig.GET_MEDICAL_RECORD_LIST_LITE.URL(clientId), payload);
}

const GetClientList = (payload: any) => {
    console.log('payload', payload);
    return ApiService[APIConfig.CLIENT_LIST.METHOD](APIConfig.CLIENT_LIST.URL, payload);
}
const ClientListLiteAPICall = (payload: any) => {
    return ApiService[APIConfig.CLIENT_LIST_LITE.METHOD](APIConfig.CLIENT_LIST_LITE.URL, payload);
}

const ResendInviteToClient = (clientId: string, payload: any) => {
    return ApiService[APIConfig.RESEND_INVITE_LINK_TO_CLIENT.METHOD](APIConfig.RESEND_INVITE_LINK_TO_CLIENT.URL(clientId), payload);
}

const GetClientBillingAddress = (clientId: any) => {
    return ApiService[APIConfig.GET_CLIENT_BILLING_ADDRESS.METHOD](APIConfig.GET_CLIENT_BILLING_ADDRESS.URL(clientId));
}

const UpdateClientBillingAddress = (addressId: any, payload: any) => {
    return ApiService[APIConfig.UPDATE_CLIENT_BILLING_ADDRESS.METHOD](APIConfig.UPDATE_CLIENT_BILLING_ADDRESS.URL(addressId), payload);
}
const getClientActivityLogs = (clientId: any,payload?:any) => {
    return ApiService[APIConfig.CLIENT_ACTIVITY_LOG.METHOD](APIConfig.CLIENT_ACTIVITY_LOG.URL(clientId),payload);
}

const getClientAllFormList = (clientId: any,appointmentId:string) => {
    return ApiService[APIConfig.GET_CLIENT_ALL_FORMS_LIST.METHOD](APIConfig.GET_CLIENT_ALL_FORMS_LIST.URL(clientId,appointmentId));
}

const printPersonalAndMedicalInfo = (payload:any)=>{
    return ApiService[APIConfig.PRINT_PERSONAL_AND_MEDICAL_INFO.METHOD](APIConfig.PRINT_PERSONAL_AND_MEDICAL_INFO.URL,payload);
}

const printWaiverForm = (clientId:string,appointmentId:string,payload:any)=>{
    return ApiService[APIConfig.PRINT_WAIVER_AND_RELEASE.METHOD](APIConfig.PRINT_WAIVER_AND_RELEASE.URL(clientId,appointmentId),payload);
}

const printAuthorizationForm = (clientId:string,appointmentId:string,payload:any)=>{
    return ApiService[APIConfig.PRINT_AUTHORIZATION_TO_RELEASE_FORM.METHOD](APIConfig.PRINT_AUTHORIZATION_TO_RELEASE_FORM.URL(clientId,appointmentId),payload);
}

const printAttendancePolicyForm = (clientId:string,appointmentId:string,payload:any)=>{
    return ApiService[APIConfig.PRINT_ATTENDANCE_POLICY.METHOD](APIConfig.PRINT_ATTENDANCE_POLICY.URL(clientId,appointmentId),payload);
}

const printNoticeOfPrivacyForm = (clientId:string,appointmentId:string,payload:any)=>{
    return ApiService[APIConfig.PRINT_NOTICE_OF_PRIVACY_PRACTICES.METHOD](APIConfig.PRINT_NOTICE_OF_PRIVACY_PRACTICES.URL(clientId,appointmentId),payload);
}

const printNewInjuryForm = (clientId:string,appointmentId:string,payload:any)=>{
    return ApiService[APIConfig.PRINT_NEW_INJURY_FORM.METHOD](APIConfig.PRINT_NEW_INJURY_FORM.URL(clientId,appointmentId),payload);
}


const ClientService = {
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
    AddFavouriteCode,
    RemoveFavouriteCode,
    GetAllFavouriteCodes,
    ClientMedicalRecordApiCall,
    GetClientListLite,
    GetClientList,
    GetClientMedicalRecordList,
    ClientListLiteAPICall,
    ResendInviteToClient,
    GetClientBillingAddress,
    UpdateClientBillingAddress,
    getClientActivityLogs,
    getClientAllFormList,
    printPersonalAndMedicalInfo,
    printWaiverForm,
    printAuthorizationForm,
    printAttendancePolicyForm,
    printNoticeOfPrivacyForm,
    printNewInjuryForm
}


export default ClientService;
