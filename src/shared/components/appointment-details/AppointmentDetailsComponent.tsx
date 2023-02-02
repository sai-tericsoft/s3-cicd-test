import React, {useCallback, useEffect, useState} from "react";
import "./AppointmentDetailsComponent.scss";
import {CommonService} from "../../services";
import {IAPIResponseType} from "../../models/api.model";
import ToolTipComponent from "../tool-tip/ToolTipComponent";
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
// import BookAppointmentFormComponent from "./appointment-details-form/BookAppointmentFormComponent";
// import BookAppointmentOverviewComponent from "./appointment-details-overview/BookAppointmentOverviewComponent";
// import BookAppointmentPaymentComponent from "./-payment/BookAppointmentPaymentComponent";

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
        () => {
            CommonService._appointment.appointmentCheckin(appointment_id, {})
                .then((response: IAPIResponseType<any>) => {
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
                            <div className="drawer-title">Appointment Details</div>
                            <ToolTipComponent tooltip={"Close"} position={"left"}>
                                <div className="drawer-close"
                                     id={'book-appointment-close-btn'}
                                     onClick={(event) => {
                                         // if (onClose) {
                                         //     onClose();
                                         // }
                                     }
                                     }><ImageConfig.CloseIcon/></div>
                            </ToolTipComponent>
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
                                <div className="block-content">
                                    <MenuDropdownComponent menuBase={
                                        <ButtonComponent size={'large'} variant={'outlined'} fullWidth={true}>
                                            Select Action &nbsp;<ImageConfig.SelectDropDownIcon/>
                                        </ButtonComponent>
                                    } menuOptions={
                                        [
                                            <ListItem onClick={onReschedule}>Reschedule Appointment</ListItem>,
                                            <ListItem onClick={onNoShow}>No Show</ListItem>,
                                            <ListItem onClick={onCancelAppointment}>Cancel Appointment</ListItem>
                                        ]
                                    }
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="details-box">
                                <div className="details-header">Other Details</div>
                                <div className="details-body">
                                    <div className="details-body-block">
                                        <div className="details-body-item">
                                            <div className="item-heading"><ImageConfig.PersonIcon/>&nbsp;Client Name</div>
                                            <div
                                                className="item-value">{details?.client_details?.first_name + ' ' + details?.client_details?.last_name}</div>
                                        </div>
                                        <div className="details-body-item">
                                            <div className="item-heading"><ImageConfig.CallIcon/>&nbsp;Phone Number</div>
                                            <div
                                                className="item-value">{details?.client_details?.primary_contact_info?.phone ? CommonService.formatPhoneNumber(details?.client_details?.primary_contact_info?.phone) : 'N/A'}</div>
                                        </div>
                                        <div className="details-body-item">
                                            <div className="item-heading"><ImageConfig.EmailIcon/>&nbsp;Email</div>
                                            <div
                                                className="item-value">{details?.client_details?.primary_email || 'N/A'}</div>
                                        </div>
                                    </div>
                                    <div className="details-body-block">
                                        <div className="details-body-item">
                                            <div className="item-heading"><ImageConfig.AssignmentIcon/>&nbsp;Provider Name
                                            </div>
                                            <div
                                                className="item-value">
                                                <div className="mrg-bottom-10">
                                                    {details?.provider_details?.first_name + ' ' + details?.provider_details?.last_name}
                                                </div>
                                                <div className="d-inline">
                                                    <ChipComponent color={'success'} label={bookType?.title}/>&nbsp;
                                                    <ChipComponent color={'success'} label={details.duration + ' min'}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="details-body-block">
                                        <div className="details-body-item">
                                            <div className="item-heading"><ImageConfig.MedicalServicesIcon/>&nbsp;Service
                                            </div>
                                            <div
                                                className="item-value">{details?.category_details?.name || 'N/A'} / {details?.service_details?.name || 'N/A'}</div>
                                        </div>
                                    </div>
                                    <div className="details-body-block">
                                        <div className="details-body-item">
                                            <div className="item-heading"><ImageConfig.AttachMoneyIcon/>&nbsp;Payment Status
                                            </div>
                                            <div className={"item-value"}>
                                                <ChipComponent size={'small'}
                                                               prefixIcon={details?.payment_status === 'paid' ?
                                                                   <ImageConfig.CircleCheck/> : <ImageConfig.CancelIcon/>}
                                                               label={details?.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
                                                               color={(details?.payment_status === 'paid' ? 'success' : 'error')}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="details-box">
                                <div className="details-header">Forms</div>
                                <div className="details-body">
                                    <div className="details-body-block">
                                        {formStatus && formStatus.map((value, index) => {
                                            return (<div key={'item-' + index} className="details-body-item">
                                                <div className="item-heading">{value.name}</div>
                                                <div
                                                    className={"item-value " + ((value.status === 'Completed' || value.status === 'completed') ? 'green' : 'red')}>{value.status}
                                                </div>
                                            </div>)
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="client-search-btn">
                            {details && details.status === 'scheduled' && <ButtonComponent fullWidth={true}
                                                                                           onClick={event => {
                                                                                               onCheckIn();
                                                                                           }}
                            >Checkin</ButtonComponent>}
                        </div>

                    </div>
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
