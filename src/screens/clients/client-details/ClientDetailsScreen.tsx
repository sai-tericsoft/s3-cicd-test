import "./ClientDetailsScreen.scss";
import {useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import React, {useCallback, useEffect, useState} from "react";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {IClientAccountDetails, IClientBasicDetails, IClientMedicalDetails} from "../../../shared/models/client.model";
import ClientMedicalDetailsComponent from "../client-medical-details/ClientMedicalDetailsComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../constants";
import ClientBasicDetailsCardComponent from "../client-basic-details-card/ClientBasicDetailsCardComponent";
import SubMenuListComponent from "../../../shared/components/sub-menu-list/SubMenuListComponent";
import TabsWrapperComponent, {
    TabComponent,
    TabContentComponent,
    TabsComponent
} from "../../../shared/components/tabs/TabsComponent";
import ClientBasicDetailsComponent from "../client-basic-details/ClientBasicDetailsComponent";
import ClientActivityLogComponent from "../client-activity-log/ClientActivityLogComponent";
import ClientAccountDetailsComponent from "../client-account-details/ClientAccountDetailsComponent";
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
]

const ClientDetailsScreen = (props: ClientDetailsScreenProps) => {

    const {clientId} = useParams();
    const dispatch = useDispatch();
    const [clientBasicDetails, setClientBasicDetails] = useState<IClientBasicDetails | undefined | any>(undefined);
    const [isClientBasicDetailsLoading, setIsClientBasicDetailsLoading] = useState<boolean>(false);
    const [isClientBasicDetailsLoaded, setIsClientBasicDetailsLoaded] = useState<boolean>(false);
    const [isClientBasicDetailsLoadingFailed, setIsClientBasicDetailsLoadingFailed] = useState<boolean>(false);
    const [currentTab, setCurrentTab] = useState<"basicDetails" | "medicalHistoryQuestionnaire" | "accountDetails" | "activityLog">("basicDetails");

    const [clientMedicalDetails, setClientMedicalDetails] = useState<IClientMedicalDetails | undefined | any>(undefined);
    const [isClientMedicalDetailsLoading, setIsClientMedicalDetailsLoading] = useState<boolean>(false);
    const [isClientMedicalDetailsLoaded, setIsClientMedicalDetailsLoaded] = useState<boolean>(false);
    const [isClientMedicalDetailsLoadingFailed, setIsClientMedicalDetailsLoadingFailed] = useState<boolean>(false);

    const [clientAccountDetails, setClientAccountDetails] = useState<IClientAccountDetails | undefined | any>(undefined);
    const [isClientAccountDetailsLoading, setIsClientAccountDetailsLoading] = useState<boolean>(false);
    const [isClientAccountDetailsLoaded, setIsClientAccountDetailsLoaded] = useState<boolean>(false);
    const [isClientAccountDetailsLoadingFailed, setIsClientAccountDetailsLoadingFailed] = useState<boolean>(false);

    const fetchClientBasicDetails = useCallback((clientId: string) => {
        setIsClientBasicDetailsLoading(true);
        CommonService._client.ClientBasicDetailsAPICall(clientId, {})
            .then((response: IAPIResponseType<IClientBasicDetails>) => {
                setClientBasicDetails(response.data);
                setIsClientBasicDetailsLoading(false);
                setIsClientBasicDetailsLoaded(true);
                setIsClientBasicDetailsLoadingFailed(false);
            })
            .catch((error: any) => {
                setIsClientBasicDetailsLoading(false);
                setIsClientBasicDetailsLoaded(false);
                setIsClientBasicDetailsLoadingFailed(true);
            })
    }, []);

    const fetchClientMedicalDetails = useCallback((clientId: string) => {
        setIsClientMedicalDetailsLoading(true);
        CommonService._client.ClientMedicalDetailsApiCall(clientId, {})
            .then((response: IAPIResponseType<IClientMedicalDetails>) => {
                setClientMedicalDetails(response.data);
                setIsClientMedicalDetailsLoading(false);
                setIsClientMedicalDetailsLoaded(true);
                setIsClientMedicalDetailsLoadingFailed(false);
            })
            .catch((error: any) => {
                setIsClientMedicalDetailsLoading(false);
                setIsClientMedicalDetailsLoaded(false);
                setIsClientMedicalDetailsLoadingFailed(true);
            })
    }, []);

    const fetchClientAccountDetails = useCallback((clientId: string) => {
        setIsClientAccountDetailsLoading(true);
        CommonService._client.ClientAccountDetailsApiCall(clientId, {})
            .then((response: IAPIResponseType<IClientAccountDetails>) => {
                setClientAccountDetails(response.data);
                setIsClientAccountDetailsLoading(false);
                setIsClientAccountDetailsLoaded(true);
                setIsClientAccountDetailsLoadingFailed(false);
            })
            .catch((error: any) => {
                setIsClientAccountDetailsLoading(false);
                setIsClientAccountDetailsLoaded(false);
                setIsClientAccountDetailsLoadingFailed(true);
            })
    }, []);

    useEffect(() => {
        if (clientId) {
            fetchClientBasicDetails(clientId);
            fetchClientMedicalDetails(clientId);
            fetchClientAccountDetails(clientId);
        }
    }, [clientId, fetchClientBasicDetails, fetchClientMedicalDetails, fetchClientAccountDetails]);

    useEffect(() => {
        dispatch(setCurrentNavParams(clientBasicDetails?.name || "Client Details", null, true));
    }, [clientBasicDetails, dispatch]);

    useEffect(() => {
        console.log(isClientAccountDetailsLoaded, isClientAccountDetailsLoading, isClientAccountDetailsLoadingFailed, isClientMedicalDetailsLoaded, isClientMedicalDetailsLoading, isClientMedicalDetailsLoadingFailed);
    }, [isClientAccountDetailsLoaded, isClientAccountDetailsLoading, isClientAccountDetailsLoadingFailed, isClientMedicalDetailsLoaded, isClientMedicalDetailsLoading, isClientMedicalDetailsLoadingFailed])

    return (
        <>
            <div className={'client-details-screen'}>
                {
                    isClientBasicDetailsLoading && <div>Loading</div>
                }
                {
                    isClientBasicDetailsLoadingFailed && <div>Loading Failed</div>
                }
                {

                    (isClientBasicDetailsLoaded && clientId) && <>
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
                                    <ClientBasicDetailsCardComponent clientBasicDetails={clientBasicDetails}/>
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
                                        onUpdate={(e,value: any) => {
                                            setCurrentTab(value);
                                        }}
                                    >
                                        <TabComponent label="Client Details" value={"basicDetails"}/>
                                        <TabComponent label="Medical History Questionnaire"
                                                      value={"medicalHistoryQuestionnaire"}/>
                                        <TabComponent label="Account Details" value={"accountDetails"}/>
                                        <TabComponent label="Activity Log" value={"activityLog"}/>
                                    </TabsComponent>
                                    <TabContentComponent selectedTab={currentTab} value={"basicDetails"}>
                                        <ClientBasicDetailsComponent clientBasicDetails={clientBasicDetails}/>
                                    </TabContentComponent>
                                    <TabContentComponent selectedTab={currentTab} value={"medicalHistoryQuestionnaire"}>
                                        <ClientMedicalDetailsComponent clientMedicalDetails={clientMedicalDetails}/>
                                    </TabContentComponent>
                                    <TabContentComponent selectedTab={currentTab} value={"accountDetails"}>
                                        <ClientAccountDetailsComponent clientAccountDetails={clientAccountDetails}/>
                                    </TabContentComponent>
                                    <TabContentComponent selectedTab={currentTab} value={"activityLog"}>
                                        <ClientActivityLogComponent clientId={clientId}/>
                                    </TabContentComponent>
                                </TabsWrapperComponent>
                            </div>
                        </div>
                    </>
                }
            </div>
        </>
    );

};

export default ClientDetailsScreen;