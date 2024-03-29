import "./ViewMedicalInterventionScreen.scss";
import * as Yup from "yup";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import _ from "lodash";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {ImageConfig, Misc} from "../../../constants";
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
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import ToolTipComponent from "../../../shared/components/tool-tip/ToolTipComponent";

interface ViewMedicalInterventionScreenProps {

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
        width: 100,
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        width: 820

    }
]

const MedicalInterventionAddFormValidationSchema = Yup.object().shape({});

const ViewMedicalInterventionScreen = (props: ViewMedicalInterventionScreenProps) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
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
    const [isFormBeingUpdated, setIsFormBeingUpdated] = useState<boolean>(false);

    const SpecialTestsColumns: ITableColumn[] = useMemo<ITableColumn[]>(() => [
        {
            title: 'Test Name',
            dataIndex: 'name',
            key: 'test_name',
            fixed: 'left',
            width: 250,
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
                    {
                        item?.config?.comments ?
                            <ToolTipComponent tooltip={item?.config?.comments}>
                                <div
                                    className={'comment-text'}>{item?.config?.comments?.length > 80 ? CommonService.capitalizeFirstLetter(item?.config?.comments?.substring(0, 80) + '...') : item?.config?.comments}
                                </div>
                            </ToolTipComponent> : '-'
                    }
                </div>
            }
        }
    ], []);

    const getMedicalInterventionROMConfigColumns = useCallback((body_part: any): ITableColumn[] => {
        const ROMColumns: any[] = [
            {
                title: '',
                fixed: 'left',
                width: 180,
                children: [
                    {
                        title: 'Movement',
                        key: 'movement',
                        width: 180,
                        // fixed: 'left',
                        render: (record: any) => {
                            console.log('record', record);
                            return <div className="movement-name">
                                {record?.movement_name}
                            </div>
                        }
                    }
                ]
            }
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
                        width: 41,
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
                width: 300,
                children: [
                    {
                        title: 'Comments',
                        dataIndex: 'comments',
                        key: 'comments',
                        width: 300,
                        render: (item: any) => {
                            return <>
                                {item?.config?.comments ?
                                    <ToolTipComponent tooltip={item?.config?.comments}>
                                        <div
                                            className={'comment-text'}>{item?.config?.comments?.length > 80 ? CommonService.capitalizeFirstLetter(item?.config?.comments?.substring(0, 80) + '...') : item?.config?.comments}
                                        </div>
                                    </ToolTipComponent> : '-'}
                            </>
                        }
                    }]
            }
        )
        return ROMColumns;
    }, []);

    const onSubmit = useCallback((values: any, {
        setSubmitting,
        setErrors
    }: FormikHelpers<any>, announce = false, cb: any = null) => {
        try {
            if (medicalInterventionId) {
                setSubmitting(true);
                setIsSavingProgress(true);
                CommonService._chartNotes.MedicalInterventionBasicDetailsUpdateAPICall(medicalInterventionId, values)
                    .then((response: IAPIResponseType<any>) => {
                        dispatch(setMedicalInterventionDetails(response.data));
                        if (announce) {
                            CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
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
        } catch (error) {
            // Handle synchronous errors here
            console.error(error);
            setSubmitting(false);
            setIsSavingProgress(false);
            if (cb) {
                cb();
            }
        }
    }, [dispatch, medicalInterventionId]);


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

    const handleSign = useCallback((values: any, formik: FormikHelpers<any>) => {
        setIsSigningInProgress(true);
        values['is_signed'] = true;
        onSubmit(values, formik, true, () => {
            setIsSigningInProgress(false);
        });
    }, [onSubmit]);

    const handleEditSoapNote = useCallback(() => {
        if (medicalInterventionDetails?.can_edit === true && medicalRecordId && medicalInterventionId) {
            navigate(CommonService._routeConfig.UpdateMedicalIntervention(medicalRecordId, medicalInterventionId));
        } else {
            CommonService._alert.showToast("ERROR - Unfortunately you are unable to make changes to this file as the time period to edit the file has expired. Please add an addendum SOAP note, or contact your supervisor.", "error");
        }
    }, [medicalInterventionDetails?.can_edit, navigate, medicalRecordId, medicalInterventionId]);

    const handleViewExerciseLog = useCallback(() => {
        if (medicalRecordId) {
            navigate(CommonService._routeConfig.MedicalInterventionExerciseLogView(medicalRecordId, medicalInterventionDetails?._id))
        }
    }, [navigate, medicalInterventionDetails?._id, medicalRecordId])

    console.log('medicalInterventionDetails', medicalInterventionDetails);

    return (
        <div className={'add-medical-intervention-screen'}>
            {
                isMedicalInterventionDetailsLoading && <LoaderComponent/>
            }
            {
                isMedicalInterventionDetailsLoaded && <>
                    <PageHeaderComponent
                        title={medicalInterventionDetails?.is_discharge ? "View Discharge Summary" : "View Treatment Intervention"}
                        actions={
                            <div className="last-updated-status">
                                <div className="last-updated-status-text">Last updated on:&nbsp;</div>
                                <div
                                    className="last-updated-status-bold">
                                    {(medicalInterventionDetails?.updated_at ? moment(medicalInterventionDetails.updated_at).tz(moment.tz.guess()).format('DD-MMM-YYYY | hh:mm A z') : 'N/A')}&nbsp;-&nbsp;
                                    {medicalInterventionDetails?.last_updated_by_details?.first_name ? medicalInterventionDetails?.last_updated_by_details?.first_name + ' ' + medicalInterventionDetails?.last_updated_by_details?.last_name : ' NA'}
                                </div>
                                {isSavingInProgress && <div className="last-updated-status-status">
                                    <ImageConfig.SYNC className={'spin-item'}
                                                      width={16}/>
                                    &nbsp;Saving...</div>}
                            </div>}/>
                    <MedicalInterventionDetailsCardComponent medicalInterventionDetails={medicalInterventionDetails}
                                                             mode={"view"}
                                                             showAction={true}/>
                    <Formik
                        validationSchema={MedicalInterventionAddFormValidationSchema}
                        initialValues={addMedicalInterventionFormInitialValues}
                        onSubmit={(values, formikHelpers) => {
                            if (medicalInterventionDetails.status === 'draft') {
                                onSubmit(values, formikHelpers, false);
                            }
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
                                    {medicalInterventionDetails?.status === 'draft' &&
                                        <FormAutoSave formikCtx={formik} onUpdating={setIsFormBeingUpdated}/>}
                                    <div
                                        className={"display-flex align-items-center justify-content-space-between mrg-bottom-20"}>
                                        <FormControlLabelComponent label={"SOAP Note"} size={'lg'}
                                                                   className={"mrg-0 font-size-20"}/>

                                        <div className={'d-flex'}>
                                            {(medicalRecordId && medicalInterventionDetails?.is_exercise_log_added) &&
                                                <ButtonComponent onClick={handleViewExerciseLog} variant={'outlined'}
                                                                 className={'mrg-right-10'}
                                                                 prefixIcon={<ImageConfig.EyeIcon/>}>
                                                    View Exercise Log
                                                </ButtonComponent>
                                            }
                                            {/*<FilesUneditableMiddlewareComponent*/}
                                            {/*    timeStamp={medicalInterventionDetails?.completed_date}>*/}
                                            <ButtonComponent onClick={handleEditSoapNote}
                                                             variant={'outlined'}
                                                             className={'mrg-right-10'}
                                                             prefixIcon={<ImageConfig.EditIcon/>}>Edit SOAP
                                                Note</ButtonComponent>
                                            {/*</FilesUneditableMiddlewareComponent>*/}


                                            {
                                                (medicalInterventionId && medicalRecordId && medicalInterventionDetails?.status === 'draft') &&
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
                                    </div>
                                    <CardComponent title={'Subjective (S)'}
                                                   actions={
                                                       search.showClear && <DraftReadonlySwitcherComponent
                                                           condition={medicalInterventionDetails?.status === 'draft'}
                                                           draft={<div className={'intervention-clear-button'}
                                                                       onClick={event => {
                                                                           formik.setFieldValue('subjective', '');
                                                                       }
                                                                       }>Clear</div>}
                                                           readonly={<></>}/>
                                                   }
                                    >
                                        <div className="ts-row">
                                            <div className="ts-col-12">
                                                <DraftReadonlySwitcherComponent
                                                    condition={medicalInterventionDetails?.status === 'draft'} draft={
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
                                                        <div className={'readonly-text'}>
                                                            {medicalInterventionDetails?.subjective ? medicalInterventionDetails?.subjective?.split("\n").map((i: any, key: any) => {
                                                                return <div key={key}>{i}</div>;
                                                            }) : "N/A"}
                                                        </div>
                                                    </div>
                                                }
                                                />
                                            </div>
                                        </div>
                                    </CardComponent>
                                    <CardComponent title={'Objective (O)'}
                                                   actions={<>
                                                       {search.showClear && <DraftReadonlySwitcherComponent
                                                           condition={medicalInterventionDetails?.status === 'draft'}
                                                           draft={<div className={'intervention-clear-button'}
                                                                       onClick={event => {
                                                                           formik.setFieldValue('objective', {
                                                                               observation: "",
                                                                               palpation: "",
                                                                               functional_tests: "",
                                                                               treatment: "",
                                                                               treatment_response: ""
                                                                           });
                                                                       }
                                                                       }>Clear</div>}
                                                           readonly={<></>}/>}&nbsp;&nbsp;
                                                       {medicalInterventionDetails?.status === 'draft' &&

                                                           <Field name={'is_flagged'}>
                                                               {
                                                                   (field: FieldProps) => (
                                                                       <FormikCheckBoxComponent
                                                                           label={'Flag Note'}
                                                                           formikField={field}
                                                                           required={false}
                                                                           labelPlacement={"start"}
                                                                           onChange={(isChecked: any) => {
                                                                               CommonService._alert.showToast(isChecked ? 'This note has been marked as flagged' : 'This note has been marked as unflagged', "success");
                                                                           }}
                                                                       />
                                                                   )
                                                               }
                                                           </Field>
                                                       }
                                                   </>}
                                    >
                                        <div className="ts-row">
                                            <div className="ts-col-12">
                                                <DraftReadonlySwitcherComponent
                                                    condition={medicalInterventionDetails?.status === 'draft'} draft={
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
                                                } readonly={
                                                    <div
                                                        className={medicalInterventionDetails?.status === 'draft' ? 'readonly-wrapper' : 'completed-wrapper'}>
                                                        <div
                                                            className={medicalInterventionDetails?.status === 'draft' ? "" : 'heading-wrapper'}>
                                                            <FormControlLabelComponent
                                                                size={'sm'}
                                                                label={'Observation'}/></div>
                                                        <div
                                                            className={medicalInterventionDetails?.status === 'draft' ? 'readonly-text' : 'completed-text'}>
                                                            {medicalInterventionDetails?.objective?.observation ? medicalInterventionDetails?.objective?.observation.split("\n").map((i: any, key: any) => {
                                                                return <div className={'completed-text'}
                                                                            key={key}>{i}</div>;
                                                            }) : "Not Tested"}
                                                        </div>
                                                    </div>
                                                }
                                                />
                                                <div
                                                    className={"card-styling padding-card-5 range-of-motion-wrapper mrg-bottom-25"}>
                                                    <>
                                                        {
                                                            medicalRecordId && medicalInterventionId && <>
                                                                {/*{*/}
                                                                {/* medicalInterventionDetails?.rom_config?.length === 0 &&*/}
                                                                {/* <LinkComponent*/}
                                                                {/* route={CommonService._routeConfig.MedicalInterventionROMConfig(medicalRecordId, medicalInterventionId)}>*/}
                                                                {/* <ButtonComponent*/}
                                                                {/* fullWidth={true}*/}
                                                                {/* variant={'outlined'}*/}
                                                                {/* size={"large"}*/}
                                                                {/* >*/}
                                                                {/* Add Range of Motion and Strength*/}
                                                                {/* </ButtonComponent>*/}
                                                                {/* </LinkComponent>*/}
                                                                {/*}*/}
                                                                {/*{*/}


                                                                {medicalInterventionDetails?.rom_config?.length === 0 &&
                                                                    <div
                                                                        className={'display-flex mrg-bottom-0 rom-icd-not-tested-block '}>
                                                                        <FormControlLabelComponent
                                                                            className={'mrg-bottom-5'}
                                                                            size={'sm'}
                                                                            label={"Range of Motion and Strength"}/>
                                                                        <div className={'not-texted-text-rom'}>
                                                                            Not Tested
                                                                        </div>

                                                                    </div>

                                                                }
                                                                <div className={'completed-wrapper'}>
                                                                    {medicalInterventionDetails?.status === 'completed' && medicalInterventionDetails?.rom_config?.length > 0 &&

                                                                        <div
                                                                            className={medicalInterventionDetails?.status === 'draft' ? "" : 'heading-wrapper'}>
                                                                            <FormControlLabelComponent
                                                                                size={'sm'}
                                                                                label={"Range of Motion and Strength "}/>
                                                                        </div>

                                                                    }
                                                                    {
                                                                        medicalInterventionDetails?.rom_config?.length > 0 &&
                                                                        <CardComponent className={'rom-header'}
                                                                                       title={""}
                                                                                       actions={
                                                                                           <DraftReadonlySwitcherComponent
                                                                                               condition={true}
                                                                                               draft={<>
                                                                                                   {
                                                                                                       (medicalInterventionId && medicalRecordId) && medicalInterventionDetails?.status === 'draft' &&
                                                                                                       <LinkComponent
                                                                                                           route={CommonService._routeConfig.MedicalInterventionROMConfig(medicalRecordId, medicalInterventionId)}>
                                                                                                           <ButtonComponent
                                                                                                               size={"small"}
                                                                                                               prefixIcon={(medicalInterventionDetails?.rom_config && medicalInterventionDetails?.rom_config?.length > 0) ?
                                                                                                                   <ImageConfig.EditIcon/> :
                                                                                                                   <ImageConfig.AddIcon/>}>
                                                                                                               {medicalInterventionDetails?.rom_config && medicalInterventionDetails?.rom_config?.length > 0 ? 'Edit' : 'Add'}
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
                                                                                                    {/*{*/}
                                                                                                    {/*    body_part?.rom_config?.length > 0 &&*/}
                                                                                                    {/*    <TableComponent*/}
                                                                                                    {/*        data={body_part?.rom_config?.filter((rom_config: any) => {*/}
                                                                                                    {/*            const bodyPartSides = body_part?.body_part_details?.sides;*/}
                                                                                                    {/*            const config = rom_config?.config;*/}
                                                                                                    {/*            if (config?.comments) {*/}
                                                                                                    {/*                return rom_config;*/}
                                                                                                    {/*            } else {*/}
                                                                                                    {/*                let romConfig = undefined;*/}
                                                                                                    {/*                bodyPartSides?.forEach((side: any) => {*/}
                                                                                                    {/*                    const sideConfig = config[side];*/}
                                                                                                    {/*                    if (sideConfig?.arom || sideConfig?.prom || sideConfig?.strength) {*/}
                                                                                                    {/*                        romConfig = rom_config;*/}
                                                                                                    {/*                    }*/}
                                                                                                    {/*                });*/}
                                                                                                    {/*                return romConfig;*/}
                                                                                                    {/*            }*/}
                                                                                                    {/*        })}*/}
                                                                                                    {/*        showExpandColumn={false}*/}
                                                                                                    {/*        className={'view-arom-prom-table'}*/}
                                                                                                    {/*        defaultExpandAllRows={true}*/}
                                                                                                    {/*        canExpandRow={(row: any) => row?.config?.comments?.length > 0}*/}
                                                                                                    {/*        // expandRowRenderer={*/}
                                                                                                    {/*        // (row: any) => {*/}
                                                                                                    {/*        // return (*/}
                                                                                                    {/*        // <div*/}
                                                                                                    {/*        // key={row?.config?._id}*/}
                                                                                                    {/*        // className={'comment-row'}>*/}
                                                                                                    {/*        // <div*/}
                                                                                                    {/*        // className={'comment-icon'}>*/}
                                                                                                    {/*        // <ImageConfig.CommentIcon/>*/}
                                                                                                    {/*        // </div>*/}
                                                                                                    {/*        // <div*/}
                                                                                                    {/*        // className={'comment-text'}>{row?.config?.comments ? CommonService.capitalizeFirstLetter(row?.config?.comments) : "-"}</div>*/}
                                                                                                    {/*        // </div>*/}
                                                                                                    {/*        // )*/}
                                                                                                    {/*        // }*/}
                                                                                                    {/*        // }*/}
                                                                                                    {/*        bordered={true}*/}
                                                                                                    {/*        columns={getMedicalInterventionROMConfigColumns(body_part)}/>*/}
                                                                                                    {/*}*/}
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
                                                                                                    {
                                                                                                        body_part?.rom_config?.length === 0 &&
                                                                                                        <StatusCardComponent
                                                                                                            title={"The following body part does not have any Range of Motion or Strength " +
                                                                                                                " measurements. \n Please choose another body part."}/>
                                                                                                    }
                                                                                                </>
                                                                                            }
                                                                                        </>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </CardComponent>
                                                                    }
                                                                </div>
                                                            </>
                                                        }
                                                    </>
                                                </div>
                                                <div className="special-test-wrapper">
                                                    {
                                                        medicalRecordId && medicalInterventionId && <>
                                                            {/*{*/}
                                                            {/* medicalInterventionDetails?.special_tests?.length === 0 &&*/}
                                                            {/* <LinkComponent*/}
                                                            {/* route={CommonService._routeConfig.MedicalInterventionSpecialTests(medicalRecordId, medicalInterventionId)}>*/}
                                                            {/* <ButtonComponent*/}
                                                            {/* fullWidth={true}*/}
                                                            {/* variant={'outlined'}*/}
                                                            {/* size={"large"}*/}
                                                            {/* className={'mrg-bottom-20'}*/}
                                                            {/* >*/}
                                                            {/* Add Special Test*/}
                                                            {/* </ButtonComponent>*/}
                                                            {/* </LinkComponent>*/}
                                                            {/*}*/}
                                                            {/*/!*{*!/*/}
                                                            {medicalInterventionDetails?.special_tests?.length === 0 &&
                                                                <div className={'display-flex mrg-bottom-0'}>
                                                                    <FormControlLabelComponent
                                                                        size={'sm'}
                                                                        className={'mrg-bottom-20 special-test-view-header'}
                                                                        label={"Special Tests"}/>
                                                                    <div className={'not-texted-text-special-test'}>
                                                                        Not Tested
                                                                    </div>

                                                                </div>
                                                            }
                                                            <div className={'completed-wrapper'}>
                                                                {medicalInterventionDetails?.status === 'completed' && medicalInterventionDetails?.special_tests?.length > 0 &&

                                                                    <div
                                                                        className={medicalInterventionDetails?.status === 'draft' ? "" : 'heading-wrapper'}>
                                                                        <FormControlLabelComponent
                                                                            size={'sm'}
                                                                            label={"Special Tests "}/>
                                                                    </div>

                                                                }
                                                                {
                                                                    medicalInterventionDetails?.special_tests?.length > 0 &&
                                                                    <div className="icd-codes-wrapper">
                                                                        <div
                                                                            className={"card-styling"}>
                                                                            {/*+ ((medicalInterventionDetails?.special_tests && medicalInterventionDetails?.special_tests.length > 0) ?' white-card-header ' : '')*/}
                                                                            <div className={'card-wrapper'}>
                                                                                <CardComponent title={""}
                                                                                               className={'special-test-header'}
                                                                                               actions={
                                                                                                   <DraftReadonlySwitcherComponent
                                                                                                       condition={true}
                                                                                                       draft={<>
                                                                                                           {
                                                                                                               (medicalInterventionId && medicalRecordId) && medicalInterventionDetails?.status === 'draft' &&
                                                                                                               <LinkComponent
                                                                                                                   route={CommonService._routeConfig.MedicalInterventionSpecialTests(medicalRecordId, medicalInterventionId)}>
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

                                                                                    {medicalInterventionDetails?.special_tests.length > 0 ? medicalInterventionDetails?.special_tests.map((body_part: any) => {
                                                                                        return (<div>
                                                                                            <CardComponent
                                                                                                size={'sm'}
                                                                                                className={'body-part-card'}
                                                                                                title={"Body Part: " + body_part?.body_part_details?.name || "-"}>
                                                                                            </CardComponent>
                                                                                            <TableComponent
                                                                                                data={body_part.special_tests}
                                                                                                columns={SpecialTestsColumns}
                                                                                                bordered={true}
                                                                                            />
                                                                                        </div>)
                                                                                    }) : 'Not Tested'}
                                                                                </CardComponent>
                                                                            </div>
                                                                        </div>
                                                                    </div>}

                                                            </div>
                                                        </>
                                                    }
                                                </div>
                                                <DraftReadonlySwitcherComponent
                                                    condition={medicalInterventionDetails?.status === 'draft'} draft={
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
                                                } readonly={
                                                    <div
                                                        className={medicalInterventionDetails?.status === 'draft' ? 'readonly-wrapper' : 'completed-wrapper'}>
                                                        <div
                                                            className={medicalInterventionDetails?.status === 'draft' ? "" : 'heading-wrapper'}>
                                                            <FormControlLabelComponent
                                                                size={'sm'}
                                                                label={'Palpation'}/></div>
                                                        <div
                                                            className={medicalInterventionDetails?.status === 'draft' ? 'readonly-text' : 'completed-text'}>
                                                            {medicalInterventionDetails?.objective?.palpation ? medicalInterventionDetails?.objective?.palpation.split("\n").map((i: any, key: any) => {
                                                                return <div key={key}>{i}</div>;
                                                            }) : "Not Tested"}
                                                        </div>
                                                    </div>
                                                }
                                                />
                                                <DraftReadonlySwitcherComponent
                                                    condition={medicalInterventionDetails?.status === 'draft'} draft={
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
                                                } readonly={
                                                    <div
                                                        className={medicalInterventionDetails?.status === 'draft' ? 'readonly-wrapper' : 'completed-wrapper'}>
                                                        <div
                                                            className={medicalInterventionDetails?.status === 'draft' ? "" : 'heading-wrapper'}>
                                                            <FormControlLabelComponent
                                                                size={'sm'}
                                                                label={'Functional Tests'}/></div>
                                                        <div
                                                            className={medicalInterventionDetails?.status === 'draft' ? 'readonly-text' : 'completed-text'}>
                                                            {medicalInterventionDetails?.objective?.functional_tests ? medicalInterventionDetails?.objective?.functional_tests.split("\n").map((i: any, key: any) => {
                                                                return <div key={key}>{i}</div>;
                                                            }) : "Not Tested"}
                                                        </div>
                                                    </div>
                                                }
                                                />

                                                <DraftReadonlySwitcherComponent
                                                    condition={medicalInterventionDetails?.status === 'draft'} draft={
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
                                                } readonly={
                                                    <div
                                                        className={medicalInterventionDetails?.status === 'draft' ? 'readonly-wrapper' : 'completed-wrapper'}>
                                                        <div
                                                            className={medicalInterventionDetails?.status === 'draft' ? "" : 'heading-wrapper'}>
                                                            <FormControlLabelComponent
                                                                size={'sm'}
                                                                label={'Treatment'}/></div>
                                                        <div
                                                            className={medicalInterventionDetails?.status === 'draft' ? 'readonly-text' : 'completed-text'}>
                                                            {medicalInterventionDetails?.objective?.treatment ? medicalInterventionDetails?.objective?.treatment.split("\n").map((i: any, key: any) => {
                                                                return <div key={key}>{i}</div>;
                                                            }) : "Not Tested"}

                                                        </div>
                                                    </div>
                                                }
                                                />


                                                <DraftReadonlySwitcherComponent
                                                    condition={medicalInterventionDetails?.status === 'draft'} draft={
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
                                                } readonly={
                                                    <div
                                                        className={medicalInterventionDetails?.status === 'draft' ? 'readonly-wrapper' : 'completed-wrapper'}>
                                                        <div
                                                            className={medicalInterventionDetails?.status === 'draft' ? "" : 'heading-wrapper'}>
                                                            <FormControlLabelComponent
                                                                size={'sm'}
                                                                label={'Response to Treatment'}/></div>
                                                        <div
                                                            className={medicalInterventionDetails?.status === 'draft' ? 'readonly-text' : 'completed-text'}>
                                                            {medicalInterventionDetails?.objective?.treatment_response ? medicalInterventionDetails?.objective?.treatment_response.split("\n").map((i: any, key: any) => {
                                                                return <div key={key}>{i}</div>;
                                                            }) : "Not Tested"}
                                                        </div>
                                                    </div>
                                                }
                                                />


                                            </div>
                                        </div>
                                    </CardComponent>
                                    <CardComponent title={'Assessment (A)'} actions={
                                        search.showClear && <DraftReadonlySwitcherComponent
                                            condition={medicalInterventionDetails?.status === 'draft'}
                                            draft={<div className={'intervention-clear-button'} onClick={event => {
                                                formik.setFieldValue('assessment', {
                                                    suspicion_index: '',
                                                    surgery_procedure: ''
                                                });
                                            }
                                            }>Clear</div>}
                                            readonly={<></>}/>
                                    }>
                                        <div className="ts-row">
                                            <div className="ts-col-12">
                                                <div className="icd-codes-wrapper mrg-bottom-10">
                                                    {
                                                        medicalRecordId && medicalInterventionId && <>
                                                            {/*{*/}
                                                            {/* medicalInterventionDetails?.linked_icd_codes?.length === 0 &&*/}
                                                            {/* <LinkComponent*/}
                                                            {/* route={CommonService._routeConfig.MedicalInterventionICDCodes(medicalRecordId, medicalInterventionId)}>*/}
                                                            {/* <ButtonComponent*/}
                                                            {/* fullWidth={true}*/}
                                                            {/* variant={'outlined'}*/}
                                                            {/* size={"large"}*/}
                                                            {/* className={'mrg-bottom-20'}*/}
                                                            {/* >*/}
                                                            {/* Add Medical Diagnosis / ICD-11 Codes*/}
                                                            {/* </ButtonComponent>*/}
                                                            {/* </LinkComponent>*/}
                                                            {/*}*/}
                                                            {/*{*/}

                                                            {(medicalInterventionDetails?.linked_icd_codes === undefined || medicalInterventionDetails?.linked_icd_codes?.length === 0) &&
                                                                <div className={'display-flex rom-icd-not-tested-block'}>
                                                                    <FormControlLabelComponent
                                                                        size={'sm'}
                                                                        label={"Medical Diagnosis / ICD Codes "}/>
                                                                    <div className={'not-texted-text-icd'}>
                                                                        Not Added
                                                                    </div>

                                                                </div>

                                                            }
                                                            <div className={'completed-wrapper'}>
                                                                {medicalInterventionDetails?.status === 'completed' && medicalInterventionDetails?.linked_icd_codes?.length > 0 &&

                                                                    <div
                                                                        className={medicalInterventionDetails?.status === 'draft' ? "" : 'heading-wrapper'}>
                                                                        <FormControlLabelComponent
                                                                            size={'sm'}
                                                                            label={"Medical Diagnosis/ICD Codes"}/>
                                                                    </div>


                                                                }
                                                                {
                                                                    medicalInterventionDetails?.linked_icd_codes?.length > 0 &&
                                                                    <div className="icd-codes-wrapper">
                                                                        <div className="card-styling">
                                                                            <div className={'card-wrapper'}>
                                                                                <CardComponent size={'sm'}
                                                                                               className={medicalInterventionDetails?.status === 'completed' ? 'icd-codes-header' : ''}
                                                                                               title={''}
                                                                                               actions={
                                                                                                   <DraftReadonlySwitcherComponent
                                                                                                       condition={true}
                                                                                                       draft={<>
                                                                                                           {
                                                                                                               (medicalInterventionId && medicalRecordId) && medicalInterventionDetails?.status === 'draft' &&
                                                                                                               <LinkComponent
                                                                                                                   route={CommonService._routeConfig.MedicalInterventionICDCodes(medicalRecordId, medicalInterventionId)}>
                                                                                                                   <ButtonComponent
                                                                                                                       size={"small"}
                                                                                                                       prefixIcon={(medicalInterventionDetails?.linked_icd_codes && medicalInterventionDetails?.linked_icd_codes.length > 0) ?
                                                                                                                           <ImageConfig.EditIcon/> :
                                                                                                                           <ImageConfig.AddIcon/>}>
                                                                                                                       {medicalInterventionDetails?.linked_icd_codes && medicalInterventionDetails?.linked_icd_codes.length > 0 ? 'Edit' : 'Add'}
                                                                                                                   </ButtonComponent>
                                                                                                               </LinkComponent>
                                                                                                           }
                                                                                                       </>} readonly={<></>}/>
                                                                                               }>
                                                                                    <div className={'icd-table-wrapper'}>
                                                                                        <TableComponent
                                                                                            data={medicalInterventionDetails?.linked_icd_codes}
                                                                                            bordered={true}
                                                                                            columns={ICDTableColumns}/>
                                                                                    </div>
                                                                                </CardComponent>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                }
                                                            </div>
                                                        </>


                                                    }
                                                </div>
                                                <DraftReadonlySwitcherComponent
                                                    condition={medicalInterventionDetails?.status === 'draft'} draft={
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
                                                } readonly={
                                                    <div
                                                        className={medicalInterventionDetails?.status === 'draft' ? 'readonly-wrapper' : 'completed-wrapper'}>
                                                        <div
                                                            className={medicalInterventionDetails?.status === 'draft' ? "" : 'heading-wrapper'}>
                                                            <FormControlLabelComponent
                                                                size={'sm'}
                                                                label={'Index of Suspicion'}/></div>
                                                        <div
                                                            className={medicalInterventionDetails?.status === 'draft' ? 'readonly-text' : 'completed-text'}>
                                                            {medicalInterventionDetails?.assessment?.suspicion_index ? medicalInterventionDetails?.assessment?.suspicion_index?.split("\n").map((i: any, key: any) => {
                                                                return <div key={key}>{i}</div>;
                                                            }) : "N/A"}
                                                        </div>
                                                    </div>
                                                }
                                                />
                                                <DraftReadonlySwitcherComponent
                                                    condition={medicalInterventionDetails?.status === 'draft'} draft={
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
                                                } readonly={
                                                    <div
                                                        className={medicalInterventionDetails?.status === 'draft' ? 'readonly-wrapper' : 'completed-wrapper'}>
                                                        <div
                                                            className={medicalInterventionDetails?.status === 'draft' ? "" : 'heading-wrapper'}>
                                                            <FormControlLabelComponent
                                                                size={'sm'}
                                                                label={'Surgery Procedure Complete'}/></div>
                                                        <div
                                                            className={medicalInterventionDetails?.status === 'draft' ? 'readonly-text' : 'completed-text'}>
                                                            {medicalInterventionDetails?.assessment?.surgery_procedure ? medicalInterventionDetails?.assessment?.surgery_procedure?.split("\n").map((i: any, key: any) => {
                                                                return <div key={key}>{i}</div>;
                                                            }) : "N/A"}
                                                        </div>
                                                    </div>
                                                }
                                                />
                                            </div>
                                        </div>
                                    </CardComponent>
                                    <div className={'plan-card-wrapper'}>
                                        <CardComponent title={'Plan (P)'} actions={
                                            search.showClear && <DraftReadonlySwitcherComponent
                                                condition={medicalInterventionDetails?.status === 'draft'}
                                                draft={<div className={'intervention-clear-button'} onClick={event => {
                                                    formik.setFieldValue('plan', {
                                                        plan: "",
                                                        md_recommendations: "",
                                                        education: "",
                                                        treatment_goals: "",
                                                    });
                                                }
                                                }>Clear</div>}
                                                readonly={<></>}/>
                                        }>
                                            <div className="ts-row">
                                                <div className="ts-col-12">
                                                    <DraftReadonlySwitcherComponent
                                                        condition={medicalInterventionDetails?.status === 'draft'} draft={
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
                                                    } readonly={
                                                        <div
                                                            className={medicalInterventionDetails?.status === 'draft' ? 'readonly-wrapper' : 'completed-wrapper'}>
                                                            <div
                                                                className={medicalInterventionDetails?.status === 'draft' ? "" : 'heading-wrapper'}>
                                                                <FormControlLabelComponent
                                                                    size={'sm'}
                                                                    label={'Plan'}/></div>
                                                            <div
                                                                className={medicalInterventionDetails?.status === 'draft' ? 'readonly-text' : 'completed-text'}>
                                                                {medicalInterventionDetails?.plan.plan ? medicalInterventionDetails?.plan.plan?.split("\n").map((i: any, key: any) => {
                                                                    return <div key={key}>{i}</div>;
                                                                }) : "N/A"}
                                                            </div>
                                                        </div>
                                                    }
                                                    />
                                                    <DraftReadonlySwitcherComponent
                                                        condition={medicalInterventionDetails?.status === 'draft'} draft={
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
                                                    } readonly={
                                                        <div
                                                            className={medicalInterventionDetails?.status === 'draft' ? 'readonly-wrapper' : 'completed-wrapper'}>
                                                            <div
                                                                className={medicalInterventionDetails?.status === 'draft' ? "" : 'heading-wrapper'}>
                                                                <FormControlLabelComponent
                                                                    size={'sm'}
                                                                    label={'MD Recommendations'}/></div>
                                                            <div
                                                                className={medicalInterventionDetails?.status === 'draft' ? 'readonly-text' : 'completed-text'}>
                                                                {medicalInterventionDetails?.plan.md_recommendations ? medicalInterventionDetails?.plan.md_recommendations?.split("\n").map((i: any, key: any) => {
                                                                    return <div key={key}>{i}</div>;
                                                                }) : "N/A"}
                                                            </div>
                                                        </div>
                                                    }
                                                    />
                                                    <DraftReadonlySwitcherComponent
                                                        condition={medicalInterventionDetails?.status === 'draft'} draft={
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
                                                    } readonly={
                                                        <div
                                                            className={medicalInterventionDetails?.status === 'draft' ? 'readonly-wrapper' : 'completed-wrapper'}>
                                                            <div
                                                                className={medicalInterventionDetails?.status === 'draft' ? "" : 'heading-wrapper'}>
                                                                <FormControlLabelComponent
                                                                    size={'sm'}
                                                                    label={'Education'}/></div>
                                                            <div
                                                                className={medicalInterventionDetails?.status === 'draft' ? 'readonly-text' : 'completed-text'}>
                                                                {medicalInterventionDetails?.plan.education ? medicalInterventionDetails?.plan.education?.split("\n").map((i: any, key: any) => {
                                                                    return <div key={key}>{i}</div>;
                                                                }) : "N/A"}
                                                            </div>
                                                        </div>
                                                    }
                                                    />


                                                    <DraftReadonlySwitcherComponent
                                                        condition={medicalInterventionDetails?.status === 'draft'} draft={
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
                                                    } readonly={
                                                        <div
                                                            className={medicalInterventionDetails?.status === 'draft' ? 'readonly-wrapper' : 'completed-wrapper'}>
                                                            <div
                                                                className={medicalInterventionDetails?.status === 'draft' ? "" : 'heading-wrapper'}>
                                                                <FormControlLabelComponent
                                                                    size={'sm'}
                                                                    label={'Treatment Goals'}/>
                                                            </div>
                                                            <div
                                                                className={medicalInterventionDetails?.status === 'draft' ? 'readonly-text' : 'completed-text'}>
                                                                {medicalInterventionDetails?.plan.treatment_goals ? medicalInterventionDetails?.plan.treatment_goals?.split("\n").map((i: any, key: any) => {
                                                                    return <div key={key}>{i}</div>;
                                                                }) : "N/A"}
                                                            </div>
                                                        </div>
                                                    }
                                                    />
                                                </div>
                                            </div>
                                        </CardComponent>
                                        <div className={'ts-row'}>
                                            <div className={'ts-col-9'}/>
                                            <div
                                                className={"display-flex flex-direction-row-reverse ts-col-3 mrg-top-20"}>
                                                <ESignApprovalComponent isSigned={medicalInterventionDetails?.is_signed}
                                                                        isSigning={isSigningInProgress}
                                                                        signature_url={medicalInterventionDetails?.signature}
                                                    // isLoading={isFormBeingUpdated || formik.isSubmitting}
                                                                        canSign={medicalInterventionDetails?.can_sign}
                                                                        signedAt={medicalInterventionDetails?.signed_on}
                                                                        onSign={() => {
                                                                            handleSign(formik.values, formik);
                                                                        }}/>
                                            </div>
                                        </div>
                                    </div>
                                    {medicalInterventionDetails?.status === 'draft' && <div className="t-form-actions">
                                        <ButtonComponent
                                            onClick={(event) => {
                                                if (medicalInterventionDetails?.is_signed) {
                                                    if (medicalRecordId && medicalInterventionId) {
                                                        navigate(CommonService._routeConfig.MedicalInterventionFinalizeTreatment(medicalRecordId, medicalInterventionId));
                                                    }
                                                    event.preventDefault();
                                                }
                                            }}
                                            isLoading={formik.isSubmitting}
                                            type={medicalInterventionDetails?.is_signed ? "button" : "submit"}
                                            id={"medical_intervention_add_save_btn"}
                                            disabled={isFormBeingUpdated}
                                        >
                                            {isFormBeingUpdated ? "Typing..." : (medicalInterventionDetails?.is_signed ? "Finalize treatment" : formik.isSubmitting ? "Saving" : "Save")}
                                        </ButtonComponent>
                                    </div>}
                                </Form>
                            );
                        }}
                    </Formik>
                </>
            }
        </div>
    );

};

export default ViewMedicalInterventionScreen;
