import "./ClientBasicDetailsComponent.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import moment from "moment";
import HorizontalLineComponent
    from "../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import React from "react";
import MaskTextComponent from "../../../shared/components/mask-text/MaskTextComponent";

interface ClientBasicDetailsComponentProps {
    clientId: string;
}

const ClientBasicDetailsComponent = (props: ClientBasicDetailsComponentProps) => {

    const {
        clientBasicDetails,
        isClientBasicDetailsLoading,
        isClientBasicDetailsLoaded,
        isClientBasicDetailsLoadingFailed
    } = useSelector((state: IRootReducerState) => state.client);

    return (
        <div className={'client-basic-details-component'}>
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
                    <CardComponent title={'Personal Details'}>
                        <div className="ts-row">
                            <div className="ts-col-md-6 ts-col-lg-3">
                                <DataLabelValueComponent label={'Last Name'}>
                                    {clientBasicDetails?.last_name}
                                </DataLabelValueComponent>
                            </div>
                            <div className="ts-col-md-6 ts-col-lg-3">
                                <DataLabelValueComponent label={'First Name'}>
                                    {clientBasicDetails?.first_name}
                                </DataLabelValueComponent>
                            </div>
                            <div className="ts-col-md-6 ts-col-lg-3">
                                <DataLabelValueComponent label={'Date of Birth'}>
                                    {moment(clientBasicDetails?.dob).format('DD-MMM-YYYY') || "-"}
                                </DataLabelValueComponent>
                            </div>
                            <div className="ts-col-md-6 ts-col-lg-3">
                                <DataLabelValueComponent label={'Gender'}>
                                    {clientBasicDetails?.gender_details?.title}
                                </DataLabelValueComponent>
                            </div>
                            <div className="ts-col-md-6 ts-col-lg-3">
                                <DataLabelValueComponent label={'Nickname/Preferred Name'}>
                                    {clientBasicDetails?.nick_name || "NA"}
                                </DataLabelValueComponent>
                            </div>
                            <div className="ts-col-md-6 ts-col-lg-3">
                                <DataLabelValueComponent label={'SSN'}>
                                    <MaskTextComponent value={clientBasicDetails?.ssn}/>
                                </DataLabelValueComponent>
                            </div>
                        </div>
                    </CardComponent>
                    <CardComponent title={'Contact Information'}>
                        <FormControlLabelComponent label={'Phone 1:'}/>
                        <div className={'ts-row'}>
                            <div className={'ts-col-lg-3'}>
                                <DataLabelValueComponent label={'Phone Type (Primary)'}>
                                    {clientBasicDetails?.primary_contact_info?.phone_type_details?.title || "-"}
                                </DataLabelValueComponent>
                            </div>
                            <div className={'ts-col-lg-3'}>
                                <DataLabelValueComponent label={'Phone Number (Primary)'}>
                                    {clientBasicDetails?.primary_contact_info?.phone || "-"}
                                </DataLabelValueComponent>
                            </div>
                        </div>
                        {
                            clientBasicDetails?.secondary_contact_info?.map((phone_number, index: number) => {
                                return <>
                                    {
                                        phone_number?.phone_type_details?.title && phone_number?.phone && <>
                                            <FormControlLabelComponent label={'Phone ' + (index + 2) + ":"}/>
                                            <div className={'ts-row'}>
                                                <div className={'ts-col-lg-3'}>
                                                    <DataLabelValueComponent label={'Phone Type (Secondary)'}>
                                                        {phone_number?.phone_type_details?.title || "-"}
                                                    </DataLabelValueComponent>
                                                </div>
                                                <div className={'ts-col-lg-3'}>
                                                    <DataLabelValueComponent label={'Phone Type (Secondary)'}>
                                                        {phone_number?.phone || "-"}
                                                    </DataLabelValueComponent>
                                                </div>
                                            </div>
                                        </>
                                    }
                                </>
                            })

                        }
                        <div className={'ts-row'}>
                            <div className={'ts-col-lg-3'}>
                                <DataLabelValueComponent label={'Email (Primary)'}>
                                    {clientBasicDetails?.primary_email}
                                </DataLabelValueComponent>
                            </div>
                            {
                                clientBasicDetails?.secondary_emails?.map((email, index: number) => {
                                    return <>
                                        {
                                            email?.email && <div className={'ts-col-lg-3'}>
                                                <DataLabelValueComponent label={'Email (Secondary) ' + (index + 2)}>
                                                    {email?.email}
                                                </DataLabelValueComponent>
                                            </div>
                                        }
                                    </>
                                })
                            }
                        </div>

                    </CardComponent>
                    <CardComponent title={'Address Information'}>
                        <DataLabelValueComponent label={'Address'}>
                            {clientBasicDetails?.address?.address_line}, {clientBasicDetails?.address?.city},{clientBasicDetails?.address?.zip_code}, <br/>
                            {clientBasicDetails?.address?.state},{clientBasicDetails?.address?.country}
                        </DataLabelValueComponent>
                    </CardComponent>
                    <CardComponent title={'Emergency Contact Information'}>
                        <FormControlLabelComponent label={'Primary Emergency Contact'}/>
                        <div className={'ts-row'}>
                            <div className={'ts-col-lg-3'}>
                                <DataLabelValueComponent label={'Full Name'}>
                                    {clientBasicDetails?.emergency_contact_info?.primary_emergency?.name}

                                </DataLabelValueComponent>
                            </div>
                            <div className={'ts-col-lg-3'}>
                                <DataLabelValueComponent label={'Relationship'}>
                                    {clientBasicDetails?.emergency_contact_info?.primary_emergency?.relationship_details?.title}
                                </DataLabelValueComponent>
                            </div>
                            <div className={'ts-col-lg-3'}>
                                <DataLabelValueComponent label={'Language'}>
                                    {clientBasicDetails?.emergency_contact_info?.primary_emergency?.language_details?.title}
                                </DataLabelValueComponent>
                            </div>
                        </div>
                        <div>
                            <FormControlLabelComponent label={'Phone 1:'}/>
                            <div className={'ts-row'}>
                                <div className={'ts-col-lg-3'}>
                                    <DataLabelValueComponent label={'Phone Type (Primary)'}>
                                        {clientBasicDetails?.emergency_contact_info?.primary_emergency?.primary_contact_info?.phone_type_details?.title}
                                    </DataLabelValueComponent>
                                </div>
                                <div className={'ts-col-lg-3'}>
                                    <DataLabelValueComponent label={'Phone Number (Primary)'}>
                                        {clientBasicDetails?.emergency_contact_info?.primary_emergency?.primary_contact_info?.phone}
                                    </DataLabelValueComponent>
                                </div>
                            </div>
                        </div>
                        {
                            clientBasicDetails?.emergency_contact_info?.primary_emergency?.secondary_contact_info?.map((phone_number: any, index: number) => {
                                return <>
                                    {
                                        phone_number?.phone_type_details?.title && phone_number?.phone && <>
                                            <FormControlLabelComponent label={'Phone ' + (index + 2) + ":"}/>
                                            <div className={'ts-row'}>
                                                <div className={'ts-col-lg-3'}>
                                                    <DataLabelValueComponent label={'Phone Type (Secondary)'}>
                                                        {phone_number?.phone_type.title || "-"}
                                                    </DataLabelValueComponent>
                                                </div>
                                                <div className={'ts-col-lg-3'}>
                                                    <DataLabelValueComponent label={'Phone Type (Secondary)'}>
                                                        {phone_number?.phone || "-"}
                                                    </DataLabelValueComponent>
                                                </div>
                                            </div>
                                        </>
                                    }
                                </>
                            })
                        }
                        <HorizontalLineComponent/>
                        <div>
                            <FormControlLabelComponent label={'Secondary Emergency Contact'}/>
                            <div className={'ts-row'}>
                                <div className={'ts-col-lg-3'}>
                                    <DataLabelValueComponent label={'Full Name'}>
                                        {clientBasicDetails?.emergency_contact_info?.secondary_emergency?.name || "-"}
                                    </DataLabelValueComponent>
                                </div>
                                <div className={'ts-col-lg-3'}>
                                    <DataLabelValueComponent label={'Relationship'}>
                                        {clientBasicDetails?.emergency_contact_info?.secondary_emergency?.relationship_details?.title || "-"}
                                    </DataLabelValueComponent>
                                </div>
                                <div className={'ts-col-lg-3'}>
                                    <DataLabelValueComponent label={'Language'}>
                                        {clientBasicDetails?.emergency_contact_info?.secondary_emergency?.language_details?.title || "-"}
                                    </DataLabelValueComponent>
                                </div>
                            </div>
                            {
                                clientBasicDetails?.emergency_contact_info?.secondary_emergency?.primary_contact_info?.phone_type_details?.title && clientBasicDetails?.emergency_contact_info?.secondary_emergency?.primary_contact_info?.phone &&
                            <div>
                                <FormControlLabelComponent label={'Phone 1:'}/>
                                <div className={'ts-row'}>
                                    <div className={'ts-col-lg-3'}>
                                        <DataLabelValueComponent label={'Phone Type (Primary)'}>
                                            {clientBasicDetails?.emergency_contact_info?.secondary_emergency?.primary_contact_info?.phone_type_details?.title || "-"}
                                        </DataLabelValueComponent>
                                    </div>
                                    <div className={'ts-col-lg-3'}>
                                        <DataLabelValueComponent label={'Phone Number (Primary)'}>
                                            {clientBasicDetails?.emergency_contact_info?.secondary_emergency?.primary_contact_info?.phone || "-"}
                                        </DataLabelValueComponent>
                                    </div>
                                </div>
                            </div>
                            }
                            {
                                clientBasicDetails?.emergency_contact_info?.secondary_emergency?.secondary_contact_info?.map((phone_number, index: number) => {
                                    return <>
                                        {
                                            phone_number?.phone_type_details?.title && phone_number?.phone && <>
                                                <FormControlLabelComponent label={'Phone ' + (index + 2) + ":"}/>
                                                <div className={'ts-row'}>
                                                    <div className={'ts-col-lg-3'}>
                                                        <DataLabelValueComponent label={'Phone Type (Secondary)'}>
                                                            {phone_number?.phone_type_details?.title || "-"}
                                                        </DataLabelValueComponent>
                                                    </div>
                                                    <div className={'ts-col-lg-3'}>
                                                        <DataLabelValueComponent label={'Phone Number (Secondary)'}>
                                                            {phone_number?.phone || "-"}
                                                        </DataLabelValueComponent>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    </>
                                })
                            }
                        </div>
                    </CardComponent>
                    <CardComponent title={'Work Information'}>
                        <div className={'ts-row'}>
                            <div className={'ts-col-lg-3'}>
                                <DataLabelValueComponent label={'Occupation'}>
                                    {clientBasicDetails?.work_info?.occupation}
                                </DataLabelValueComponent>
                            </div>
                            <div className={'ts-col-lg-3'}>
                                <DataLabelValueComponent label={'Employment Status'}>
                                    {clientBasicDetails?.work_info?.employment_status_details?.title}<br/>
                                </DataLabelValueComponent>
                            </div>
                        </div>
                    </CardComponent>
                </>
            }
        </div>
    );

};

export default ClientBasicDetailsComponent;