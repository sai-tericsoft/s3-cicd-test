import "./ServiceCategoryAddComponent.scss";
import {IServiceCategory, IServiceCategoryAddForm} from "../../../../shared/models/service-category.model";
import * as Yup from "yup";
import React, {useCallback, useEffect, useState} from "react";
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

interface ServiceCategoryAddComponentProps {
    onAdd: (data: IServiceCategory) => void;
}

const serviceCategoryAddFormValidationSchema = Yup.object({
    name: Yup.string()
        .required("Service Category Name is required"),
    description: Yup.string()
        .required("Description is required"),
    image: Yup.mixed()
        .required("Image is required")
});

const ServiceCategoryAddComponent = (props: ServiceCategoryAddComponentProps) => {

    const {onAdd} = props;

    const [serviceCategoryAddFormInitialValues] = useState<IServiceCategoryAddForm>({
        name: "",
        description: "",
        image: "",
    });

    const [isServiceCategoryAddInProgress, setIsServiceCategoryAddInProgress] = useState(false);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        setIsServiceCategoryAddInProgress(true);
        const formData = CommonService.getFormDataFromJSON(values);
        CommonService._serviceCategory.ServiceCategoryAddAPICall(formData)
            .then((response: IAPIResponseType<IServiceCategory>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsServiceCategoryAddInProgress(false);
                onAdd(response.data);
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error, true);
                setIsServiceCategoryAddInProgress(false);
            })
    }, [onAdd]);

    return (
        <div className="service-category-add-component">
            <div className="service-category-add-form-container">
                <div className={'service-category-add-heading'}>Add New Service Category</div>
                <Formik
                    validationSchema={serviceCategoryAddFormValidationSchema}
                    initialValues={serviceCategoryAddFormInitialValues}
                    validateOnChange={false}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    validateOnMount={true}
                    onSubmit={onSubmit}
                >
                    {({values, touched, errors, setFieldValue, setFieldTouched, validateForm}) => {
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        useEffect(() => {
                            validateForm();
                        }, [validateForm, values]);
                        return (
                            <Form className="t-form" noValidate={true}>
                                {/*<FormDebuggerComponent values={values} errors={errors}/>*/}
                                <div className="t-form-controls">
                                    <div className={'mrg-top-5'}>
                                        <Field name={'name'} className="t-form-control">
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        label={'Service Category Name'}
                                                        placeholder={'Enter Service Category Name'}
                                                        type={"text"}
                                                        required={true}
                                                        formikField={field}
                                                        fullWidth={true}
                                                        titleCase={true}
                                                        id={"sc_name_input"}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    <Field name={'description'} className="t-form-control">
                                        {
                                            (field: FieldProps) => (
                                                <FormikTextAreaComponent
                                                    label={'Description'}
                                                    placeholder={'Enter Description'}
                                                    formikField={field}
                                                    fullWidth={true}
                                                    id={"sc_desc_input"}
                                                    required={true}
                                                />
                                            )
                                        }
                                    </Field>
                                    <div className="mrg-bottom-20">
                                        <FormControlLabelComponent size={"sm"}
                                                                   label={"Upload Image for Service Category *"}
                                        />
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
                                                                         acceptedFilesText={"PNG, JPG and JPEG files are allowed upto 10MB"}
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
                                    </div>
                                </div>
                                <div className="t-form-actions">
                                    <ButtonComponent
                                        isLoading={isServiceCategoryAddInProgress}
                                        type={"submit"}
                                        fullWidth={true}
                                        id={"sc_save_btn"}
                                    >
                                        {isServiceCategoryAddInProgress ? "Saving" : "Save"}
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

export default ServiceCategoryAddComponent;
