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

interface EditInventoryProductDetailsComponentProps {

}

const inventoryProductInitialValues = {
    name: '',
    code: '',
    quantity: '',
    price: '',
    description: '',
    image: '',
}

const inventoryProductValidationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    code: Yup.string().required('Code is required'),
    quantity: Yup.number().required('Quantity is required'),
    price: Yup.number().required('Price is required'),
    image: Yup.mixed().required('Image field is required'),
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
                    }, [validateForm, values]);
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
                                <Field name={'code'}>
                                    {
                                        (field: FieldProps) => (
                                            <FormikInputComponent
                                                titleCase={true}
                                                label={'Product Code'}
                                                formikField={field}
                                                fullWidth={true}
                                                required={true}
                                            />
                                        )
                                    }
                                </Field>
                                <div className={'ts-row'}>
                                    <div className={'ts-col-md-6'}>
                                        <Field name={'quantity'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        titleCase={true}
                                                        label={'Quantity'}
                                                        formikField={field}
                                                        fullWidth={true}
                                                        required={true}
                                                        validationPattern={Patterns.POSITIVE_WHOLE_NUMBERS}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    <div className={'ts-col-md-6'}>
                                        <Field name={'price'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        titleCase={true}
                                                        label={'Price'}
                                                        formikField={field}
                                                        fullWidth={true}
                                                        required={true}
                                                        validationPattern={Patterns.POSITIVE_INTEGERS_PARTIAL}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                </div>
                            </CardComponent>
                            <CardComponent title={"Upload Image"}>
                                <>
                                    {

                                        (!values.image) && <>
                                            <FilePickerComponent maxFileCount={1}
                                                                 id={"sc_upload_btn"}
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
                                                    setFieldValue('image', undefined);
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
                                        id={"inventory_product_edit_cancel_btn"}
                                    >
                                        Cancel
                                    </ButtonComponent>
                                </LinkComponent>
                                &nbsp;
                                <ButtonComponent
                                    type={"submit"}
                                    isLoading={isInventoryProductEditInProgress}
                                    disabled={!isValid || isInventoryProductEditInProgress}
                                    id={"inventory_product_edit_save_btn"}
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
