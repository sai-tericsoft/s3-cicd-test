import React, {useCallback, useEffect, useState} from "react";
import "./BookAppointmentOverviewComponent.scss";
import {CommonService} from "../../../services";
import {IAPIResponseType} from "../../../models/api.model";
import ChipComponent from "../../chip/ChipComponent";
import AvatarComponent from "../../avatar/AvatarComponent";
import {ImageConfig} from "../../../../constants";
import ButtonComponent from "../../button/ButtonComponent";
import moment from "moment/moment";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";


interface BookAppointmentOverviewComponentProps {
    onClose?: () => void,
    onBack?: () => void,
    onComplete?: (values: any) => void,
    bookingDraft: any
}

const BookAppointmentOverviewComponent = (props: BookAppointmentOverviewComponentProps) => {
    const {onClose, onBack, onComplete, bookingDraft} = props;
    const {appointmentTypes} = useSelector((state: IRootReducerState) => state.staticData);
    const [isServiceLoading, setIsServiceLoading] = useState<boolean>(false);
    const [isBookingLoading, setIsBookingLoading] = useState<boolean>(false);
    const [serviceDetails, setServiceDetails] = useState<any | null>(null);
    const [bookType, setBookType] = useState<any | null>(null);


    const getServiceView = useCallback(
        (serviceId: string) => {
            setIsServiceLoading(true);
            setServiceDetails([]);
            CommonService._service.ServiceDetailsAPICall(serviceId)
                .then((response: IAPIResponseType<any>) => {
                    setServiceDetails(response.data);
                })
                .catch((error: any) => {
                    setServiceDetails(null);
                })
                .finally(() => {
                    setIsServiceLoading(false);
                })
        },
        [],
    );

    useEffect(() => {
        if (bookingDraft && bookingDraft.service) {
            getServiceView(bookingDraft.service._id);
        }
    }, [getServiceView, bookingDraft]);

    useEffect(() => {
        const type = appointmentTypes?.find(v => v.code === bookingDraft.appointment_type);
        setBookType(type);
    }, [appointmentTypes, bookingDraft]);


    const createBooking = useCallback(
        (booking: any) => {
            setIsBookingLoading(true)
            //medical_record_id
            const payload: any = {
                client_id: booking.client._id,
                category_id: booking.service_category._id,
                service_id: booking.service._id,
                provider_id: booking.provider.provider_id,
                appointment_type: booking.appointment_type,
                appointment_date: booking.date,
                duration: booking.duration,
                start_time: booking.time.start_min,
                end_time: booking.time.end_min,

            }
            CommonService._appointment.addAppointment(payload)
                .then((response: IAPIResponseType<any>) => {
                    if (onComplete) {
                        onComplete(response.data);
                    }
                })
                .catch((error: any) => {
                    // CommonService.handleErrors(errors);
                })
                .finally(() => {
                    setIsBookingLoading(true)
                })
        },
        [],
    );

    return (
        <div className={'book-appointment-overview-component'}>
            <div className="drawer-header">
                <div className="back-btn" onClick={onBack}><ImageConfig.LeftArrow/></div>
                <div className="drawer-title">Book Appointment</div>
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
            <div className="flex-1">
                <div className="mrg-bottom-20">
                    <div className="d-inline">
                        <ChipComponent color={'success'} label={bookType?.title}/>&nbsp;
                        <ChipComponent color={'success'} label={bookingDraft.duration + ' min'}/>
                    </div>
                </div>
                <div className="overview-block overview-services-block">
                    <div className="block-body">
                        <div className="avatar-wrapper">
                            {serviceDetails && <AvatarComponent type={'circle'} url={serviceDetails?.image?.url}/>}
                            {!serviceDetails && <AvatarComponent type={'circle'}/>}
                        </div>
                        <div className="block-content">
                            <div className="service-category-name">{bookingDraft.service_category.name}</div>
                            <div className="service-name">{bookingDraft.service.name}</div>
                        </div>
                    </div>
                </div>

                <div className="overview-block">
                    <div className="block-heading">
                        Client Details
                    </div>
                    <div className="block-body">
                        <div className="avatar-wrapper">
                            <AvatarComponent className={'blue-avatar'}
                                             title={bookingDraft.client.first_name + ' ' + bookingDraft.client.last_name}/>
                        </div>
                        <div className="block-content">
                            <div
                                className="content-title">{bookingDraft.client.first_name + ' ' + bookingDraft.client.last_name}</div>
                            <div
                                className="content-sub-title">{bookingDraft.client?.primary_contact_info?.phone && CommonService.formatPhoneNumber(bookingDraft.client?.primary_contact_info?.phone)}</div>
                        </div>
                    </div>
                </div>
                <div className="overview-block">
                    <div className="block-heading">
                        Provider:
                    </div>
                    <div className="block-body">
                        <div className="avatar-wrapper">
                            <AvatarComponent className={'green-avatar'} title={bookingDraft.provider.provider_name}/>
                        </div>
                        <div className="block-content">
                            <div className="content-title">{bookingDraft.provider.provider_name}</div>
                            <div className="content-sub-title">{bookingDraft.provider.role || '-'}</div>
                        </div>
                    </div>
                </div>

                <div className={'overview-block overview-block-time green-card'}>
                    <div className="block-heading">
                        Date and Time:
                    </div>
                    <div className="block-body ts-row pdd-top-20">
                        <div className="ts-col block-content">
                            <ImageConfig.CalendarIcon/>
                            <div className="content-title">{CommonService.convertDateFormat(bookingDraft.date)}</div>
                        </div>
                        <div className="ts-col block-content">
                            <ImageConfig.TimerIcon/>
                            <div
                                className="content-title">{moment(bookingDraft.time.start, 'hh:mm').format('hh:mm A')}</div>
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
