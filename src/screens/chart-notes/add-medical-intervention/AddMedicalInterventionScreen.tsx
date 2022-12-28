import "./AddMedicalInterventionScreen.scss";
import * as Yup from "yup";
import {useParams} from "react-router-dom";
import React, {useCallback, useEffect, useState} from "react";
import _ from "lodash";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {Misc} from "../../../constants";
import CardComponent from "../../../shared/components/card/CardComponent";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import FormAutoSave from "../../../shared/utils/formAutoSave";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import {IServiceCategory} from "../../../shared/models/service-category.model";
import FormikCheckBoxComponent from "../../../shared/components/form-controls/formik-check-box/FormikCheckBoxComponent";

interface AddMedicalInterventionScreenProps {

}

const MedicalInterventionAddFormInitialValues: any = { // TODO type properly
    subjective: "",
    plan: {
        plan: "",
        md_recommendations: "",
        education: "",
        treatment_goals: "",
    },
    objective: {
        observation: "",
        palpation: "",
        functional_tests: "",
        treatment: "",
        treatment_response: ""
    },
    is_flagged: false
};

const MedicalInterventionAddFormValidationSchema = Yup.object().shape({});

const AddMedicalInterventionScreen = (props: AddMedicalInterventionScreenProps) => {

    const {medicalInterventionId} = useParams();
    const [addMedicalInterventionFormInitialValues, setAddMedicalInterventionFormInitialValues] = useState<any>(_.cloneDeep(MedicalInterventionAddFormInitialValues));  // TODO type properly

    const onSubmit = useCallback((values: any, {setSubmitting, setErrors}: FormikHelpers<any>) => {
        if (medicalInterventionId) {
            setSubmitting(true);
            CommonService._chartNotes.MedicalInterventionBasicDetailsUpdateAPICall(medicalInterventionId, values)
                .then((response: IAPIResponseType<any>) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    setSubmitting(false);
                })
                .catch((error: any) => {
                    CommonService.handleErrors(setErrors, error, true);
                    setSubmitting(false);
                })
        }
    }, [medicalInterventionId]);

    const [medicalInterventionDetails, setMedicalInterventionDetails] = useState<IServiceCategory | undefined>(undefined);
    // const [isMedicalInterventionDetailsLoading, setIsMedicalInterventionDetailsLoading] = useState<boolean>(false);
    // const [isMedicalInterventionDetailsLoaded, setIsMedicalInterventionDetailsLoaded] = useState<boolean>(false);
    // const [isMedicalInterventionDetailsLoadingFailed, setIsMedicalInterventionDetailsLoadingFailed] = useState<boolean>(false);

    const fetchMedicalInterventionDetails = useCallback((serviceCategoryId: string) => {
        // setIsMedicalInterventionDetailsLoading(true);
        CommonService._chartNotes.FetchMedicalInterventionBasicDetailsAPICall(serviceCategoryId, {})
            .then((response: IAPIResponseType<any>) => { // TODO: to type properly
                setMedicalInterventionDetails(response.data);
                // setIsMedicalInterventionDetailsLoading(false);
                // setIsMedicalInterventionDetailsLoaded(true);
                // setIsMedicalInterventionDetailsLoadingFailed(false);
            }).catch((error: any) => {
            // setIsMedicalInterventionDetailsLoading(false);
            // setIsMedicalInterventionDetailsLoaded(false);
            // setIsMedicalInterventionDetailsLoadingFailed(true);
        })
    }, []);

    useEffect(() => {
        if (medicalInterventionId) {
            fetchMedicalInterventionDetails(medicalInterventionId);
        }
    }, [medicalInterventionId, fetchMedicalInterventionDetails]);

    useEffect(() => {
        if (medicalInterventionDetails) {
            setAddMedicalInterventionFormInitialValues(medicalInterventionDetails);
        }
    }, [medicalInterventionDetails]);

    return (
        <div className={'add-medical-intervention-screen'}>
            {/* Medical Intervention details card goes here.*/}
            <Formik
                validationSchema={MedicalInterventionAddFormValidationSchema}
                initialValues={addMedicalInterventionFormInitialValues}
                onSubmit={onSubmit}
                validateOnChange={false}
                validateOnBlur={true}
                enableReinitialize={true}
                validateOnMount={true}>
                {(formik) => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    useEffect(() => {
                        formik.validateForm();
                        // eslint-disable-next-line react-hooks/exhaustive-deps
                    }, [formik.validateForm, formik.values]);
                    return (
                        <Form className="t-form" noValidate={true}>
                            <FormAutoSave formikCtx={formik}/>
                            <FormControlLabelComponent label={"Soap Note"}/>
                            <CardComponent title={'Subjective (S)'}>
                                <div className="ts-row">
                                    <div className="ts-col-12">
                                        <Field name={'subjective'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikTextAreaComponent
                                                        label={'Subjective'}
                                                        placeholder={'Please enter your note here...'}
                                                        formikField={field}
                                                        required={false}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                </div>
                            </CardComponent>
                            <CardComponent title={'Objective (O)'}
                                           actions={<>
                                               <Field name={'is_flagged'}>
                                                   {
                                                       (field: FieldProps) => (
                                                           <FormikCheckBoxComponent
                                                               label={'Flag Note'}
                                                               formikField={field}
                                                               required={false}
                                                               labelPlacement={"start"}
                                                           />
                                                       )
                                                   }
                                               </Field>
                                           </>}
                            >
                                <div className="ts-row">
                                    <div className="ts-col-12">
                                        <Field name={'objective.observation'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikTextAreaComponent
                                                        label={'Observation'}
                                                        placeholder={'Observation'}
                                                        formikField={field}
                                                        required={false}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                        <Field name={'objective.palpation'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikTextAreaComponent
                                                        label={'Palpation'}
                                                        placeholder={'Palpation'}
                                                        formikField={field}
                                                        required={false}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                        <Field name={'objective.functional_tests'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikTextAreaComponent
                                                        label={'Functional Tests'}
                                                        placeholder={'Functional Tests'}
                                                        formikField={field}
                                                        required={false}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                        <Field name={'objective.treatment'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikTextAreaComponent
                                                        label={'Treatment'}
                                                        placeholder={'Treatment'}
                                                        formikField={field}
                                                        required={false}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                        <Field name={'objective.treatment_response'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikTextAreaComponent
                                                        label={'Response to Treatment'}
                                                        placeholder={'Response to Treatment'}
                                                        formikField={field}
                                                        required={false}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>

                                    </div>
                                </div>
                            </CardComponent>
                            <CardComponent title={'Plan (P)'}>
                                <div className="ts-row">
                                    <div className="ts-col-12">
                                        <Field name={'plan.plan'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikTextAreaComponent
                                                        label={'Plan'}
                                                        placeholder={'Plan'}
                                                        formikField={field}
                                                        required={false}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                        <Field name={'plan.md_recommendations'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikTextAreaComponent
                                                        label={'MD Recommendations'}
                                                        placeholder={'MD Recommendations'}
                                                        formikField={field}
                                                        required={false}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                        <Field name={'plan.education'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikTextAreaComponent
                                                        label={'Education'}
                                                        placeholder={'Education'}
                                                        formikField={field}
                                                        required={false}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                        <Field name={'plan.treatment_goals'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikTextAreaComponent
                                                        label={'Treatment Goals'}
                                                        placeholder={'Treatment Goals'}
                                                        formikField={field}
                                                        required={false}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                </div>
                            </CardComponent>
                            <div className="t-form-actions">
                                <ButtonComponent
                                    variant={"outlined"}
                                    disabled={formik.isSubmitting}
                                    id={"medical_intervention_add_cancel_btn"}
                                >
                                    Cancel
                                </ButtonComponent>
                                &nbsp;
                                <ButtonComponent
                                    isLoading={formik.isSubmitting}
                                    type={"submit"}
                                    id={"medical_intervention_add_save_btn"}
                                >
                                    {formik.isSubmitting ? "Saving" : "Save"}
                                </ButtonComponent>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );

};

export default AddMedicalInterventionScreen;
