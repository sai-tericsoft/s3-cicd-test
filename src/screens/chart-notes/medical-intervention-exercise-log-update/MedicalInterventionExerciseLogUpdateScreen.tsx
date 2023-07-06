import "./MedicalInterventionExerciseLogUpdateScreen.scss";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Field, FieldProps, Form, Formik, FormikHelpers, FormikProps} from "formik";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import TableComponent from "../../../shared/components/table/TableComponent";
import _ from "lodash";
import IconButtonComponent from "../../../shared/components/icon-button/IconButtonComponent";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import {ImageConfig, Misc} from "../../../constants";
import {CommonService} from "../../../shared/services";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {IService} from "../../../shared/models/service.model";
import * as Yup from "yup";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import MedicalInterventionLinkedToComponent
    from "../medical-intervention-linked-to/MedicalInterventionLinkedToComponent";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import {IRootReducerState} from "../../../store/reducers";
import {getClientMedicalRecord} from "../../../store/actions/client.action";
import {getInterventionAttachmentList, getMedicalInterventionDetails} from "../../../store/actions/chart-notes.action";
import moment from "moment-timezone";
import InputComponent from "../../../shared/components/form-controls/input/InputComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";


interface MedicalInterventionExerciseLogScreenProps {

}

const MedicalInterventionExerciseLogRow = {
    key: undefined,
    name: undefined,
    no_of_sets: '-',
    no_of_reps: '-',
    time: '-',
    resistance: '-',
}

const MedicalInterventionExerciseLogInitialValues = {
    exercise_records: [
        {
            ...MedicalInterventionExerciseLogRow,
            key: CommonService.getUUID(),
        }
    ],
    comments: '',
}

const ExerciseLogRecordValidationSchema = Yup.object({
    // no_of_sets: Yup.string().required(''),
    // no_of_reps: Yup.string().required(''),
    // time: Yup.string().required(''),
    // resistance: Yup.string().required(''),
    // name: Yup.string().required('Required'),
})

const MedicalInterventionExerciseLogFormValidationSchema = Yup.object({
    exercise_records: Yup.array(ExerciseLogRecordValidationSchema),
});

