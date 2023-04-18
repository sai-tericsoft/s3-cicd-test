import "./CouponAddScreen.scss";
import {useNavigate} from "react-router-dom";
import React, {useCallback, useEffect, useState} from "react";
import {setCurrentNavParams} from "../../../../store/actions/navigation.action";
import {CommonService} from "../../../../shared/services";
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import {Field, FieldArray, FieldProps, Form, Formik, FormikHelpers} from "formik";
import CardComponent from "../../../../shared/components/card/CardComponent";
import FormikInputComponent from "../../../../shared/components/form-controls/formik-input/FormikInputComponent";
import FormikDatePickerComponent
    from "../../../../shared/components/form-controls/formik-date-picker/FormikDatePickerComponent";
import moment from "moment/moment";
import {ImageConfig, Misc} from "../../../../constants";
import FormikTextAreaComponent
    from "../../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import FormikRadioButtonGroupComponent
    from "../../../../shared/components/form-controls/formik-radio-button/FormikRadioButtonComponent";
import LinkComponent from "../../../../shared/components/link/LinkComponent";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import * as Yup from "yup";
import {getAllServiceList} from "../../../../store/actions/service.action";
import FormikCheckBoxComponent
    from "../../../../shared/components/form-controls/formik-check-box/FormikCheckBoxComponent";

interface CouponAddScreenProps {

}

