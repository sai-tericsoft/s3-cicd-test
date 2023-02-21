import React, {useCallback, useEffect, useRef} from "react";
import "./BookAppointmentPaymentComponent.scss";
import {ImageConfig} from "../../../../constants";
import ButtonComponent from "../../button/ButtonComponent";
import {RadioButtonComponent} from "../../form-controls/radio-button/RadioButtonComponent";
import {Field, FieldProps, Form, Formik, FormikHelpers, FormikProps} from "formik";
import * as Yup from "yup";
import FormikInputComponent from "../../form-controls/formik-input/FormikInputComponent";
import FormControlLabelComponent from "../../form-control-label/FormControlLabelComponent";
import FormikSelectComponent from "../../form-controls/formik-select/FormikSelectComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";
import FormikTextAreaComponent from "../../form-controls/formik-text-area/FormikTextAreaComponent";
import {CommonService} from "../../../services";
import {IAPIResponseType} from "../../../models/api.model";
import ToolTipComponent from "../../tool-tip/ToolTipComponent";


interface BookAppointmentPaymentComponentProps {
    onClose?: () => void,
    onBack?: () => void,
    onComplete?: (values: any) => void,
    booking: any
}

const addAppointmentPaymentInitialValues: any = {
    appointmentId: '',
    payment_type: '',
    mode: '',
    promotion_code: '',
    comments: ''
};


const addAppointmentPaymentValidationSchema = Yup.object().shape({
    payment_type: Yup.string().required('Payment type is required'),
    mode: Yup.mixed().when("payment_type", {
        is: 'current',
        then: Yup.mixed().required('Payment mode is required')
    }),
    promotion_code: Yup.string(),
    amount: Yup.number(),
    comments: Yup.string(),
});

const BookAppointmentPaymentComponent = (props: BookAppointmentPaymentComponentProps) => {
    const {onClose, onComplete, booking} = props;
    const {paymentModes} = useSelector((state: IRootReducerState) => state.staticData);


    //
    // useEffect(() => {
    //     console.log(booking, 'bookingDraft');
    //     if (booking && booking.service) {
    //         getServiceView(booking.service._id);
    //     }
    // }, [getServiceView, booking]);


    const onSubmitAppointmentPayment = useCallback((values: any, {setErrors, setSubmitting}: FormikHelpers<any>) => {
            const appointmentId = values.appointmentId;
            delete values.appointmentId;
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
        <div className={'book-appointment-payment-component'}>
            <div className="drawer-header">
                {/*<div className="back-btn" onClick={onBack}><ImageConfig.LeftArrow/></div>*/}
                <div className="drawer-title">Secure Checkout</div>
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
            <Formik
                innerRef={formRef}
                validationSchema={addAppointmentPaymentValidationSchema}
                initialValues={{
                    ...addAppointmentPaymentInitialValues,
                    amount: booking?.amount || 0,
                    appointmentId: booking?._id
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
                                                $ {booking?.amount || 0}
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
                                                    <RadioButtonComponent checked={values.payment_type === 'reserved'}
                                                                          onChange={value => {
                                                                              setFieldValue('payment_type', 'reserved')
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
                                                    <div className="price-item-amount">${booking.amount}.00</div>
                                                </div>
                                                <div className="price-item">
                                                    <div className="price-item-text">Discount</div>
                                                    <div className="price-item-amount red">$0</div>
                                                </div>
                                                <div className="price-item price-item-total">
                                                    <div className="price-item-text">Total Amount</div>
                                                    <div className="price-item-amount green">${booking.amount}.00</div>
                                                </div>
                                            </div>

                                            <Field name={'mode'}>
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
                                        >Submit</ButtonComponent>
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

export default BookAppointmentPaymentComponent;
