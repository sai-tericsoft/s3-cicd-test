import "./MedicalRecordProgressReportViewDetailsScreen.scss";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {useEffect} from "react";
import {getProgressReportViewDetails} from "../../../store/actions/chart-notes.action";
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

interface ProgressReportViewDetailsComponentProps {

}

const MedicalRecordProgressReportViewDetailsScreen = (props: ProgressReportViewDetailsComponentProps) => {

    const progressStatsColumn: ITableColumn[] = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: ( item: any) => {
                return <>{item?.progress_stats_details?.name}</>
            }
        },
        {
            title: 'Results',
            dataIndex: 'result',
            key: 'result',
        },
        {
            title: 'Comments',
            dataIndex: 'comments',
            key: 'comments',
            render: ( item: any) => {
                return <>{item?.comments || '-'}</>
            }
        }
    ];

    const {progressReportId, medicalRecordId} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
        dispatch(setCurrentNavParams("Progress Report Details", null, () => {
            medicalRecordId && navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId));
        }));
    }, [medicalRecordId, navigate, dispatch]);

    return (
        <div className={'progress-report-view-details-screen'}>
            <PageHeaderComponent title={"Progress Report Details"} actions={<>
                {
                    (medicalRecordId && progressReportId) && <LinkComponent
                        route={CommonService._routeConfig.MedicalRecordProgressReportAdvancedDetailsUpdate(medicalRecordId, progressReportId)}>
                        <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>}>Edit Progress Report</ButtonComponent>
                    </LinkComponent>
                }
            </>}/>
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
                                        <CardComponent title={'Synopsis'}>
                                            {progressReportDetails?.synopsis || "N/A"}
                                        </CardComponent>
                                        <CardComponent title={'Impression'}>
                                            {progressReportDetails?.impression || "N/A"}
                                        </CardComponent>
                                        <CardComponent title={'Plan'}>
                                            {progressReportDetails?.plan || "N/A"}
                                        </CardComponent>
                                        <CardComponent title={'Progress Stats:'}>
                                            <TableComponent data={progressReportDetails?.progress_stats}
                                                            columns={progressStatsColumn}
                                                            showExpandColumn={false}
                                                            rowKey={(item: any, index)=> item._id}
                                            />
                                        </CardComponent>
                                        <div className={"display-flex flex-direction-row-reverse mrg-top-20"}>
                                            <ESignApprovalComponent isSigned={progressReportDetails?.is_signed}
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
