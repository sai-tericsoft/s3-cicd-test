import {
    ADMIN,
    CHART_NOTES_LIST,
    CLIENT_ADD,
    CLIENT_LIST,
    COMING_SOON_ROUTE,
    COUPON_ADD,
    DASHBOARD,
    DISCOUNT_LIST,
    FACILITY_DETAILS,
    FACILITY_LIST,
    FAQ,
    HELP,
    INVENTORY,
    LOGIN_ROUTE,
    FORGOT_PASSWORD_ROUTE,
    OTP_VERIFICATION_ROUTE,
    RESET_PASSWORD_ROUTE,
    PASSWORD_RESET_SUCCESS_ROUTE,
    NOT_FOUND_ROUTE,
    REPORT_AN_ISSUE,
    SCHEDULING_VIEW,
    SERVICE_ADD,
    SERVICE_CATEGORY_DETAILS,
    SERVICE_CATEGORY_LIST,
    SERVICE_DETAILS,
    SERVICE_EDIT,
    SETTINGS,
    TEST_ROUTE,
    USER_ADD,
    USER_LIST,
    USER_SLOTS,
} from "../../constants/RoutesConfig";

const DefaultRoute = () => {
    return "/";
}

const LoginRoute = () => {
    return LOGIN_ROUTE;
}
const ForgotPasswordRoute = () => {
    return FORGOT_PASSWORD_ROUTE;
}
const OtpVerificationRoute = (email:string) => {
    return OTP_VERIFICATION_ROUTE+'/'+email;
}
const ResetPasswordRoute = () => {
    return RESET_PASSWORD_ROUTE;
}
const PasswordResetSuccessRoute = () => {
    return PASSWORD_RESET_SUCCESS_ROUTE;
}

const NotFoundRoute = () => {
    return NOT_FOUND_ROUTE;
}

const TestRoute = () => {
    return TEST_ROUTE;
}

const ComingSoonRoute = () => {
    return COMING_SOON_ROUTE;
}

const Dashboard = () => {
    return DASHBOARD;
}

const ServiceCategoryList = () => {
    return SERVICE_CATEGORY_LIST;
}

const SystemSettings = () => {
    return "/admin/system-settings";
}

const appointmentSettingsLayout = () => {
    return "/admin/appointment-settings";
}

const ServiceCategoryDetails = (serviceCategoryId: string) => {
    return SERVICE_CATEGORY_DETAILS + '/' + serviceCategoryId;
}

const ServiceDetails = (serviceId: string) => {
    return SERVICE_DETAILS + '/' + serviceId;
}

const ServiceAdd = (serviceCategoryId: string) => {
    return SERVICE_ADD + '/' + serviceCategoryId;
}

const ServiceEdit = (serviceCategoryId: string, serviceId: string) => {
    return SERVICE_EDIT + '/' + serviceCategoryId + '/' + serviceId;
}

const Admin = () => {
    return ADMIN;
}

const FacilityList = () => {
    return FACILITY_LIST;
}

const FacilityDetails = (facilityId: string) => {
    return FACILITY_DETAILS + '/' + facilityId;
}

const DiscountList = () => {
    return DISCOUNT_LIST;
}

const ClientList = () => {
    return CLIENT_LIST;
}

const ClientAdd = (clientId: string) => {
    return CLIENT_ADD + '/' + clientId;
}

const ClientDetails = (clientId: string) => {
    return '/client/' + clientId;
}

const ClientProfileDetails = (clientId: string) => {
    return '/client/' + clientId + '/client-profile-details';
}

const ClientBillingDetails = (clientId: string) => {
    return '/client/' + clientId + '/client-billing-details'
}

const ClientDocuments = (clientId: string) => {
    return '/client/' + clientId + '/client-documents';
}
const ClientSharedDocuments = (clientId: string) => {
    return '/client/' + clientId + '/client-shared-documents';
}

const clientDocumentViewDetails = (clientId: any, clientDocumentId: string) => {
    return "/client/" + clientId + "/" + clientDocumentId + '/client-document-view-details';

}

const ClientAppointments = (clientId: string) => {
    return '/client/' + clientId + '/client-appointments';
}

const ClientAppointmentViewDetails = (clientId: any, clientAppointmentId: string) => {
    return "/client/" + clientId + "/" + clientAppointmentId + '/client-appointment-view-details';
}

const ClientEdit = (clientId: string) => {
    return '/client/client-edit/' + clientId;
}

const ClientSearch = () => {
    return CHART_NOTES_LIST;
}

const SchedulingView = () => {
    return SCHEDULING_VIEW;
}

const AddMedicalRecord = (clientId: string) => {
    return "/chart-notes/" + clientId + '/add-medical-record';
}

const UpdateMedicalIntervention = (medicalRecordId: string, medicalInterventionId: string) => {
    return "/chart-notes/" + medicalRecordId + "/" + medicalInterventionId + '/update-medical-intervention';
}

