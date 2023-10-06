import "./UserBasicDetailsComponent.scss";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import React, {useEffect} from "react";
import CardComponent from "../../../shared/components/card/CardComponent";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import moment from "moment";
import MaskTextComponent from "../../../shared/components/mask-text/MaskTextComponent";
import {CommonService} from "../../../shared/services";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import HorizontalLineComponent
    from "../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";
import ESignApprovalComponent from "../../../shared/components/e-sign-approval/ESignApprovalComponent";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../constants";
import {useLocation, useNavigate} from "react-router-dom";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";

interface UserBasicDetailsComponentProps {

}

const UserBasicDetailsComponent = (props: UserBasicDetailsComponentProps) => {
    const [isSSNMasked, setIsSSNMasked] = React.useState<boolean>(true);
    const location: any = useLocation();
    const path = location.pathname;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        isUserBasicDetailsLoaded,
        userBasicDetails,
    } = useSelector((state: IRootReducerState) => state.user);

    useEffect(() => {
        if (path.includes('admin')) {
            dispatch(setCurrentNavParams('User List', null, () => {
                navigate(CommonService._routeConfig.UserList());
            }));
        }
    }, [dispatch, navigate, path]);

    return (
        <div className={'user-basic-details-component'}>
            <div className={'client-basic-details-component'}>
                {/*{*/}
                {/*    isUserBasicDetailsLoading && <div>*/}
                {/*        <LoaderComponent/>*/}
                {/*    </div>*/}
                {/*}*/}
                {/*{*/}
                {/*    isUserBasicDetailsLoadingFailed &&*/}
                {/*    <StatusCardComponent title={"Failed to fetch client Details"}/>*/}
                {/*}*/}
                {
                    (isUserBasicDetailsLoaded && userBasicDetails) && <>
                        <CardComponent title={'Basic Details'} actions={<LinkComponent
                            route={path.includes('settings') ? CommonService._user.NavigateToSettingEdit(userBasicDetails._id, 'personal_details') : CommonService._user.NavigateToUserEdit(userBasicDetails._id, "personal_details")}>
                            <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>} size={"small"}>
                                Edit
                            </ButtonComponent>
                        </LinkComponent>
                        }>
                            <div className="ts-row">
                                <div className="ts-col-md-6 ts-col-lg-3">
                                    <DataLabelValueComponent label={'Last Name'}>
                                        {userBasicDetails?.last_name || 'N/A'}
                                    </DataLabelValueComponent>
                                </div>
                                <div className="ts-col-md-6 ts-col-lg-3">
                                    <DataLabelValueComponent label={'First Name'}>
                                        {userBasicDetails?.first_name || "N/A"}
                                    </DataLabelValueComponent>
                                </div>
                                <div className="ts-col-md-6 ts-col-lg-3">
                                    <DataLabelValueComponent label={'Date of Birth'}>
                                        {(userBasicDetails?.dob === undefined || !userBasicDetails?.dob) ? "N/A" : moment(userBasicDetails?.dob).format('DD-MMM-YYYY')}
                                    </DataLabelValueComponent>
                                </div>
                                <div className="ts-col-md-6 ts-col-lg-3">
                                    <DataLabelValueComponent label={'Gender'}>
                                        {userBasicDetails?.gender_details?.title || 'N/A'}
                                    </DataLabelValueComponent>
                                </div>
                                <div className="ts-col-md-6 ts-col-lg-3">
                                    <DataLabelValueComponent label={'Role'}>
                                        {userBasicDetails?.role || "N/A"}
                                    </DataLabelValueComponent>
                                </div>
                                <div className="ts-col-md-6 ts-col-lg-3">
                                    <DataLabelValueComponent label={'Nickname/Preferred Name'}>
                                        {userBasicDetails?.nick_name || "N/A"}
                                    </DataLabelValueComponent>
                                </div>
                                <div className="ts-col-md-6 ts-col-lg-3">
                                    <DataLabelValueComponent label={'NPI Number'}>
                                        {userBasicDetails?.npi_number || "N/A"}
                                    </DataLabelValueComponent>
                                </div>
                                <div className="ts-col-md-6 ts-col-lg-3">
                                    <DataLabelValueComponent label={`SSN ${isSSNMasked ? '(Click to view)' : ''}`}>
                                        <MaskTextComponent value={userBasicDetails?.ssn || 'N/A'}
                                                           onToggle={setIsSSNMasked}/>
                                    </DataLabelValueComponent>
                                </div>
                            </div>
                            <div className="ts-row">
                                <div className="ts-col-md-6 ts-col-lg-3">
                                    <DataLabelValueComponent label={'License Number'}>
                                        {userBasicDetails?.license_number || 'N/A'}
                                    </DataLabelValueComponent>
                                </div>
                            </div>
                            <div className="ts-row">
                                <div className="ts-col-md-6 ts-col-lg-6">
                                    <DataLabelValueComponent label={'Assigned Facilities'}>
                                        {userBasicDetails?.assigned_facility_details?.map((facility: any) => {
                                            return <div className="d-flex">
                                                <div>{facility.name}</div>
                                                &nbsp; - &nbsp;
                                                <div>{facility.location}</div>
                                            </div>
                                        })}
                                    </DataLabelValueComponent>
                                </div>
                            </div>
                            <div className="ts-row">
                                <div className="ts-col-md-6 ts-col-lg-6">
                                    <div className="font-weight-bold mrg-bottom-20">Signature</div>
                                    {userBasicDetails?.signature ? <div className="mrg-bottom-20">
                                        <ESignApprovalComponent isSigned={true}
                                                                signature_url={userBasicDetails?.signature}
                                                                signedAt={CommonService.convertDateFormat(userBasicDetails?.updated_at)}/>
                                    </div> : <div className='pdd-bottom-20'>N/A</div>}
                                </div>

                            </div>
                        </CardComponent>
                        <CardComponent title={'About'}
                                       actions={<LinkComponent
                                           route={path.includes('settings') ? CommonService._user.NavigateToSettingEdit(userBasicDetails._id, "about") : CommonService._user.NavigateToUserEdit(userBasicDetails._id, "about")}>
                                           <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>} size={"small"}>
                                               Edit
                                           </ButtonComponent>
                                       </LinkComponent>
                                       }>
                            <div className="ts-row">
                                <div className="ts-col-12">
                                    <DataLabelValueComponent label={'Summary'}>
                                        {userBasicDetails?.summary || 'N/A'}
                                    </DataLabelValueComponent>
                                </div>
                            </div>
                            <div className="ts-row">
                                <div className="ts-col-12 font-weight-bold mrg-bottom-20">Specialities</div>
                                {userBasicDetails?.specialities?.length ? userBasicDetails?.specialities?.map((speciality: any, index: any) => {
                                    return <div className="ts-col-md-6 ts-col-lg-3">
                                        <DataLabelValueComponent label={`speciality ${index + 1}`}>
                                            {speciality || 'N/A'}
                                        </DataLabelValueComponent>
                                    </div>
                                }) : <div className='ts-col-md-6 ts-col-lg-3'>N/A</div>
                                }
                            </div>
                            <HorizontalLineComponent className="user-details-horizontal-line"/>
                            <div className="ts-row">
                                <div className="ts-col-12 font-weight-bold mrg-bottom-20">Languages</div>
                                {userBasicDetails?.languages?.length ? userBasicDetails?.languages?.map((language: any, index: any) => {
                                    return <>
                                        <div className="ts-col-md-6 ts-col-lg-3">
                                            <DataLabelValueComponent label={`Language ${index + 1}`}>
                                                {language.name || 'N/A'}
                                            </DataLabelValueComponent>
                                        </div>

                                        <div className="ts-col-md-6 ts-col-lg-3">
                                            <DataLabelValueComponent label={'Read'}>
                                                {language?.read ? 'Yes' : 'No' || 'N/A'}
                                            </DataLabelValueComponent>
                                        </div>

                                        <div className="ts-col-md-6 ts-col-lg-3">
                                            <DataLabelValueComponent label={'Write'}>
                                                {language?.write ? 'Yes' : 'No' || 'N/A'}
                                            </DataLabelValueComponent>
                                        </div>

                                        <div className="ts-col-md-6 ts-col-lg-3">
                                            <DataLabelValueComponent label={'Speak'}>
                                                {language?.speak ? 'Yes' : 'No' || 'N/A'}
                                            </DataLabelValueComponent>
                                        </div>
                                    </>
                                }) : <div className='ts-col-md-6 ts-col-lg-3 mrg-bottom-20'>N/A</div>
                                }
                            </div>
                        </CardComponent>
                        <CardComponent title={'Contact Information'}
                                       actions={<LinkComponent
                                           route={path.includes('settings') ? CommonService._user.NavigateToSettingEdit(userBasicDetails._id, "contact_information") : CommonService._user.NavigateToUserEdit(userBasicDetails._id, "contact_information")}>
                                           <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>} size={"small"}>
                                               Edit
                                           </ButtonComponent>
                                       </LinkComponent>
                                       }>
                            <div className="ts-row">
                                <div className="ts-col-6">
                                    {/*<FormControlLabelComponent size={'sm'} label={'Primary Phone:'}/>*/}
                                    <div className={'phone-email-heading'}>Primary Phone:</div>
                                    <div className={'ts-row'}>
                                        <div className={'ts-col-6'}>
                                            <DataLabelValueComponent label={'Phone Type'}>
                                                {userBasicDetails?.primary_contact_info?.phone_type || "N/A"}
                                            </DataLabelValueComponent>
                                        </div>
                                        <div className={'ts-col-4'}>
                                            <DataLabelValueComponent label={'Phone Number'}>
                                                {CommonService.formatPhoneNumber(userBasicDetails?.primary_contact_info?.phone || 'N/A')}
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
                                                {userBasicDetails?.primary_email || "N/A"}
                                            </DataLabelValueComponent>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="ts-row">
                                {/*{userBasicDetails?.secondary_contact_info?.length > 0 && (userBasicDetails?.secondary_contact_info[0]?.phone !== "" || userBasicDetails?.secondary_emails[0]?.email !== "")*/}
                                {/*    &&  <HorizontalLineComponent className={'alternate-heading-horizontal-line'}/>}*/}
                                <div className="ts-col-6">
                                    {
                                        userBasicDetails?.secondary_contact_info?.length > 0 &&
                                        userBasicDetails?.secondary_contact_info[0]?.phone !== "" &&
                                        <>
                                            {/*<FormControlLabelComponent size={'sm'} label={'Alternate Phone:'}/>*/}
                                            <div className={'phone-email-heading'}>Alternate Phone:</div>
                                        </>
                                    }
                                    {
                                        userBasicDetails?.secondary_contact_info?.map((phone_number: any, index: number) => {
                                            return <>
                                                {
                                                    phone_number?.phone_type && phone_number?.phone && <>
                                                        <div className={'ts-row'}>
                                                            <div className={'ts-col-6'}>
                                                                <DataLabelValueComponent label={'Phone Type'}>
                                                                    {phone_number?.phone_type || "N/A"}
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
                                    {userBasicDetails?.secondary_emails?.length > 0 &&
                                    userBasicDetails?.secondary_emails[0]?.email !== "" &&
                                    <>
                                        {/*<FormControlLabelComponent size={'sm'} label={'Alternate Email:'}/>*/}
                                        <div className={'phone-email-heading'}>Alternate Email:</div>
                                    </>

                                    }
                                    <div className={'ts-row'}>
                                        {
                                            userBasicDetails?.secondary_emails?.map((email: any, index: number) => {
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
                        <CardComponent title={'Address Information'} actions={<LinkComponent
                            route={path.includes('settings') ? CommonService._user.NavigateToSettingEdit(userBasicDetails._id, "address") : CommonService._user.NavigateToUserEdit(userBasicDetails._id, "address")}>
                            <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>} size={"small"}>
                                Edit
                            </ButtonComponent>
                        </LinkComponent>
                        }>
                            <DataLabelValueComponent label={'Address'}>
                                {Object.keys(userBasicDetails?.address).length ? (
                                    <>
                                        {userBasicDetails.address.address_line}, {userBasicDetails.address.city},&nbsp;
                                        {userBasicDetails.address.state}, {userBasicDetails.address.country}, {userBasicDetails.address.zip_code}
                                    </>
                                ) : 'N/A'}
                            </DataLabelValueComponent>
                        </CardComponent>
                        <CardComponent title={'Emergency Contact Information'} actions={<LinkComponent
                            route={path.includes('settings') ? CommonService._user.NavigateToSettingEdit(userBasicDetails._id, "emergency_contact_info") : CommonService._user.NavigateToUserEdit(userBasicDetails._id, "emergency_contact_info")}>
                            <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>} size={"small"}>
                                Edit
                            </ButtonComponent>
                        </LinkComponent>
                        }>
                            <FormControlLabelComponent className={'primary-emergency-contact'}
                                                       label={'Primary Emergency Contact'}/>
                            <div className={'ts-row'}>
                                <div className={'ts-col-lg-3'}>
                                    <DataLabelValueComponent label={'Full Name'}>
                                        {userBasicDetails?.emergency_contact_info?.primary_emergency?.name || 'N/A'}

                                    </DataLabelValueComponent>
                                </div>
                                <div className={'ts-col-lg-3'}>
                                    <DataLabelValueComponent label={'Relationship'}>
                                        {userBasicDetails?.emergency_contact_info?.primary_emergency?.relationship_details?.title || 'N/A'}
                                    </DataLabelValueComponent>
                                </div>
                                <div className={'ts-col-lg-3'}>
                                    <DataLabelValueComponent label={'Language'}>
                                        {userBasicDetails?.emergency_contact_info?.primary_emergency?.language_details?.title || 'N/A'}
                                    </DataLabelValueComponent>
                                </div>
                            </div>
                            <div className={'ts-row'}>
                                <div className="ts-col-6">
                                    <div className={'phone-email-heading'}>Primary:</div>
                                    <div className={'ts-row'}>
                                        <div className={'ts-col-6'}>
                                            <DataLabelValueComponent label={'Phone Type'}>
                                                {userBasicDetails?.emergency_contact_info?.primary_emergency?.primary_contact_info?.phone_type || 'N/A'}
                                            </DataLabelValueComponent>
                                        </div>
                                        <div className={'ts-col-6'}>
                                            <DataLabelValueComponent label={'Phone Number'}>
                                                {CommonService.formatPhoneNumber(userBasicDetails?.emergency_contact_info?.primary_emergency?.primary_contact_info?.phone) || 'N/A'}
                                            </DataLabelValueComponent>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*{*/}
                            {/*    userBasicDetails?.emergency_contact_info?.primary_emergency?.secondary_contact_info?.length > 0 &&*/}
                            {/*    userBasicDetails?.emergency_contact_info?.primary_emergency?.secondary_contact_info[0]?.phone !== "" &&*/}
                            {/*    <HorizontalLineComponent className={'alternate-heading-horizontal-line'}/>*/}
                            {/*}*/}
                            <div className="ts-row">
                                <div className="ts-col-6">
                                    {userBasicDetails?.emergency_contact_info?.primary_emergency?.secondary_contact_info?.length > 0 &&
                                    userBasicDetails?.emergency_contact_info?.primary_emergency?.secondary_contact_info[0]?.phone !== "" &&
                                    <div className={'phone-email-heading'}>Alternate:</div>
                                    }
                                    {
                                        userBasicDetails?.emergency_contact_info?.primary_emergency?.secondary_contact_info?.map((phone_number: any, index: number) => {
                                            return <>

                                                {
                                                    phone_number?.phone_type && phone_number?.phone && <>
                                                        <div className={'ts-row'}>
                                                            <div className={'ts-col-6'}>
                                                                <DataLabelValueComponent label={'Phone Type'}>
                                                                    {phone_number?.phone_type || "N/A"}
                                                                </DataLabelValueComponent>
                                                            </div>
                                                            <div className={'ts-col-6'}>
                                                                <DataLabelValueComponent label={'Phone Number'}>
                                                                    {CommonService.formatPhoneNumber(phone_number?.phone) || "N/A"}
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
                            {userBasicDetails?.emergency_contact_info?.secondary_emergency?.name && <>
                                <HorizontalLineComponent className={'secondary-horizontal-line'}/>
                                <FormControlLabelComponent className={'secondary-emergency-contact'}
                                                           label={'Secondary Emergency Contact'}/>
                                <div className={'ts-row'}>
                                    <div className={'ts-col-lg-3'}>
                                        <DataLabelValueComponent label={'Full Name'}>
                                            {userBasicDetails?.emergency_contact_info?.secondary_emergency?.name || "N/A"}
                                        </DataLabelValueComponent>
                                    </div>
                                    <div className={'ts-col-lg-3'}>
                                        <DataLabelValueComponent label={'Relationship'}>
                                            {userBasicDetails?.emergency_contact_info?.secondary_emergency?.relationship_details?.title || "N/A"}
                                        </DataLabelValueComponent>
                                    </div>
                                    <div className={'ts-col-lg-3'}>
                                        <DataLabelValueComponent label={'Language'}>
                                            {userBasicDetails?.emergency_contact_info?.secondary_emergency?.language_details?.title || "N/A"}
                                        </DataLabelValueComponent>
                                    </div>
                                </div>
                            </>
                            }
                            {
                                userBasicDetails?.emergency_contact_info?.secondary_emergency?.primary_contact_info?.phone_type && userBasicDetails?.emergency_contact_info?.secondary_emergency?.primary_contact_info?.phone &&
                                <>
                                    <div className={'phone-email-heading'}>Primary:</div>
                                    <div className={'ts-row'}>
                                        <div className={'ts-col-lg-3'}>
                                            <DataLabelValueComponent label={'Phone Type'}>
                                                {userBasicDetails?.emergency_contact_info?.secondary_emergency?.primary_contact_info?.phone_type || "N/A"}
                                            </DataLabelValueComponent>
                                        </div>
                                        <div className={'ts-col-lg-3'}>
                                            <DataLabelValueComponent label={'Phone Number'}>
                                                {CommonService.formatPhoneNumber(userBasicDetails?.emergency_contact_info?.secondary_emergency?.primary_contact_info?.phone) || "N/A"}
                                            </DataLabelValueComponent>
                                        </div>
                                    </div>
                                </>
                            }
                            {userBasicDetails?.emergency_contact_info?.secondary_emergency?.secondary_contact_info?.length > 0 &&
                            userBasicDetails?.emergency_contact_info?.secondary_emergency?.secondary_contact_info[0]?.phone !== "" &&
                            <>
                                {/*< HorizontalLineComponent className={'alternate-heading-horizontal-line'}/>*/}
                                <div className={'phone-email-heading'}>Alternate:</div>
                            </>
                            }
                            {
                                userBasicDetails?.emergency_contact_info?.secondary_emergency?.secondary_contact_info?.map((phone_number: any, index: number) => {
                                    return <>
                                        {
                                            phone_number?.phone_type && phone_number?.phone && <>
                                                <div className={'ts-row'}>
                                                    <div className={'ts-col-lg-3'}>
                                                        <DataLabelValueComponent label={'Phone Type'}>
                                                            {phone_number?.phone_type || "N/A"}
                                                        </DataLabelValueComponent>
                                                    </div>
                                                    <div className={'ts-col-lg-3'}>
                                                        <DataLabelValueComponent label={'Phone Number'}>
                                                            {CommonService.formatPhoneNumber(phone_number?.phone) || "N/A"}
                                                        </DataLabelValueComponent>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    </>
                                })
                            }
                        </CardComponent>
                        <CardComponent title={'Professional Details'} actions={<LinkComponent
                            route={path.includes('settings') ? CommonService._user.NavigateToSettingEdit(userBasicDetails._id, "professional_details") : CommonService._user.NavigateToUserEdit(userBasicDetails._id, "professional_details")}>
                            <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>} size={"small"}>
                                Edit
                            </ButtonComponent>
                        </LinkComponent>
                        }>
                            {userBasicDetails?.professional_details?.length ? userBasicDetails.professional_details.map((professional_details: any, index: any) => {
                                return <>
                                    <div className={'ts-row'}>
                                        <div
                                            className="ts-col-12 font-weight-bold mrg-bottom-20">Experience {index + 1}:
                                        </div>
                                        <div className="ts-col">
                                            <DataLabelValueComponent label={'Company Name'}>
                                                {professional_details.company_name || 'N/A'}
                                            </DataLabelValueComponent>
                                        </div>

                                        <div className="ts-col">
                                            <DataLabelValueComponent label={'Location'}>
                                                {professional_details?.company_location || 'N/A'}
                                            </DataLabelValueComponent>
                                        </div>

                                        <div className="ts-col">
                                            <DataLabelValueComponent label={'Position Title'}>
                                                {professional_details?.position || 'N/A'}
                                            </DataLabelValueComponent>
                                        </div>

                                        <div className="ts-col">
                                            <DataLabelValueComponent label={'Start Date'}>
                                                {/*{professional_details?.start_date || 'N/A'}*/}
                                                {
                                                    professional_details?.start_date==="Invalid date" ? "N/A":moment(professional_details?.start_date).format('DD-MMM-YYYY')
                                                }
                                            </DataLabelValueComponent>
                                        </div>

                                        <div className="ts-col">
                                            <DataLabelValueComponent label={'End Date'}>
                                                {professional_details?.end_date==="Invalid date"? 'N/A' : moment(professional_details?.end_date).format('DD-MMM-YYYY') }
                                            </DataLabelValueComponent>
                                        </div>
                                    </div>
                                    {index !== userBasicDetails.professional_details.length - 1 &&
                                    <HorizontalLineComponent/>}
                                </>
                            }) : <StatusCardComponent title={'Professional Details Not Available'}/>
                            }
                        </CardComponent>

                        <CardComponent title={'Education Details'} actions={<LinkComponent
                            route={path.includes('settings') ? CommonService._user.NavigateToSettingEdit(userBasicDetails._id, "education_details") : CommonService._user.NavigateToUserEdit(userBasicDetails._id, "education_details")}>
                            <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>} size={"small"}>
                                Edit
                            </ButtonComponent>
                        </LinkComponent>
                        }>
                            {userBasicDetails?.education_details?.length ? userBasicDetails.education_details.map((education_details: any, index: any) => {
                                    return <>
                                        <div className={'ts-row'}>
                                            <div
                                                className="ts-col-12 font-weight-bold mrg-bottom-20">Experience {index + 1}:
                                            </div>
                                            <div className="ts-col">
                                                <DataLabelValueComponent label={'Institution Name'}>
                                                    {education_details.institution_name || 'N/A'}
                                                </DataLabelValueComponent>
                                            </div>

                                            <div className="ts-col">
                                                <DataLabelValueComponent label={'Location'}>
                                                    {education_details?.institution_location || 'N/A'}
                                                </DataLabelValueComponent>
                                            </div>

                                            <div className="ts-col">
                                                <DataLabelValueComponent label={'Degree'}>
                                                    {education_details?.degree || 'N/A'}
                                                </DataLabelValueComponent>
                                            </div>

                                            <div className="ts-col">
                                                <DataLabelValueComponent label={'Start Date'}>
                                                    {education_details?.start_date==='Invalid date' ? 'N/A' : moment(education_details?.start_date).format('DD-MMM-YYYY')}
                                                </DataLabelValueComponent>
                                            </div>

                                            <div className="ts-col">
                                                <DataLabelValueComponent label={'End Date'}>
                                                    {education_details?.end_date==='Invalid date'? 'N/A' :moment(education_details?.end_date).format('DD-MMM-YYYY')}
                                                </DataLabelValueComponent>
                                            </div>
                                        </div>
                                        {index !== userBasicDetails.education_details.length - 1 &&
                                        <HorizontalLineComponent/>}
                                    </>
                                })
                                : <StatusCardComponent title={'Education Details Not Available'}/>
                            }
                        </CardComponent>
                    </>
                }
            </div>
        </div>
    );

};

export default UserBasicDetailsComponent;
