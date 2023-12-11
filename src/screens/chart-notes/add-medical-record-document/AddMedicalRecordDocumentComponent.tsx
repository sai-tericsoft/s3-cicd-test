import "./AddMedicalRecordDocumentComponent.scss";
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
import {IMedicalRecordDocumentAddForm} from "../../../shared/models/chart-notes.model";
import FormikDatePickerComponent
    from "../../../shared/components/form-controls/formik-date-picker/FormikDatePickerComponent";
import InputComponent from "../../../shared/components/form-controls/input/InputComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import FormikSelectComponent from "../../../shared/components/form-controls/formik-select/FormikSelectComponent";
import moment from "moment";
import {useNavigate} from "react-router-dom";

const AddMedicalRecordDocumentFormValidationSchema = Yup.object({
    document_date: Yup.mixed()
        .required("Date of Document is required"),
    document_type_id: Yup.string()
        .required("Document Type is required"),
    attachment: Yup.mixed()
        .required("Document is required"),
    comments: Yup.string().nullable()
});

const AddMedicalRecordDocumentFormInitialValues: IMedicalRecordDocumentAddForm = {
    document_date: new Date(),
    attachment: "",
    document_type_id: "",
    comments: ""
};

interface AddMedicalRecordDocumentComponentProps {
    onAdd: (data: any) => void;
    medicalRecordId: string;
    medicalRecordDetails: any;
    onCancel: () => void;
    setRefreshToken?: any;
}

const AddMedicalRecordDocumentComponent = (props: AddMedicalRecordDocumentComponentProps) => {

    const {onAdd, medicalRecordId, medicalRecordDetails, setRefreshToken} = props;
    const {medicalRecordDocumentTypes} = useSelector((state: IRootReducerState) => state.staticData);
    const {currentUser} = useSelector((state: IRootReducerState) => state.account);
    const [addMedicalRecordDocumentFormInitialValues] = useState<IMedicalRecordDocumentAddForm>(_.cloneDeep(AddMedicalRecordDocumentFormInitialValues));
    const navigate = useNavigate();

    const [isMedicalRecordDocumentFileAddInProgress, setIsMedicalRecordDocumentFileAddInProgress] = useState(false);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        setIsMedicalRecordDocumentFileAddInProgress(true);
        const tempValues = {...values}
        // let tempDocument_date = tempValues.remove("document_date")
        const formData = CommonService.getFormDataFromJSON(tempValues);
        formData.append("document_date", values?.document_date);
        CommonService._chartNotes.MedicalRecordDocumentAddAPICall(medicalRecordId, formData)
            .then((response: IAPIResponseType<any>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsMedicalRecordDocumentFileAddInProgress(false);
                navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId) + '?activeTab=attachmentList')
                setRefreshToken && setRefreshToken(Math.random().toString(36).substring(7));
                onAdd(response.data);
            })
            .catch((error: any) => {
                // CommonService.handleErrors(setErrors, error, true);
                CommonService._alert.showToast(error, "error");
                setIsMedicalRecordDocumentFileAddInProgress(false);
            })
    }, [navigate, medicalRecordId, onAdd, setRefreshToken]);

    return (
        <div className="add-medical-record-document-component">
            <div className="add-medical-record-document-form-container">
                <FormControlLabelComponent label={"Add Document"}
                                           size={"lg"}/>
                <Formik
                    validationSchema={AddMedicalRecordDocumentFormValidationSchema}
                    initialValues={addMedicalRecordDocumentFormInitialValues}
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
                                <div className="t-form-controls">
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
                                    <div className={'select-wrapper'}>
                                        <Field name={'document_date'} className="t-form-control">
                                            {
                                                (field: FieldProps) => (
                                                    <FormikDatePickerComponent
                                                        label={'Date of Document'}
                                                        placeholder={'Enter Date of Document'}
                                                        required={true}
                                                        formikField={field}
                                                        maxDate={moment()}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    <Field name={'document_type_id'} className="t-form-control">
                                        {
                                            (field: FieldProps) => (
                                                <FormikSelectComponent
                                                    label={'Document Type'}
                                                    options={medicalRecordDocumentTypes}
                                                    displayWith={(option: any) => option?.type}
                                                    valueExtractor={(option: any) => option?._id}
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
                                    <div className="mrg-bottom-20">
                                        <FormControlLabelComponent label={"Upload Document"}
                                                                   className={'upload-document-heading'}
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
                                                                         acceptedFileTypes={["mp4", "pdf", "png", "jpeg", "avi"]}
                                                                         acceptedFilesText={"PNG, JPEG, PDF, MP4 and AVI files are allowed upto 100MB"}
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
                                    &nbsp;
                                    <ButtonComponent
                                        isLoading={isMedicalRecordDocumentFileAddInProgress}
                                        type={"submit"}
                                        fullWidth={true}
                                        disabled={!isValid || isMedicalRecordDocumentFileAddInProgress}
                                    >
                                        {isMedicalRecordDocumentFileAddInProgress ? "Saving" : "Save"}
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

export default AddMedicalRecordDocumentComponent;
