import "./ServiceAddComponent.scss";
import FormControlLabelComponent from "../../../../shared/components/form-control-label/FormControlLabelComponent";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {useCallback, useEffect, useState} from "react";
import {IServiceAdd} from "../../../../shared/models/service-add.model";
import * as Yup from "yup";
import FormikInputComponent from "../../../../shared/components/form-controls/formik-input/FormikInputComponent";
import FormikTextAreaComponent
    from "../../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import FilePickerComponent from "../../../../shared/components/file-picker/FilePickerComponent";
import _ from "lodash";
import ErrorComponent from "../../../../shared/components/error/ErrorComponent";
import FilePreviewThumbnailComponent
    from "../../../../shared/components/file-preview-thumbnail/FilePreviewThumbnailComponent";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import {CommonService} from "../../../../shared/services";
import {IAPIResponseType} from "../../../../shared/models/api.model";
import {Misc} from "../../../../constants";

interface ServiceAddComponentProps {
}

const serviceAddFormValidationSchema = Yup.object({
    name: Yup.string().required('The name field is required'),
    description: Yup.string().required('The description field is required'),
    image: Yup.mixed().required('The image field is required'),
    initial_consultation:Yup.string().required('The title field is required'),
    followup_consultation:Yup.string().required('The title field is required')
});

const ServiceAddComponent = (props: ServiceAddComponentProps) => {

    const [addService] = useState<IServiceAdd>({
        name: "",
        description: "",
        image: "",
        initial_consultation:"",
        followup_consultation:""
    });

    const [isServiceAddInProgress, setIsServiceAddInProgress] = useState(false);


    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        setIsServiceAddInProgress(true);
        const formData = CommonService.getFormDataFromJSON(values);
        CommonService._serviceAdd.ServiceAddAPICall(formData)
            .then((response: IAPIResponseType<IServiceAdd>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsServiceAddInProgress(false);
                console.log(response.data);
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error);
                setIsServiceAddInProgress(false);
            })

    }, []);

    let touched;
    return (
        <div className={'service-add-add-component'}>
            <div className={'service-category-service-add-form'}>
                <FormControlLabelComponent label={"Add New Service"}
                                           size={'lg'}/>
                <Formik
                    validationSchema={serviceAddFormValidationSchema}
                    initialValues={addService}
                    onSubmit={onSubmit}
                    validateOnChange={false}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    validateOnMount={true}>
                    {({values, touched, errors, setFieldValue, validateForm}) => {
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        useEffect(() => {
                            validateForm();
                        }, [validateForm, values]);
                        return (
                            <Form noValidate={true}>
                                <div>
                                    <Field name={'name'}>
                                        {
                                            (field: FieldProps) => (
                                                <FormikInputComponent
                                                    label={'Service Name'}
                                                    placeholder={'Service Name'}
                                                    type={"text"}
                                                    required={true}
                                                    formikField={field}
                                                    fullWidth={true}
                                                />
                                            )
                                        }

                                    </Field>
                                    <Field name={'description'}>
                                        {
                                            (field: FieldProps) => (
                                                <FormikTextAreaComponent formikField={field}
                                                                         label={'Service Description'}
                                                                         placeholder={'Service Description'}
                                                                         required={true}
                                                                         fullWidth={true}
                                                />)
                                        }
                                    </Field>

                                        <FormControlLabelComponent label={'Initial Consultation Details'}/>
                                    <Field name={'initial_consultation'}>
                                    {
                                            (field: FieldProps) => (
                                                <FormikInputComponent
                                                    label={'Title'}
                                                    placeholder={'Title'}
                                                    type={"text"}
                                                    required={true}
                                                    formikField={field}
                                                    fullWidth={true}
                                                />
                                            )
                                        }
                                    </Field>
                                    <FormControlLabelComponent label={'Follow-up Details'}/>
                                    <Field name={'followup_consultation'}>
                                        {
                                            (field: FieldProps) => (
                                                <FormikInputComponent
                                                    label={'Title'}
                                                    placeholder={'Title'}
                                                    type={"text"}
                                                    required={true}
                                                    formikField={field}
                                                    fullWidth={true}
                                                />
                                            )
                                        }
                                    </Field>
                                    <div>
                                        <FormControlLabelComponent label={'Upload Image for Service'}
                                                                   required={true}
                                        />
                                        <>
                                            {(!values.image) && <>
                                                <FilePickerComponent maxFileCount={1}
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
                                                                                   }}/>
                                                </>
                                            }
                                        </>
                                    </div>
                                </div>
                                <div className="t-form-actions">
                                    <ButtonComponent
                                        isLoading={isServiceAddInProgress}
                                        type={"submit"}
                                        fullWidth={true}
                                        id={"sc_save_btn"}
                                    >
                                        {isServiceAddInProgress ? "Saving" : "Save"}
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

export default ServiceAddComponent;