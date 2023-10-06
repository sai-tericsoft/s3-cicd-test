import "./BlockCalendarComponent.scss";
import * as Yup from "yup";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import FormikCheckBoxComponent from "../../../shared/components/form-controls/formik-check-box/FormikCheckBoxComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import FormikSelectComponent from "../../../shared/components/form-controls/formik-select/FormikSelectComponent";
import FormikDatePickerComponent
    from "../../../shared/components/form-controls/formik-date-picker/FormikDatePickerComponent";
import moment from "moment";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import FormikTimePickerComponent
    from "../../../shared/components/form-controls/formik-time-picker/formikTimePickerComponent";
import {IServiceCategory} from "../../../shared/models/service-category.model";
import {ImageConfig} from "../../../constants";
import ModalComponent from "../../../shared/components/modal/ModalComponent";
import TableComponent from "../../../shared/components/table/TableComponent";
import {ITableColumn} from "../../../shared/models/table.model";
import ErrorComponent from "../../../shared/components/error/ErrorComponent";

interface BlockCalenderComponentProps {
    onAddSuccess: Function
}


const blockCalendarValidationSchema = Yup.object({
    provider_id: Yup.mixed().required('Provider is required'),
    reason: Yup.string().required('Reason is required'),
    is_block_all_day: Yup.boolean().nullable(),
    start_date: Yup.string().when("is_block_all_day", {
        is: true,
        then: Yup.string().nullable().required('Start Date is required'),
        otherwise: Yup.string().nullable()
    }),

    end_date: Yup.string().when("is_block_all_day", {
        is: true,
        then: Yup.string().nullable().required('End Date is required'),
        otherwise: Yup.string().nullable()
    }),

    date: Yup.string().when("is_block_all_day", {
        is: false,
        then: Yup.string().nullable().required('Date is required'),
        otherwise: Yup.string().nullable()
    }),

    start_time: Yup.string().when("is_block_all_day", {
        is: false,
        then: Yup.string().nullable().required('Start Time is required'),
        otherwise: Yup.string().nullable()
    }),

    end_time: Yup.string().when("is_block_all_day", {
        is: false,
        then: Yup.string().nullable().required('End Time is required'),
        otherwise: Yup.string().nullable()
    })
});

const initialValues = {
    provider_id: '',
    reason: '',
    is_block_all_day: false,
    start_date: "",
    end_date: "",
    date: "",
    start_time: "",
    end_time: ""
};


