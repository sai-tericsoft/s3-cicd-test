import React, {useCallback, useEffect, useRef, useState} from "react";
import "./BookAppointmentFormComponent.scss";
import {APIConfig} from "../../../../constants";
import {Field, FieldProps, Form, Formik, FormikHelpers, FormikProps} from "formik";
import * as Yup from "yup";
import FormikAutoCompleteComponent from "../../form-controls/formik-auto-complete/FormikAutoCompleteComponent";
import FormikSelectComponent from "../../form-controls/formik-select/FormikSelectComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";
import ButtonComponent from "../../button/ButtonComponent";
import {CommonService} from "../../../services";
import {IAPIResponseType} from "../../../models/api.model";
import moment from "moment/moment";
import FormikDatePickerComponent from "../../form-controls/formik-date-picker/FormikDatePickerComponent";

interface BookAppointmentFormComponentProps {
    onClose?: () => void,
    onComplete?: (values: any) => void,
    client?: any
    preFillData?: any
    isLoading?: boolean
}

const addAppointmentFormInitialValues: any = {
    client: '',
    service_category: '',
    service: '',
    appointment_type: '',
    duration: '',
    case: '',
    provider: '',
    facility: '',
    date: '',
    time: '',
};


const addAppointmentValidationSchema = Yup.object().shape({
    client: Yup.mixed().required("Client is required"),
    service_category: Yup.mixed().required("Service Category is required"),
    service: Yup.mixed().required("Service is required"),
    provider: Yup.mixed().required("Provider is required"),
    facility: Yup.mixed().required("Facility is required"),
    duration: Yup.mixed().required("Duration is required"),
    appointment_type: Yup.string().required("Appointment Type is required"),
    case: Yup.mixed().when("appointment_type", {
        is: 'follow',
        then: Yup.mixed().required('Case is required')
    }),
    date: Yup.mixed().required("Appointment Date is required"),
    time: Yup.mixed().required("Appointment Time is required"),
});

