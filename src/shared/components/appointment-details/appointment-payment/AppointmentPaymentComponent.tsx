import React, {useCallback, useEffect, useRef, useState} from "react";
import "./AppointmentPaymentComponent.scss";
import {CommonService} from "../../../services";
import {IAPIResponseType} from "../../../models/api.model";
import ButtonComponent from "../../button/ButtonComponent";
import * as Yup from "yup";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";
import {Field, FieldProps, Form, Formik, FormikHelpers, FormikProps} from "formik";
import FormControlLabelComponent from "../../form-control-label/FormControlLabelComponent";
import FormikSelectComponent from "../../form-controls/formik-select/FormikSelectComponent";
import FormikTextAreaComponent from "../../form-controls/formik-text-area/FormikTextAreaComponent";
import HorizontalLineComponent from "../../horizontal-line/horizontal-line/HorizontalLineComponent";


interface AppointmentPaymentComponentProps {
    onClose?: () => void,
    onBack?: () => void,
    onComplete?: (values: any) => void,
    details: any;
    previousStep?: string;
}

const addAppointmentPaymentInitialValues: any = {
    appointmentId: '',
    payment_type: '',
    payment_mode: '',
    available_coupons: '',
    comments: ''
};


const addAppointmentPaymentValidationSchema = Yup.object().shape({
    // payment_type: Yup.string().when('previousStep', {
    //     is: (previousStep: string) => previousStep !== 'ViewAppointmentDetails',
    //     then: Yup.string().required('Payment type is required'),
    // }),
    payment_mode: Yup.mixed().required('Payment mode is required'),
    promotion_code: Yup.string(),
    amount: Yup.number(),
    comments: Yup.string(),
});

