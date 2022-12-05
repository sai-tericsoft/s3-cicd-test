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
import StatusComponentComponent from "../../../shared/components/status-component/StatusComponentComponent";
import React from "react";

interface ClientAccountDetailsComponentProps {
}

const ClientAccountDetailsComponent = (props: ClientAccountDetailsComponentProps) => {

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
                <StatusComponentComponent title={"Failed to fetch client Details"}/>
            }
            {
                (isClientAccountDetailsLoaded && clientAccountDetails) && <>
                    <CardComponent title={"Communication and Referral Details"}>
                        <FormControlLabelComponent label={"Communication Preferences"}/>
                        <QuestionComponent title={"Appointment Reminders"}
                                           description={clientAccountDetails?.communication_preferences?.appointment_reminders?.title || "-"}/>
                        <QuestionComponent title={"Appointment Confirmations"}
                                           description={clientAccountDetails?.communication_preferences?.appointment_confirmations?.title || "-"}/>
                        <HorizontalLineComponent/>
                        <FormControlLabelComponent label={"Referral Details"}/>
                        <QuestionComponent title={"How did you find us?"}
                                           description={clientAccountDetails?.referral_details.source?.title || "-"}/>
                        {
                            clientAccountDetails?.referral_details.source?.code === "friends_family_colleague" && <>
                                <DataLabelValueComponent
                                    label={"Name"}> {clientAccountDetails?.referral_details?.source_info_name} </DataLabelValueComponent>
                                <DataLabelValueComponent
                                    label={"Phone Number"}> {clientAccountDetails?.referral_details?.source_info_phone} </DataLabelValueComponent>
                                <DataLabelValueComponent
                                    label={"Email"}> {clientAccountDetails?.referral_details?.source_info_email} </DataLabelValueComponent>
                                <DataLabelValueComponent
                                    label={"Relationship"}> {clientAccountDetails?.referral_details.source_info_relationship?.title} </DataLabelValueComponent>
                            </>
                        }
                        {
                            clientAccountDetails?.referral_details.source?.code === "social_media" && <>
                                <DataLabelValueComponent
                                    label={"Social Media"}> {clientAccountDetails?.referral_details?.source_info_name?.title} </DataLabelValueComponent>
                            </>
                        }
                        {
                            clientAccountDetails?.referral_details.source?.code === "other" && <>
                                <DataLabelValueComponent
                                    label={"Other"}> {clientAccountDetails?.referral_details?.source_info_name} </DataLabelValueComponent>
                            </>
                        }
                    </CardComponent>
                </>
            }
        </div>
    );

};

export default ClientAccountDetailsComponent;