import React, {useCallback, useEffect, useState} from "react";
import "./AppointmentDetailsComponent.scss";
import {CommonService} from "../../services";
import {IAPIResponseType} from "../../models/api.model";
import {ImageConfig} from "../../../constants";
import moment from "moment";
import ButtonComponent from "../button/ButtonComponent";
import {ListItem} from "@mui/material";
import MenuDropdownComponent from "../menu-dropdown/MenuDropdownComponent";
import ChipComponent from "../chip/ChipComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import LoaderComponent from "../loader/LoaderComponent";
import ErrorComponent from "../error/ErrorComponent";
import AppointmentNoShowComponent from "./appointment-noshow/AppointmentNoShowComponent";
import AppointmentCancelComponent from "./appointment-cancel/AppointmentCancelComponent";
import AppointmentRescheduleComponent from "./appointment-reschedule/AppointmentRescheduleComponent";
import AppointmentPaymentComponent from "./appointment-payment/AppointmentPaymentComponent";

interface AppointmentDetailsComponentProps {
    onClose?: () => void
    onComplete?: () => void,
    appointment_id: any
}

const AppointmentDetailsComponent = (props: AppointmentDetailsComponentProps) => {
    const {onClose, appointment_id, onComplete} = props;
    const {appointmentTypes} = useSelector((state: IRootReducerState) => state.staticData);
    const [bookType, setBookType] = useState<any | null>(null);

    const [step, setStep] = useState<'details' | 'payment' | 'noshow' | 'checkin' | 'reschedule' | 'cancel'>('details');
    const [details, setDetails] = useState<any | null>(null);
    const [formStatus, setFormStatus] = useState<any[] | null>(null);
    const [isDetailsLoading, setIsDetailsLoading] = useState<boolean>(false);
    const [isDetailsLoaded, setIsDetailsLoaded] = useState<boolean>(false);

    useEffect(() => {
        if (details) {
            const type = appointmentTypes?.find(v => v.code === details.appointment_type);
            setBookType(type);
        }
    }, [appointmentTypes, details]);

    const getAppointmentFormStatus = useCallback(
        (appointment_id: string) => {
            CommonService._appointment.getAppointmentFormStatus(appointment_id)
                .then((response: IAPIResponseType<any>) => {
                    setFormStatus(response.data || []);
                })
                .catch((error: any) => {
                    setFormStatus([]);
                })
                .finally(() => {
                })
        },
        [],
    );


    const getAppointmentDetails = useCallback(
        (appointment_id: string) => {
            setIsDetailsLoading(true);
            CommonService._appointment.getAppointment(appointment_id)
                .then((response: IAPIResponseType<any>) => {
                    setDetails(response.data);
                    getAppointmentFormStatus(appointment_id); //todo: change to appointment id

                })
                .catch((error: any) => {
                    setDetails(null);
                })
                .finally(() => {
                    setIsDetailsLoading(false);
                    setIsDetailsLoaded(true);
                })
        },
        [getAppointmentFormStatus],
    );


    useEffect(() => {
        if (appointment_id) {
            getAppointmentDetails(appointment_id);
        }
    }, [getAppointmentDetails, appointment_id]);

    const onReschedule = useCallback(
        () => {
            setStep('reschedule');
        },
        [],
    );
    const onCancelAppointment = useCallback(
        () => {
            setStep('cancel');
        },
        [],
    );
    const onNoShow = useCallback(
        () => {
            setStep('noshow');
        },
        [],
    );
    const onBack = useCallback(
        () => {
            setStep('details');
        },
        [],
    );

    const onCheckIn = useCallback(
        (payload: any = {}) => {
            CommonService._appointment.appointmentCheckin(appointment_id, payload)
                .then((response: IAPIResponseType<any>) => {
                    setStep('checkin');
                })
                .catch((error: any) => {
                })
                .finally(() => {
                })
        },
        [appointment_id],
    );


    return (
        <div className={`appointment-details-component`}>

            {isDetailsLoading && <LoaderComponent/>}
            {!details && isDetailsLoaded && <ErrorComponent errorText={'Failed to load details'}/>}
            {details && isDetailsLoaded && <>
                {
                    step === 'details' && <div className={'appointment-details-wrapper'}>
                        <div className="drawer-header">
                            {/*<ToolTipComponent tooltip={"Close"} position={"left"}>*/}
                            {/*    <div className="drawer-close"*/}
                            {/*         id={'book-appointment-close-btn'}*/}
                            {/*         onClick={(event) => {*/}
                            {/*             if (onClose) {*/}
                            {/*                 onClose();*/}
                            {/*             }*/}
                            {/*         }*/}
                            {/*         }><ImageConfig.CloseIcon/></div>*/}
                            {/*</ToolTipComponent>*/}
                        </div>
                        <div className="appointment-details-heading">Appointment Details</div>

                        <div className={"status-block " + details?.status}>
                            <div className="status-info">
                                {details?.status === 'scheduled' && <>
                                    <div className="info-text">
                                        Appointment Fees : $ {CommonService.convertToDecimals(+(details?.amount))}
                                    </div>
                                </>}
                                {details?.status === 'upcoming' && <>
                                    <div className="info-text">
                                        Check-In Time
                                        : {CommonService.getHoursAndMinutesFromMinutes(details?.start_time)}
                                    </div>
                                </>}
                                {details?.status === 'engaged' && <>
                                    <div className="info-text">
                                        Session Start Time
                                        : {CommonService.getHoursAndMinutesFromMinutes(details?.actual_start_time)}
                                    </div>
                                </>}
                                {details?.status === 'cancelled' && <>
                                    <div className="info-text">
                                        Cancellation Fees
                                        : {(details?.waive_cancellation_fee) ? 'Waived Off' : '$' + (details?.cancellation_charge?.amount || 0)}
                                    </div>
                                </>}
                                {details?.status === 'no_show' && <>
                                    <div className="info-text">
                                        No Show Fees :
                                        {(details?.waive_no_show_fee) ? 'Waived Off' : '$' + (details?.no_show_charge?.amount || 0)}
                                    </div>
                                </>}
                                {details?.status === 'completed' && <>
                                    <div className="info-text">
                                        Session Start Time
                                        : {details?.actual_start_time && CommonService.getHoursAndMinutesFromMinutes(details?.actual_start_time)}
                                        <br/>
                                        Session End Time
                                        : {details?.actual_end_time && CommonService.getHoursAndMinutesFromMinutes(details?.actual_end_time)}
                                    </div>
                                </>}
                            </div>
                            <div className="status-text">
                                {details?.status}
                            </div>
                        </div>
                        <div className="details-header">

                            <div className="block-body pdd-top-20">
                                <div className="block-content">
                                    <ImageConfig.CalendarIcon/>
                                    <div
                                        className="content-title">{CommonService.convertDateFormat(details.appointment_date)}</div>
                                </div>
                                <div className="block-content">
                                    <ImageConfig.TimerIcon/>
                                    <div
                                        className="content-title">{moment(Math.floor(details.start_time / 60) + ':' + details.start_time % 60, 'hh:mm').format('hh:mm A')}</div>
                                </div>
                                <div className="block-content mrg-left-40">
                                    {details?.status === 'scheduled' && <MenuDropdownComponent menuBase={
                                        <ButtonComponent size={'large'} className={'select-dropdown'}
                                                         variant={'outlined'} fullWidth={true}>
                                            Select Action &nbsp;<ImageConfig.SelectDropDownIcon/>
                                        </ButtonComponent>
                                    } menuOptions={
                                        [
                                            <ListItem onClick={onReschedule}>Reschedule Appointment</ListItem>,
                                            <ListItem onClick={onNoShow}>No Show</ListItem>,
                                            <ListItem onClick={onCancelAppointment}>Cancel Appointment</ListItem>
                                        ]
                                    }
                                    />}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="details-box">
                                <div className="details-header">Other Details</div>
                                <div className="details-body">
                                    <div className="details-body-block">
                                        <div className="details-body-item">
                                            <div className="item-heading"><ImageConfig.PersonIcon/>&nbsp;&nbsp;Client
                                                Name
                                            </div>
                                            <div
                                                className="item-value">{details?.client_details?.first_name + ' ' + details?.client_details?.last_name}</div>
                                        </div>
                                        <div className="details-body-item">
                                            <div className="item-heading"><ImageConfig.CallIcon/>&nbsp;&nbsp;Phone
                                                Number
                                            </div>
                                            <div
                                                className="item-value">{details?.client_details?.primary_contact_info?.phone ? CommonService.formatPhoneNumber(details?.client_details?.primary_contact_info?.phone) : 'N/A'}</div>
                                        </div>
                                        <div className="details-body-item">
                                            <div className="item-heading"><ImageConfig.EmailIcon/>&nbsp;&nbsp;Email
                                            </div>
                                            <div
                                                className="item-value">{details?.client_details?.primary_email || 'N/A'}</div>
                                        </div>
                                    </div>
                                    <div className="details-body-block">
                                        <div className="details-body-item">
                                            <div className="item-heading">
                                                <ImageConfig.AssignmentIcon/>&nbsp;&nbsp;Provider Name
                                            </div>
                                            <div
                                                className="item-value">
                                                <div className="mrg-bottom-10">
                                                    {details?.provider_details?.first_name + ' ' + details?.provider_details?.last_name}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="details-body-block">
                                        <div className="details-body-item">
                                            <div className="item-heading">
                                                <ImageConfig.MedicalServicesIcon/>&nbsp;&nbsp;Service
                                            </div>
                                            <div
                                                className="item-value">{details?.category_details?.name || 'N/A'} / {details?.service_details?.name || 'N/A'}</div>
                                        </div>

                                        <div className={'display-flex ts-justify-content-center pdd-left-80'}>
                                            <ChipComponent color={'success'}
                                                           label={bookType?.title}/>&nbsp;&nbsp;
                                            <ChipComponent color={'success'} label={details.duration + ' min'}/>
                                        </div>
                                    </div>
                                    <div className="details-body-block">
                                        <div className="details-body-item ts-justify-content-center ts-align-items-center">
                                            <div className="item-heading">
                                                <ImageConfig.AttachMoneyIcon/>&nbsp;&nbsp;Payment Status
                                            </div>
                                            <div className={"item-value"}>
                                                <ChipComponent size={'small'}
                                                               prefixIcon={details?.payment_status === 'paid' ?
                                                                   <ImageConfig.CircleCheck/> :
                                                                   <ImageConfig.CancelIcon/>}
                                                               label={details?.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
                                                               className={details?.payment_status === 'paid' ? 'paid' : 'unpaid'}/>
                                            </div>
                                        </div>
                                    </div>
                                    {/*<div className="details-body-block">*/}
                                    {/*    <div className="details-body-item">*/}
                                    {/*        <div className="item-heading"><ImageConfig.CalendarIcon/>&nbsp;Appointment Status*/}
                                    {/*        </div>*/}
                                    {/*        <div className={"item-value"}>*/}
                                    {/*            <ChipComponent label={details?.status}*/}
                                    {/*                           className={details?.status}*/}
                                    {/*            />*/}
                                    {/*        </div>*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}
                                </div>
                            </div>
                        </div>
                        {/*<div className="details-box-bottom">*/}
                        {/*    <div className="details-header">*/}
                        {/*        <div className={'form-heading'}>*/}
                        {/*            Forms*/}
                        {/*        </div>*/}
                        {/*        <div className={'status-heading'}>*/}
                        {/*            Status*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*    <div className="details-body">*/}
                        {/*        <div className="details-body-block-bottom">*/}
                        {/*            {formStatus && formStatus.map((value, index) => {*/}
                        {/*                return (<div key={'item-' + index} className="details-body-item">*/}
                        {/*                    <div className="item-heading">{value.name}</div>*/}
                        {/*                    <div*/}
                        {/*                        className={"item-value " + ((value.status === 'Completed' || value.status === 'completed') ? 'green' : 'red')}>{value.status}*/}
                        {/*                    </div>*/}
                        {/*                </div>)*/}
                        {/*            })}*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}


                        <div className="client-search-btn">
                            {details && details.status === 'scheduled' && <ButtonComponent
                                fullWidth={true}
                                onClick={
                                    () => {
                                        if (details.payment_status === 'unpaid') {
                                            setStep('payment');
                                        } else {
                                            onCheckIn();
                                        }
                                    }
                                }
                            >{details.payment_status === 'unpaid' ? 'Update Payment Status' : 'Check In'}</ButtonComponent>
                            }
                        </div>

                    </div>
                }
                {
                    step === 'checkin' &&
                    <>
                        <div className="flex-1 checkin-confirmation-status">
                            <div className="checkin-confirmation-status-icon"
                            >
                                <ImageConfig.VerifiedCheck width={120}/>

                            </div>
                            <div className="checkin-confirmation-status-text">
                                Check In Successful!
                            </div>
                        </div>
                        <div className="action-buttons">
                            <ButtonComponent fullWidth={true}
                                             onClick={event => {
                                                 if (onComplete) {
                                                     onComplete();
                                                 }
                                             }}>Close</ButtonComponent>
                        </div>
                    </>
                }
                {
                    step === 'payment' &&
                    <AppointmentPaymentComponent onComplete={values => {
                        onCheckIn()
                    }} details={details} onBack={onBack}
                                                 onClose={onClose}
                    />
                }
                {
                    step === 'noshow' &&
                    <AppointmentNoShowComponent onComplete={onComplete} details={details} onBack={onBack}
                                                onClose={onClose}
                    />
                }
                {
                    step === 'cancel' &&
                    <AppointmentCancelComponent onComplete={onComplete} onBack={onBack} details={details}
                                                onClose={onClose}
                    />
                }
                {
                    step === 'reschedule' &&
                    <AppointmentRescheduleComponent onComplete={onComplete} onBack={onBack} details={details}
                                                    onClose={onClose}
                    />
                }
            </>}
        </div>
    );
};

export default AppointmentDetailsComponent;
