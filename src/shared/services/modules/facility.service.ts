import {ApiService} from "../index";
import {APIConfig} from "../../../constants";

const FacilityDetailsAPICall = (facilityId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.FACILITY_DETAILS.METHOD](APIConfig.FACILITY_DETAILS.URL(facilityId), payload);
}

const FacilityService = {
    FacilityDetailsAPICall,
}

export default FacilityService;
