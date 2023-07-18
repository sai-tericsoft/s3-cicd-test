import "./ServiceCategoryEditComponent.scss";
import {IServiceCategory, IServiceCategoryEditForm} from "../../../../shared/models/service-category.model";
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
import FormikSwitchComponent from "../../../../shared/components/form-controls/formik-switch/FormikSwitchComponent";
import FormikColorPickerComponent
    from "../../../../shared/components/form-controls/formik-color-picker/FormikColorPickerComponent";

interface ServiceCategoryEditComponentProps {
    serviceCategory: IServiceCategory;
    onEdit: (data: IServiceCategory) => void;
}

const serviceCategoryEditFormValidationSchema = Yup.object({
    name: Yup.string()
        .required("Service Category Name is required"),
    description: Yup.string()
        .required("Description is required"),
    image: Yup.mixed()
        .required("Image is required"),
    is_active: Yup.mixed()
        .required("Is active is required"),
    bg_color_code: Yup.mixed().required('Background Color is required'),
    text_color_code: Yup.mixed().required('Text Color is required')
});

const ServiceCategoryEditComponent = (props: ServiceCategoryEditComponentProps) => {

    const {serviceCategory, onEdit} = props;

    const [serviceCategoryEditFormInitialValues, setServiceCategoryEditFormInitialValues] = useState<IServiceCategoryEditForm>({
        name: "",
        image: "",
        description: "",
        is_active: false,
        bg_color_code: "",
        text_color_code: ""
    });

    const [isServiceCategoryEditInProgress, setIsServiceCategoryEditInProgress] = useState(false);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        const payload = _.cloneDeep(values);
        payload.bg_color_code = JSON.stringify(payload.bg_color_code);
        payload.text_color_code = JSON.stringify(payload.text_color_code);
        if (!(payload.image instanceof File)) {
            delete payload.image;
        }
        const formData = CommonService.getFormDataFromJSON(payload);
        setIsServiceCategoryEditInProgress(true);
        CommonService._serviceCategory.ServiceCategoryEditAPICall(serviceCategory._id, formData)
            .then((response: IAPIResponseType<IServiceCategory>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsServiceCategoryEditInProgress(false);
                onEdit(response.data);
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error, true);
                setIsServiceCategoryEditInProgress(false);
            })
    }, [serviceCategory, onEdit]);

    useEffect(() => {
        if (serviceCategory) {
            setServiceCategoryEditFormInitialValues({
                name: serviceCategory.name,
                description: serviceCategory.description,
                image: serviceCategory.image,
                is_active: serviceCategory.is_active,
                bg_color_code: serviceCategory?.bg_color_code && JSON.parse(serviceCategory?.bg_color_code),
                text_color_code: serviceCategory?.text_color_code && JSON.parse(serviceCategory?.text_color_code),
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
                                <div
                                    className={"mrg-bottom-20 display-flex align-items-center justify-content-space-between"}>
                                    <FormControlLabelComponent label={"Edit Service Category"}
                                                               size={"lg"}
                                                               className={"mrg-bottom-0"}/>
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
                                                        id={"sc_edit_is_active_toggle"}
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
                                        <FormControlLabelComponent size={"sm"} label={'Service Category Color'}/>

                                        <div className="color-picker-wrapper">

                                            <div className='ts-row'>
                                                <div className='ts-col-6'>
                                                    <Field name={'bg_color_code'} className="t-form-control">
                                                        {
                                                            (field: FieldProps) => (
                                                                <FormikColorPickerComponent
                                                                    label={'Background Color:'}
                                                                    formikField={field}
                                                                    required={true}
                                                                />
                                                            )
                                                        }
                                                    </Field>
                                                </div>
                                                <div className='ts-col-6'>
                                                    <Field name={'text_color_code'} className="t-form-control">
                                                        {
                                                            (field: FieldProps) => (
                                                                <FormikColorPickerComponent
                                                                    label={'Text Color:'}
                                                                    formikField={field}
                                                                    required={true}
                                                                />
                                                            )
                                                        }
                                                    </Field>
                                                </div>
                                            </div>

                                            {values.bg_color_code && <div className='preview-wrapper'>
                                                <FormControlLabelComponent size={"sm"}
                                                                           label={"Preview"}/>
                                                <div className='preview-button' style={{
                                                    background: `rgba(${values.bg_color_code.r}, ${values.bg_color_code.g}, ${values.bg_color_code.b}, ${values.bg_color_code.a})`,
                                                    color: `rgba(${values.text_color_code.r}, ${values.text_color_code.g}, ${values.text_color_code.b}, ${values.text_color_code.a})`
                                                }}>
                                                    SC (1)
                                                </div>

                                            </div>
                                            }
                                        </div>

                                    </div>
                                    <div className="mrg-bottom-10">
                                        <FormControlLabelComponent size={"sm"}
                                                                   label={"Upload Image for Service Category *"}/>
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
                                                            setFieldValue('image', '');
                                                        }}
                                                    />
                                                </>
                                            }
                                        </>
                                    </div>
                                </div>
                                <div className="t-form-actions mrg-bottom-20">
                                    <ButtonComponent
                                        isLoading={isServiceCategoryEditInProgress}
                                        type={"submit"}
                                        className={'submit-cta'}
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
