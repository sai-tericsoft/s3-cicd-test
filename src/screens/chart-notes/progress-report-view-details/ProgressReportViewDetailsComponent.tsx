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

interface ProgressReportViewDetailsComponentProps {

}

const ProgressReportViewDetailsComponent = (props: ProgressReportViewDetailsComponentProps) => {

    const progressStatsColumn:ITableColumn[]=[
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
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

    useEffect(()=>{
        if(interventionId){
            dispatch(getProgressReportViewDetails(interventionId));
        }
    },[dispatch, interventionId]);

    return (
        <div className={'progress-report-view-details-component'}>
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
                            (isProgressReportDetailsLoaded && progressReportDetails)&& <>
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
                                        <TableComponent data={progressReportDetails?.progress_stats} columns={progressStatsColumn}/>
                                    </CardComponent>
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