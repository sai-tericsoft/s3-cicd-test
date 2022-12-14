import React, {useEffect} from 'react';
import {Navigate, Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import NotFoundScreen from "../screens/not-found/notFoundScreen";
import AuthLayout from "../layouts/auth-layout/AuthLayout";
import {
    ADMIN, CLIENT_ADD, CLIENT_DETAILS, CLIENT_EDIT, CLIENT_INFO, CLIENT_LIST,
    COMING_SOON_ROUTE,
    DESIGN_SYSTEM_ROUTE, FACILITY_DETAILS, FACILITY_LIST,
    LOGIN_ROUTE,
    NOT_FOUND_ROUTE, SERVICE_ADD,
    SERVICE_CATEGORY_DETAILS,
    SERVICE_CATEGORY_LIST,
    SERVICE_DETAILS, SERVICE_EDIT,
    TEST_ROUTE
} from "../constants/RoutesConfig";
import TestScreen from "../screens/test/TestScreen";
import DesignSystemScreen from "../screens/design-system/DesignSystemScreen";
import LoginScreen from "../screens/auth/login/LoginScreen";
import AppLayout from "../layouts/app-layout/AppLayout";
import ComingSoonScreen from "../screens/coming-soon/ComingSoonScreen";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../store/reducers";
import {CommonService} from "../shared/services";
import AdminModuleLayoutScreen from "../screens/admin-module-layout/AdminModuleLayoutScreen";
import ServiceCategoriesListScreen
    from "../screens/admin/service-categories/service-categories-list/ServiceCategoriesListScreen";
import ServiceCategoryDetailsScreen
    from "../screens/admin/service-categories/service-category-details/ServiceCategoryDetailsScreen";
import ServiceDetailsScreen from "../screens/admin/service/service-details/ServiceDetailsScreen";
import ServiceAddScreen from "../screens/admin/service/service-add/ServiceAddScreen";
import ServiceEditScreen from "../screens/admin/service/service-edit/ServiceEditScreen";
import FacilityListScreen from "../screens/admin/facility/facility-list/FacilityListScreen";
import FacilityDetailsScreen from "../screens/admin/facility/facility-details/FacilityDetailsScreen";
import ClientListScreen from "../screens/clients/client-list/ClientListScreen";
import ClientAddScreen from "../screens/clients/client-add/ClientAddScreen";
import ClientDetailsScreen from "../screens/clients/client-details/ClientDetailsScreen";
import ClientEditScreen from "../screens/clients/client-edit/ClientEditScreen";
import ClientBasicDetailsComponent from "../screens/chart-notes/client-basic-details/ClientBasicDetailsComponent";

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
        let returnUrl = CommonService._routeConfig.DefaultRoute();
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
                        <Navigate to={CLIENT_LIST}/>
                    }
                />
                {/*<Route*/}
                {/*    path={DASHBOARD}*/}
                {/*    element={*/}
                {/*        <ProtectedRoute>*/}
                {/*            <DashboardScreen/>*/}
                {/*        </ProtectedRoute>*/}
                {/*    }*/}
                {/*/>*/}
                <Route
                    path={CLIENT_LIST}
                    element={
                        <ProtectedRoute>
                            <ClientListScreen/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={CLIENT_ADD}
                    element={
                        <ProtectedRoute>
                            <ClientAddScreen/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={CLIENT_DETAILS + '/:clientId'}
                    element={
                        <ProtectedRoute>
                            <ClientDetailsScreen/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={CLIENT_EDIT + '/:clientId'}
                    element={
                        <ProtectedRoute>
                            <ClientEditScreen/>
                        </ProtectedRoute>
                    }
                />
                <Route path={ADMIN} element={<AdminModuleLayoutScreen/>}>
                    <Route
                        index
                        element={
                            <Navigate to={FACILITY_LIST}/>
                        }
                    />
                    <Route
                        path={FACILITY_LIST}
                        element={
                            <ProtectedRoute>
                                <FacilityListScreen/>
                            </ProtectedRoute>
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
                <Route
                    path={SERVICE_DETAILS + '/:serviceId'}
                    element={
                        <ProtectedRoute>
                            <ServiceDetailsScreen/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={SERVICE_ADD + '/:serviceCategoryId'}
                    element={
                        <ProtectedRoute>
                            <ServiceAddScreen/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={SERVICE_EDIT + '/:serviceCategoryId/:serviceId'}
                    element={
                        <ProtectedRoute>
                            <ServiceEditScreen/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={FACILITY_DETAILS + '/:facilityId'}
                    element={
                        <ProtectedRoute>
                            <FacilityDetailsScreen/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={CLIENT_INFO + '/:clientId'}
                    element={
                        <ProtectedRoute>
                            <ClientBasicDetailsComponent/>
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



