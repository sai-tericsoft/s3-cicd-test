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
import {IAPIResponseType} from "../../../shared/models/api.model";
import {IService} from "../../../shared/models/service.model";
import * as Yup from "yup";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import {IRootReducerState} from "../../../store/reducers";
import {getClientMedicalRecord} from "../../../store/actions/client.action";
import {getInterventionAttachmentList, getMedicalInterventionDetails} from "../../../store/actions/chart-notes.action";
import moment from "moment-timezone";
import InputComponent from "../../../shared/components/form-controls/input/InputComponent";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import FormikCheckBoxComponent from "../../../shared/components/form-controls/formik-check-box/FormikCheckBoxComponent";
import MedicalInterventionDetailsCardComponent
    from "../medical-intervention-details-card/MedicalInterventionDetailsCardComponent";


interface MedicalInterventionExerciseLogScreenProps {

}

const MedicalInterventionExerciseLogRow = {
    key: undefined,
    name: undefined,
    bilateral: false,
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
    const [selectedAttachments, setSelectedAttachments] = useState<any>([]);

    //-----------------------------------ExerciseLogAttachmentStartsHere-------------------------------------
    const [isAttachmentBeingUploaded, setIsAttachmentBeingUploaded] = React.useState<boolean>(false);


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
            const formData = CommonService.getFormDataFromJSON({attachments: selectedAttachments});
            CommonService._chartNotes.AddExerciseLogAttachment(medicalInterventionId, formData)
                .then((response: any) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    dispatch(getInterventionAttachmentList(medicalInterventionId));
                    setIsAttachmentBeingUploaded(false);
                    setSelectedAttachments([]);
                })
                .catch((error: any) => {
                    setIsAttachmentBeingUploaded(false);
                    CommonService._alert.showToast(error[Misc.API_RESPONSE_MESSAGE_KEY], "error");
                })
        }
    }, [dispatch, medicalInterventionId, selectedAttachments]);


    const handleChange = (event: any) => {
        const selectedFile = event.target.files[0];
        // Check if the selected file is a PDF, JPEG, or PNG
        const acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        if (selectedFile && acceptedTypes.includes(selectedFile.type)) {
            setSelectedAttachments((prevState: any) => [...prevState, selectedFile]);
        } else {
            CommonService._alert.showToast('Invalid file type. Please select a PDF, JPEG, or PNG file', 'error');
        }
        event.target.value = null;
    };

    const removeAttachment = useCallback((item: any, medicalInterventionId: string) => {

        CommonService._chartNotes.RemoveExerciseLogAttachmentAPICall(medicalInterventionId, item._id, {})
            .then((response) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                dispatch(getInterventionAttachmentList(medicalInterventionId));
            }).catch((error: any) => {

            CommonService._alert.showToast(error.error || "Error deleting attachment", "error");
        })

    }, [dispatch]);

    //--------------------------------ExerciseLogAttachmentEndsHere----------------------------------------------

    const [currentRow, setCurrentRow] = React.useState(0);
    const [currentColumn, setCurrentColumn] = React.useState(0);


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
                return <div className={'exercise-record-name'}>
                    <Field
                        name={`exercise_records.${index}.name`}
                        className="t-form-control">
                        {
                            (field: FieldProps) => (
                                <FormikInputComponent
                                    className={'exercise-name'}
                                    size={"small"}
                                    fullWidth={true}
                                    formikField={field}
                                />
                            )
                        }
                    </Field>
                </div>
            }
        },
        {
            title: "(B)",
            key: "bilateral",
            dataIndex: 'bilateral',
            align: 'center',
            width: 50,
            render: (record: any, index: any) => {
                return <Field
                    name={`exercise_records.${index}.bilateral`}
                    className="t-form-control">
                    {
                        (field: FieldProps) => (
                            <FormikCheckBoxComponent

                                formikField={field}
                                onChange={(isChecked: any) => {
                                    if (isChecked) {
                                        field.form.setFieldValue(`exercise_records.${index}.bilateral`, true);
                                    }
                                }}
                            />
                        )
                    }
                </Field>
            }
        },
        {
            title: 'SET',
            key: 'set',
            width: 130,
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
            width: 130,
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
            width: 130,
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
            width: 130,
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
            title: 'Action',
            key: 'actions',
            align: 'center',
            width: 120,
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
                                                color={'error'}
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

    const inputRef = useRef<HTMLInputElement | null>(null);
    const columnsStartIndex = 0;  // Start from column 1
    const rows = formRef?.current?.values?.exercise_records?.length;
    const tableIndex = 0;
    const columns = 7;  // Go up to column 6

    useEffect(() => {
        // Adjust the calculation of the actual column index
        const actualColumn = currentColumn + columnsStartIndex;
        const cellId = `row-${currentRow}-column-${actualColumn}-table-index-${tableIndex}`;

        const cell = document.getElementById(cellId);
        const inputField = cell?.querySelector('input');

        if (inputField) {
            inputRef.current = inputField as HTMLInputElement;
            inputRef.current.focus();
        }
    }, [currentRow, currentColumn]);

    const handleKeyDown = useCallback((event: any) => {
        switch (event.key) {
            case 'ArrowUp':
                if (currentRow > 0) {
                    setCurrentRow(currentRow - 1);
                }
                break;
            case 'ArrowDown':
                if (currentRow < rows - 1) {
                    setCurrentRow(currentRow + 1);
                }
                break;
            case 'ArrowLeft':
                if (currentColumn > 0) {
                    setCurrentColumn(currentColumn - 1);
                } else if (currentColumn === 0 && currentRow > 0) {
                    setCurrentColumn(columns - 1);
                    setCurrentRow(currentRow - 1);
                }
                break;
            case 'ArrowRight':
                if (currentColumn < columns - 1) {
                    setCurrentColumn(currentColumn + 1);
                } else if (currentColumn === columns - 1 && currentRow < rows - 1) {
                    setCurrentColumn(0);
                    setCurrentRow(currentRow + 1);
                }
                break;
            default:
                break;
        }
    }, [currentColumn, currentRow, columns, rows]);

    const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const clickedRowIndex = Number(event.currentTarget.getAttribute('data-row'));
        const clickedColumnIndex = Number(event.currentTarget.getAttribute('data-column'));

        setCurrentRow(clickedRowIndex);
        setCurrentColumn(clickedColumnIndex);
    };

    const handleSubmit = useCallback((values: any, {setSubmitting}: FormikHelpers<any>) => {
        if (selectedAttachments.length > 0) {
            handleFileSubmit();
        }
        if (medicalInterventionId && medicalRecordId) {
            const payload: any = {
                exercise_records: [],
                comments: values.comments
            };
            values.exercise_records.forEach((record: any, index: number) => {
                if (record.name && (record.name || (record.no_of_reps !== '-' && record.no_of_reps) || (record.no_of_sets !== '-' && record.no_of_sets) || (record.resistance !== '-' && record.resistance) || (record.time !== '-' && record.time))) {
                    payload.exercise_records.push({
                        id: index === 0 ? "Warm Up" : "Ex " + index,
                        ...record
                    });
                }

            });
            setSubmitting(true)
            try {
                CommonService._chartNotes.SaveMedicalInterventionExerciseLogAPICall(medicalInterventionId, payload)
                    .then((response: any) => {
                        // CommonService._alert.showToast(response.message, 'success');
                        setSubmitting(false);
                        if (mode === 'add' || mode === 'soapNoteEdit') {
                            navigate(CommonService._routeConfig.UpdateMedicalIntervention(medicalRecordId, medicalInterventionId) + '?mode=add');
                        } else {
                            navigate(CommonService._routeConfig.MedicalInterventionExerciseLogView(medicalRecordId, medicalInterventionId));
                        }
                    })
                    .catch((error: any) => {
                        CommonService._alert.showToast(error.error || error.errors || 'Error saving Exercise log', 'error');
                        setSubmitting(false);
                    });
            } catch (error: any) {
                CommonService._alert.showToast(error.error || error.errors || 'Error saving Exercise log', 'error');
                setSubmitting(false);
            }
        }
    }, [medicalRecordId, navigate, medicalInterventionId, selectedAttachments, handleFileSubmit, mode]);


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
            bilateral: false,
            no_of_reps: "-",
            no_of_sets: "-",
            time: "-",
            resistance: "-",
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

            <PageHeaderComponent className={'page-header'}
                                 title={mode === 'add' ? 'Add Exercise Log' : 'Edit Exercise Log'} actions={
                <div className="last-updated-status">
                    <div className="last-updated-status-text">Last updated on:&nbsp;</div>
                    <div
                        className="last-updated-status-bold">
                        {(medicalInterventionDetails?.updated_at ? moment(medicalInterventionDetails.updated_at).tz(moment.tz.guess()).format('DD-MMM-YYYY | hh:mm A z') : 'N/A')}&nbsp;-&nbsp;
                        {medicalInterventionDetails?.last_updated_by_details?.first_name ? medicalInterventionDetails?.last_updated_by_details?.first_name + ' ' + medicalInterventionDetails?.last_updated_by_details?.last_name : ' NA'}
                    </div>
                </div>}/>

            <MedicalInterventionDetailsCardComponent medicalInterventionDetails={medicalInterventionDetails}
                                                     mode={"edit"}
                                                     showAction={false}

            />
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
                        onChange={handleChange}
                        // onChange={(event: any) => {
                        //     if (event.target.files.length > 0) {
                        //         const selectedFile = event.target.files[0];
                        //         if (selectedFile) {
                        //             setSelectedAttachments((prevState: any) => [...(prevState || []), selectedFile]);
                        //         }
                        //         event.target.value = null;
                        //     }
                        // }}
                        style={{display: 'none'}}/>
                </div>
                {
                    medicalInterventionId && <>
                        {
                            isAttachmentListLoaded && <>
                                <CardComponent title={'Attachments'}
                                               actions={<ButtonComponent
                                                   prefixIcon={<ImageConfig.AttachIcon/>}
                                                   isLoading={isAttachmentBeingUploaded}
                                                   onClick={handleClick}>
                                                   Attach Exercise Log</ButtonComponent>}>
                                    <>

                                        {(attachmentList.attachments.length > 0) &&
                                            <>
                                                {attachmentList?.attachments?.map((attachment: any) => {
                                                    return <div className={'ts-row'}>
                                                        <div className={'ts-col-lg-12 ts-col attachments-wrapper'}>
                                                            <div className={'attachment-name-icon'}>
                                                                <span><ImageConfig.DocumentIcon/></span>
                                                                <span>{attachment?.name}</span>
                                                            </div>
                                                            <div>
                                                                <ButtonComponent
                                                                    variant={'outlined'}
                                                                    color={'error'}
                                                                    prefixIcon={<ImageConfig.DeleteIcon/>}
                                                                    onClick={() => removeAttachment(attachment, medicalInterventionId)}>
                                                                    Delete
                                                                </ButtonComponent>
                                                            </div>
                                                        </div>
                                                    </div>
                                                })}
                                            </>
                                        }
                                        {selectedAttachments.length > 0 &&
                                            <>
                                                {selectedAttachments?.map((attachment: any, index: number) => {
                                                    return <div className={'ts-row'}>
                                                        <div className={'ts-col-lg-12 ts-col attachments-wrapper'}>
                                                            <div className={'attachment-name-icon'}>
                                                                <span><ImageConfig.DocumentIcon/></span>
                                                                <span>{attachment?.name}</span>
                                                            </div>
                                                            <div>
                                                                <ButtonComponent
                                                                    variant={'outlined'}
                                                                    color={'error'}
                                                                    prefixIcon={<ImageConfig.DeleteIcon/>}
                                                                    onClick={() => setSelectedAttachments((prevState: any) => {
                                                                        const newState = [...prevState];
                                                                        newState.splice(index, 1);
                                                                        return newState;
                                                                    })}>
                                                                    Delete
                                                                </ButtonComponent>
                                                            </div>
                                                        </div>
                                                    </div>

                                                })
                                                }
                                            </>
                                        }

                                        {(!selectedAttachments.length && !attachmentList.attachments.length) &&
                                            <StatusCardComponent title={'No attachment has been added'}
                                                                 className={'no-attachment-message'}/>
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
                                        <CardComponent>
                                            <div
                                                className={"display-flex align-items-center flex-direction-row-reverse mrg-bottom-20"}>
                                                <ButtonComponent
                                                    prefixIcon={<ImageConfig.CrossOutlinedIcon/>}
                                                    color={"error"}
                                                    disabled={
                                                        values.exercise_records.every((record: any) => (
                                                            !record.name && (record.no_of_reps === '-' || !record.no_of_reps) && (record.no_of_sets === '-' || !record.no_of_sets) && (record.resistance === '-' || !record.resistance) && (record.time === '-' || !record.time)
                                                        ))
                                                    }
                                                    onClick={() => {
                                                        handleExerciseLogClear(values, setFieldValue);
                                                    }}
                                                >
                                                    Clear Exercise Log
                                                </ButtonComponent>
                                            </div>
                                            <div className={'card-table-button-wrapper'}>
                                                <CardComponent>
                                                    <TableComponent
                                                        data={values.exercise_records}
                                                        onClick={(event) => handleContainerClick(event)}
                                                        tabIndex={0}
                                                        tableIndex={tableIndex}
                                                        onKeyDown={handleKeyDown}
                                                        rowClassName={(record: any, index: any) => ('row-' + index)}
                                                        rowKey={(record: any, index: any) => index}
                                                        columns={medicalInterventionExerciseLogColumns}/>
                                                </CardComponent>
                                                <div className={"h-v-center mrg-top-20 mrg-bottom-20"}>
                                                    <ButtonComponent
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
                                        </CardComponent>

                                        <CardComponent title={'Comments (if any)'}
                                                       className='mrg-top-20 pdd-bottom-25'>
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
                                    <div className="t-form-actions mrg-bottom-0">
                                        {/*{(medicalRecordId && medicalInterventionId) && <LinkComponent*/}
                                        {/*    route={(mode === 'add' || mode === 'soapNoteEdit') ?*/}
                                        {/*        CommonService._routeConfig.UpdateMedicalIntervention(medicalRecordId, medicalInterventionId) :*/}
                                        {/*        CommonService._routeConfig.MedicalInterventionExerciseLogView(medicalRecordId, medicalInterventionId)*/}
                                        {/*    }*/}
                                        {/*>*/}
                                        {/*    <ButtonComponent variant={"outlined"}*/}
                                        {/*                     disabled={isSubmitting}*/}
                                        {/*                     className={isSubmitting ? 'mrg-right-15' : ''}*/}
                                        {/*                     size={'large'}*/}
                                        {/*    >*/}
                                        {/*        Cancel*/}
                                        {/*    </ButtonComponent>*/}
                                        {/*</LinkComponent>}*/}
                                        {/*&nbsp;&nbsp;*/}
                                        <ButtonComponent type={"submit"}
                                                         size={'large'}
                                                         className={'mrg-left-15'}
                                                         disabled={isSubmitting || (selectedAttachments === [] && values.exercise_records.every((record: any) => (
                                                             !record.name && (record.no_of_reps === '-' || !record.no_of_reps) && (record.no_of_sets === '-' || !record.no_of_sets) && (record.resistance === '-' || !record.resistance) && (record.time === '-' || !record.time)
                                                         )))}
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
