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
import TableComponent from "../../../shared/components/table/TableComponent";
import IconButtonComponent from "../../../shared/components/icon-button/IconButtonComponent";
import ModalComponent from "../../../shared/components/modal/ModalComponent";
import {IProgressReportStat} from "../../../shared/models/common.model";
import _ from "lodash";
import ESignApprovalComponent from "../../../shared/components/e-sign-approval/ESignApprovalComponent";
import {getMedicalRecordProgressReportDetails} from "../../../store/actions/chart-notes.action";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";

interface ProgressRecordAdvancedDetailsUpdateScreenProps {

}

const ProgressRecordAdvancedDetailsUpdateScreen = (props: ProgressRecordAdvancedDetailsUpdateScreenProps) => {

    const {medicalRecordId, progressReportId} = useParams();
    const {
        isProgressReportStatListLoading,
        progressReportStatList
    } = useSelector((state: IRootReducerState) => state.staticData);
    const {
        isClientMedicalRecordProgressReportDetailsLoading,
        isClientMedicalRecordProgressReportDetailsLoaded,
        clientMedicalRecordProgressReportDetails
    } = useSelector((state: IRootReducerState) => state.chartNotes);
    const [showProgressStatCommentsModal, setShowProgressStatCommentsModal] = useState<boolean>(false);
    const [selectedProgressStatComments, setSelectedProgressStatComments] = useState<any>(undefined);
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
        },
        {
            title: "Results",
            dataIndex: "results",
            key: "results",
            render: (_: any, item: any) => <Field name={`progress_stats.${item?._id}.result`}>
                {
                    (field: FieldProps) => (
                        <FormikRadioButtonGroupComponent
                            formikField={field}
                            displayWith={(item: any) => item}
                            valueExtractor={(item: any) => item}
                            options={item?.results}/>
                    )}
            </Field>
        },
        {
            title: 'Comments',
            dataIndex: 'comments',
            key: 'comments',
            render: (_: any, item: any) => <Field
                name={`progress_stats.${item?._id}.comments`}
                className="t-form-control">
                {
                    (field: FieldProps) => (
                        <IconButtonComponent
                            color={field.form.values.progress_stats?.[item?._id]?.comments ? "primary" : "inherit"}
                            onClick={() => {
                                setShowProgressStatCommentsModal(true);
                                setSelectedProgressStatComments(item);
                            }}>
                            {
                                field.form.values.progress_stats?.[item?._id]?.comments ? <ImageConfig.ChatIcon/> :
                                    <ImageConfig.CommentAddIcon/>
                            }
                        </IconButtonComponent>
                    )
                }
            </Field>
        }
    ];

    const patchDataToProgressReportForm = useCallback((data: any) => {
        const values = _.cloneDeep(data);
        values.progress_stats = {};
        data.progress_stats.forEach((stat: any) => {
            values.progress_stats[stat?.progress_stat_id] = {
                result: stat?.result,
                comments: stat?.comments,
                commentsTemp: stat?.comments || stat?.commentsTemp
            }
        });
        setUpdateProgressRecordAdvancedInitialValues(values);
    }, []);

    const onSubmit = useCallback((values: any, {setSubmitting, setErrors}: FormikHelpers<any>, cb: any = undefined) => {
        const payload = _.cloneDeep(values);
        payload.progress_stats = [];
        Object.keys(values.progress_stats).forEach((stat_id: any) => {
            payload.progress_stats.push({
                progress_stat_id: stat_id,
                result: values.progress_stats[stat_id]?.result,
                comment: values.progress_stats[stat_id]?.comments,
                commentTemp: values.progress_stats[stat_id]?.commentsTemp
            });
        });
        if (progressReportId) {
            setSubmitting(true);
            CommonService._chartNotes.UpdateProgressReportUnderMedicalRecordAPICall(progressReportId, payload)
                .then((response) => {
                    patchDataToProgressReportForm(response.data);
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    setSubmitting(false);
                    if (cb) {
                        cb();
                    } else {
                        if (medicalRecordId) {
                            navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId));
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
    }, [patchDataToProgressReportForm, navigate, medicalRecordId, progressReportId]);

    useEffect(() => {
        dispatch(setCurrentNavParams("Update Progress Report Details", null, () => {
            medicalRecordId && navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId));
        }));
    }, [medicalRecordId, navigate, dispatch]);

    const handleSign = useCallback((values: any, formik: FormikHelpers<any>) => {
        setIsSigningInProgress(true);
        values['is_signed'] = true;
        onSubmit(values, formik, () => {
            setIsSigningInProgress(false);
        });
    }, [onSubmit]);

    useEffect(() => {
        if (progressReportId) {
            dispatch(getMedicalRecordProgressReportDetails(progressReportId));
        }
    }, [dispatch, progressReportId]);

    useEffect(() => {
        if (clientMedicalRecordProgressReportDetails) {
            patchDataToProgressReportForm(clientMedicalRecordProgressReportDetails);
        }
    }, [patchDataToProgressReportForm, clientMedicalRecordProgressReportDetails]);

    return (
        <div className={'progress-record-advanced-details-update-screen'}>
            <PageHeaderComponent title={"Update Progress Report"}/>
            {
                isClientMedicalRecordProgressReportDetailsLoading && <LoaderComponent/>
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
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        useEffect(() => {
                            formik.validateForm();
                        }, [formik]);
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
                                    <TableComponent data={progressReportStatList}
                                                    loading={isProgressReportStatListLoading}
                                                    columns={ProgressStatsColumns}/>
                                    {
                                        progressReportStatList?.map((stat: IProgressReportStat, index: number) => {
                                            if (showProgressStatCommentsModal && stat._id === selectedProgressStatComments?._id) {
                                                return <ModalComponent
                                                    key={index + stat._id}
                                                    isOpen={showProgressStatCommentsModal}
                                                    title={`${formik.values?.progress_report?.[selectedProgressStatComments._id]?.comments ? "Edit Comments" : "Comments:"}`}
                                                    closeOnBackDropClick={true}
                                                    className={"intervention-comments-modal"}
                                                    modalFooter={<>
                                                        <ButtonComponent variant={"outlined"}
                                                                         onClick={() => {
                                                                             const comment = formik.values?.progress_stats?.[selectedProgressStatComments?._id]?.comments;
                                                                             setShowProgressStatCommentsModal(false);
                                                                             formik.setFieldValue(`progress_stats.${selectedProgressStatComments._id}.commentsTemp`, comment);
                                                                             setSelectedProgressStatComments(undefined);
                                                                         }}>
                                                            Cancel
                                                        </ButtonComponent>&nbsp;
                                                        <ButtonComponent
                                                            onClick={() => {
                                                                const newComment = formik.values?.progress_stats?.[selectedProgressStatComments?._id]?.commentsTemp;
                                                                setShowProgressStatCommentsModal(false);
                                                                formik.setFieldValue(`progress_stats.${selectedProgressStatComments?._id}.comments`, newComment);
                                                                setSelectedProgressStatComments(undefined);
                                                            }}>
                                                            {
                                                                formik.values?.["progress_stats"]?.[selectedProgressStatComments?._id]?.comments ? "Save" : "Add"
                                                            }
                                                        </ButtonComponent>
                                                    </>
                                                    }>
                                                    <Field
                                                        name={`progress_stats.${selectedProgressStatComments?._id}.commentsTemp`}
                                                        className="t-form-control">
                                                        {
                                                            (field: FieldProps) => (
                                                                <FormikTextAreaComponent
                                                                    label={selectedProgressStatComments?.name + " ( Comments ) "}
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
                                                                canSign={true}
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
