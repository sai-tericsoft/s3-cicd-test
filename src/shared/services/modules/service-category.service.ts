import {ApiService} from "../index";
import {APIConfig} from "../../../constants";

const ServiceCategoryAPICall = (payload: any)  => {
    // @ts-ignore
    return ApiService[APIConfig.SERVICE_CATEGORY_LIST.METHOD](APIConfig.SERVICE_CATEGORY_LIST.URL, payload);
}

const ServiceCategoryService = {
    ServiceCategoryAPICall,
}

export default ServiceCategoryService;
