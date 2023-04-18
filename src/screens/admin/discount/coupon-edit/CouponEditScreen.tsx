import "./CouponEditScreen.scss";
import * as Yup from "yup";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import React, {useCallback, useEffect, useState} from "react";
import _ from "lodash";
import {getAllServiceList} from "../../../../store/actions/service.action";
import {setCurrentNavParams} from "../../../../store/actions/navigation.action";
import {CommonService} from "../../../../shared/services";
import {Field, FieldArray, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {ImageConfig, Misc} from "../../../../constants";
import CardComponent from "../../../../shared/components/card/CardComponent";
import FormikInputComponent from "../../../../shared/components/form-controls/formik-input/FormikInputComponent";
import FormikDatePickerComponent
    from "../../../../shared/components/form-controls/formik-date-picker/FormikDatePickerComponent";
import moment from "moment";
import FormikTextAreaComponent
    from "../../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import FormikCheckBoxComponent
    from "../../../../shared/components/form-controls/formik-check-box/FormikCheckBoxComponent";
import LinkComponent from "../../../../shared/components/link/LinkComponent";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import {IRootReducerState} from "../../../../store/reducers";
import {getCouponDetails} from "../../../../store/actions/discount.action";

interface CouponEditScreenProps {

}

const CouponEditInitialValues: any = {
    title: '',
    start_date: '',
    end_date: '',
    min_billing_amount: '',
    usage_limit: '',
    description: '',
    discount_type: '',
    percentage: '',
    max_discount_amount: '',
    amount: '',
    service_categories: [],
};
const couponEditValidationSchema = Yup.object({
    title: Yup.string().required('Title is required and must have at least 3 characters'),
    code: Yup.string().required('Coupon code is required'),
    start_date: Yup.string().required('Start date is required'),
    end_date: Yup.string().required('End date is required'),
    min_billing_amount: Yup.number().required('Minimum billing amount is required'),
    usage_limit: Yup.number().required('Usage limit is required'),

});
const CouponEditScreen = (props: CouponEditScreenProps) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {couponId} = useParams();

    const [editCouponInitialValues, setEditCouponInitialValues] = useState<any>(_.cloneDeep(CouponEditInitialValues));
    const [isEditCouponInProgress, setIsEditCouponInProgress] = useState<boolean>(false);
    const {allServiceList} = useSelector((state: any) => state.service);
    const {
        couponDetails,
    } = useSelector((state: IRootReducerState) => state.discount);

    useEffect(() => {
        dispatch(getAllServiceList())
    }, [dispatch]);

    useEffect(() => {
        if (couponId) {
            dispatch(getCouponDetails(couponId));
        }
    }, [dispatch, couponId]);

    useEffect(() => {
        if (couponDetails) {
            setEditCouponInitialValues({
                title: couponDetails?.title,
                code: couponDetails?.code,
                start_date: couponDetails?.start_date,
                end_date: couponDetails?.end_date,
                min_billing_amount: couponDetails?.min_billing_amount,
                usage_limit: couponDetails?.usage_limit,
                description: couponDetails?.description,
                discount_type: couponDetails?.discount_type,
                percentage: couponDetails?.percentage,
                max_discount_amount: couponDetails?.max_discount_amount,
                amount: couponDetails?.amount,
                service_categories: couponDetails?.linked_services?.filter((item: any) =>
                    item?.services?.length > 0).map((item: any) => {
                    return {
                        category_id: item?._id,
                          // services: item?.services?.map((service: any) => service?._id),
                        category_name: item?.category_name,
                        services: item?.services?.map((service: any) => {
                            return {
                                service_id: service?._id,
                                name: service?.name,

                            }
                        })
                    }
                }),
            });
        }
    }, [couponDetails]);

    console.log("cc", couponDetails?.linked_services?.filter((item: any) => item?.services?.length > 0).map((item: any) => {
        return {
            category_id: item?._id,
            // services: item?.services?.map((service: any) => service?._id),
            category_name: item?.category_name,
            services: item?.services?.map((service: any) => {
                return {
                    service_id: service?._id,
                      name: service?.name,

                }
            })
        }
    }),);

    console.log("couponDetails", couponDetails);

    useEffect(() => {
        if (couponId) {
            dispatch(setCurrentNavParams("", null, () => {
                navigate(CommonService._routeConfig.CouponViewDetails(couponId));
            }));
        }
    }, [dispatch, navigate, couponId]);

    const onCouponAddSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        if (couponId) {
            const payload = _.cloneDeep(values);
            payload.start_date = moment(payload?.start_date).format('YYYY-MM-DD');
            payload.end_date = moment(payload?.end_date).format('YYYY-MM-DD');
            const linked_service_categories = payload?.service_categories?.filter((item: any) => item?.services?.length > 0);
            const linked_service_categories_transformed = linked_service_categories.map((item: any) => {
                return {
                    category_id: item.category_id,
                    services: item?.services?.filter((service: any) => service.is_selected).map((service: any) => service?.service_id)
                }
            });
            payload.linked_services = linked_service_categories_transformed;
            delete payload.service_categories;
            setIsEditCouponInProgress(true);
            CommonService._discountService.CouponEditAPICall(couponId, payload)
                .then((response: any) => {
                    setIsEditCouponInProgress(false);
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                }).catch((error: any) => {
                setIsEditCouponInProgress(false);
                CommonService.handleErrors(setErrors, error, true);
            });
        }
    }, [])

    return (
        <div className={'coupon-edit-screen'}>
            <div className={'edit-coupon-heading'}>
                Edit Coupon Details
            </div>
            <Formik initialValues={editCouponInitialValues}
                    validationSchema={couponEditValidationSchema}
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
                                                        disabled={true}
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
                                <div className={'discount-type-wrapper'}>
                                    <div className={'select-discount-heading'}>
                                        Select the type of discount you want to offer:
                                    </div>
                                    <div className={'discount-type-text'}>
                                        {couponDetails?.discount_type}
                                    </div>
                                </div>
                                {couponDetails?.discount_type === "percentage" && <>
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
                                                            disabled={true}
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
                                                            disabled={true}
                                                            required={true}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                    </div>
                                </>}
                                {couponDetails?.discount_type === 'amount' && <>
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
                                                            disabled={true}
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
                                <FieldArray name={'service_categories'}
                                            render={(arrayHelpers) => (
                                                <>
                                                    {allServiceList?.map((service_category: any, index: any) => {
                                                        // console.log('service_category', (service_category?.services?.filter((service: any) => service?.is_selected)?.length > 0));
                                                        // console.log('service_category', (service_category?.services?.length !== service_category?.services?.filter((service: any) => service?.is_selected)?.length));
                                                        return <><Field
                                                            name={`service_categories.${index}.is_selected`}>
                                                            {
                                                                (field: FieldProps) => (
                                                                    <FormikCheckBoxComponent formikField={field}
                                                                                             label={service_category.name}
                                                                                             onChange={(isChecked: any) => {
                                                                                                 const serviceIds = service_category.services?.map((service: any) => {
                                                                                                     return {
                                                                                                         service_id: service?._id,
                                                                                                         is_selected: true
                                                                                                     }
                                                                                                 });
                                                                                                 if (isChecked) {
                                                                                                     setFieldValue(`service_categories.${index}.is_selected`, true);
                                                                                                     setFieldValue(`service_categories.${index}.category_id`, service_category._id);
                                                                                                     setFieldValue(`service_categories.${index}.services`, serviceIds);
                                                                                                 } else {
                                                                                                     setFieldValue(`service_categories.${index}.category_id`, null);
                                                                                                     setFieldValue(`service_categories.${index}.services`, []);
                                                                                                 }
                                                                                             }}
                                                                    />
                                                                )
                                                            }
                                                        </Field>
                                                            <div>
                                                                {service_category?.services?.map((service: any, serviceIndex: any) => {
                                                                    return <div
                                                                        key={service._id}
                                                                        className={'mrg-left-20'}>
                                                                        <Field
                                                                            name={`service_categories[${index}].services[${serviceIndex}.is_selected`}>
                                                                            {
                                                                                (field: FieldProps) => (
                                                                                    <FormikCheckBoxComponent
                                                                                        formikField={field}
                                                                                        label={service.name}
                                                                                        onChange={(isChecked: any) => {
                                                                                            const selectedServices = values?.service_categories[index]?.services?.filter((service: any) => service?.is_selected);
                                                                                            if (isChecked) {
                                                                                                setFieldValue(`service_categories.${index}.services[${serviceIndex}].service_id`, service._id);
                                                                                                setFieldValue(`service_categories.${index}.category_id`, service_category._id);
                                                                                                selectedServices.push({
                                                                                                    service_id: service._id,
                                                                                                    is_selected: true
                                                                                                });
                                                                                            } else {
                                                                                                selectedServices.splice(serviceIndex, 1);
                                                                                            }
                                                                                            const services = service_category?.services;
                                                                                            console.log('services', values?.service_categories[index]?.services);
                                                                                            console.log('selectedServices', selectedServices);
                                                                                            if (selectedServices?.length === services?.length) {
                                                                                                setFieldValue(`service_categories.${index}.is_selected`, true);
                                                                                            } else {
                                                                                                setFieldValue(`service_categories.${index}.is_selected`, false);
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
                                {couponId &&
                                    <LinkComponent route={CommonService._routeConfig.CouponViewDetails(couponId)}>
                                        <ButtonComponent
                                            variant={"outlined"}
                                            disabled={isEditCouponInProgress}
                                            id={"medical_record_add_cancel_btn"}
                                        >
                                            Cancel
                                        </ButtonComponent>
                                    </LinkComponent>
                                }
                                &nbsp;
                                <ButtonComponent
                                    isLoading={isEditCouponInProgress}
                                    type={"submit"}
                                    disabled={!isValid || isEditCouponInProgress}
                                    id={"medical_record_add_save_btn"}
                                >
                                    {isEditCouponInProgress ? "Saving" : "Save"}
                                </ButtonComponent>
                            </div>
                        </Form>
                    )
                }}

            </Formik>
        </div>
    );

};

export default CouponEditScreen;