import "./AddSurgeryRecordComponent.scss";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
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
import {IAPIResponseType} from "../../../shared/models/api.model";
import InputComponent from "../../../shared/components/form-controls/input/InputComponent";
import moment from "moment";
import _ from "lodash";
import ErrorComponent from "../../../shared/components/error/ErrorComponent";

interface AddSurgeryRecordComponentProps {
    medicalRecordId: string;
    medicalRecordDetails: any;
    onSave: () => void;
    onCancel?: () => void;
    setRefreshToken?: any;

}

const addSurgeryRecordFormInitialValues: any = {
    surgery_date: "",
    surgeon_name: "",
    details: "",
    documents: []
};


const addSurgeryRecordValidationSchema = Yup.object().shape({
    surgery_date: Yup.mixed().required("Date of Surgery is required"),
});


const AddSurgeryRecordComponent = (props: AddSurgeryRecordComponentProps) => {

    const {medicalRecordDetails, onSave, setRefreshToken} = props;
    const {currentUser} = useSelector((state: IRootReducerState) => state.account);
    const [isSurgeryRecordAddInProgress, setIsSurgeryRecordAddInProgress] = useState<boolean>(false);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        if (medicalRecordDetails) {
            setIsSurgeryRecordAddInProgress(true);
            values.reported_by = values?.reported_by?._id;
            const formData = CommonService.getFormDataFromJSON(values);
            if (values.surgery_date) {
                formData.append('surgery_date', values?.surgery_date);
            }
            CommonService._chartNotes.AddSurgeryRecordAPICall(medicalRecordDetails._id, formData)
                .then((response: IAPIResponseType<any>) => {
                    CommonService._alert.showToast('Surgery record has been added', "success");
                    setRefreshToken(Math.random().toString(36).substring(7));
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
    }, [medicalRecordDetails, onSave, setRefreshToken]);

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
                {({values, isValid, errors, touched, setFieldValue, validateForm}) => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    useEffect(() => {
                        validateForm();
                    }, [validateForm, values]);
                    return (
                        <Form className="t-form" noValidate={true}>
                            <FormControlLabelComponent label={"Add Surgery Record"} size={'lg'}/>
                            <div className={'t-form-controls'}>
                                <Field name={'surgery_date'}>
                                    {
                                        (field: FieldProps) => (
                                            <FormikDatePickerComponent
                                                label={'Date of Surgery'}
                                                placeholder={'Date of Surgery'}
                                                maxDate={moment()}
                                                formikField={field}
                                                required={true}
                                                fullWidth={true}
                                            />
                                        )
                                    }
                                </Field>
                                <InputComponent className="t-form-control"
                                                label={'Reported by'}
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
                                                placeholder={'Enter Name of Surgeon'}
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
                                                label={'Brief Surgical Details'}
                                                placeholder={'Enter Details'}
                                                formikField={field}
                                                fullWidth={true}
                                            />
                                        )
                                    }
                                </Field>

                                {/*<FieldArray*/}
                                {/*    name="documents"*/}
                                {/*    render={arrayHelpers => (*/}
                                {/*        <>*/}
                                {/*            {values?.documents && values?.documents?.map((item: any, index: any) => {*/}
                                {/*                return (*/}
                                {/*                    <FilePreviewThumbnailComponent file={item}*/}
                                {/*                                                   variant={"compact"}*/}
                                {/*                                                   key={item.name + index}*/}
                                {/*                                                   onRemove={() => {*/}
                                {/*                                                       arrayHelpers.remove(index);*/}
                                {/*                                                   }}*/}
                                {/*                    />*/}
                                {/*                )*/}
                                {/*            })}*/}
                                {/*        </>*/}
                                {/*    )}/>*/}
                                {/*<FilePickerComponent*/}
                                {/*    maxFileCount={1}*/}
                                {/*    id={"sv_upload_btn"}*/}
                                {/*    onFilesDrop={(acceptedFiles, rejectedFiles) => {*/}
                                {/*        if (acceptedFiles && acceptedFiles.length > 0) {*/}
                                {/*            const file = acceptedFiles[0];*/}
                                {/*            setFieldValue(`documents[${values?.documents?.length || 0}]`, file);*/}
                                {/*        }*/}
                                {/*    }}*/}
                                {/*    acceptedFilesText={"PDF files are allowed"}*/}
                                {/*    acceptedFileTypes={["pdf"]}*/}
                                {/*/>*/}
                                <>
                                    {
                                        (!values.attachment) && <>
                                            <div className={'attachment-heading'}>
                                               Upload Attachment
                                            </div>
                                            <FilePickerComponent maxFileCount={1}
                                                                 onFilesDrop={(acceptedFiles, rejectedFiles) => {
                                                                     if (acceptedFiles && acceptedFiles.length > 0) {
                                                                         const file = acceptedFiles[0];
                                                                         setFieldValue('attachment', file);
                                                                     }
                                                                 }}
                                                                 acceptedFileTypes={["png", "jpeg", "pdf"]}
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

                            <div className="t-form-actions">
                                {/*<ButtonComponent*/}
                                {/*    className={isSurgeryRecordAddInProgress ? 'mrg-right-15':''}*/}
                                {/*    variant={"outlined"}*/}
                                {/*    id={"medical_intervention_add_cancel_btn"}*/}
                                {/*    onClick={onCancel}*/}
                                {/*>*/}
                                {/*    Cancel*/}
                                {/*</ButtonComponent>*/}
                                <ButtonComponent type={'submit'}
                                                 fullWidth={true}
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
