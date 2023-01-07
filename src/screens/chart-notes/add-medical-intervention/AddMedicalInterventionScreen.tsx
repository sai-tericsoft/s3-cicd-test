import "./AddMedicalInterventionScreen.scss";
import * as Yup from "yup";
import {useNavigate, useParams} from "react-router-dom";
import React, {useCallback, useEffect, useState} from "react";
import _ from "lodash";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {ImageConfig, Misc} from "../../../constants";
import CardComponent from "../../../shared/components/card/CardComponent";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import FormAutoSave from "../../../shared/utils/FormAutoSave";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import FormikCheckBoxComponent from "../../../shared/components/form-controls/formik-check-box/FormikCheckBoxComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {getMedicalInterventionDetails} from "../../../store/actions/chart-notes.action";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import ClientMedicalDetailsCardComponent from "../client-medical-details-card/ClientMedicalDetailsCardComponent";

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
    assessment: {
        suspicion_index: '',
        surgery_procedure: ''
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

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {medicalInterventionDetails} = useSelector((state: IRootReducerState) => state.chartNotes);
    const {medicalRecordId, medicalInterventionId} = useParams();
    const [addMedicalInterventionFormInitialValues, setAddMedicalInterventionFormInitialValues] = useState<any>(_.cloneDeep(MedicalInterventionAddFormInitialValues));  // TODO type properly

    const onSubmit = useCallback((values: any, {setSubmitting, setErrors}: FormikHelpers<any>, announce = false) => {
        if (medicalInterventionId) {
            setSubmitting(true);
            CommonService._chartNotes.MedicalInterventionBasicDetailsUpdateAPICall(medicalInterventionId, values)
                .then((response: IAPIResponseType<any>) => {
                    if (announce) {
                        CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    }
                    setSubmitting(false);
                })
                .catch((error: any) => {
                    CommonService.handleErrors(setErrors, error, true);
                    setSubmitting(false);
                })
        }
    }, [medicalInterventionId]);

    useEffect(() => {
        if (medicalInterventionId) {
            dispatch(getMedicalInterventionDetails(medicalInterventionId));
        }
    }, [medicalInterventionId, dispatch]);

    useEffect(() => {
        if (medicalInterventionDetails) {
            setAddMedicalInterventionFormInitialValues(medicalInterventionDetails);
        }
    }, [medicalInterventionDetails]);

    useEffect(() => {
        if (medicalRecordId) {
            dispatch(setCurrentNavParams("Medical Record details", null, () => {
                navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId));
            }));
        }
    }, [navigate, dispatch, medicalRecordId]);

    return (
        <div className={'add-medical-intervention-screen'}>
            <ClientMedicalDetailsCardComponent/>
            <Formik
                validationSchema={MedicalInterventionAddFormValidationSchema}
                initialValues={addMedicalInterventionFormInitialValues}
                onSubmit={(values, formikHelpers) => {
                    onSubmit(values, formikHelpers, false);
                }}
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
                            <div
                                className={"display-flex align-items-center justify-content-space-between mrg-bottom-20"}>
                                <FormControlLabelComponent label={"Soap Note"} className={"mrg-0"}/>
                                {
                                    (medicalInterventionId && medicalRecordId) && <LinkComponent
                                        route={CommonService._routeConfig.MedicalInterventionExerciseLogUpdate(medicalRecordId, medicalInterventionId)}>
                                        <ButtonComponent
                                            prefixIcon={medicalInterventionDetails?.is_having_exercise_log ? <ImageConfig.EditIcon/> :<ImageConfig.AddIcon/>}
                                        >
                                            {
                                                (medicalInterventionDetails?.is_having_exercise_log ? "Edit" : "Add") + " Exercise Log"
                                            }
                                        </ButtonComponent>
                                    </LinkComponent>
                                }
                            </div>
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
                                        <CardComponent title={"Range of Motion and Strength"}
                                                       actions={<>
                                                           {
                                                               (medicalInterventionId && medicalRecordId) && <LinkComponent
                                                                   route={CommonService._routeConfig.MedicalInterventionROMConfig(medicalRecordId, medicalInterventionId)}>
                                                                   <ButtonComponent
                                                                       prefixIcon={<ImageConfig.AddIcon/>}>
                                                                       Add
                                                                   </ButtonComponent>
                                                               </LinkComponent>
                                                           }
                                                       </>}
                                        ></CardComponent>
                                        <CardComponent title={"Special Test"}
                                                       actions={<>
                                                           {
                                                               (medicalInterventionId && medicalRecordId) &&  <LinkComponent
                                                                   route={CommonService._routeConfig.MedicalInterventionSpecialTests(medicalRecordId, medicalInterventionId)}>
                                                                   <ButtonComponent
                                                                       prefixIcon={<ImageConfig.AddIcon/>}>
                                                                       Add
                                                                   </ButtonComponent>
                                                               </LinkComponent>
                                                           }
                                                       </>}
                                        ></CardComponent>
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
                            <CardComponent title={'Assessment (A)'}>
                                <div className="ts-row">
                                    <div className="ts-col-12">
                                        <CardComponent title={"Medical Diagnosis / ICD-11 Codes"}
                                                       actions={<>
                                                           {
                                                               (medicalInterventionId && medicalRecordId) &&  <LinkComponent
                                                                   route={CommonService._routeConfig.MedicalInterventionSpecialTests(medicalRecordId, medicalInterventionId)}>
                                                                   <ButtonComponent
                                                                       prefixIcon={<ImageConfig.AddIcon/>}>
                                                                       Add
                                                                   </ButtonComponent>
                                                               </LinkComponent>
                                                           }
                                                       </>}
                                        ></CardComponent>
                                        <Field name={'assessment.suspicion_index'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikTextAreaComponent
                                                        label={'Index of Suspicion'}
                                                        placeholder={'Index of Suspicion'}
                                                        formikField={field}
                                                        required={false}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                        <Field name={'assessment.surgery_procedure'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikTextAreaComponent
                                                        label={'Surgery Procedure Complete'}
                                                        placeholder={'Surgery Procedure Complete'}
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