import {
    ADMIN, CLIENT_LIST,
    COMING_SOON_ROUTE,
    DASHBOARD, FACILITY_DETAILS, FACILITY_LIST,
    LOGIN_ROUTE,
    NOT_FOUND_ROUTE, SERVICE_ADD,
    SERVICE_CATEGORY_DETAILS,
    SERVICE_CATEGORY_LIST,
    SERVICE_DETAILS, SERVICE_EDIT,
    TEST_ROUTE
} from "../../constants/RoutesConfig";

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

const RouteConfigService = {
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
    ClientList
}

export default RouteConfigService;
