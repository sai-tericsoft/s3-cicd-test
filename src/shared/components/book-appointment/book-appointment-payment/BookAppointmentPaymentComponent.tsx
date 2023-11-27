import React, {useCallback, useEffect, useRef, useState} from "react";
import "./BookAppointmentPaymentComponent.scss";
import ButtonComponent from "../../button/ButtonComponent";
import {RadioButtonComponent} from "../../form-controls/radio-button/RadioButtonComponent";
import {Field, FieldProps, Form, Formik, FormikHelpers, FormikProps} from "formik";
import * as Yup from "yup";
import FormControlLabelComponent from "../../form-control-label/FormControlLabelComponent";
import FormikSelectComponent from "../../form-controls/formik-select/FormikSelectComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";
import FormikTextAreaComponent from "../../form-controls/formik-text-area/FormikTextAreaComponent";
import {CommonService} from "../../../services";
import {IAPIResponseType} from "../../../models/api.model";
import HorizontalLineComponent from "../../horizontal-line/horizontal-line/HorizontalLineComponent";
import {ImageConfig} from "../../../../constants";


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
    available_coupons: '',
    comments: ''
};


const addAppointmentPaymentValidationSchema = Yup.object().shape({
    payment_type: Yup.string().required('Payment type is required'),
    mode: Yup.mixed().when("payment_type", {
        is: 'current',
        then: Yup.mixed().required('Payment Mode is required')
    }),
    available_coupons: Yup.mixed(),
    amount: Yup.number(),
    comments: Yup.string(),
});

