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
import {CommonService} from "../../../../shared/services";
import {IAPIResponseType} from "../../../../shared/models/api.model";
import {IServiceCategory} from "../../../../shared/models/service-category.model";
import {getAppointmentSettings} from "../../../../store/actions/appointment.action";

interface AppointmentSettingsLayoutComponentProps {

}

const AppointmentSettingsSteps: any[] = ["confirmation", "cancellation", "reschedule", "reminder"];

const AppointmentSettingsLayoutComponent = (props: AppointmentSettingsLayoutComponentProps) => {
    const dispatch = useDispatch();
    const [currentTab, setCurrentTab] = useState<any>("confirmation");
    const [searchParams, setSearchParams] = useSearchParams();
    const {userMentionsList} = useSelector((state: IRootReducerState) => state.staticData);
    const [mentionsList, setMentionsList] = useState<any[]>([]);

    const {
        isAppointmentSettingsLoading,
        isAppointmentSettingsLoaded,
        appointmentSettings,
    } = useSelector((state: IRootReducerState) => state.appointments);
    const [isTemplateSaveInProgress, setIsTemplateSaveInProgress] = useState(false);

    useEffect(() => {
        const userMentionData = userMentionsList?.map((mention: any) => ({
            id: mention.title,
            display: mention.title,
        }));
        setMentionsList(userMentionData);
    }, [userMentionsList])

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
                rescheduling_template: template_details,
                allow_rescheduling_before: template_details.allow_rescheduling_before,
                max_rescheduling: template_details.max_rescheduling
            }
            delete payload.rescheduling_template.allow_rescheduling_before;
            delete payload.rescheduling_template.max_rescheduling;
        }
        if (type === 'reminder_template') {
            payload = {
                reminder_template: template_details,
                primary_reminder_before: template_details.primary_reminder_before,
                secondary_reminder_before: template_details.secondary_reminder_before
            }
            delete payload.reminder_template.primary_reminder_before;
            delete payload.reminder_template.secondary_reminder_before;
        }
        CommonService._appointment.setAppointmentSetting(payload)
            .then((response: IAPIResponseType<IServiceCategory>) => {
                setIsTemplateSaveInProgress(false);
                dispatch(getAppointmentSettings())
            })
            .catch((error: any) => {
                setIsTemplateSaveInProgress(false);
            })
    }, [dispatch]);

    return (
        <div className={'appointment-settings-layout-component'}>
            {
                isAppointmentSettingsLoading && <div>
                    <LoaderComponent/>
                </div>
            }
            {
                isAppointmentSettingsLoaded && <>
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
                                appointmentSettingsConfirmationDetails={appointmentSettings?.confirmation_template}/>
                        </TabContentComponent>
                        <TabContentComponent value={"cancellation"}
                                             selectedTab={currentTab}>
                            <AppointmentSettingsCancellationComponent
                                mentionsList={mentionsList}
                                isTemplateSaveInProgress={isTemplateSaveInProgress}
                                onSubmit={(cancellation_template_data: any) => onSubmit(cancellation_template_data, 'cancellation_template')}
                                appointmentSettingsCancellationDetails={appointmentSettings?.cancellation_template}
                            />
                        </TabContentComponent>
                        <TabContentComponent value={"reschedule"} selectedTab={currentTab}>
                            <AppointmentSettingsRescheduleComponent
                                mentionsList={mentionsList}
                                isTemplateSaveInProgress={isTemplateSaveInProgress}
                                onSubmit={(rescheduling_template_data: any) => onSubmit(rescheduling_template_data, 'rescheduling_template')}
                                appointmentSettingsReschedulingDetails={appointmentSettings?.rescheduling_template}
                                allowReschedulingBefore={appointmentSettings?.allow_rescheduling_before}
                                maxRescheduling={appointmentSettings?.max_rescheduling}
                            />
                        </TabContentComponent>
                        <TabContentComponent value={"reminder"} selectedTab={currentTab}>
                            <AppointmentSettingsRemainderComponent
                                mentionsList={mentionsList}
                                isTemplateSaveInProgress={isTemplateSaveInProgress}
                                onSubmit={(reminder_template_data: any) => onSubmit(reminder_template_data, 'reminder_template')}
                                appointmentSettingsRemainderDetails={appointmentSettings?.reminder_template}
                                primaryReminderBefore={appointmentSettings?.primary_reminder_before}
                                secondaryReminderBefore={appointmentSettings?.secondary_reminder_before}
                            />
                        </TabContentComponent>
                    </TabsWrapperComponent>
                </>
            }
        </div>
    );

};

export default AppointmentSettingsLayoutComponent;