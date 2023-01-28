import {ApiService} from "../index";
import {APIConfig} from "../../../constants";


const ServiceAddAPICall = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.SERVICE_ADD.METHOD](APIConfig.SERVICE_ADD.URL, payload, {'Content-Type': 'multipart/form-data'});
}

const ServiceListLiteAPICall = (categoryId: any) => {
    // @ts-ignore
    return ApiService[APIConfig.SERVICE_LIST_LITE.METHOD](APIConfig.SERVICE_LIST_LITE.URL(categoryId));
}

const ServiceDetailsAPICall = (serviceId:string) => {
    // @ts-ignore
    return ApiService[APIConfig.SERVICE_DETAILS.METHOD](APIConfig.SERVICE_DETAILS.URL(serviceId));
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

const ServiceProviderListAPICall = (serviceId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.SERVICE_PROVIDERS_LINKED_TO_SERVICE.METHOD](APIConfig.SERVICE_PROVIDERS_LINKED_TO_SERVICE.URL(serviceId), payload)
}


const ServiceService = {
    ServiceListLiteAPICall,
    ServiceAddAPICall,
    ServiceEditAPICall,
    ServiceDetailsAPICall,
    ServiceProviderUnlinkAPICall,
    ServiceProviderLinkAPICall,
    ServiceProviderListAPICall
}
export default ServiceService;
