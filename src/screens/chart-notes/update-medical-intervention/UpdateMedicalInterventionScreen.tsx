import "./UpdateMedicalInterventionScreen.scss";
import * as Yup from "yup";
import {useLocation, useNavigate, useParams, useSearchParams} from "react-router-dom";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import _ from "lodash";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {ImageConfig} from "../../../constants";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {getMedicalInterventionDetails, setMedicalInterventionDetails} from "../../../store/actions/chart-notes.action";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {ITableColumn} from "../../../shared/models/table.model";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import moment from "moment-timezone";
import MedicalInterventionDetailsCardComponent
    from "../medical-intervention-details-card/MedicalInterventionDetailsCardComponent";
import FormAutoSave from "../../../shared/utils/FormAutoSave";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import DraftReadonlySwitcherComponent from "../draft-readonly-switcher/DraftReadonlySwitcherComponent";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import FormikCheckBoxComponent from "../../../shared/components/form-controls/formik-check-box/FormikCheckBoxComponent";
import ESignApprovalComponent from "../../../shared/components/e-sign-approval/ESignApprovalComponent";
import TableComponent from "../../../shared/components/table/TableComponent";

interface UpdateMedicalInterventionScreenProps {

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

const ICDTableColumns: any = [
    {
        title: 'ICD Code',
        dataIndex: 'icd_code',
        key: 'icd_code',
        width: 150,
        fixed: 'left'
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
    }
]

const MedicalInterventionAddFormValidationSchema = Yup.object().shape({});

const UpdateMedicalInterventionScreen = (props: UpdateMedicalInterventionScreenProps) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const referrer: any = searchParams.get("referrer");
    const mode: any = searchParams.get("mode");

    const {
        medicalInterventionDetails,
        isMedicalInterventionDetailsLoading,
        isMedicalInterventionDetailsLoaded
    } = useSelector((state: IRootReducerState) => state.chartNotes);
    const {medicalRecordId, medicalInterventionId} = useParams();
    const location = useLocation();
    const search = CommonService.parseQueryString(location.search);
    const [addMedicalInterventionFormInitialValues, setAddMedicalInterventionFormInitialValues] = useState<any>(_.cloneDeep(MedicalInterventionAddFormInitialValues));  // TODO type properly
    const [isSigningInProgress, setIsSigningInProgress] = useState<boolean>(false);
    const [isSavingInProgress, setIsSavingProgress] = useState<boolean>(false);
    // const [isFormBeingUpdated, setIsFormBeingUpdated] = useState<boolean>(false);
    const [signedObject, setSignedObject] = useState<any>(null);

    const SpecialTestsColumns: ITableColumn[] = useMemo<ITableColumn[]>(() => [
        {
            title: 'Test Name',
            dataIndex: 'name',
            key: 'test_name',
            fixed: 'left',
            width: 150,
        },
        {
            title: 'Left Side',
            dataIndex: 'result',
            align: 'center',
            fixed: 'left',
            key: 'left_result',
            width: 150,
            render: (item: any) => {
                return <div className={'result'}>
                    {item?.config?.Left?.result || "-"}
                </div>
            }
        },
        {
            title: 'Right Side',
            dataIndex: 'result',
            align: 'center',
            fixed: 'left',
            key: 'right_result',
            width: 150,
            render: (item: any) => {
                return <div className={'result'}>
                    {item?.config?.Right?.result || "-"}
                </div>
            }
        },
        {
            title: 'Central Side',
            dataIndex: 'result',
            align: 'center',
            fixed: 'left',
            key: 'central_result',
            width: 150,
            render: (item: any) => {
                return <div className={'result'}>
                    {item?.config?.Central?.result || "-"}
                </div>
            }
        },
        {
            title: 'Comments',
            dataIndex: 'comments',
            key: 'comments',
            width: 147,
            // align: 'center',
            // fixed: 'right',
            render: (item: any) => {
                return <div className={'comments'}>
                    {item?.config?.comments || "N/A"}
                </div>
            }
        }
    ], []);

    const getMedicalInterventionROMConfigColumns = useCallback((body_part: any): ITableColumn[] => {
                // console.log("body_part", body_part);
                const ROMColumns: any[] = [
                    {
                        title: '',
                        fixed: 'left',
                        children: [
                            {
                                title: 'Movement',
                                key: 'movement',
                                width: 180,
                                // fixed: 'left',
                                render: (record: any) => {
                                    return <div className="movement-name">
                                        {record?.movement_name}
                                    </div>
                                }
                            }
                        ]
                    },

                ];
                (body_part?.selected_sides || []).forEach((side: any) => {
                    ROMColumns.push({
                        title: side,
                        className: side,
                        // fixed: 'left',
                        align: 'center',
                        children: [
                            {
                                title: 'AROM',
                                dataIndex: 'arom',
                                key: side + 'arom',
                                align: 'center',
                                // fixed: 'left',
                                width: 37,
                                render: (item: any) => {
                                    return <div className={'movement-name'}>{item?.config[side]?.arom || '-'}</div>
                                }
                            },
                            {
                                title: 'PROM',
                                dataIndex: 'prom',
                                key: side + 'prom',
                                align: 'center',
                                // fixed: 'left',
                                width: 37,
                                render: (item: any) => {
                                    return <div className={'movement-name'}>{item?.config[side]?.prom || "-"}</div>
                                }
                            },
                            {
                                title: 'Strength',
                                dataIndex: 'strength',
                                key: side + 'strength',
                                align: 'center',
                                // fixed: 'left',
                                width: 43,
                                render: (item: any) => {
                                    return <div className={'movement-name'}>{item?.config[side]?.strength || "-"}</div>
                                }
                            }
                        ]
                    });
                });

                ROMColumns.push(
                    {
                        title: '',
                        key: 'comments-header',
                        fixed: 'right',
                        width: 500,
                        children: [
                            {
                                title: 'Comments',
                                dataIndex: 'comments',
                                key: 'comments',
                                align: 'center',
                                width: 500,
                                render: (item: any) => {
                                    return <div
                                        className={'comment-text'}>{item?.config?.comments ? CommonService.capitalizeFirstLetter(item?.config?.comments) : "-"}</div>
                                }
                            }
                        ]
                    }
                )
                return ROMColumns;
            },
            []
        )
    ;