const BlockCalendarComponent = (props: BlockCalenderComponentProps) => {
    const {onAddSuccess} = props;
    const [blockCalenderInitialValues] = useState<any>(initialValues);
    const [blockCalenderFormDetails, setBlockCalenderFormDetails] = useState<any>(undefined)
    const [providerList, setProviderList] = useState<any[] | null>(null);
    const [isBlockCalendarIsProgress, setIsBlockCalendarIsProgress] = useState<boolean>();
    const [showAppointmentsModel, setIsShowAppointmentModel] = useState<any>(false);
    const [appointmentList, setAppointmentList] = useState<any[]>([])


    const appointmentColumns: ITableColumn[] = useMemo<ITableColumn[]>(() => [
        {
            title: "Appointment ID",
            key: "appointment_number",
            dataIndex: "appointment_number",
            width: 150,
            render: (item: any) => {
                return <> {item?.appointment_number}</>
            }

        },
        {
            title: "Client Name",
            key: "first_name",
            dataIndex: "first_name",
            width: 150,
            render: (item: any) => {
                return <>{CommonService.extractName(item?.client_details)}</>
            }

        },
        {
            title: "Phone Number",
            key: "primary_contact_info",
            dataIndex: "primary_contact_info",
            width: 150,
            align: 'center',
            render: (item: any) => {
                return <span>{item?.client_details?.primary_contact_info?.phone ? CommonService.formatPhoneNumber(item?.client_details?.primary_contact_info?.phone) : ''}</span>
            }
        },

        {
            title: "Appointment Type",
            key: "appointment_type",
            dataIndex: "appointment_type",
            width: 170,
            align: "center",
            render: (item: any) => {
                return <span>{item?.appointment_type}</span>
            }
        },
        {
            title: "Appointment Date/Time",
            key: "appointment_date",
            dataIndex: "appointmentDate",
            width: 200,
            align: "center",
            render: (item: any) => {
                return <span>
                    {item?.appointment_date ? CommonService.getSystemFormatTimeStamp(item?.appointment_date, false) + ', ' + CommonService.getHoursAndMinutesFromMinutes(item?.start_time) : "-"}
                </span>
            }
        },

    ], []);


    const getProvidersList = useCallback(
        () => {
            setProviderList([]);
            CommonService._user.getUserListLite({role: 'provider', is_active: true})
                .then((response: IAPIResponseType<any>) => {
                    const data = response.data || [];
                    setProviderList(data);
                })
                .catch((error: any) => {
                    setProviderList([]);
                })
        },
        [],
    );
    useEffect(() => {
        getProvidersList()
    }, [getProvidersList]);

    const BlockCalender = useCallback((blockCalenderFormDetails: any) => {
        setIsBlockCalendarIsProgress(true);
        const payload = {...blockCalenderFormDetails}
        delete payload.provider_id;
        if (appointmentList && appointmentList.length > 0) {
            payload.appointment_ids = appointmentList.map((item: any) => item.appointment_id)
        } else {
            payload.appointment_ids = [];
        }
        CommonService._appointment.BlockCalender(blockCalenderFormDetails?.provider_id, payload)
            .then((response: IAPIResponseType<IServiceCategory>) => {
                CommonService._alert.showToast('Calendar has been blocked', "success");
                setIsBlockCalendarIsProgress(false);
                onAddSuccess();
            })
            .catch((error: any) => {
                CommonService._alert.showToast(error?.error || "", "error");
                setIsBlockCalendarIsProgress(false);
            })
    }, [onAddSuccess, appointmentList]);

    const handleBlockCalenderConfirmation = useCallback((blockCalenderFormDetails: any) => {
        CommonService.onConfirm({
            image: ImageConfig.ConfirmationLottie,
            showLottie: true,
            confirmationTitle: 'BLOCK CALENDAR',
            confirmationSubTitle: "Are you sure you want to block your calendar",
            confirmationDescription: <div className='block-calender-confirmation-description'>
                <div>
                    <b> From </b>: {blockCalenderFormDetails?.is_block_all_day ? moment(blockCalenderFormDetails?.start_date).format('DD-MMM-YYYY') : moment(blockCalenderFormDetails?.date).format('DD-MMM-YYYY') +', ' + CommonService.getHoursAndMinutesFromMinutes(blockCalenderFormDetails?.start_time)}
                </div>
                <div className="mrg-top-10">
                    <b> To </b><span
                    className={'mrg-left-15'}>: {blockCalenderFormDetails?.is_block_all_day ? moment(blockCalenderFormDetails?.end_date).format('DD-MMM-YYYY') : moment(blockCalenderFormDetails?.date).format('DD-MMM-YYYY') +', '+ CommonService.getHoursAndMinutesFromMinutes(blockCalenderFormDetails?.end_time)}
                </span></div>
            </div>,
            yes: {
                color: "primary",
                text: "Proceed",
                variant: "contained",
                isLoading: isBlockCalendarIsProgress
            },
            no: {
                color: "primary",
                text: "Cancel",
                variant: "outlined",
            },
        }).then(() => {
            BlockCalender(blockCalenderFormDetails);
        })
    }, [BlockCalender, isBlockCalendarIsProgress]);


    const handleAppointmentsPopup = useCallback(() => {
        setIsShowAppointmentModel(false)
        handleBlockCalenderConfirmation(blockCalenderFormDetails)
    }, [handleBlockCalenderConfirmation, blockCalenderFormDetails]);


    const onSubmit = useCallback((values: any, {setErrors, setSubmitting}: FormikHelpers<any>) => {
        setSubmitting(true);
        const payload = {...values, is_block_appointments: true}
        if (payload.is_block_all_day) {
            delete payload.date
            delete payload.start_time
            delete payload.end_time

            payload.start_date = moment(payload?.start_date).format('YYYY-MM-DD');
            payload.end_date = moment(payload?.end_date).format('YYYY-MM-DD');
        } else {
            payload.date = moment(payload?.date).format('YYYY-MM-DD');
            payload.start_date = moment(payload?.date).format('YYYY-MM-DD');
            // delete payload.start_date
            delete payload.end_date
        }
        setBlockCalenderFormDetails(payload);
        // setIsShowAppointmentModel(true);
        CommonService._appointment.checkAppointmentExistsToBlock(payload)
            .then((response: IAPIResponseType<IServiceCategory>) => {
                setSubmitting(false);
                if (response?.data?.length > 0) {
                    setAppointmentList(response.data);
                    setIsShowAppointmentModel(true);
                } else {
                    // Handle the case when the data is an empty array here
                    handleBlockCalenderConfirmation(payload);

                    // For example, you can show a message or perform any other action
                }
            })
            .catch((error: any) => {
                // Handle other errors here
                console.log(error);
                CommonService.handleErrors(setErrors, error, true);
                setSubmitting(false);
            });
    }, [handleBlockCalenderConfirmation]);

    return (
        <div className={'block-calender-component'}>
            <FormControlLabelComponent label={'Block Calendar'} size={'lg'}/>
            <Formik initialValues={blockCalenderInitialValues}
                    validationSchema={blockCalendarValidationSchema}
                    validateOnChange={false}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    validateOnMount={true}
                    onSubmit={onSubmit}>
                {({values, isValid, touched, setErrors, errors, setFieldValue, validateForm, isSubmitting}) => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    useEffect(() => {
                        validateForm();
                    }, [validateForm, values]);
                    return (
                        <Form className={'t-form'} noValidate={true}>
                            {/*<FormDebuggerComponent values={values} errors={errors} showDebugger={false}/>*/}
                            <div className="t-form-controls">
                                <Field name={'provider_id'}>
                                    {
                                        (field: FieldProps) => (
                                            <FormikSelectComponent
                                                options={providerList || []}
                                                label={"Select Provider"}
                                                formikField={field}
                                                fullWidth={true}
                                                required={true}
                                                displayWith={item => item ? item?.provider_name || (item?.first_name + ' ' + item?.last_name) : ''}
                                                keyExtractor={item => item?.provider_id || item?._id}
                                                valueExtractor={item => item?.provider_id || item?._id}
                                            />
                                        )
                                    }
                                </Field>
                                <Field name={'reason'}>
                                    {
                                        (field: FieldProps) => (
                                            <FormikInputComponent
                                                titleCase={true}
                                                label={'Reason for block'}
                                                placeholder={'Enter Reason'}
                                                formikField={field}
                                                required={true}
                                                fullWidth={true}
                                            />
                                        )
                                    }
                                </Field>

                                <Field name={'is_block_all_day'}>
                                    {(field: FieldProps) => (
                                        <FormikCheckBoxComponent
                                            label={'Block All Day'}
                                            formikField={field}
                                            required={false}
                                            labelPlacement={"end"}
                                        />
                                    )}
                                </Field>

                                {
                                    values.is_block_all_day ?
                                        <div className={'ts-row mrg-top-15'}>
                                            <div className={'ts-col-md-6'}>
                                                <Field name={'start_date'}>
                                                    {
                                                        (field: FieldProps) => (
                                                            <FormikDatePickerComponent
                                                                label={'Start Date'}
                                                                placeholder={'MM/DD/YYYY'}
                                                                formikField={field}
                                                                required={true}
                                                                minDate={moment()}
                                                                fullWidth={true}
                                                            />
                                                        )
                                                    }
                                                </Field>
                                            </div>
                                            <div className={'ts-col-md-6'}>
                                                <Field name={'end_date'}>
                                                    {
                                                        (field: FieldProps) => (
                                                            <FormikDatePickerComponent
                                                                label={'End Date'}
                                                                disabled={!values.start_date}
                                                                placeholder={'MM/DD/YYYY'}
                                                                formikField={field}
                                                                minDate={moment(values.start_date)}
                                                                required={true}
                                                                fullWidth={true}
                                                            />
                                                        )
                                                    }
                                                </Field>
                                            </div>
                                        </div>
                                        : <div className="mrg-top-15">
                                            <Field name={'date'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikDatePickerComponent
                                                            label={'Date'}
                                                            placeholder={'MM/DD/YYYY'}
                                                            formikField={field}
                                                            required={true}
                                                            minDate={moment()}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                            <div className={'ts-row'}>
                                                <div className={'ts-col-md-6'}>
                                                    <Field name={'start_time'}>
                                                        {
                                                            (field: FieldProps) => (
                                                                <FormikTimePickerComponent
                                                                    label={'Start Time'}
                                                                    placeholder={'hh/mm aa'}
                                                                    formikField={field}
                                                                    required={true}
                                                                    fullWidth={true}
                                                                />
                                                            )
                                                        }
                                                    </Field>
                                                </div>
                                                <div className={'ts-col-md-6'}>
                                                    <Field name={'end_time'}>
                                                        {
                                                            (field: FieldProps) => (
                                                                <FormikTimePickerComponent
                                                                    label={'End Time'}
                                                                    placeholder={'hh/mm aa'}
                                                                    formikField={field}
                                                                    required={true}
                                                                    fullWidth={true}
                                                                />
                                                            )
                                                        }
                                                    </Field>
                                                    <div className="ts-row">
                                                        <div className="ts-col d-flex ts-justify-content-center">
                                                            {(values.end_time && values.start_time) && (values.end_time <= values.start_time) && <>
                                                                <ErrorComponent
                                                                    errorText={'End time should be greater than start time'}/>
                                                            </>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                }

                            </div>
                            <div className={'t-form-actions'}>
                                <ButtonComponent
                                    fullWidth={true}
                                    type={"submit"}
                                    isLoading={isSubmitting}
                                    disabled={!isValid || isSubmitting || isBlockCalendarIsProgress || (!values.is_block_all_day ? ((values.end_time && values.start_time) && (values.end_time < values.start_time)) : false)}
                                >
                                    Submit
                                </ButtonComponent>


                            </div>
                        </Form>
                    )
                }}
            </Formik>

            <ModalComponent
                isOpen={showAppointmentsModel}
                size={'lg'}
                title={'Appointments'}
                onClose={() => setIsShowAppointmentModel(false)}
                modalFooter={<div className={'mrg-top-40'}>
                    <ButtonComponent variant={'outlined'}
                                     className={'mrg-right-15'}
                                     onClick={() => setIsShowAppointmentModel(false)}
                    >
                        Cancel
                    </ButtonComponent>
                    <ButtonComponent variant={'contained'}
                                     color={'primary'}
                                     onClick={handleAppointmentsPopup}
                    >
                        Proceed
                    </ButtonComponent>
                </div>
                }
            >

                <div className=' font-weight-bold mrg-bottom-15'>The following clients will be notified of
                    your unavailability and will be asked to reschedule their
                    appointments.
                </div>
                <div>
                    <TableComponent
                        data={appointmentList}
                        bordered={true}
                        autoHeight={true}
                        columns={appointmentColumns}/>

                </div>

            </ModalComponent>
        </div>
    );

};

export default BlockCalendarComponent;