const BookAppointmentPaymentComponent = (props: BookAppointmentPaymentComponentProps) => {
    const {onComplete, booking,onClose,onBack} = props;
    const {paymentModes} = useSelector((state: IRootReducerState) => state.staticData);
    const [availableCouponsList, setAvailableCouponsList] = useState<any[]>([]);
    const [selectedCoupon, setSelectedCoupon] = useState<any>(undefined);
    const [discountAmount, setDiscountAmount] = useState<number>(0);
    const [payableAmount, setPayableAmount] = useState<number>(0);

    const onCouponSelect = useCallback((value: any) => {
        setSelectedCoupon(value);
        if (value.discount_type === 'amount') {
            setDiscountAmount(value.amount)
            const totalPayableAmount = booking?.amount - value.amount
            setPayableAmount(totalPayableAmount);
        } else {
            let totalPayableAmount;
            const finalDiscountAmount = CommonService.calculateFinalAmountFromDiscountPercentage(value.percentage, booking?.amount)
            setDiscountAmount(finalDiscountAmount);
            if (finalDiscountAmount > value.max_discount_amount) {
                totalPayableAmount = booking?.amount - value.max_discount_amount
            } else {
                totalPayableAmount = booking?.amount - finalDiscountAmount
            }
            setPayableAmount(totalPayableAmount);
        }
    }, [booking]);

    const getAvailableCouponsList = useCallback(() => {
        const payload = {
            service_id: booking?.service_id,
            amount: booking?.amount,
            client_id: booking?.client_id,
        }
        CommonService._appointment.getAvailableCouponList(payload)
            .then((response: IAPIResponseType<any>) => {
                if (response?.data) {
                    setAvailableCouponsList(response.data);
                }
            })
            .catch((error: any) => {
                CommonService._alert.showToast(error.error || error.errors || "Failed to fetch", "error");
            });
    }, [booking]);


    useEffect(() => {
        getAvailableCouponsList();
    }, [getAvailableCouponsList]);

    const onSubmitAppointmentPayment = useCallback((values: any, {setErrors, setSubmitting}: any) => {
        const appointmentId = values.appointmentId;
        delete values.appointmentId;
        CommonService._appointment.appointmentPayment(appointmentId, {
            ...values,
            total: +values?.amount,
            discount: 0,
            coupon_id: selectedCoupon?._id
        })
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
    }, [onComplete, selectedCoupon?._id]);

    const createBooking = useCallback((values: any, {setErrors, setSubmitting}: FormikHelpers<any>) => {
            //medical_record_id
            setSubmitting(true);
            const payload: any = {
                ...booking
            }
            CommonService._appointment.addAppointment(payload)
                .then((response: IAPIResponseType<any>) => {
                    if (response?.data) {
                        onSubmitAppointmentPayment({
                            ...values,
                            appointmentId: response.data._id
                        }, {setErrors, setSubmitting})

                    }
                })
                .catch((error: any) => {
                    // CommonService.handleErrors(errors);
                })
                .finally(() => {
                    setSubmitting(true);
                })
        },
        [booking, onSubmitAppointmentPayment],
    );


    const formRef = useRef<FormikProps<any>>(null)

    return (
        <div className={'book-appointment-payment-component'}>
            <div className="drawer-header">
                <div className="back-btn" onClick={onBack}><ImageConfig.LeftArrow/></div>
                {/*<ToolTipComponent tooltip={"Close"} position={"left"}>*/}
                <div className="drawer-close"
                     id={'book-appointment-close-btn'}
                     onClick={(event) => {
                         if (onClose) {
                             onClose();
                         }
                     }
                     }><ImageConfig.CloseIcon/></div>
            </div>
            <div className="secure-checkout-title">Secure Checkout</div>
            <Formik
                innerRef={formRef}
                validationSchema={addAppointmentPaymentValidationSchema}
                initialValues={{
                    ...addAppointmentPaymentInitialValues,
                    amount: booking?.amount || 0,
                }}
                onSubmit={createBooking}
                validateOnChange={false}
                validateOnBlur={true}
                enableReinitialize={true}
                validateOnMount={true}>
                {
                    ({values, isValid, errors, setFieldValue, validateForm, isSubmitting}) => {
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        useEffect(() => {
                            validateForm();
                        }, [validateForm, values]);
                        return (
                            <Form className="t-form" noValidate={true}>
                                <>
                                    <div className={"t-appointment-drawer-form-controls height-100"}>
                                        <div className={'payment-block payment-block-time blue-card pdd-15'}>
                                            <div className="block-heading">
                                                Total Amount
                                            </div>
                                            <div className="block-body payment-price ts-row">
                                                $ {CommonService.convertToDecimals(+booking?.amount) || 0}
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
                                                label={"Add a gift card or promotion code or voucher"}
                                                className={'add-gift-card-msg'}/>
                                            <Field name={'available_coupons'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikSelectComponent
                                                            formikField={field}
                                                            size={"small"}
                                                            fullWidth={true}
                                                            isClear={true}
                                                            label={'Available Coupons'}
                                                            options={availableCouponsList}
                                                            displayWith={(option: any) => option?.title}
                                                            valueExtractor={(option: any) => option}
                                                            onUpdate={(value: any) => {
                                                                onCouponSelect(value);
                                                            }}


                                                        />
                                                    )
                                                }
                                            </Field>
                                            <FormControlLabelComponent
                                                label={"Checkout Summary"} className={'checkout-summary'}/>
                                            <div className="price-holder">
                                                <div className="price-item">
                                                    <div className="price-item-text">Amount (Inc. tax)</div>
                                                    <div
                                                        className="price-item-amount amount">${CommonService.convertToDecimals(+booking?.amount)}</div>
                                                </div>
                                                <div className="price-item">
                                                    <div className="price-item-text discount">Discount</div>
                                                    <div className="price-item-amount red">
                                                        {selectedCoupon ? `- $${CommonService.convertToDecimals(discountAmount)}` :
                                                            <div className={'zero-discount'}>$0.00</div> || 'N/A'}

                                                    </div>
                                                </div>
                                                <HorizontalLineComponent className={'horizontal-line'}/>
                                                <div className="price-item price-item-total">
                                                    <div className="price-item-text">Total Amount (Inc.tax)</div>
                                                    <div className="price-item-amount green">
                                                        ${selectedCoupon ? CommonService.convertToDecimals(payableAmount) : CommonService.convertToDecimals(+booking?.amount)}
                                                    </div>
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
                                    <div className="client-search-btn mrg-top-5">
                                        <ButtonComponent
                                            disabled={!isValid}
                                            isLoading={isSubmitting}
                                            type={'submit'}
                                            fullWidth={true}
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


