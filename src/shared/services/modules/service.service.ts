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

const ServiceProviderUnlinkAPICall = (serviceId: string, providerId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.SERVICE_PROVIDER_UNLINK.METHOD](APIConfig.SERVICE_PROVIDER_UNLINK.URL(serviceId, providerId), payload)
}

const ServiceProviderLinkAPICall = (serviceId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.SERVICE_PROVIDER_LINK.METHOD](APIConfig.SERVICE_PROVIDER_LINK.URL(serviceId), payload)
}

const ServiceService={
    ServiceAddAPICall,
    ServiceEditAPICall,
    ServiceDetailsAPICall,
    ServiceProviderUnlinkAPICall,
    ServiceProviderLinkAPICall
}
export default ServiceService;