const MedicalInterventionExerciseLogUpdateScreen = (props: MedicalInterventionExerciseLogScreenProps) => {
    const {
        attachmentList,
        isAttachmentListLoaded,
    } = useSelector((state: IRootReducerState) => state.chartNotes);

    const [medicalInterventionExerciseLogValues, setMedicalInterventionExerciseLogValues] = useState<any>(_.cloneDeep(MedicalInterventionExerciseLogInitialValues));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {medicalRecordId, medicalInterventionId, mode} = useParams();
    const [medicalInterventionExerciseLogDetails, setMedicalInterventionExerciseLogDetails] = useState<any>(undefined);
    const [isMedicalInterventionExerciseLogDetailsLoading, setIsMedicalInterventionExerciseLogDetailsLoading] = useState<boolean>(false);
    const {currentUser} = useSelector((state: IRootReducerState) => state.account);
    const location = useLocation();
    const formRef = useRef<FormikProps<any>>(null);
    const [selectedAttachment, setSelectedAttachment] = useState<any>(null);

    //-----------------------------------ExerciseLogAttachmentStartsHere-------------------------------------
    const [isAttachmentBeingUploaded, setIsAttachmentBeingUploaded] = React.useState<boolean>(false);
    const [isAttachmentBeingDeleted, setIsAttachmentBeingDeleted] = React.useState<boolean>(false);

    console.log(attachmentList);

    useEffect(() => {
        if (medicalInterventionId) {
            dispatch(getInterventionAttachmentList(medicalInterventionId));
        }
    }, [medicalInterventionId, dispatch]);

    const hiddenFileInput = React.useRef<any>(null);

    const handleClick = useCallback(() => {
        hiddenFileInput.current.click();
    }, []);

    // const handleRemoveAttachment = useCallback((attachment: any) => {
    //     const filteredAttachment = attachments?.filter((item: any) => item?.lastModified !== attachment?.lastModified);
    //     setAttachments(filteredAttachment)
    // }, [attachments]);

    const handleFileSubmit = useCallback(() => {
        if (medicalInterventionId) {
            setIsAttachmentBeingUploaded(true);
            const formData = CommonService.getFormDataFromJSON({attachment: selectedAttachment});
            CommonService._chartNotes.AddExerciseLogAttachment(medicalInterventionId, formData)
                .then((response: any) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    dispatch(getInterventionAttachmentList(medicalInterventionId));
                    setIsAttachmentBeingUploaded(false);
                    setSelectedAttachment(null);
                })
                .catch((error: any) => {
                    setIsAttachmentBeingUploaded(false);
                    CommonService._alert.showToast(error[Misc.API_RESPONSE_MESSAGE_KEY], "error");
                })
        }
    }, [dispatch, medicalInterventionId, selectedAttachment])

    const removeAttachment = useCallback((item: any, medicalInterventionId: string) => {
        CommonService.onConfirm({
            confirmationTitle: 'Do you want to remove this attachment',
            confirmationSubTitle: `Do you want to remove "${item.name}" this attachment"?`
        }).then(() => {
            setIsAttachmentBeingDeleted(true);
            CommonService._chartNotes.RemoveExerciseLogAttachmentAPICall(medicalInterventionId, item._id, {})
                .then((response) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    dispatch(getInterventionAttachmentList(medicalInterventionId));
                    setIsAttachmentBeingDeleted(false);
                }).catch((error: any) => {
                setIsAttachmentBeingDeleted(false);
                CommonService._alert.showToast(error.error || "Error deleting attachment", "error");
            })
        })
    }, [dispatch]);

    //--------------------------------ExerciseLogAttachmentEndsHere----------------------------------------------

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
            align: 'center',
            render: (record: any, index: any) => {
                return <Field
                    name={`exercise_records.${index}.name`}
                    className="t-form-control">
                    {
                        (field: FieldProps) => (
                            <FormikInputComponent
                                className={'exercise-name'}
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
            align: 'center',
            render: (record: any, index: any) => {
                return <Field
                    name={`exercise_records.${index}.no_of_sets`}
                    className="t-form-control">
                    {
                        (field: FieldProps) => (
                            <FormikInputComponent
                                onFocus={(event: any) => {
                                    if (event.target.value === '-') {
                                        field.form.setFieldValue(`exercise_records.${index}.no_of_sets`, '')
                                    }
                                }}
                                onBlur={(event: any) => {
                                    if (event.target.value === '') {
                                        field.form.setFieldValue(`exercise_records.${index}.no_of_sets`, '-')
                                    }
                                }}
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
            align: 'center',
            render: (record: any, index: any) => {
                return <Field
                    name={`exercise_records.${index}.no_of_reps`}
                    className="t-form-control">
                    {
                        (field: FieldProps) => (
                            <FormikInputComponent
                                onFocus={(event: any) => {
                                    if (event.target.value === '-') {
                                        field.form.setFieldValue(`exercise_records.${index}.no_of_reps`, '')
                                    }
                                }}
                                onBlur={(event: any) => {
                                    if (event.target.value === '') {
                                        field.form.setFieldValue(`exercise_records.${index}.no_of_reps`, '-')
                                    }
                                }}
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
            align: 'center',
            render: (record: any, index: any) => {
                return <Field
                    name={`exercise_records.${index}.time`}
                    className="t-form-control">
                    {
                        (field: FieldProps) => (
                            <FormikInputComponent
                                onFocus={(event: any) => {
                                    if (event.target.value === '-') {
                                        field.form.setFieldValue(`exercise_records.${index}.time`, '')
                                    }
                                }}
                                onBlur={(event: any) => {
                                    if (event.target.value === '') {
                                        field.form.setFieldValue(`exercise_records.${index}.time`, '-')
                                    }
                                }}
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
            align: 'center',
            render: (record: any, index: any) => {
                return <Field
                    name={`exercise_records.${index}.resistance`}
                    className="t-form-control">
                    {
                        (field: FieldProps) => (
                            <FormikInputComponent
                                onFocus={(event: any) => {
                                    if (event.target.value === '-') {
                                        field.form.setFieldValue(`exercise_records.${index}.resistance`, '')
                                    }
                                }}
                                onBlur={(event: any) => {
                                    if (event.target.value === '') {
                                        field.form.setFieldValue(`exercise_records.${index}.resistance`, '-')
                                    }
                                }}
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
            align: 'center',
            render: (record: any, index: any) => {
                return (
                    <>
                        {
                            (index >= 1) && (
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
        if (selectedAttachment) {
            handleFileSubmit();
        }
        if (medicalInterventionId && medicalRecordId) {
            const payload: any = {
                exercise_records: [],
                comments: values.comments
            };
            values.exercise_records.forEach((record: any, index: number) => {
                payload.exercise_records.push({
                    id: index === 0 ? "Warm Up" : "Ex " + index,
                    ...record
                });
            });
            setSubmitting(true)
            CommonService._chartNotes.SaveMedicalInterventionExerciseLogAPICall(medicalInterventionId, payload)
                .then((response: any) => {
                    CommonService._alert.showToast(response.message, 'success');
                    setSubmitting(false);
                    if (mode === 'add' || mode === 'soapNoteEdit') {
                        navigate(CommonService._routeConfig.UpdateMedicalIntervention(medicalRecordId, medicalInterventionId));
                    } else {
                        navigate(CommonService._routeConfig.MedicalInterventionExerciseLogView(medicalRecordId, medicalInterventionId));
                    }
                })
                .catch((error: any) => {
                    CommonService._alert.showToast(error.error || error.errors || 'Error saving Exercise log', 'error');
                    setSubmitting(false);
                });
        }
    }, [medicalRecordId, navigate, medicalInterventionId, selectedAttachment, handleFileSubmit, mode]);


    const {
        medicalInterventionDetails,
    } = useSelector((state: IRootReducerState) => state.chartNotes);

    useEffect(() => {
        if (medicalRecordId && medicalInterventionId) {
            dispatch(setCurrentNavParams("SOAP Note", null, () => {
                if (medicalInterventionDetails?.status === 'completed') {
                    navigate(CommonService._routeConfig.ViewMedicalIntervention(medicalRecordId, medicalInterventionId));

                } else {
                    if (mode === 'add' || mode === 'soapNoteEdit') {
                        navigate(CommonService._routeConfig.UpdateMedicalIntervention(medicalRecordId, medicalInterventionId));
                    } else {
                        navigate(CommonService._routeConfig.MedicalInterventionExerciseLogView(medicalRecordId, medicalInterventionId));
                    }
                }
            }));
        }
    }, [dispatch, navigate, medicalInterventionDetails, medicalRecordId, medicalInterventionId, mode]);

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
                comments: medicalInterventionExerciseLogDetails.comments,
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

    useEffect(() => {
        if (medicalInterventionExerciseLogDetails) {
            setTimeout(() => {
                const ele = document.getElementById('exercise-log-form');
                if (ele) {
                    ele.scrollIntoView({behavior: "smooth", block: "start"});
                }
            }, 100); //TODO: Need to find a better way to scroll to the form
        }
    }, [location, medicalInterventionExerciseLogDetails]);

    return (
        <div className={'medical-intervention-exercise-log-screen'}>

            <PageHeaderComponent
                title={mode === 'add' ? 'Add Exercise Log' : 'Edit Exercise Log'} actions={
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

            {/*------------------<ExerciseLogAttachmentListComponent/>-----------------------*/}
            <div className={'exercise-log-attachment-list-component'}>
                <div className={'exercise-log-attachment-add-component'}>
                    <input
                        type={"file"}
                        ref={hiddenFileInput}
                        accept={"application/pdf"}
                        onChange={(event: any) => {
                            const selectedAttachment = event.target.files[0];
                            setSelectedAttachment(selectedAttachment)
                        }}
                        style={{display: 'none'}}/>
                </div>
                {
                    medicalInterventionId && <>
                        {
                            isAttachmentListLoaded && <>
                                <CardComponent title={'Attachments'}
                                               actions={<ButtonComponent
                                                   disabled={selectedAttachment}
                                                   isLoading={isAttachmentBeingUploaded}
                                                   onClick={handleClick}
                                                   prefixIcon={<ImageConfig.AddIcon/>}>
                                                   Attach Exercise Log</ButtonComponent>}>
                                    <>

                                        {(attachmentList.attachments.length > 0) &&
                                        <>
                                            {attachmentList?.attachments?.map((attachment: any) => {
                                                return <span className={'chip-wrapper'}>
                                        <ChipComponent className={'chip chip-items'}
                                                       disabled={isAttachmentBeingDeleted}
                                                       label={attachment.name}
                                                       prefixIcon={<ImageConfig.PDF_ICON/>}
                                                       onDelete={() => removeAttachment(attachment, medicalInterventionId)}
                                        />
                                                </span>
                                            })}
                                        </>
                                        }
                                        {selectedAttachment &&
                                        <span className={'chip-wrapper'}>
                                        <ChipComponent className={'chip chip-items'}
                                                       disabled={isAttachmentBeingDeleted}
                                                       label={selectedAttachment.name}
                                                       prefixIcon={<ImageConfig.PDF_ICON/>}
                                                       onDelete={() => setSelectedAttachment(null)}
                                        />
                                                </span>
                                        }
                                        {(!selectedAttachment && !attachmentList.attachments.length) &&
                                        <StatusCardComponent title={'No Attachments'} className={'mrg-bottom-25'}/>
                                        }
                                    </>
                                </CardComponent>
                            </>
                        }
                    </>
                }
            </div>
            {/*----------------------ExerciseLogAttachmentEndsHere---------------------------*/}

            <div id={'exercise-log-form'}>
                {
                    isMedicalInterventionExerciseLogDetailsLoading && <LoaderComponent/>
                }
                {
                    !isMedicalInterventionExerciseLogDetailsLoading &&
                    <Formik initialValues={medicalInterventionExerciseLogValues}
                            validationSchema={MedicalInterventionExerciseLogFormValidationSchema}
                            enableReinitialize={true}
                            innerRef={formRef}
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
                                        <div className={"h-v-center mrg-top-20 mrg-bottom-20"}>
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

                                        <CardComponent title={'Comments (if any)'} className='mrg-top-20 pdd-bottom-20'>
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
                                        </CardComponent>
                                    </div>
                                    <div className="t-form-actions">
                                        {(medicalRecordId && medicalInterventionId) && <LinkComponent
                                            route={(mode === 'add' || mode === 'soapNoteEdit') ?
                                                CommonService._routeConfig.UpdateMedicalIntervention(medicalRecordId, medicalInterventionId) :
                                                CommonService._routeConfig.MedicalInterventionExerciseLogView(medicalRecordId, medicalInterventionId)
                                            }
                                        >
                                            <ButtonComponent variant={"outlined"}
                                                             disabled={isSubmitting}
                                            >
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
            </div>
        </div>
    );

};

export default MedicalInterventionExerciseLogUpdateScreen;
