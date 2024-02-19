import "./EditMedicalRecordDocumentComponent.scss";
import * as Yup from "yup";
import React, {useCallback, useEffect, useState} from "react";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {Misc} from "../../../constants";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import _ from "lodash";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {IMedicalRecordDocumentEditForm} from "../../../shared/models/chart-notes.model";
import FormikDatePickerComponent
    from "../../../shared/components/form-controls/formik-date-picker/FormikDatePickerComponent";
import InputComponent from "../../../shared/components/form-controls/input/InputComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import FormikSelectComponent from "../../../shared/components/form-controls/formik-select/FormikSelectComponent";

const EditMedicalRecordDocumentFormValidationSchema = Yup.object({
    document_date: Yup.mixed()
        .required("Date of Document is required"),
    document_type_id: Yup.string()
        .required("Document Type is required"),
    comments: Yup.string().nullable()
});

const EditMedicalRecordDocumentFormInitialValues: IMedicalRecordDocumentEditForm = {
    document_date: new Date(),
    document_type_id : "",
    comments: ""
};

interface EditMedicalRecordDocumentFileComponentProps {
    onEdit: (data: any) => void;
    medicalRecordDocumentId: string;
    medicalRecordDocumentDetails: any;
}

const EditMedicalRecordDocumentComponent = (props: EditMedicalRecordDocumentFileComponentProps) => {

    const {onEdit, medicalRecordDocumentDetails, medicalRecordDocumentId} = props;
    const {medicalRecordDocumentTypes} = useSelector((state: IRootReducerState) => state.staticData);
    const {currentUser} = useSelector((state: IRootReducerState) => state.account);
    const [editMedicalRecordDocumentFormInitialValues, setEditMedicalRecordDocumentFormInitialValues] = useState<IMedicalRecordDocumentEditForm>(_.cloneDeep(EditMedicalRecordDocumentFormInitialValues));

    const [isMedicalRecordDocumentFileEditInProgress, setIsMedicalRecordDocumentFileAddInProgress] = useState(false);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        setIsMedicalRecordDocumentFileAddInProgress(true);
        CommonService._chartNotes.MedicalRecordDocumentEditAPICall(medicalRecordDocumentId, values)
            .then((response: IAPIResponseType<any>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsMedicalRecordDocumentFileAddInProgress(false);
                onEdit(response.data);
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error, true);
                setIsMedicalRecordDocumentFileAddInProgress(false);
            })
    }, [medicalRecordDocumentId, onEdit]);

    useEffect(() => {
        if (medicalRecordDocumentDetails) {
            setEditMedicalRecordDocumentFormInitialValues({
                document_date: medicalRecordDocumentDetails.document_date,
                document_type_id: medicalRecordDocumentDetails.document_type_id,
                comments: medicalRecordDocumentDetails.comments
            });
        }
    }, [medicalRecordDocumentDetails]);

    return (
        <div className="edit-medical-record-document-component">
            <div className="edit-medical-record-document-component-form-container">
                <FormControlLabelComponent label={"Edit Document"}
                                           size={"xl"}/>
                <Formik
                    validationSchema={EditMedicalRecordDocumentFormValidationSchema}
                    initialValues={editMedicalRecordDocumentFormInitialValues}
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
                                <div className="t-form-controls">
                                    <InputComponent className="t-form-control"
                                                    label={'Intervention Linked To'}
                                                    placeholder={'Intervention Linked To'}
                                                    value={CommonService.generateInterventionNameFromMedicalRecord(medicalRecordDocumentDetails?.medical_record_details)}
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
                                </div>
                                <div className="t-form-actions ">
                                    <ButtonComponent
                                        isLoading={isMedicalRecordDocumentFileEditInProgress}
                                        type={"submit"}
                                        fullWidth={true}
                                    >
                                        {isMedicalRecordDocumentFileEditInProgress ? "Saving" : "Save"}
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

export default EditMedicalRecordDocumentComponent;
