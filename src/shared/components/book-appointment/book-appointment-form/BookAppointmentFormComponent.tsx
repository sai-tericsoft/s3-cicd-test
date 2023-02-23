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
import ToolTipComponent from "../../tool-tip/ToolTipComponent";

interface BookAppointmentFormComponentProps {
    onClose?: () => void,
    onComplete?: (values: any) => void,
    client?: any
}

const addAppointmentFormInitialValues: any = {
    client: '',
    service_category: '',
    service: '',
    appointment_type: '',
    duration: '',
    case: '',
    provider: '',
    date: '',
    time: '',
};


const addAppointmentValidationSchema = Yup.object().shape({
    client: Yup.mixed().required("Client is required"),
    service_category: Yup.mixed().required("Service Category is required"),
    service: Yup.mixed().required("Service is required"),
    provider: Yup.mixed().required("Provider is required"),
    duration: Yup.mixed().required("Duration is required"),
    appointment_type: Yup.string().required("Appointment type is required"),
    case: Yup.mixed().when("appointment_type", {
        is: 'follow',
        then: Yup.mixed().required('Case is required')
    }),
    date: Yup.mixed().required("Appointment date is required"),
    time: Yup.mixed().required("Appointment time is required"),
});

const BookAppointmentFormComponent = (props: BookAppointmentFormComponentProps) => {
    const {onClose, onComplete, client} = props;

    const {appointmentTypes} = useSelector((state: IRootReducerState) => state.staticData);
    const [clientCasesList, setClientCasesList] = useState<any[] | null>(null);
    const [serviceCategoryList, setServiceCategoryList] = useState<any[] | null>(null);
    const [servicesList, setServicesList] = useState<any[] | null>(null);
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
        (providerId: string) => {
            setIsDatesListLoading(true);
            setAvailableDates([]);
            CommonService._user.getUserAvailableDatesList(providerId)
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
    const generateTimeSlots = useCallback(
        (times: any[], duration = undefined) => {
            duration = duration || formRef.current?.values.duration.duration;
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
        (providerId: string, date: string) => {
            setIsTimesListLoading(true);
            setAvailableRawTimes([]);
            CommonService._user.getUserAvailableTimesList(providerId, date)
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
        if (availableRawTimes) {
            generateTimeSlots(availableRawTimes);
        } else {

        }
    }, [generateTimeSlots, availableRawTimes]);


    const getServiceCategoriesList = useCallback(
        () => {
            setServiceCategoryList([]);
            CommonService._serviceCategory.ServiceCategoryListLiteAPICall({is_active: true})
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
                                            title: group.title + ' - ' + duration.duration + 'min',
                                            code: group.title + ':' + duration.duration
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

    return (
        <div className={`book-appointment-form-component`}>
            <div className="drawer-header">
                {/*<div className="back-btn" onClick={onBack}><ImageConfig.LeftArrow/></div>*/}
                <ToolTipComponent tooltip={"Close"} position={"left"}>
                    <div className="drawer-close"
                         id={'book-appointment-close-btn'}
                         onClick={(event) => {
                             if (onClose) {
                                 onClose();
                             }
                         }
                         }><ImageConfig.CloseIcon/></div>
                </ToolTipComponent>
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
                                                        label={'Search Client (Name or Phone Number)'}
                                                        placeholder={'Search Client (Name or Phone Number)'}
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
                                                        disabled={isServiceListLoading || !values?.service_category || (servicesList || []).length === 0}
                                                        options={servicesList || []}
                                                        displayWith={(option: any) => (option?.name || '')}
                                                        valueExtractor={(option: any) => option}
                                                        keyExtractor={item => item._id}
                                                        label={'Service'}
                                                        fullWidth={true}
                                                        onUpdate={value => {
                                                            if (value) {
                                                                getServicesInfo(value?._id)
                                                                getServiceProviderList(value?._id);
                                                                setAvailableRawTimes([]);
                                                                setAvailableDates([]);
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
                                            values.appointment_type.includes('follow') && <Field name={'case'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikSelectComponent
                                                            formikField={field}
                                                            required={true}
                                                            disabled={isClientCasesListLoading}
                                                            options={clientCasesList || []}
                                                            displayWith={item => (item?.created_at && CommonService.transformTimeStamp(item?.created_at) + " - " + (item?.injury_details.map((injury: any, index: number) => (injury.body_part_details.name + "(" + injury.body_side + ")"))).join(' | '))}
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
                                                        displayWith={(option: any) => option?.provider_name || 'No Name'}
                                                        valueExtractor={(option: any) => option}
                                                        onUpdate={value => {
                                                            if (value) {
                                                                setAvailableRawTimes([]);
                                                                getAvailableDatesList(value.provider_id);
                                                            }
                                                        }}
                                                        label={'Provider'}
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
                                                            <FormikSelectComponent
                                                                formikField={field}
                                                                required={true}
                                                                disabled={isDatesListLoading || !values?.provider}
                                                                options={availableDates || []}
                                                                displayWith={(option: any) => CommonService.convertDateFormat(option)}
                                                                valueExtractor={(option: any) => option}
                                                                label={'Date'}
                                                                onUpdate={value => {
                                                                    if (value) {
                                                                        getAvailableTimesList(values.provider?.provider_id, value);
                                                                    }
                                                                }}
                                                                fullWidth={true}
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
        </div>
    );
};

export default BookAppointmentFormComponent;
