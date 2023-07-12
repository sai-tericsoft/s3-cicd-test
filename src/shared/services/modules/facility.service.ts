import {ApiService} from "../index";
import {APIConfig} from "../../../constants";

const FacilityDetailsAPICall = (facilityId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.FACILITY_DETAILS.METHOD](APIConfig.FACILITY_DETAILS.URL(facilityId), payload);
}

const providerFacilityList = (serviceId: any, providerId: any, payload: any) => {
    return ApiService[APIConfig.PROVIDERS_LINKED_TO_FACILITY.METHOD](APIConfig.PROVIDERS_LINKED_TO_FACILITY.URL(serviceId, providerId), payload)
}


const FacilityService = {
    FacilityDetailsAPICall,
    providerFacilityList
}

export default FacilityService;
