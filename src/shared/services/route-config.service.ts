import {
    COMING_SOON_ROUTE,
    LOGIN_ROUTE,
    NOT_FOUND_ROUTE,
    TEST_ROUTE,
    DASHBOARD,
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

const RouteConfigService = {
    LoginRoute,
    NotFoundRoute,
    TestRoute,
    ComingSoonRoute,
    Dashboard
}

export default RouteConfigService;
