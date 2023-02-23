import "./AddSurgeryRecordComponent.scss";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import {Field, FieldArray, FieldProps, Form, Formik, FormikHelpers} from "formik";
import React, {useCallback, useEffect, useState} from "react";
import FormikDatePickerComponent
    from "../../../shared/components/form-controls/formik-date-picker/FormikDatePickerComponent";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import * as Yup from "yup";
import FilePreviewThumbnailComponent
    from "../../../shared/components/file-preview-thumbnail/FilePreviewThumbnailComponent";
import FilePickerComponent from "../../../shared/components/file-picker/FilePickerComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {CommonService} from "../../../shared/services";
import {Misc} from "../../../constants";
import {IAPIResponseType} from "../../../shared/models/api.model";
import InputComponent from "../../../shared/components/form-controls/input/InputComponent";

interface AddSurgeryRecordComponentProps {
    medicalRecordId: string;
    medicalRecordDetails: any;
    onSave: () => void;
    onCancel?: () => void
}

const addSurgeryRecordFormInitialValues: any = {
    surgery_date: "",
    surgeon_name: "",
    details: "",
    documents: []
};


const addSurgeryRecordValidationSchema = Yup.object().shape({
    surgery_date: Yup.string().required("Surgery date is required"),
});


const AddSurgeryRecordComponent = (props: AddSurgeryRecordComponentProps) => {

    const {medicalRecordDetails, onSave, onCancel} = props;
    const {currentUser} = useSelector((state: IRootReducerState) => state.account);
    const [isSurgeryRecordAddInProgress, setIsSurgeryRecordAddInProgress] = useState<boolean>(false);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        if (medicalRecordDetails) {
            setIsSurgeryRecordAddInProgress(true);
            values.reported_by = values?.reported_by?._id;
            if (values.surgery_date) {
                values.surgery_date = CommonService.convertDateFormat(values?.surgery_date);
            }
            const formData = CommonService.getFormDataFromJSON(values);
            CommonService._chartNotes.AddSurgeryRecordAPICall(medicalRecordDetails._id, formData)
                .then((response: IAPIResponseType<any>) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    // setIsSurgeryRecordAddInProgress(false);
                    onSave();
                })
                .catch((error: any) => {
                    CommonService.handleErrors(setErrors, error, true);
                })
                .finally(() => {
                    setIsSurgeryRecordAddInProgress(false);
                })
        }
    }, [medicalRecordDetails, onSave]);

    return (
        <div className={'edit-medical-record-component'}>
            <Formik
                validationSchema={addSurgeryRecordValidationSchema}
                initialValues={addSurgeryRecordFormInitialValues}
                onSubmit={onSubmit}
                validateOnChange={false}
                validateOnBlur={true}
                enableReinitialize={true}
                validateOnMount={true}>
                {({values, isValid, errors, setFieldValue, validateForm}) => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    useEffect(() => {
                        validateForm();
                    }, [validateForm, values]);
                    return (
                        <Form className="t-form" noValidate={true}>
                            <FormControlLabelComponent label={"Add Surgery Record"} size={'lg'}/>
                            <div className={"t-surgery-record-drawer-form-controls"}>
                                <Field name={'surgery_date'}>
                                    {
                                        (field: FieldProps) => (
                                            <FormikDatePickerComponent
                                                label={'Date of Surgery'}
                                                placeholder={'Date of Surgery'}
                                                formikField={field}
                                                required={true}
                                                fullWidth={true}
                                            />
                                        )
                                    }
                                </Field>
                                <InputComponent className="t-form-control"
                                                label={'Reported By'}
                                                placeholder={'Reported By'}
                                                value={CommonService.extractName(currentUser)}
                                                fullWidth={true}
                                                disabled={true}
                                />
                                <Field name={'surgeon_name'}>
                                    {
                                        (field: FieldProps) => (
                                            <FormikInputComponent
                                                titleCase={true}
                                                label={'Name of Surgeon'}
                                                formikField={field}
                                                fullWidth={true}
                                            />
                                        )
                                    }
                                </Field>
                                <Field name={'details'}>
                                    {
                                        (field: FieldProps) => (
                                            <FormikTextAreaComponent
                                                label={'Brief Details'}
                                                formikField={field}
                                                fullWidth={true}
                                            />
                                        )
                                    }
                                </Field>
                                <FieldArray
                                    name="documents"
                                    render={arrayHelpers => (
                                        <>
                                            {values?.documents && values?.documents?.map((item: any, index: any) => {
                                                return (
                                                    <FilePreviewThumbnailComponent file={item}
                                                                                   variant={"compact"}
                                                                                   key={item.name + index}
                                                                                   onRemove={() => {
                                                                                       arrayHelpers.remove(index);
                                                                                   }}
                                                    />
                                                )
                                            })}
                                        </>
                                    )}/>
                                <FilePickerComponent
                                    maxFileCount={1}
                                    id={"sv_upload_btn"}
                                    onFilesDrop={(acceptedFiles, rejectedFiles) => {
                                        if (acceptedFiles && acceptedFiles.length > 0) {
                                            const file = acceptedFiles[0];
                                            setFieldValue(`documents[${values?.documents?.length || 0}]`, file);
                                        }
                                    }}
                                    acceptedFilesText={"PDF files are allowed"}
                                    acceptedFileTypes={["pdf"]}
                                />
                            </div>
                            <div className="t-form-actions mrg-top-20 mrg-bottom-30">
                                <ButtonComponent
                                    className={'mrg-right-10'}
                                    variant={"outlined"}
                                    id={"medical_intervention_add_cancel_btn"}
                                    onClick={onCancel}
                                >
                                    Cancel
                                </ButtonComponent>
                                <ButtonComponent type={'submit'}
                                                 isLoading={isSurgeryRecordAddInProgress}
                                                 disabled={!isValid || isSurgeryRecordAddInProgress}>
                                    Save
                                </ButtonComponent>
                            </div>
                        </Form>)
                }
                }
            </Formik>
        </div>
    );
};

export default AddSurgeryRecordComponent;
