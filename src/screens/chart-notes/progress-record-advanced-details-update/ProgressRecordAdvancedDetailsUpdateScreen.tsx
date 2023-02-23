import "./ProgressRecordAdvancedDetailsUpdateScreen.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import React, {useCallback, useEffect, useState} from "react";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {useDispatch, useSelector} from "react-redux";
import {CommonService} from "../../../shared/services";
import {ImageConfig, Misc} from "../../../constants";
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

interface ProgressRecordAdvancedDetailsUpdateScreenProps {

}

const ProgressRecordAdvancedDetailsUpdateScreen = (props: ProgressRecordAdvancedDetailsUpdateScreenProps) => {

    const {medicalRecordId, progressReportId} = useParams();

    const {currentUser} = useSelector((state: IRootReducerState) => state.account);

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
        clientMedicalRecord,
    } = useSelector((state: IRootReducerState) => state.client);
    const [showProgressStatCommentsModal, setShowProgressStatCommentsModal] = useState<boolean>(false);
    const [selectedProgressStatComments, setSelectedProgressStatComments] = useState<any>(undefined);
    const [isEditProgressReportDrawerOpen, setIsEditProgressReportDrawerOpen] = useState<boolean>(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isSigningInProgress, setIsSigningInProgress] = useState<boolean>(false);

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
            width: 150
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
                        <IconButtonComponent
                            color={field.form.values.progress_stats?.[item?._id]?.comment ? "primary" : "inherit"}
                            onClick={() => {
                                setShowProgressStatCommentsModal(true);
                                setSelectedProgressStatComments(item);
                            }}>
                            {
                                field.form.values.progress_stats?.[item?._id]?.comment ? <ImageConfig.ChatIcon/> :
                                    <ImageConfig.CommentAddIcon/>
                            }
                        </IconButtonComponent>
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
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    setSubmitting(false);
                    if (cb) {
                        cb();
                    } else {
                        if (medicalRecordId) {
                            // navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId));
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
    }, [patchDataToProgressReportForm, medicalRecordId, progressReportId]);

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
            <PageHeaderComponent title={"Add Progress Report"}
                                 actions={
                                     <div className="last-updated-status">
                                         <div className="last-updated-status-text">Last Updated On:&nbsp;</div>
                                         <div
                                             className="last-updated-status-bold">
                                             {(clientMedicalRecordProgressReportDetails?.updated_at ? moment(clientMedicalRecordProgressReportDetails.updated_at).tz(moment.tz.guess()).format('DD-MM-YYYY | hh:mm A z') : 'N/A')}&nbsp;-&nbsp;
                                             {clientMedicalRecordProgressReportDetails?.last_updated_by_details?.first_name ? clientMedicalRecordProgressReportDetails?.last_updated_by_details?.first_name + ' ' + clientMedicalRecordProgressReportDetails?.last_updated_by_details?.last_name : ' NA'}
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
                                            className={clientMedicalRecordProgressReportDetails?.status ? "active" : "inactive"}
                                            size={'small'}
                                            label={clientMedicalRecordProgressReportDetails?.status || "-"}/>
                                    </span>
                            <div className="ts-row width-auto">
                                <div className="">
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
                >
                    {(formik) => {
                        return (
                            <Form noValidate={true} className={'t-form'}>
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
                                <CardComponent title={'Progress Stats:'}>
                                    <TableV2Component data={progressReportStatList}
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
                                                                    placeholder={"Enter your comments here..."}
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
                                    <div className={"display-flex flex-direction-row-reverse mrg-top-20"}>
                                        <ESignApprovalComponent isSigned={formik.values.is_signed}
                                                                isSigning={isSigningInProgress}
                                                                canSign={formik.values?.can_sign}
                                                                signedAt={formik.values.signed_on}
                                                                onSign={() => {
                                                                    handleSign(formik.values, formik);
                                                                }}/>
                                    </div>
                                </CardComponent>
                                <div className="t-form-actions">
                                    {
                                        medicalRecordId && <>
                                            <LinkComponent
                                                route={CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId)}>
                                                <ButtonComponent
                                                    variant={"outlined"}
                                                    id={"progress_report_update_cancel_btn"}
                                                    disabled={formik.isSubmitting}>
                                                    Cancel
                                                </ButtonComponent>
                                            </LinkComponent>
                                            &nbsp;
                                        </>
                                    }
                                    <ButtonComponent
                                        type={"submit"}
                                        id={"progress_report_update_save_btn"}
                                        disabled={formik.isSubmitting}
                                        isLoading={formik.isSubmitting}>
                                        Save
                                    </ButtonComponent>
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