const CouponAddInitialValues: any = {
    title: '',
    code: '',
    start_date: '',
    end_date: '',
    min_billing_amount: '',
    usage_limit: '',
    description: '',
    discount_type: '',
    percentage: '',
    max_discount_amount: '',
    amount: '',
    services: [],
};
const couponAddValidationSchema = Yup.object({
    title: Yup.string().matches(/^[a-zA-Z0-9]+$/, 'Must be alphanumeric').min(3).required('Title is required and must have at least 3 characters'),
    code: Yup.string().required('Coupon code is required'),
    start_date: Yup.string().required('Start date is required'),
    end_date: Yup.string().required('End date is required'),
    min_billing_amount: Yup.number().required('Minimum billing amount is required'),
    usage_limit: Yup.number().required('Usage limit is required'),
    discount_type: Yup.string().required('Discount type is required'),
    percentage: Yup.number().when('discount_type', {
        is: 'percentage',
        then: Yup.number().required('Percentage is required')
    }),
    max_discount_amount: Yup.number().when('discount_type', {
        is: 'percentage',
        then: Yup.number().required('Maximum discount amount is required')
    }),
    amount: Yup.number().when('discount_type', {
        is: 'amount',
        then: Yup.number().required('Amount is required')
    }),
});
const CouponAddScreen = (props: CouponAddScreenProps) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [addCouponInitialValues] = useState<any>(_.cloneDeep(CouponAddInitialValues));
    const [isAddCouponInProgress, setIsAddCouponInProgress] = useState<boolean>(false);
    const {allServiceList} = useSelector((state: any) => state.service);


    useEffect(() => {
        dispatch(getAllServiceList())
    }, [dispatch]);

    console.log('allServiceList', allServiceList)

    useEffect(() => {
        dispatch(setCurrentNavParams("", null, () => {
            navigate(CommonService._routeConfig.DiscountList());
        }));
    }, [dispatch, navigate])

    const onCouponAddSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        const payload = {...values};
        setIsAddCouponInProgress(true);
        CommonService._discountService.CouponAddAPICall(payload)
            .then((response: any) => {
                setIsAddCouponInProgress(false);
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
            }).catch((error: any) => {
            setIsAddCouponInProgress(false);
            CommonService.handleErrors(setErrors, error, true);
        });
    }, [])


    return (
        <div className={'coupon-add-screen'}>
            <div className={'add-coupon-heading'}>
                Add Coupon
            </div>
            <Formik initialValues={addCouponInitialValues}
                    validationSchema={couponAddValidationSchema}
                    onSubmit={onCouponAddSubmit}
                    validateOnChange={false}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    validateOnMount={true}>
                {({values, isValid, touched, errors, setFieldValue, validateForm}) => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    useEffect(() => {
                        validateForm();
                    }, [validateForm, values]);
                    return (
                        <Form className="t-form" noValidate={true}>
                            <CardComponent title={'Coupon Details'}>
                                <div className={'ts-row'}>
                                    <div className={'ts-col-md-6'}>
                                        <Field name={'title'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        titleCase={true}
                                                        label={'Title'}
                                                        formikField={field}
                                                        fullWidth={true}
                                                        required={true}
                                                        placeholder={'Title'}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    <div className={'ts-col-md-6'}>
                                        <Field name={'code'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        titleCase={true}
                                                        label={'Coupon Code'}
                                                        formikField={field}
                                                        fullWidth={true}
                                                        required={true}
                                                        placeholder={'Coupon Code'}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                </div>
                                <div className={'ts-row'}>
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
                                <div className={'ts-row'}>
                                    <div className={'currency-field'}>
                                        <ImageConfig.DollarSymbol/>
                                    </div>
                                    <div className={'minimum-billing-amount-wrapper'}>
                                        <Field name={'min_billing_amount'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        titleCase={true}
                                                        label={'Minimum Billing Amount'}
                                                        formikField={field}
                                                        type={'number'}
                                                        fullWidth={true}
                                                        required={true}
                                                        placeholder={'Minimum Billing Amount'}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    <div className={'ts-col-md-6'}>
                                        <Field name={'usage_limit'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        titleCase={true}
                                                        label={'Usage Limit Per User'}
                                                        formikField={field}
                                                        type={'number'}
                                                        fullWidth={true}
                                                        required={true}
                                                        placeholder={'Minimum Billing Amount'}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                </div>
                                <div className={'ts-row'}>
                                    <div className={'ts-col-md-12'}>
                                        <Field name={'description'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikTextAreaComponent
                                                        label={'Description'}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                </div>
                            </CardComponent>
                            <CardComponent title={'Discount Type'}>
                                <div className={'d-flex ts-align-items-center'}>
                                    <div className={'select-discount-heading'}>
                                        Select the type of discount you want to offer:*
                                    </div>
                                    <div className={'mrg-bottom-20'}>
                                        <Field name={'discount_type'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikRadioButtonGroupComponent
                                                        options={CommonService._staticData.discountType}
                                                        required={true}
                                                        displayWith={(option) => option.title}
                                                        valueExtractor={(option) => option.code}
                                                        formikField={field}
                                                        onChange={(value: any) => {
                                                            console.log('value', value);
                                                            if (value === 'percentage') {
                                                                setFieldValue('amount', '');
                                                            } else {
                                                                setFieldValue('percentage', '');
                                                                setFieldValue('max_discount_amount', '');
                                                            }
                                                        }}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                </div>
                                {values?.discount_type === "percentage" && <>
                                    <div className={'ts-row'}>
                                        <div className={'currency-field'}>
                                            <ImageConfig.PercentageSymbol/>
                                        </div>
                                        <div className="ts-col-lg-5">
                                            <Field name={'percentage'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikInputComponent
                                                            titleCase={true}
                                                            label={'Percent'}
                                                            type={'number'}
                                                            placeholder={'Percent'}
                                                            formikField={field}
                                                            required={true}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                    </div>
                                    <div className={'ts-row'}>
                                        <div className={'currency-field'}>
                                            <ImageConfig.DollarSymbol/>
                                        </div>
                                        <div className="ts-col-lg-5">
                                            <Field name={'max_discount_amount'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikInputComponent
                                                            titleCase={true}
                                                            label={'Max Discount Amount'}
                                                            placeholder={'Max Discount Amount'}
                                                            formikField={field}
                                                            type={'number'}
                                                            required={true}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                    </div>
                                </>}
                                {values?.discount_type === 'amount' && <>
                                    <div className={'ts-row'}>
                                        <div className={'currency-field'}>
                                            <ImageConfig.DollarSymbol/>
                                        </div>
                                        <div className="ts-col-lg-5">
                                            <Field name={'amount'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikInputComponent
                                                            titleCase={true}
                                                            label={'Amount'}
                                                            type={'number'}
                                                            placeholder={'Amount'}
                                                            formikField={field}
                                                            required={true}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                    </div>
                                </>}
                            </CardComponent>
                            <CardComponent title={'Coupon Valid On'}>
                                <div className={'coupon-valid-on-service-text'}>
                                    Coupon will be valid on the following service(s):
                                </div>
                                <FieldArray name={'services'}
                                            render={(arrayHelpers) => (
                                                <>
                                                    {allServiceList?.map((service_category: any) => {
                                                        // console.log('service_category',service_category);
                                                        return <> <Field
                                                            name={`service_category.${service_category._id}`}>
                                                            {
                                                                (field: FieldProps) => (
                                                                    <FormikCheckBoxComponent formikField={field}
                                                                                             name={`service_category.${service_category._id}`}
                                                                                             label={service_category.name}
                                                                                             onChange={(isChecked: any) => {
                                                                                                 if (isChecked) {
                                                                                                     arrayHelpers.push(service_category._id);
                                                                                                 } else {
                                                                                                     const index = values.services.findIndex((service: any) => service === service_category._id);
                                                                                                     arrayHelpers.remove(index);
                                                                                                 }
                                                                                             }}

                                                                    />
                                                                )
                                                            }
                                                        </Field>
                                                            <div>
                                                                {service_category?.services?.map((service: any) => {
                                                                    return <div className={'mrg-left-20'}>
                                                                        <Field name={`service.${service._id}`}>
                                                                            {
                                                                                (field: FieldProps) => (
                                                                                    <FormikCheckBoxComponent
                                                                                        formikField={field}
                                                                                        name={`service.${service._id}`}
                                                                                        label={service.name}
                                                                                        onChange={(isChecked: any) => {
                                                                                            if (isChecked) {
                                                                                                arrayHelpers.push(service._id);
                                                                                            } else {
                                                                                                const index = values.services.findIndex((service: any) => service === service._id);
                                                                                                arrayHelpers.remove(index);
                                                                                            }
                                                                                        }}

                                                                                    />
                                                                                )
                                                                            }
                                                                        </Field>
                                                                    </div>
                                                                })}
                                                            </div>
                                                        </>

                                                    })}
                                                </>
                                            )}
                                />
                            </CardComponent>
                            <div className="t-form-actions">
                                {
                                    <LinkComponent route={CommonService._routeConfig.DiscountList()}>
                                        <ButtonComponent
                                            variant={"outlined"}
                                            disabled={isAddCouponInProgress}
                                            id={"medical_record_add_cancel_btn"}
                                        >
                                            Cancel
                                        </ButtonComponent>
                                    </LinkComponent>
                                }
                                &nbsp;
                                <ButtonComponent
                                    isLoading={isAddCouponInProgress}
                                    type={"submit"}
                                    disabled={!isValid || isAddCouponInProgress}
                                    id={"medical_record_add_save_btn"}
                                >
                                    {isAddCouponInProgress ? "Saving" : "Save"}
                                </ButtonComponent>
                            </div>
                        </Form>
                    )
                }}

            </Formik>
        </div>
    );

};

export default CouponAddScreen;