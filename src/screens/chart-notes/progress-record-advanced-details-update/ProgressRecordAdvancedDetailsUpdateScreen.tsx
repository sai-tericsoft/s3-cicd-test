import "./ProgressRecordAdvancedDetailsUpdateScreen.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import {Field, FieldProps, Form, Formik, FormikHelpers, FormikProps} from "formik";
import React, {useCallback, useEffect, useRef, useState} from "react";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {useDispatch, useSelector} from "react-redux";
import {CommonService} from "../../../shared/services";
import {ImageConfig} from "../../../constants";
import {useNavigate, useParams} from "react-router-dom";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import FormikRadioButtonGroupComponent
    from "../../../shared/components/form-controls/formik-radio-button/FormikRadioButtonComponent";
import {ITableColumn} from "../../../shared/models/table.model";
import {IRootReducerState} from "../../../store/reducers";
import IconButtonComponent from "../../../shared/components/icon-button/IconButtonComponent";
import ModalComponent from "../../../shared/components/modal/ModalComponent";
import {IProgressReportStat} from "../../../shared/models/common.model";
import _ from "lodash";
import ESignApprovalComponent from "../../../shared/components/e-sign-approval/ESignApprovalComponent";
import {getMedicalRecordProgressReportDetails,} from "../../../store/actions/chart-notes.action";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import TableV2Component from "../../../shared/components/table-v2/TableV2Component";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import MedicalInterventionLinkedToComponent
    from "../medical-intervention-linked-to/MedicalInterventionLinkedToComponent";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import {getClientMedicalRecord} from "../../../store/actions/client.action";
import DrawerComponent from "../../../shared/components/drawer/DrawerComponent";
import EditProgressReportCardComponent from "../edit-progress-report-card/EditProgressReportCardComponent";
import moment from "moment-timezone";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";

interface ProgressRecordAdvancedDetailsUpdateScreenProps {

}

