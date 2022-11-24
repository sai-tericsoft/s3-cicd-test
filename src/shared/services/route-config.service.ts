import {
    ADMIN,
    COMING_SOON_ROUTE,
    DASHBOARD,
    LOGIN_ROUTE,
    NOT_FOUND_ROUTE,
    SERVICE_CATEGORY_DETAILS,
    SERVICE_CATEGORY_LIST,
    SERVICE_DETAILS,
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
    ServiceCategoryDetails,
    ServiceDetails
}

export default RouteConfigService;
