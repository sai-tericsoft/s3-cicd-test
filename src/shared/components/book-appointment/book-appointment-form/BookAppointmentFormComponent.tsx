import React, {useCallback, useEffect, useState} from "react";
import "./BookAppointmentFormComponent.scss";
import {APIConfig} from "../../../../constants";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import * as Yup from "yup";
import FormikAutoCompleteComponent from "../../form-controls/formik-auto-complete/FormikAutoCompleteComponent";
import {IUser} from "../../../models/user.model";
import FormikSelectComponent from "../../form-controls/formik-select/FormikSelectComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";
import ButtonComponent from "../../button/ButtonComponent";

interface BookAppointmentFormComponentProps {
    onClose?: () => void,
    onComplete?: () => void,
    client?: any
}

const addAppointmentFormInitialValues: any = {
    client: "",
};

const APPOINTMENT_TYPES = [{label: 'Initial Consult', key: 'initial'}, {label: 'Follow Up', key: 'follow'}];
const DURATION_TYPES = [{label: '30 min', key: 30}, {label: '60 min', key: 60}];

const addAppointmentValidationSchema = Yup.object().shape({
    client: Yup.mixed().required("Client is required"),
});

const BookAppointmentFormComponent = (props: BookAppointmentFormComponentProps) => {
    const {onClose, onComplete, client} = props;
    const {allProvidersList} = useSelector((state: IRootReducerState) => state.user);
    const {caseStatusList} = useSelector((state: IRootReducerState) => state.staticData);
    const [selectedClient, setSelectedClient] = useState<any | null>(client);
    useEffect(() => {
        return () => {
            setSelectedClient(client);
        };
    }, [client]);


    const onSubmitAppointment = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
            if (onComplete) {
                onComplete()
            }
        },
        [onComplete],
    );


    return (
        <div className={`book-appointment-form-component`}>
            <div className={'appointment-form-wrapper'}>
                <Formik
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
                                                        displayWith={item => item ? item?.first_name + ' ' + item?.last_name : ''}
                                                        keyExtractor={item => item?._id}
                                                        valueExtractor={item => item}
                                                        searchMode={'serverSide'}
                                                        required={true}
                                                        url={APIConfig.CLIENT_LIST.URL}
                                                        method={APIConfig.CLIENT_LIST.METHOD}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>

                                        <Field name={'service_category'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikAutoCompleteComponent
                                                        label={'Service Category'}
                                                        placeholder={'Service Category'}
                                                        formikField={field}
                                                        dataListKey={'data'}
                                                        displayWith={item => item ? item?.name : ''}
                                                        keyExtractor={item => item?._id}
                                                        valueExtractor={item => item}
                                                        searchMode={'serverSide'}
                                                        required={true}
                                                        url={APIConfig.SERVICE_CATEGORY_LIST.URL}
                                                        method={APIConfig.SERVICE_CATEGORY_LIST.METHOD}
                                                        fullWidth={true}
                                                    />
                                                    // <FormikSelectComponent
                                                    //     formikField={field}
                                                    //     required={true}
                                                    //     options={allProvidersList}
                                                    //     displayWith={(option: IUser) => (option?.first_name || option?.last_name) ? option?.first_name + " " + option?.last_name : "-"}
                                                    //     valueExtractor={(option: IUser) => option}
                                                    //     label={'Service Category'}
                                                    //     fullWidth={true}
                                                    // />
                                                )
                                            }
                                        </Field>

                                        <Field name={'service'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikAutoCompleteComponent
                                                        label={'Service'}
                                                        placeholder={'Service'}
                                                        formikField={field}
                                                        displayWith={item => item ? item?.name : ''}
                                                        keyExtractor={item => item?._id}
                                                        valueExtractor={item => item}
                                                        searchMode={'serverSide'}
                                                        required={true}
                                                        url={APIConfig.SERVICE_LIST.URL(values.service_category._id)}
                                                        method={APIConfig.SERVICE_LIST.METHOD}
                                                        fullWidth={true}
                                                    />
                                                    // <FormikSelectComponent
                                                    //     required={true}
                                                    //     formikField={field}
                                                    //     options={allProvidersList}
                                                    //     displayWith={(option: IUser) => (option?.first_name || option?.last_name) ? option?.first_name + " " + option?.last_name : "-"}
                                                    //     valueExtractor={(option: IUser) => option}
                                                    //     label={'Service'}
                                                    //     fullWidth={true}
                                                    // />
                                                )
                                            }
                                        </Field>
                                        <Field name={'appointment_type'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikSelectComponent
                                                        formikField={field}
                                                        options={APPOINTMENT_TYPES}
                                                        required={true}
                                                        displayWith={(option: any) => (option.label)}
                                                        valueExtractor={(option: any) => option.key}
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
                                                    />
                                                )
                                            }
                                        </Field>

                                        <Field name={'case'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikAutoCompleteComponent
                                                        label={'Service'}
                                                        placeholder={'Service'}
                                                        formikField={field}
                                                        displayWith={item => item ? item?.name : ''}
                                                        keyExtractor={item => item?._id}
                                                        valueExtractor={item => item}
                                                        searchMode={'serverSide'}
                                                        required={true}
                                                        url={APIConfig.SERVICE_LIST.URL(values.service_category._id)}
                                                        method={APIConfig.SERVICE_LIST.METHOD}
                                                        fullWidth={true}
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
                                                        options={allProvidersList}
                                                        displayWith={(option: IUser) => (option?.first_name || option?.last_name) ? option?.first_name + " " + option?.last_name : "-"}
                                                        valueExtractor={(option: IUser) => option}
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
                                                                options={allProvidersList}
                                                                displayWith={(option: IUser) => (option?.first_name || option?.last_name) ? option?.first_name + " " + option?.last_name : "-"}
                                                                valueExtractor={(option: IUser) => option}
                                                                label={'Date'}
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
                                                                options={allProvidersList}
                                                                displayWith={(option: any) => (option?.first_name || option?.last_name) ? option?.first_name + " " + option?.last_name : "-"}
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