const ViewMedicalIntervention = (medicalRecordId: string, medicalInterventionId: string) => {
    return "/chart-notes/" + medicalRecordId + "/" + medicalInterventionId + '/view-medical-intervention';
}

const ChartNotesDetails = () => {
    return "/chart-notes";
}

const MedicalRecordList = (clientId: string) => {
    return "/chart-notes/" + clientId + '/medical-record-list';
}

const MedicalInterventionROMConfig = (medicalRecordId: string, medicalInterventionId: string) => {
    return "/chart-notes/" + medicalRecordId + "/" + medicalInterventionId + '/rom-config';
}

const MedicalInterventionSpecialTests = (medicalRecordId: string, medicalInterventionId: string) => {
    return "/chart-notes/" + medicalRecordId + "/" + medicalInterventionId + '/special-tests';
}
const MedicalInterventionICDCodes = (medicalRecordId: string, medicalInterventionId: string) => {
    return "/chart-notes/" + medicalRecordId + "/" + medicalInterventionId + '/icd-codes'; // todo: why is this not referred from constants
}

const MedicalInterventionExerciseLogUpdate = (medicalRecordId: string, medicalInterventionId: string, mode: string) => {
    return "/chart-notes/" + medicalRecordId + "/" + medicalInterventionId + '/exercise-log-update/' + mode;
}

const MedicalInterventionExerciseLogView = (medicalRecordId: string, medicalInterventionId: string) => {
    return "/chart-notes/" + medicalRecordId + "/" + medicalInterventionId + '/exercise-log-view';
}

const ClientMedicalRecordDetails = (medicalRecordId: string) => {
    return '/chart-notes/' + medicalRecordId + '/medical-record-details';
}

const MedicalInterventionDetails = (medicalRecordId: string, medicalInterventionId: string) => {
    return "/chart-notes/" + medicalRecordId + "/" + medicalInterventionId + '/view-medical-intervention';
}

const MedicalRecordSurgeryRecordDetails = (medicalRecordId: string, surgeryRecordId: string) => {
    return '/chart-notes/' + medicalRecordId + '/' + surgeryRecordId + '/surgery-record';
}

const MedicalRecordProgressReportAdvancedDetailsUpdate = (medicalRecordId: string, progressReportId: string, mode: string) => {
    return '/chart-notes/' + medicalRecordId + '/' + progressReportId + '/progress-report-advance-details-update/' + mode;
}

const MedicalInterventionFinalizeTreatment = (medicalRecordId: string, medicalInterventionId: string) => {
    return "/chart-notes/" + medicalRecordId + "/" + medicalInterventionId + '/finalize-treatment';
}

const MedicalRecordProgressReportViewDetails = (medicalRecordId: string, progressReportId: string) => {
    return "/chart-notes/" + medicalRecordId + "/" + progressReportId + '/progress-report-view-details';
}
const MedicalInterventionDryNeedlingFileViewDetails = (medicalRecordId: string, dryNeedlingFileId: string) => {
    return "/chart-notes/" + medicalRecordId + "/" + dryNeedlingFileId + '/dry-needling-file-view-details';
}

const MedicalInterventionConcussionFileViewDetails = (medicalRecordId: string, concussionFileId: string) => {
    return "/chart-notes/" + medicalRecordId + "/" + concussionFileId + '/concussion-file-view-details';
}

const MedicalRecordDocumentViewDetails = (medicalRecordId: string, medicalRecordDocumentId: string) => {
    return "/chart-notes/" + medicalRecordId + "/" + medicalRecordDocumentId + '/medical-record-document-view-details';

}

const MedicalRecordViewExerciseRecord = (medicalRecordId: string) => {
    return "/chart-notes/" + medicalRecordId + "/consolidated-exercise-record";
}

const InventoryList = () => {
    return INVENTORY;
}

const AddInventoryProduct = () => {
    return "/inventory/add-product";
}

const InventoryProductViewDetails = (productId: string) => {
    return "/inventory/product-details/" + productId;
}

const EditInventoryProduct = (productId: string) => {
    return "/inventory/edit-product/" + productId;
}

const BillingList = () => {
    return "/billing/billing-list";
}

const AddNewReceipt = () => {
    return "/billing/add-new-receipt";
}

const BillingDetails = (billingId: string) => {
    return "/billing/billing-details/" + billingId;
}

const ConsolidatedBillingDetails = (consolidatedBillingId: string) => {
    return "/billing/consolidated-billing-details/" + consolidatedBillingId;
}

const Help = () => {
    return HELP;
}

const FrequentlyAskedQuestions = () => {
    return FAQ;
}

const ReportAnIssue = () => {
    return REPORT_AN_ISSUE;
}

