import {ApiService} from "../index";
import {APIConfig} from "../../../constants";


const ServiceAddAPICall = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.SERVICE_ADD.METHOD](APIConfig.SERVICE_ADD.URL, payload, {'Content-Type': 'multipart/form-data'});
}

const ServiceDetailsAPICall = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.SERVICE_DETAILS.METHOD](APIConfig.SERVICE_DETAILS.URL, payload);
}

const ServiceEditAPICall = (serviceId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.SERVICE_EDIT.METHOD](APIConfig.SERVICE_EDIT.URL(serviceId), payload, {'Content-Type': 'multipart/form-data'});
}


const ServiceService={
    ServiceAddAPICall,
    ServiceEditAPICall,
    ServiceDetailsAPICall
}
export default ServiceService;