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
const SERVICE_DETAILS = "/admin/service-details";
const SERVICE_ADD = "/admin/service/add";
const SERVICE_EDIT = "/admin/service/edit";
const SERVICE_CATEGORY_DETAILS = "/admin/service-category-details";

const FACILITY_LIST = "/admin/facility-list";
const FACILITY_DETAILS = "/admin/facility-details";

const CLIENT_LIST = "/client-list";
const CLIENT_ADD = "/client-add";
const CLIENT_DETAILS = "/client-details";
const CLIENT_EDIT = "/client-edit";

const CLIENT_SEARCH='/client-search';
const CLIENT_MEDICAL_RECORD_DETAILS = '/chart-notes/:medicalRecordId/medical-record-details';
const CLIENT_CHART_NOTES_DETAILS = "/chart-notes";
const ADD_MEDICAL_RECORD = '/chart-notes/:clientId/add-medical-record';
const CLIENT_CHART_NOTES = '/chart-notes/:clientId/medical-record-list';
const ADD_MEDICAL_INTERVENTION = '/chart-notes/:medicalRecordId/:medicalInterventionId/add-medical-intervention';
const MEDICAL_INTERVENTION_VIEW = '/chart-notes/:medicalRecordId/:medicalInterventionId/view';
const MEDICAL_INTERVENTION_ROM_CONFIG = '/chart-notes/:medicalRecordId/:medicalInterventionId/rom-config';
const MEDICAL_INTERVENTION_SPECIAL_TESTS = '/chart-notes/:medicalRecordId/:medicalInterventionId/special-tests';
const MEDICAL_INTERVENTION_ICD_CODES = '/chart-notes/:medicalRecordId/:medicalInterventionId/icd-codes';
const MEDICAL_INTERVENTION_FINALIZE_TREATMENT = '/chart-notes/:medicalRecordId/:medicalInterventionId/finalize-treatment';
const MEDICAL_INTERVENTION_EXERCISE_LOG_UPDATE = '/chart-notes/:medicalRecordId/:medicalInterventionId/exercise-log-update';
const MEDICAL_INTERVENTION_EXERCISE_LOG_VIEW = '/chart-notes/:medicalRecordId/:medicalInterventionId/exercise-log-view';
const MEDICAL_RECORD_LIST = '/chart-notes/:clientId/medical-record-list';
const INTERVENTION_EXERCISE_LOG_ATTACHMENT_LIST ='/chart-notes/:interventionId/exercise-log';

const MEDICAL_INTERVENTION_DETAILS = '/chart-notes/intervention-details/:medicalInterventionId';
const MEDICAL_INTERVENTION_SURGERY_RECORD_DETAILS = '/chart-notes/:medicalRecordId/surgery-record/:surgeryRecordId';

const PROGRESS_REPORT_VIEW_DETAILS = '/chart-notes/:medicalRecordId/:progressReportId/progress-report-view-details';
const MEDICAL_RECORD_PROGRESS_REPORT_ADVANCED_DETAILS_UPDATE = '/chart-notes/:medicalRecordId/:progressReportId/progress-report-advance-details-update';
const DRY_NEEDLING_FILE_VIEW_DETAILS = '/chart-notes/:medicalRecordId/:dryNeedlingFileId/dry-needling-file-view-details';
const CONCUSSION_FILE_VIEW_DETAILS = '/chart-notes/:medicalRecordId/:concussionFileId/concussion-file-view-details';
const MEDICAL_RECORD_DOCUMENT_VIEW_DETAILS = '/chart-notes/:medicalRecordId/:medicalRecordDocumentId/medical-record-document-view-details';
const MEDICAL_RECORD_VIEW_EXERCISE_RECORD = '/chart-notes/:medicalRecordId/consolidated-exercise-record';
const INVENTORY_LIST = "/inventory";
const INVENTORY_LIST_DETAILS = "/inventory/inventory-list";

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
    CLIENT_MEDICAL_RECORD_DETAILS,
    ADD_MEDICAL_RECORD,
    ADD_MEDICAL_INTERVENTION,
    MEDICAL_INTERVENTION_VIEW,
    CLIENT_CHART_NOTES,
    CLIENT_CHART_NOTES_DETAILS,
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
    INVENTORY_LIST,
    INVENTORY_LIST_DETAILS
};