const CouponViewDetails = (couponId: string) => {
    return "/admin/coupon-details/" + couponId;
}

const CouponEdit = (couponId: string) => {
    return "/admin/coupon/" + couponId + "/edit";
}

const CouponAdd = () => {
    return COUPON_ADD;
}

const UserAdd = () => {
    return USER_ADD;
}

const UserSlots = (userId: string) => {
    return USER_SLOTS + userId;
}

const UserList = () => {
    return USER_LIST;
}
const Settings = () => {
    return SETTINGS;
}

const PersonalDetails = () => {
    return '/settings/personal-details';
}
const PersonalSlotsDetails = (currentStepId: string) => {
    return '/settings/slots-details/' + currentStepId;
}
const PersonalAccountDetails = () => {
    return '/settings/account-details';
}

const PersonalDetailsEdit = (userId: string) => {
    return '/settings/details-edit/' + userId;
}

const PersonalAccountDetailsEdit = (userId: string) => {
    return '/settings/account-details-edit/' + userId;
}

const PersonalSlotsEdit = (userId: string) => {
    return '/settings/slots-edit/' + userId;
}

const UserPersonalDetails = (userId: string) => {
    return '/admin/user/' + userId + '/user-details';
}

const UserSlotsDetails = (userId: string, facilityId: string) => {
    return '/admin/user/' + userId + '/user-slots-details/' + facilityId;
}

const UserAccountDetails = (userId: string) => {
    return '/admin/user/' + userId + '/user-account-details';
}

const UserPersonalDetailsEdit = (userId: any) => {
    return '/admin/user-details-edit/' + userId;
}

const UserAccountDetailsEdit = (userId: any) => {
    return '/admin/user-account-details-edit/' + userId;
}

const UserSlotsEdit = (userId: any) => {
    return '/admin/user-slots-edit/' + userId;
}

const BillingSettings = () => {
    return '/admin/billing-settings';
}

const openMedicalRecordActivityLog = (medicalRecordId: string) => {
    return '/chart-notes/' + medicalRecordId + '/activity-log';
}

const RouteConfigService = {
    DefaultRoute,
    LoginRoute,
    ForgotPasswordRoute,
    OtpVerificationRoute,
    ResetPasswordRoute,
    PasswordResetSuccessRoute,
    NotFoundRoute,
    TestRoute,
    ComingSoonRoute,
    Dashboard,
    ServiceCategoryList,
    Admin,
    ServiceCategoryDetails,
    ServiceDetails,
    ServiceAdd,
    ServiceEdit,
    FacilityList,
    FacilityDetails,
    ClientList,
    ClientAdd,
    ClientDetails,
    ClientEdit,
    ClientSearch,
    SchedulingView,
    ClientMedicalRecordDetails,
    AddMedicalRecord,
    ChartNotesDetails,
    MedicalInterventionROMConfig,
    MedicalInterventionSpecialTests,
    MedicalInterventionExerciseLogUpdate,
    UpdateMedicalIntervention,
    ViewMedicalIntervention,
    MedicalRecordList,
    MedicalInterventionExerciseLogView,
    MedicalInterventionICDCodes,
    MedicalInterventionDetails,
    MedicalRecordSurgeryRecordDetails,
    MedicalRecordProgressReportAdvancedDetailsUpdate,
    MedicalInterventionFinalizeTreatment,
    MedicalRecordProgressReportViewDetails,
    MedicalInterventionDryNeedlingFileViewDetails,
    MedicalInterventionConcussionFileViewDetails,
    MedicalRecordDocumentViewDetails,
    MedicalRecordViewExerciseRecord,
    InventoryList,
    AddInventoryProduct,
    InventoryProductViewDetails,
    EditInventoryProduct,
    SystemSettings,
    BillingList,
    AddNewReceipt,
    BillingDetails,
    ClientProfileDetails,
    ClientBillingDetails,
    ClientDocuments,
    ClientAppointments,
    clientDocumentViewDetails,
    ClientAppointmentViewDetails,
    FrequentlyAskedQuestions,
    DiscountList,
    CouponViewDetails,
    CouponAdd,
    CouponEdit,
    appointmentSettingsLayout,
    Help,
    ReportAnIssue,
    UserList,
    UserAdd,
    UserPersonalDetails,
    PersonalDetails,
    UserPersonalDetailsEdit,
    PersonalDetailsEdit,
    UserSlots,
    UserAccountDetails,
    UserAccountDetailsEdit,
    PersonalAccountDetails,
    PersonalAccountDetailsEdit,
    UserSlotsDetails,
    PersonalSlotsDetails,
    PersonalSlotsEdit,
    UserSlotsEdit,
    Settings,
    BillingSettings,
    ConsolidatedBillingDetails,
    ClientSharedDocuments,
    openMedicalRecordActivityLog
}

export default RouteConfigService;
