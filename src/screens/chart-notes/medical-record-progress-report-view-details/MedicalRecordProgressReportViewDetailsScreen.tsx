import "./MedicalRecordProgressReportViewDetailsScreen.scss";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import React, {useEffect, useState} from "react";
import {getAllAddedICD11Code, getProgressReportViewDetails} from "../../../store/actions/chart-notes.action";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import TableComponent from "../../../shared/components/table/TableComponent";
import {ITableColumn} from "../../../shared/models/table.model";
import ESignApprovalComponent from "../../../shared/components/e-sign-approval/ESignApprovalComponent";
import {CommonService} from "../../../shared/services";
import {ImageConfig} from "../../../constants";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import MedicalInterventionLinkedToComponent
    from "../medical-intervention-linked-to/MedicalInterventionLinkedToComponent";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import {getClientMedicalRecord} from "../../../store/actions/client.action";
import moment from "moment-timezone";

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
                return <div>{item?.result || '-'}</div>
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
                <div className={'display-flex ts-justify-content-center'}>-</div>}</div>
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

    const {
        isProgressReportDetailsLoaded,
        isProgressReportDetailsLoading,
        isProgressReportDetailsLoadingFailed,
        progressReportDetails
    } = useSelector((state: IRootReducerState) => state.chartNotes);

    const {
        addedICD11CodeList,
        isAddedICD11CodeListLoading,
        isAddedICD11CodeListLoaded,
        isAddedICD11CodeListLoadingFailed
    } = useSelector((state: IRootReducerState) => state.chartNotes);

    useEffect(() => {
        if (medicalRecordId) {
            dispatch(getAllAddedICD11Code(medicalRecordId))
        }
    }, [dispatch, medicalRecordId]);

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

    useEffect(() => {
        if (medicalRecordId) {
            const referrer: any = searchParams.get("referrer");
            const module_name: any = searchParams.get("module_name");
            setModule(module_name);
            dispatch(setCurrentNavParams("Progress Report Details", null, () => {
                if (referrer && referrer !== "undefined" && referrer !== "null") {
                    if (module_name === "client_module") {
                        navigate(referrer);
                    } else {
                        navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId) + '?referrer=' + referrer);
                    }
                } else {
                    navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId));
                }
            }));
        }
    }, [searchParams, navigate, dispatch, medicalRecordId]);


    return (
        <div className={'progress-report-view-details-screen'}>
            <PageHeaderComponent title={"View Progress Report"} actions={
                <div className="last-updated-status">
                    <div className="last-updated-status-text">Last Updated On:&nbsp;</div>
                    <div
                        className="last-updated-status-bold">
                        {(progressReportDetails?.updated_at ? moment(progressReportDetails.updated_at).tz(moment.tz.guess()).format('DD-MM-YYYY | hh:mm A z') : 'N/A')}&nbsp;-&nbsp;
                        {progressReportDetails?.last_updated_by_details?.first_name ? progressReportDetails?.last_updated_by_details?.first_name + ' ' + progressReportDetails?.last_updated_by_details?.last_name : ' NA'}
                    </div>
                </div>}/>
            {
                <CardComponent color={'primary'}>
                    <div className={'client-name-button-wrapper'}>
                                    <span className={'client-name-wrapper'}>
                                        <span className={'client-name'}>
                                                {progressReportDetails?.medical_record_details?.client_details?.first_name || "-"} {progressReportDetails?.medical_record_details?.client_details?.last_name || "-"}
                                        </span>
                                        <ChipComponent
                                            className={progressReportDetails?.status ? "active" : "inactive"}
                                            size={'small'}
                                            label={progressReportDetails?.status || "-"}/>
                                    </span>
                        {/*<div className="ts-row width-auto">*/}
                        {/*    <div className="">*/}
                        {/*        <ButtonComponent className={'mrg-right-10'} onClick={handleICDCodeDrawer}*/}
                        {/*                         variant={'outlined'}>View ICD-11 Code*/}
                        {/*            (s)</ButtonComponent>*/}

                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                    <MedicalInterventionLinkedToComponent medicalRecordDetails={clientMedicalRecord}/>
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
                        {
                            isAddedICD11CodeListLoading && <LoaderComponent/>
                        }
                        {
                            isAddedICD11CodeListLoadingFailed &&
                            <StatusCardComponent title={'Failed to fetch ICD-11 code list'}/>
                        }
                        {isAddedICD11CodeListLoaded &&
                        <DataLabelValueComponent label={'ICD-11 Code(s)'}>
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
                    {addedICD11CodeList.length > 0 && <div className={'ts-row'}>
                        <div className={'ts-col-md-4 ts-col-lg'}/>
                        <div className={'ts-col-md-4 ts-col-lg'}/>
                        <div className={'show-more-less'}
                             onClick={() => setIsFullCardOpen(!isFullCardOpen)}>
                            {isFullCardOpen ? 'Less' : 'More'} Details &nbsp;&nbsp;
                            {isFullCardOpen ? <ImageConfig.UpArrowIcon/> : <ImageConfig.DownArrowIcon/>}
                        </div>
                    </div>}
                </CardComponent>
            }
            {
                (medicalRecordId && progressReportId && module === null) && <LinkComponent
                    route={CommonService._routeConfig.MedicalRecordProgressReportAdvancedDetailsUpdate(medicalRecordId, progressReportId, 'edit')}>
                    <div className={'display-flex flex-direction-row-reverse mrg-bottom-20'}>
                        <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>}>Edit Progress Report</ButtonComponent>
                    </div>
                </LinkComponent>
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
                                        {progressReportDetails?.synopsis &&
                                        <CardComponent title={'Synopsis'}>
                                            {progressReportDetails?.synopsis.split("\n").map((i: any, key: any) => {
                                                return <div key={key}>{i}</div>;
                                            }) || "N/A"}
                                        </CardComponent>
                                        }
                                        {progressReportDetails?.impression && <CardComponent title={'Impression'}>
                                            {progressReportDetails?.impression.split("\n").map((i: any, key: any) => {
                                                return <div key={key}>{i}</div>;
                                            }) || "N/A"}
                                        </CardComponent>}
                                        {progressReportDetails?.plan && <CardComponent title={'Plan'}>
                                            {progressReportDetails?.plan.split("\n").map((i: any, key: any) => {
                                                return <div key={key}>{i}</div>;
                                            }) || "N/A"}
                                        </CardComponent>}
                                        {
                                            progressReportDetails?.progress_stats?.length > 0 &&

                                            <div className={'progress-stats-table'}>
                                                <CardComponent title={'Progress Overview:'}>
                                                    <TableComponent data={progressReportDetails?.progress_stats}
                                                                    className={'progress-report-view-details-table'}
                                                                    columns={progressStatsColumn}
                                                                    hideHeader={true}
                                                                    bordered={true}
                                                    />
                                                </CardComponent>
                                            </div>
                                        }
                                        <div className={"display-flex flex-direction-row-reverse mrg-top-20"}>
                                            <ESignApprovalComponent isSigned={true}
                                                                    signedAt={CommonService.convertDateFormat(progressReportDetails?.created_at)}/>
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

