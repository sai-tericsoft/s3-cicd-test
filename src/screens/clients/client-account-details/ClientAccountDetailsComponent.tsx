import "./ClientAccountDetailsComponent.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
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
                        <DataLabelValueComponent label={"Appointment Reminders"}>
                            {clientAccountDetails?.communication_preferences?.appointment_reminders_details?.title || "N/A"}
                        </DataLabelValueComponent>

                        <DataLabelValueComponent label={"Appointment Confirmations"}>
                            {clientAccountDetails?.communication_preferences?.appointment_confirmations_details?.title || "N/A"}
                        </DataLabelValueComponent>

                        <HorizontalLineComponent/>
                        <FormControlLabelComponent label={"Referral Details"}/>
                        <DataLabelValueComponent
                            label={"How did you find us?"}>{clientAccountDetails?.referral_details.source_details?.title || "N/A"}
                        </DataLabelValueComponent>
                            {
                                clientAccountDetails?.referral_details.source_details?.code === "friends_family_colleague" && <>
                                    <div className="ts-row">
                                        <div className="ts-col-3">
                                            <DataLabelValueComponent
                                                label={"Name"}> {clientAccountDetails?.referral_details?.source_info_name || "N/A"} </DataLabelValueComponent>
                                        </div>
                                        <div className="ts-col-3">
                                            <DataLabelValueComponent
                                                label={"Phone Number"}> {clientAccountDetails?.referral_details?.source_info_phone || "N/A"} </DataLabelValueComponent>
                                        </div>
                                        <div className="ts-col-3">
                                            <DataLabelValueComponent
                                                label={"Email"}> {clientAccountDetails?.referral_details?.source_info_email || "N/A"} </DataLabelValueComponent>
                                        </div>
                                        <div className="ts-col-3">
                                            <DataLabelValueComponent
                                                label={"Relationship"}> {clientAccountDetails?.referral_details.source_info_relationship_details?.title || "N/A"} </DataLabelValueComponent>
                                        </div>
                                    </div>
                                </>
                            }
                            {
                                clientAccountDetails?.referral_details.source_details?.code === "social_media" && <>
                                    <DataLabelValueComponent
                                        label={"Platform"}> {clientAccountDetails?.referral_details.source_info_name_details?.title || "N/A"} </DataLabelValueComponent>
                                </>
                            }
                            {
                                clientAccountDetails?.referral_details.source_details?.code === "other" && <>
                                    <DataLabelValueComponent
                                        label={"Other"}> {clientAccountDetails?.referral_details?.source_info_name || "N/A"} </DataLabelValueComponent>
                                </>
                            }
                    </CardComponent>
                </>
            }
        </div>
    );

};

export default ClientAccountDetailsComponent;