import "./ProgressReportViewDetailsComponent.scss";
import {useParams} from "react-router-dom";
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

interface ProgressReportViewDetailsComponentProps {

}

const ProgressReportViewDetailsComponent = (props: ProgressReportViewDetailsComponentProps) => {

    const progressStatsColumn: ITableColumn[] = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render:(_:any,item:any)=>{
                return<>{item?.progress_stats_details?.name}</>
            }
        },
        {
            title: 'Results',
            dataIndex: 'result',
            key: 'result',
        }
    ]

    const {interventionId} = useParams();
    const dispatch = useDispatch();

    const {
        isProgressReportDetailsLoaded,
        isProgressReportDetailsLoading,
        isProgressReportDetailsLoadingFailed,
        progressReportDetails
    } = useSelector((state: IRootReducerState) => state.chartNotes);

    useEffect(() => {
        if (interventionId) {
            dispatch(getProgressReportViewDetails(interventionId));
        }
    }, [dispatch, interventionId]);

    return (
        <div className={'progress-report-view-details-component'}>
            <div className={'progress-report-view-details-header'}>
                <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>}>Edit Progress Report</ButtonComponent>

            </div>
            <>
                {
                    !interventionId && (
                        <StatusCardComponent title={'Intervention Id is missing cannot fetch details'}/>)
                }
            </>
            <>
                {
                    interventionId && <>
                        {
                            isProgressReportDetailsLoading && <LoaderComponent/>
                        }
                        {
                            isProgressReportDetailsLoadingFailed &&
                            <StatusCardComponent title={'Failed to fetch progress report details'}/>
                        }
                        {
                            (isProgressReportDetailsLoaded && progressReportDetails) && <>
                                <div className={'progress-report-view-details-component-header'}>
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
                                                        expandRow={(row: any) => {
                                                            console.log('row',row);
                                                            return <div className={'comment-row'}>
                                                            <div className={'comment-icon'}><ImageConfig.CommentIcon/></div>
                                                                <div>{row?.comments || "N/A"}</div>
                                                            </div>
                                                        }
                                                    }
                                        />
                                    </CardComponent>
                                    <div className={"display-flex flex-direction-row-reverse mrg-top-20"}>
                                    <ESignApprovalComponent isSigned={progressReportDetails?.is_signed} onSign={() => ''}
                                                            signedAt={CommonService.convertDateFormat(progressReportDetails?.created_at)}/>
                                    </div>
                                </div>
                            </>
                        }
                    </>
                }
            </>

        </div>
    );

};

export default ProgressReportViewDetailsComponent;