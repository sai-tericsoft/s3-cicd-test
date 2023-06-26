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
import {useSearchParams} from "react-router-dom";
import MessageBoardComponent from "../message-board/MessageBoardComponent";
import DraftNoteListComponent from "../draft-note-list/DraftNoteListComponent";
import AppointmentListComponent from "../appointment-list/AppointmentListComponent";
import moment from "moment";

interface DashboardScreenProps {

}

const DashboardSteps: any[] = ["home", "draft"];

const DashboardScreen = (props: DashboardScreenProps) => {

    const dispatch = useDispatch();
    const {currentUser} = useSelector((state: IRootReducerState) => state.account);
    const [currentTab, setCurrentTab] = useState<any>("home");
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        dispatch(setCurrentNavParams("Dashboard"));
    }, [dispatch]);


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

    const handleTabChange = useCallback((e: any, value: any) => {
        searchParams.set("currentStep", value);
        setSearchParams(searchParams);
        setCurrentTab(value);
    }, [searchParams, setSearchParams]);

    return (
        <div className={'DashboardScreen'}>
            <div className={'name-date-wrapper'}>
            <div className={'current-user-name'}>
                Welcome {currentUser?.first_name} {currentUser?.last_name}!
            </div>
                <div className={'today-date'}>
                    Today's Date: {moment().format('DD-MM-YYYY')}
                </div>
            </div>
            <TabsWrapperComponent className={'basic-tabs-wrapper'}>
                <div>
                    <BasicTabsComponent value={currentTab} onUpdate={handleTabChange} variant={"fullWidth"}
                                        allowScrollButtonsMobile={false}>
                        <TabComponent label={'Home'} value={"home"}/>
                        <TabComponent label={'Draft Notes'} value={"draft"}/>
                    </BasicTabsComponent>
                </div>
                <TabContentComponent value={"home"} selectedTab={currentTab}>
                    <MessageBoardComponent/>
                    <AppointmentListComponent/>
                    {/*<DraftNoteListComponent/>*/}
                </TabContentComponent>
                <TabContentComponent value={"draft"} selectedTab={currentTab}>
                    <DraftNoteListComponent/>
                </TabContentComponent>
            </TabsWrapperComponent>

        </div>
    );

};

export default DashboardScreen;