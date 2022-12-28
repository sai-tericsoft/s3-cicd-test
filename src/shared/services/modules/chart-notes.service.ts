import {ApiService} from "../index";
import {APIConfig} from "../../../constants";

const MedicalRecordAddAPICall = (clientId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.MEDICAL_RECORD_ADD.METHOD](APIConfig.MEDICAL_RECORD_ADD.URL(clientId), payload, {'Content-Type': 'multipart/form-data'});
}

const MedicalInterventionBasicDetailsUpdateAPICall = (medicalInterventionId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.MEDICAL_INTERVENTION_BASIC_DETAILS_UPDATE.METHOD](APIConfig.MEDICAL_INTERVENTION_BASIC_DETAILS_UPDATE.URL(medicalInterventionId), payload);
}

const FetchMedicalInterventionBasicDetailsAPICall = (medicalInterventionId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.GET_MEDICAL_INTERVENTION_BASIC_DETAILS.METHOD](APIConfig.GET_MEDICAL_INTERVENTION_BASIC_DETAILS.URL(medicalInterventionId), payload);
}

const ChartNotesService={
    MedicalRecordAddAPICall,
    MedicalInterventionBasicDetailsUpdateAPICall,
    FetchMedicalInterventionBasicDetailsAPICall
}
export default ChartNotesService;