    const onSubmit = useCallback((values: any, {
        setSubmitting,
        setErrors,
        setFieldValue,
    }: FormikHelpers<any>, announce = false, cb: any = null,is_signed?:boolean) => {
        if (medicalInterventionId) {
            setSubmitting(true);
            setIsSavingProgress(true);
            let payload = {...CommonService.removeKeysFromJSON(_.cloneDeep(values), ['created_at', 'medical_record_id', 'treated_by', 'appointment_id', 'category_id', 'service_id'])};
            if(is_signed){
                payload.is_signed = true;
            }
            CommonService._chartNotes.MedicalInterventionBasicDetailsUpdateAPICall(medicalInterventionId, payload)
                .then((response: IAPIResponseType<any>) => {
                    // dispatch(setMedicalInterventionDetails(response.data));
                    setSignedObject({
                        is_signed: response.data?.is_signed,
                        signed_on: response.data?.signed_on
                    })

                    if (medicalInterventionDetails?.is_flagged !== payload.is_flagged) {
                        CommonService._alert.showToast(payload.is_flagged ? 'Note has been flagged.' : 'Note has been unflagged.', "success");
                    }
                    if (announce) {
                    }
                    setIsSavingProgress(false);
                    setSubmitting(false);
                    if (cb) {
                        cb();
                    }
                })
                .catch((error: any) => {
                    CommonService.handleErrors(setErrors, error, true);
                    setSubmitting(false);
                    setIsSavingProgress(false);
                    if (cb) {
                        cb();
                    }
                })
        }
    }, [dispatch, medicalInterventionId, medicalInterventionDetails]);


    useEffect(() => {
        if (medicalInterventionId) {
            dispatch(getMedicalInterventionDetails(medicalInterventionId));
        }
    }, [medicalInterventionId, dispatch]);

    useEffect(() => {
        if (medicalInterventionDetails) {
            setSignedObject({
                is_signed: medicalInterventionDetails?.is_signed,
                signed_on: medicalInterventionDetails?.signed_on
            })
            const medicalInterventionDetailsCopy = _.cloneDeep(medicalInterventionDetails);
            delete medicalInterventionDetailsCopy.is_signed;
            delete medicalInterventionDetailsCopy.signed_on;
            setAddMedicalInterventionFormInitialValues(medicalInterventionDetailsCopy);
        }
    }, [medicalInterventionDetails]);

    useEffect(() => {
        if (isMedicalInterventionDetailsLoaded && medicalInterventionDetails?.created_at) {
            const last_position: any = searchParams.get("last_position");
            if (last_position) {
                const ele = document.getElementById(last_position);
                const scroller = document.getElementById('page-content-holder');
                if (ele && scroller) {
                    (async () => {
                        const rect = ele.getBoundingClientRect();
                        const containerRect = scroller.getBoundingClientRect();
                        const targetScrollTop = scroller.scrollTop + rect.top - containerRect.top;
                        const maxScrollTop = scroller.scrollHeight - scroller.clientHeight;
                        const scrollPosition = Math.min(targetScrollTop, maxScrollTop);
                        await scroller.scrollTo({top: scrollPosition, behavior: 'smooth'})
                        setTimeout(() => {
                            searchParams.delete("last_position");
                            setSearchParams(searchParams);
                        }, 1000);
                    })();
                }
            }
        }
    }, [isMedicalInterventionDetailsLoaded, medicalInterventionDetails, setSearchParams, searchParams]);


