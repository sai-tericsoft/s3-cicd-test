import "./ClientDetailsScreen.scss";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {CommonService} from "../../../shared/services";
import {IRootReducerState} from "../../../store/reducers";
import {
    getClientAccountDetails,
    getClientBasicDetails,
    getClientMedicalDetails
} from "../../../store/actions/client.action";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../constants";
import SubMenuListComponent from "../../../shared/components/sub-menu-list/SubMenuListComponent";
import ClientAccountDetailsComponent from "../client-account-details/ClientAccountDetailsComponent";
import ClientBasicDetailsCardComponent from "../client-basic-details-card/ClientBasicDetailsCardComponent";
import TabsWrapperComponent, {
    TabComponent,
    TabContentComponent,
    TabsComponent
} from "../../../shared/components/tabs/TabsComponent";
import ClientBasicDetailsComponent from "../client-basic-details/ClientBasicDetailsComponent";
import ClientActivityLogComponent from "../client-activity-log/ClientActivityLogComponent";
import ClientMedicalDetailsComponent from "../client-medical-details/ClientMedicalDetailsComponent";
import StatusComponentComponent from "../../../shared/components/status-component/StatusComponentComponent";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";

// import LinkComponent from "../../../shared/components/link/LinkComponent";

interface ClientDetailsScreenProps {

}

const CLIENT_MENU_ITEMS = [
    {
        title: "Client Profile",
        path: ""
    },
    {
        title: "Chart Notes",
        path: CommonService._routeConfig.ComingSoonRoute()
    },
    {
        title: "Documents",
        path: CommonService._routeConfig.ComingSoonRoute()
    },
    {
        title: "Insurance",
        path: CommonService._routeConfig.ComingSoonRoute()
    },
    {
        title: "Appointments",
        path: CommonService._routeConfig.ComingSoonRoute()
    },
    {
        title: "Billing",
        path: CommonService._routeConfig.ComingSoonRoute()
    }
];

const ClientDetailsScreen = (props: ClientDetailsScreenProps) => {

    const {clientId} = useParams();
    const dispatch = useDispatch();
    const [currentTab, setCurrentTab] = useState<"basicDetails" | "medicalHistoryQuestionnaire" | "accountDetails" | "activityLog">("basicDetails");
    const {
        isClientBasicDetailsLoaded,
        isClientBasicDetailsLoading,
        isClientBasicDetailsLoadingFailed,
        clientBasicDetails,
    } = useSelector((state: IRootReducerState) => state.client);

    useEffect(() => {
        if (clientId) {
            dispatch(getClientBasicDetails(clientId));
            dispatch(getClientMedicalDetails(clientId));
            dispatch(getClientAccountDetails(clientId));
        }
    }, [clientId, dispatch]);

    useEffect(() => {
        dispatch(setCurrentNavParams("Client Details", null, true));
    }, [dispatch]);

    return (
        <>
            <div className={'client-details-screen'}>
                <>
                    {
                        !clientId && <StatusComponentComponent title={"Client ID missing. cannot fetch details"}/>
                    }
                </>

                <>
                    {
                        clientId && <>
                            {
                                isClientBasicDetailsLoading && <div>
                                    <LoaderComponent/>
                                </div>
                            }
                            {
                                isClientBasicDetailsLoadingFailed &&
                                <StatusComponentComponent title={"Failed to fetch client Details"}/>
                            }
                            {
                                (isClientBasicDetailsLoaded && clientBasicDetails) && <>
                                    <div className="client-details-header">
                                        <div className={"client-details-title"}>
                                            Client Profile
                                        </div>
                                        <div className={"client-details-actions"}>
                                            {
                                                currentTab === "basicDetails" &&
                                                // <LinkComponent route={CommonService._routeConfig.ClientEdit(clientId) + "?currentTab=basicDetails"}>
                                                <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>}>
                                                    Edit Profile
                                                </ButtonComponent>
                                                // </LinkComponent>
                                            }
                                        </div>
                                    </div>
                                    <div className={"client-details-layout"}>
                                        <div className={"client-details-basic-card-sub-menu-wrapper"}>
                                            <div className={"client-details-basic-card-holder"}>
                                                <ClientBasicDetailsCardComponent
                                                    clientBasicDetails={clientBasicDetails}/>
                                            </div>
                                            <div className={"client-details-sub-menu-holder"}>
                                                <SubMenuListComponent menuItems={CLIENT_MENU_ITEMS}/>
                                            </div>
                                        </div>
                                        <div className="client-details-tab-wrapper">
                                            <TabsWrapperComponent>
                                                <TabsComponent
                                                    value={currentTab}
                                                    allowScrollButtonsMobile={false}
                                                    variant={"fullWidth"}
                                                    onUpdate={(e, value: any) => {
                                                        setCurrentTab(value);
                                                    }}
                                                >
                                                    <TabComponent label="Client Details" value={"basicDetails"}/>
                                                    <TabComponent label="Medical History Questionnaire"
                                                                  value={"medicalHistoryQuestionnaire"}/>
                                                    <TabComponent label="Account Details" value={"accountDetails"}/>
                                                    <TabComponent label="Activity Log" value={"activityLog"}/>
                                                </TabsComponent>
                                                <TabContentComponent value={"basicDetails"} selectedTab={currentTab}>
                                                    <ClientBasicDetailsComponent/>
                                                </TabContentComponent>
                                                <TabContentComponent value={"medicalHistoryQuestionnaire"} selectedTab={currentTab}>
                                                    <ClientMedicalDetailsComponent/>
                                                </TabContentComponent>
                                                <TabContentComponent value={"accountDetails"} selectedTab={currentTab}>
                                                    <ClientAccountDetailsComponent/>
                                                </TabContentComponent>
                                                <TabContentComponent value={"activityLog"} selectedTab={currentTab}>
                                                    <ClientActivityLogComponent clientId={clientId}/>
                                                </TabContentComponent>
                                            </TabsWrapperComponent>
                                        </div>
                                    </div>
                                </>
                            }
                        </>
                    }
                </>
            </div>
        </>
    );

};

export default ClientDetailsScreen;