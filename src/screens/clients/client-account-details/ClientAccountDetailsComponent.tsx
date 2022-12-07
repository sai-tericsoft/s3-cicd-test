import "./ClientAccountDetailsComponent.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import QuestionComponent from "../../../shared/components/question/QuestionComponent";
import HorizontalLineComponent
    from "../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import React from "react";
import {CommonService} from "../../../shared/services";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../constants";
import LinkComponent from "../../../shared/components/link/LinkComponent";

interface ClientAccountDetailsComponentProps {
    clientId: string;
}

const ClientAccountDetailsComponent = (props: ClientAccountDetailsComponentProps) => {

    const {clientId} = props;
    const {
        clientAccountDetails,
        isClientAccountDetailsLoaded,
        isClientAccountDetailsLoading,
        isClientAccountDetailsLoadingFailed
    } = useSelector((state: IRootReducerState) => state.client);

    return (
        <div className={'client-account-details-component'}>
            {
                isClientAccountDetailsLoading && <div>
                    <LoaderComponent/>
                </div>
            }
            {
                isClientAccountDetailsLoadingFailed &&
                <StatusCardComponent title={"Failed to fetch client Details"}/>
            }
            {
                (isClientAccountDetailsLoaded && clientAccountDetails) && <>
                    <CardComponent title={"Communication and Referral Details"}
                                   actions={<>
                                       <LinkComponent
                                           route={CommonService._routeConfig.ClientEdit(clientId) + "?currentStep=accountDetails"}>
                                           <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>} size={"small"}>
                                               Edit
                                           </ButtonComponent>
                                       </LinkComponent>
                                   </>
                                   }
                    >
                        <FormControlLabelComponent label={"Communication Preferences"}/>
                        <QuestionComponent title={"Appointment Reminders"}
                                           description={clientAccountDetails?.communication_preferences?.appointment_reminders_details?.title || "NA"}/>
                        <QuestionComponent title={"Appointment Confirmations"}
                                           description={clientAccountDetails?.communication_preferences?.appointment_confirmations_details?.title || "NA"}/>
                        <HorizontalLineComponent/>
                        <FormControlLabelComponent label={"Referral Details"}/>
                        <QuestionComponent title={"How did you find us?"}
                                           description={clientAccountDetails?.referral_details.source_details?.title || "NA"}/>
                        {
                            clientAccountDetails?.referral_details.source_details?.code === "friends_family_colleague" && <>
                                <div className="ts-row">
                                    <div className="ts-col-3">
                                        <DataLabelValueComponent
                                            label={"Name"}> {clientAccountDetails?.referral_details?.source_info_name || "NA"} </DataLabelValueComponent>
                                    </div>
                                    <div className="ts-col-3">
                                        <DataLabelValueComponent
                                            label={"Phone Number"}> {clientAccountDetails?.referral_details?.source_info_phone || "NA"} </DataLabelValueComponent>
                                    </div>
                                    <div className="ts-col-3">
                                        <DataLabelValueComponent
                                            label={"Email"}> {clientAccountDetails?.referral_details?.source_info_email || "NA"} </DataLabelValueComponent>
                                    </div>
                                    <div className="ts-col-3">
                                        <DataLabelValueComponent
                                            label={"Relationship"}> {clientAccountDetails?.referral_details.source_info_relationship_details?.title || "NA"} </DataLabelValueComponent>
                                    </div>
                                </div>
                            </>
                        }
                        {
                            clientAccountDetails?.referral_details.source_details?.code === "social_media" && <>
                                <DataLabelValueComponent
                                    label={"Social Media"}> {clientAccountDetails?.referral_details.source_info_name_details?.title || "NA"} </DataLabelValueComponent>
                            </>
                        }
                        {
                            clientAccountDetails?.referral_details.source_details?.code === "other" && <>
                                <DataLabelValueComponent
                                    label={"Other"}> {clientAccountDetails?.referral_details?.source_info_name || "NA"} </DataLabelValueComponent>
                            </>
                        }
                    </CardComponent>
                </>
            }
        </div>
    );

};

export default ClientAccountDetailsComponent;