    useEffect(() => {
        if (medicalRecordId) {
            const referrer: any = searchParams.get("referrer");
            dispatch(setCurrentNavParams("Medical Record details", null, () => {
                if (referrer) {
                    navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId) + '?referrer=' + referrer);
                } else {
                    navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId));
                }
            }));
        }
    }, [navigate, dispatch, medicalRecordId, searchParams]);

    const handleSign = useCallback((values: any, formik: FormikHelpers<any>) => {
        setIsSigningInProgress(true);
        onSubmit(values, formik, true, () => {
            setIsSigningInProgress(false);
        },true);
    }, [onSubmit]);

    const handleDiscardNote = useCallback(() => {
        CommonService.onConfirm({
            image: ImageConfig.Confirm,
            // showLottie: true,
            confirmationTitle: "DISCARD SOAP NOTE",
            // confirmationSubTitle: "\n"+
            //     "",
            confirmationDescription: <div className={'discard-soap'}>
                <div>Are you sure you want to permanently discard this</div>
                <div>SOAP note? This action cannot be undone.</div>
            </div>
        }).then(() => {
            (medicalInterventionId) && CommonService._chartNotes.DiscardSoapNote(medicalInterventionId, {})
                .then((response: any) => {
                    CommonService._alert.showToast("SOAP note has been discarded successfully.", "success");
                    (medicalRecordId) && navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId))
                }).catch((error: any) => {
                    CommonService._alert.showToast(error.error, "error");
                });
        });
    }, [medicalInterventionId, medicalRecordId, navigate]);

    return (
        <div className={'add-medical-intervention-screen'}>
            {
                isMedicalInterventionDetailsLoading && <LoaderComponent/>
            }
            {
                isMedicalInterventionDetailsLoaded && <>
                    <PageHeaderComponent
                        title={medicalInterventionDetails?.is_discharge ? "Add Discharge Summary" : (mode === 'add' ? 'Add' : 'Update') + " Treatment Intervention"}
                        actions={
                            <div className="last-updated-status">
                                <div className="last-updated-status-text">Last updated on:&nbsp;</div>
                                <div
                                    className="last-updated-status-bold">
                                    {(medicalInterventionDetails?.updated_at ? moment(medicalInterventionDetails.updated_at).tz(moment.tz.guess()).format('DD-MMM-YYYY | hh:mm A z') : 'N/A')}&nbsp;-&nbsp;
                                    {medicalInterventionDetails?.last_updated_by_details?.first_name ? medicalInterventionDetails?.last_updated_by_details?.first_name + ' ' + medicalInterventionDetails?.last_updated_by_details?.last_name : ' N/A'}
                                </div>
                                {isSavingInProgress ? <div className="last-updated-status-status">
                                        <ImageConfig.SYNC className={'spin-item'}
                                                          width={16}/>
                                        &nbsp;Saving...</div> :
                                    <div className="last-updated-status-status mrg-top-5 mrg-right-5">
                                        <ImageConfig.CloudIcon
                                            width={16}/>&nbsp;Saved</div>}
                            </div>}/>
                    <MedicalInterventionDetailsCardComponent medicalInterventionDetails={medicalInterventionDetails}
                                                             mode={"edit"}
                                                             showAction={true}

                    />
                    <Formik
                        validationSchema={MedicalInterventionAddFormValidationSchema}
                        initialValues={addMedicalInterventionFormInitialValues}
                        onSubmit={(values, formikHelpers) => {
                            // if (medicalInterventionDetails.status === 'draft') {
                            onSubmit(values, formikHelpers, false);
                            // }
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
                                    <FormAutoSave formikCtx={formik} delay={500}/>
                                    <div
                                        className={"display-flex align-items-center justify-content-space-between mrg-bottom-25"}>
                                        <FormControlLabelComponent label={"SOAP Note"} size={'lg'}
                                                                   className={"mrg-0 font-size-20"}/>
                                        {
                                            (medicalInterventionId && medicalRecordId) &&
                                            <LinkComponent
                                                route={CommonService._routeConfig.MedicalInterventionExerciseLogUpdate(medicalRecordId, medicalInterventionId, (medicalInterventionDetails?.is_exercise_log_added ? "soapNoteEdit" : "add"))}>
                                                <ButtonComponent
                                                    prefixIcon={medicalInterventionDetails?.is_exercise_log_added ?
                                                        <ImageConfig.EditIcon/> : <ImageConfig.AddIcon/>}
                                                >
                                                    {
                                                        (medicalInterventionDetails?.is_exercise_log_added ? "Edit" : "Add") + " Exercise Log"
                                                    }
                                                </ButtonComponent>
                                            </LinkComponent>
                                        }
                                    </div>
                                    <div className={'s-o-a-wrapper'}>
                                        <CardComponent title={'S - Subjective'}
                                            // actions={
                                            //     search.showClear && <DraftReadonlySwitcherComponent
                                            //         condition={true}
                                            //         draft={<div className={'intervention-clear-button'}
                                            //                     onClick={event => {
                                            //                         formik.setFieldValue('subjective', '');
                                            //                     }
                                            //                     }>Clear</div>}
                                            //         readonly={<></>}/>
                                            // }
                                        >
                                            <div className="ts-row">

                                                <div className="ts-col-12">
                                                    {
                                                        search.showClear &&
                                                        <div className={'clear-cta'}>
                                                            <DraftReadonlySwitcherComponent
                                                                condition={true}
                                                                draft={<div className={'intervention-clear-button'}
                                                                            onClick={event => {
                                                                                formik.setFieldValue('subjective', '');
                                                                            }
                                                                            }>Clear</div>}
                                                                readonly={<></>}/></div>
                                                    }
                                                    <DraftReadonlySwitcherComponent
                                                        condition={true} draft={
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
                                                    } readonly={
                                                        <div className={'readonly-wrapper'}>
                                                            <FormControlLabelComponent
                                                                label={'Subjective :'}/>
                                                            <div className={'readonly-text'}>
                                                                {
                                                                    medicalInterventionDetails?.subjective || 'N/A'
                                                                }
                                                            </div>
                                                        </div>
                                                    }
                                                    />
                                                </div>
                                            </div>
                                        </CardComponent>
                                        <CardComponent title={'O - Objective'}
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
                                                           </Field> &nbsp;&nbsp;&nbsp;
                                                       </>}
                                        >
                                            <div className="ts-row">
                                                <div className="ts-col-12">
                                                    {search.showClear && <div className={'clear-cta'}>
                                                        <DraftReadonlySwitcherComponent
                                                            condition={true}
                                                            draft={<div className={'intervention-clear-button'}
                                                                        onClick={event => {
                                                                            formik.setFieldValue('objective.observation', '');
                                                                        }
                                                                        }>Clear</div>}
                                                            readonly={<></>}/></div>}
                                                    <DraftReadonlySwitcherComponent
                                                        condition={true} draft={
                                                        <Field name={'objective.observation'}>
                                                            {
                                                                (field: FieldProps) => (
                                                                    <FormikTextAreaComponent
                                                                        label={'Observation'}
                                                                        placeholder={'Please enter your note here...'}
                                                                        formikField={field}
                                                                        required={false}
                                                                        fullWidth={true}
                                                                    />
                                                                )
                                                            }
                                                        </Field>
                                                    } readonly={
                                                        <div className={'readonly-wrapper'}>
                                                            <FormControlLabelComponent
                                                                label={'Observation :'}/>
                                                            <div className={'readonly-text'}>
                                                                {
                                                                    medicalInterventionDetails?.objective.observation || 'N/A'
                                                                }
                                                            </div>
                                                        </div>
                                                    }
                                                    />
                                                    <div
                                                        className="card-styling padding-card-5 range-of-motion-wrapper mrg-bottom-20"
                                                        id={'range-of-motion-wrapper'}>
                                                        <>
                                                            {
                                                                medicalRecordId && medicalInterventionId && <>
                                                                    {
                                                                        medicalInterventionDetails?.rom_config?.length === 0 &&
                                                                        <LinkComponent
                                                                            route={CommonService._routeConfig.MedicalInterventionROMConfig(medicalRecordId, medicalInterventionId) + '?referrer=' + referrer + '&last_position=range-of-motion-wrapper'}>
                                                                            <ButtonComponent
                                                                                fullWidth={true}
                                                                                variant={'outlined'}
                                                                                size={"large"}
                                                                                className={'rom-special-test-icd-11-cta mrg-bottom-10'}
                                                                            >
                                                                                Range of Motion and Strength
                                                                            </ButtonComponent>
                                                                        </LinkComponent>
                                                                    }
                                                                    {
                                                                        medicalInterventionDetails?.rom_config?.length > 0 &&
                                                                        <CardComponent className={'rom-header'}
                                                                                       title={"Range of Motion and Strength"}
                                                                                       actions={
                                                                                           <DraftReadonlySwitcherComponent
                                                                                               condition={true}
                                                                                               draft={<>
                                                                                                   {
                                                                                                       (medicalInterventionId && medicalRecordId) &&
                                                                                                       <LinkComponent
                                                                                                           route={CommonService._routeConfig.MedicalInterventionROMConfig(medicalRecordId, medicalInterventionId) + '?last_position=range-of-motion-wrapper'}>
                                                                                                           <ButtonComponent
                                                                                                               size={"small"}
                                                                                                               prefixIcon={(medicalInterventionDetails?.rom_config && medicalInterventionDetails?.rom_config.length > 0) ?
                                                                                                                   <ImageConfig.EditIcon/> :
                                                                                                                   <ImageConfig.AddIcon/>}>
                                                                                                               {medicalInterventionDetails?.rom_config && medicalInterventionDetails?.rom_config.length > 0 ? 'Edit' : 'Add'}
                                                                                                           </ButtonComponent>
                                                                                                       </LinkComponent>
                                                                                                   }
                                                                                               </>} readonly={<></>}
                                                                                           />
                                                                                       }
                                                                        >

                                                                            {
                                                                                medicalInterventionDetails?.rom_config?.map((body_part: any) => {
                                                                                    return (
                                                                                        <>
                                                                                            {
                                                                                                body_part?.rom_config?.length > 0 && <>
                                                                                                    <CardComponent
                                                                                                        className={'body-part-card'}
                                                                                                        size={'sm'}
                                                                                                        title={"Body Part: " + body_part?.body_part_details?.name || "-"}>
                                                                                                    </CardComponent>
                                                                                                    {
                                                                                                        body_part?.rom_config?.length > 0 &&
                                                                                                        <TableComponent
                                                                                                            data={body_part?.rom_config}
                                                                                                            bordered={true}
                                                                                                            className={'view-arom-prom-table'}
                                                                                                            showExpandColumn={false}
                                                                                                            defaultExpandAllRows={true}
                                                                                                            canExpandRow={(row: any) => row?.config?.comments?.length > 0}
                                                                                                            noDataText={body_part?.rom_config?.length === 0 ? 'No Range of Motion or Strength found.' : 'No Range of Motion or Strength found for this body part.'}
                                                                                                            // expandRowRenderer={
                                                                                                            //     (row: any) => {
                                                                                                            //         return (
                                                                                                            //             <div
                                                                                                            //                 key={row?.config?._id}
                                                                                                            //                 className={'comment-row'}>
                                                                                                            //                 <div
                                                                                                            //                     className={'comment-icon'}>
                                                                                                            //                     <ImageConfig.CommentIcon/>
                                                                                                            //                 </div>
                                                                                                            //                 <div
                                                                                                            //                     className={'comment-text'}>{row?.config?.comments ? CommonService.capitalizeFirstLetter(row?.config?.comments) : "-"}</div>
                                                                                                            //             </div>
                                                                                                            //         )
                                                                                                            //     }
                                                                                                            // }
                                                                                                            columns={getMedicalInterventionROMConfigColumns(body_part)}/>
                                                                                                    }
                                                                                                    {/*{*/}
                                                                                                    {/*    body_part?.rom_config?.length === 0 &&*/}
                                                                                                    {/*    <StatusCardComponent*/}
                                                                                                    {/*        title={"The following body part does not have any Range of Motion or Strength " +*/}
                                                                                                    {/*            "                                                measurements. \n Please choose another body part."}/>*/}
                                                                                                    {/*}*/}
                                                                                                </>
                                                                                            }
                                                                                        </>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </CardComponent>
                                                                    }
                                                                </>
                                                            }
                                                        </>
                                                    </div>
                                                    <div className="special-test-wrapper" id={'special-test-wrapper'}>
                                                        {
                                                            medicalRecordId && medicalInterventionId && <>
                                                                {
                                                                    medicalInterventionDetails?.special_tests?.length === 0 &&
                                                                    <LinkComponent
                                                                        route={CommonService._routeConfig.MedicalInterventionSpecialTests(medicalRecordId, medicalInterventionId) + '?last_position=special-test-wrapper'}>
                                                                        <ButtonComponent
                                                                            fullWidth={true}
                                                                            variant={'outlined'}
                                                                            size={"large"}
                                                                            className={'rom-special-test-icd-11-cta mrg-bottom-10'}
                                                                        >
                                                                            Special Tests
                                                                        </ButtonComponent>
                                                                    </LinkComponent>
                                                                }
                                                                {
                                                                    medicalInterventionDetails?.special_tests?.length > 0 &&
                                                                    <div
                                                                        className={"card-styling padding-card-5 mrg-bottom-20 " + ((medicalInterventionDetails?.special_tests && medicalInterventionDetails?.special_tests.length > 0) ?
                                                                            ' white-card-header ' : '')}>
                                                                        <CardComponent title={"Special Tests"}
                                                                                       className={'special-test-header'}
                                                                                       actions={
                                                                                           <DraftReadonlySwitcherComponent
                                                                                               condition={true}
                                                                                               draft={<>
                                                                                                   {
                                                                                                       (medicalInterventionId && medicalRecordId) &&
                                                                                                       <LinkComponent
                                                                                                           route={CommonService._routeConfig.MedicalInterventionSpecialTests(medicalRecordId, medicalInterventionId) + '?last_position=special-test-wrapper'}>
                                                                                                           <ButtonComponent
                                                                                                               size={"small"}
                                                                                                               prefixIcon={(medicalInterventionDetails?.special_tests && medicalInterventionDetails?.special_tests.length > 0) ?
                                                                                                                   <ImageConfig.EditIcon/> :
                                                                                                                   <ImageConfig.AddIcon/>}>
                                                                                                               {medicalInterventionDetails?.special_tests && medicalInterventionDetails?.special_tests.length > 0 ? 'Edit' : 'Add'}
                                                                                                           </ButtonComponent>
                                                                                                       </LinkComponent>
                                                                                                   }
                                                                                               </>} readonly={<></>}/>
                                                                                       }
                                                                        >

                                                                            {medicalInterventionDetails?.special_tests && medicalInterventionDetails?.special_tests.map((body_part: any) => {
                                                                                return (<div className={''}>
                                                                                    <CardComponent
                                                                                        className={'body-part-card'}
                                                                                        size={'sm'}
                                                                                        title={"Body Part: " + body_part?.body_part_details?.name || "-"}>
                                                                                    </CardComponent>
                                                                                    <TableComponent
                                                                                        data={body_part.special_tests}
                                                                                        className={'view-arom-prom-table'}
                                                                                        columns={SpecialTestsColumns}
                                                                                        bordered={true}
                                                                                    />
                                                                                </div>)
                                                                            })}
                                                                        </CardComponent>
                                                                    </div>}
                                                            </>
                                                        }
                                                    </div>
                                                    <div className={'ts-row'}>
                                                        <div className={'ts-col-12'}>
                                                            {search.showClear &&
                                                                <div className={'clear-cta'}>
                                                                    <DraftReadonlySwitcherComponent
                                                                        condition={true}
                                                                        draft={<div
                                                                            className={'intervention-clear-button'}
                                                                            onClick={event => {
                                                                                formik.setFieldValue('objective.palpation', '');
                                                                            }
                                                                            }>Clear</div>}
                                                                        readonly={<></>}/></div>}
                                                        </div>
                                                    </div>
                                                    <DraftReadonlySwitcherComponent
                                                        condition={true} draft={
                                                        <Field name={'objective.palpation'}>
                                                            {
                                                                (field: FieldProps) => (
                                                                    <FormikTextAreaComponent
                                                                        label={'Palpation'}
                                                                        placeholder={'Please enter your note here...'}
                                                                        formikField={field}
                                                                        required={false}
                                                                        fullWidth={true}
                                                                    />
                                                                )
                                                            }
                                                        </Field>
                                                    } readonly={
                                                        <div className={'readonly-wrapper'}>
                                                            <FormControlLabelComponent
                                                                label={'Palpation'}/>
                                                            <div className={'readonly-text'}>
                                                                {
                                                                    medicalInterventionDetails?.objective.palpation || 'N/A'
                                                                }
                                                            </div>
                                                        </div>
                                                    }
                                                    />
                                                    <div className={'ts-row'}>
                                                        <div className={'ts-col-12'}>
                                                            {search.showClear &&
                                                                <div className={'clear-cta'}>
                                                                    <DraftReadonlySwitcherComponent
                                                                        condition={true}
                                                                        draft={<div
                                                                            className={'intervention-clear-button'}
                                                                            onClick={event => {
                                                                                formik.setFieldValue('objective.functional_tests', '');
                                                                            }
                                                                            }>Clear</div>}
                                                                        readonly={<></>}/></div>}
                                                        </div>
                                                    </div>
                                                    <DraftReadonlySwitcherComponent
                                                        condition={true} draft={
                                                        <Field name={'objective.functional_tests'}>
                                                            {
                                                                (field: FieldProps) => (
                                                                    <FormikTextAreaComponent
                                                                        label={'Functional Tests'}
                                                                        placeholder={'Please enter your note here...'}
                                                                        formikField={field}
                                                                        required={false}
                                                                        fullWidth={true}
                                                                    />
                                                                )
                                                            }
                                                        </Field>
                                                    } readonly={
                                                        <div className={'readonly-wrapper'}>
                                                            <FormControlLabelComponent
                                                                label={'Functional Tests'}/>
                                                            <div className={'readonly-text'}>
                                                                {
                                                                    medicalInterventionDetails?.objective.functional_tests || 'N/A'
                                                                }
                                                            </div>
                                                        </div>
                                                    }
                                                    />
                                                    <div className={'ts-row'}>
                                                        <div className={'ts-col-12'}>
                                                            {search.showClear &&
                                                                <div className={'clear-cta'}>
                                                                    <DraftReadonlySwitcherComponent
                                                                        condition={true}
                                                                        draft={<div
                                                                            className={'intervention-clear-button'}
                                                                            onClick={event => {
                                                                                formik.setFieldValue('objective.treatment', '');
                                                                            }
                                                                            }>Clear</div>}
                                                                        readonly={<></>}/></div>}
                                                        </div>
                                                    </div>
                                                    <DraftReadonlySwitcherComponent
                                                        condition={true} draft={
                                                        <Field name={'objective.treatment'}>
                                                            {
                                                                (field: FieldProps) => (
                                                                    <FormikTextAreaComponent
                                                                        label={'Treatment Performed'}
                                                                        placeholder={'Please enter your note here...'}
                                                                        formikField={field}
                                                                        required={false}
                                                                        fullWidth={true}
                                                                    />
                                                                )
                                                            }
                                                        </Field>
                                                    } readonly={
                                                        <div className={'readonly-wrapper'}>
                                                            <FormControlLabelComponent
                                                                label={'Treatment Performed'}/>
                                                            <div className={'readonly-text'}>
                                                                {
                                                                    medicalInterventionDetails?.objective.treatment || 'N/A'
                                                                }
                                                            </div>
                                                        </div>
                                                    }
                                                    />
                                                    <div className={'ts-row'}>
                                                        <div className={'ts-col-12'}>
                                                            {search.showClear &&
                                                                <div className={'clear-cta'}>
                                                                    <DraftReadonlySwitcherComponent
                                                                        condition={true}
                                                                        draft={<div
                                                                            className={'intervention-clear-button'}
                                                                            onClick={event => {
                                                                                formik.setFieldValue('objective.treatment_response', '');
                                                                            }
                                                                            }>Clear</div>}
                                                                        readonly={<></>}/></div>}
                                                        </div>
                                                    </div>
                                                    <DraftReadonlySwitcherComponent
                                                        condition={true} draft={
                                                        <Field name={'objective.treatment_response'}>
                                                            {
                                                                (field: FieldProps) => (
                                                                    <FormikTextAreaComponent
                                                                        label={'Response to Treatment'}
                                                                        placeholder={'Please enter your note here...'}
                                                                        formikField={field}
                                                                        required={false}
                                                                        fullWidth={true}
                                                                    />
                                                                )
                                                            }
                                                        </Field>
                                                    } readonly={
                                                        <div className={'readonly-wrapper'}>
                                                            <FormControlLabelComponent
                                                                label={'Response to Treatment :'}/>
                                                            <div className={'readonly-text'}>
                                                                {
                                                                    medicalInterventionDetails?.objective.treatment_response || 'N/A'
                                                                }
                                                            </div>
                                                        </div>
                                                    }
                                                    />
                                                </div>
                                            </div>
                                        </CardComponent>
                                        <CardComponent title={'A - Assessment'} id={'icd_codes'}
                                            //                actions={
                                            //     search.showClear && <DraftReadonlySwitcherComponent
                                            //         condition={true}
                                            //         draft={<div className={'intervention-clear-button'} onClick={event => {
                                            //             formik.setFieldValue('assessment', {
                                            //                 suspicion_index: '',
                                            //                 surgery_procedure: ''
                                            //             });
                                            //         }
                                            //         }>Clear</div>}
                                            //         readonly={<></>}/>
                                            // }
                                        >
                                            <div className="ts-row">
                                                <div className="ts-col-12">
                                                    <div className="icd-codes-wrapper">
                                                        {
                                                            medicalRecordId && medicalInterventionId && <>
                                                                {
                                                                    (medicalInterventionDetails?.linked_icd_codes?.length === 0 || !medicalInterventionDetails?.linked_icd_codes) &&
                                                                    <LinkComponent
                                                                        route={CommonService._routeConfig.MedicalInterventionICDCodes(medicalRecordId, medicalInterventionId) + '?referrer=' + referrer + '&last_position=icd_codes'}>
                                                                        <ButtonComponent
                                                                            fullWidth={true}
                                                                            variant={'outlined'}
                                                                            size={"large"}
                                                                            className={'rom-special-test-icd-11-cta'}
                                                                        >
                                                                            Medical Diagnosis / ICD Codes
                                                                        </ButtonComponent>
                                                                    </LinkComponent>
                                                                }
                                                                {
                                                                    medicalInterventionDetails?.linked_icd_codes?.length > 0 &&
                                                                    <div className="icd-codes-wrapper">
                                                                        <div className="card-styling">
                                                                            <CardComponent size={'sm'}
                                                                                           className={'icd-codes-header'}
                                                                                           title={'Medical Diagnosis/ICD Codes:'}
                                                                                           actions={
                                                                                               <DraftReadonlySwitcherComponent
                                                                                                   condition={true}
                                                                                                   draft={<>
                                                                                                       {
                                                                                                           (medicalInterventionId && medicalRecordId) &&
                                                                                                           <LinkComponent
                                                                                                               route={CommonService._routeConfig.MedicalInterventionICDCodes(medicalRecordId, medicalInterventionId) + '?referrer=' + referrer + '&last_position=icd_codes'}>
                                                                                                               <ButtonComponent
                                                                                                                   size={"small"}
                                                                                                                   prefixIcon={(medicalInterventionDetails?.linked_icd_codes && medicalInterventionDetails?.linked_icd_codes.length > 0) ?
                                                                                                                       <ImageConfig.EditIcon/> :
                                                                                                                       <ImageConfig.AddIcon/>}>
                                                                                                                   {medicalInterventionDetails?.linked_icd_codes && medicalInterventionDetails?.linked_icd_codes.length > 0 ? 'Edit' : 'Add'}
                                                                                                               </ButtonComponent>
                                                                                                           </LinkComponent>
                                                                                                       }
                                                                                                   </>}
                                                                                                   readonly={<></>}/>
                                                                                           }>
                                                                                <TableComponent
                                                                                    data={medicalInterventionDetails?.linked_icd_codes}
                                                                                    bordered={true}
                                                                                    columns={ICDTableColumns}/>
                                                                            </CardComponent>
                                                                        </div>
                                                                    </div>
                                                                }
                                                            </>
                                                        }
                                                    </div>
                                                    <div className={'ts-row'}>
                                                        <div className={'ts-col-12'}>
                                                            {search.showClear &&
                                                                <div className={'clear-cta'}>
                                                                    <DraftReadonlySwitcherComponent
                                                                        condition={true}
                                                                        draft={<div
                                                                            className={'intervention-clear-button'}
                                                                            onClick={event => {
                                                                                formik.setFieldValue('assessment.suspicion_index', '');
                                                                            }
                                                                            }>Clear</div>}
                                                                        readonly={<></>}/></div>}
                                                        </div>
                                                    </div>
                                                    <DraftReadonlySwitcherComponent
                                                        condition={true} draft={
                                                        <Field name={'assessment.suspicion_index'}>
                                                            {
                                                                (field: FieldProps) => (
                                                                    <FormikTextAreaComponent
                                                                        label={'Index of Suspicion'}
                                                                        placeholder={'Please enter your note here...'}
                                                                        formikField={field}
                                                                        required={false}
                                                                        fullWidth={true}
                                                                    />
                                                                )
                                                            }
                                                        </Field>
                                                    } readonly={
                                                        <div className={'readonly-wrapper'}>
                                                            <FormControlLabelComponent
                                                                label={'Index of Suspicion :'}/>
                                                            <div className={'readonly-text'}>
                                                                {
                                                                    medicalInterventionDetails?.assessment.suspicion_index || 'N/A'
                                                                }
                                                            </div>
                                                        </div>
                                                    }
                                                    />
                                                    <div className={'ts-row'}>
                                                        <div className={'ts-col-12'}>
                                                            {search.showClear &&
                                                                <div className={'clear-cta'}>
                                                                    <DraftReadonlySwitcherComponent
                                                                        condition={true}
                                                                        draft={<div
                                                                            className={'intervention-clear-button'}
                                                                            onClick={event => {
                                                                                formik.setFieldValue('assessment.surgery_procedure', '');
                                                                            }
                                                                            }>Clear</div>}
                                                                        readonly={<></>}/></div>}
                                                        </div>
                                                    </div>
                                                    <DraftReadonlySwitcherComponent
                                                        condition={true} draft={
                                                        <Field name={'assessment.surgery_procedure'}>
                                                            {
                                                                (field: FieldProps) => (
                                                                    <FormikTextAreaComponent
                                                                        label={'Surgery Procedure Completed'}
                                                                        placeholder={'Please enter your note here...'}
                                                                        formikField={field}
                                                                        required={false}
                                                                        fullWidth={true}
                                                                    />
                                                                )
                                                            }
                                                        </Field>
                                                    } readonly={
                                                        <div className={'readonly-wrapper'}>
                                                            <FormControlLabelComponent
                                                                label={'Surgery Procedure Complete :'}/>
                                                            <div className={'readonly-text'}>
                                                                {
                                                                    medicalInterventionDetails?.assessment.surgery_procedure || 'N/A'
                                                                }
                                                            </div>
                                                        </div>
                                                    }
                                                    />
                                                </div>
                                            </div>
                                        </CardComponent>
                                    </div>
                                    <CardComponent title={'P - Plan'}
                                        //                actions={
                                        //     search.showClear && <DraftReadonlySwitcherComponent
                                        //         condition={true}
                                        //         draft={<div className={'intervention-clear-button'} onClick={event => {
                                        //             formik.setFieldValue('plan', {
                                        //                 plan: "",
                                        //                 md_recommendations: "",
                                        //                 education: "",
                                        //                 treatment_goals: "",
                                        //             });
                                        //         }
                                        //         }>Clear</div>}
                                        //         readonly={<></>}/>
                                        // }
                                    >
                                        <div className="ts-row">
                                            <div className="ts-col-12">
                                                {
                                                    search.showClear &&
                                                    <div className={'clear-cta'}><DraftReadonlySwitcherComponent
                                                        condition={true}
                                                        draft={<div className={'intervention-clear-button'}
                                                                    onClick={event => {
                                                                        formik.setFieldValue('plan.plan', "");
                                                                    }
                                                                    }>Clear</div>}
                                                        readonly={<></>}/></div>
                                                }
                                                <DraftReadonlySwitcherComponent
                                                    condition={true} draft={
                                                    <Field name={'plan.plan'}>
                                                        {
                                                            (field: FieldProps) => (
                                                                <FormikTextAreaComponent
                                                                    label={'Plan'}
                                                                    placeholder={'Please enter your note here...'}
                                                                    formikField={field}
                                                                    required={false}
                                                                    fullWidth={true}
                                                                />
                                                            )
                                                        }
                                                    </Field>
                                                } readonly={
                                                    <div className={'readonly-wrapper'}>
                                                        <FormControlLabelComponent
                                                            label={'Plan :'}/>
                                                        <div className={'readonly-text'}>
                                                            {
                                                                medicalInterventionDetails?.plan.plan || 'N/A'
                                                            }
                                                        </div>
                                                    </div>
                                                }
                                                />
                                                <div className="ts-row">
                                                    <div className="ts-col-12">
                                                        {
                                                            search.showClear &&
                                                            <div className={'clear-cta'}><DraftReadonlySwitcherComponent
                                                                condition={true}
                                                                draft={<div className={'intervention-clear-button'}
                                                                            onClick={event => {
                                                                                formik.setFieldValue('plan.md_recommendations', "");
                                                                            }
                                                                            }>Clear</div>}
                                                                readonly={<></>}/></div>
                                                        }
                                                    </div>
                                                </div>
                                                <DraftReadonlySwitcherComponent
                                                    condition={true} draft={
                                                    <Field name={'plan.md_recommendations'}>
                                                        {
                                                            (field: FieldProps) => (
                                                                <FormikTextAreaComponent
                                                                    label={'MD Recommendations'}
                                                                    placeholder={'Please enter your note here...'}
                                                                    formikField={field}
                                                                    required={false}
                                                                    fullWidth={true}
                                                                />
                                                            )
                                                        }
                                                    </Field>
                                                } readonly={
                                                    <div className={'readonly-wrapper'}>
                                                        <FormControlLabelComponent
                                                            label={'MD Recommendations :'}/>
                                                        <div className={'readonly-text'}>
                                                            {
                                                                medicalInterventionDetails?.plan.md_recommendations || 'N/A'
                                                            }
                                                        </div>
                                                    </div>
                                                }
                                                />
                                                <div className="ts-row">
                                                    <div className="ts-col-12">
                                                        {
                                                            search.showClear &&
                                                            <div className={'clear-cta'}><DraftReadonlySwitcherComponent
                                                                condition={true}
                                                                draft={<div className={'intervention-clear-button'}
                                                                            onClick={event => {
                                                                                formik.setFieldValue('plan.education', "",
                                                                                );
                                                                            }
                                                                            }>Clear</div>}
                                                                readonly={<></>}/></div>
                                                        }
                                                    </div>
                                                </div>
                                                <DraftReadonlySwitcherComponent
                                                    condition={true} draft={
                                                    <Field name={'plan.education'}>
                                                        {
                                                            (field: FieldProps) => (
                                                                <FormikTextAreaComponent
                                                                    label={'Education'}
                                                                    placeholder={'Please enter your note here...'}
                                                                    formikField={field}
                                                                    required={false}
                                                                    fullWidth={true}
                                                                />
                                                            )
                                                        }
                                                    </Field>
                                                } readonly={
                                                    <div className={'readonly-wrapper'}>
                                                        <FormControlLabelComponent
                                                            label={'Education :'}/>
                                                        <div className={'readonly-text'}>
                                                            {
                                                                medicalInterventionDetails?.plan.education || 'N/A'
                                                            }
                                                        </div>
                                                    </div>
                                                }
                                                />
                                                <div className="ts-row">
                                                    <div className="ts-col-12">
                                                        {
                                                            search.showClear &&
                                                            <div className={'clear-cta'}><DraftReadonlySwitcherComponent
                                                                condition={true}
                                                                draft={<div className={'intervention-clear-button'}
                                                                            onClick={event => {
                                                                                formik.setFieldValue('plan.treatment_goals', "",);
                                                                            }
                                                                            }>Clear</div>}
                                                                readonly={<></>}/></div>
                                                        }
                                                    </div>
                                                </div>

                                                <DraftReadonlySwitcherComponent
                                                    condition={true} draft={
                                                    <Field name={'plan.treatment_goals'}>
                                                        {
                                                            (field: FieldProps) => (
                                                                <FormikTextAreaComponent
                                                                    label={'Treatment Goals'}
                                                                    placeholder={'Please enter your note here...'}
                                                                    formikField={field}
                                                                    required={false}
                                                                    fullWidth={true}
                                                                />
                                                            )
                                                        }
                                                    </Field>
                                                } readonly={
                                                    <div className={'readonly-wrapper'}>
                                                        <FormControlLabelComponent
                                                            label={'Treatment Goals :'}/>
                                                        <div className={'readonly-text'}>
                                                            {
                                                                medicalInterventionDetails?.plan.treatment_goals || 'N/A'
                                                            }
                                                        </div>
                                                    </div>
                                                }
                                                />
                                            </div>
                                        </div>
                                        <div
                                            className={"display-flex flex-direction-row-reverse mrg-top-50 mrg-bottom-25"}>
                                            <ESignApprovalComponent isSigned={signedObject?.is_signed}
                                                                    isSigning={isSigningInProgress}
                                                // isLoading={formik.isSubmitting}
                                                                    canSign={true}
                                                                    signedAt={signedObject?.signed_on}
                                                                    onSign={() => {
                                                                        handleSign(formik.values, formik);
                                                                    }}/>
                                        </div>
                                    </CardComponent>
                                    <div className="t-form-actions">
                                        <ButtonComponent variant={'outlined'}
                                                         size={'large'}
                                                         onClick={handleDiscardNote}
                                                         className={formik.isSubmitting ? 'mrg-right-15' : ""}>
                                            Discard Note
                                        </ButtonComponent>

                                        <ButtonComponent
                                            onClick={(event) => {
                                                if (signedObject?.is_signed) {
                                                    if (medicalRecordId && medicalInterventionId) {
                                                        navigate(CommonService._routeConfig.MedicalInterventionFinalizeTreatment(medicalRecordId, medicalInterventionId));
                                                    }
                                                    event.preventDefault();
                                                } else {
                                                    const referrer: any = searchParams.get("referrer");
                                                    if (medicalRecordId) {
                                                        if (referrer) {
                                                            navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId) + '?referrer=' + referrer);
                                                        } else {
                                                            navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId));
                                                        }
                                                    }
                                                }
                                            }}
                                            // isLoading={formik.isSubmitting}
                                            size={'large'}
                                            className={(formik.isSubmitting ? 'mrg-right-10' : '') + 'mrg-left-15'}
                                            type={signedObject?.is_signed ? "button" : "submit"}
                                            id={"medical_intervention_add_save_btn"}
                                            // disabled={isFormBeingUpdated}
                                        >
                                            {signedObject?.is_signed ? "Finalize Treatment" : "Save"}
                                        </ButtonComponent>
                                    </div>
                                </Form>
                            );
                        }}
                    </Formik>
                </>
            }
        </div>
    );

};

export default UpdateMedicalInterventionScreen;
