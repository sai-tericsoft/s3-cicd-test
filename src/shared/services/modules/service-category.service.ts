import {ApiService} from "../index";
import {APIConfig} from "../../../constants";

const ServiceCategoryListAPICall = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.SERVICE_CATEGORY_LIST.METHOD](APIConfig.SERVICE_CATEGORY_LIST.URL, payload);
}

const ServiceCategoryAddAPICall = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.SERVICE_CATEGORY_ADD.METHOD](APIConfig.SERVICE_CATEGORY_ADD.URL, payload, {'Content-Type': 'multipart/form-data'});
}

const ServiceCategoryDetailsAPICall = (serviceCategoryId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.SERVICE_CATEGORY_DETAILS.METHOD](APIConfig.SERVICE_CATEGORY_DETAILS.URL(serviceCategoryId), payload);
}

const ServiceCategoryEditAPICall = (serviceCategoryId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.SERVICE_CATEGORY_EDIT.METHOD](APIConfig.SERVICE_CATEGORY_EDIT.URL(serviceCategoryId), payload, {'Content-Type': 'multipart/form-data'});
}

const ServiceDetailsAPICall = (serviceId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.SERVICE_DETAILS.METHOD](APIConfig.SERVICE_DETAILS.URL(serviceId), payload);
}

const ServiceCategoryService = {
    ServiceCategoryListAPICall,
    ServiceCategoryAddAPICall,
    ServiceCategoryDetailsAPICall,
    ServiceCategoryEditAPICall,
    ServiceDetailsAPICall
}

export default ServiceCategoryService;
