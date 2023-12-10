import "./EditProgressReportCardComponent.scss";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import React, {useCallback, useEffect, useState} from "react";
import {CommonService} from "../../../shared/services";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {Misc} from "../../../constants";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import FormikDatePickerComponent
    from "../../../shared/components/form-controls/formik-date-picker/FormikDatePickerComponent";
import InputComponent from "../../../shared/components/form-controls/input/InputComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";

interface EditProgressReportCardComponentProps {
onCancel?: () => void;
onSave?: () => void;
}

const EditProgressReportCardComponent = (props: EditProgressReportCardComponentProps) => {

    const {onSave} = props;
    const {currentUser} = useSelector((state: IRootReducerState) => state.account);
    const {
        clientMedicalRecordProgressReportDetails
    } = useSelector((state: IRootReducerState) => state.chartNotes);

    const [isProgressReportEditInProgress, setIsProgressReportEditInProgress] = useState<boolean>(false);
    const [addProgressReportBasicInitialValues, setAddProgressReportBasicInitialValues] = useState<any>({
        intervention_linked_to: '',
        onset_date: '',
        surgery_date: '',
        physician_name: '',
    });

    const {
        clientMedicalRecord,
    } = useSelector((state: IRootReducerState) => state.client);
    
    console.log('clientMedicalRecordProgressReportDetails',clientMedicalRecordProgressReportDetails);

    useEffect(() => {
        setAddProgressReportBasicInitialValues({
            intervention_linked_to: CommonService.generateInterventionNameFromMedicalRecord(clientMedicalRecord),
            onset_date: clientMedicalRecordProgressReportDetails?.medical_record_details?.onset_date && CommonService.getSystemFormatTimeStamp(clientMedicalRecordProgressReportDetails?.medical_record_details?.onset_date),
            surgery_date: clientMedicalRecordProgressReportDetails?.medical_record_details?.surgery_date && CommonService.getSystemFormatTimeStamp(clientMedicalRecordProgressReportDetails?.medical_record_details?.surgery_date),
            physician_name: clientMedicalRecordProgressReportDetails?.physician_name,
        })
    }, [clientMedicalRecord,clientMedicalRecordProgressReportDetails]);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        const payload = {...values};
        if (clientMedicalRecordProgressReportDetails) {
            setIsProgressReportEditInProgress(true);
            CommonService._chartNotes.UpdateProgressReportUnderMedicalRecordAPICall(clientMedicalRecordProgressReportDetails?._id, payload)
                .then((response: IAPIResponseType<any>) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    setIsProgressReportEditInProgress(false);
                    onSave && onSave();
                }).catch((error: any) => {
                CommonService.handleErrors(setErrors, error, true);
                setIsProgressReportEditInProgress(false);
            });
        }
    }, [clientMedicalRecordProgressReportDetails, onSave])

    return (
        <div className={'edit-progress-report-card-component'}>
            <FormControlLabelComponent size={'lg'} label={'Edit Progress Report'}/>
            <div className={'add-progress-report-container'}>
                <Formik initialValues={addProgressReportBasicInitialValues}
                        onSubmit={onSubmit}
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
                                                        label={'Intervention Linked to'}
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
                                                        placeholder={'Enter Physician Name'}
                                                        formikField={field}
                                                        required={true}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    <div className="t-form-actions">
                                        {/*<ButtonComponent*/}
                                        {/*    variant={"outlined"}*/}
                                        {/*    id={"medical_intervention_add_cancel_btn"}*/}
                                        {/*    onClick={onCancel}*/}
                                        {/*>*/}
                                        {/*    Cancel*/}
                                        {/*</ButtonComponent>*/}
                                        {/*&nbsp;*/}
                                        <ButtonComponent
                                            type={"submit"}
                                            fullWidth={true}
                                            isLoading={isProgressReportEditInProgress}
                                            disabled={!isValid || isProgressReportEditInProgress}
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

export default EditProgressReportCardComponent;
