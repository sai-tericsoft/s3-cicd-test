import "./AddInventoryProductComponent.scss";
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
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {Misc, Patterns} from "../../../constants";
import * as Yup from "yup";
import FormikSelectComponent from "../../../shared/components/form-controls/formik-select/FormikSelectComponent";
import FormDebuggerComponent from "../../../shared/components/form-debugger/FormDebuggerComponent";

interface AddInventoryProductComponentProps {

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

const AddInventoryProductComponent = (props: AddInventoryProductComponentProps) => {

        const dispatch = useDispatch();
        const navigate = useNavigate();
        const [addInventoryProductInitialValues] = useState<any>(inventoryProductInitialValues);
        const [isInventoryProductAddInProgress, setIsInventoryProductAddInProgress] = useState<boolean>(false);

        const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
            const payload = {...values};
            setIsInventoryProductAddInProgress(true);
            CommonService._inventory.AddInventoryProductAPICall(payload)
                .then((response: IAPIResponseType<any>) => {
                    setIsInventoryProductAddInProgress(false);
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    navigate(CommonService._routeConfig.InventoryList());
                }).catch((error: any) => {
                CommonService.handleErrors(setErrors, error, true);
                setIsInventoryProductAddInProgress(false);
            });

        }, [navigate]);


        useEffect(() => {
            dispatch(setCurrentNavParams('Add Inventory Product', null, () => {
                navigate(CommonService._routeConfig.InventoryList());
            }));
        }, [navigate, dispatch]);

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
        },[]);


        return (
            <div className={'add-inventory-product-component'}>
                <PageHeaderComponent title={'Add Product'}/>
                <Formik initialValues={addInventoryProductInitialValues}
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
                        }, [setFieldValue,validateForm, values]);
                        return (
                            <Form className="t-form" noValidate={true}>
                                <FormDebuggerComponent values={values} errors={errors} showDebugger={true}/>
                                <CardComponent title={"Product"}>
                                    <Field name={'name'}>
                                        {
                                            (field: FieldProps) => (
                                                <FormikInputComponent
                                                    titleCase={true}
                                                    label={'Product Name'}
                                                    placeholder={'Enter Product Name'}
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
                                                    placeholder={'Enter Description'}
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
                                <CardComponent title={"Upload Image *"} className={'file-upload'}>
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
                                                                     acceptedFilesText={"PNG and JPEG files are allowed"}
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
                                    <LinkComponent route={CommonService._routeConfig.InventoryList()}>
                                        <ButtonComponent
                                            variant={"outlined"}
                                            id={"cancel_btn"}
                                            size={"large"}
                                            className={"cancel-cta"}
                                        >
                                            Cancel
                                        </ButtonComponent>
                                    </LinkComponent>
                                    &nbsp;
                                    <ButtonComponent
                                        type={"submit"}
                                        size={"large"}
                                        isLoading={isInventoryProductAddInProgress}
                                        disabled={!isValid || isInventoryProductAddInProgress}
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
        )
            ;

    }
;

export default AddInventoryProductComponent;
