import "./MedicalRecordProgressReportViewDetailsScreen.scss";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import React, {useCallback, useEffect, useState} from "react";
import {getProgressReportViewDetails} from "../../../store/actions/chart-notes.action";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import TableComponent from "../../../shared/components/table/TableComponent";
import {ITableColumn} from "../../../shared/models/table.model";
import ESignApprovalComponent from "../../../shared/components/e-sign-approval/ESignApprovalComponent";
import {CommonService} from "../../../shared/services";
import {ImageConfig, Misc} from "../../../constants";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import MedicalInterventionLinkedToComponent
    from "../medical-intervention-linked-to/MedicalInterventionLinkedToComponent";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import {getClientMedicalRecord} from "../../../store/actions/client.action";
import moment from "moment-timezone";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import momentTimezone from "moment-timezone";
import MenuDropdownComponent from "../../../shared/components/menu-dropdown/MenuDropdownComponent";
import {ListItemButton} from "@mui/material";
import commonService from "../../../shared/services/common.service";

interface ProgressReportViewDetailsComponentProps {

}

const MedicalRecordProgressReportViewDetailsScreen = (props: ProgressReportViewDetailsComponentProps) => {

    const progressStatsColumn: ITableColumn[] = [
        {
            key: 'name',
            title: 'Name',
            dataIndex: 'name',
            fixed: "left",
            width: 150,
            render: (item: any) => {
                return <>{item?.progress_stats_details?.name}</>
            }
        },
        {
            key: 'result',
            title: 'Results',
            dataIndex: 'result',
            width: 150,
            align: "center",
            render: (item: any) => {
                return <div>{item?.result || 'N/A'}</div>
            }
        },
        {
            key: 'comments',
            title: 'Comments',
            dataIndex: 'comment',
            width: 600,
            render: (item: any) => {
                return <>
                    {item?.comment?.length > 0 ? <div className={'text-align-left'}>{item?.comment}</div> :
                        <div className={'text-align-center'}>N/A</div>
                    }
                </>
            }
        }
    ];

    const {progressReportId, medicalRecordId} = useParams();
    const dispatch = useDispatch();
    // const [module, setModule] = useState<any>('');
    const navigate = useNavigate();
    const {currentUser} = useSelector((state: IRootReducerState) => state.account);
    const {
        clientMedicalRecord,
    } = useSelector((state: IRootReducerState) => state.client);
    const [searchParams] = useSearchParams();
    const [isFullCardOpen, setIsFullCardOpen] = useState<boolean>(false);

    const {
        isProgressReportDetailsLoaded,
        isProgressReportDetailsLoading,
        isProgressReportDetailsLoadingFailed,
        progressReportDetails
    } = useSelector((state: IRootReducerState) => state.chartNotes);

    useEffect(() => {
        if (progressReportId) {
            dispatch(getProgressReportViewDetails(progressReportId));
        }
    }, [dispatch, progressReportId]);

    useEffect(() => {
        if (medicalRecordId) {
            dispatch(getClientMedicalRecord(medicalRecordId));
        }
    }, [medicalRecordId, dispatch]);

    const handlePrint = useCallback(() => {
        const payload = {
            timezone: momentTimezone.tz.guess(),
        }
        CommonService._chartNotes.PrintProgressReportAPICall(progressReportId, payload)
            .then((res: any) => {
                const attachment = {
                    type: 'application/pdf',
                    url: res.data.url,
                    name: 'progress report',
                    key: ''
                };
                CommonService.printAttachment(attachment);
            })
            .catch((err: any) => {
                console.log(err);
            })
    }, [progressReportId])

    useEffect(() => {
        if (medicalRecordId) {
            const referrer: any = searchParams.get("referrer");
            const active_tab: any = searchParams.get("activeTab");
            const module_name: any = searchParams.get("module_name");
            // setModule(module_name);
            dispatch(setCurrentNavParams("Progress Report Details", null, () => {
                if (referrer && referrer !== "undefined" && referrer !== "null") {
                    if (module_name === "client_module") {
                        navigate(referrer);
                    } else {
                        navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId) + '?referrer=' + referrer + '&activeTab=' + active_tab);
                    }
                } else {
                    navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId) + '?activeTab=' + active_tab);
                }
            }));
        }
    }, [searchParams, navigate, dispatch, medicalRecordId]);

    const handleShareProgressReport = useCallback(() => {
        CommonService.onConfirm({
            image: ImageConfig.PopupLottie,
            showLottie: true,
            confirmationTitle: "SHARE WITH CLIENT",
            confirmationDescription: <div className="delete-document">
                <div className={'delete-document-text text-center '}>Are you sure you want to share this
                    report <br/> with the client?
                </div>
            </div>
        }).then(() => {
            if (progressReportId) {
                CommonService._chartNotes.UpdateProgressReportUnderMedicalRecordAPICall(progressReportId, {is_shared: true})
                    .then((response: any) => {
                        dispatch(getProgressReportViewDetails(progressReportId))
                        CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY] || "Report shared successfully", "success");
                    }).catch((error: any) => {
                    CommonService._alert.showToast(error?.error || "Error sharing document", "success");
                })
            }
        })
    }, [dispatch,progressReportId]);

    const handleDeleteProgressReport = useCallback(() => {
        CommonService.onConfirm({
            confirmationTitle: "DELETE REPORT",
            image: ImageConfig.ConfirmationLottie,
            showLottie: true,
            confirmationSubTitle: <div>Are you sure you want to delete this report?<br/>
                This action cannot be undone.
            </div>
        }).then(() => {
            progressReportId && CommonService._chartNotes.DeleteProgressReport(progressReportId)
                .then((response) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    medicalRecordId && navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId) + '?activeTab=attachmentList');
                }).catch((error: any) => {
                    CommonService._alert.showToast(error.error || "Error deleting provider", "error");
                })
        })
    }, [medicalRecordId, navigate, progressReportId]);

    const removeAccess = useCallback((item: any) => {
        const payload = {
            is_shared: false
        }
        CommonService._chartNotes.UpdateProgressReportUnderMedicalRecordAPICall(item?._id, payload)
            .then((response: any) => {
                commonService._alert.showToast("Access removed successfully", "success");
                progressReportId && dispatch(getProgressReportViewDetails(progressReportId));
            })
            .catch((error: any) => {
                CommonService._alert.showToast(error.error || "Error removing access", "error");
            });

    }, [dispatch,progressReportId])

    const handleRemoveAccess = useCallback((item: any) => {
        CommonService.onConfirm({
            image: ImageConfig.PopupLottie,
            showLottie: true,
            confirmationTitle: "REMOVE ACCESS",
            confirmationSubTitle: "Are you sure you want to remove access for this shared document?",
        })
            .then((res: any) => {
                removeAccess(item);
            })
    }, [removeAccess]);


    return (
        <div className={'progress-report-view-details-screen'}>
            <PageHeaderComponent title={"View Therapy Progress Report"} actions={
                <div className="last-updated-status mrg-top-10">
                    <div className="last-updated-status-text">Last updated on:&nbsp;</div>
                    <div
                        className="last-updated-status-bold">
                        {(progressReportDetails?.updated_at ? moment(progressReportDetails.updated_at).tz(moment.tz.guess()).format('DD-MMM-YYYY | hh:mm A z') : 'N/A')}&nbsp;-&nbsp;
                        {progressReportDetails?.last_updated_by_details?.first_name ? progressReportDetails?.last_updated_by_details?.first_name + ' ' + progressReportDetails?.last_updated_by_details?.last_name : ' N/A'}
                    </div>
                </div>}/>
            {
                progressReportDetails?.is_shared &&
                <div className={"medical-record-attachment-remove-access-wrapper"}>
                    <div className={"medical-record-attachment-data-wrapper"}>
                        This file was shared to the client
                        on <b>{progressReportDetails?.shared_at && CommonService.transformTimeStamp(progressReportDetails?.shared_at)}</b>.
                    </div>
                    <LinkComponent
                        onClick={() => {
                            handleRemoveAccess(progressReportDetails);
                        }}

                    >
                        Remove Access
                    </LinkComponent>
                </div>
            }
            {
                <CardComponent color={'primary'}>
                    <div className={'client-name-button-wrapper'}>
                                    <span className={'client-name-wrapper'}>
                                        <span className={'client-name'}>
                                            <span
                                                className={progressReportDetails?.medical_record_details?.client_details?.is_alias_name_set ? "alias-name" : ''}>
                                                {CommonService.generateClientNameFromClientDetails(progressReportDetails?.medical_record_details?.client_details)}
                                                </span>
                                        </span>
                                        <ChipComponent
                                            className={clientMedicalRecord?.status === 'completed' ? "inactive" : "active"}
                                            size={'small'}
                                            label={clientMedicalRecord?.status === 'completed' ? 'Closed - Resolved' : 'Open - Unresolved'}/>
                                    </span>
                        {/*<div className={'display-flex justify-content-end mrg-bottom-20'}>*/}
                        {/*    <ButtonComponent*/}
                        {/*        onClick={handlePrint}*/}
                        {/*        isLoading={isPrintLoading}*/}
                        {/*        disabled={isPrintLoading}*/}
                        {/*        prefixIcon={<ImageConfig.PrintIcon/>}>Print</ButtonComponent>*/}
                        {/*</div>*/}
                        <MenuDropdownComponent className={'billing-details-drop-down-menu'} menuBase={
                            <ButtonComponent variant={'outlined'} fullWidth={true}
                            >
                                Select Action &nbsp;<ImageConfig.SelectDropDownIcon/>
                            </ButtonComponent>
                        } menuOptions={[
                            <ListItemButton onClick={handleShareProgressReport}>
                                Share
                            </ListItemButton>,
                            <ListItemButton onClick={handlePrint}>
                                Print
                            </ListItemButton>,
                            <ListItemButton onClick={handleDeleteProgressReport}>
                                Delete Report
                            </ListItemButton>,

                        ]}
                        />
                    </div>

                    <MedicalInterventionLinkedToComponent label={'Report Linked to:'}
                                                          medicalRecordDetails={clientMedicalRecord}/>
                    <div className={'ts-row'}>
                        <div className={'ts-col-md-4 ts-col-lg'}>
                            <DataLabelValueComponent label={'Date of Onset'}>
                                {progressReportDetails?.medical_record_details?.onset_date ? CommonService.getSystemFormatTimeStamp(progressReportDetails?.medical_record_details?.onset_date) : "N/A"}
                            </DataLabelValueComponent>
                        </div>
                        <div className={'ts-col-md-4 ts-col-lg'}>
                            <DataLabelValueComponent label={'Date of Surgery'}>
                                {progressReportDetails?.medical_record_details?.surgery_date ? CommonService.getSystemFormatTimeStamp(progressReportDetails?.medical_record_details?.surgery_date) : "N/A"}
                            </DataLabelValueComponent>
                        </div>
                        <div className={'ts-col-md-4 ts-col-lg'}>
                            <DataLabelValueComponent label={'Therapist Name'}>
                                {currentUser?.first_name + " " + currentUser?.last_name}
                            </DataLabelValueComponent>
                        </div>
                        <div className={'ts-col-md-4 ts-col-lg'}>
                            <DataLabelValueComponent label={'Physician Name'}>
                                {progressReportDetails?.physician_name || "N/A"}
                            </DataLabelValueComponent>
                        </div>
                    </div>

                    {isFullCardOpen && <>

                        <DataLabelValueComponent label={'Medical Diagnosis/ICD Code:'}>
                            {progressReportDetails?.linked_icd_codes?.length > 0 ?
                                <>
                                    {progressReportDetails?.linked_icd_codes.map((icdCode: any) => (
                                        <div key={icdCode.icd_code} className='d-flex ts-align-items-center mrg-top-5'>
                                            <div className='mrg-right-10'>{icdCode.icd_code}</div>
                                            <div>:</div>
                                            <div className='mrg-left-10'>{icdCode.description}</div>
                                        </div>
                                    ))}
                                </> : <div>N/A</div>
                            }
                        </DataLabelValueComponent>
                    </>
                    }
                    <div className={'ts-row'}>
                        <div className={'ts-col-md-4 ts-col-lg'}/>
                        <div className={'ts-col-md-4 ts-col-lg'}/>
                        <div className={'show-more-less'}
                             onClick={() => setIsFullCardOpen(!isFullCardOpen)}>
                            {isFullCardOpen ? 'Less' : 'More'} Details &nbsp;&nbsp;
                            {isFullCardOpen ? <ImageConfig.UpArrowIcon/> : <ImageConfig.DownArrowIcon/>}
                        </div>
                    </div>
                </CardComponent>
            }
            {
                (medicalRecordId && progressReportId) &&
                <div className={'display-flex justify-content-end mrg-bottom-20'}>
                    <LinkComponent
                        route={CommonService._routeConfig.MedicalRecordProgressReportAdvancedDetailsUpdate(medicalRecordId, progressReportId, 'edit')}>
                        <div className='edit-progress-report-cta'>
                            <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>}>Edit Progress Report</ButtonComponent>
                        </div>
                    </LinkComponent>
                </div>
            }
            <div className={'progress-report-view-details-container'}>
                <>
                    {
                        !progressReportId && (
                            <StatusCardComponent title={'Progress Report Id is missing cannot fetch details'}/>)
                    }
                </>
                <>
                    {
                        progressReportId && <>
                            {
                                isProgressReportDetailsLoading && <LoaderComponent/>
                            }
                            {
                                isProgressReportDetailsLoadingFailed &&
                                <StatusCardComponent title={'Failed to fetch progress report details'}/>
                            }
                            {
                                (isProgressReportDetailsLoaded && progressReportDetails) && <>
                                    <div className={'progress-report-view-details-component__header'}>
                                        <div className={'progress-report-view-details-wrapper'}>
                                            <CardComponent title={'Synopsis'}>
                                                {progressReportDetails?.synopsis ? progressReportDetails?.synopsis.split("\n").map((i: any, key: any) => {
                                                    return <div key={key}>{i}</div>;
                                                }) : "N/A"}
                                            </CardComponent>

                                            <CardComponent title={'Impression'}>
                                                {progressReportDetails?.impression ? progressReportDetails?.impression.split("\n").map((i: any, key: any) => {
                                                    return <div key={key}>{i}</div>;
                                                }) : "N/A"}
                                            </CardComponent>
                                            <CardComponent title={'Plan'}>
                                                {progressReportDetails?.plan ? progressReportDetails?.plan.split("\n").map((i: any, key: any) => {
                                                    return <div key={key}>{i}</div>;
                                                }) : "N/A"}
                                            </CardComponent>
                                        </div>
                                        {
                                            progressReportDetails?.progress_stats?.length > 0 &&

                                            <div className={'progress-stats-table'}>
                                                <CardComponent title={'Progress Overview'}>
                                                    <TableComponent data={progressReportDetails?.progress_stats}
                                                                    className={'progress-report-view-details-table'}
                                                                    columns={progressStatsColumn}
                                                                    hideHeader={true}
                                                                    bordered={true}
                                                    />
                                                </CardComponent>
                                            </div>
                                        }
                                        <div className={'ts-row'}>
                                            <div className={'ts-col-md-4 ts-col-lg-9'}/>
                                            <div className={'ts-col-md-4 ts-col-lg-3'}>
                                                <ESignApprovalComponent isSigned={progressReportDetails?.is_signed}
                                                                        signature_url={progressReportDetails?.signature}
                                                                        signedAt={progressReportDetails?.signed_on}/>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                        </>
                    }
                </>

            </div>
        </div>
    );

};

export default MedicalRecordProgressReportViewDetailsScreen;

