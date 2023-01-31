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

    const [step, setStep] = useState<'details' | 'payment' | 'checkout' | 'checkin' | 'reschedule' | 'cancel'>('details');
    const [details, setDetails] = useState<any | null>(null);
    const [isDetailsLoading, setIsDetailsLoading] = useState<boolean>(false);
    const [isDetailsLoaded, setIsDetailsLoaded] = useState<boolean>(false);

    useEffect(() => {
        if (details) {
            const type = appointmentTypes?.find(v => v.code === details.appointment_type);
            setBookType(type);
        }
    }, [appointmentTypes, details]);

    const getAppointmentDetails = useCallback(
        (appointment_id: string) => {
            // if (search === '') {
            //     setClientList([]);
            //     return;
            // }
            setIsDetailsLoading(true);
            CommonService._appointment.getAppointment(appointment_id)
                .then((response: IAPIResponseType<any>) => {
                    setDetails(response.data);
                })
                .catch((error: any) => {
                    setDetails(null);
                })
                .finally(() => {
                    setIsDetailsLoading(false);
                    setIsDetailsLoaded(true);
                })
        },
        [],
    );


    useEffect(() => {
        if (appointment_id) {
            getAppointmentDetails(appointment_id);
        }
    }, [getAppointmentDetails, appointment_id]);

    const onReschedule = useCallback(
        () => {

        },
        [],
    );
    const onCancelAppointment = useCallback(
        () => {

        },
        [],
    );
    const onNoShow = useCallback(
        () => {

        },
        [],
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
                                            <div className="item-value">{details?.client_details?.primary_email || 'N/A'}</div>
                                        </div>
                                    </div>
                                    <div className="details-body-block">
                                        <div className="details-body-item">
                                            <div className="item-heading"><ImageConfig.AssignmentIcon/>&nbsp;Provider Name</div>
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
                                            <div className="item-heading"><ImageConfig.MedicalServicesIcon/>&nbsp;Service</div>
                                            <div
                                                className="item-value">{details?.category_details?.name || 'N/A'} / {details?.service_details?.name || 'N/A'}</div>
                                        </div>
                                    </div>
                                    <div className="details-body-block">
                                        <div className="details-body-item">
                                            <div className="item-heading"><ImageConfig.AttachMoneyIcon/>&nbsp;Payment Status
                                            </div>
                                            <div className={"item-value "}>
                                                <ChipComponent size={'small'}
                                                               prefixIcon={details?.payment_status === 'completed' ?
                                                                   <ImageConfig.CircleCheck/> : <ImageConfig.CancelIcon/>}
                                                               label={details?.payment_status === 'completed' ? 'Paid' : 'Unpaid'}
                                                               color={(details?.payment_status === 'completed' ? 'success' : 'error')}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="details-box">
                                <div className="details-header">Forms</div>
                                <div className="details-body">
                                    <div className="details-body-block">
                                        <div className="details-body-item">
                                            <div className="item-heading">Client Details</div>
                                            <div
                                                className="item-value green">completed
                                            </div>
                                        </div>
                                        <div className="details-body-item">
                                            <div className="item-heading">Communication Preferences</div>
                                            <div
                                                className="item-value red">pending
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="client-search-btn">
                            <ButtonComponent fullWidth={true}
                                // isLoading={isBookingLoading}
                                // onClick={event => {
                                //     createBooking(bookingDraft);
                                // }}
                            >Checkin</ButtonComponent>
                        </div>

                    </div>
                }
                {/*{*/}
                {/*    step === 'form' &&*/}
                {/*    <BookAppointmentFormComponent client={selectedClient} onComplete={onFormComplete} onClose={onClose}/>*/}
                {/*}*/}
                {/*{*/}
                {/*    step === 'overview' && <>*/}
                {/*        <BookAppointmentOverviewComponent onBack={() => {*/}
                {/*            setStep('form');*/}
                {/*        }*/}
                {/*        } bookingDraft={bookingDraft} onClose={onClose}*/}
                {/*                                          onComplete={onOverviewComplete}/>*/}
                {/*    </>*/}
                {/*}*/}
                {/*{*/}
                {/*    step === 'payment' && <BookAppointmentPaymentComponent onBack={*/}
                {/*        () => {*/}
                {/*            setStep('form');*/}
                {/*        }*/}
                {/*    } booking={booking} onComplete={onPaymentComplete}/>*/}
                {/*}*/}
                {/*{*/}
                {/*    step === 'confirmation' && <div className={'booking-confirmation-wrapper'}>*/}
                {/*        <div className="booking-confirmation-status">*/}
                {/*            <div className="booking-confirmation-status-icon"*/}
                {/*                 style={{backgroundImage: 'url(' + ImageConfig.AppointmentConfirm + ')'}}>*/}
                {/*                <ImageConfig.VerifiedCheck width={24}/>*/}
                {/*            </div>*/}
                {/*            <div className="booking-confirmation-status-text">Booking Confirmed</div>*/}
                {/*        </div>*/}
                {/*        <div className="booking-confirmation-action">*/}
                {/*            <ButtonComponent fullWidth={true}*/}
                {/*                             onClick={*/}
                {/*                                 onComplete*/}
                {/*                             }>Close</ButtonComponent>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*}*/}
            </>}
        </div>
    );
};

export default AppointmentDetailsComponent;
