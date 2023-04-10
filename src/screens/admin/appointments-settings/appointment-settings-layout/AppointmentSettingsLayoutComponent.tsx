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

interface AppointmentSettingsLayoutComponentProps {

}

const AppointmentSettingsSteps: any[] = ["confirmation", "cancellation", "reschedule", "reminder"];

const AppointmentSettingsLayoutComponent = (props: AppointmentSettingsLayoutComponentProps) => {
    const [currentTab, setCurrentTab] = useState<any>("confirmation");
    const [searchParams, setSearchParams] = useSearchParams();

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

    return (
        <div className={'appointment-settings-layout-component'}>
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
                    <AppointmentSettingsConfirmationComponent/>
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
        </div>
    );

};

export default AppointmentSettingsLayoutComponent;