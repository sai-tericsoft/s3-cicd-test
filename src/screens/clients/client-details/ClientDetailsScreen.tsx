import "./ClientDetailsScreen.scss";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import React, {useCallback, useEffect, useState} from "react";
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
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import {IClientDetailsSteps} from "../../../shared/models/client.model";

// import LinkComponent from "../../../shared/components/link/LinkComponent";

interface ClientDetailsScreenProps {

}

const ClientDetailsSteps: IClientDetailsSteps[] = ["basicDetails", "medicalHistoryQuestionnaire", "accountDetails", "activityLog"];

const ClientDetailsScreen = (props: ClientDetailsScreenProps) => {

    const {clientId} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentTab, setCurrentTab] = useState<IClientDetailsSteps>("basicDetails");
    const {
        isClientBasicDetailsLoaded,
        isClientBasicDetailsLoading,
        isClientBasicDetailsLoadingFailed,
        clientBasicDetails,
    } = useSelector((state: IRootReducerState) => state.client);

    useEffect(() => {
        let currentTab: any = searchParams.get("currentStep");
        if (currentTab) {
            if (!ClientDetailsSteps.includes(currentTab)) {
                currentTab = "basicDetails";
            }
        } else {
            currentTab = "basicDetails";
        }
        setCurrentTab(currentTab);
    }, [searchParams]);

    useEffect(() => {
        if (clientId) {
            dispatch(getClientBasicDetails(clientId));
            dispatch(getClientMedicalDetails(clientId));
            dispatch(getClientAccountDetails(clientId));
        }
    }, [clientId, dispatch]);

    useEffect(() => {
        dispatch(setCurrentNavParams("Client Details", null, () => {
            navigate(CommonService._routeConfig.ClientList());
        }));
    }, [navigate, dispatch]);

    const handleTabChange = useCallback((e: any, value: any) => {
        searchParams.set("currentStep", value);
        setSearchParams(searchParams);
        setCurrentTab(value);
    }, [searchParams, setSearchParams]);

    const CLIENT_MENU_ITEMS = [
        {
            title: "Client Profile",
            path: clientId ? CommonService._routeConfig.ClientDetails(clientId) : ""
        },
        {
            title: "Chart Notes",
            path: ""
        },
        {
            title: "Documents",
            path: ""
        },
        {
            title: "Insurance",
            path: ""
        },
        {
            title: "Appointments",
            path: ""
        },
        {
            title: "Billing",
            path: ""
        }
    ];

    return (
        <>
            <div className={'client-details-screen'}>
                <>
                    {
                        !clientId && <StatusCardComponent title={"Client ID missing. cannot fetch details"}/>
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
                                <StatusCardComponent title={"Failed to fetch client Details"}/>
                            }
                            {
                                (isClientBasicDetailsLoaded && clientBasicDetails) && <>
                                    <div className={"client-details-layout"}>
                                        <div className={"client-details-left-bar"}>
                                            <div className={"client-details-title"}>
                                                Client Profile
                                            </div>
                                            <div className={"client-details-basic-card-holder"}>
                                                <ClientBasicDetailsCardComponent
                                                    clientBasicDetails={clientBasicDetails}/>
                                            </div>
                                            <div className={"client-details-sub-menu-holder"}>
                                                <SubMenuListComponent menuItems={CLIENT_MENU_ITEMS}/>
                                            </div>
                                        </div>
                                        <div className="client-details-content-wrapper">
                                            <div
                                                className={`client-details-actions ${currentTab === "basicDetails" ? "visibility-visible" : "visibility-hidden"}`}>
                                                <LinkComponent
                                                    route={CommonService._client.NavigateToClientEdit(clientId, "basicDetails")}>
                                                    <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>}>
                                                        Edit Profile
                                                    </ButtonComponent>
                                                </LinkComponent>
                                            </div>
                                            <TabsWrapperComponent>
                                                <TabsComponent
                                                    value={currentTab}
                                                    allowScrollButtonsMobile={false}
                                                    variant={"fullWidth"}
                                                    onUpdate={handleTabChange}
                                                >
                                                    <TabComponent label="Client Details" value={"basicDetails"}/>
                                                    <TabComponent label="Medical History Questionnaire"
                                                                  value={"medicalHistoryQuestionnaire"}/>
                                                    <TabComponent label="Account Details" value={"accountDetails"}/>
                                                    <TabComponent label="Activity Log" value={"activityLog"}/>
                                                </TabsComponent>
                                                <TabContentComponent value={"basicDetails"} selectedTab={currentTab}>
                                                    <ClientBasicDetailsComponent clientId={clientId}/>
                                                </TabContentComponent>
                                                <TabContentComponent value={"medicalHistoryQuestionnaire"}
                                                                     selectedTab={currentTab}>
                                                    <ClientMedicalDetailsComponent clientId={clientId}/>
                                                </TabContentComponent>
                                                <TabContentComponent value={"accountDetails"} selectedTab={currentTab}>
                                                    <ClientAccountDetailsComponent clientId={clientId}/>
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