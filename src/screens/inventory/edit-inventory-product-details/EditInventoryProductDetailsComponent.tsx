import './EditInventoryProductDetailsComponent.scss';
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import React, {useCallback, useEffect, useState} from "react";
import CardComponent from "../../../shared/components/card/CardComponent";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import FilePickerComponent from "../../../shared/components/file-picker/FilePickerComponent";
import _ from "lodash";
import ErrorComponent from "../../../shared/components/error/ErrorComponent";
import FilePreviewThumbnailComponent
    from "../../../shared/components/file-preview-thumbnail/FilePreviewThumbnailComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import {CommonService} from "../../../shared/services";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {Misc, Patterns} from "../../../constants";
import * as Yup from "yup";
import {IRootReducerState} from "../../../store/reducers";
import FormikSelectComponent from "../../../shared/components/form-controls/formik-select/FormikSelectComponent";

interface EditInventoryProductDetailsComponentProps {

}

const inventoryProductInitialValues = {
    name: '',
    code: '',
    quantity: '',
    price: '',
    description: '',
    image: '',
    retail_price: '',
    sale_price: '',
    discount_type: '',
    discount: ''
}

const inventoryProductValidationSchema = Yup.object({
    name: Yup.string().required('Product Name is required'),
    code: Yup.string().required('Product Code is required'),
    quantity: Yup.number().required('Quantity is required'),
    image: Yup.mixed().required('Image field is required'),
    retail_price: Yup.number().required('Retail Price is required'),
    discount_type: Yup.string().required('Discount Type is required'),
    discount: Yup.number().when('discount_type', {
        is: (discountType: any) => ['amount', 'percentage'].includes(discountType),
        then: Yup.number()
            .when('discount_type', {
                is: 'amount',
                then: Yup.number()
                    .required('Discount is required when Discount Type is specified')
                    .max(
                        Yup.ref('retail_price'),
                        'Discount Amount cannot be greater than Retail Price'
                    ).required('Discount is required'),
            })
            .when('discount_type', {
                is: 'percentage',
                then: Yup.number()
                    .required('Discount is required when Discount Type is specified')
                    .max(100, 'Discount Percentage cannot be greater than 100').required('Discount is required'),
            }),
    }),
});


