import "./AddDryNeedlingFileComponent.scss";
import * as Yup from "yup";
import React, {useCallback, useEffect, useState} from "react";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {Misc} from "../../../constants";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import FilePickerComponent from "../../../shared/components/file-picker/FilePickerComponent";
import _ from "lodash";
import ErrorComponent from "../../../shared/components/error/ErrorComponent";
import FilePreviewThumbnailComponent
    from "../../../shared/components/file-preview-thumbnail/FilePreviewThumbnailComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {IDryNeedlingAddForm} from "../../../shared/models/chart-notes.model";
import FormikDatePickerComponent
    from "../../../shared/components/form-controls/formik-date-picker/FormikDatePickerComponent";
import InputComponent from "../../../shared/components/form-controls/input/InputComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import moment from "moment";

const AddDryNeedlingFormValidationSchema = Yup.object({
    document_date: Yup.mixed()
        .required("Date of Document is required"),
    attachment: Yup.string()
        .required("Attachment is required"),
    comments: Yup.string().nullable()
});

const AddDryNeedlingFormInitialValues: IDryNeedlingAddForm = {
    document_date: new Date(),
    attachment: "",
    comments: ""
};

interface AddDryNeedlingFileComponentProps {
    onAdd: (data: any) => void;
    medicalInterventionId: string;
    medicalRecordDetails: any;
    onCancel: () => void;
}

const AddDryNeedlingFileComponent = (props: AddDryNeedlingFileComponentProps) => {

    const {onAdd, medicalInterventionId, medicalRecordDetails} = props;
    const {currentUser} = useSelector((state: IRootReducerState) => state.account);
    const [addDryNeedlingFormInitialValues] = useState<IDryNeedlingAddForm>(_.cloneDeep(AddDryNeedlingFormInitialValues));

    const [isDryNeedlingFileAddInProgress, setIsDryNeedlingFileAddInProgress] = useState(false);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        setIsDryNeedlingFileAddInProgress(true);
        const tempPayload = _.cloneDeep(values);
        const formData = CommonService.getFormDataFromJSON(values);
        formData.append('document_date', moment(tempPayload?.document_date).format("YYYY-MM-DD"));
        try {
            CommonService._chartNotes.DryNeedlingFileAddAPICall(medicalInterventionId, formData)
                .then((response: IAPIResponseType<any>) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    setIsDryNeedlingFileAddInProgress(false);
                    onAdd(response.data);
                })
                .catch((error: any) => {
                    CommonService.handleErrors(setErrors, error, true);
                    setIsDryNeedlingFileAddInProgress(false);
                });
        } catch (error) {
            CommonService.handleErrors(setErrors, error, true);
            setIsDryNeedlingFileAddInProgress(false);
        }
    }, [medicalInterventionId, onAdd]);


    return (
        <div className="add-dry-needling-file-component">
            <div className="add-dry-needling-file-form-container">
                <FormControlLabelComponent label={"Add Dry Needling File"}
                                           size={"xl"}/>
                <Formik
                    validationSchema={AddDryNeedlingFormValidationSchema}
                    initialValues={addDryNeedlingFormInitialValues}
                    validateOnChange={false}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    validateOnMount={true}
                    onSubmit={onSubmit}
                >
                    {({values, isValid, touched, errors, setFieldValue, validateForm}) => {
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        useEffect(() => {
                            validateForm();
                        }, [validateForm, values]);
                        return (
                            <Form className="t-form" noValidate={true}>
                                <div className="t-form-control">
                                    <InputComponent className="t-form-control"
                                                    label={'Intervention Linked to'}
                                                    placeholder={'Intervention Linked to'}
                                                    value={CommonService.generateInterventionNameFromMedicalRecord(medicalRecordDetails)}
                                                    required={true}
                                                    fullWidth={true}
                                                    disabled={true}
                                    />
                                    <InputComponent className="t-form-control"
                                                    label={'Attached by'}
                                                    placeholder={'Attached by'}
                                                    value={currentUser?.first_name + " " + currentUser?.last_name}
                                                    required={true}
                                                    fullWidth={true}
                                                    disabled={true}
                                    />
                                    <Field name={'document_date'} className="t-form-control">
                                        {
                                            (field: FieldProps) => (
                                                <FormikDatePickerComponent
                                                    label={'Date of Document'}
                                                    placeholder={'Enter Date of Document'}
                                                    required={true}
                                                    formikField={field}
                                                    fullWidth={true}
                                                />
                                            )
                                        }
                                    </Field>
                                    <Field name={'comments'} className="t-form-control">
                                        {
                                            (field: FieldProps) => (
                                                <FormikTextAreaComponent
                                                    label={'Comments'}
                                                    placeholder={'Enter Comments'}
                                                    formikField={field}
                                                    fullWidth={true}
                                                />
                                            )
                                        }
                                    </Field>
                                    <div>
                                        <FormControlLabelComponent label={"Upload Attachment"}
                                                                   className={'upload-dry-needling-heading'}
                                                                   required={true}/>
                                        <>
                                            {
                                                (!values.attachment) && <>
                                                    <FilePickerComponent maxFileCount={1}
                                                                         onFilesDrop={(acceptedFiles, rejectedFiles) => {
                                                                             if (acceptedFiles && acceptedFiles.length > 0) {
                                                                                 const file = acceptedFiles[0];
                                                                                 setFieldValue('attachment', file);
                                                                             }
                                                                         }}
                                                                         acceptedFileTypes={["pdf", "png", "jpeg"]}
                                                                         acceptedFilesText={"PNG, JPEG and PDF files are allowed upto 100MB"}
                                                    />
                                                    {
                                                        (_.get(touched, "attachment") && !!(_.get(errors, "attachment"))) &&
                                                        <ErrorComponent
                                                            errorText={(_.get(errors, "attachment"))}/>
                                                    }
                                                </>
                                            }
                                        </>
                                        <>
                                            {
                                                (values.attachment) && <>
                                                    <FilePreviewThumbnailComponent
                                                        file={values.attachment}
                                                        onRemove={() => {
                                                            setFieldValue('attachment', undefined);
                                                        }}
                                                    />
                                                </>
                                            }
                                        </>
                                    </div>
                                </div>
                                <div className="t-form-actions">
                                    {/*<ButtonComponent className={'mrg-right-15'}*/}
                                    {/*    variant={"outlined"}*/}
                                    {/*    id={"medical_intervention_add_cancel_btn"}*/}
                                    {/*    onClick={onCancel}*/}
                                    {/*>*/}
                                    {/*    Cancel*/}
                                    {/*</ButtonComponent>*/}
                                    {/*&nbsp;*/}
                                    <ButtonComponent
                                        fullWidth={true}
                                        isLoading={isDryNeedlingFileAddInProgress}
                                        type={"submit"}
                                        disabled={!isValid || isDryNeedlingFileAddInProgress}
                                    >
                                        {isDryNeedlingFileAddInProgress ? "Saving" : "Save"}
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

export default AddDryNeedlingFileComponent;
