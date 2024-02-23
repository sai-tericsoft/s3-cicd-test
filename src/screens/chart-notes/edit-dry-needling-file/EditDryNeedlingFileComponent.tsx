import "./EditDryNeedlingFileComponent.scss";
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
import {IDryNeedlingEditForm} from "../../../shared/models/chart-notes.model";
import FormikDatePickerComponent
    from "../../../shared/components/form-controls/formik-date-picker/FormikDatePickerComponent";
import InputComponent from "../../../shared/components/form-controls/input/InputComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import moment from "moment";

const EditDryNeedlingFormValidationSchema = Yup.object({
    document_date: Yup.string()
        .required("Date of Document is required"),
    comments: Yup.string().nullable()
});

const EditDryNeedlingFormInitialValues: IDryNeedlingEditForm = {
    document_date: new Date(),
    comments: ""
};

interface EditDryNeedlingFileComponentProps {
    onEdit: (data: any) => void;
    dryNeedlingFileId: string;
    dryNeedlingFileDetails: any;
}

const EditDryNeedlingFileComponent = (props: EditDryNeedlingFileComponentProps) => {

    const {onEdit, dryNeedlingFileDetails, dryNeedlingFileId} = props;
    const {currentUser} = useSelector((state: IRootReducerState) => state.account);
    const [editDryNeedlingFormInitialValues, setEditDryNeedlingFormInitialValues] = useState<IDryNeedlingEditForm>(_.cloneDeep(EditDryNeedlingFormInitialValues));

    const [isDryNeedlingFileEditInProgress, setIsDryNeedlingFileAddInProgress] = useState(false);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        const payload = {
            ...values,
            document_date: moment(values.document_date).format("YYYY-MM-DD")
        }
        setIsDryNeedlingFileAddInProgress(true);
        CommonService._chartNotes.DryNeedlingFileEditAPICall(dryNeedlingFileId, payload)
            .then((response: IAPIResponseType<IServiceCategory>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsDryNeedlingFileAddInProgress(false);
                onEdit(response.data);
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error, true);
                setIsDryNeedlingFileAddInProgress(false);
            })
    }, [dryNeedlingFileId, onEdit]);

    useEffect(() => {
        if (dryNeedlingFileDetails) {
            setEditDryNeedlingFormInitialValues({
                document_date: dryNeedlingFileDetails.document_date,
                comments: dryNeedlingFileDetails.comments
            });
        }
    }, [dryNeedlingFileDetails]);

    return (
        <div className="edit-dry-needling-file-component">
            <div className="edit-dry-needling-file-component-form-container">
                <FormControlLabelComponent label={"Edit Dry Needling File"}
                                           size={"xl"}/>
                <Formik
                    validationSchema={EditDryNeedlingFormValidationSchema}
                    initialValues={editDryNeedlingFormInitialValues}
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
                                                    value={CommonService.generateInterventionNameFromMedicalRecord(dryNeedlingFileDetails?.medical_record_details)}
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
                                        isLoading={isDryNeedlingFileEditInProgress}
                                        type={"submit"}
                                        fullWidth={true}
                                    >
                                        {isDryNeedlingFileEditInProgress ? "Updating" : "Update"}
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

export default EditDryNeedlingFileComponent;
