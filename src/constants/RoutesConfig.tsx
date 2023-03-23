// AUTH ROUTES
const LOGIN_ROUTE = "/login";

// NON-AUTH ROUTES
const TEST_ROUTE = "/test";
const NOT_FOUND_ROUTE = "/not-found";
const RESTRICTED_ROUTE = "/restricted";
const DESIGN_SYSTEM_ROUTE = "/ds";
const COMING_SOON_ROUTE = "/coming-soon";
const DASHBOARD = "/dashboard";
const ADMIN = "/admin";
const SERVICE_CATEGORY_LIST = "/admin/service-category-list";
const SYSTEM_SETTINGS = "/admin/system-settings";
const SERVICE_DETAILS = "/admin/service-details";
const SERVICE_ADD = "/admin/service/add";
const SERVICE_EDIT = "/admin/service/edit";
const SERVICE_CATEGORY_DETAILS = "/admin/service-category-details";

const FACILITY_LIST = "/admin/facility-list";
const FACILITY_DETAILS = "/admin/facility-details";

const CLIENT_LIST = "/client-list";
const CLIENT_ADD = "/client-add";
const CLIENT_DETAILS = "/client";
const CLIENT_PROFILE_DETAILS = "/client/client-profile-details";
const CLIENT_EDIT = "/client/client-edit";

const CLIENT_SEARCH='/chart-notes/client-list';
const SCHEDULING_VIEW='/scheduling';
const CLIENT_MEDICAL_RECORD_DETAILS = '/chart-notes/:medicalRecordId/medical-record-details';
const CHART_NOTES_LIST = "/chart-notes";
const ADD_MEDICAL_RECORD = '/chart-notes/:clientId/add-medical-record';
const UPDATE_MEDICAL_INTERVENTION = '/chart-notes/:medicalRecordId/:medicalInterventionId/update-medical-intervention';
const VIEW_MEDICAL_INTERVENTION = '/chart-notes/:medicalRecordId/:medicalInterventionId/view-medical-intervention';
const MEDICAL_INTERVENTION_ROM_CONFIG = '/chart-notes/:medicalRecordId/:medicalInterventionId/rom-config';
const MEDICAL_INTERVENTION_SPECIAL_TESTS = '/chart-notes/:medicalRecordId/:medicalInterventionId/special-tests';
const MEDICAL_INTERVENTION_ICD_CODES = '/chart-notes/:medicalRecordId/:medicalInterventionId/icd-codes';
const MEDICAL_INTERVENTION_FINALIZE_TREATMENT = '/chart-notes/:medicalRecordId/:medicalInterventionId/finalize-treatment';
const MEDICAL_INTERVENTION_EXERCISE_LOG_UPDATE = '/chart-notes/:medicalRecordId/:medicalInterventionId/exercise-log-update';
const MEDICAL_INTERVENTION_EXERCISE_LOG_VIEW = '/chart-notes/:medicalRecordId/:medicalInterventionId/exercise-log-view';
const MEDICAL_RECORD_LIST = '/chart-notes/:clientId/medical-record-list';
const INTERVENTION_EXERCISE_LOG_ATTACHMENT_LIST = '/chart-notes/:interventionId/exercise-log';

const MEDICAL_INTERVENTION_DETAILS = '/chart-notes/intervention-details/:medicalInterventionId';
const MEDICAL_INTERVENTION_SURGERY_RECORD_DETAILS = '/chart-notes/:medicalRecordId/surgery-record/:surgeryRecordId';

