import {ApiService} from "../index";
import {APIConfig} from "../../../constants";

const ClientBasicDetailsAddAPICall = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CLIENT_BASIC_DETAILS_ADD.METHOD](APIConfig.CLIENT_BASIC_DETAILS_ADD.URL, payload);
}

const ClientDetailsAPICall = (clientId: string, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CLIENT_DETAILS.METHOD](APIConfig.CLIENT_DETAILS.URL(clientId), payload);
}

const ClientService={
    ClientBasicDetailsAddAPICall,
    ClientDetailsAPICall
}
export default ClientService;