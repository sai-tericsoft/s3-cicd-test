import "./AddBillingAddressComponent.scss";
import React, {useCallback, useEffect, useState} from "react";
import {Field, FieldProps, Form, Formik} from "formik";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import * as Yup from "yup";
import _ from "lodash";
import FormikCheckBoxComponent from "../../../shared/components/form-controls/formik-check-box/FormikCheckBoxComponent";
import {CommonService} from "../../../shared/services";
import {Misc} from "../../../constants";
import FormikPhoneInputComponent
    from "../../../shared/components/form-controls/formik-phone-input/FormikPhoneInputComponent";

interface AddBillingAddressComponentProps {
    clientId?: string;
    onCancel: () => void;
    onSave: (billing_address: any) => void;
    afterSave?: () => void;
}

const BillingAddressFormValidationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    address_line: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    zip_code: Yup.string().required("Zip Code is required"),
    country: Yup.string().required("Country is required"),
    phone: Yup.string()
        .test('is-ten-digits', 'Phone number must contain exactly 10 digits', function (value) {
            if (value) {
                return value.length === 10;
            }
            return true; // Allow empty value
        })});

const BillingAddressFormInitialValues = {
    name: "",
    address_line: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
    phone: "",
    is_default: false
}

const AddBillingAddressComponent = (props: AddBillingAddressComponentProps) => {

    const [billingAddressFormInitialValues] = useState<any>(_.cloneDeep(BillingAddressFormInitialValues));
    const {clientId,onSave,onCancel,afterSave} = props;

    const onBillingAddressFormSubmit = useCallback((values: any, {setSubmitting, setErrors}: any) => {
        setSubmitting(true);
        if (clientId) {
            CommonService._billingsService.AddBillingAddress(clientId, values)
                .then((response: any) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    setSubmitting(false);
                    onSave(values);
                    afterSave && afterSave();

                })
                .catch((error: any) => {
                    CommonService.handleErrors(setErrors, error);
                    setSubmitting(false);
                });
        }
    }, [afterSave, clientId, onSave]);

    return (
        <div className={'add-billing-address-component'}>
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
                    const {values, validateForm, isValid, isSubmitting,setFieldValue} = formik;
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    useEffect(() => {
                        validateForm();
                    }, [validateForm, values]);
                    return (
                        <Form className="t-form edit-billing-address-form" noValidate={true}>
                            <FormControlLabelComponent size={"lg"} label={"Add Billing To"} className="pdd-bottom-10"/>
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
                                            <FormikPhoneInputComponent
                                                label={"Phone"}
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
                                <Field name={`is_default`} className="t-form-control">
                                    {
                                        (field: FieldProps) => (
                                            <FormikCheckBoxComponent
                                                label={"Set as Default Address"}
                                                required={true}
                                                formikField={field}
                                                onChange={(isChecked) => {
                                                    if (isChecked) {
                                                       setFieldValue("is_default",true);
                                                    }
                                                }}
                                            />
                                        )
                                    }
                                </Field>
                            </div>
                            <div className="t-form-actions mrg-bottom-0">
                                <ButtonComponent variant={"outlined"}
                                                    onClick={onCancel}
                                >
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

export default AddBillingAddressComponent;