const PROGRESS_REPORT_VIEW_DETAILS = '/chart-notes/:medicalRecordId/:progressReportId/progress-report-view-details';
const MEDICAL_RECORD_PROGRESS_REPORT_ADVANCED_DETAILS_UPDATE = '/chart-notes/:medicalRecordId/:progressReportId/progress-report-advance-details-update/:mode';
const DRY_NEEDLING_FILE_VIEW_DETAILS = '/chart-notes/:medicalRecordId/:dryNeedlingFileId/dry-needling-file-view-details';
const CONCUSSION_FILE_VIEW_DETAILS = '/chart-notes/:medicalRecordId/:concussionFileId/concussion-file-view-details';
const MEDICAL_RECORD_DOCUMENT_VIEW_DETAILS = '/chart-notes/:medicalRecordId/:medicalRecordDocumentId/medical-record-document-view-details';
const MEDICAL_RECORD_VIEW_EXERCISE_RECORD = '/chart-notes/:medicalRecordId/consolidated-exercise-record';

const INVENTORY = "/inventory";
const INVENTORY_LIST = "/inventory/inventory-list";
const ADD_INVENTORY_PRODUCT = "/inventory/add-product";
const INVENTORY_PRODUCT_VIEW_DETAILS = "/inventory/product-details/:productId";
const EDIT_INVENTORY_PRODUCT = "/inventory/edit-product/:productId";

const BILLING = "/billing";
const BILLING_LIST = "/billing/billing-list";
const ADD_NEW_RECEIPT = "/billing/add-new-receipt";
const BILLING_DETAILS = "/billing/billing-details/:billingId";

const GUEST_ROUTES = [NOT_FOUND_ROUTE, DESIGN_SYSTEM_ROUTE, LOGIN_ROUTE];

export {
    LOGIN_ROUTE,
    COMING_SOON_ROUTE,
    NOT_FOUND_ROUTE,
    GUEST_ROUTES,
    TEST_ROUTE,
    DESIGN_SYSTEM_ROUTE,
    DASHBOARD,
    ADMIN,
    SYSTEM_SETTINGS,
    RESTRICTED_ROUTE,
    SERVICE_CATEGORY_LIST,
    SERVICE_CATEGORY_DETAILS,
    SERVICE_DETAILS,
    SERVICE_ADD,
    SERVICE_EDIT,
    FACILITY_LIST,
    FACILITY_DETAILS,
    CLIENT_LIST,
    CLIENT_ADD,
    CLIENT_DETAILS,
    CLIENT_EDIT,
    CLIENT_SEARCH,
    SCHEDULING_VIEW,
    CLIENT_MEDICAL_RECORD_DETAILS,
    ADD_MEDICAL_RECORD,
    CHART_NOTES_LIST,
    MEDICAL_INTERVENTION_ROM_CONFIG,
    MEDICAL_INTERVENTION_SPECIAL_TESTS,
    MEDICAL_INTERVENTION_ICD_CODES,
    MEDICAL_RECORD_LIST,
    INTERVENTION_EXERCISE_LOG_ATTACHMENT_LIST,
    MEDICAL_INTERVENTION_EXERCISE_LOG_UPDATE,
    MEDICAL_INTERVENTION_EXERCISE_LOG_VIEW,
    MEDICAL_INTERVENTION_DETAILS,
    MEDICAL_INTERVENTION_SURGERY_RECORD_DETAILS,
    PROGRESS_REPORT_VIEW_DETAILS,
    MEDICAL_RECORD_PROGRESS_REPORT_ADVANCED_DETAILS_UPDATE,
    MEDICAL_INTERVENTION_FINALIZE_TREATMENT,
    DRY_NEEDLING_FILE_VIEW_DETAILS,
    CONCUSSION_FILE_VIEW_DETAILS,
    MEDICAL_RECORD_DOCUMENT_VIEW_DETAILS,
    MEDICAL_RECORD_VIEW_EXERCISE_RECORD,
    INVENTORY,
    INVENTORY_LIST,
    ADD_INVENTORY_PRODUCT,
    INVENTORY_PRODUCT_VIEW_DETAILS,
    EDIT_INVENTORY_PRODUCT,
    UPDATE_MEDICAL_INTERVENTION,
    VIEW_MEDICAL_INTERVENTION,
    BILLING,
    BILLING_LIST,
    ADD_NEW_RECEIPT,
    BILLING_DETAILS,
    CLIENT_PROFILE_DETAILS
};
