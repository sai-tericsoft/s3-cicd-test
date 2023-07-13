import React, {useCallback, useEffect, useRef, useState} from "react";
import "./AppointmentRescheduleComponent.scss";
import {ImageConfig} from "../../../../constants";
import {Field, FieldProps, Form, Formik, FormikHelpers, FormikProps} from "formik";
import * as Yup from "yup";
import FormikSelectComponent from "../../form-controls/formik-select/FormikSelectComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";
import ButtonComponent from "../../button/ButtonComponent";
import {CommonService} from "../../../services";
import {IAPIResponseType} from "../../../models/api.model";
import moment from "moment/moment";
import InputComponent from "../../form-controls/input/InputComponent";
import FormikDatePickerComponent from "../../form-controls/formik-date-picker/FormikDatePickerComponent";

interface AppointmentRescheduleComponentProps {
    onClose?: () => void,
    onBack?: () => void,
    onComplete?: (values: any) => void,
    details?: any,
}

const addAppointmentRescheduleInitialValues: any = {
    provider: '',
    facility: '',
    date: '',
    time: '',
};


const addAppointmentRescheduleValidationSchema = Yup.object().shape({
    provider: Yup.mixed().required("Provider is required"),
    facility: Yup.mixed().required("Facility is required"),
    date: Yup.mixed().required("Appointment date is required"),
    time: Yup.mixed().required("Appointment time is required"),
});

