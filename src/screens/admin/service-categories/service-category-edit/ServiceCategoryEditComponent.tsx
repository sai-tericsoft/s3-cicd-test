import "./ServiceCategoryEditComponent.scss";
import {IServiceCategory, IServiceCategoryEditForm} from "../../../../shared/models/service-category.model";
import * as Yup from "yup";
import {useCallback, useEffect, useState} from "react";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {CommonService} from "../../../../shared/services";
import {IAPIResponseType} from "../../../../shared/models/api.model";
import {Misc} from "../../../../constants";
import FormikInputComponent from "../../../../shared/components/form-controls/formik-input/FormikInputComponent";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import FormControlLabelComponent from "../../../../shared/components/form-control-label/FormControlLabelComponent";
import FilePickerComponent from "../../../../shared/components/file-picker/FilePickerComponent";
import _ from "lodash";
import ErrorComponent from "../../../../shared/components/error/ErrorComponent";
import FilePreviewThumbnailComponent
    from "../../../../shared/components/file-preview-thumbnail/FilePreviewThumbnailComponent";
import FormikTextAreaComponent
    from "../../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import FormikSwitchComponent from "../../../../shared/components/form-controls/formik-switch/FormikSwitchComponent";

interface ServiceCategoryEditComponentProps {
    serviceCategory: IServiceCategory;
    onEdit: (data: IServiceCategory) => void;
}

const serviceCategoryEditFormValidationSchema = Yup.object({
    name: Yup.string()
        .required("Name is required"),
    description: Yup.string()
        .nullable(),
    image: Yup.mixed()
        .required("Image is required"),
    is_active: Yup.mixed()
        .required("Is active is required"),
});

const ServiceCategoryEditComponent = (props: ServiceCategoryEditComponentProps) => {

    const {serviceCategory, onEdit} = props;
    
    console.log(serviceCategory);

    const [serviceCategoryEditFormInitialValues, setServiceCategoryEditFormInitialValues] = useState<IServiceCategoryEditForm>({
        name: "",
        image: "",
        description: "",
        is_active: false
    });

    const [isServiceCategoryEditInProgress, setIsServiceCategoryEditInProgress] = useState(false);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        setIsServiceCategoryEditInProgress(true);
        const formData = CommonService.getFormDataFromJSON(values);
        CommonService._serviceCategory.ServiceCategoryEditAPICall(serviceCategory._id, formData)
            .then((response: IAPIResponseType<IServiceCategory>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsServiceCategoryEditInProgress(false);
                onEdit(response.data);
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error);
                setIsServiceCategoryEditInProgress(false);
            })
    }, [serviceCategory, onEdit]);

    useEffect(() => {
        if (serviceCategory) {
            setServiceCategoryEditFormInitialValues({
                name: serviceCategory.name,
                description: serviceCategory.description,
                image: undefined,
                is_active: serviceCategory.is_active
            });
            CommonService.generateBlobFileFromUrl(serviceCategory.image_url, serviceCategory.name, "image/jpg")
                .then((response) => {
                    setServiceCategoryEditFormInitialValues((oldSate) => {
                        return {
                            ...oldSate,
                            image: response
                        }
                    })
                });
        }
    }, [serviceCategory]);

    return (
        <div className="service-category-add-component">
            <div className="service-category-add-form-container">
                <Formik
                    validationSchema={serviceCategoryEditFormValidationSchema}
                    initialValues={serviceCategoryEditFormInitialValues}
                    validateOnChange={false}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    validateOnMount={true}
                    onSubmit={onSubmit}
                >
                    {({values, touched, errors, setFieldValue, validateForm}) => {
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        useEffect(() => {
                            validateForm();
                        }, [validateForm, values]);
                        return (
                            <Form className="t-form" noValidate={true}>
                                <div className={"mrg-bottom-20 display-flex align-items-center justify-content-space-between"}>
                                    <FormControlLabelComponent label={"Edit Service Category"}
                                                               size={"lg"}
                                                               className={"mrg-bottom-0"}
                                                               required={true}/>
                                    <div className={"display-flex align-items-center"}>
                                        <div>Status:</div>
                                        <Field name={'is_active'} className="t-form-control">
                                            {
                                                (field: FieldProps) => (
                                                    <FormikSwitchComponent
                                                        label={values.is_active ? "Active" : "Inactive"}
                                                        required={true}
                                                        formikField={field}
                                                        labelPlacement={"start"}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                </div>
                                <div className="t-form-controls">
                                    <Field name={'name'} className="t-form-control">
                                        {
                                            (field: FieldProps) => (
                                                <FormikInputComponent
                                                    label={'Name'}
                                                    placeholder={'Enter Name'}
                                                    type={"text"}
                                                    required={true}
                                                    formikField={field}
                                                    fullWidth={true}
                                                    id={"sc_input"}
                                                />
                                            )
                                        }
                                    </Field>
                                    <Field name={'description'} className="t-form-control">
                                        {
                                            (field: FieldProps) => (
                                                <FormikTextAreaComponent
                                                    label={'Description'}
                                                    placeholder={'Enter Description'}
                                                    formikField={field}
                                                    fullWidth={true}
                                                    id={"sc_desc_input"}
                                                />
                                            )
                                        }
                                    </Field>
                                    <div className="mrg-bottom-20">
                                        <FormControlLabelComponent label={"Upload Image for Service Category"}
                                                                   required={true}/>
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
                                                                         acceptedFileTypes={{
                                                                             'image/*': []
                                                                         }}
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
                                                    <FilePreviewThumbnailComponent removable={true}
                                                                                   file={values.image}
                                                                                   removeButtonId={"sc_delete_img"}
                                                                                   onRemove={() => {
                                                                                       setFieldValue('image', undefined);
                                                                                   }}
                                                    />
                                                </>
                                            }
                                        </>
                                    </div>
                                </div>
                                <div className="t-form-actions">
                                    <ButtonComponent
                                        isLoading={isServiceCategoryEditInProgress}
                                        type={"submit"}
                                        fullWidth={true}
                                        id={"sc_save_btn"}
                                    >
                                        {isServiceCategoryEditInProgress ? "Saving" : "Save"}
                                    </ButtonComponent>
                                </div>
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </div>
    );

};

export default ServiceCategoryEditComponent;