const AppointmentPaymentComponent = (props: AppointmentPaymentComponentProps) => {

    const {onComplete, details } = props;
    const {paymentModes} = useSelector((state: IRootReducerState) => state.staticData);
    const [availableCouponsList, setAvailableCouponsList] = useState<any[]>([]);
    const [selectedCoupon, setSelectedCoupon] = useState<any>(undefined);
    const [discountAmount, setDiscountAmount] = useState<number>(0);
    const [payableAmount, setPayableAmount] = useState<number>(0);


    const onCouponSelect = useCallback((value: any) => {
        setSelectedCoupon(value);
        if (value.discount_type === 'amount') {
            setDiscountAmount(value.amount)
            const totalPayableAmount = details?.amount - value.amount
            setPayableAmount(totalPayableAmount);
        } else {
            let totalPayableAmount;
            const finalDiscountAmount = CommonService.calculateFinalAmountFromDiscountPercentage(value.percentage, details?.amount)
            setDiscountAmount(finalDiscountAmount)
            if (finalDiscountAmount > value.max_discount_amount) {
                totalPayableAmount = details?.amount - value.max_discount_amount
            } else {
                totalPayableAmount = details?.amount - finalDiscountAmount
            }
            setPayableAmount(totalPayableAmount);
        }
    }, [details]);

    const getAvailableCouponsList = useCallback(() => {
        const payload = {
            service_id: details?.service_id,
            amount: details?.amount,
            client_id: details?.client_id,
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
    }, [details]);

    useEffect(() => {
        getAvailableCouponsList();
    }, [getAvailableCouponsList]);


    const onSubmitAppointmentPayment = useCallback((values: any, {setErrors, setSubmitting}: FormikHelpers<any>) => {
            const appointmentId = values.appointmentId;
            delete values.appointmentId;
            if (values.payment_type === 'reserved') {
                delete values.payment_mode;
            }
            const payload = {...values, total: +values?.amount, discount: 0, coupon_id: selectedCoupon?._id,payment_type: 'current'}
            CommonService._appointment.appointmentPayment(appointmentId, payload)
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
        [onComplete, selectedCoupon],
    );

    const formRef = useRef<FormikProps<any>>(null)

    return (
        <div className={'appointment-payment-component'}>
            <div className="drawer-header">
                {/*<div className="back-btn" onClick={onBack}>*/}
                {/*    <div><ImageConfig.LeftArrow/></div>*/}
                {/*    <div className={'back-text'}>Back</div>*/}
                {/*</div>*/}
                {/*/!*<ToolTipComponent tooltip={"Close"} position={"left"}>*!/*/}
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
            <div className="secure-checkout-heading">Secure Checkout</div>
            <Formik
                innerRef={formRef}
                validationSchema={addAppointmentPaymentValidationSchema}
                initialValues={{
                    ...addAppointmentPaymentInitialValues,
                    amount: CommonService.convertToDecimals(+(details?.amount)) || 0,
                    appointmentId: details?._id
                }}
                onSubmit={onSubmitAppointmentPayment}
                validateOnChange={false}
                validateOnBlur={true}
                enableReinitialize={true}
                validateOnMount={true}>
                {
                    ({values, isSubmitting, isValid, errors, setFieldValue, validateForm}) => {
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        useEffect(() => {
                            validateForm();
                        }, [validateForm, values]);
                        return (
                            <Form className="t-form" noValidate={true}>
                                {/*<FormDebuggerComponent values={values} errors={errors}/>*/}
                                <>
                                    <div className={"t-appointment-drawer-form-controls height-100"}>
                                        <div
                                            className={'payment-block payment-block-time green-card pdd-15'}>
                                            <div className="block-heading">
                                                Total Amount
                                            </div>
                                            <div className="block-body payment-price ts-row">
                                                ${CommonService.convertToDecimals(+details?.amount) || '0.00'}
                                            </div>
                                        </div>
                                        {/*{previousStep !== 'ViewAppointmentDetails' &&*/}
                                        {/*    <div className="ts-row option-item-wrapper mrg-bottom-15 mrg-top-15">*/}
                                        {/*        <label className="ts-col option-item-block">*/}
                                        {/*            <div className="option-item">*/}
                                        {/*                <RadioButtonComponent*/}
                                        {/*                    checked={values.payment_type === 'current'}*/}
                                        {/*                    onChange={value => {*/}
                                        {/*                        setFieldValue('payment_type', 'current')*/}
                                        {/*                    }}*/}
                                        {/*                    name={'payment-type'}/>*/}
                                        {/*            </div>*/}
                                        {/*            <div className="option-item-text">Pay Now</div>*/}
                                        {/*        </label>*/}
                                        {/*        <label className="ts-col option-item-block">*/}
                                        {/*            <div className="option-item">*/}
                                        {/*                <RadioButtonComponent*/}
                                        {/*                    checked={values.payment_type === 'reserved'}*/}
                                        {/*                    onChange={value => {*/}
                                        {/*                        setFieldValue('payment_type', 'reserved')*/}
                                        {/*                    }}*/}
                                        {/*                    name={'payment-type'}/>*/}
                                        {/*            </div>*/}
                                        {/*            <div className="option-item-text">Reserve without paying</div>*/}
                                        {/*        </label>*/}
                                        {/*    </div>*/}
                                        {/*}*/}
                                            <>
                                                <FormControlLabelComponent
                                                    className={'add-gift-card-msg'}
                                                    label={"Add a gift card or promotion code or voucher"}/>
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
                                                        <div className="price-item-text amount">Amount (Incl. tax)</div>
                                                        <div
                                                            className="price-item-amount">${CommonService.convertToDecimals(+details?.amount)}</div>
                                                    </div>
                                                    <div className="price-item">
                                                        <div className="price-item-text discount">Discount</div>
                                                        <div className="price-item-amount red">
                                                            {/*{selectedCoupon ? `- $ ${CommonService.convertToDecimals(discountAmount)}` : `$0` || 'N/A'}*/}
                                                            {selectedCoupon ? `- $${CommonService.convertToDecimals(discountAmount)}` :
                                                                <div className={'zero-discount'}>$0.00</div> || 'N/A'}

                                                        </div>
                                                    </div>
                                                    <HorizontalLineComponent/>
                                                    <div className="price-item price-item-total">
                                                        <div className="price-item-text">Total Amount</div>
                                                        <div className="price-item-amount green">
                                                            ${selectedCoupon ? CommonService.convertToDecimals(payableAmount) : CommonService.convertToDecimals(+details?.amount)}
                                                        </div>
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
                                            </>

                                    </div>
                                    <div className="client-search-btn">
                                        <ButtonComponent disabled={!isValid || isSubmitting} type={'submit'}
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

export default AppointmentPaymentComponent;
