import {ApiService} from "../index";
import {APIConfig} from "../../../constants";

const MarkPaymentsAsPaidAPICall = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.MARK_PAYMENTS_AS_PAID.METHOD](APIConfig.MARK_PAYMENTS_AS_PAID.URL, payload)
}


const AddNewInvoiceAPICall = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.ADD_NEW_RECEIPT.METHOD](APIConfig.ADD_NEW_RECEIPT.URL, payload)
}


const BillingService={
    MarkPaymentsAsPaidAPICall,
    AddNewInvoiceAPICall
}

export default BillingService;
