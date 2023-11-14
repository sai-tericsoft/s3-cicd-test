import "./ClientBasicDetailsComponent.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import moment from "moment";
import HorizontalLineComponent
    from "../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import React, {useEffect} from "react";
import MaskTextComponent from "../../../shared/components/mask-text/MaskTextComponent";
import {CommonService} from "../../../shared/services";
import {getBillingAddressList} from "../../../store/actions/billings.action";

interface ClientBasicDetailsComponentProps {
    clientId: string;
}

const ClientBasicDetailsComponent = (props: ClientBasicDetailsComponentProps) => {

    const {clientId} = props;
    const dispatch = useDispatch();

    const {
        clientBasicDetails,
        isClientBasicDetailsLoading,
        isClientBasicDetailsLoaded,
        isClientBasicDetailsLoadingFailed
    } = useSelector((state: IRootReducerState) => state.client);

    const {
        billingAddressList
    } = useSelector((state: IRootReducerState) => state.billings);

    const [isSSNMasked, setIsSSNMasked] = React.useState<boolean>(true);
    const [isFirstNameMasked, setIsFirstNameMasked] = React.useState<boolean>(true);
    const [isLastNameMasked, setIsLastNameMasked] = React.useState<boolean>(true);

    useEffect(() => {
        if (clientId) {
            dispatch(getBillingAddressList(clientId))
        }
    }, [dispatch,clientId]);

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
                            {
                                clientBasicDetails?.is_alias_name_set ? <>
                                        <div className="ts-col-md-6 ts-col-lg-3">
                                            <DataLabelValueComponent
                                                label={clientBasicDetails?.last_name ? `Last Name ${isLastNameMasked ? '(Click to view)' : ''}` : 'Last Name'}>
                                                {clientBasicDetails?.last_name ?
                                                    <MaskTextComponent value={clientBasicDetails?.last_name}
                                                                       onToggle={setIsLastNameMasked}/> : 'N/A'}
                                            </DataLabelValueComponent>
                                        </div>
                                        <div className="ts-col-md-6 ts-col-lg-3">
                                            <DataLabelValueComponent
                                                label={clientBasicDetails?.first_name ? `First Name ${isFirstNameMasked ? '(Click to view)' : ''}` : 'First Name'}>
                                                {clientBasicDetails?.first_name ?
                                                    <MaskTextComponent value={clientBasicDetails?.first_name}
                                                                       onToggle={setIsFirstNameMasked}/> : 'N/A'}
                                            </DataLabelValueComponent>
                                        </div>
                                        <div className="ts-col-md-6 ts-col-lg-3">
                                            <DataLabelValueComponent
                                                label={'Alias Last Name'}>
                                                {clientBasicDetails?.alias_last_name || 'N/A'}
                                            </DataLabelValueComponent>
                                        </div>
                                        <div className="ts-col-md-6 ts-col-lg-3">
                                            <DataLabelValueComponent
                                                label={'Alias First Name'}>
                                                {clientBasicDetails?.alias_first_name || 'N/A'}
                                            </DataLabelValueComponent>
                                        </div>
                                    </> :
                                    <>
                                        <div className="ts-col-md-6 ts-col-lg-3">
                                            <DataLabelValueComponent className={'patient-name'} label={'Last Name'}>
                                                {clientBasicDetails?.last_name || 'N/A'}
                                            </DataLabelValueComponent>
                                        </div>
                                        <div className="ts-col-md-6 ts-col-lg-3">
                                            <DataLabelValueComponent className={'patient-name'} label={'First Name'}>
                                                {clientBasicDetails?.first_name || "N/A"}
                                            </DataLabelValueComponent>
                                        </div>
                                    </>
                            }
                            <div className="ts-col-md-6 ts-col-lg-3">
                                <DataLabelValueComponent label={'Date of Birth'}>
                                    {(clientBasicDetails?.dob === undefined || !clientBasicDetails?.dob) ? "N/A" : moment(clientBasicDetails?.dob).format('DD-MMM-YYYY')}
                                </DataLabelValueComponent>
                            </div>
                            <div className="ts-col-md-6 ts-col-lg-3">
                                <DataLabelValueComponent label={'Gender'}>
                                    {clientBasicDetails?.gender_details?.title || 'N/A'}
                                </DataLabelValueComponent>
                            </div>
                            <div className="ts-col-md-6 ts-col-lg-3">
                                <DataLabelValueComponent label={'Nickname/Preferred Name'}>
                                    {clientBasicDetails?.nick_name || "N/A"}
                                </DataLabelValueComponent>
                            </div>
                            <div className="ts-col-md-6 ts-col-lg-3">
                                <DataLabelValueComponent
                                    label={clientBasicDetails?.ssn ? `SSN ${isSSNMasked ? '(Click to view)' : ''}` : 'SSN'}>
                                    {clientBasicDetails?.ssn ?
                                        <MaskTextComponent value={clientBasicDetails?.ssn}
                                                           onToggle={setIsSSNMasked}/> : 'N/A'}
                                </DataLabelValueComponent>
                            </div>
                        </div>
                    </CardComponent>
                    <CardComponent title={'Contact Information'} className={'contact-info-wrapper'}>
                        <div className="ts-row">
                            <div className="ts-col-6">
                                {/*<FormControlLabelComponent size={'sm'} label={'Primary Phone:'}/>*/}
                                <div className={'phone-email-heading'}>Primary Phone:</div>
                                <div className={'ts-row'}>
                                    <div className={'ts-col-6'}>
                                        <DataLabelValueComponent label={'Phone Type'}>
                                            {clientBasicDetails?.primary_contact_info?.phone_type_details?.title || "N/A"}
                                        </DataLabelValueComponent>
                                    </div>
                                    <div className={'ts-col-4'}>
                                        <DataLabelValueComponent label={'Phone Number'}>
                                            {CommonService.formatPhoneNumber(clientBasicDetails?.primary_contact_info?.phone || 'N/A')}
                                        </DataLabelValueComponent>
                                    </div>
                                </div>
                            </div>
                            <div className="ts-col-6">
                                {/*<FormControlLabelComponent size={'sm'} label={'Primary Email:'}/>*/}
                                <div className={'phone-email-heading'}>Primary Email:</div>
                                <div className={'ts-row'}>
                                    <div className={'ts-col-12'}>
                                        <DataLabelValueComponent label={'Email'}>
                                            {clientBasicDetails?.primary_email || "N/A"}
                                        </DataLabelValueComponent>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="ts-row">
                            {/*{clientBasicDetails?.secondary_contact_info?.length > 0 && (clientBasicDetails?.secondary_contact_info[0]?.phone !== "" || clientBasicDetails?.secondary_emails[0]?.email !== "")*/}
                            {/*    &&  <HorizontalLineComponent className={'alternate-heading-horizontal-line'}/>}*/}
                            <div className="ts-col-6">
                                {
                                    clientBasicDetails?.secondary_contact_info && clientBasicDetails?.secondary_contact_info?.length > 0 &&
                                    clientBasicDetails?.secondary_contact_info[0]?.phone !== "" &&
                                    <>
                                        {/*<FormControlLabelComponent size={'sm'} label={'Alternate Phone:'}/>*/}
                                        <div className={'phone-email-heading'}>Alternate Phone:</div>
                                    </>
                                }
                                {
                                    clientBasicDetails?.secondary_contact_info?.map((phone_number, index: number) => {
                                        return <>
                                            {
                                                phone_number?.phone_type_details?.title && phone_number?.phone && <>
                                                    <div className={'ts-row'}>
                                                        <div className={'ts-col-6'}>
                                                            <DataLabelValueComponent label={'Phone Type'}>
                                                                {phone_number?.phone_type_details?.title || "N/A"}
                                                            </DataLabelValueComponent>
                                                        </div>
                                                        <div className={'ts-col-4'}>
                                                            <DataLabelValueComponent label={'Phone Number'}>
                                                                {CommonService.formatPhoneNumber(phone_number?.phone || 'N/A')}
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
                                {clientBasicDetails?.secondary_emails && clientBasicDetails?.secondary_emails?.length > 0 &&
                                    clientBasicDetails?.secondary_emails[0]?.email !== "" &&
                                    <>
                                        {/*<FormControlLabelComponent size={'sm'} label={'Alternate Email:'}/>*/}
                                        <div className={'phone-email-heading'}>Alternate Email:</div>
                                    </>

                                }
                                <div className={'ts-row'}>
                                    {
                                        clientBasicDetails?.secondary_emails?.map((email, index: number) => {
                                            return <>
                                                {
                                                    email?.email && <div className={'ts-col-12'}>
                                                        <DataLabelValueComponent label={'Email'}>
                                                            {email?.email || 'N/A'}
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
                        <DataLabelValueComponent label={'Residential Address'}>
                            {Object.keys(clientBasicDetails?.address).length ? (
                                <>
                                    {clientBasicDetails.address.address_line}, {clientBasicDetails.address.city}, {clientBasicDetails.address.state}, {clientBasicDetails.address.country} {clientBasicDetails.address.zip_code}
                                </>
                            ) : 'N/A'}
                        </DataLabelValueComponent>
                        {
                            billingAddressList?.length > 0 && <>
                                <HorizontalLineComponent className={'alternate-heading-horizontal-line'}/>
                                <DataLabelValueComponent label={'Billing Address(es)'}>
                                    <div className={'ts-row'}>
                                        {billingAddressList?.map((address: any, index: number) => {
                                            return <>
                                                <div className={'ts-col-lg-5 billing-address-list'} key={index}>
                                                    <div>
                                                        <b>{address?.name}&nbsp;{address?.is_default ? '(Default)' : ''}</b>
                                                    </div>
                                                    {address.address_line}, {address.city}, {address.state}, {address.country} {address.zip_code}
                                                </div>
                                            </>

                                        })}
                                    </div>
                                </DataLabelValueComponent>
                            </>
                        }
                    </CardComponent>
                    <CardComponent title={'Emergency Contact Information'}>
                        <FormControlLabelComponent className={'primary-emergency-contact'}
                                                   label={'Primary Emergency Contact'}/>
                        <div className={'ts-row'}>
                            <div className={'ts-col-lg-3'}>
                                <DataLabelValueComponent label={'Full Name'}>
                                    {clientBasicDetails?.emergency_contact_info?.primary_emergency?.name || 'N/A'}

                                </DataLabelValueComponent>
                            </div>
                            <div className={'ts-col-lg-3'}>
                                <DataLabelValueComponent label={'Relationship'}>
                                    {clientBasicDetails?.emergency_contact_info?.primary_emergency?.relationship_details?.title || 'N/A'}
                                </DataLabelValueComponent>
                            </div>
                            <div className={'ts-col-lg-3'}>
                                <DataLabelValueComponent label={'Language'}>
                                    {clientBasicDetails?.emergency_contact_info?.primary_emergency?.language_details?.title || 'N/A'}
                                </DataLabelValueComponent>
                            </div>
                        </div>
                        <div className={'ts-row'}>
                            <div className="ts-col-6">
                                <div className={'phone-email-heading'}>Primary:</div>
                                <div className={'ts-row'}>
                                    <div className={'ts-col-6'}>
                                        <DataLabelValueComponent label={'Phone Type'}>
                                            {clientBasicDetails?.emergency_contact_info?.primary_emergency?.primary_contact_info?.phone_type_details?.title || 'N/A'}
                                        </DataLabelValueComponent>
                                    </div>
                                    <div className={'ts-col-6'}>
                                        <DataLabelValueComponent label={'Phone Number'}>
                                            {clientBasicDetails?.emergency_contact_info?.primary_emergency?.primary_contact_info?.phone ? CommonService.formatPhoneNumber(clientBasicDetails?.emergency_contact_info?.primary_emergency?.primary_contact_info?.phone) : 'N/A'}
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
                                {clientBasicDetails?.emergency_contact_info?.primary_emergency?.secondary_contact_info && clientBasicDetails?.emergency_contact_info?.primary_emergency?.secondary_contact_info?.length > 0 &&
                                    clientBasicDetails?.emergency_contact_info?.primary_emergency?.secondary_contact_info[0]?.phone !== "" &&
                                    <div className={'phone-email-heading'}>Alternate:</div>
                                }
                                {
                                    clientBasicDetails?.emergency_contact_info?.primary_emergency?.secondary_contact_info?.map((phone_number: any, index: number) => {
                                        return <>

                                            {
                                                phone_number?.phone_type_details?.title && phone_number?.phone && <>
                                                    <div className={'ts-row'}>
                                                        <div className={'ts-col-6'}>
                                                            <DataLabelValueComponent label={'Phone Type'}>
                                                                {phone_number?.phone_type_details?.title || "N/A"}
                                                            </DataLabelValueComponent>
                                                        </div>
                                                        <div className={'ts-col-6'}>
                                                            <DataLabelValueComponent label={'Phone Number'}>
                                                                {CommonService.formatPhoneNumber(phone_number?.phone || "N/A")}
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
                        {clientBasicDetails?.emergency_contact_info?.secondary_emergency?.name && <>
                            <HorizontalLineComponent className={'secondary-horizontal-line'}/>
                            <FormControlLabelComponent className={'secondary-emergency-contact'}
                                                       label={'Secondary Emergency Contact'}/>
                            <div className={'ts-row'}>
                                <div className={'ts-col-lg-3'}>
                                    <DataLabelValueComponent label={'Full Name'}>
                                        {clientBasicDetails?.emergency_contact_info?.secondary_emergency?.name || "N/A"}
                                    </DataLabelValueComponent>
                                </div>
                                <div className={'ts-col-lg-3'}>
                                    <DataLabelValueComponent label={'Relationship'}>
                                        {clientBasicDetails?.emergency_contact_info?.secondary_emergency?.relationship_details?.title || "N/A"}
                                    </DataLabelValueComponent>
                                </div>
                                <div className={'ts-col-lg-3'}>
                                    <DataLabelValueComponent label={'Language'}>
                                        {clientBasicDetails?.emergency_contact_info?.secondary_emergency?.language_details?.title || "N/A"}
                                    </DataLabelValueComponent>
                                </div>
                            </div>
                        </>
                        }
                        {
                            clientBasicDetails?.emergency_contact_info?.secondary_emergency?.primary_contact_info?.phone_type_details?.title && clientBasicDetails?.emergency_contact_info?.secondary_emergency?.primary_contact_info?.phone &&
                            <>
                                <div className={'phone-email-heading'}>Primary:</div>
                                <div className={'ts-row'}>
                                    <div className={'ts-col-lg-3'}>
                                        <DataLabelValueComponent label={'Phone Type'}>
                                            {clientBasicDetails?.emergency_contact_info?.secondary_emergency?.primary_contact_info?.phone_type_details?.title || "N/A"}
                                        </DataLabelValueComponent>
                                    </div>
                                    <div className={'ts-col-lg-3'}>
                                        <DataLabelValueComponent label={'Phone Number'}>
                                            {CommonService.formatPhoneNumber(clientBasicDetails?.emergency_contact_info?.secondary_emergency?.primary_contact_info?.phone || "N/A")}
                                        </DataLabelValueComponent>
                                    </div>
                                </div>
                            </>
                        }
                        {clientBasicDetails?.emergency_contact_info?.secondary_emergency?.secondary_contact_info && clientBasicDetails?.emergency_contact_info?.secondary_emergency?.secondary_contact_info?.length > 0 &&
                            clientBasicDetails?.emergency_contact_info?.secondary_emergency?.secondary_contact_info[0]?.phone !== "" &&
                            <>
                                {/*< HorizontalLineComponent className={'alternate-heading-horizontal-line'}/>*/}
                                <div className={'phone-email-heading'}>Alternate:</div>
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
                                                        {phone_number?.phone_type_details?.title || "N/A"}
                                                    </DataLabelValueComponent>
                                                </div>
                                                <div className={'ts-col-lg-3'}>
                                                    <DataLabelValueComponent label={'Phone Number'}>
                                                        {CommonService.formatPhoneNumber(phone_number?.phone || "N/A")}
                                                    </DataLabelValueComponent>
                                                </div>
                                            </div>
                                        </>
                                    }
                                </>
                            })
                        }
                    </CardComponent>
                    <CardComponent title={'Work Information'} className={'work-info-card'}>
                        <div className={'ts-row'}>
                            <div className={'ts-col-lg-3'}>
                                <DataLabelValueComponent label={'Occupation'}>
                                    <div>{clientBasicDetails?.work_info?.occupation || 'N/A'}</div>
                                </DataLabelValueComponent>
                            </div>
                            <div className={'ts-col-lg-3'}>
                                <DataLabelValueComponent label={'Employment Status'}>
                                    <div> {clientBasicDetails?.work_info?.employment_status_details?.title || 'N/A'}</div>
                                    <br/>
                                </DataLabelValueComponent>
                            </div>
                        </div>
                    </CardComponent>
                </>
            }
        </div>
    )
        ;

};

export default ClientBasicDetailsComponent;
