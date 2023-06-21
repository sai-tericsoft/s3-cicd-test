import "./ClientProfileLayoutComponent.scss";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import {CommonService} from "../../../shared/services";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import { ImageConfig, Misc} from "../../../constants";
import TabsWrapperComponent, {
    TabComponent,
    TabContentComponent,
    TabsComponent
} from "../../../shared/components/tabs/TabsComponent";
import ClientBasicDetailsComponent from "../client-basic-details/ClientBasicDetailsComponent";
import ClientMedicalDetailsComponent from "../client-medical-details/ClientMedicalDetailsComponent";
import ClientAccountDetailsComponent from "../client-account-details/ClientAccountDetailsComponent";
import ClientActivityLogComponent from "../client-activity-log/ClientActivityLogComponent";
import React, {useCallback, useEffect, useState} from "react";
import {IClientDetailsSteps} from "../../../shared/models/client.model";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {useDispatch, useSelector} from "react-redux";
import {
    getClientAccountDetails,
    getClientBasicDetails,
    getClientMedicalDetails
} from "../../../store/actions/client.action";
import {IRootReducerState} from "../../../store/reducers";

interface ClientProfileLayoutComponentProps {

}

const ClientDetailsSteps: IClientDetailsSteps[] = ["basicDetails", "medicalHistoryQuestionnaire", "accountDetails", "activityLog"];

const ClientProfileLayoutComponent = (props: ClientProfileLayoutComponentProps) => {
    const [currentTab, setCurrentTab] = useState<IClientDetailsSteps>("basicDetails");
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {clientId} = useParams();

    const {
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
            dispatch(getClientMedicalDetails(clientId));
            dispatch(getClientAccountDetails(clientId));
        }
    }, [clientId, dispatch])

    useEffect(() => {
        if (clientId && !clientBasicDetails) {
            dispatch(getClientBasicDetails(clientId));
        }
    }, [clientId, dispatch, clientBasicDetails]);

    useEffect(() => {
        const referrer: any = searchParams.get("referrer");
        dispatch(setCurrentNavParams("Client Details", null, () => {
            if (referrer) {
                navigate(referrer);
            } else {
                navigate(CommonService._routeConfig.ClientList());
            }
        }));
    }, [searchParams, navigate, dispatch]);

    const handleTabChange = useCallback((e: any, value: any) => {
        searchParams.set("currentStep", value);
        setSearchParams(searchParams);
        setCurrentTab(value);
    }, [searchParams, setSearchParams]);

    const handleResendLink = useCallback((clientBasicDetails: any) => {
        if (clientId) {
            CommonService.onConfirm({
                image: ImageConfig.DeleteAttachmentConfirmationIcon,
                confirmationTitle: 'RESEND INVITE LINK',
                confirmationSubTitle: `Are you sure you want to resend the invite link ${clientBasicDetails?.first_name} ${clientBasicDetails?.last_name} 
            having email ${clientBasicDetails.primary_email}?`,
            }).then(() => {
                CommonService._client.ResendInviteToClient(clientId, clientBasicDetails)
                    .then((response: any) => {
                        CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    }).catch((error: any) => {
                    CommonService._alert.showToast(error.error || "Error in sending link", "error");
                });
            })
        }
    }, [clientId]);

    return (
        <div className={'client-profile-layout-component'}>
            {clientId && <>
                <div className={`client-details-actions`}>

                    {
                        currentTab === "basicDetails" && <>
                            <LinkComponent
                                route={CommonService._client.NavigateToClientEdit(clientId, "basicDetails")}>
                                <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>}
                                                 className={`${currentTab === "basicDetails" ? "opacity-1" : "opacity-0"}`}
                                >
                                    Edit Profile
                                </ButtonComponent>
                            </LinkComponent>
                        </>
                    }

                            <ButtonComponent variant={'outlined'}
                                             className={`${currentTab === "basicDetails" && 'mrg-right-10'}`}
                                             prefixIcon={<ImageConfig.SendIcon/>}
                                             onClick={() => handleResendLink(clientBasicDetails)}
                            >
                                Resend Link
                            </ButtonComponent>
                </div>
                <TabsWrapperComponent>
                    <div className={'tabs-wrapper'}>
                    <TabsComponent
                        value={currentTab}
                        allowScrollButtonsMobile={false}
                        variant={"fullWidth"}
                        onUpdate={handleTabChange}
                    >
                        <TabComponent className={'client-details-tab'} label="Client Details"
                                      value={"basicDetails"}/>
                        <TabComponent className={'client-details-tab'}
                                      label="Medical History Questionnaire"
                                      value={"medicalHistoryQuestionnaire"}/>
                        <TabComponent className={'client-details-tab'} label="Account Details"
                                      value={"accountDetails"}/>
                        <TabComponent className={'client-details-tab'} label="Activity Log"
                                      value={"activityLog"}/>
                    </TabsComponent>
                    </div>
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
            </>}
        </div>
    );

};

export default ClientProfileLayoutComponent;