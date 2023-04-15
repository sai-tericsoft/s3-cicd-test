import "./AppointmentSettingsLayoutComponent.scss";
import TabsWrapperComponent, {
    TabComponent,
    TabContentComponent,
    TabsComponent
} from "../../../../shared/components/tabs/TabsComponent";
import React, {useCallback, useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import AppointmentSettingsRescheduleComponent
    from "../appointment-settings-reschedule/AppointmentSettingsRescheduleComponent";
import AppointmentSettingsRemainderComponent
    from "../appointment-settings-remainder/AppointmentSettingsRemainderComponent";
import AppointmentSettingsCancellationComponent
    from "../appointment-settings-cancellation/AppointmentSettingsCancellationComponent";
import AppointmentSettingsConfirmationComponent
    from "../appointment-settings-confirmation/AppointmentSettingsConfirmationComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";
import LoaderComponent from "../../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../../shared/components/status-card/StatusCardComponent";
import {CommonService} from "../../../../shared/services";
import {IAPIResponseType} from "../../../../shared/models/api.model";
import {IServiceCategory} from "../../../../shared/models/service-category.model";
import {getAppointmentSettings} from "../../../../store/actions/appointment.action";

interface AppointmentSettingsLayoutComponentProps {

}

const AppointmentSettingsSteps: any[] = ["confirmation", "cancellation", "reschedule", "reminder"];
const mentionsList = [
    {
        id: "client_name",
        display: "client_name",
    },
    {
        id: "client_emailid",
        display: "client_emailid",
    },
    {
        id: "provider_name",
        display: "provider_name",
    },
    {
        id: "appointment_date",
        display: "appointment_date",
    },
    {
        id: "appointment_time",
        display: "appointment_time",
    },
    {
        id: "service_category",
        display: "service_category",
    },
    {
        id: "service",
        display: "service",
    },
    {
        id: "appointment_id",
        display: "appointment_id",
    },
];

const AppointmentSettingsLayoutComponent = (props: AppointmentSettingsLayoutComponentProps) => {
    const dispatch = useDispatch();
    const [currentTab, setCurrentTab] = useState<any>("confirmation");
    const [searchParams, setSearchParams] = useSearchParams();

    const {
        isAppointmentSettingsLoading,
        isAppointmentSettingsLoaded,
        isAppointmentSettingsLoadingFailed,
        appointmentSettings,
    } = useSelector((state: IRootReducerState) => state.appointments);
    const [isTemplateSaveInProgress, setIsTemplateSaveInProgress] = useState(false);

    useEffect(() => {
        let currentTab: any = searchParams.get("currentStep");
        if (currentTab) {
            if (!AppointmentSettingsSteps.includes(currentTab)) {
                currentTab = "confirmation";
            }
        } else {
            currentTab = "confirmation";
        }
        setCurrentTab(currentTab);
    }, [searchParams]);

    const handleTabChange = useCallback((e: any, value: any) => {
        searchParams.set("currentStep", value);
        setSearchParams(searchParams);
        setCurrentTab(value);
    }, [searchParams, setSearchParams]);

    const onSubmit = useCallback((template_details: any, type: string) => {
        setIsTemplateSaveInProgress(true);
        let payload;
        if (type === 'confirmation_template') {
            payload = {
                confirmation_template: template_details
            }
        }
        if (type === 'cancellation_template') {
            payload = {
                cancellation_template: template_details
            }
        }
        if (type === 'rescheduling_template') {
            payload = {
                rescheduling_template: template_details
            }
        }
        if (type === 'reminder_template') {
            payload = {
                reminder_template: template_details
            }
        }
        CommonService._appointment.setAppointmentSetting(payload)
            .then((response: IAPIResponseType<IServiceCategory>) => {
                setIsTemplateSaveInProgress(false);
                dispatch(getAppointmentSettings())
            })
            .catch((error: any) => {
                setIsTemplateSaveInProgress(false);
            })
    }, []);

    return (
        <div className={'appointment-settings-layout-component'}>
            {
                isAppointmentSettingsLoading && <div>
                    <LoaderComponent/>
                </div>
            }
            {
                isAppointmentSettingsLoadingFailed &&
                <StatusCardComponent title={"Failed to fetch client Details"}/>
            }
            {
                (isAppointmentSettingsLoaded && appointmentSettings) && <>
                    <TabsWrapperComponent>
                        <TabsComponent
                            value={currentTab}
                            allowScrollButtonsMobile={false}
                            variant={"fullWidth"}
                            onUpdate={handleTabChange}
                        >
                            <TabComponent className={'appointment-settings-tab'} label="Confirmation"
                                          value={"confirmation"}/>
                            <TabComponent className={'appointment-settings-tab'}
                                          label="Cancellation"
                                          value={"cancellation"}/>
                            <TabComponent className={'appointment-settings-tab'} label="Reschedule"
                                          value={"reschedule"}/>
                            <TabComponent className={'appointment-settings-tab'} label="Reminder"
                                          value={"reminder"}/>
                        </TabsComponent>
                        <TabContentComponent value={"confirmation"} selectedTab={currentTab}>
                            <AppointmentSettingsConfirmationComponent
                                mentionsList={mentionsList}
                                isTemplateSaveInProgress={isTemplateSaveInProgress}
                                onSubmit={(confirmation_template_data: any) => onSubmit(confirmation_template_data, 'confirmation_template')}
                                appointmentSettingsConfirmationDetails={appointmentSettings.confirmation_template}/>
                        </TabContentComponent>
                        <TabContentComponent value={"cancellation"}
                                             selectedTab={currentTab}>
                            <AppointmentSettingsCancellationComponent/>
                        </TabContentComponent>
                        <TabContentComponent value={"reschedule"} selectedTab={currentTab}>
                            <AppointmentSettingsRescheduleComponent/>
                        </TabContentComponent>
                        <TabContentComponent value={"reminder"} selectedTab={currentTab}>
                            <AppointmentSettingsRemainderComponent/>
                        </TabContentComponent>
                    </TabsWrapperComponent>
                </>
            }
        </div>
    );

};

export default AppointmentSettingsLayoutComponent;