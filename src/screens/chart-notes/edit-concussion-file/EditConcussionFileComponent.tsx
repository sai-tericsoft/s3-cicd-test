import "./EditConcussionFileComponent.scss";
import * as Yup from "yup";
import React, {useCallback, useEffect, useState} from "react";
import {IServiceCategory} from "../../../shared/models/service-category.model";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {Misc} from "../../../constants";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import _ from "lodash";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {IConcussionFileEditForm} from "../../../shared/models/chart-notes.model";
import FormikDatePickerComponent
    from "../../../shared/components/form-controls/formik-date-picker/FormikDatePickerComponent";
import InputComponent from "../../../shared/components/form-controls/input/InputComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";

const EditConcussionFileFormValidationSchema = Yup.object({
    document_date: Yup.string()
        .required("Date of Document is required"),
    comments: Yup.string().nullable()
});

const EditConcussionFileFormInitialValues: IConcussionFileEditForm = {
    document_date: new Date(),
    comments: ""
};

interface EditConcussionFileComponentProps {
    onEdit: (data: any) => void;
    concussionFileId: string;
    concussionFileDetails: any;
}

const EditConcussionFileComponent = (props: EditConcussionFileComponentProps) => {

    const {onEdit, concussionFileDetails, concussionFileId} = props;
    const {currentUser} = useSelector((state: IRootReducerState) => state.account);
    const [editConcussionFileFormInitialValues, setEditConcussionFileFormInitialValues] = useState<IConcussionFileEditForm>(_.cloneDeep(EditConcussionFileFormInitialValues));

    const [isConcussionFileEditInProgress, setIsConcussionFileAddInProgress] = useState(false);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        setIsConcussionFileAddInProgress(true);
        CommonService._chartNotes.ConcussionFileEditAPICall(concussionFileId, values)
            .then((response: IAPIResponseType<IServiceCategory>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsConcussionFileAddInProgress(false);
                onEdit(response.data);
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error, true);
                setIsConcussionFileAddInProgress(false);
            })
    }, [concussionFileId, onEdit]);

    useEffect(() => {
        if (concussionFileDetails) {
            setEditConcussionFileFormInitialValues({
                document_date: concussionFileDetails.document_date,
                comments: concussionFileDetails.comments
            });
        }
    }, [concussionFileDetails]);

    return (
        <div className="edit-concussion-file-component">
            <div className="edit-concussion-file-component-form-container">
                <FormControlLabelComponent label={`Edit ${concussionFileDetails?.concussion_type_details?.type} File`}
                                           size={"xl"}/>
                <Formik
                    validationSchema={EditConcussionFileFormValidationSchema}
                    initialValues={editConcussionFileFormInitialValues}
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
                                                    value={CommonService.generateInterventionNameFromMedicalRecord(concussionFileDetails?.medical_record_details)}
                                                    required={true}
                                                    fullWidth={true}
                                                    disabled={true}
                                    />
                                    <InputComponent className="t-form-control"
                                                    label={'Attached By'}
                                                    placeholder={'Attached By'}
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
                                </div>
                                <div className="t-form-actions">
                                    <ButtonComponent
                                        isLoading={isConcussionFileEditInProgress}
                                        type={"submit"}
                                        fullWidth={true}
                                    >
                                        {isConcussionFileEditInProgress ? "Saving" : "Save"}
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

export default EditConcussionFileComponent;
