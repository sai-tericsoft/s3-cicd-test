import "./MedicalRecordProgressReportViewDetailsScreen.scss";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import React, {useEffect, useState} from "react";
import {getProgressReportViewDetails} from "../../../store/actions/chart-notes.action";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import TableComponent from "../../../shared/components/table/TableComponent";
import {ITableColumn} from "../../../shared/models/table.model";
import ESignApprovalComponent from "../../../shared/components/e-sign-approval/ESignApprovalComponent";
import {CommonService} from "../../../shared/services";
import {ImageConfig} from "../../../constants";
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
            align: "center",
            width: 600,
            render: (item: any) => {
                return <div className={'comment'}>{item?.comment ||
                    <div className={'display-flex ts-justify-content-center'}>N/A</div>}</div>
            }
        }
    ];

    const {progressReportId, medicalRecordId} = useParams();
    const dispatch = useDispatch();
    const [module, setModule] = useState<any>('');
    const navigate = useNavigate();
    const {currentUser} = useSelector((state: IRootReducerState) => state.account);
    const {
        clientMedicalRecord,
    } = useSelector((state: IRootReducerState) => state.client);
    const [searchParams] = useSearchParams();
    const [isFullCardOpen, setIsFullCardOpen] = useState<boolean>(false);
    // const [isPrintLoading, setIsPrintLoading] = useState<boolean>(false);

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

    // const handlePrint = useCallback(() => {
    //     setIsPrintLoading(true);
    //     CommonService._chartNotes.PrintProgressReportAPICall(progressReportId)
    //         .then((res: any) => {
    //             setIsPrintLoading(false);
    //             const attachment = {
    //                 type: 'application/pdf',
    //                 url: res.data.url,
    //                 name: 'progress report',
    //                 key: ''
    //             };
    //             CommonService.printAttachment(attachment);
    //         })
    //         .catch((err: any) => {
    //             setIsPrintLoading(false);
    //             console.log(err);
    //         })
    // }, [progressReportId])

    useEffect(() => {
        if (medicalRecordId) {
            const referrer: any = searchParams.get("referrer");
            const active_tab: any = searchParams.get("activeTab");
            const module_name: any = searchParams.get("module_name");
            setModule(module_name);
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
                <CardComponent color={'primary'}>
                    <div className={'client-name-button-wrapper'}>
                                    <span className={'client-name-wrapper'}>
                                        <span className={'client-name'}>
                                            <span
                                                className={progressReportDetails?.medical_record_details?.client_details?.is_alias_name_set ? "alias-name" : ''}>
                                                {commonService.generateClientNameFromClientDetails(progressReportDetails?.medical_record_details?.client_details)}
                                                </span>
                                        </span>
                                        <ChipComponent
                                            className={clientMedicalRecord?.status === 'completed' ? "inactive" : "active"}
                                            size={'small'}
                                            label={clientMedicalRecord?.status === 'completed' ? 'Closed - Resolved' : 'Open - Unresolved'}/>
                                    </span>
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

                        <DataLabelValueComponent label={'Medical Diagnosis/ICD Codes:'}>
                            {progressReportDetails?.linked_icd_codes?.length > 0 ?
                                <>
                                    {progressReportDetails?.linked_icd_codes.map((icdCode: any) => (
                                        <div key={icdCode.icd_code} className='d-flex ts-align-items-center mrg-top-5'>
                                            <div className='width-5 mrg-right-10'>{icdCode.icd_code}</div>
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
                (medicalRecordId && progressReportId && module === null) &&
                <div className={'display-flex justify-content-end mrg-bottom-20'}>
                    {/*<ButtonComponent*/}
                    {/*    variant={'outlined'}*/}
                    {/*    onClick={handlePrint}*/}
                    {/*    isLoading={isPrintLoading}*/}
                    {/*    disabled={isPrintLoading}*/}
                    {/*    prefixIcon={<ImageConfig.PrintIcon/>}>Print</ButtonComponent>*/}
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
                                            <div className={'ts-col-md-4 ts-col-lg-8'}/>
                                            <div className={'ts-col-md-4 ts-col-lg-4'}>
                                                <ESignApprovalComponent isSigned={progressReportDetails?.is_signed}
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

