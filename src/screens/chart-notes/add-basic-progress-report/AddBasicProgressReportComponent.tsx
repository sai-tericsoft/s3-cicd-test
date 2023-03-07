import "./AddBasicProgressReportComponent.scss";
import React, {useCallback, useEffect, useState} from "react";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import FormikDatePickerComponent
    from "../../../shared/components/form-controls/formik-date-picker/FormikDatePickerComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {CommonService} from "../../../shared/services";
import {Misc} from "../../../constants";
import * as Yup from "yup";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {useNavigate} from "react-router-dom";
import InputComponent from "../../../shared/components/form-controls/input/InputComponent";

const BasicProgressReportValidationSchema = Yup.object({
    physician_name: Yup.string().required('Physician Name is required'),
});

interface AddBasicProgressReportComponentProps {
    onCancel?: () => void;
}

const AddBasicProgressReportComponent = (props: AddBasicProgressReportComponentProps) => {

    const {onCancel} = props;
    const {currentUser} = useSelector((state: IRootReducerState) => state.account);
    const [isProgressReportAddInProgress, setIsProgressReportAddInProgress] = useState<boolean>(false);
    const [addProgressReportBasicInitialValues, setAddProgressReportBasicInitialValues] = useState<any>({
        intervention_linked_to: '',
        onset_date: '',
        surgery_date: '',
        physician_name: '',
    });

    const navigate = useNavigate();
    const {
        clientMedicalRecord,
    } = useSelector((state: IRootReducerState) => state.client);

    useEffect(() => {
        setAddProgressReportBasicInitialValues({
            intervention_linked_to: CommonService.generateInterventionNameFromMedicalRecord(clientMedicalRecord),
            onset_date: clientMedicalRecord?.onset_date,
            surgery_date: clientMedicalRecord?.surgery_date,
        })
    }, [clientMedicalRecord]);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        const payload = {...values};
        if (clientMedicalRecord) {
            setIsProgressReportAddInProgress(true);
            CommonService._chartNotes.AddProgressReportUnderMedicalRecordAPICall(clientMedicalRecord?._id, payload)
                .then((response: IAPIResponseType<any>) => {
                    setIsProgressReportAddInProgress(false);
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    navigate(CommonService._routeConfig.MedicalRecordProgressReportAdvancedDetailsUpdate(clientMedicalRecord?._id, response.data._id, 'add'));
                }).catch((error: any) => {
                CommonService.handleErrors(setErrors, error, true);
                setIsProgressReportAddInProgress(false);
            });
        }
    }, [clientMedicalRecord, navigate])

    return (
        <div className={'add-basic-progress-report-component'}>
            <FormControlLabelComponent size={'lg'} label={'Add Progress Report'}/>
            <div className={'add-progress-report-container'}>
                <Formik initialValues={addProgressReportBasicInitialValues}
                        onSubmit={onSubmit}
                        validationSchema={BasicProgressReportValidationSchema}
                        validateOnChange={false}
                        validateOnBlur={true}
                        enableReinitialize={true}
                        validateOnMount={true}>
                    {({values, isValid, touched, errors, setFieldValue, validateForm}) => {
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        useEffect(() => {
                            validateForm();
                        }, [values, validateForm]);
                        return (<>
                                <Form noValidate={true} className={'t-form'}>
                                    <div className={"t-form-controls"}>
                                        <Field name={'intervention_linked_to'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        titleCase={true}
                                                        label={'Intervention Linked To'}
                                                        disabled={true}
                                                        formikField={field}
                                                        required={true}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                        <Field name={'onset_date'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikDatePickerComponent
                                                        label={'Date of Onset'}
                                                        formikField={field}
                                                        fullWidth={true}
                                                        disabled={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                        <Field name={'surgery_date'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikDatePickerComponent
                                                        label={'Date of Surgery'}
                                                        formikField={field}
                                                        fullWidth={true}
                                                        disabled={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                        <InputComponent className="t-form-control"
                                                        label={'Therapist Name'}
                                                        placeholder={'Therapist Name'}
                                                        value={currentUser?.first_name + " " + currentUser?.last_name}
                                                        required={true}
                                                        fullWidth={true}
                                                        disabled={true}
                                        />
                                        <Field name={'physician_name'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        titleCase={true}
                                                        label={'Physician Name'}
                                                        formikField={field}
                                                        required={true}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    <div className="t-form-actions">
                                        <ButtonComponent
                                            variant={"outlined"}
                                            id={"medical_intervention_add_cancel_btn"}
                                            onClick={onCancel}
                                        >
                                            Cancel
                                        </ButtonComponent>
                                        &nbsp;
                                        <ButtonComponent
                                            type={"submit"}
                                            isLoading={isProgressReportAddInProgress}
                                            disabled={!isValid || isProgressReportAddInProgress}
                                            id={"medical_intervention_add_save_btn"}
                                        >
                                            Save
                                        </ButtonComponent>
                                    </div>
                                </Form>
                            </>
                        )
                    }}
                </Formik>
            </div>
        </div>
    );

};

export default AddBasicProgressReportComponent;
