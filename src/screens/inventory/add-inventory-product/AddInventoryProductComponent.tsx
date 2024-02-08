import "./AddInventoryProductComponent.scss";
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
import {CommonService} from "../../../shared/services";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {Misc, Patterns} from "../../../constants";
import * as Yup from "yup";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";

interface AddInventoryProductComponentProps {

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
    name: Yup.string().required('Product Name is required'),
    code: Yup.string().required('Product Code is required'),
    quantity: Yup.number().required('Quantity is required'),
    price: Yup.number().required('Price is required'),
    image: Yup.mixed().required('Image field is required'),
});

const AddInventoryProductComponent = (props: AddInventoryProductComponentProps) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [addInventoryProductInitialValues] = useState<any>(inventoryProductInitialValues);
    const [isInventoryProductAddInProgress, setIsInventoryProductAddInProgress] = useState<boolean>(false)

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        const payload = {...values};
        setIsInventoryProductAddInProgress(true);
        try {
            CommonService._inventory.AddInventoryProductAPICall(payload)
                .then((response: IAPIResponseType<any>) => {
                    setIsInventoryProductAddInProgress(false);
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    navigate(CommonService._routeConfig.InventoryList());
                }).catch((error: any) => {
                CommonService.handleErrors(setErrors, error, true);
                setIsInventoryProductAddInProgress(false);
            });
        } catch (e) {
            setIsInventoryProductAddInProgress(false);
            console.log(e, 'error');
        }

    }, [navigate]);


    useEffect(() => {
        dispatch(setCurrentNavParams('Add Inventory Product', null, () => {
            navigate(CommonService._routeConfig.InventoryList());
        }));
    }, [navigate, dispatch]);

    const handleCancel = useCallback(() => {
        navigate(CommonService._routeConfig.InventoryList());
    }, [navigate]);

    return (
        <div className={'add-inventory-product-component'}>
            <FormControlLabelComponent label={"Add Product"} size={'xl'}/>
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
                                <div className={'ts-row'}>
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
                                                        label={'Price (Incl.tax)'}
                                                        placeholder={'Enter Price (Incl.tax)'}
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
                            <CardComponent title={"Upload Image*"} className={'file-upload'}>
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
                                <ButtonComponent
                                    variant={"outlined"}
                                    id={"cancel_btn"}
                                    size={"large"}
                                    className={"cancel-cta"}
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </ButtonComponent>
                                &nbsp;
                                <ButtonComponent
                                    type={"submit"}
                                    size={"large"}
                                    className={'mrg-left-15'}
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
    );

};

export default AddInventoryProductComponent;
