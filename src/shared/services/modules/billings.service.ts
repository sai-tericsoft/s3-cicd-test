import {ApiService} from "../index";
import {APIConfig} from "../../../constants";

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

const GetBillingStatsAPICall = (clientId: any, payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.GET_BILLING_STATS.METHOD](APIConfig.GET_BILLING_STATS.URL(clientId), payload)
}

// const GetBillingPDFDocument = (billingDocumentId: any, type: BillingType, payload: any) => {
//     // @ts-ignore
//     return ApiService[APIConfig.GENERATE_BILLING_DOCUMENT_PDF.METHOD](APIConfig.GENERATE_BILLING_DOCUMENT_PDF.URL(billingDocumentId, type), payload)
// }

const GetProductBillingPDFDocument = (payload:any)=>{
    // @ts-ignore
    return ApiService[APIConfig.GENERATE_PRODUCT_BILLING_DOCUMENT_PDF.METHOD](APIConfig.GENERATE_PRODUCT_BILLING_DOCUMENT_PDF.URL,payload)
}

const GetAppointmentBillingPDFDocument = (payload:any)=>{
    // @ts-ignore
    return ApiService[APIConfig.GENERATE_APPOINTMENT_BILLING_DOCUMENT_PDF.METHOD](APIConfig.GENERATE_APPOINTMENT_BILLING_DOCUMENT_PDF.URL,payload)
}

const GetConsolidatedBillingPDFDocument = (payload:any)=>{
    // @ts-ignore
    return ApiService[APIConfig.GENERATE_CONSOLIDATED_BILLING_DOCUMENT_PDF.METHOD](APIConfig.GENERATE_CONSOLIDATED_BILLING_DOCUMENT_PDF.URL,payload)
}

const GetDetailedBillingPDFDocument = (payload:any)=>{
    // @ts-ignore
    return ApiService[APIConfig.GENERATE_DETAILED_BILLING_PDF.METHOD](APIConfig.GENERATE_DETAILED_BILLING_PDF.URL,payload)
}

const GetBillingFromAddress = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.GET_BILLING_FROM_ADDRESS.METHOD](APIConfig.GET_BILLING_FROM_ADDRESS.URL, payload)
}

const AddBillingSettings = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.ADD_BILLING_SETTINGS.METHOD](APIConfig.ADD_BILLING_SETTINGS.URL, payload)
}

const GetBillingSettings = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.GET_BILLING_SETTINGS.METHOD](APIConfig.GET_BILLING_SETTINGS.URL, payload)
}

const GetBillingAddressList = (clientId:string)=>{
    // @ts-ignore
    return ApiService[APIConfig.GET_BILLING_ADDRESS_LIST.METHOD](APIConfig.GET_BILLING_ADDRESS_LIST.URL(clientId))
}

const AddBillingAddress = (clientId:string, payload:any)=>{
    // @ts-ignore
    return ApiService[APIConfig.ADD_BILLING_ADDRESS.METHOD](APIConfig.ADD_BILLING_ADDRESS.URL(clientId), payload)
}

const GetConsolidatedBillingDetails = (consolidatedBillId:string, payload:any)=>{
    // @ts-ignore
    return ApiService[APIConfig.GET_CONSOLIDATED_BILLING_DETAILS.METHOD](APIConfig.GET_CONSOLIDATED_BILLING_DETAILS.URL(consolidatedBillId), payload)
}

const AddInvoiceNote = (invoiceId:string, payload:any)=>{
    // @ts-ignore
    return ApiService[APIConfig.ADD_INVOICE_NOTE.METHOD](APIConfig.ADD_INVOICE_NOTE.URL(invoiceId), payload)
}

const CreateConsolidatedPaymentAPICall = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CREATE_CONSOLIDATED_PAYMENT.METHOD](APIConfig.CREATE_CONSOLIDATED_PAYMENT.URL, payload)
}

const LinkedClientListAPICall = (clientId:string,payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.GET_LINKED_CLIENT_LIST.METHOD](APIConfig.GET_LINKED_CLIENT_LIST.URL(clientId), payload)
}

const ConsolidatedMarkAsPaid = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.CONSOLIDATED_MARK_AS_PAID.METHOD](APIConfig.CONSOLIDATED_MARK_AS_PAID.URL, payload)
}

const EditConsolidatedBill = (consolidatedBillId:string, payload:any)=>{
    // @ts-ignore
    return ApiService[APIConfig.EDIT_CONSOLIDATED_BILL.METHOD](APIConfig.EDIT_CONSOLIDATED_BILL.URL(consolidatedBillId), payload)
}

const DeleteConsolidatedBill = (consolidatedBillId:string, payload:any)=>{
    // @ts-ignore
    return ApiService[APIConfig.DELETE_CONSOLIDATED_BILL.METHOD](APIConfig.DELETE_CONSOLIDATED_BILL.URL(consolidatedBillId), payload)
}

const ProductMarkAsPaid = (payload: any) => {
    // @ts-ignore
    return ApiService[APIConfig.MARK_AS_PAID_FOR_PRODUCT.METHOD](APIConfig.MARK_AS_PAID_FOR_PRODUCT.URL, payload)
}


const BillingService = {
    MarkPaymentsAsPaidAPICall,
    AddNewReceiptAPICall,
    MarkPaymentAsPaidAPICall,
    GetInvoiceDetailsAPICall,
    GetReceiptDetailsAPICall,
    GetBillingStatsCountAPICall,
    // GetBillingPDFDocument,
    GetBillingStatsAPICall,
    GetBillingFromAddress,
    AddBillingSettings,
    GetBillingSettings,
    GetBillingAddressList,
    AddBillingAddress,
    GetConsolidatedBillingDetails,
    AddInvoiceNote,
    CreateConsolidatedPaymentAPICall,
    LinkedClientListAPICall,
    ConsolidatedMarkAsPaid,
    EditConsolidatedBill,
    DeleteConsolidatedBill,
    GetProductBillingPDFDocument,
    GetAppointmentBillingPDFDocument,
    GetConsolidatedBillingPDFDocument,
    ProductMarkAsPaid,
    GetDetailedBillingPDFDocument
}

export default BillingService;
