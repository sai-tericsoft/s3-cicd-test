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
import ToolTipComponent from "../../tool-tip/ToolTipComponent";
import InputComponent from "../../form-controls/input/InputComponent";

interface AppointmentRescheduleComponentProps {
    onClose?: () => void,
    onComplete?: (values: any) => void,
    details?: any,
}

const addAppointmentRescheduleInitialValues: any = {
    provider: '',
    date: '',
    time: '',
};

const DURATION_TYPES = [{label: '30 min', key: 30}, {label: '60 min', key: 60}];

const addAppointmentRescheduleValidationSchema = Yup.object().shape({
    provider: Yup.mixed().required("Provider is required"),
    date: Yup.mixed().required("Appointment date is required"),
    time: Yup.mixed().required("Appointment time is required"),
});

const AppointmentRescheduleComponent = (props: AppointmentRescheduleComponentProps) => {
    const {onClose, onComplete, details} = props;

    const {appointmentTypes} = useSelector((state: IRootReducerState) => state.staticData);
    const [serviceCategoryList, setServiceCategoryList] = useState<any[] | null>(null);
    const [servicesList, setServicesList] = useState<any[] | null>(null);
    const [availableDates, setAvailableDates] = useState<any[] | null>(null);
    const [availableRawTimes, setAvailableRawTimes] = useState<any[] | null>(null);
    const [availableTimeSlots, setAvailableTimeSlots] = useState<any[] | null>(null);
    const [serviceProvidersList, setServiceProvidersList] = useState<any[] | null>(null);
    const [isDatesListLoading, setIsDatesListLoading] = useState<boolean>(false);
    const [isTimesListLoading, setIsTimesListLoading] = useState<boolean>(false);
    const [isProviderListLoading, setIsProviderListLoading] = useState<boolean>(false);
    const [isServiceListLoading, setIsServiceListLoading] = useState<boolean>(false);

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
            duration = duration || formRef.current?.values.duration;
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
            CommonService._service.ServiceListLiteAPICall(categoryId)
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

    const onSubmitAppointment = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
            if (onComplete) {
                console.log(values);
                onComplete(values);
            }
        },
        [onComplete],
    );

    const formRef = useRef<FormikProps<any>>(null)

    return (
        <div className={`book-appointment-form-component`}>
            <div className="drawer-header">
                {/*<div className="back-btn" onClick={onBack}><ImageConfig.LeftArrow/></div>*/}
                <div className="drawer-title">Book Appointment</div>
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
            <div className={'appointment-form-wrapper'}>
                <Formik
                    innerRef={formRef}
                    validationSchema={addAppointmentRescheduleValidationSchema}
                    initialValues={{...addAppointmentRescheduleInitialValues}}
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
                                                    <InputComponent
                                                        value={details?.client_details?.first_name + ' ' + details?.client_details?.last_name}/>
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
                                                        disabled={isServiceListLoading}
                                                        options={servicesList || []}
                                                        displayWith={(option: any) => (option?.name || '')}
                                                        valueExtractor={(option: any) => option}
                                                        keyExtractor={item => item._id}
                                                        label={'Service'}
                                                        fullWidth={true}
                                                        onUpdate={value => {
                                                            if (value) {
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
                                                        options={DURATION_TYPES}
                                                        displayWith={(option: any) => (option.label)}
                                                        valueExtractor={(option: any) => option.key}
                                                        label={'Duration'}
                                                        fullWidth={true}
                                                        onUpdate={value => {
                                                            if (value && availableRawTimes) {
                                                                generateTimeSlots(availableRawTimes, value);
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
                                                                disabled={isDatesListLoading}
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
        </div>
    );
};

export default AppointmentRescheduleComponent;
