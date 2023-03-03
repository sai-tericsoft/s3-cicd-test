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

const MarkPaymentAsPaidAPICall = (invoiceId: any) => {
    // @ts-ignore
    return ApiService[APIConfig.MARK_PAYMENT_AS_PAID.METHOD](APIConfig.MARK_PAYMENT_AS_PAID.URL(invoiceId), payload)
}

const GetInvoiceDetailsAPICall = (invoiceId: any) => {
    // @ts-ignore
    return ApiService[APIConfig.GET_INVOICE_DETAILS.METHOD](APIConfig.GET_INVOICE_DETAILS.URL(invoiceId))
}

const GetReceiptDetailsAPICall = (receiptId: any) => {
    // @ts-ignore
    return ApiService[APIConfig.GET_RECEIPT_DETAILS.METHOD](APIConfig.GET_RECEIPT_DETAILS.URL(receiptId))
}


const BillingService={
    MarkPaymentsAsPaidAPICall,
    AddNewInvoiceAPICall,
    MarkPaymentAsPaidAPICall,
    GetInvoiceDetailsAPICall,
    GetReceiptDetailsAPICall
}

export default BillingService;
