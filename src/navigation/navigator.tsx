import React, {useEffect, useLayoutEffect} from 'react';
import {Navigate, Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import NotFoundScreen from "../screens/not-found/notFoundScreen";
import AuthLayout from "../layouts/auth-layout/AuthLayout";
import TestScreen from "../screens/test/TestScreen";
import DesignSystemScreen from "../screens/design-system/DesignSystemScreen";
import LoginScreen from "../screens/auth/login/LoginScreen";
import AppLayout from "../layouts/app-layout/AppLayout";
import ComingSoonScreen from "../screens/coming-soon/ComingSoonScreen";
import {useDispatch, useSelector} from "react-redux";
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
import ClientDetailsScreen from "../screens/clients/client-details/ClientDetailsScreen";
import ClientEditScreen from "../screens/clients/client-edit/ClientEditScreen";
import ClientSearchScreen from "../screens/chart-notes/client-search/ClientSearchScreen";
import AddMedicalRecordScreen from "../screens/chart-notes/add-medical-record/AddMedicalRecordScreen";
import AddMedicalInterventionScreen from "../screens/chart-notes/add-medical-intervention/AddMedicalInterventionScreen";
import {
    ADD_INVENTORY_PRODUCT,
    ADD_MEDICAL_INTERVENTION,
    ADD_MEDICAL_RECORD,
    ADMIN,
    CHART_NOTES_LIST,
    CLIENT_ADD,
    CLIENT_DETAILS,
    CLIENT_EDIT,
    CLIENT_LIST,
    CLIENT_MEDICAL_RECORD_DETAILS,
    CLIENT_SEARCH,
    COMING_SOON_ROUTE,
    CONCUSSION_FILE_VIEW_DETAILS,
    DESIGN_SYSTEM_ROUTE,
    DRY_NEEDLING_FILE_VIEW_DETAILS,
    EDIT_INVENTORY_PRODUCT,
    FACILITY_DETAILS,
    FACILITY_LIST,
    INTERVENTION_EXERCISE_LOG_ATTACHMENT_LIST,
    INVENTORY,
    INVENTORY_LIST,
    INVENTORY_PRODUCT_VIEW_DETAILS,
    LOGIN_ROUTE,
    MEDICAL_INTERVENTION_DETAILS,
    MEDICAL_INTERVENTION_EXERCISE_LOG_UPDATE,
    MEDICAL_INTERVENTION_EXERCISE_LOG_VIEW,
    MEDICAL_INTERVENTION_FINALIZE_TREATMENT,
    MEDICAL_INTERVENTION_ICD_CODES,
    MEDICAL_INTERVENTION_ROM_CONFIG,
    MEDICAL_INTERVENTION_SPECIAL_TESTS,
    MEDICAL_INTERVENTION_SURGERY_RECORD_DETAILS,
    MEDICAL_RECORD_DOCUMENT_VIEW_DETAILS,
    MEDICAL_RECORD_LIST,
    MEDICAL_RECORD_PROGRESS_REPORT_ADVANCED_DETAILS_UPDATE,
    MEDICAL_RECORD_VIEW_EXERCISE_RECORD,
    NOT_FOUND_ROUTE,
    PROGRESS_REPORT_VIEW_DETAILS,
    SCHEDULING_VIEW,
    SERVICE_ADD,
    SERVICE_CATEGORY_DETAILS,
    SERVICE_CATEGORY_LIST,
    SERVICE_DETAILS,
    SERVICE_EDIT,
    SYSTEM_SETTINGS,
    TEST_ROUTE
} from "../constants/RoutesConfig";
import MedicalInterventionRomConfigScreen
    from "../screens/chart-notes/medical-intervention-rom-config/MedicalInterventionRomConfigScreen";
import MedicalInterventionSpecialTestsScreen
    from "../screens/chart-notes/medical-intervention-special-tests/MedicalInterventionSpecialTestsScreen";
import MedicalInterventionExerciseLogUpdateScreen
    from "../screens/chart-notes/medical-intervention-exercise-log-update/MedicalInterventionExerciseLogUpdateScreen";
import ClientAddScreen from "../screens/clients/client-add/ClientAddScreen";
import ClientMedicalRecordDetailsComponent
    from "../screens/chart-notes/client-medical-record-details/ClientMedicalRecordDetailsComponent";
import ExerciseLogAttachmentListComponent
    from "../screens/chart-notes/exercise-log-attachment-list/ExerciseLogAttachmentListComponent";
import MedicalInterventionExerciseLogViewScreen
    from "../screens/chart-notes/medical-intervention-exercise-log-view/MedicalInterventionExerciseLogViewScreen";
import MedicalRecordListScreen from "../screens/chart-notes/medical-record-list/MedicalRecordListScreen";
import ClientMedicalInterventionDetailsComponent
    from "../screens/chart-notes/client-medical-intervention-details/ClientMedicalInterventionDetailsComponent";
import MedicalInterventionICDCodesScreen
    from "../screens/chart-notes/medical-intervention-icd-codes/MedicalInterventionICDCodesScreen";
import SurgeryRecordViewScreen from "../screens/chart-notes/surgery-record-view/SurgeryRecordViewScreen";
import ProgressRecordAdvancedDetailsUpdateScreen
    from "../screens/chart-notes/progress-record-advanced-details-update/ProgressRecordAdvancedDetailsUpdateScreen";
import MedicalInterventionFinalizeTreatmentScreen
    from "../screens/chart-notes/medical-intervention-finalize-treatment/MedicalInterventionFinalizeTreatmentScreen";
import MedicalRecordProgressReportViewDetailsScreen
    from "../screens/chart-notes/medical-record-progress-report-view-details/MedicalRecordProgressReportViewDetailsScreen";
import ViewDryNeedlingFileScreen from "../screens/chart-notes/view-dry-needling-file/ViewDryNeedlingFileScreen";
import SchedulingScreen from "../screens/scheduling/SchedulingScreen";
import ViewConcussionFileScreen from "../screens/chart-notes/view-concussion-file/ViewConcussionFileScreen";
import ViewMedicalRecordDocumentScreen
    from "../screens/chart-notes/view-medical-record-document/ViewMedicalRecordDocumentScreen";
import ViewExerciseRecordScreen from "../screens/chart-notes/view-exercise-record/ViewExerciseRecordScreen";
import AddInventoryProductComponent from "../screens/inventory/add-inventory-product/AddInventoryProductComponent";
import InventoryProductViewDetailsComponent
    from "../screens/inventory/inventory-product-view-details/InventoryProductViewDetailsComponent";
import EditInventoryProductDetailsComponent
    from "../screens/inventory/edit-inventory-product-details/EditInventoryProductDetailsComponent";
import InventoryListScreen from "../screens/inventory/inventory-list/InventoryListScreen";
import SystemSettingsScreen from "../screens/admin/system-settings/SystemSettingsScreen";
import ChartNotesLayoutComponent from "../screens/chart-notes/chart-notes-layout/ChartNotesLayoutComponent";
import InventoryDetailsMainLayoutComponent
    from "../screens/inventory/inventory-details-main-layout/InventoryDetailsMainLayoutComponent";
import {setSystemLocked} from "../store/actions/account.action";

const ProtectedRoute = (props: React.PropsWithChildren<any>) => {

    const {children} = props;
    const {token} = useSelector((state: IRootReducerState) => state.account);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!token) {
            dispatch(setSystemLocked(false, undefined));
            navigate('/login?returnUrl=' + encodeURIComponent(location.pathname + location.search));
        }
    }, [token, navigate, location, dispatch]);

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
        <>
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
                        path={CLIENT_ADD + '/:clientId'}
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
                    <Route path={ADMIN} element={<AdminModuleLayoutScreen/>} {...props}>
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
                            path={SYSTEM_SETTINGS}
                            element={
                                <ProtectedRoute>
                                    <SystemSettingsScreen/>
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
                    <Route path={SCHEDULING_VIEW}
                           element={<ProtectedRoute>
                               <SchedulingScreen/>
                           </ProtectedRoute>
                           }
                    />
                    <Route path={CHART_NOTES_LIST}
                           element={<ChartNotesLayoutComponent/>} {...props}>
                        <Route
                            index
                            element={
                                <Navigate to={CLIENT_SEARCH}/>
                            }
                        />
                        <Route path={CLIENT_SEARCH}
                               element={<ProtectedRoute>
                                   <ClientSearchScreen/>
                               </ProtectedRoute>
                               }
                        />
                        <Route path={MEDICAL_RECORD_LIST}
                               element={<ProtectedRoute>
                                   <MedicalRecordListScreen/>
                               </ProtectedRoute>
                               }
                        />
                        <Route path={CLIENT_MEDICAL_RECORD_DETAILS}
                               element={<ProtectedRoute>
                                   <ClientMedicalRecordDetailsComponent/>
                               </ProtectedRoute>}
                        />
                        <Route path={ADD_MEDICAL_RECORD}
                               element={<ProtectedRoute>
                                   <AddMedicalRecordScreen/>
                               </ProtectedRoute>
                               }
                        />
                        <Route path={ADD_MEDICAL_INTERVENTION}
                               element={<ProtectedRoute>
                                   <AddMedicalInterventionScreen/>
                               </ProtectedRoute>
                               }
                        />
                        <Route path={MEDICAL_INTERVENTION_ROM_CONFIG}
                               element={<ProtectedRoute>
                                   <MedicalInterventionRomConfigScreen/>
                               </ProtectedRoute>
                               }
                        />
                        <Route path={MEDICAL_INTERVENTION_SPECIAL_TESTS}
                               element={<ProtectedRoute>
                                   <MedicalInterventionSpecialTestsScreen/>
                               </ProtectedRoute>
                               }
                        />
                        <Route path={MEDICAL_INTERVENTION_ICD_CODES}
                               element={<ProtectedRoute>
                                   <MedicalInterventionICDCodesScreen/>
                               </ProtectedRoute>
                               }
                        />
                        <Route path={MEDICAL_INTERVENTION_FINALIZE_TREATMENT}
                               element={<ProtectedRoute>
                                   <MedicalInterventionFinalizeTreatmentScreen/>
                               </ProtectedRoute>
                               }
                        />
                        <Route path={MEDICAL_INTERVENTION_SURGERY_RECORD_DETAILS}
                               element={<ProtectedRoute>
                                   <SurgeryRecordViewScreen/>
                               </ProtectedRoute>
                               }
                        />
                        <Route path={MEDICAL_INTERVENTION_EXERCISE_LOG_UPDATE}
                               element={<ProtectedRoute>
                                   <MedicalInterventionExerciseLogUpdateScreen/>
                               </ProtectedRoute>
                               }
                        />
                        <Route path={MEDICAL_INTERVENTION_EXERCISE_LOG_VIEW}
                               element={<ProtectedRoute>
                                   <MedicalInterventionExerciseLogViewScreen/>
                               </ProtectedRoute>
                               }
                        />
                        <Route path={INTERVENTION_EXERCISE_LOG_ATTACHMENT_LIST}
                               element={<ProtectedRoute>
                                   <ExerciseLogAttachmentListComponent/>
                               </ProtectedRoute>
                               }/>
                        <Route path={PROGRESS_REPORT_VIEW_DETAILS}
                               element={<ProtectedRoute>
                                   <MedicalRecordProgressReportViewDetailsScreen/>
                               </ProtectedRoute>
                               }/>
                        <Route path={DRY_NEEDLING_FILE_VIEW_DETAILS}
                               element={<ProtectedRoute>
                                   <ViewDryNeedlingFileScreen/>
                               </ProtectedRoute>
                               }/>
                        <Route path={CONCUSSION_FILE_VIEW_DETAILS}
                               element={<ProtectedRoute>
                                   <ViewConcussionFileScreen/>
                               </ProtectedRoute>
                               }/>
                        <Route path={MEDICAL_RECORD_DOCUMENT_VIEW_DETAILS}
                               element={<ProtectedRoute>
                                   <ViewMedicalRecordDocumentScreen/>
                               </ProtectedRoute>
                               }/>
                        <Route path={MEDICAL_INTERVENTION_DETAILS}
                               element={<ProtectedRoute>
                                   <ClientMedicalInterventionDetailsComponent/>
                               </ProtectedRoute>}/>
                        <Route path={MEDICAL_INTERVENTION_DETAILS}
                               element={<ProtectedRoute>
                                   <ClientMedicalInterventionDetailsComponent/>
                               </ProtectedRoute>}/>
                        <Route path={MEDICAL_RECORD_PROGRESS_REPORT_ADVANCED_DETAILS_UPDATE}
                               element={<ProtectedRoute>
                                   <ProgressRecordAdvancedDetailsUpdateScreen/>
                               </ProtectedRoute>}/>
                        <Route path={MEDICAL_RECORD_VIEW_EXERCISE_RECORD}
                               element={<ProtectedRoute>
                                   <ViewExerciseRecordScreen/>
                               </ProtectedRoute>}/>
                    </Route>
                    <Route path={INVENTORY} element={<InventoryDetailsMainLayoutComponent/>}{...props}>
                        <Route
                            index
                            element={
                                <Navigate to={INVENTORY_LIST}/>
                            }/>
                        <Route path={INVENTORY_LIST}
                               element={<ProtectedRoute>
                                   <InventoryListScreen/>
                               </ProtectedRoute>
                               }/>
                        <Route path={ADD_INVENTORY_PRODUCT}
                               element={<ProtectedRoute>
                                   <AddInventoryProductComponent/>
                               </ProtectedRoute>
                               }
                        />
                        <Route path={INVENTORY_PRODUCT_VIEW_DETAILS}
                               element={<ProtectedRoute>
                                   <InventoryProductViewDetailsComponent/>
                               </ProtectedRoute>
                               }
                        />
                        <Route path={EDIT_INVENTORY_PRODUCT}
                               element={<ProtectedRoute>
                                   <EditInventoryProductDetailsComponent/>
                               </ProtectedRoute>
                               }
                        />
                    </Route>
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
        </>
    )
};

export default Navigator;
