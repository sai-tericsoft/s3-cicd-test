import "./DashboardScreen.scss";
import {useDispatch, useSelector} from "react-redux";
import React, {useCallback, useEffect, useState} from "react";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {IRootReducerState} from "../../../store/reducers";
import TabsWrapperComponent, {
    BasicTabsComponent,
    TabComponent,
    TabContentComponent
} from "../../../shared/components/tabs/TabsComponent";
import MedicalInterventionListComponent
    from "../../chart-notes/medical-intervention-list/MedicalInterventionListComponent";
import MedicalRecordAttachmentListComponent
    from "../../chart-notes/medical-record-attachment-list/MedicalRecordAttachmentListComponent";
import {useSearchParams} from "react-router-dom";
import {IClientDetailsSteps} from "../../../shared/models/client.model";

interface DashboardScreenProps {

}
const DashboardSteps: any[] = ["home"];

const DashboardScreen = (props: DashboardScreenProps) => {

    const dispatch = useDispatch();
    const {currentUser} = useSelector((state: IRootReducerState) => state.account);
    const [currentTab, setCurrentTab] = useState<any>("Home");
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        dispatch(setCurrentNavParams("Dashboard"));
    }, [dispatch]);

    const handleTabChange = useCallback((e: any, value: any) => {
        searchParams.set("activeTab", value);
        setSearchParams(searchParams);
        setCurrentTab(value);
    }, [searchParams, setSearchParams]);

    useEffect(() => {
        let currentTab: any = searchParams.get("currentStep");
        if (currentTab) {
            if (!DashboardSteps.includes(currentTab)) {
                currentTab = "home";
            }
        } else {
            currentTab = "home";
        }
        setCurrentTab(currentTab);
    }, [searchParams]);

    return (
        <div className={'DashboardScreen'}>
            <div className={'current-user-name'}>
                Welcome {currentUser?.first_name} {currentUser?.last_name}!
            </div>
            <TabsWrapperComponent className={'basic-tabs-wrapper'}>
                <BasicTabsComponent value={currentTab} onUpdate={handleTabChange} variant={"fullWidth"}
                                    allowScrollButtonsMobile={false}>
                    <TabComponent label={'Home'} value={"home"}/>
                </BasicTabsComponent>
                <TabContentComponent value={"home"} selectedTab={currentTab}>

                </TabContentComponent>
            </TabsWrapperComponent>

        </div>
    );

};

export default DashboardScreen;