import React, {useEffect} from 'react';
import {Navigate, Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import NotFoundScreen from "../screens/not-found/notFoundScreen";
import AuthLayout from "../layouts/auth-layout/AuthLayout";
import {
    ADMIN,
    COMING_SOON_ROUTE,
    DASHBOARD,
    DESIGN_SYSTEM_ROUTE,
    LOGIN_ROUTE,
    NOT_FOUND_ROUTE, SERVICE_CATEGORY_DETAILS, SERVICE_CATEGORY_LIST,
    TEST_ROUTE
} from "../constants/RoutesConfig";
import TestScreen from "../screens/test/TestScreen";
import DesignSystemScreen from "../screens/design-system/DesignSystemScreen";
import LoginScreen from "../screens/auth/login/LoginScreen";
import AppLayout from "../layouts/app-layout/AppLayout";
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import ComingSoonScreen from "../screens/coming-soon/ComingSoonScreen";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../store/reducers";
import {CommonService} from "../shared/services";
import AdminModuleLayoutScreen from "../screens/admin-module-layout/AdminModuleLayoutScreen";
import ServiceCategoriesListScreen
    from "../screens/admin/service-categories/service-categories-list/ServiceCategoriesListScreen";
import ServiceCategoryDetailsScreen
    from "../screens/admin/service-categories/service-category-details/ServiceCategoryDetailsScreen";

const ProtectedRoute = (props: React.PropsWithChildren<any>) => {

    const {children} = props;
    const {token} = useSelector((state: IRootReducerState) => state.account);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!token) {
            navigate('/login?returnUrl=' + encodeURIComponent(location.pathname + location.search));
        }
    }, [token, navigate, location]);

    return children;
}

const UnProtectedRoute = (props: React.PropsWithChildren<any>) => {

    const {children} = props;
    const {token} = useSelector((state: IRootReducerState) => state.account);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let returnUrl = CommonService._routeConfig.Dashboard();
        if (!!token) {
            const query = CommonService.parseQueryString(location.search);
            if (Object.keys(query).includes('returnUrl')) {
                returnUrl = query.returnUrl;
            }
            navigate(returnUrl);
        }
    }, [token, navigate, location])

    return children;
}

export interface NavigatorProps {

}

const Navigator = (props: NavigatorProps) => {

    return (
        <Routes>
            <Route element={<AppLayout/>}>
                <Route
                    index
                    element={
                        <ProtectedRoute>
                            <DashboardScreen/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={DASHBOARD}
                    element={
                        <ProtectedRoute>
                            <DashboardScreen/>
                        </ProtectedRoute>
                    }
                />
                <Route path={ADMIN} element={<AdminModuleLayoutScreen/>}>
                    <Route
                        index
                        element={
                            <Navigate to={SERVICE_CATEGORY_LIST}/>
                        }
                    />
                    <Route
                        path={SERVICE_CATEGORY_LIST}
                        element={
                            <ProtectedRoute>
                                <ServiceCategoriesListScreen/>
                            </ProtectedRoute>
                        }
                    />
                </Route>
                <Route
                    path={SERVICE_CATEGORY_DETAILS + '/:serviceCategoryId'}
                    element={
                        <ProtectedRoute>
                            <ServiceCategoryDetailsScreen/>
                        </ProtectedRoute>
                    }
                />
                <Route path={COMING_SOON_ROUTE} element={<ComingSoonScreen/>}/>
            </Route>
            <Route element={<AuthLayout/>}>
                <Route index
                       element={
                           <UnProtectedRoute>
                               <LoginScreen/>
                           </UnProtectedRoute>
                       }/>
                <Route
                    path={LOGIN_ROUTE}
                    element={
                        <UnProtectedRoute>
                            <LoginScreen/>
                        </UnProtectedRoute>
                    }
                />
            </Route>
            <Route path={TEST_ROUTE} element={<TestScreen/>}/>
            <Route path={DESIGN_SYSTEM_ROUTE} element={<DesignSystemScreen/>}/>
            <Route path={NOT_FOUND_ROUTE} element={<NotFoundScreen/>}/>
            <Route path="*" element={<Navigate to={NOT_FOUND_ROUTE}/>}/>
        </Routes>
    )
};

export default Navigator;



