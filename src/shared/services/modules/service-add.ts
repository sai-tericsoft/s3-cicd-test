import {ApiService} from "../index";
import {APIConfig} from "../../../constants";


const ServiceAddAPICall = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.SERVICE_ADD.METHOD](APIConfig.SERVICE_ADD.URL, payload, {'Content-Type': 'multipart/form-data'});
}

const ServiceAdd={
    ServiceAddAPICall
}
export default ServiceAdd;