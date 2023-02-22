import "./MedicalInterventionExerciseLogUpdateScreen.scss";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import TableComponent from "../../../shared/components/table/TableComponent";
import _ from "lodash";
import IconButtonComponent from "../../../shared/components/icon-button/IconButtonComponent";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import {ImageConfig} from "../../../constants";
import {CommonService} from "../../../shared/services";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {IService} from "../../../shared/models/service.model";
import * as Yup from "yup";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import ExerciseLogAttachmentListComponent from "../exercise-log-attachment-list/ExerciseLogAttachmentListComponent";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import MedicalInterventionLinkedToComponent
    from "../medical-intervention-linked-to/MedicalInterventionLinkedToComponent";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import {IRootReducerState} from "../../../store/reducers";
import {getClientMedicalRecord} from "../../../store/actions/client.action";
import {getMedicalInterventionDetails} from "../../../store/actions/chart-notes.action";
import moment from "moment-timezone";
import InputComponent from "../../../shared/components/form-controls/input/InputComponent";

interface MedicalInterventionExerciseLogScreenProps {

}

const MedicalInterventionExerciseLogRow = {
    key: undefined,
    name: undefined,
    no_of_sets: undefined,
    no_of_reps: undefined,
    time: undefined,
    resistance: undefined,
}

const MedicalInterventionExerciseLogInitialValues = {
    exercise_records: [
        {
            ...MedicalInterventionExerciseLogRow,
            key: CommonService.getUUID(),
        }
    ]
}

const ExerciseLogRecordValidationSchema = Yup.object({
    no_of_sets: Yup.string().required(''),
    no_of_reps: Yup.string().required(''),
    time: Yup.string().required(''),
    resistance: Yup.string().required(''),
    name: Yup.string().required(''),
})

const MedicalInterventionExerciseLogFormValidationSchema = Yup.object({
    exercise_records: Yup.array(ExerciseLogRecordValidationSchema)
});

