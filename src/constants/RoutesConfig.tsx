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

const CLIENT_SEARCH = '/client-search';
const ADD_MEDICAL_RECORD = '/chart-notes/:clientId/add-medical-record';
const EDIT_MEDICAL_RECORD = '/chart-notes/:medicalId';
const ADD_MEDICAL_INTERVENTION = '/chart-notes/:clientId/:medicalInterventionId/add-medical-intervention';
const CLIENT_CHART_NOTES = '/chart-notes/:clientId/medical-record-list';

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
    ADD_MEDICAL_RECORD,
    ADD_MEDICAL_INTERVENTION,
    CLIENT_CHART_NOTES,
    EDIT_MEDICAL_RECORD
}
