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
import LoaderComponent from "../../loader/LoaderComponent";
import commonService from "../../../services/common.service";
import momentTimezone from "moment-timezone";
import LottieFileGenerationComponent from "../../lottie-file-generation/LottieFileGenerationComponent";

interface AppointmentRescheduleComponentProps {
    onClose?: () => void,
    onBack?: () => void,
    onComplete?: (values: any) => void,
    details?: any,
}

const addAppointmentRescheduleInitialValues: any = {
    duration: '',
    provider: '',
    facility: '',
    date: '',
    time: '',
};


const addAppointmentRescheduleValidationSchema = Yup.object().shape({
    duration: Yup.mixed().required("Duration is required"),
    provider: Yup.mixed().required("Provider is required"),
    facility: Yup.mixed().required("Facility is required"),
    date: Yup.mixed().required("Appointment date is required"),
    time: Yup.mixed().required("Appointment time is required"),
});

const AppointmentRescheduleComponent = (props: AppointmentRescheduleComponentProps) => {
    const { onComplete, details,onBack} = props;

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
    const [durationList, setDurationList] = useState<any | null>(null);
    const today = moment();
    const nextThreeMonths = moment().add(3, 'months');

    const getServicesInfo = useCallback((serviceId: string) => {
        CommonService._service.ServiceDetailsAPICall(serviceId)
            .then((response: IAPIResponseType<any>) => {
                const data: any = response.data;

                const finalData: any = {}
                appointmentTypes?.forEach(value => {
                    if (!finalData.hasOwnProperty(value.code)) {
                        finalData[value.code] = [];
                    }

                    if (data && data.hasOwnProperty(value.code)) {
                        (data[value.code] || []).forEach((group: any) => {
                            if (group && group.hasOwnProperty('consultation_details')) {
                                (group.consultation_details || []).forEach((duration: any) => {
                                    finalData[value.code].push(
                                        {
                                            consultation_title: group.title,
                                            duration: parseInt(duration.duration || 0),
                                            _id: group.id,
                                            title: group.title ? group.title + ' - ' + duration.duration + ' min' : (duration.duration || '-') + ' min',
                                            code: group.title ? group.title + ':' + duration.duration : duration.duration
                                        }
                                    )
                                })
                            }
                        })
                    }
                })

                if (details.duration && finalData[details?.appointment_type].length > 0) {
                    const selectedDuration = finalData[details?.appointment_type]?.find((value: any) => value.duration === details.duration);
                    if (selectedDuration) {
                        formRef.current && formRef.current.setFieldValue('duration', selectedDuration);
                    }
                }
                setDurationList(finalData);
            })
            .catch((error: any) => {

            })
            .finally(() => {

            })
    }, [appointmentTypes, details]);


    useEffect(() => {
        if (details) {
            const type = appointmentTypes?.find(v => v.code === details.appointment_type);
            setBookType(type);
        }
    }, [appointmentTypes, details]);

    useEffect(() => {
        if (details.service_id) {
            getServicesInfo(details.service_id);
        }
    }, [getServicesInfo, details]);

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
        (times: any[], duration: string) => {
            console.log(times, duration);
            duration = duration || formRef.current?.values.duration.duration;
            const date = new Date(formRef.current?.values.date);
            console.log(date, duration, times);
            if (duration && times) {
                const slots: any[] = [];
                const currentDate = new Date(); // Get the current date and time
                const currentTimeStamp = currentDate.getHours() * 60 + currentDate.getMinutes();
                times.forEach(value => {
                    const slot = breakupTimeSlots(value, parseInt(duration || ''));
                    if (date.getDate() === currentDate.getDate()) { // Check if the date is equal to the current date
                        const filteredSlots = slot.filter((timeSlot: any) => {
                            return timeSlot.end_min >= currentTimeStamp;
                        });
                        slots.push(...filteredSlots);
                    } else {
                        slots.push(...slot);
                    }
                });
                console.log(slots);
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
                duration: duration,
                timezone: momentTimezone.tz.guess(),
            }
            CommonService._user.getUserAvailableTimesList(providerId, payload)
                .then((response: IAPIResponseType<any>) => {
                    setAvailableRawTimes(response.data || []);
                    // const timesObj = {
                    //     start_time: details.start_time,
                    //     end_time: details.end_time
                    // };
                    // const slot = breakupTimeSlots(timesObj, parseInt(duration || ''));
                    // console.log(slot);
                    // formRef.current && formRef.current.setFieldValue('time', slot[0]);
                    generateTimeSlots(response.data, duration);
                })
                .catch((error: any) => {
                    setAvailableRawTimes([]);
                })
                .finally(() => {
                    setIsTimesListLoading(false);
                })
        },
        [generateTimeSlots],
    );

    const getAvailableDatesList = useCallback(
        (providerId: string, serviceId: string, facilityId: string, duration?: any) => {
            setIsDatesListLoading(true);
            setAvailableDates([]);
            const payload = {
                service_id: serviceId,
                facility_id: facilityId,
                duration: duration?.duration
            }
            CommonService._user.getUserAvailableDatesList(providerId, payload)
                .then((response: IAPIResponseType<any>) => {
                    const availableData: any = response.data;
                    setAvailableDates(response.data || []);
                    const date = CommonService.convertDateFormat(details?.appointment_date, 'YYYY-MM-DD');
                    if (date && availableData) {
                        const selectedDate = (availableData || []).find((value: any) => value === date);
                        if (selectedDate) {
                            formRef.current && formRef.current.setFieldValue('date', selectedDate);
                            const values = formRef.current?.values;
                            getAvailableTimesList(values.provider?._id, selectedDate, details.service_id, values.facility?._id, values.duration.duration);
                        }
                    }
                })
                .catch((error: any) => {
                    setAvailableDates([]);
                })
                .finally(() => {
                    setIsDatesListLoading(false);
                })
        },
        [details, getAvailableTimesList],
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
                        formRef.current?.setFieldValue('facility', facility);
                        setAvailableRawTimes([]);
                        setAvailableDates([]);
                        getAvailableDatesList(providerId, serviceId, facility._id, formRef.current?.values.duration);
                    }
                })
                .catch((error: any) => {
                    setFacilityList([]);
                })
                .finally(() => {
                    setIsFacilityListLoading(false);
                })
        },
        [details, getAvailableDatesList, formRef],
    );


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
    }, [details, getServiceProviderList, formRef]);


    const onReschedule = useCallback((rawPayload: any) => {
        setIsAPICallRunning(true)
        const payload = {
            "appointment_date": CommonService.convertDateFormat(rawPayload.date),
            "start_time": rawPayload.time.start_min,
            "end_time": rawPayload.time.end_min,
            "provider_id": rawPayload.provider._id,
            "facility_id": rawPayload.facility._id,
            "duration": rawPayload.duration.duration,
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
            {
                (isFacilityListLoading || isProviderListLoading) && <LoaderComponent/>
            }
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
                            ({values, isValid, errors, setFieldValue, setFieldTouched, validateForm}) => {
                                // eslint-disable-next-line react-hooks/rules-of-hooks
                                useEffect(() => {
                                    validateForm();
                                }, [validateForm, values]);
                                return (
                                    <Form className="t-form" noValidate={true}>
                                        <div className={"t-appointment-drawer-form-controls"}>
                                            <InputComponent label={'Client'} disabled={true}
                                                            value={commonService.generateClientNameFromClientDetails(details?.client_details)}/>


                                            <InputComponent label={'Service Category'} disabled={true}
                                                            value={details?.category_details?.name}/>
                                            <InputComponent label={'Service'} disabled={true}
                                                            value={details?.service_details?.name}/>

                                            <InputComponent label={'Appointment Type'} disabled={true}
                                                            value={bookType?.title}/>

                                            <Field name={'duration'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikSelectComponent
                                                            formikField={field}
                                                            required={true}
                                                            disabled={((durationList && durationList[details?.appointment_type]) || []).length === 0}
                                                            options={(durationList && durationList[details?.appointment_type]) || null}
                                                            displayWith={(option: any) => (option.title)}
                                                            valueExtractor={(option: any) => option}
                                                            label={'Duration'}
                                                            fullWidth={true}
                                                            onUpdate={value => {
                                                                if (value && availableRawTimes) {
                                                                    setFieldValue('provider', undefined);
                                                                    setFieldTouched('provider', false);
                                                                    setFieldValue('facility', undefined);
                                                                    setFieldTouched('facility', false);
                                                                    setFieldValue('date', undefined);
                                                                    setFieldTouched('date', false);
                                                                    setFieldValue('time', undefined);
                                                                    setFieldTouched('time', false);
                                                                }
                                                            }}
                                                        />
                                                    )
                                                }
                                            </Field>

                                            <Field name={'provider'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikSelectComponent
                                                            formikField={field}
                                                            required={true}
                                                            disabled={isProviderListLoading}
                                                            options={serviceProvidersList || []}
                                                            displayWith={(option: any) => option?.first_name + ' ' + option?.last_name || 'No Name'}
                                                            valueExtractor={(option: any) => option}
                                                            onUpdate={value => {
                                                                if (value) {
                                                                    getProviderFacilityList(details?.service_id, value?._id);
                                                                    setFieldValue('facility', undefined);
                                                                    setFieldTouched('facility', false);
                                                                    setFieldValue('date', undefined);
                                                                    setFieldTouched('date', false);
                                                                    setFieldValue('time', undefined);
                                                                    setFieldTouched('time', false);
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
                                                            disabled={isFacilityListLoading}
                                                            options={facilityList || []}
                                                            displayWith={(option: any) => option?.name || 'No Facility'}
                                                            valueExtractor={(option: any) => option}
                                                            label={'Facility'}
                                                            onUpdate={value => {
                                                                if (value) {
                                                                    setAvailableRawTimes([]);
                                                                    setAvailableDates([]);
                                                                    setFieldValue('date', undefined);
                                                                    setFieldTouched('date', false);
                                                                    setFieldValue('time', undefined);
                                                                    setFieldTouched('time', false);
                                                                    getAvailableDatesList(values.provider._id, details?.service_id, value._id, values.duration);
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
                                                                    placeholder={'MM/DD/YYYY'}
                                                                    disabled={isDatesListLoading}
                                                                    formikField={field}
                                                                    required={true}
                                                                    fullWidth={true}
                                                                    minDate={today}
                                                                    maxDate={nextThreeMonths}
                                                                    enableDates={availableDates || []}
                                                                    onUpdate={(value: any) => {
                                                                        if (value) {
                                                                            getAvailableTimesList(values.provider?._id, value, details.service_id, values.facility?._id, values.duration.duration);
                                                                            setFieldValue('time', undefined);
                                                                            setFieldTouched('time', false);
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
                                                                    disabled={isTimesListLoading || !values?.date}
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
                    {/*<div className="booking-confirmation-status-icon"*/}
                    {/*     style={{backgroundImage: 'url(' + ImageConfig.AppointmentConfirm + ')'}}>*/}
                    {/*    <ImageConfig.VerifiedCheck width={24}/>*/}
                    {/*</div>*/}
                    <div className="booking-confirmation-status-text">
                        Are you sure with rescheduling the appointment
                        with <b>{reschedule.provider?.first_name}&nbsp;{reschedule.provider?.last_name}</b> on <b>{CommonService.convertDateFormat2(reschedule.date)}</b> at&nbsp;
                        <b>{CommonService.getHoursAndMinutesFromMinutes(reschedule.time.start_min)}</b>?
                    </div>
                </div>
                <div className="action-buttons">
                    <ButtonComponent fullWidth={true} variant={'outlined'}
                                     disabled={isAPICallRunning}
                                     onClick={event => {
                                         if (onBack) {
                                             onBack()
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
                    {/*<div className="booking-confirmation-status-icon"*/}
                    {/*     style={{backgroundImage: 'url(' + ImageConfig.AppointmentConfirm + ')'}}>*/}
                    {/*    <ImageConfig.VerifiedCheck width={24}/>*/}
                    {/*</div>*/}
                    <LottieFileGenerationComponent animationData={ImageConfig.CheckLottie} autoplay={true}

                    />
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
