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

interface MedicalInterventionExerciseLogScreenProps {
}

const MedicalInterventionExerciseLogRow = {
    name: undefined,
    set: undefined,
    rep: undefined,
    time: undefined,
    resistance: undefined,
    id: undefined,
}

const MedicalInterventionExerciseLogInitialValues = {
    logs: [
        {
            ...MedicalInterventionExerciseLogRow,
            _id: CommonService.getUUID()
        }
    ]
}

const MedicalInterventionExerciseLogScreen = (props: MedicalInterventionExerciseLogScreenProps) => {

    const [medicalInterventionExerciseLogValues, setMedicalInterventionExerciseLogValues] = useState<any>(_.cloneDeep(MedicalInterventionExerciseLogInitialValues));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {medicalInterventionId} = useParams();

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
                    name={`logs.${index}.name`}
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
                    name={`logs.${index}.set`}
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
                    name={`logs.${index}.rep`}
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
                    name={`logs.${index}.time`}
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
                    name={`logs.${index}.resistance`}
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
                    name={`logs.${index}.actions`}
                    className="t-form-control">
                    {
                        (field: FieldProps) => (
                            <IconButtonComponent
                                disabled={index === 0}
                                onClick={() => {
                                    const logs = field.form.values.logs;
                                    logs.splice(index, 1);
                                    const newLogs = logs.filter((log: any, i: number) => record._id !==  log._id);
                                    field.form.setFieldValue("logs", newLogs);
                                    // setMedicalInterventionExerciseLogValues({ logs: newLogs });
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
        console.log(values);
        return;
        // make api call to save data
    }, []);

    useEffect(() => {
        dispatch(setCurrentNavParams("SOAP Note", null, () => {
            medicalInterventionId && navigate(CommonService._routeConfig.AddMedicalIntervention(medicalInterventionId));
        }));
    }, [dispatch, navigate, medicalInterventionId]);

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
                                    data={values.logs}
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
                                                logs: [...medicalInterventionExerciseLogValues.logs, {
                                                    ...MedicalInterventionExerciseLogRow,
                                                    _id: CommonService.getUUID()
                                                }]
                                            })
                                        }}
                                    >
                                        Add Exercise Row
                                    </ButtonComponent>
                                </div>
                            </div>
                            <div className="t-form-actions">
                                <ButtonComponent variant={"outlined"}
                                                 disabled={isSubmitting}
                                                 isLoading={isSubmitting}>
                                    Cancel
                                </ButtonComponent>&nbsp;&nbsp;
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
