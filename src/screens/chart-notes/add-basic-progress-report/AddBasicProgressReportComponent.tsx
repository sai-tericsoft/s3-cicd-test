import "./AddBasicProgressReportComponent.scss";
import React, {useCallback, useEffect, useState} from "react";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import {Field, FieldArray, FieldProps, Form, Formik, FormikHelpers} from "formik";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import FormikDatePickerComponent
    from "../../../shared/components/form-controls/formik-date-picker/FormikDatePickerComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {CommonService} from "../../../shared/services";
import {Misc} from "../../../constants";

interface AddBasicProgressReportComponentProps {
    isProgressReportDrawerOpen?: () => void;
}

const AddBasicProgressReportComponent = (props: AddBasicProgressReportComponentProps) => {

    const {isProgressReportDrawerOpen} = props;
    const [addProgressReportBasicInitialValues, setAddProgressReportBasicInitialValues] = useState<any>({
        intervention_linked_to: '',
        onset_date: '',
        surgery_date: '',
        provider_name: '',
        therapist_name: '',
    });
    const {
        clientMedicalRecord,
    } = useSelector((state: IRootReducerState) => state.client);


    useEffect(() => {
        console.log("clientMedicalRecord", clientMedicalRecord);
        setAddProgressReportBasicInitialValues({
            intervention_linked_to: clientMedicalRecord?.intervention_linked_to,
            onset_date: clientMedicalRecord?.onset_date,
            surgery_date: clientMedicalRecord?.surgery_date,
        })
    }, []);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        console.log(values);
        const payload = {...values};
        if (clientMedicalRecord) {
            CommonService._client.AddBasicProgressReport(clientMedicalRecord?._id, payload)
                .then((response) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                }).catch((error) => {
                CommonService.handleErrors(setErrors, error, true);
            });
        }
    }, [])

    return (
        <div className={'add-basic-progress-report-component'}>

            <FormControlLabelComponent size={'lg'} label={'Add Basic Progress Report'}/>
            <div className={'add-progress-report-container'}>
                <Formik initialValues={addProgressReportBasicInitialValues}
                        onSubmit={onSubmit}
                        validateOnChange={false}
                        validateOnBlur={true}
                        enableReinitialize={true}
                        validateOnMount={true}>
                    {({values, touched, errors, setFieldValue, validateForm}) => {
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        useEffect(() => {
                            validateForm();
                        }, [values, validateForm]);
                        return (<>
                                <Form className={'t-form'} noValidate={true}>
                                    <div>
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
                                    </div>
                                    <div>
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
                                    </div>
                                    <div>
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
                                    </div>
                                    <div>
                                        <Field name={'provider_name'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        titleCase={true}
                                                        label={'Provider Name'}
                                                        formikField={field}
                                                        required={true}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    <div>
                                        <Field name={'therapist_name'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        titleCase={true}
                                                        label={'Therapist Name'}
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
                                            onClick={isProgressReportDrawerOpen}
                                        >
                                            Cancel
                                        </ButtonComponent>
                                        &nbsp;
                                        <ButtonComponent
                                            type={"submit"}
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