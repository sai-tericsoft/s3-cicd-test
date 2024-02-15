import React, {useCallback, useEffect, useRef, useState} from "react";
import "./BookAppointmentFormComponent.scss";
import {APIConfig, ImageConfig} from "../../../../constants";
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
import commonService from "../../../services/common.service";
import momentTimezone from "moment-timezone";
import {useLocation} from "react-router-dom";
import FormControlLabelComponent from "../../form-control-label/FormControlLabelComponent";

interface BookAppointmentFormComponentProps {
    onClose?: () => void,
    onComplete?: (values: any) => void,
    client?: any
    preFillData?: any
    isLoading?: boolean,
    onBack?: () => void,
    need_intervention?: boolean
    shouldDisable?: boolean
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
    const {onComplete,shouldDisable, need_intervention, onClose, onBack, preFillData, client, isLoading} = props;
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
    const today = moment();
    const nextThreeMonths = moment().add(3, 'months');
    const location = useLocation();

    const isMedicalRecordDetails = location.pathname.includes('medical-record-details');


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
                    const dates = response.data || [];
                    const currentDate = moment().format('YYYY-MM-DD').toString();
                    const filteredDates = dates.filter((date: any) => date >= currentDate);
                    setAvailableDates(filteredDates);
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
            duration = duration || formRef.current?.values?.duration?.duration;
            const date = formRef.current?.values.date;
            if (duration && times) {
                const slots: any[] = [];
                const currentDate = new Date(); // Get the current date and time
                const currentTimeStamp = currentDate.getHours() * 60 + currentDate.getMinutes();
                times.forEach(value => {
                    const slot = breakupTimeSlots(value, parseInt(duration || ''));
                    if (date.getDate() === currentDate.getDate()) { // Check if the date is equal to the current date
                        const filteredSlots = slot?.filter((timeSlot: any) => {
                            return timeSlot.end_min >= currentTimeStamp;
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
                duration: duration,
                timezone: momentTimezone.tz.guess(),
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
            CommonService._service.ServiceProviderListAPICall(serviceId, {is_active: true})
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
            CommonService._facility.providerFacilityList(serviceId, providerId, {is_active: true})
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
                                    console.log(duration, 'duration');
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
            const appointment_type = preFillData.appointment_type;
            const caseDetails = preFillData.case;
            if (date && availableDates && currentDate?.date !== date) {
                const selectedDate = (availableDates || []).find(value => value === date);
                if (selectedDate) {
                    console.log(selectedDate, 'selectedDate');
                    // getAvailableTimesList(formRef.current.values.provider?.provider_id, selectedDate);
                    formRef.current.setFieldValue('date', selectedDate);
                }
            }
            if (appointment_type) {
                formRef.current.setFieldValue('appointment_type', appointment_type);
            }
            if (caseDetails && clientCasesList) {
                formRef.current.setFieldValue('case', clientCasesList.find((value: any) => value._id === caseDetails._id));
            }
        }
    }, [preFillData, availableDates, clientCasesList])

    useEffect(() => {
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
                {
                    !isMedicalRecordDetails && <div className="back-btn" onClick={onBack}>
                        <div><ImageConfig.LeftArrow/></div>
                        <div className={'back-text'}>Back</div>
                    </div>
                }
                {
                    isMedicalRecordDetails && <div className="back-btn"/>
                }

                <div className="drawer-close"
                     id={'book-appointment-close-btn'}
                     onClick={(event) => {
                         if (onClose) {
                             onClose();
                         }
                     }
                     }><ImageConfig.CloseIcon/></div>
            </div>
            {/*<div className="book-appointment-heading">Book Appointment</div>*/}
            <FormControlLabelComponent label={'Enter Appointment Details'} size={'xl'}/>
            <div className={'appointment-form-wrapper'}>
                <Formik
                    innerRef={formRef}
                    validationSchema={addAppointmentValidationSchema}
                    initialValues={{...addAppointmentFormInitialValues, client: client}}
                    onSubmit={onSubmitAppointment}
                    validateOnChange={true}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    validateOnMount={true}>
                    {
                        (formik) => {
                            const {
                                values,
                                setFieldTouched,
                                setFieldValue,
                                validateForm
                            } = formik;
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            useEffect(() => {
                                validateForm();
                            }, [validateForm, values]);
                            return (
                                <Form className="t-form" noValidate={true}>
                                    {/*<FormDebuggerComponent form={formik}  showDebugger={true}/>*/}
                                    <div className={"t-appointment-drawer-form-controls"}>
                                        <Field name={'client'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikAutoCompleteComponent
                                                        label={'Search'}
                                                        disabled={shouldDisable}
                                                        placeholder={'Search using Name/ID '}
                                                        formikField={field}
                                                        dataListKey={'data'}
                                                        displayWith={item => item ? commonService.generateClientNameFromClientDetails(item) + ' (ID: ' + item.client_id + ')' : ''}
                                                        keyExtractor={item => item?._id}
                                                        valueExtractor={item => item}
                                                        searchMode={'serverSide'}
                                                        required={true}
                                                        url={APIConfig.CLIENT_LIST_LITE.URL}
                                                        method={APIConfig.CLIENT_LIST_LITE.METHOD}
                                                        fullWidth={true}
                                                        readOnly={need_intervention}
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
                                                        disabled={shouldDisable}
                                                        options={serviceCategoryList || []}
                                                        displayWith={(item: any) => item ? (item?.name?.length > 60 ? item?.name?.slice(0, 60) + '...' : item?.name) : ''}
                                                        valueExtractor={(option: any) => option || ''}
                                                        keyExtractor={item => item?._id || ''}
                                                        readOnly={need_intervention}
                                                        label={'Service Category'}
                                                        fullWidth={true}
                                                        onUpdate={value => {
                                                            if (value) {
                                                                getServicesList(value?._id);
                                                                setFieldValue('service', undefined);
                                                                setFieldTouched('service', false);
                                                                setFieldValue('appointment_type', undefined);
                                                                setFieldTouched('appointment_type', false);
                                                                setFieldValue('provider', undefined);
                                                                setFieldTouched('provider', false);
                                                                setFieldValue('facility', undefined);
                                                                setFieldTouched('facility', false);
                                                                setFieldValue('date', undefined);
                                                                setFieldTouched('date', false);
                                                                setFieldValue('time', undefined);
                                                                setFieldTouched('time', false);
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
                                                        required={true}
                                                        disabled={isServiceListLoading || !values?.service_category || (servicesList || []).length === 0 || shouldDisable}
                                                        options={servicesList || []}
                                                        readOnly={need_intervention}
                                                        displayWith={(item: any) => item ? (item?.name?.length > 60 ? item?.name?.slice(0, 60) + '...' : item?.name) : ''}
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
                                                                setFieldTouched('appointment_type', false);
                                                                setFieldValue('provider', undefined);
                                                                setFieldTouched('provider', false);
                                                                setFieldValue('facility', undefined);
                                                                setFieldTouched('facility', false);
                                                                setFieldValue('date', undefined);
                                                                setFieldTouched('date', false);
                                                                setFieldValue('time', undefined);
                                                                setFieldTouched('time', false);
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
                                                        disabled={!values?.service || (appointmentTypes || []).length === 0 || shouldDisable}
                                                        options={appointmentTypes || []}
                                                        required={true}
                                                        displayWith={(item: any) => item ? (item?.title?.length > 60 ? item?.title?.slice(0, 60) + '...' : item?.title) : ''}
                                                        valueExtractor={(option: any) => option.code}
                                                        readOnly={need_intervention}
                                                        label={'Appointment Type'}
                                                        fullWidth={true}
                                                        onUpdate={(value) => {
                                                            if (value) {
                                                                console.log(value);
                                                                setFieldValue('duration', undefined);
                                                                setFieldTouched('duration', false);
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
                                        <Field name={'duration'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikSelectComponent
                                                        formikField={field}
                                                        required={true}
                                                        disabled={!values?.appointment_type || ((durationList && durationList[values?.appointment_type]) || [])?.length === 0}
                                                        options={(durationList && durationList[values?.appointment_type]) || null}
                                                        displayWith={(option: any) => (option?.title)}
                                                        valueExtractor={(option: any) => option}
                                                        label={'Duration'}
                                                        fullWidth={true}
                                                        onUpdate={value => {
                                                            if (value && availableRawTimes) {
                                                                // generateTimeSlots(availableRawTimes, value.duration);
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
                                        {
                                            values?.appointment_type?.includes('follow') && <Field name={'case'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikSelectComponent
                                                            formikField={field}
                                                            required={true}
                                                            disabled={isClientCasesListLoading || shouldDisable}
                                                            readOnly={need_intervention}
                                                            options={clientCasesList || []}
                                                            displayWith={item => (
                                                                item.created_at && CommonService.convertDateFormat2(item.created_at) + " - " +
                                                                (
                                                                    item.injury_details.length > 2
                                                                        ? item.injury_details.slice(0, 2).map((injury: any) =>
                                                                        injury.body_part_details?.name +
                                                                        (injury.body_side ? ` (${injury.body_side})` : "")
                                                                    ).join(', ') + " ..."
                                                                        : item.injury_details.map((injury: any) =>
                                                                            injury.body_part_details?.name +
                                                                            (injury.body_side ? ` (${injury.body_side})` : "")
                                                                        ).join(', ')
                                                                )
                                                            )}
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
                                                        disabled={isFacilityListLoading || !values.provider}
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
                                                                getAvailableDatesList(values.provider._id, values.service._id, value._id, values?.duration);
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
                                                                placeholder={'MM/DD/YYYY'}
                                                                disabled={isDatesListLoading || !values?.facility}
                                                                formikField={field}
                                                                required={true}
                                                                fullWidth={true}
                                                                minDate={today}
                                                                maxDate={nextThreeMonths}
                                                                enableDates={availableDates || []}
                                                                onUpdate={(value: any) => {
                                                                    console.log(value);
                                                                    if (value) {
                                                                        getAvailableTimesList(values.provider?._id, value, values.service?._id, values.facility?._id, values.duration.duration);
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