const MedicalInterventionExerciseLogUpdateScreen = (props: MedicalInterventionExerciseLogScreenProps) => {

    const [medicalInterventionExerciseLogValues, setMedicalInterventionExerciseLogValues] = useState<any>(_.cloneDeep(MedicalInterventionExerciseLogInitialValues));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {medicalRecordId, medicalInterventionId} = useParams();
    const [medicalInterventionExerciseLogDetails, setMedicalInterventionExerciseLogDetails] = useState<any>(undefined);
    const [isMedicalInterventionExerciseLogDetailsLoading, setIsMedicalInterventionExerciseLogDetailsLoading] = useState<boolean>(false);
    const {currentUser} = useSelector((state: IRootReducerState) => state.account);

    const {
        clientMedicalRecord,
        isClientMedicalRecordLoaded,
    } = useSelector((state: IRootReducerState) => state.client);

    const medicalInterventionExerciseLogColumns = useMemo<any>(() => [
        {
            title: 'Exercise',
            dataIndex: 'exercise',
            key: 'exercise',
            width: 130,
            render: (record: any, index: any) => {
                return index === 0 ? "Warm Up" : "Ex " + index;
            }
        },
        {
            title: 'Exercise Name',
            key: 'name',
            width: 280,
            render: (record: any, index: any) => {
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
            width: 150,
            render: (record: any, index: any) => {
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
            width: 150,
            render: (record: any, index: any) => {
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
            width: 150,
            render: (record: any, index: any) => {
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
            width: 150,
            render: (record: any, index: any) => {
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
            render: (record: any, index: any) => {
                return (
                    <>
                        {
                            (index === 1) && (
                                <Field
                                    name={`exercise_records.${index}.actions`}
                                    className="t-form-control">
                                    {
                                        (field: FieldProps) => (

                                            <IconButtonComponent
                                                onClick={() => {
                                                    const exercise_records = field.form.values.exercise_records;
                                                    exercise_records.splice(index, 1);
                                                    const newLogs = exercise_records.filter((log: any) => record.key !== log.key);
                                                    field.form.setFieldValue("exercise_records", newLogs);
                                                }}>
                                                <ImageConfig.DeleteIcon/>
                                            </IconButtonComponent>
                                        )
                                    }
                                </Field>
                            )
                        }
                    </>
                )
            }
        }
    ], []);

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
    }, [medicalInterventionId]);

    const {
        medicalInterventionDetails,
    } = useSelector((state: IRootReducerState) => state.chartNotes);

    useEffect(() => {
        if (medicalRecordId && medicalInterventionId) {
            dispatch(setCurrentNavParams("SOAP Note", null, () => {
                medicalInterventionId && navigate(CommonService._routeConfig.AddMedicalIntervention(medicalRecordId, medicalInterventionId));
            }));
        }
    }, [dispatch, navigate, medicalRecordId, medicalInterventionId]);

    useEffect(() => {
        if (medicalRecordId) {
            dispatch(getClientMedicalRecord(medicalRecordId));
        }
    }, [medicalRecordId, dispatch]);

    const fetchMedicalInterventionExerciseLogDetails = useCallback((medicalInterventionId: string) => {
        setIsMedicalInterventionExerciseLogDetailsLoading(true);
        CommonService._chartNotes.FetchMedicalInterventionExerciseLogAPICall(medicalInterventionId, {})
            .then((response: IAPIResponseType<IService>) => {
                setMedicalInterventionExerciseLogDetails(response.data);
                setIsMedicalInterventionExerciseLogDetailsLoading(false);
            }).catch((error: any) => {
            setMedicalInterventionExerciseLogDetails({});
            setIsMedicalInterventionExerciseLogDetailsLoading(false);
        })
    }, []);

    useEffect(() => {
        if (medicalInterventionId) {
            dispatch(getMedicalInterventionDetails(medicalInterventionId));
        }
    }, [medicalInterventionId, dispatch]);

    useEffect(() => {
        if (medicalInterventionId) {
            fetchMedicalInterventionExerciseLogDetails(medicalInterventionId);
        }
    }, [medicalInterventionId, fetchMedicalInterventionExerciseLogDetails]);

    useEffect(() => {
        const exercise_records = medicalInterventionExerciseLogDetails?.exercise_records;
        if (exercise_records && exercise_records?.length > 0) {
            setMedicalInterventionExerciseLogValues({
                exercise_records: _.cloneDeep(exercise_records.map((item: any) => {
                    return {
                        ...item,
                        key: CommonService.getUUID()
                    }
                }))
            });
        } else {
            setMedicalInterventionExerciseLogValues(_.cloneDeep(MedicalInterventionExerciseLogInitialValues));
        }
    }, [medicalInterventionExerciseLogDetails]);

    const handleExerciseLogClear = useCallback((values: any, setFieldValue: any) => {
        const exercise_records = _.cloneDeep(values.exercise_records);
        const new_exercise_records = exercise_records.map((record: any) => ({
            ...record,
            name: "",
            no_of_reps: "",
            no_of_sets: "",
            time: "",
            resistance: "",
        }));
        setFieldValue("exercise_records", new_exercise_records);
    }, []);

    console.log('clientMedicalRecord', clientMedicalRecord);
    console.log('medicalInterventionDetails', medicalInterventionDetails);

    return (
        <div className={'medical-intervention-exercise-log-screen'}>

            <PageHeaderComponent title={'Add Exercise Log'} actions={
                <div className="last-updated-status">
                    <div className="last-updated-status-text">Last Updated On:&nbsp;</div>
                    <div
                        className="last-updated-status-bold">
                        {(medicalInterventionDetails?.updated_at ? moment(medicalInterventionDetails.updated_at).tz(moment.tz.guess()).format('DD-MM-YYYY | hh:mm A z') : 'N/A')}&nbsp;-&nbsp;
                        {medicalInterventionDetails?.last_updated_by_details?.first_name ? medicalInterventionDetails?.last_updated_by_details?.first_name + ' ' + medicalInterventionDetails?.last_updated_by_details?.last_name : ' NA'}
                    </div>
                </div>}/>
            {
                (isClientMedicalRecordLoaded && clientMedicalRecord) && <>
                    <CardComponent color={'primary'}>
                        <div className={'client-name-button-wrapper'}>
                                    <span className={'client-name-wrapper'}>
                                        <span className={'client-name'}>
                                                {clientMedicalRecord?.client_details?.first_name || "-"} {clientMedicalRecord?.client_details?.last_name || "-"}
                                        </span>
                                        <ChipComponent
                                            className={clientMedicalRecord?.status === "open" ? "active" : "inactive"}
                                            size={'small'}
                                            label={clientMedicalRecord?.status || "-"}/>
                                    </span>
                        </div>
                        <MedicalInterventionLinkedToComponent medicalRecordDetails={clientMedicalRecord}/>
                        <div className={'ts-row'}>
                            <div className={'ts-col-6'}>
                                <DataLabelValueComponent label={'Date of Intervention'}>
                                    {CommonService.transformTimeStamp(clientMedicalRecord?.created_at || "N/A")}
                                </DataLabelValueComponent>
                            </div>
                        </div>
                    </CardComponent>
                </>
            }
            <div className={'provider-name'}>
                <InputComponent placeholder={'Provider'} fullWidth={true} label={'Provider'}
                                value={CommonService.extractName(currentUser)} disabled={true}/>
            </div>
            <ExerciseLogAttachmentListComponent/>
            <>
                {
                    isMedicalInterventionExerciseLogDetailsLoading && <LoaderComponent/>
                }
                {
                    !isMedicalInterventionExerciseLogDetailsLoading &&
                    <Formik initialValues={medicalInterventionExerciseLogValues}
                            validationSchema={MedicalInterventionExerciseLogFormValidationSchema}
                            enableReinitialize={true}
                            onSubmit={handleSubmit}>
                        {({values, validateForm, isSubmitting, setFieldValue, isValid}) => {
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            useEffect(() => {
                                validateForm();
                            }, [validateForm, values]);
                            return (
                                <Form className="t-form" noValidate={true}>
                                    <div className={'special-test-table-container'}>
                                        <div
                                            className={"display-flex align-items-center flex-direction-row-reverse mrg-bottom-20"}>
                                            <ButtonComponent
                                                prefixIcon={<ImageConfig.CloseIcon/>}
                                                disabled={(values.exercise_records.length > 0 && ExerciseLogRecordValidationSchema.isValidSync(values.exercise_records[values.exercise_records.length - 1]) === false)}

                                                onClick={() => {
                                                    handleExerciseLogClear(values, setFieldValue);
                                                }}
                                            >
                                                Clear Exercise Log
                                            </ButtonComponent>
                                        </div>
                                        <TableComponent
                                            data={values.exercise_records}
                                            bordered={true}
                                            rowKey={(record: any, index: any) => index}
                                            columns={medicalInterventionExerciseLogColumns}/>
                                        <div className={"h-v-center mrg-top-20"}>
                                            <ButtonComponent
                                                size={"large"}
                                                prefixIcon={<ImageConfig.AddIcon/>}
                                                disabled={(values.exercise_records.length > 0 && ExerciseLogRecordValidationSchema.isValidSync(values.exercise_records[values.exercise_records.length - 1]) === false)}
                                                onClick={() => {
                                                    const exercise_records = _.cloneDeep(values.exercise_records);
                                                    exercise_records.push({
                                                        ...MedicalInterventionExerciseLogRow,
                                                        key: CommonService.getUUID()
                                                    });
                                                    setFieldValue("exercise_records", exercise_records);
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
                                                         disabled={isSubmitting || !isValid}
                                                         isLoading={isSubmitting}>
                                            Save
                                        </ButtonComponent>
                                    </div>
                                </Form>
                            );
                        }}
                    </Formik>
                }
            </>
        </div>
    );

};

export default MedicalInterventionExerciseLogUpdateScreen;
