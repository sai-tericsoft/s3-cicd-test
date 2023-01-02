import "./MedicalInterventionExerciseLogScreen.scss";
import React, {useCallback, useEffect, useState} from "react";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import TableComponent from "../../../shared/components/table/TableComponent";
import _ from "lodash";
import IconButtonComponent from "../../../shared/components/icon-button/IconButtonComponent";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import {ImageConfig} from "../../../constants";
import {CommonService} from "../../../shared/services";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {useDispatch} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import LinkComponent from "../../../shared/components/link/LinkComponent";

interface MedicalInterventionExerciseLogScreenProps {
}

const MedicalInterventionExerciseLogRow = {
    key: undefined,
    no_of_sets: undefined,
    no_of_reps: undefined,
    time: undefined,
    resistance: undefined,
}

const MedicalInterventionExerciseLogInitialValues = {
    exercise_records: [
        {
            ...MedicalInterventionExerciseLogRow,
            key: CommonService.getUUID()
        }
    ]
}

const MedicalInterventionExerciseLogScreen = (props: MedicalInterventionExerciseLogScreenProps) => {

    const [medicalInterventionExerciseLogValues, setMedicalInterventionExerciseLogValues] = useState<any>(_.cloneDeep(MedicalInterventionExerciseLogInitialValues));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {medicalRecordId, medicalInterventionId} = useParams();

    const medicalInterventionExerciseLogColumns = [
        {
            title: 'Exercise',
            dataIndex: 'exercise',
            key: 'exercise',
            render: (_: any, record: any, index: any) => {
                return index === 0 ? "Warm Up" : "Ex " + index;
            }
        },
        {
            title: 'Exercise Name',
            key: 'name',
            render: (_: any, record: any, index: any) => {
                return <Field
                    name={`exercise_records.${index}.name`}
                    className="t-form-control">
                    {
                        (field: FieldProps) => (
                            <FormikInputComponent
                                size={"small"}
                                formikField={field}
                            />
                        )
                    }
                </Field>
            }
        },
        {
            title: 'SET',
            key: 'set',
            render: (_: any, record: any, index: any) => {
                return <Field
                    name={`exercise_records.${index}.no_of_sets`}
                    className="t-form-control">
                    {
                        (field: FieldProps) => (
                            <FormikInputComponent
                                size={"small"}
                                formikField={field}
                            />
                        )
                    }
                </Field>
            }
        },
        {
            title: 'REP',
            key: 'rep',
            render: (_: any, record: any, index: any) => {
                return <Field
                    name={`exercise_records.${index}.no_of_reps`}
                    className="t-form-control">
                    {
                        (field: FieldProps) => (
                            <FormikInputComponent
                                size={"small"}
                                formikField={field}
                            />
                        )
                    }
                </Field>
            }
        },
        {
            title: 'TIME',
            key: 'time',
            render: (_: any, record: any, index: any) => {
                return <Field
                    name={`exercise_records.${index}.time`}
                    className="t-form-control">
                    {
                        (field: FieldProps) => (
                            <FormikInputComponent
                                size={"small"}
                                formikField={field}
                            />
                        )
                    }
                </Field>
            }
        },
        {
            title: 'RESISTANCE',
            key: 'resistance',
            render: (_: any, record: any, index: any) => {
                return <Field
                    name={`exercise_records.${index}.resistance`}
                    className="t-form-control">
                    {
                        (field: FieldProps) => (
                            <FormikInputComponent
                                size={"small"}
                                formikField={field}
                            />
                        )
                    }
                </Field>
            }
        },
        {
            title: '',
            key: 'actions',
            render: (_: any, record: any, index: any) => {
                return <Field
                    name={`exercise_records.${index}.actions`}
                    className="t-form-control">
                    {
                        (field: FieldProps) => (
                            <IconButtonComponent
                                disabled={index === 0}
                                onClick={() => {
                                    const exercise_records = field.form.values.exercise_records;
                                    exercise_records.splice(index, 1);
                                    const newLogs = exercise_records.filter((log: any, i: number) => record._id !== log._id);
                                    field.form.setFieldValue("exercise_records", newLogs);
                                }}>
                                <ImageConfig.DeleteIcon/>
                            </IconButtonComponent>
                        )
                    }
                </Field>
            }
        }
    ];

    const handleSubmit = useCallback((values: any, {setSubmitting}: FormikHelpers<any>) => {
        if (medicalInterventionId) {
            const payload: any = {
                exercise_records: []
            };
            values.exercise_records.forEach((record: any, index: number) => {
                payload.exercise_records.push({
                    id: index === 0 ? "Warm Up" : "Ex " + index,
                    ...record
                });
            });
            setSubmitting(true);
            CommonService._chartNotes.SaveMedicalInterventionExerciseLogAPICall(medicalInterventionId, payload)
                .then((response: any) => {
                    CommonService._alert.showToast(response.message, 'success');
                    setSubmitting(false);
                })
                .catch((error: any) => {
                    CommonService._alert.showToast(error.error || error.errors || 'Error saving Exercise log', 'error');
                    setSubmitting(false);
                });
        }
    }, []);

    useEffect(() => {
        if (medicalRecordId && medicalInterventionId) {
            dispatch(setCurrentNavParams("SOAP Note", null, () => {
                medicalInterventionId && navigate(CommonService._routeConfig.AddMedicalIntervention(medicalRecordId, medicalInterventionId));
            }));
        }
    }, [dispatch, navigate, medicalRecordId, medicalInterventionId]);

    return (
        <div className={'medical-intervention-exercise-log-screen'}>
            <FormControlLabelComponent label={'Exercise Log'}/>
            <Formik initialValues={medicalInterventionExerciseLogValues}
                    enableReinitialize={true}
                    onSubmit={handleSubmit}>
                {({values, validateForm, isSubmitting}) => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    useEffect(() => {
                        validateForm();
                    }, [validateForm, values]);
                    return (
                        <Form className="t-form" noValidate={true}>
                            <div className={'special-test-table-container'}>
                                <TableComponent
                                    data={values.exercise_records}
                                    rowKey={(item: any) => item._id}
                                    bordered={true}
                                    columns={medicalInterventionExerciseLogColumns}/>
                                <div className={"h-v-center mrg-top-20"}>
                                    <ButtonComponent
                                        size={"large"}
                                        prefixIcon={<ImageConfig.AddIcon/>}
                                        onClick={() => {
                                            setMedicalInterventionExerciseLogValues({
                                                ...medicalInterventionExerciseLogValues,
                                                exercise_records: [...medicalInterventionExerciseLogValues.exercise_records, {
                                                    ...MedicalInterventionExerciseLogRow,
                                                    key: CommonService.getUUID()
                                                }]
                                            })
                                        }}
                                    >
                                        Add Exercise Row
                                    </ButtonComponent>
                                </div>
                            </div>
                            <div className="t-form-actions">
                                {(medicalRecordId && medicalInterventionId) && <LinkComponent
                                    route={CommonService._routeConfig.AddMedicalIntervention(medicalRecordId, medicalInterventionId)}>
                                    <ButtonComponent variant={"outlined"}
                                                     disabled={isSubmitting}
                                                     isLoading={isSubmitting}>
                                        Cancel
                                    </ButtonComponent>
                                </LinkComponent>}
                                &nbsp;&nbsp;
                                <ButtonComponent type={"submit"}
                                                 disabled={isSubmitting}
                                                 isLoading={isSubmitting}>
                                    Save
                                </ButtonComponent>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );

};

export default MedicalInterventionExerciseLogScreen;
