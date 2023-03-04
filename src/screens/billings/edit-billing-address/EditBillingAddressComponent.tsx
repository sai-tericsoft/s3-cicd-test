import "./EditBillingAddressComponent.scss";
import React, {useCallback, useEffect, useState} from "react";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import * as Yup from "yup";
import _ from "lodash";
import {CommonService} from "../../../shared/services";
import {Misc} from "../../../constants";

interface EditBillingAddressComponentProps {
    billing_address: any;
    clientId: string;
    onCancel: () => void;
    onSave: (billing_address: any) => void;
}

const BillingAddressFormValidationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    address_line: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    zip_code: Yup.string().required("Zip Code is required"),
    country: Yup.string().required("Country is required"),
    phone: Yup.string().required("Phone is required")
});

const BillingAddressFormInitialValues = {
    name: "",
    address_line: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
    phone: ""
}

const EditBillingAddressComponent = (props: EditBillingAddressComponentProps) => {
    const [billingAddressFormInitialValues, setBillingAddressFormInitialValues] = useState<any>(_.cloneDeep(BillingAddressFormInitialValues));
    const {billing_address, clientId, onSave, onCancel} = props;

    useEffect(() => {
        setBillingAddressFormInitialValues(billing_address);
    }, [billing_address]);

    const onBillingAddressFormSubmit = useCallback((values: any, {setSubmitting, setErrors}: FormikHelpers<any>) => {
        console.log('submitting');
        setSubmitting(true);
        CommonService._client.UpdateClientBillingAddress(clientId, values)
            .then((response: any) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                onSave(values);
                setSubmitting(false);
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error);
                setSubmitting(false);
            });
    }, [clientId, onSave]);

    return (
        <div className={'edit-billing-address-component'}>
            <Formik
                validationSchema={BillingAddressFormValidationSchema}
                initialValues={billingAddressFormInitialValues}
                validateOnChange={false}
                validateOnBlur={true}
                enableReinitialize={true}
                validateOnMount={true}
                onSubmit={onBillingAddressFormSubmit}
            >
                {(formik) => {
                    const {values, validateForm, isValid, isSubmitting} = formik;
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    useEffect(() => {
                        validateForm();
                    }, [validateForm, values]);
                    return (
                        <Form className="t-form edit-billing-address-form" noValidate={true}>
                            <FormControlLabelComponent label={"Edit Billing To"}/>
                            <div className="t-form-controls">
                                <Field name={`name`} className="t-form-control">
                                    {
                                        (field: FieldProps) => (
                                            <FormikInputComponent
                                                label={"Name of the Client/Organisation"}
                                                required={true}
                                                fullWidth={true}
                                                formikField={field}
                                            />
                                        )
                                    }
                                </Field>
                                <Field name={`phone`} className="t-form-control">
                                    {
                                        (field: FieldProps) => (
                                            <FormikInputComponent
                                                label={"Phone Number"}
                                                required={true}
                                                fullWidth={true}
                                                formikField={field}
                                            />
                                        )
                                    }
                                </Field>
                                <Field name={`address_line`} className="t-form-control">
                                    {
                                        (field: FieldProps) => (
                                            <FormikInputComponent
                                                label={"Address line"}
                                                required={true}
                                                fullWidth={true}
                                                formikField={field}
                                            />
                                        )
                                    }
                                </Field>
                                <Field name={`city`} className="t-form-control">
                                    {
                                        (field: FieldProps) => (
                                            <FormikInputComponent
                                                label={"City"}
                                                required={true}
                                                fullWidth={true}
                                                formikField={field}
                                            />
                                        )
                                    }
                                </Field>
                                <Field name={`state`} className="t-form-control">
                                    {
                                        (field: FieldProps) => (
                                            <FormikInputComponent
                                                label={"State"}
                                                required={true}
                                                fullWidth={true}
                                                formikField={field}
                                            />
                                        )
                                    }
                                </Field>
                                <Field name={`zip_code`} className="t-form-control">
                                    {
                                        (field: FieldProps) => (
                                            <FormikInputComponent
                                                label={"Zip Code"}
                                                required={true}
                                                fullWidth={true}
                                                formikField={field}
                                            />
                                        )
                                    }
                                </Field>
                                <Field name={`country`} className="t-form-control">
                                    {
                                        (field: FieldProps) => (
                                            <FormikInputComponent
                                                label={"Country"}
                                                required={true}
                                                fullWidth={true}
                                                formikField={field}
                                            />
                                        )
                                    }
                                </Field>
                            </div>
                            <div className="t-form-actions">
                                <ButtonComponent variant={"outlined"}
                                                 onClick={onCancel}>
                                    Cancel
                                </ButtonComponent>&nbsp;&nbsp;
                                <ButtonComponent
                                    type="submit"
                                    isLoading={isSubmitting}
                                    disabled={isSubmitting || !isValid}
                                >
                                    Save
                                </ButtonComponent>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );

};

export default EditBillingAddressComponent;
