import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import NotFoundScreen from "../screens/not-found/notFoundScreen";
import AuthLayout from "../layouts/auth-layout/AuthLayout";
import {
    DASHBOARD,
    DESIGN_SYSTEM_ROUTE, LOGIN_ROUTE,
    NOT_FOUND_ROUTE,
    TEST_ROUTE
} from "../constants/RoutesConfig";
import TestScreen from "../screens/test/testScreen";
import DesignSystemScreen from "../screens/design-system/DesignSystemScreen";
import DashboardScreen from "../screens/dashboard/dashboardScreen";
import LoginScreen from "../screens/auth/login/LoginScreen";
import AppLayout from "../layouts/app-layout/AppLayout";
// import {useSelector} from "react-redux";
// import {IRootReducerState} from "../store/reducers";

const ProtectedRoute = (props: React.PropsWithChildren<any>) => {

    const {children} = props;
    // const {aclRule} = data;
    // const navigate = useNavigate();

    // const {currentUser} = useSelector((state: IRootReducerState) => state.account);
    // const roleCode = currentUser?.roleObj?.code;
    // const canAccess = aclRule.includes(UserRoles.STAR) || (aclRule.includes(roleCode));
    // if (canAccess) {
    //     return children;
    // } else {
    //     navigate(CommonService._routeConfig.RestrictedRoute());
    // }
    return children;
}

export interface NavigatorProps {

}

const Navigator = (props: NavigatorProps) => {

    return (
        <>
            <Routes>
                <Route element={<AppLayout/>}>
                    <Route index element={<DashboardScreen/>}/>
                    <Route
                        path={DASHBOARD}
                        element={
                            <ProtectedRoute>
                                <DashboardScreen/>
                            </ProtectedRoute>
                        }
                    />
                    {/*<Route path={COMING_SOON_ROUTE} element={<ComingSoonScreen/>}/>*/}
                </Route>
                <Route element={<AuthLayout/>}>
                    <Route index element={<LoginScreen/>}/>
                    <Route path={LOGIN_ROUTE} element={<LoginScreen/>}/>
                </Route>
                <Route path={TEST_ROUTE} element={<TestScreen/>}/>
                <Route path={DESIGN_SYSTEM_ROUTE} element={<DesignSystemScreen/>}/>
                <Route path={NOT_FOUND_ROUTE} element={<NotFoundScreen/>}/>
                <Route path="*" element={<Navigate to={NOT_FOUND_ROUTE}/>}/>
            </Routes>
        </>
    )
};

export default Navigator;