const ProgressRecordAdvancedDetailsUpdateScreen = (props: ProgressRecordAdvancedDetailsUpdateScreenProps) => {

    const {medicalRecordId, progressReportId, mode} = useParams();

    const {currentUser} = useSelector((state: IRootReducerState) => state.account);
    const [isFullCardOpen, setIsFullCardOpen] = useState<boolean>(false);

    const {
        isProgressReportStatListLoading,
        progressReportStatList
    } = useSelector((state: IRootReducerState) => state.staticData);

    const {
        isClientMedicalRecordProgressReportDetailsLoading,
        isClientMedicalRecordProgressReportDetailsLoaded,
        clientMedicalRecordProgressReportDetails,
    } = useSelector((state: IRootReducerState) => state.chartNotes);

    const {
        addedICD11CodeList,
        isAddedICD11CodeListLoading,
        isAddedICD11CodeListLoaded,
        isAddedICD11CodeListLoadingFailed
    } = useSelector((state: IRootReducerState) => state.chartNotes);
    const {
        clientMedicalRecord,
    } = useSelector((state: IRootReducerState) => state.client);
    const [showProgressStatCommentsModal, setShowProgressStatCommentsModal] = useState<boolean>(false);
    const [selectedProgressStatComments, setSelectedProgressStatComments] = useState<any>(undefined);
    const [isEditProgressReportDrawerOpen, setIsEditProgressReportDrawerOpen] = useState<boolean>(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isSigningInProgress, setIsSigningInProgress] = useState<boolean>(false);
    const formRef = useRef<FormikProps<any>>(null)
    const [updateProgressRecordAdvancedInitialValues, setUpdateProgressRecordAdvancedInitialValues] = useState<any>({
        synopsis: "",
        impression: "",
        plan: "",
        progress_stats: {}
    });

    const ProgressStatsColumns: ITableColumn[] = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            fixed: "left",
            width: 150,
            render:(_: any, item: any)=>{
                return <div className={'name'}>{item?.name}:</div>
            }
        },
        {
            title: "Results",
            dataIndex: "results",
            key: "results",
            fixed: "left",
            width: 300,
            render: (_: any, item: any) => <Field name={`progress_stats.${item?._id}.result`}>
                {
                    (field: FieldProps) => (
                        <FormikRadioButtonGroupComponent
                            formikField={field}
                            keyExtractor={(item: any) => item}
                            displayWith={(item: any) => item}
                            valueExtractor={(item: any) => item}
                            options={item?.results}/>
                    )}
            </Field>
        },
        {
            title: 'Comments',
            dataIndex: 'comment',
            key: 'comment',
            render: (_: any, item: any) => <Field
                name={`progress_stats.${item?._id}.comment`}
                className="t-form-control">
                {
                    (field: FieldProps) => (
                        <div className={'progress-stats-comment'}
                        >
                            {
                                field.form.values.progress_stats?.[item?._id]?.comment ?
                                    <div className={'comment-edit-wrapper'}>
                                        <div>{field.form.values.progress_stats?.[item?._id]?.comment}</div>
                                        <IconButtonComponent
                                            className={'edit-icon'}
                                            onClick={() => {
                                                setShowProgressStatCommentsModal(true);
                                                setSelectedProgressStatComments(item);
                                            }}>
                                            <ImageConfig.EditIcon/>
                                        </IconButtonComponent>
                                    </div> :
                                    <ButtonComponent disabled={!field.form.values.progress_stats?.[item?._id]?.result}
                                                     variant={'text'} onClick={() => {
                                        setShowProgressStatCommentsModal(true);
                                        setSelectedProgressStatComments(item);
                                    }}
                                    >+ Add Comment</ButtonComponent>
                            }
                        </div>
                    )
                }
            </Field>
        }
    ];

    const openEditProgressReportDrawer = useCallback(() => {
        setIsEditProgressReportDrawerOpen(true);
    }, []);

    const closeEditProgressReportDrawer = useCallback(() => {
        setIsEditProgressReportDrawerOpen(false);
    }, []);

    const patchDataToProgressReportForm = useCallback((data: any) => {
        const values = _.cloneDeep(data);
        values.progress_stats = {};
        data.progress_stats?.forEach((stat: any) => {
            values.progress_stats[stat?.progress_stat_id] = {
                result: stat?.result,
                comment: stat?.comment,
                commentTemp: stat?.comment || stat?.commentTemp
            }
        });
        setUpdateProgressRecordAdvancedInitialValues(values);
    }, []);

    const onSubmit = useCallback((values: any, {setSubmitting, setErrors}: FormikHelpers<any>, cb: any = undefined) => {
        const payload = CommonService.removeKeysFromJSON(_.cloneDeep(values), ["provider_details", "medical_record_details"]);
        payload.progress_stats = [];
        Object.keys(values?.progress_stats).forEach((stat_id: any) => {
            payload.progress_stats.push({
                progress_stat_id: stat_id,
                result: values?.progress_stats[stat_id]?.result,
                comment: values?.progress_stats[stat_id]?.comment,
                commentTemp: values?.progress_stats[stat_id]?.commentTemp
            });
        });
        if (progressReportId) {
            setSubmitting(true);
            CommonService._chartNotes.UpdateProgressReportUnderMedicalRecordAPICall(progressReportId, payload)
                .then((response) => {
                    patchDataToProgressReportForm(response?.data);
                    // CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    if (medicalRecordId) {
                        navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId) + '?activeTab=attachmentList');
                    }
                    setSubmitting(false);
                    if (cb) {
                        cb();
                    } else {
                        if (medicalRecordId) {
                            navigate(CommonService._routeConfig.MedicalRecordProgressReportViewDetails(medicalRecordId, progressReportId));
                        }
                    }
                }).catch((error: any) => {
                CommonService.handleErrors(setErrors, error, true);
                setSubmitting(false);
                if (cb) {
                    cb();
                }
            });
        }
    }, [patchDataToProgressReportForm, medicalRecordId, progressReportId, navigate]);

    useEffect(() => {
        dispatch(setCurrentNavParams("Update Progress Report Details", null, () => {
            medicalRecordId && navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId));
        }));
    }, [medicalRecordId, navigate, dispatch]);

    const handleSign = useCallback((values: any, formik: FormikHelpers<any>) => {
        const payload = _.cloneDeep(values);
        setIsSigningInProgress(true);
        payload['is_signed'] = true;
        onSubmit(payload, formik, () => {
            setIsSigningInProgress(false);
        });
    }, [onSubmit]);

    useEffect(() => {
        if (progressReportId) {
            dispatch(getMedicalRecordProgressReportDetails(progressReportId));
        }
    }, [dispatch, progressReportId]);

    useEffect(() => {
        if (medicalRecordId) {
            dispatch(getClientMedicalRecord(medicalRecordId));
        }
    }, [medicalRecordId, dispatch]);

    const handleEditProgressReport = useCallback(() => {
        closeEditProgressReportDrawer();
        if (progressReportId) {
            dispatch(getMedicalRecordProgressReportDetails(progressReportId));
        }
    }, [progressReportId, closeEditProgressReportDrawer, dispatch]);

    useEffect(() => {
        if (clientMedicalRecordProgressReportDetails) {
            patchDataToProgressReportForm(clientMedicalRecordProgressReportDetails);
        }
    }, [patchDataToProgressReportForm, clientMedicalRecordProgressReportDetails]);


    return (
        <div className={'progress-record-advanced-details-update-screen'}>
            <PageHeaderComponent title={mode === 'add' ? "Add Therapy Progress Report" : "Edit Therapy Progress Report"}
                                 actions={
                                     <div className="last-updated-status">
                                         <div className="last-updated-status-text">Last updated on:&nbsp;</div>
                                         <div
                                             className="last-updated-status-bold">
                                             {(clientMedicalRecordProgressReportDetails?.updated_at ? moment(clientMedicalRecordProgressReportDetails.updated_at).tz(moment.tz.guess()).format('DD-MMMM-YYYY | hh:mm A z') : 'N/A')}&nbsp;-&nbsp;
                                             {clientMedicalRecordProgressReportDetails?.last_updated_by_details?.first_name ? clientMedicalRecordProgressReportDetails?.last_updated_by_details?.first_name + ' ' + clientMedicalRecordProgressReportDetails?.last_updated_by_details?.last_name : ' N/A'}
                                         </div>
                                     </div>}/>
            {
                isClientMedicalRecordProgressReportDetailsLoading && <LoaderComponent/>
            }
            {
                (isClientMedicalRecordProgressReportDetailsLoaded && clientMedicalRecordProgressReportDetails) && <>
                    <CardComponent color={'primary'}>
                        <div className={'client-name-button-wrapper'}>
                                    <span className={'client-name-wrapper'}>
                                        <span className={'client-name'}>
                                                {clientMedicalRecordProgressReportDetails?.medical_record_details?.client_details?.first_name || "-"} {clientMedicalRecordProgressReportDetails?.medical_record_details?.client_details?.last_name || "-"}
                                        </span>
                                        <ChipComponent
                                            className={clientMedicalRecordProgressReportDetails?.status==="completed" ? "active" : "draft"}
                                            size={'small'}
                                            label={clientMedicalRecordProgressReportDetails?.status || "-"}/>
                                    </span>
                            <div className="ts-row width-auto">
                                <div className="">
                                    {/*<ButtonComponent className={'mrg-right-10'} onClick={handleICDCodeDrawer}*/}
                                    {/*                 variant={'outlined'}>View ICD-11 Code*/}
                                    {/*    (s)</ButtonComponent>*/}
                                    <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>}
                                                     onClick={openEditProgressReportDrawer}>
                                        Edit Details
                                    </ButtonComponent>
                                </div>
                            </div>
                        </div>
                        <MedicalInterventionLinkedToComponent medicalRecordDetails={clientMedicalRecord}/>
                        <div className={'ts-row'}>
                            <div className={'ts-col-md-4 ts-col-lg'}>
                                <DataLabelValueComponent label={'Date of Onset'}>
                                    {clientMedicalRecordProgressReportDetails?.medical_record_details?.onset_date ? CommonService.getSystemFormatTimeStamp(clientMedicalRecordProgressReportDetails?.medical_record_details?.onset_date) : "N/A"}
                                </DataLabelValueComponent>
                            </div>
                            <div className={'ts-col-md-4 ts-col-lg'}>
                                <DataLabelValueComponent label={'Date of Surgery'}>
                                    {clientMedicalRecordProgressReportDetails?.medical_record_details?.surgery_date ? CommonService.getSystemFormatTimeStamp(clientMedicalRecordProgressReportDetails?.medical_record_details?.surgery_date) : "N/A"}
                                </DataLabelValueComponent>
                            </div>
                            <div className={'ts-col-md-4 ts-col-lg'}>
                                <DataLabelValueComponent label={'Therapist Name'}>
                                    {currentUser?.first_name + " " + currentUser?.last_name}
                                </DataLabelValueComponent>
                            </div>
                            <div className={'ts-col-md-4 ts-col-lg'}>
                                <DataLabelValueComponent label={'Physician Name'}>
                                    {clientMedicalRecordProgressReportDetails?.physician_name || "N/A"}
                                </DataLabelValueComponent>
                            </div>
                        </div>

                        {isFullCardOpen && <>
                            {
                                isAddedICD11CodeListLoading && <LoaderComponent/>
                            }
                            {
                                isAddedICD11CodeListLoadingFailed &&
                                <StatusCardComponent title={'Failed to fetch ICD-11 code list'}/>
                            }
                            {isAddedICD11CodeListLoaded &&
                                <DataLabelValueComponent label={'Medical Diagnosis/ICD-11 Codes:'}>
                                    <>
                                        {addedICD11CodeList.map((icdCode: any) => (
                                            <div key={icdCode.icd_code} className='d-flex ts-align-items-center mrg-top-5'>
                                                <div className='width-5 mrg-right-10'>{icdCode.icd_code}</div>
                                                <div>:</div>
                                                <div className='mrg-left-10'>{icdCode.description}</div>
                                            </div>
                                        ))}
                                    </>
                                </DataLabelValueComponent>

                            }
                        </>
                        }
                        {addedICD11CodeList?.length > 0 && <div className={'ts-row'}>
                            <div className={'ts-col-md-4 ts-col-lg'}/>
                            <div className={'ts-col-md-4 ts-col-lg'}/>
                            <div className={'show-more-less'}
                                 onClick={() => setIsFullCardOpen(!isFullCardOpen)}>
                                {isFullCardOpen ? 'Less' : 'More'} Details &nbsp;&nbsp;
                                {isFullCardOpen ? <ImageConfig.UpArrowIcon/> : <ImageConfig.DownArrowIcon/>}
                            </div>
                        </div>}

                    </CardComponent>
                    <DrawerComponent isOpen={isEditProgressReportDrawerOpen}
                                     showClose={true}
                                     onClose={closeEditProgressReportDrawer}>
                        <EditProgressReportCardComponent onCancel={() => closeEditProgressReportDrawer()}
                                                         onSave={handleEditProgressReport}/>
                    </DrawerComponent>
                </>
            }
            {
                isClientMedicalRecordProgressReportDetailsLoaded &&
                <Formik initialValues={updateProgressRecordAdvancedInitialValues}
                        onSubmit={onSubmit}
                        validateOnChange={false}
                        validateOnBlur={true}
                        enableReinitialize={true}
                        validateOnMount={true}
                        innerRef={formRef}
                >
                    {(formik,) => {
                        const {values} = formik
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        useEffect(() => {
                            // if (values.synopsis || values.impression || values.plan) {
                            if (formRef.current) {
                                formRef.current.setFieldValue('can_sign', true);
                                // }
                            }
                        }, [values]);
                        return (
                            <Form noValidate={true} className={'t-form'}>
                                <div className={'progress-report-form-wrapper'}>
                                    <CardComponent title={'Synopsis'}>
                                        <Field name={'synopsis'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikTextAreaComponent formikField={field}
                                                                             label={''}
                                                                             placeholder={'Please enter your note here...'}
                                                                             required={false}
                                                                             fullWidth={true}/>
                                                )
                                            }
                                        </Field>
                                    </CardComponent>
                                    <CardComponent title={'Impression'}>
                                        <Field name={'impression'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikTextAreaComponent formikField={field}
                                                                             label={''}
                                                                             placeholder={'Please enter your note here...'}
                                                                             required={false}
                                                                             fullWidth={true}/>
                                                )
                                            }
                                        </Field>
                                    </CardComponent>
                                    <CardComponent title={'Plan'}>
                                        <Field name={'plan'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikTextAreaComponent formikField={field}
                                                                             label={''}
                                                                             placeholder={'Please enter your note here...'}
                                                                             required={false}
                                                                             fullWidth={true}/>
                                                )
                                            }
                                        </Field>
                                    </CardComponent>
                                </div>

                                <div className={'progress-stats-table'}>
                                    <CardComponent title={'Progress Overview'}>
                                        <TableV2Component data={progressReportStatList}
                                                          bordered={true}
                                                          hideHeader={true}
                                                          loading={isProgressReportStatListLoading}
                                                          columns={ProgressStatsColumns}
                                                          rowKey={(item: any) => item?._id}
                                        />
                                        {
                                            progressReportStatList?.map((stat: IProgressReportStat, index: number) => {
                                                if (showProgressStatCommentsModal && stat._id === selectedProgressStatComments?._id) {
                                                    return <ModalComponent
                                                        key={stat?._id}
                                                        isOpen={showProgressStatCommentsModal}
                                                        title={`${formik.values?.progress_report?.[selectedProgressStatComments._id]?.comment ? "Edit Comments" : "Comments:"}`}
                                                        closeOnBackDropClick={true}
                                                        className={"intervention-comments-modal"}
                                                        modalFooter={<>
                                                            <ButtonComponent variant={"outlined"}
                                                                             onClick={() => {
                                                                                 const comment = formik.values?.progress_stats?.[selectedProgressStatComments?._id]?.comment;
                                                                                 setShowProgressStatCommentsModal(false);
                                                                                 formik.setFieldValue(`progress_stats.${selectedProgressStatComments._id}.commentTemp`, comment);
                                                                                 setSelectedProgressStatComments(undefined);
                                                                             }}>
                                                                Cancel
                                                            </ButtonComponent>&nbsp;
                                                            <ButtonComponent
                                                                className={'mrg-left-15'}
                                                                onClick={() => {
                                                                    const newComment = formik.values?.progress_stats?.[selectedProgressStatComments?._id]?.commentTemp;
                                                                    setShowProgressStatCommentsModal(false);
                                                                    formik.setFieldValue(`progress_stats.${selectedProgressStatComments?._id}.comment`, newComment);
                                                                    setSelectedProgressStatComments(undefined);
                                                                }}>
                                                                {
                                                                    formik.values?.["progress_stats"]?.[selectedProgressStatComments?._id]?.comment ? "Save" : "Add"
                                                                }
                                                            </ButtonComponent>
                                                        </>
                                                        }>
                                                        <Field
                                                            name={`progress_stats.${selectedProgressStatComments?._id}.commentTemp`}
                                                            className="t-form-control">

                                                            {
                                                                (field: FieldProps) => (
                                                                    <FormikTextAreaComponent
                                                                        label={selectedProgressStatComments?.name}
                                                                        placeholder={"Please enter your comments here..."}
                                                                        formikField={field}
                                                                        size={"small"}
                                                                        autoFocus={true}
                                                                        fullWidth={true}
                                                                    />
                                                                )
                                                            }
                                                        </Field>
                                                    </ModalComponent>
                                                } else {
                                                    return <></>
                                                }
                                            })
                                        }
                                        <div className={"display-flex flex-direction-row-reverse mrg-top-50 mrg-right-25"}>
                                            <ESignApprovalComponent isSigned={false}
                                                                    isSigning={isSigningInProgress}
                                                                    canSign={true}
                                                                    signedAt={formik.values.signed_on}
                                                                    onSign={() => {
                                                                        handleSign(formik.values, formik);
                                                                    }}/>
                                        </div>
                                    </CardComponent>
                                </div>
                                <div className="t-form-actions mrg-bottom-0">
                                    {
                                        medicalRecordId && <>
                                            <LinkComponent
                                                route={CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId)}>
                                                <ButtonComponent
                                                    variant={"outlined"}
                                                    size={'large'}
                                                    id={"progress_report_update_cancel_btn"}
                                                    disabled={formik.isSubmitting}>
                                                    Cancel
                                                </ButtonComponent>
                                            </LinkComponent>
                                            &nbsp;
                                        </>
                                    }
                                    {/*<ButtonComponent*/}
                                    {/*    type={"submit"}*/}
                                    {/*    id={"progress_report_update_save_btn"}*/}
                                    {/*    disabled={formik.isSubmitting}*/}
                                    {/*    isLoading={formik.isSubmitting}>*/}
                                    {/*    Save*/}
                                    {/*</ButtonComponent>*/}
                                </div>
                            </Form>
                        )
                    }}
                </Formik>
            }
        </div>
    );

};

export default ProgressRecordAdvancedDetailsUpdateScreen;
