import "./BlockCalendarComponent.scss";
import * as Yup from "yup";
import React, {useCallback, useEffect, useState} from "react";
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
import FormDebuggerComponent from "../../../shared/components/form-debugger/FormDebuggerComponent";
import {IServiceCategory} from "../../../shared/models/service-category.model";
import {Misc} from "../../../constants";

interface BlockCalenderComponentProps {

}


const blockCalendarValidationSchema = Yup.object({
    provider: Yup.mixed().required('Provider is required'),
    reason: Yup.string().required('Reason is required'),
    is_block_all_day: Yup.boolean().nullable(),
    start_date: Yup.string().when("is_block_all_day", {
        is: true,
        then: Yup.string().required('Start Date is required'),
        otherwise: Yup.string().nullable()
    }),

    end_date: Yup.string().when("is_block_all_day", {
        is: true,
        then: Yup.string().required('End Date is required'),
        otherwise: Yup.string().nullable()
    }),

    date: Yup.string().when("is_block_all_day", {
        is: false,
        then: Yup.string().required('Date is required'),
        otherwise: Yup.string().nullable()
    }),

    start_time: Yup.string().when("is_block_all_day", {
        is: false,
        then: Yup.string().required('Start Time is required'),
        otherwise: Yup.string().nullable()
    }),

    end_time: Yup.string().when("is_block_all_day", {
        is: false,
        then: Yup.string().required('End Time is required'),
        otherwise: Yup.string().nullable()
    })
});

const initialValues = {
    provider: '',
    reason: '',
    is_block_all_day: false,
    start_date: "",
    end_date: "",
    date: "",
    start_time: "",
    end_time: ""
};


const BlockCalendarComponent = (props: BlockCalenderComponentProps) => {
    const [blockCalenderInitialValues] = useState<any>(initialValues);
    const [blockCalenderFormDetails, setBlockCalenderFormDetails] = useState<any>(undefined)
    const [providerList, setProviderList] = useState<any[] | null>(null);
    const [isBlockCalendarIsProgress, setIsBlockCalendarIsProgress] = useState<boolean>()
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


    const onSubmit = useCallback((values: any, {setErrors, setSubmitting}: FormikHelpers<any>) => {
        setSubmitting(true);
        const payload = {...values}
        console.log(values);
        if (payload.is_block_all_day) {
            delete payload.date
            delete payload.start_time
            delete payload.end_time

            payload.start_date = moment(payload?.start_date).format('YYYY-MM-DD');
            payload.end_date = moment(payload?.end_date).format('YYYY-MM-DD');
        } else {
            payload.date = moment(payload?.date).format('YYYY-MM-DD');
            delete payload.start_date
            delete payload.end_date
        }
        setBlockCalenderFormDetails(payload);
        delete payload.provider;
        CommonService._appointment.checkAppointmentExistsToBlock(values.provider, payload)
            .then((response: IAPIResponseType<IServiceCategory>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setSubmitting(false);
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error, true);
                setSubmitting(false);
            })
    }, []);

    const BlockCalender = useCallback(() => {
        setIsBlockCalendarIsProgress(true);
        const payload = {... blockCalenderFormDetails}
        delete payload.provider;
        CommonService._appointment.BlockCalender(blockCalenderFormDetails.provider, payload)
            .then((response: IAPIResponseType<IServiceCategory>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsBlockCalendarIsProgress(false);
            })
            .catch((error: any) => {
                CommonService._alert.showToast(error?.error || "", "error");
                setIsBlockCalendarIsProgress(false);
            })
    }, []);


    return (
        <div className={'block-calender-component'}>
            <FormControlLabelComponent label={'Block Calender'} size={'lg'}/>
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
                            <FormDebuggerComponent values={values} errors={errors} showDebugger={true}/>
                            <div className="t-form-controls">
                                <Field name={'provider'}>
                                    {
                                        (field: FieldProps) => (
                                            <FormikSelectComponent
                                                options={providerList || []}
                                                label={"Select Provider"}
                                                formikField={field}
                                                fullWidth={true}
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
                                                placeholder={'Reason for block'}
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
                                                                placeholder={'Start Date'}
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
                                                                placeholder={'End Date'}
                                                                formikField={field}
                                                                required={true}
                                                                minDate={moment()}
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
                                                            placeholder={'Date'}
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
                                                                    placeholder={'Start Time'}
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
                                                                    placeholder={'End Time'}
                                                                    formikField={field}
                                                                    required={true}
                                                                    fullWidth={true}
                                                                />
                                                            )
                                                        }
                                                    </Field>
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
                                    disabled={!isValid || isSubmitting}
                                >
                                    Submit
                                </ButtonComponent>


                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    );

};

export default BlockCalendarComponent;