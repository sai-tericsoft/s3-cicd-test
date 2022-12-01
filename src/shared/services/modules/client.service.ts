import {ApiService} from "../index";
import {APIConfig} from "../../../constants";

const ClientBasicDetailsAddAPICall = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CLIENT_BASIC_DETAILS_ADD.METHOD](APIConfig.CLIENT_BASIC_DETAILS_ADD.URL, payload);
}

const ClientService={
    ClientBasicDetailsAddAPICall
}
export default ClientService;