const BookAppointmentFormComponent = (props: BookAppointmentFormComponentProps) => {
    const {onComplete, preFillData, client, isLoading} = props;

    const {appointmentTypes} = useSelector((state: IRootReducerState) => state.staticData);
    const [clientCasesList, setClientCasesList] = useState<any[] | null>(null);
    const [serviceCategoryList, setServiceCategoryList] = useState<any[] | null>(null);
    const [servicesList, setServicesList] = useState<any[]>([]);
    const [servicesWithoutProviderList, setServicesWithoutProviderList] = useState<any[] | null>(null);
    const [durationList, setDurationList] = useState<any | null>(null);
    const [availableDates, setAvailableDates] = useState<any[] | null>(null);
    const [availableRawTimes, setAvailableRawTimes] = useState<any[] | null>(null);
    const [availableTimeSlots, setAvailableTimeSlots] = useState<any[] | null>(null);
    const [serviceProvidersList, setServiceProvidersList] = useState<any[] | null>(null);
    const [isClientCasesListLoading, setIsClientCasesListLoading] = useState<boolean>(false);
    const [isDatesListLoading, setIsDatesListLoading] = useState<boolean>(false);
    const [isTimesListLoading, setIsTimesListLoading] = useState<boolean>(false);
    const [isProviderListLoading, setIsProviderListLoading] = useState<boolean>(false);
    const [isServiceListLoading, setIsServiceListLoading] = useState<boolean>(false);

    const [isFacilityListLoading, setIsFacilityListLoading] = useState<boolean>(false);
    const [facilityList, setFacilityList] = useState<any[]>([]);

    const getClientCasesList = useCallback(
        (clientId: string) => {
            setIsClientCasesListLoading(true);
            setClientCasesList([]);
            CommonService._chartNotes.MedicalRecordListLiteAPICall(clientId, {status: 'open'})
                .then((response: IAPIResponseType<any>) => {
                    setClientCasesList(response.data || []);
                })
                .catch((error: any) => {
                    setClientCasesList([]);
                })
                .finally(() => {
                    setIsClientCasesListLoading(false);
                })
        },
        [],
    );

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
    // const generateTimeSlots = useCallback(
    //     (times: any[], duration = undefined) => {
    //         duration = duration || formRef.current?.values.duration.duration;
    //         const date = duration || formRef.current?.values.date;
    //         if (duration) {
    //             const slots: any[] = [];
    //             times.forEach(value => {
    //                 const slot = breakupTimeSlots(value, parseInt(duration || ''));
    //                 if(date){
    //
    //                 }
    //                 console.log(slot);
    //                 slots.push(...slot);
    //             })
    //             setAvailableTimeSlots(slots);
    //         }
    //
    //     },
    //     [breakupTimeSlots],
    // );


    const generateTimeSlots = useCallback(
        (times: any[], duration = undefined) => {
            duration = duration || formRef.current?.values.duration.duration;
            const date = formRef.current?.values.date;
            if (duration && times) {
                const slots: any[] = [];
                const currentDate = new Date(); // Get the current date and time
                const currentTimeStamp = currentDate.getHours() * 60 + currentDate.getMinutes();
                times.forEach(value => {
                    const slot = breakupTimeSlots(value, parseInt(duration || ''));
                    if (date.getDate() === currentDate.getDate()) { // Check if the date is equal to the current date
                        const filteredSlots = slot.filter((timeSlot: any) => {
                            return timeSlot.code >= currentTimeStamp;
                        });
                        slots.push(...filteredSlots);
                    } else {
                        slots.push(...slot);
                    }
                });
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
                    generateTimeSlots(response.data);
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
    useEffect(() => {
        if (availableRawTimes) {
            generateTimeSlots(availableRawTimes);
        } else {

        }
    }, [generateTimeSlots, availableRawTimes]);


    const getServiceCategoriesList = useCallback(
        () => {
            setServiceCategoryList([]);
            const payload = {is_active_services: true, is_active: true}
            CommonService._serviceCategory.ServiceCategoryListLiteAPICall(payload)
                .then((response: IAPIResponseType<any>) => {
                    setServiceCategoryList(response.data || []);
                })
                .catch((error: any) => {
                    setServiceCategoryList([]);
                })
        },
        [],
    );

    useEffect(() => {
        getServiceCategoriesList()
    }, [getServiceCategoriesList]);

    const getServicesList = useCallback(
        (categoryId: string) => {
            setServicesList([]);
            setIsServiceListLoading(true);
            CommonService._service.ServiceListLiteAPICall(categoryId, {is_active: true})
                .then((response: IAPIResponseType<any>) => {
                    setServicesList(response.data || []);
                    console.log(response.data);
                    const servicesWithoutProviderList = response.data.filter((service: any) => {
                        return !service.is_providers_linked
                    });
                    setServicesWithoutProviderList(servicesWithoutProviderList)
                })
                .catch((error: any) => {
                    setServicesList([]);
                }).finally(() => {
                setIsServiceListLoading(false);
            })
        },
        [],
    );
    const getServiceProviderList = useCallback(
        (serviceId: string) => {
            setIsProviderListLoading(true);
            setServiceProvidersList([]);
            CommonService._service.ServiceProviderListAPICall(serviceId, {})
                .then((response: IAPIResponseType<any>) => {
                    setServiceProvidersList(response.data || []);
                })
                .catch((error: any) => {
                    setServiceProvidersList([]);
                })
                .finally(() => {
                    setIsProviderListLoading(false);
                })
        },
        [],
    );

    const getProviderFacilityList = useCallback(
        (serviceId: string, providerId: string) => {
            console.log(serviceId, providerId);
            setIsFacilityListLoading(true);
            setFacilityList([]);
            CommonService._facility.providerFacilityList(serviceId, providerId, {})
                .then((response: IAPIResponseType<any>) => {
                    setFacilityList(response.data || []);
                })
                .catch((error: any) => {
                    setFacilityList([]);
                })
                .finally(() => {
                    setIsFacilityListLoading(false);
                })
        },
        [],
    );

    useEffect(() => {
        if (client) {
            getClientCasesList(client._id);
        }
    }, [getClientCasesList, client]);


    const onSubmitAppointment = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
            if (onComplete) {
                console.log(values);
                onComplete(values);
            }
        },
        [onComplete],
    );


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
                                            duration: duration.duration,
                                            _id: group.id,
                                            title: duration.duration + 'min',
                                            code: duration.duration
                                        }
                                    )
                                })
                            }
                        })
                    }
                })
                console.log(finalData, 'finaldata')
                setDurationList(finalData);
            })
            .catch((error: any) => {

            })
            .finally(() => {

            })
    }, [appointmentTypes]);

    const formRef = useRef<FormikProps<any>>(null)

    useEffect(() => {
        if (preFillData && formRef.current) {
            const currentCategory = formRef.current.values.service_category;
            if (preFillData.category_id && serviceCategoryList && currentCategory?._id !== preFillData.category_id) {
                const selectedCategory = (serviceCategoryList || []).find(value => value._id === preFillData.category_id);
                console.log(selectedCategory, 'selectedCategory');
                if (selectedCategory) {
                    formRef.current.setFieldValue('service_category', selectedCategory);
                    // formRef.current.setFieldValue('service', undefined);
                    // getServicesList(selectedCategory?._id);
                }
            }
        }
    }, [preFillData, serviceCategoryList])

    useEffect(() => {
        if (preFillData && formRef.current) {
            const currentService = formRef.current.values.service;
            if (preFillData.service_id && servicesList && currentService?._id !== preFillData.service_id) {
                const selectedService = (servicesList || []).find(value => value._id === preFillData.service_id);
                if (selectedService) {
                    console.log(selectedService, 'selectedService');
                    getServicesInfo(selectedService?._id)
                    // getServiceProviderList(selectedService?._id);
                    // setAvailableRawTimes([]);
                    // setAvailableDates([]);
                    formRef.current.setFieldValue('service', selectedService);
                }
            }
        }
    }, [preFillData, servicesList, getServicesInfo])

    useEffect(() => {
        if (preFillData && formRef.current) {
            const currentServiceProvider = formRef.current.values.provider;
            if (preFillData.provider_id && serviceProvidersList && currentServiceProvider?.provider_id !== preFillData.provider_id) {
                const selectedProvider = (serviceProvidersList || []).find(value => value.provider_id === preFillData.provider_id);
                if (selectedProvider) {
                    console.log(selectedProvider, 'selectedProvider');
                    // setAvailableRawTimes([]);
                    // getAvailableDatesList(selectedProvider.provider_id);
                    formRef.current.setFieldValue('provider', selectedProvider);
                }
            }
        }
    }, [preFillData, serviceProvidersList])

    useEffect(() => {
        if (preFillData && formRef.current) {
            const currentDate = formRef.current.values.date;
            const date = preFillData.date;
            if (date && availableDates && currentDate?.date !== date) {
                const selectedDate = (availableDates || []).find(value => value === date);
                if (selectedDate) {
                    console.log(selectedDate, 'selectedDate');
                    // getAvailableTimesList(formRef.current.values.provider?.provider_id, selectedDate);
                    formRef.current.setFieldValue('date', selectedDate);
                }
            }
        }
    }, [preFillData, availableDates])

    useEffect(() => {
        console.log('prefill data changed', preFillData)
        if (preFillData && formRef.current) {
            if (preFillData.category_id) {
                getServicesList(preFillData.category_id);
            }
            if (preFillData.service_id) {
                getServiceProviderList(preFillData.service_id);
            }
            if (preFillData.provider_id) {
                getProviderFacilityList(preFillData.service_id, preFillData.provider_id)
            }
            if (preFillData.facility_id) {
                getAvailableDatesList(preFillData.provider_id, preFillData.service_id, preFillData.facility_id);
            }
            if (preFillData.date) {
                getAvailableTimesList(preFillData.provider_id, preFillData.date, preFillData.service_id, preFillData.facility_id, preFillData.duration);
            }
        }
    }, [preFillData, getServicesList, getServiceProviderList, getAvailableDatesList, getAvailableTimesList, getProviderFacilityList])

    return (
        <div className={`book-appointment-form-component`}>
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
                {/*         }>*/}
                {/*<ImageConfig.CloseIcon/>*/}
                {/*</div>*/}
                {/*</ToolTipComponent>*/}
            </div>
            <div className="book-appointment-heading">Book Appointment</div>
            <div className={'appointment-form-wrapper'}>
                <Formik
                    innerRef={formRef}
                    validationSchema={addAppointmentValidationSchema}
                    initialValues={{...addAppointmentFormInitialValues, client: client}}
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
                                        <Field name={'client'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikAutoCompleteComponent
                                                        label={'Search'}
                                                        placeholder={'Search using Name/ID '}
                                                        formikField={field}
                                                        dataListKey={'data'}
                                                        displayWith={item => item ? item?.first_name + ' ' + item?.last_name + ' (ID: ' + item.client_id + ')' : ''}
                                                        keyExtractor={item => item?._id}
                                                        valueExtractor={item => item}
                                                        searchMode={'serverSide'}
                                                        required={true}
                                                        url={APIConfig.CLIENT_LIST_LITE.URL}
                                                        method={APIConfig.CLIENT_LIST_LITE.METHOD}
                                                        fullWidth={true}
                                                        onUpdate={value => {
                                                            if (value) {
                                                                getClientCasesList(value._id);
                                                            }
                                                        }}
                                                    />
                                                )
                                            }
                                        </Field>

                                        <Field name={'service_category'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikSelectComponent
                                                        formikField={field}
                                                        required={true}
                                                        options={serviceCategoryList || []}
                                                        displayWith={(option: any) => (option?.name || '')}
                                                        valueExtractor={(option: any) => option || ''}
                                                        keyExtractor={item => item?._id || ''}
                                                        label={'Service Category'}
                                                        fullWidth={true}
                                                        onUpdate={value => {
                                                            if (value) {
                                                                getServicesList(value?._id);
                                                                setFieldValue('service', undefined);
                                                                setFieldValue('appointment_type', undefined);
                                                                setFieldValue('provider', undefined);
                                                                setFieldValue('facility', undefined);
                                                                setFieldValue('date', undefined);
                                                                setFieldValue('time', undefined);
                                                                setAvailableRawTimes([]);
                                                                setAvailableDates([]);
                                                                setFacilityList([]);
                                                                setDurationList([]);
                                                            }
                                                        }}

                                                    />
                                                )
                                            }
                                        </Field>

                                        <Field name={'service'}>
                                            {
                                                (field: FieldProps) => (

                                                    <FormikSelectComponent
                                                        formikField={field}
                                                        required={servicesList.length === 0 ? false : true}
                                                        disabled={isServiceListLoading || !values?.service_category || (servicesList || []).length === 0}
                                                        options={servicesList || []}
                                                        displayWith={(option: any) => (option?.name || '')}
                                                        valueExtractor={(option: any) => option}
                                                        selectedValues={servicesWithoutProviderList}
                                                        keyExtractor={item => item._id}
                                                        label={'Service'}
                                                        fullWidth={true}
                                                        onUpdate={value => {
                                                            if (value) {
                                                                getServicesInfo(value?._id)
                                                                getServiceProviderList(value?._id);
                                                                setFieldValue('appointment_type', undefined);
                                                                setFieldValue('provider', undefined);
                                                                setFieldValue('facility', undefined);
                                                                setFieldValue('date', undefined);
                                                                setFieldValue('time', undefined);
                                                                setAvailableRawTimes([]);
                                                                setAvailableDates([]);
                                                                setFacilityList([]);
                                                                setDurationList([]);
                                                            }
                                                        }}

                                                    />
                                                )
                                            }
                                        </Field>

                                        <Field name={'appointment_type'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikSelectComponent
                                                        formikField={field}
                                                        disabled={!values?.service || (appointmentTypes || []).length === 0}
                                                        options={appointmentTypes || []}
                                                        required={true}
                                                        displayWith={(option: any) => (option.title)}
                                                        valueExtractor={(option: any) => option.code}
                                                        label={'Appointment Type'}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                        <Field name={'duration'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikSelectComponent
                                                        formikField={field}
                                                        required={true}
                                                        disabled={!values?.appointment_type || ((durationList && durationList[values?.appointment_type]) || []).length === 0}
                                                        options={(durationList && durationList[values?.appointment_type]) || []}
                                                        displayWith={(option: any) => (option.title)}
                                                        valueExtractor={(option: any) => option}
                                                        label={'Duration'}
                                                        fullWidth={true}
                                                        onUpdate={value => {
                                                            if (value && availableRawTimes) {
                                                                generateTimeSlots(availableRawTimes, value.duration);
                                                            }
                                                        }}
                                                    />
                                                )
                                            }
                                        </Field>

                                        {
                                            values?.appointment_type?.includes('follow') && <Field name={'case'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikSelectComponent
                                                            formikField={field}
                                                            required={true}
                                                            disabled={isClientCasesListLoading}
                                                            options={clientCasesList || []}
                                                            displayWith={item => (item?.created_at && CommonService.convertDateFormat2(item?.created_at) + " - " + (item?.injury_details.map((injury: any, index: number) => (injury?.body_part_details?.name + "(" + injury?.body_side + ")"))).join(' | '))}
                                                            valueExtractor={(option: any) => option}
                                                            label={'Case'}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        }

                                        <Field name={'provider'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikSelectComponent
                                                        formikField={field}
                                                        required={true}
                                                        disabled={isProviderListLoading || !values.service}
                                                        options={serviceProvidersList || []}
                                                        displayWith={(option: any) => option?.first_name + ' ' + option?.last_name || 'No Name'}
                                                        valueExtractor={(option: any) => option}
                                                        onUpdate={value => {
                                                            if (value) {
                                                                getProviderFacilityList(values.service._id, value._id);
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
                                                                setAvailableRawTimes([]);
                                                                setAvailableDates([]);
                                                                getAvailableDatesList(values.provider._id, values.service._id, value._id);
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
                                                            // <FormikSelectComponent
                                                            //     formikField={field}
                                                            //     required={true}
                                                            //     disabled={isDatesListLoading || !values?.facility}
                                                            //     options={availableDates || []}
                                                            //     displayWith={(option: any) => CommonService.convertDateFormat(option)}
                                                            //     valueExtractor={(option: any) => option}
                                                            //     label={'Date'}
                                                            //     onUpdate={value => {
                                                            //         if (value) {
                                                            //             getAvailableTimesList(values.provider?.provider_id, value);
                                                            //         }
                                                            //     }}
                                                            //     fullWidth={true}
                                                            // />

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
                                                                        getAvailableTimesList(values.provider?._id, value, values.service?._id, values.facility?._id, values.duration.duration);
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
                                        <ButtonComponent
                                            isLoading={isLoading}
                                            fullWidth={true}
                                            type={'submit'}
                                        >Next</ButtonComponent>
                                    </div>
                                </Form>
                            )
                        }
                    }
                </Formik>
            </div>
        </div>
    );
};

export default BookAppointmentFormComponent;
