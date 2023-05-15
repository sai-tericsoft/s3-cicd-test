import {ApiService} from "../index";
import {APIConfig} from "../../../constants";
import {BillingType} from "../../models/common.model";

const MarkPaymentsAsPaidAPICall = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.MARK_PAYMENTS_AS_PAID.METHOD](APIConfig.MARK_PAYMENTS_AS_PAID.URL, payload)
}


const AddNewReceiptAPICall = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.ADD_NEW_RECEIPT.METHOD](APIConfig.ADD_NEW_RECEIPT.URL, payload)
}

const MarkPaymentAsPaidAPICall = (invoiceId: any, payload: any) => {
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

const GetBillingStatsCountAPICall = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.GET_BILLING_STATS_COUNT.METHOD](APIConfig.GET_BILLING_STATS_COUNT.URL, payload)
}

const GetBillingStatsAPICall = (clientId:any,payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.GET_BILLING_STATS.METHOD](APIConfig.GET_BILLING_STATS.URL(clientId), payload)
}

const GetBillingPDFDocument = (billingDocumentId: any, type: BillingType, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.GENERATE_BILLING_DOCUMENT_PDF.METHOD](APIConfig.GENERATE_BILLING_DOCUMENT_PDF.URL(billingDocumentId, type), payload)
}

const GetBillingFromAddress = (payload:any)=>{
    // @ts-ignore
    return ApiService[APIConfig.GET_BILLING_FROM_ADDRESS.METHOD](APIConfig.GET_BILLING_FROM_ADDRESS.URL, payload)
}

const BillingService = {
    MarkPaymentsAsPaidAPICall,
    AddNewReceiptAPICall,
    MarkPaymentAsPaidAPICall,
    GetInvoiceDetailsAPICall,
    GetReceiptDetailsAPICall,
    GetBillingStatsCountAPICall,
    GetBillingPDFDocument,
    GetBillingStatsAPICall,
    GetBillingFromAddress
}

export default BillingService;
