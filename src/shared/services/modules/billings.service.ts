import {ApiService} from "../index";
import {APIConfig} from "../../../constants";

const MarkPaymentsAsPaidAPICall = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.MARK_PAYMENTS_AS_PAID.METHOD](APIConfig.MARK_PAYMENTS_AS_PAID.URL, payload)
}


const BillingService={
    MarkPaymentsAsPaidAPICall
}

export default BillingService;