const EditInventoryProductDetailsComponent = (props: EditInventoryProductDetailsComponentProps) => {

    const {productId} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        inventoryProductDetails
    } = useSelector((state: IRootReducerState) => state.inventory);
    const [editInventoryProductInitialValues, setEditInventoryProductInitialValues] = useState<any>(inventoryProductInitialValues);
    const [isInventoryProductEditInProgress, setIsInventoryProductEditInProgress] = useState<boolean>(false);


    useEffect(() => {
        if (productId) {
            setEditInventoryProductInitialValues({
                name: inventoryProductDetails?.name,
                code: inventoryProductDetails?.code,
                quantity: inventoryProductDetails?.quantity,
                price: inventoryProductDetails?.price,
                description: inventoryProductDetails?.description,
                image: inventoryProductDetails?.image,
                retail_price: inventoryProductDetails?.retail_price,
                sale_price: inventoryProductDetails?.sale_price,
                discount_type: inventoryProductDetails?.discount_type,
                discount: inventoryProductDetails?.discount
            })
        }

    }, [productId, inventoryProductDetails]);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        if (productId) {
            const payload = _.cloneDeep(values);
            if (!(payload.image instanceof File)) {
                delete payload.image;
            }
            const formData = CommonService.getFormDataFromJSON(payload);
            setIsInventoryProductEditInProgress(true);
            CommonService._inventory.InventoryProductEditAPICall(productId, formData)
                .then((response: IAPIResponseType<any>) => {
                    setIsInventoryProductEditInProgress(false);
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    navigate(CommonService._routeConfig.InventoryProductViewDetails(productId));
                }).catch((error: any) => {
                CommonService.handleErrors(setErrors, error, true);
                setIsInventoryProductEditInProgress(false);
            });
        }
    }, [navigate, productId]);

    useEffect(() => {
        if (productId) {
            dispatch(setCurrentNavParams('Edit Inventory Product', null, () => {
                navigate(CommonService._routeConfig.InventoryProductViewDetails(productId));
            }));
        }
    }, [navigate, dispatch, productId]);

    const calculateSalePrice = useCallback((retailPrice: any, discountType: any, discount: any) => {
        if (!retailPrice || !discountType) {
            return null;
        }
        switch (discountType) {
            case 'percentage'   :
                if (discount === 100) return 0;
                const discountAmount = (retailPrice * discount) / 100;
                return retailPrice - discountAmount;
            case 'amount'   :
                if ((retailPrice - discount) > 0) {
                    return retailPrice - discount;
                } else if ((retailPrice - discount) === 0) {
                    return 0;
                }
                return null;

            case'n/a':
                return retailPrice;
            default:
                return null;
        }
    }, []);

    return (
        <div className={'edit-inventory-product-component'}>
            <PageHeaderComponent title={'Edit Product'}/>
            <Formik initialValues={editInventoryProductInitialValues}
                    onSubmit={onSubmit}
                    validationSchema={inventoryProductValidationSchema}
                    validateOnChange={false}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    validateOnMount={true}>
                {({values, isValid, touched, errors, setFieldValue, validateForm}) => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    useEffect(() => {
                        validateForm();
                        calculateSalePrice(values?.retail_price, values?.discount_type, values?.discount);
                        setFieldValue('sale_price', calculateSalePrice(values?.retail_price, values?.discount_type, values?.discount));
                    }, [validateForm, values,setFieldValue]);
                    return (
                        <Form className="t-form" noValidate={true}>
                            <CardComponent title={"Product"}>
                                <Field name={'name'}>
                                    {
                                        (field: FieldProps) => (
                                            <FormikInputComponent
                                                titleCase={true}
                                                label={'Product Name'}
                                                formikField={field}
                                                fullWidth={true}
                                                required={true}
                                            />
                                        )
                                    }
                                </Field>
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
                            </CardComponent>
                            <CardComponent title={"Product Details"}>
                                <div className={'ts-row'}>
                                    <div className={'ts-col-md-6'}>
                                        <Field name={'code'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        titleCase={true}
                                                        label={'Product Code'}
                                                        placeholder={'Enter Product Code'}
                                                        formikField={field}
                                                        fullWidth={true}
                                                        required={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>

                                    <div className={'ts-col-md-6'}>
                                        <Field name={'quantity'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        titleCase={true}
                                                        label={'Quantity'}
                                                        placeholder={'Enter Quantity'}
                                                        formikField={field}
                                                        fullWidth={true}
                                                        required={true}
                                                        validationPattern={Patterns.POSITIVE_INTEGERS_WITH_DECIMALS}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                </div>
                                <div className={'ts-row'}>
                                    <div className={'ts-col-md-6'}>
                                        <Field name={'retail_price'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        titleCase={true}
                                                        label={'Retail Price'}
                                                        placeholder={'Retail Price'}
                                                        formikField={field}
                                                        fullWidth={true}
                                                        required={true}
                                                        validationPattern={Patterns.POSITIVE_INTEGERS_WITH_DECIMALS}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    <div className={'ts-col-md-6'}>
                                        <Field name={'sale_price'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        titleCase={true}
                                                        label={'Sale Price'}
                                                        disabled={true}
                                                        placeholder={'Sale Price'}
                                                        formikField={field}
                                                        fullWidth={true}
                                                        required={true}
                                                        validationPattern={Patterns.POSITIVE_INTEGERS_WITH_DECIMALS}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                </div>
                                <div className={'ts-row'}>
                                    <div className={'ts-col-md-6'}>
                                        <Field name={'discount_type'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikSelectComponent
                                                        label={'Discount Type'}
                                                        options={CommonService._staticData.discountTypeForInventory}
                                                        displayWith={item => item?.title}
                                                        valueExtractor={item => item?.code}
                                                        formikField={field}
                                                        fullWidth={true}
                                                        required={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    {
                                        (values.discount_type === 'percentage') && <div className={'ts-col-md-6'}>
                                            <Field name={'discount'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikInputComponent
                                                            titleCase={true}
                                                            label={'Percentage of Retail Price'}
                                                            placeholder={'Percentage of Retail Price'}
                                                            prefix={'%'}
                                                            formikField={field}
                                                            fullWidth={true}
                                                            required={true}
                                                            validationPattern={Patterns.POSITIVE_INTEGERS_WITH_DECIMALS}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                    }
                                    {
                                        (values.discount_type === 'amount') && <div className={'ts-col-md-6'}>
                                            <Field name={'discount'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikInputComponent
                                                            titleCase={true}
                                                            label={'Sale Price (Incl.tax)'}
                                                            placeholder={'Sale Price (Incl.tax)'}
                                                            prefix={'$'}
                                                            formikField={field}
                                                            fullWidth={true}
                                                            required={true}
                                                            validationPattern={Patterns.POSITIVE_INTEGERS_WITH_DECIMALS}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                    }

                                </div>
                            </CardComponent>
                            <CardComponent title={"Upload Image"}>
                                <>
                                    {

                                        (!values.image) && <>
                                            <FilePickerComponent maxFileCount={1}
                                                                 id={"upload_btn"}
                                                                 onFilesDrop={(acceptedFiles, rejectedFiles) => {
                                                                     if (acceptedFiles && acceptedFiles.length > 0) {
                                                                         const file = acceptedFiles[0];
                                                                         setFieldValue('image', file);
                                                                     }
                                                                 }}
                                                                 acceptedFilesText={"PNG, JPG and JPEG files are allowed"}
                                                                 acceptedFileTypes={["png", "jpg", "jpeg"]}
                                            />
                                            {
                                                (_.get(touched, "image") && !!(_.get(errors, "image"))) &&
                                                <ErrorComponent
                                                    errorText={(_.get(errors, "image"))}/>
                                            }
                                        </>
                                    }
                                </>
                                <>
                                    {
                                        (values.image) && <>
                                            <FilePreviewThumbnailComponent
                                                file={values.image}
                                                removeButtonId={"sc_delete_img"}
                                                onRemove={() => {
                                                    setFieldValue('image', '');
                                                }}
                                            />
                                        </>
                                    }
                                </>
                            </CardComponent>
                            <div className="t-form-actions">
                                <LinkComponent
                                    route={CommonService._routeConfig.InventoryProductViewDetails(inventoryProductDetails?._id)}>
                                    <ButtonComponent
                                        variant={"outlined"}
                                        id={"cancel_btn"}
                                    >
                                        Cancel
                                    </ButtonComponent>
                                </LinkComponent>
                                &nbsp;
                                <ButtonComponent
                                    type={"submit"}
                                    isLoading={isInventoryProductEditInProgress}
                                    disabled={!isValid || isInventoryProductEditInProgress}
                                    id={"save_btn"}
                                >
                                    Save
                                </ButtonComponent>
                            </div>
                        </Form>
                    )
                }}

            </Formik>
        </div>
    );

};

export default EditInventoryProductDetailsComponent;
