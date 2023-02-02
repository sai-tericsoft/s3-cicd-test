import React, {useCallback, useEffect, useRef} from "react";
import "./AppointmentPaymentComponent.scss";
import {CommonService} from "../../../services";
import {IAPIResponseType} from "../../../models/api.model";
import {ImageConfig} from "../../../../constants";
import ButtonComponent from "../../button/ButtonComponent";
import * as Yup from "yup";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";
import {Field, FieldProps, Form, Formik, FormikHelpers, FormikProps} from "formik";
import {RadioButtonComponent} from "../../form-controls/radio-button/RadioButtonComponent";
import FormControlLabelComponent from "../../form-control-label/FormControlLabelComponent";
import FormikInputComponent from "../../form-controls/formik-input/FormikInputComponent";
import FormikSelectComponent from "../../form-controls/formik-select/FormikSelectComponent";
import FormikTextAreaComponent from "../../form-controls/formik-text-area/FormikTextAreaComponent";


interface AppointmentPaymentComponentProps {
    onClose?: () => void,
    onBack?: () => void,
    onComplete?: (values: any) => void,
    details: any
}

const addAppointmentPaymentInitialValues: any = {
    appointmentId: '',
    payment_type: '',
    payment_mode: '',
    promotion_code: '',
    comments: ''
};


const addAppointmentPaymentValidationSchema = Yup.object().shape({
    payment_type: Yup.string().required('Type is required'),
    payment_mode: Yup.mixed().when("type", {
        is: 'current',
        then: Yup.mixed().required('Payment mode is required')
    }),
    promotion_code: Yup.string(),
    amount: Yup.number(),
    comments: Yup.string(),


});

const AppointmentPaymentComponent = (props: AppointmentPaymentComponentProps) => {
    const {onBack, onComplete, details} = props;
    const {paymentModes} = useSelector((state: IRootReducerState) => state.staticData);


    //
    // useEffect(() => {
    //     console.log(details, 'detailsDraft');
    //     if (details && details.service) {
    //         getServiceView(details.service._id);
    //     }
    // }, [getServiceView, details]);


    const onSubmitAppointmentPayment = useCallback((values: any, {setErrors, setSubmitting}: FormikHelpers<any>) => {
            const appointmentId = values.appointmentId;
            delete values.appointmentId;
            if (values.payment_type === 'later') {
                delete values.mode;
            }
            CommonService._appointment.appointmentPayment(appointmentId, values)
                .then((response: IAPIResponseType<any>) => {
                    if (onComplete) {
                        onComplete(response.data);
                    }
                })
                .catch((error: any) => {
                    CommonService.handleErrors(setErrors, error);
                })
                .finally(() => {
                    setSubmitting(false);
                })
        },
        [onComplete],
    );

    const formRef = useRef<FormikProps<any>>(null)

    return (
        <div className={'appointment-payment-component'}>
            <div className="drawer-header">
                <div className="back-btn" onClick={onBack}><ImageConfig.LeftArrow/></div>
                <div className="drawer-title">Secure Checkout</div>
                {/*<ToolTipComponent tooltip={"Close"} position={"left"}>*/}
                {/*    <div className="drawer-close"*/}
                {/*         id={'appointment-close-btn'}*/}
                {/*         onClick={(event) => {*/}
                {/*             if (onClose) {*/}
                {/*                 onClose();*/}
                {/*             }*/}
                {/*         }*/}
                {/*         }><ImageConfig.CloseIcon/></div>*/}
                {/*</ToolTipComponent>*/}
            </div>
            <Formik
                innerRef={formRef}
                validationSchema={addAppointmentPaymentValidationSchema}
                initialValues={{
                    ...addAppointmentPaymentInitialValues,
                    amount: details?.amount || 0,
                    appointmentId: details?._id
                }}
                onSubmit={onSubmitAppointmentPayment}
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
                                <>
                                    <div className={"t-appointment-drawer-form-controls height-100"}>
                                        <div className={'payment-block payment-block-time green-card pdd-15'}>
                                            <div className="block-heading">
                                                Total Amount
                                            </div>
                                            <div className="block-body payment-price ts-row">
                                                $ {details?.amount || 0}
                                            </div>
                                        </div>
                                        <div className="ts-row option-item-wrapper mrg-bottom-15 mrg-top-15">
                                            <label className="ts-col option-item-block">
                                                <div className="option-item">
                                                    <RadioButtonComponent checked={values.payment_type === 'current'}
                                                                          onChange={value => {
                                                                              setFieldValue('payment_type', 'current')
                                                                          }}
                                                                          name={'payment-type'}/>
                                                </div>
                                                <div className="option-item-text">Pay Now</div>
                                            </label>
                                            <label className="ts-col option-item-block">
                                                <div className="option-item">
                                                    <RadioButtonComponent checked={values.payment_type === 'later'}
                                                                          onChange={value => {
                                                                              setFieldValue('payment_type', 'later')
                                                                          }}
                                                                          name={'payment-type'}/>
                                                </div>
                                                <div className="option-item-text">Reserve without paying</div>
                                            </label>
                                        </div>


                                        {values.payment_type === 'current' && <>
                                            <FormControlLabelComponent
                                                label={"Add a gift card or promotion code or voucher"}/>
                                            <Field name={'promotion_code'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikInputComponent
                                                            formikField={field}
                                                            label={'Add a gift card or promotion code or voucher'}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                            <FormControlLabelComponent
                                                label={"Checkout Summary"}/>
                                            <div className="price-holder">
                                                <div className="price-item">
                                                    <div className="price-item-text">Amount (Inc. tax)</div>
                                                    <div className="price-item-amount">$100.00</div>
                                                </div>
                                                <div className="price-item">
                                                    <div className="price-item-text">Discount</div>
                                                    <div className="price-item-amount red">-$10</div>
                                                </div>
                                                <div className="price-item price-item-total">
                                                    <div className="price-item-text">Total Amount</div>
                                                    <div className="price-item-amount green">$110.00</div>
                                                </div>
                                            </div>

                                            <Field name={'payment_mode'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikSelectComponent
                                                            formikField={field}
                                                            required={true}
                                                            options={paymentModes || []}
                                                            displayWith={(option: any) => (option.title)}
                                                            valueExtractor={(option: any) => option.code}
                                                            label={'Payment Mode'}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                            <Field name={'comments'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikTextAreaComponent
                                                            formikField={field}
                                                            label={'Comments'}
                                                            placeholder={'Add comments or transaction ID'}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </>}

                                    </div>
                                    <div className="client-search-btn">
                                        <ButtonComponent disabled={!isValid} type={'submit'} fullWidth={true}
                                                         onClick={onComplete}>Submit</ButtonComponent>
                                    </div>
                                </>
                            </Form>
                        )
                    }
                }
            </Formik>
        </div>
    );
};

export default AppointmentPaymentComponent;
