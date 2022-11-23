import {
    COMING_SOON_ROUTE,
    LOGIN_ROUTE,
    NOT_FOUND_ROUTE,
    TEST_ROUTE,
    DASHBOARD, SERVICE_CATEGORY_LIST, ADMIN, SERVICE_CATEGORY_DETAILS,
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

const ServiceCategoryDetails = ( serviceCategoryId: string ) => {
    return SERVICE_CATEGORY_DETAILS + '/' + serviceCategoryId;
}

const Admin = () => {
    return ADMIN;
}


const RouteConfigService = {
    LoginRoute,
    NotFoundRoute,
    TestRoute,
    ComingSoonRoute,
    Dashboard,
    ServiceCategoryList,
    Admin,
    ServiceCategoryDetails
}

export default RouteConfigService;
