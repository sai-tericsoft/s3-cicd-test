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
        width: 150,
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
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
            width: 150,
        },
        {
            title: ' Results',
            dataIndex: 'result',
            align: 'center',
            fixed: 'left',
            key: 'result',
            width: 150,
        },
        {
            title: 'Comments',
            dataIndex: 'comments',
            key: 'name',
            width: 147,
            // align: 'center',
            // fixed: 'right',
            render: (item: any) => {
                return <div className={'comments'}>
                    {item?.comments || "N/A"}
                </div>
            }
        }
    ], []);

    const getMedicalInterventionROMConfigColumns = useCallback((body_part: any): ITableColumn[] => {
        const ROMColumns: any[] = [
            {
                title: '',
                fixed: 'left',
                children: [
                    {
                        title: 'Movement',
                        key: 'movement',
                        width: 180,
                        fixed: 'left',
                        render: (record: any) => {
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
                fixed: 'left',
                align: 'center',
                children: [
                    {
                        title: 'AROM',
                        dataIndex: 'arom',
                        key: side + 'arom',
                        align: 'center',
                        fixed: 'left',
                        width: 87,
                        render: (item: any) => {
                            return <div className={'movement-name'}>{item?.config[side]?.arom || '-'}</div>
                        }
                    },
                    {
                        title: 'PROM',
                        dataIndex: 'prom',
                        key: side + 'prom',
                        align: 'center',
                        fixed: 'left',
                        width: 87,
                        render: (item: any) => {
                            return <div className={'movement-name'}>{item?.config[side]?.prom || "-"}</div>
                        }
                    },
                    {
                        title: 'Strength',
                        dataIndex: 'strength',
                        key: side + 'strength',
                        align: 'center',
                        fixed: 'left',
                        width: 107,
                        render: (item: any) => {
                            return <div className={'movement-name'}>{item?.config[side]?.strength || "-"}</div>
                        }
                    }
                ]
            });
        });
        ROMColumns.push({
            title: '',
            dataIndex: '',
            key: 'dummy',
        })
        return ROMColumns;
    }, []);

    const onSubmit = useCallback((values: any, {
        setSubmitting,
        setErrors
    }: FormikHelpers<any>, announce = false, cb: any = null) => {
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

    return (
        <div className={'add-medical-intervention-screen'}>
            {
                isMedicalInterventionDetailsLoading && <LoaderComponent/>
            }
            {
                isMedicalInterventionDetailsLoaded && <>
                    <PageHeaderComponent
                        title={medicalInterventionDetails?.is_discharge ? "View Discharge Summary" : "View Medical Intervention"}
                        actions={
                            <div className="last-updated-status">
                                <div className="last-updated-status-text">Last Updated On:&nbsp;</div>
                                <div
                                    className="last-updated-status-bold">
                                    {(medicalInterventionDetails?.updated_at ? moment(medicalInterventionDetails.updated_at).tz(moment.tz.guess()).format('DD-MM-YYYY | hh:mm A z') : 'N/A')}&nbsp;-&nbsp;
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
                                        {
                                            (medicalInterventionId && medicalRecordId && medicalInterventionDetails?.status === 'draft') &&
                                            <LinkComponent
                                                route={CommonService._routeConfig.MedicalInterventionExerciseLogUpdate(medicalRecordId, medicalInterventionId)}>
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
                                                        <FormControlLabelComponent
                                                            label={'Subjective'}/>
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
                                                    <div className={'readonly-wrapper'}>
                                                        <FormControlLabelComponent
                                                            label={'Observation'}/>
                                                        <div className={'readonly-text'}>
                                                            {
                                                                medicalInterventionDetails?.objective.observation || 'N/A'
                                                            }
                                                        </div>
                                                    </div>
                                                }
                                                />
                                                <div className="card-styling padding-card-5 range-of-motion-wrapper">
                                                    <>
                                                        {
                                                            medicalRecordId && medicalInterventionId && <>
                                                                {
                                                                    medicalInterventionDetails?.rom_config?.length === 0 &&
                                                                    <LinkComponent
                                                                        route={CommonService._routeConfig.MedicalInterventionROMConfig(medicalRecordId, medicalInterventionId)}>
                                                                        <ButtonComponent
                                                                            fullWidth={true}
                                                                            variant={'outlined'}
                                                                            size={"large"}
                                                                        >
                                                                            Add Range of Motion and Strength
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
                                                                                                       route={CommonService._routeConfig.MedicalInterventionROMConfig(medicalRecordId, medicalInterventionId)}>
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
                                                                                        <CardComponent
                                                                                            className={'body-part-card'}
                                                                                            size={'sm'}
                                                                                            title={"Body Part: " + body_part?.body_part_details?.name || "-"}>
                                                                                        </CardComponent>
                                                                                        {
                                                                                            body_part?.rom_config?.length > 0 && <TableComponent
                                                                                                data={body_part?.rom_config?.filter((rom_config: any) => {
                                                                                                    const bodyPartSides = body_part?.body_part_details?.sides;
                                                                                                    const config = rom_config?.config;
                                                                                                    if (config?.comments) {
                                                                                                        return rom_config;
                                                                                                    } else {
                                                                                                        let romConfig = undefined;
                                                                                                        bodyPartSides?.forEach((side: any) => {
                                                                                                            const sideConfig = config[side];
                                                                                                            if (sideConfig?.arom || sideConfig?.prom || sideConfig?.strength) {
                                                                                                                romConfig = rom_config;
                                                                                                            }
                                                                                                        });
                                                                                                        return romConfig;
                                                                                                    }
                                                                                                })}
                                                                                                showExpandColumn={false}
                                                                                                defaultExpandAllRows={true}
                                                                                                canExpandRow={(row: any) => row?.config?.comments?.length > 0}
                                                                                                expandRowRenderer={
                                                                                                    (row: any) => {
                                                                                                        return (
                                                                                                            <div
                                                                                                                key={row?.config?._id}
                                                                                                                className={'comment-row'}>
                                                                                                                <div
                                                                                                                    className={'comment-icon'}>
                                                                                                                    <ImageConfig.CommentIcon/>
                                                                                                                </div>
                                                                                                                <div
                                                                                                                    className={'comment-text'}>{row?.config?.comments ? CommonService.capitalizeFirstLetter(row?.config?.comments) : "-"}</div>
                                                                                                            </div>
                                                                                                        )
                                                                                                    }
                                                                                                }
                                                                                                bordered={true}
                                                                                                columns={getMedicalInterventionROMConfigColumns(body_part)}/>
                                                                                        }
                                                                                        {
                                                                                            body_part?.rom_config?.length === 0 &&  <StatusCardComponent
                                                                                                title={"The following body part does not have any Range of Motion or Strength " +
                                                                                                    "                                                measurements. \n Please choose another body part."}/>
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
                                                <div className="special-test-wrapper">
                                                    {
                                                        medicalRecordId && medicalInterventionId && <>
                                                            {
                                                                medicalInterventionDetails?.special_tests?.length === 0 &&
                                                                <LinkComponent
                                                                    route={CommonService._routeConfig.MedicalInterventionSpecialTests(medicalRecordId, medicalInterventionId)}>
                                                                    <ButtonComponent
                                                                        fullWidth={true}
                                                                        variant={'outlined'}
                                                                        size={"large"}
                                                                        className={'mrg-bottom-20'}
                                                                    >
                                                                        Add Special Test
                                                                    </ButtonComponent>
                                                                </LinkComponent>
                                                            }
                                                            {
                                                                medicalInterventionDetails?.special_tests?.length > 0 &&
                                                                <div
                                                                    className={"card-styling padding-card-5 mrg-bottom-20 " + ((medicalInterventionDetails?.special_tests && medicalInterventionDetails?.special_tests.length > 0) ?
                                                                        ' white-card-header ' : '')}>
                                                                    <CardComponent title={"Special Test"}
                                                                                   className={'special-test-header'}
                                                                                   actions={
                                                                                       <DraftReadonlySwitcherComponent
                                                                                           condition={true}
                                                                                           draft={<>
                                                                                               {
                                                                                                   (medicalInterventionId && medicalRecordId) &&
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

                                                                        {medicalInterventionDetails?.special_tests && medicalInterventionDetails?.special_tests.map((body_part: any) => {
                                                                            return (<div className={''}>
                                                                                <CardComponent className={'body-part-card'}
                                                                                               size={'sm'}
                                                                                               title={"Body Part: " + body_part?.body_part_details?.name || "-"}>
                                                                                </CardComponent>
                                                                                <TableComponent
                                                                                    data={body_part.special_tests}
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
                                                    <div className={'readonly-wrapper'}>
                                                        <FormControlLabelComponent
                                                            label={'Treatment'}/>
                                                        <div className={'readonly-text'}>
                                                            {
                                                                medicalInterventionDetails?.objective.treatment || 'N/A'
                                                            }
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
                                                    <div className={'readonly-wrapper'}>
                                                        <FormControlLabelComponent
                                                            label={'Response to Treatment'}/>
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
                                                <div className="icd-codes-wrapper">
                                                    {
                                                        medicalRecordId && medicalInterventionId && <>
                                                            {
                                                                medicalInterventionDetails?.linked_icd_codes?.length === 0 &&
                                                                <LinkComponent
                                                                    route={CommonService._routeConfig.MedicalInterventionICDCodes(medicalRecordId, medicalInterventionId)}>
                                                                    <ButtonComponent
                                                                        fullWidth={true}
                                                                        variant={'outlined'}
                                                                        size={"large"}
                                                                        className={'mrg-bottom-20'}
                                                                    >
                                                                        Add Medical Diagnosis / ICD-11 Codes
                                                                    </ButtonComponent>
                                                                </LinkComponent>
                                                            }
                                                            {
                                                                medicalInterventionDetails?.linked_icd_codes?.length > 0 &&
                                                                <div className="icd-codes-wrapper">
                                                                    <div className="card-styling">
                                                                        <CardComponent size={'sm'}
                                                                                       className={'icd-codes-header'}
                                                                                       title={'Medical Diagnosis/ICD-11 Codes:'}
                                                                                       actions={
                                                                                           <DraftReadonlySwitcherComponent
                                                                                               condition={true}
                                                                                               draft={<>
                                                                                                   {
                                                                                                       (medicalInterventionId && medicalRecordId) &&
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
                                                    <div className={'readonly-wrapper'}>
                                                        <FormControlLabelComponent
                                                            label={'Index of Suspicion'}/>
                                                        <div className={'readonly-text'}>
                                                            {
                                                                medicalInterventionDetails?.assessment.suspicion_index || 'N/A'
                                                            }
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
                                                    <div className={'readonly-wrapper'}>
                                                        <FormControlLabelComponent
                                                            label={'Surgery Procedure Complete'}/>
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
                                                    <div className={'readonly-wrapper'}>
                                                        <FormControlLabelComponent
                                                            label={'Plan'}/>
                                                        <div className={'readonly-text'}>
                                                            {
                                                                medicalInterventionDetails?.plan.plan || 'N/A'
                                                            }
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
                                                    <div className={'readonly-wrapper'}>
                                                        <FormControlLabelComponent
                                                            label={'MD Recommendations'}/>
                                                        <div className={'readonly-text'}>
                                                            {
                                                                medicalInterventionDetails?.plan.md_recommendations || 'N/A'
                                                            }
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
                                                    <div className={'readonly-wrapper'}>
                                                        <FormControlLabelComponent
                                                            label={'Education'}/>
                                                        <div className={'readonly-text'}>
                                                            {
                                                                medicalInterventionDetails?.plan.education || 'N/A'
                                                            }
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
                                                    <div className={'readonly-wrapper'}>
                                                        <FormControlLabelComponent
                                                            label={'Treatment Goals'}/>
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
                                        <div className={"display-flex flex-direction-row-reverse mrg-top-20"}>
                                            <ESignApprovalComponent isSigned={medicalInterventionDetails?.is_signed}
                                                                    isSigning={isSigningInProgress}
                                                                    isLoading={isFormBeingUpdated || formik.isSubmitting}
                                                                    canSign={medicalInterventionDetails?.can_sign}
                                                                    signedAt={medicalInterventionDetails?.signed_on}
                                                                    onSign={() => {
                                                                        handleSign(formik.values, formik);
                                                                    }}/>
                                        </div>
                                    </CardComponent>
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
