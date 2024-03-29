import React, {useCallback, useEffect, useState} from "react";
import "./BookAppointmentOverviewComponent.scss";
import {CommonService} from "../../../services";
import {ImageConfig} from "../../../../constants";
import ButtonComponent from "../../button/ButtonComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";
import {IAPIResponseType} from "../../../models/api.model";
import commonService from "../../../services/common.service";
import FormControlLabelComponent from "../../form-control-label/FormControlLabelComponent";


interface BookAppointmentOverviewComponentProps {
    onClose?: () => void,
    onBack?: () => void,
    onComplete?: (values: any) => void,
    bookingDraft: any
}

const BookAppointmentOverviewComponent = (props: BookAppointmentOverviewComponentProps) => {
    const {onComplete, bookingDraft, onBack, onClose} = props;
    const {appointmentTypes} = useSelector((state: IRootReducerState) => state.staticData);
    // const [serviceDetails, setServiceDetails] = useState<any | null>(null);
    const [bookType, setBookType] = useState<any | null>(null);
    const [isBookingLoading, setIsBookingLoading] = useState<boolean>(false);


    // const getServiceView = useCallback(
    //     (serviceId: string) => {
    //         setServiceDetails([]);
    //         CommonService._service.ServiceDetailsAPICall(serviceId)
    //             .then((response: IAPIResponseType<any>) => {
    //                 setServiceDetails(response.data);
    //             })
    //             .catch((error: any) => {
    //                 setServiceDetails(null);
    //             });
    //     },
    //     [],
    // );

    // useEffect(() => {
    //     if (bookingDraft && bookingDraft.service) {
    //         getServiceView(bookingDraft.service._id);
    //     }
    // }, [getServiceView, bookingDraft]);

    useEffect(() => {
        const type = appointmentTypes?.find(v => v.code === bookingDraft.appointment_type);
        setBookType(type);
    }, [appointmentTypes, bookingDraft]);


    const createBooking = useCallback(
        (booking: any) => {
            //medical_record_id
            const payload: any = {
                client_id: booking.client._id,
                category_id: booking.service_category._id,
                service_id: booking.service._id,
                provider_id: booking.provider._id,
                facility_id: booking.facility._id,
                appointment_type: booking.appointment_type,
                consultation_id: booking.duration._id,
                appointment_date: CommonService.convertDateFormat(booking.date),
                duration: parseInt(booking.duration.duration),
                start_time: booking.time.start_min,
                end_time: booking.time.end_min,
                medical_record_id: booking.case._id,
            }
            setIsBookingLoading(true)
            CommonService._appointment.appointmentGetAmount(payload)
                .then((response: IAPIResponseType<any>) => {
                    if (onComplete) {
                        onComplete(response.data);
                    }
                })
                .catch((error: any) => {
                    // CommonService.handleErrors(errors);
                })
                .finally(() => {
                    setIsBookingLoading(false)
                })
        },
        [onComplete],
    );
    return (
        <div className={'book-appointment-overview-component'}>
            <div className="drawer-header">
                <div className="back-btn" onClick={onBack}>
                    <div><ImageConfig.LeftArrow/></div>
                    <div className={'back-text'}>Back</div>
                </div>
                {/*<ToolTipComponent tooltip={"Close"} position={"left"}>*/}
                <div className="drawer-close"
                     id={'book-appointment-close-btn'}
                     onClick={(event) => {
                         if (onClose) {
                             onClose();
                         }
                     }
                     }><ImageConfig.CloseIcon/></div>
                {/*</ToolTipComponent>*/}
            </div>
            <FormControlLabelComponent label={'Confirm Appointment Details'} size={'xl'}/>
            <div className="details-header">
                <div className="block-body">
                    <div className="block-content">
                        <ImageConfig.Calendar2Icon/>
                        <div
                            className="content-title">{CommonService.convertDateFormat2(bookingDraft?.date)}
                        </div>
                    </div>
                    <div className="block-content">
                        <ImageConfig.TimerIcon/>
                        <div
                            className="content-title">{CommonService.getHoursAndMinutesFromMinutes(bookingDraft.time.start_min)}
                        </div>
                    </div>
                    <div className="block-content">
                    </div>
                    <div className="block-content">
                    </div>
                </div>
            </div>
            <div className="flex-1">
                <div className="details-box">
                    <div className="details-header">Appointment Details</div>
                    <div className="details-body">
                        <div className="details-body-block">
                            <div className="details-body-item">
                                <div className="item-heading"><ImageConfig.PersonIcon/>&nbsp;&nbsp;Client Name</div>
                                <div
                                    className="item-value">
                                    <span className={bookingDraft?.client?.is_alias_name_set ? "alias-name" : ""}>
                                    {commonService.generateClientNameFromClientDetails(bookingDraft?.client)}</span>
                                </div>
                            </div>
                            <div className="details-body-item">
                                <div className="item-heading"><ImageConfig.CallIcon/>&nbsp;&nbsp;Phone Number</div>
                                <div
                                    className="item-value">{bookingDraft?.client?.primary_contact_info?.phone ? CommonService.formatPhoneNumber(bookingDraft?.client?.primary_contact_info?.phone) : 'N/A'}</div>
                            </div>
                            <div className="details-body-item">
                                <div className="item-heading"><ImageConfig.EmailIcon/>&nbsp;&nbsp;Email</div>
                                <div
                                    className="item-value">{bookingDraft?.client?.primary_email || 'N/A'}</div>
                            </div>
                        </div>
                        <div className="details-body-block">
                            <div className="details-body-item">
                                <div className="item-heading"><ImageConfig.AssignmentIcon/>&nbsp;&nbsp;Provider Name
                                </div>
                                <div
                                    className="item-value">
                                    <div>
                                        {bookingDraft?.provider?.first_name + ' ' + bookingDraft?.provider?.last_name}
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="details-body-block">
                            <div className="details-body-item">
                                <div className="item-heading"><ImageConfig.MedicalServicesIcon/>&nbsp;&nbsp;Service
                                </div>
                                <div
                                    className="item-value">
                                    {bookingDraft?.service_category?.name || 'N/A'} / {bookingDraft?.service?.name || 'N/A'}
                                </div>
                            </div>
                            <div className="details-body-item">
                                <div className="item-heading"><ImageConfig.Event2Icon/>&nbsp;&nbsp;Appointment
                                    Type
                                </div>
                                <div
                                    className="item-value">
                                    {bookType?.title || 'N/A'}
                                </div>
                            </div>
                            {bookingDraft?.appointment_type !== 'initial_consultation' &&
                                <div className="details-body-item">
                                    <div className="item-heading"><ImageConfig.FolderIcon/>&nbsp;&nbsp;Case Name
                                    </div>
                                    <div
                                        className="item-value">
                                        {CommonService.generateInterventionNameFromMedicalRecord(bookingDraft?.case) || 'N/A'}
                                        <div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>

                    </div>
                </div>
            </div>
            <div className="client-search-btn">
                <ButtonComponent fullWidth={true}
                                 isLoading={isBookingLoading}
                                 onClick={event => {
                                     createBooking(bookingDraft);
                                 }}>Proceed to Payment</ButtonComponent>
            </div>
        </div>
    );
};

export default BookAppointmentOverviewComponent;
