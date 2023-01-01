import {
    ADMIN, CLIENT_ADD, CLIENT_DETAILS, CLIENT_EDIT, CLIENT_LIST, CLIENT_SEARCH,
    COMING_SOON_ROUTE,
    DASHBOARD, FACILITY_DETAILS, FACILITY_LIST,
    LOGIN_ROUTE,
    NOT_FOUND_ROUTE, SERVICE_ADD,
    SERVICE_CATEGORY_DETAILS,
    SERVICE_CATEGORY_LIST,
    SERVICE_DETAILS, SERVICE_EDIT,
    TEST_ROUTE
} from "../../constants/RoutesConfig";

const DefaultRoute = () => {
    return "/";
}

const LoginRoute = () => {
    return LOGIN_ROUTE;
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

const ClientList = () => {
    return CLIENT_LIST;
}

const ClientAdd = () => {
    return CLIENT_ADD;
}

const ClientDetails = (clientId: string) => {
    return CLIENT_DETAILS + '/' + clientId;
}

const ClientEdit = (clientId: string) => {
    return CLIENT_EDIT + '/' + clientId;
}

const ClientSearch = ()=>{
    return CLIENT_SEARCH;
}

const AddMedicalRecord = (clientId: string)=>{
    return "/chart-notes/" + clientId + '/add-medical-record';
}

const AddMedicalIntervention = (medicalInterventionId: string, )=>{
    return "/chart-notes/" + medicalInterventionId + '/add-medical-intervention';
}

const ChartNotesDetails = (clientId: string)=>{
    return "/chart-notes/" + clientId + '/medical-record-list';
}

const MedicalInterventionROMConfig = (medicalInterventionId: string, )=>{
    return "/chart-notes/" + medicalInterventionId + '/rom-config';
}

const MedicalInterventionSpecialTests = (medicalInterventionId: string, )=>{
    return "/chart-notes/" + medicalInterventionId + '/special-tests';
}

const RouteConfigService = {
    DefaultRoute,
    LoginRoute,
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
    AddMedicalRecord,
    AddMedicalIntervention,
    ChartNotesDetails,
    MedicalInterventionROMConfig,
    MedicalInterventionSpecialTests
}

export default RouteConfigService;