const AppointmentRescheduleComponent = (props: AppointmentRescheduleComponentProps) => {
    const {onClose, onComplete, details} = props;

    const {appointmentTypes} = useSelector((state: IRootReducerState) => state.staticData);
    const [bookType, setBookType] = useState<any | null>(null);
    const [availableDates, setAvailableDates] = useState<any[] | null>(null);
    const [availableRawTimes, setAvailableRawTimes] = useState<any[] | null>(null);
    const [availableTimeSlots, setAvailableTimeSlots] = useState<any[] | null>(null);
    const [serviceProvidersList, setServiceProvidersList] = useState<any[] | null>(null);
    const [isDatesListLoading, setIsDatesListLoading] = useState<boolean>(false);
    const [isTimesListLoading, setIsTimesListLoading] = useState<boolean>(false);
    const [isProviderListLoading, setIsProviderListLoading] = useState<boolean>(false);
    const [isAPICallRunning, setIsAPICallRunning] = useState<boolean>(false);
    const [step, setStep] = useState<'form' | 'overview' | 'confirm'>('form');
    const [reschedule, setReschedule] = useState<any | null>(null);
    const formRef = useRef<FormikProps<any>>(null);
    const [isFacilityListLoading, setIsFacilityListLoading] = useState<boolean>(false);
    const [facilityList, setFacilityList] = useState<any[]>([]);


    useEffect(() => {
        if (details) {
            const type = appointmentTypes?.find(v => v.code === details.appointment_type);
            setBookType(type);
        }
    }, [appointmentTypes, details]);


    const getAvailableDatesList = useCallback(
        (providerId: string, serviceId: string, facilityId: string) => {
            setIsDatesListLoading(true);
            setAvailableDates([]);
            const payload = {
                service_id: serviceId,
                facility_id: facilityId
            }
            CommonService._user.getUserAvailableDatesList(providerId, payload)
                .then((response: IAPIResponseType<any>) => {
                    setAvailableDates(response.data || []);
                })
                .catch((error: any) => {
                    setAvailableDates([]);
                })
                .finally(() => {
                    setIsDatesListLoading(false);
                })
        },
        [],
    );

    const getProviderFacilityList = useCallback(
        (serviceId: string, providerId: string) => {
            setIsFacilityListLoading(true);
            setFacilityList([]);
            CommonService._facility.providerFacilityList(serviceId, providerId, {})
                .then((response: IAPIResponseType<any>) => {
                    setFacilityList(response.data || []);

                    const data = response.data

                    const facility = data.find((v: any) => v._id === details.facility_id)

                    if (facility) {
                        console.log(facility, data);
                        formRef.current?.setFieldValue('facility', facility);
                        setAvailableRawTimes([]);
                        setAvailableDates([]);
                        getAvailableDatesList(providerId, serviceId, facility._id);
                    }
                })
                .catch((error: any) => {
                    setFacilityList([]);
                })
                .finally(() => {
                    setIsFacilityListLoading(false);
                })
        },
        [details, getAvailableDatesList],
    );

    const breakupTimeSlots = useCallback(
        (time: any, duration: number) => {
            const totalMinutes = time.start_time;
            let timeInMinutes = time.start_time;
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            let startTime = moment(hours + ':' + minutes, "hh:mm");
            let endTime = startTime.clone().add(time.end_time - time.start_time, 'minutes');
            let allTimes = [];
            while (startTime < endTime) {
                //Push times
                const slotStart = startTime.format("HH:mm");
                startTime.add(duration, 'minutes');
                allTimes.push({
                    start: slotStart,
                    start_min: timeInMinutes,
                    end_min: timeInMinutes + duration,
                    end: startTime.format("HH:mm")
                });
                timeInMinutes = timeInMinutes + duration;
            }
            // console.log(time, allTimes, duration);
            return allTimes;
        },
        [],
    );
    const generateTimeSlots = useCallback(
        (times: any[], duration = undefined) => {
            if (duration) {
                const slots: any[] = [];
                times.forEach(value => {
                    const slot = breakupTimeSlots(value, parseInt(duration || ''));
                    slots.push(...slot);
                })
                setAvailableTimeSlots(slots);
            }

        },
        [breakupTimeSlots],
    );

    const getAvailableTimesList = useCallback(
        (providerId: string, date: any, serviceId: string, facilityId: string, duration: string) => {
            setIsTimesListLoading(true);
            setAvailableRawTimes([]);
            const payload = {
                available_on: CommonService.convertDateFormat(date, 'YYYY-MM-DD'),
                service_id: serviceId,
                facility_id: facilityId,
                duration: duration
            }
            CommonService._user.getUserAvailableTimesList(providerId, payload)
                .then((response: IAPIResponseType<any>) => {
                    setAvailableRawTimes(response.data || []);
                })
                .catch((error: any) => {
                    setAvailableRawTimes([]);
                })
                .finally(() => {
                    setIsTimesListLoading(false);
                })
        },
        [],
    );

    useEffect(() => {
        if (availableRawTimes && details) {
            generateTimeSlots(availableRawTimes, details.duration);
        } else {

        }
    }, [generateTimeSlots, details, availableRawTimes]);


    const getServiceProviderList = useCallback(
        (serviceId: string, details: any) => {
            setIsProviderListLoading(true);
            setServiceProvidersList([]);
            CommonService._service.ServiceProviderListAPICall(serviceId, {})
                .then((response: IAPIResponseType<any>) => {
                    const data = response.data;
                    setServiceProvidersList(data);
                    const provider = data.find((v: any) => v._id === details.provider_id)
                    if (provider) {
                        console.log(provider, data);
                        formRef.current?.setFieldValue('provider', provider);
                        setAvailableRawTimes([]);
                        getProviderFacilityList(serviceId, provider._id);
                    }
                })
                .catch((error: any) => {
                    setServiceProvidersList([]);
                })
                .finally(() => {
                    setIsProviderListLoading(false);
                })
        },
        [getProviderFacilityList],
    );

    const onSubmitAppointment = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
            console.log(values, 'setReschedule')
            setReschedule(values);
            setStep('overview');
        },
        [],
    );


    useEffect(() => {
        if (details) {
            getServiceProviderList(details?.service_id, details);
        }
        setAvailableRawTimes([]);
        setAvailableDates([]);
    }, [details, getServiceProviderList]);

    const onReschedule = useCallback((rawPayload: any) => {
        setIsAPICallRunning(true)
        const payload = {
            "appointment_date": CommonService.convertDateFormat(rawPayload.date),
            "start_time": rawPayload.time.start_min,
            "end_time": rawPayload.time.end_min,
            "provider_id": rawPayload.provider._id,
            "facility_id": rawPayload.facility._id
        }
        //medical_record_id
        CommonService._appointment.appointmentReschedule(details._id, payload)
            .then((response: IAPIResponseType<any>) => {
                setStep('confirm');
                CommonService._alert.showToast(response.message || 'Marked appointment as No Show')
            })
            .catch((error: any) => {
                CommonService._alert.showToast(error.error || "Appointment rescheduling cannot be done within 24 hours", "error");
            })
            .finally(() => {
                setIsAPICallRunning(false)
            })
    }, [details])

    return (
        <div className={`book-appointment-reschedule-component`}>
            {step === 'form' && <>
                <div className="drawer-header">
                    {/*<div className="back-btn" onClick={onBack}><ImageConfig.LeftArrow/></div>*/}
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
                <div className="reschedule-appointment-heading">Reschedule Appointment</div>
                <div className={'appointment-form-wrapper'}>
                    <Formik
                        innerRef={formRef}
                        validationSchema={addAppointmentRescheduleValidationSchema}
                        initialValues={addAppointmentRescheduleInitialValues}
                        onSubmit={onSubmitAppointment}
                        validateOnChange={false}
                        validateOnBlur={true}
                        enableReinitialize={true}
                        validateOnMount={true}>
                        {
                            ({values, isValid, errors, setFieldValue, validateForm}) => {
                                // eslint-disable-next-line react-hooks/rules-of-hooks
                                useEffect(() => {
                                    validateForm();
                                }, [validateForm, values]);
                                return (
                                    <Form className="t-form" noValidate={true}>
                                        <div className={"t-appointment-drawer-form-controls"}>
                                            <InputComponent label={'Client'} disabled={true}
                                                            value={details?.client_details?.first_name + ' ' + details?.client_details?.last_name}/>


                                            <InputComponent label={'Service Category'} disabled={true}
                                                            value={details?.category_details?.name}/>
                                            <InputComponent label={'Service'} disabled={true}
                                                            value={details?.service_details?.name}/>

                                            <InputComponent label={'Appointment Type'} disabled={true}
                                                            value={bookType?.title}/>


                                            <InputComponent label={'Duration'} disabled={true}
                                                            value={details?.duration}/>


                                            <Field name={'provider'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikSelectComponent
                                                            formikField={field}
                                                            required={true}
                                                            disabled={isProviderListLoading}
                                                            options={serviceProvidersList || []}
                                                            displayWith={(option: any) => option?.provider_name || 'No Name'}
                                                            valueExtractor={(option: any) => option}
                                                            onUpdate={value => {
                                                                if (value) {
                                                                    getProviderFacilityList(details.service_id, value?._id);
                                                                }
                                                            }}
                                                            label={'Provider'}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>

                                            <Field name={'facility'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikSelectComponent
                                                            formikField={field}
                                                            required={true}
                                                            disabled={isFacilityListLoading || !values.provider}
                                                            options={facilityList || []}
                                                            displayWith={(option: any) => option?.name || 'No Facility'}
                                                            valueExtractor={(option: any) => option}
                                                            label={'Facility'}
                                                            onUpdate={value => {
                                                                if (value) {
                                                                    console.log(value);
                                                                    console.log(values);

                                                                    setAvailableRawTimes([]);
                                                                    setAvailableDates([]);
                                                                    getAvailableDatesList(values?.provider?._id, details.service_id, value._id);
                                                                }
                                                            }}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>

                                            <div className="ts-row">

                                                <div className="ts-col">
                                                    <Field name={'date'}>
                                                        {
                                                            (field: FieldProps) => (
                                                                <FormikDatePickerComponent
                                                                    label={'Date'}
                                                                    placeholder={'Date'}
                                                                    disabled={isDatesListLoading || !values?.facility}
                                                                    formikField={field}
                                                                    required={true}
                                                                    fullWidth={true}
                                                                    enableDates={availableDates || []}
                                                                    onUpdate={(value: any) => {
                                                                        console.log(value);
                                                                        if (value) {
                                                                            getAvailableTimesList(values.provider?._id, value, details.service_id, values.facility?._id, details.duration);
                                                                        }
                                                                    }}
                                                                />
                                                            )
                                                        }
                                                    </Field>
                                                </div>
                                                <div className="ts-col">
                                                    <Field name={'time'}>
                                                        {
                                                            (field: FieldProps) => (
                                                                <FormikSelectComponent
                                                                    formikField={field}
                                                                    required={true}
                                                                    disabled={isTimesListLoading}
                                                                    options={availableTimeSlots || []}
                                                                    displayWith={(option: any) => option.start + ' - ' + option.end}
                                                                    valueExtractor={(option: any) => option}
                                                                    label={'Time'}
                                                                    fullWidth={true}
                                                                />
                                                            )
                                                        }
                                                    </Field>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="booking-form-action">
                                            <ButtonComponent fullWidth={true} type={'submit'}>Next</ButtonComponent>
                                        </div>
                                    </Form>
                                )
                            }
                        }
                    </Formik>
                </div>
            </>}

            {step === 'overview' && <>
                <div className="drawer-header">
                    {/*<div className="back-btn" onClick={onBack}><ImageConfig.LeftArrow/></div>*/}
                    {/*<div className="drawer-title">Reschedule Appointment</div>*/}
                    {/*<FormControlLabelComponent label={'Reschedule Appointment'} size={'lg'}/>*/}
                    {/*<ToolTipComponent tooltip={"Close"} position={"left"}>*/}
                    {/*    <div className="drawer-close"*/}
                    {/*         id={'appintment-details-close-btn'}*/}
                    {/*         onClick={(event) => {*/}
                    {/*             if (onClose) {*/}
                    {/*                 onClose();*/}
                    {/*             }*/}
                    {/*         }*/}
                    {/*         }><ImageConfig.CloseIcon/></div>*/}
                    {/*</ToolTipComponent>*/}
                </div>
                <div className="flex-1 booking-confirmation-status">
                    <div className="booking-confirmation-status-icon"
                         style={{backgroundImage: 'url(' + ImageConfig.AppointmentConfirm + ')'}}>
                        <ImageConfig.VerifiedCheck width={24}/>
                    </div>
                    <div className="booking-confirmation-status-text">
                        Do you want to Reschedule the appointment
                        with <b>{reschedule.provider?.provider_name}</b> on <b>{CommonService.convertDateFormat(reschedule.date)}</b> at&nbsp;
                        <b>{CommonService.getHoursAndMinutesFromMinutes(reschedule.time.start_min)}</b>?
                    </div>
                </div>
                <div className="action-buttons">
                    <ButtonComponent fullWidth={true} variant={'outlined'}
                                     disabled={isAPICallRunning}
                                     onClick={event => {
                                         if (onClose) {
                                             onClose()
                                         }
                                     }}>No</ButtonComponent>
                    <ButtonComponent fullWidth={true}
                                     isLoading={isAPICallRunning}
                                     onClick={event => {
                                         onReschedule(reschedule)
                                     }}>Yes</ButtonComponent>
                </div>
            </>}
            {step === 'confirm' && <>
                <div className="flex-1 booking-confirmation-status">
                    <div className="booking-confirmation-status-icon"
                         style={{backgroundImage: 'url(' + ImageConfig.AppointmentConfirm + ')'}}>
                        <ImageConfig.VerifiedCheck width={24}/>
                    </div>
                    <div className="booking-confirmation-status-text">
                        Booking Rescheduled!
                    </div>
                </div>
                <div className="action-buttons">
                    <ButtonComponent fullWidth={true}
                                     onClick={event => {
                                         if (onComplete) {
                                             onComplete({});
                                         }
                                     }}>Close</ButtonComponent>
                </div>
            </>}

        </div>
    );
};

export default AppointmentRescheduleComponent;
