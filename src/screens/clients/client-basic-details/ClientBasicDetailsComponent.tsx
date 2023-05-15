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
import {CommonService} from "../../../shared/services";

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

    const [isSSNMasked, setIsSSNMasked] = React.useState<boolean>(true);

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
                                <DataLabelValueComponent className={'patient-name'} label={'Last Name'}>
                                    {clientBasicDetails?.last_name}
                                </DataLabelValueComponent>
                            </div>
                            <div className="ts-col-md-6 ts-col-lg-3">
                                <DataLabelValueComponent className={'patient-name'} label={'First Name'}>
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
                                    {clientBasicDetails?.nick_name || "N/A"}
                                </DataLabelValueComponent>
                            </div>
                            <div className="ts-col-md-6 ts-col-lg-3">
                                <DataLabelValueComponent label={`SSN ${isSSNMasked ? '(Click to view)' : ''}`}>
                                    <MaskTextComponent value={clientBasicDetails?.ssn} onToggle={setIsSSNMasked}/>
                                </DataLabelValueComponent>
                            </div>
                        </div>
                    </CardComponent>
                    <CardComponent title={'Contact Information'} className={'contact-info-wrapper'}>
                        <div className="ts-row">
                            <div className="ts-col-8">
                                <FormControlLabelComponent label={'Primary Phone:'}/>
                                <div className={'ts-row'}>
                                    <div className={'ts-col-5'}>
                                        <DataLabelValueComponent label={'Phone Type'}>
                                            {clientBasicDetails?.primary_contact_info?.phone_type_details?.title || "-"}
                                        </DataLabelValueComponent>
                                    </div>
                                    <div className={'ts-col-7'}>
                                        <DataLabelValueComponent label={'Phone Number'}>
                                            {CommonService.formatPhoneNumber(clientBasicDetails?.primary_contact_info?.phone || '-')}
                                        </DataLabelValueComponent>
                                    </div>
                                </div>
                            </div>
                            <div className="ts-col-4">
                                <FormControlLabelComponent label={'Primary Email:'}/>
                                <div className={'ts-row'}>
                                    <div className={'ts-col-12'}>
                                        <DataLabelValueComponent label={'Email'}>
                                            {clientBasicDetails?.primary_email}
                                        </DataLabelValueComponent>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="ts-row">
                            {/*{clientBasicDetails?.secondary_contact_info?.length > 0 && (clientBasicDetails?.secondary_contact_info[0]?.phone !== "" || clientBasicDetails?.secondary_emails[0]?.email !== "")*/}
                            {/*    &&  <HorizontalLineComponent className={'alternate-heading-horizontal-line'}/>}*/}
                            <div className="ts-col-8">
                                {
                                    clientBasicDetails?.secondary_contact_info?.length > 0 &&
                                    clientBasicDetails?.secondary_contact_info[0]?.phone !== "" &&
                                    <>
                                        <FormControlLabelComponent label={'Alternate Phone:'}/>
                                    </>
                                }
                                {
                                    clientBasicDetails?.secondary_contact_info?.map((phone_number, index: number) => {
                                        return <>
                                            {
                                                phone_number?.phone_type_details?.title && phone_number?.phone && <>
                                                    <div className={'ts-row'}>
                                                        <div className={'ts-col-5'}>
                                                            <DataLabelValueComponent label={'Phone Type'}>
                                                                {phone_number?.phone_type_details?.title || "-"}
                                                            </DataLabelValueComponent>
                                                        </div>
                                                        <div className={'ts-col-7'}>
                                                            <DataLabelValueComponent label={'Phone Number'}>
                                                                {CommonService.formatPhoneNumber(phone_number?.phone || '-')}
                                                            </DataLabelValueComponent>
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                        </>
                                    })

                                }
                            </div>
                            <div className="ts-col-4">
                                {clientBasicDetails?.secondary_emails?.length > 0 &&
                                    clientBasicDetails?.secondary_emails[0]?.email !== "" &&
                                    <>
                                        <FormControlLabelComponent label={'Alternate Email:'}/>
                                    </>
                                }
                                <div className={'ts-row'}>
                                    {
                                        clientBasicDetails?.secondary_emails?.map((email, index: number) => {
                                            return <>
                                                {
                                                    email?.email && <div className={'ts-col-12'}>
                                                        <DataLabelValueComponent label={'Email'}>
                                                            {email?.email}
                                                        </DataLabelValueComponent>
                                                    </div>
                                                }
                                            </>
                                        })
                                    }
                                </div>
                            </div>
                        </div>

                    </CardComponent>
                    <CardComponent title={'Address Information'}>
                        <DataLabelValueComponent label={'Address'}>
                            {clientBasicDetails?.address?.address_line}, {clientBasicDetails?.address?.city}, {clientBasicDetails?.address?.zip_code}, <br/>
                            {clientBasicDetails?.address?.state}, {clientBasicDetails?.address?.country}
                        </DataLabelValueComponent>
                    </CardComponent>
                    <CardComponent title={'Emergency Contact Information'}>
                        <FormControlLabelComponent className={'primary-emergency-contact'}
                                                   label={'Primary Emergency Contact'}/>
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
                        <div className={'ts-row'}>
                            <div className="ts-col-6">
                                <FormControlLabelComponent label={'Primary:'}/>
                                <div className={'ts-row'}>
                                    <div className={'ts-col-6'}>
                                        <DataLabelValueComponent label={'Phone Type'}>
                                            {clientBasicDetails?.emergency_contact_info?.primary_emergency?.primary_contact_info?.phone_type_details?.title}
                                        </DataLabelValueComponent>
                                    </div>
                                    <div className={'ts-col-6'}>
                                        <DataLabelValueComponent label={'Phone Number'}>
                                            {CommonService.formatPhoneNumber(clientBasicDetails?.emergency_contact_info?.primary_emergency?.primary_contact_info?.phone || "-")}
                                        </DataLabelValueComponent>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*{*/}
                        {/*    clientBasicDetails?.emergency_contact_info?.primary_emergency?.secondary_contact_info?.length > 0 &&*/}
                        {/*    clientBasicDetails?.emergency_contact_info?.primary_emergency?.secondary_contact_info[0]?.phone !== "" &&*/}
                        {/*    <HorizontalLineComponent className={'alternate-heading-horizontal-line'}/>*/}
                        {/*}*/}
                        <div className="ts-row">
                            <div className="ts-col-6">
                                {clientBasicDetails?.emergency_contact_info?.primary_emergency?.secondary_contact_info?.length > 0 &&
                                    clientBasicDetails?.emergency_contact_info?.primary_emergency?.secondary_contact_info[0]?.phone !== "" &&
                                    <FormControlLabelComponent label={'Alternate:'}/>
                                }
                                {
                                    clientBasicDetails?.emergency_contact_info?.primary_emergency?.secondary_contact_info?.map((phone_number: any, index: number) => {
                                        return <>

                                            {
                                                phone_number?.phone_type_details?.title && phone_number?.phone && <>
                                                    <div className={'ts-row'}>
                                                        <div className={'ts-col-6'}>
                                                            <DataLabelValueComponent label={'Phone Type'}>
                                                                {phone_number?.phone_type_details?.title || "-"}
                                                            </DataLabelValueComponent>
                                                        </div>
                                                        <div className={'ts-col-6'}>
                                                            <DataLabelValueComponent label={'Phone Number'}>
                                                                {CommonService.formatPhoneNumber(phone_number?.phone || "-")}
                                                            </DataLabelValueComponent>
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                        </>
                                    })
                                }
                            </div>
                        </div>
                        <HorizontalLineComponent className={'secondary-horizontal-line'}/>
                        <FormControlLabelComponent className={'secondary-emergency-contact'}
                                                   label={'Secondary Emergency Contact'}/>
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
                            <>
                                <FormControlLabelComponent label={'Primary:'}/>
                                <div className={'ts-row'}>
                                    <div className={'ts-col-lg-3'}>
                                        <DataLabelValueComponent label={'Phone Type'}>
                                            {clientBasicDetails?.emergency_contact_info?.secondary_emergency?.primary_contact_info?.phone_type_details?.title || "-"}
                                        </DataLabelValueComponent>
                                    </div>
                                    <div className={'ts-col-lg-3'}>
                                        <DataLabelValueComponent label={'Phone Number'}>
                                            {CommonService.formatPhoneNumber(clientBasicDetails?.emergency_contact_info?.secondary_emergency?.primary_contact_info?.phone || "-")}
                                        </DataLabelValueComponent>
                                    </div>
                                </div>
                            </>
                        }
                        {clientBasicDetails?.emergency_contact_info?.secondary_emergency?.secondary_contact_info?.length > 0 &&
                            clientBasicDetails?.emergency_contact_info?.secondary_emergency?.secondary_contact_info[0]?.phone !== "" &&
                            <>
                                {/*< HorizontalLineComponent className={'alternate-heading-horizontal-line'}/>*/}
                                <FormControlLabelComponent label={'Alternate:'}/>
                            </>
                        }
                        {
                            clientBasicDetails?.emergency_contact_info?.secondary_emergency?.secondary_contact_info?.map((phone_number, index: number) => {
                                return <>
                                    {
                                        phone_number?.phone_type_details?.title && phone_number?.phone && <>
                                            <div className={'ts-row'}>
                                                <div className={'ts-col-lg-3'}>
                                                    <DataLabelValueComponent label={'Phone Type'}>
                                                        {phone_number?.phone_type_details?.title || "-"}
                                                    </DataLabelValueComponent>
                                                </div>
                                                <div className={'ts-col-lg-3'}>
                                                    <DataLabelValueComponent label={'Phone Number'}>
                                                        {CommonService.formatPhoneNumber(phone_number?.phone || "-")}
                                                    </DataLabelValueComponent>
                                                </div>
                                            </div>
                                        </>
                                    }
                                </>
                            })
                        }
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
