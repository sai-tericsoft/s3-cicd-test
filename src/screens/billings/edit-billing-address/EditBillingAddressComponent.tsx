import "./EditBillingAddressComponent.scss";
import React, {useCallback, useEffect, useState} from "react";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import * as Yup from "yup";
import _ from "lodash";
import {CommonService} from "../../../shared/services";
import {ImageConfig, Misc, Patterns} from "../../../constants";
import FormikCheckBoxComponent from "../../../shared/components/form-controls/formik-check-box/FormikCheckBoxComponent";
import FormikPhoneInputComponent
    from "../../../shared/components/form-controls/formik-phone-input/FormikPhoneInputComponent";

interface EditBillingAddressComponentProps {
    billing_address?: any;
    clientId: string;
    onCancel: () => void;
    onSave: (billing_address: any) => void;
    afterSave?: () => void;
    onClose?: () => void;
}

const BillingAddressFormValidationSchema = Yup.object({
    name: Yup.string().required("Name of Client/Organisation"),
    address_line: Yup.string().required("Address Line is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    zip_code: Yup.string().required("ZIP Code is required"),
    country: Yup.string().required("Country is required"),
    phone: Yup.string()
        .test('is-ten-digits', 'Phone number must contain exactly 10 digits', function (value) {
            if (value) {
                return value.length === 10;
            }
            return true; // Allow empty value
        })
});


const BillingAddressFormInitialValues = {
    name: "",
    address_line: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
    phone: "",
    is_default: false,
}

const EditBillingAddressComponent = (props: EditBillingAddressComponentProps) => {
    const [billingAddressFormInitialValues, setBillingAddressFormInitialValues] = useState<any>(_.cloneDeep(BillingAddressFormInitialValues));
    const {billing_address, afterSave, onCancel, onClose, onSave} = props;

    useEffect(() => {
        setBillingAddressFormInitialValues(billing_address);
    }, [billing_address]);

    const onBillingAddressFormSubmit = useCallback((values: any, {setSubmitting, setErrors}: FormikHelpers<any>) => {
        setSubmitting(true);
        CommonService._client.UpdateClientBillingAddress(billing_address?._id, values)
            .then((response: any) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                onSave(values);
                afterSave && afterSave();
                setSubmitting(false);
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error);
                setSubmitting(false);
            });
    }, [billing_address?._id, onSave, afterSave]);

    return (
        <div className={'edit-billing-address-component'}>
            <div className="drawer-header">
                {
                    <div className="back-btn" onClick={onCancel}>
                        <div className={'back-arrow'}><ImageConfig.LeftArrow/></div>
                        <div className={'back-text'}>Back</div>
                    </div>
                }
                {
                    <div className="back-btn"/>
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
                    const {values, validateForm, isValid, isSubmitting, setFieldValue} = formik;
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    useEffect(() => {
                        validateForm();
                    }, [validateForm, values]);
                    return (
                        <Form className="t-form edit-billing-address-form" noValidate={true}>
                            <FormControlLabelComponent size={"xl"} label={"Edit Billing Address"}
                                                       className="pdd-bottom-10"/>
                            <div className="t-form-controls">
                                <Field name={`name`} className="t-form-control">
                                    {
                                        (field: FieldProps) => (
                                            <FormikInputComponent
                                                label={"Name of Client/Organization"}
                                                placeholder={"Name of Client/Organization"}
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
                                                label={'Phone Number'}
                                                placeholder={'Enter Phone Number'}
                                                formikField={field}
                                                required={true}
                                                fullWidth={true}
                                            />
                                        )
                                    }
                                </Field>
                                <Field name={`address_line`} className="t-form-control">
                                    {
                                        (field: FieldProps) => (
                                            <FormikInputComponent
                                                label={"Address Line"}
                                                placeholder={"Enter Address Line"}
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
                                                placeholder={"Enter City"}
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
                                                placeholder={"Enter State"}
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
                                                label={"ZIP Code"}
                                                placeholder={"Enter ZIP Code"}
                                                required={true}
                                                validationPattern={Patterns.FIVE_DIGITS_ONLY}
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
                                                placeholder={"Enter Country"}
                                                required={true}
                                                fullWidth={true}
                                                formikField={field}
                                            />
                                        )
                                    }
                                </Field>

                                {billing_address && billing_address?.is_default === false &&
                                    < Field name={`is_default`} className="t-form-control">
                                        {
                                            (field: FieldProps) => (
                                                <FormikCheckBoxComponent
                                                    label={"Set as Default Address"}
                                                    required={true}
                                                    formikField={field}
                                                    onChange={(isChecked) => {
                                                        if (isChecked) {
                                                            setFieldValue("is_default", true);
                                                        }
                                                    }}
                                                />
                                            )
                                        }
                                    </Field>
                                }
                            </div>
                            <div className="t-form-actions mrg-bottom-0">
                                {/*<ButtonComponent variant={"outlined"}*/}
                                {/*                 onClick={onCancel}>*/}
                                {/*    Cancel*/}
                                {/*</ButtonComponent>&nbsp;&nbsp;*/}
                                <ButtonComponent
                                    type="submit"
                                    fullWidth={true}
                                    isLoading={isSubmitting}
                                    disabled={isSubmitting || !isValid}
                                >
                                    Update
                                </ButtonComponent>
                            </div>
                        </Form>
                    )
                        ;
                }}
            </Formik>
        </div>
    );

};

export default EditBillingAddressComponent;
