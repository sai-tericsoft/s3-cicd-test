import "./ChartNotesActivityLogsComponent.scss";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import React, {useCallback, useEffect, useRef, useState} from "react";
import commonService from "../../../shared/services/common.service";
import {useNavigate, useParams} from "react-router-dom";
import {IClientActivityLog} from "../../../shared/models/client.model";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import ActivityLogTimelineComponent
    from "../../../shared/components/activity-log-timeline/ActivityLogTimelineComponent";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {CommonService} from "../../../shared/services";
import {useDispatch} from "react-redux";
import SearchComponent from "../../../shared/components/search/SearchComponent";
import moment from "moment";
import CardsPaginationComponent from "../../../shared/components/cards-pagination/CardsPaginationComponent";
import DateRangePickerComponentV2
    from "../../../shared/components/form-controls/date-range-pickerV2/DateRangePickerComponentV2";

interface ChartNotesActivityLogsComponentProps {

}

const chartNotesActivityLogFilterInitialValues = {
    start_date: null,
    end_date: null,
    date_range: [null, null],
    search: ""
}

const ChartNotesActivityLogsComponent = (props: ChartNotesActivityLogsComponentProps) => {
    const {medicalRecordId} = useParams();
    const [medicalRecordActivityLogs, setMedicalRecordActivityLogs] = useState<IClientActivityLog[]>();
    const [medicalRecordActivityLogsLoading, setMedicalRecordActivityLogsLoading] = useState<boolean>();
    const [medicalRecordActivityLogsLoadingFailed, setMedicalRecordActivityLogsLoadingFailed] = useState<boolean>();
    const [medicalRecordActivityLogsLoaded, setMedicalRecordActivityLogsLoaded] = useState<boolean>();
    const [chartNotesActivityLogFilterState, setChartNotesActivityLogFilterState] = useState<any>(chartNotesActivityLogFilterInitialValues);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const pageNumRef = useRef<number>(0);
    const totalResultsRef = useRef<number>(0);
    const pageSizeRef = useRef<number>(20);

    useEffect(() => {
        if (medicalRecordId) {
            dispatch(setCurrentNavParams("Medical Record details", null, () => {
                navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId));
            }));
        }
    }, [navigate, dispatch, medicalRecordId]);

    const getClientActivityLogs = useCallback((medicalRecordId: any) => {
        const payload = {...chartNotesActivityLogFilterState, page: pageNumRef.current, limit: pageSizeRef.current}
        setMedicalRecordActivityLogsLoaded(false);
        setMedicalRecordActivityLogsLoading(true);
        setMedicalRecordActivityLogsLoadingFailed(false);
        commonService._chartNotes.getMedicalRecordActivityLogs(medicalRecordId, payload)
            .then((res: any) => {
                setMedicalRecordActivityLogsLoaded(true);
                setMedicalRecordActivityLogsLoading(false);
                setMedicalRecordActivityLogsLoadingFailed(false);
                setMedicalRecordActivityLogs(res?.data?.docs);
                pageNumRef.current = res?.data?.page;
                pageSizeRef.current = res?.data?.limit;
                totalResultsRef.current = res?.data?.total;
            })
            .catch((err: any) => {
                setMedicalRecordActivityLogsLoaded(true);
                setMedicalRecordActivityLogsLoading(false);
                setMedicalRecordActivityLogsLoadingFailed(true);
                commonService._alert.showToast(err?.error)
            })
    }, [chartNotesActivityLogFilterState]);

    useEffect(() => {
        medicalRecordId && getClientActivityLogs(medicalRecordId);
    }, [getClientActivityLogs, medicalRecordId]);

    const handlePageNumberChange = useCallback((event: unknown, newPage: number) => {
        pageNumRef.current = newPage;
        medicalRecordId && getClientActivityLogs(medicalRecordId);
    }, [getClientActivityLogs, medicalRecordId]);

    return (
        <div className={'chart-notes-activity-logs-component'}>
            <PageHeaderComponent title={"View Activity Log"}/>
            <div className="ts-col-md-8 d-flex ts-justify-content-start pdd-top-5">
                    <SearchComponent
                        label={"Search"}
                        placeholder={"Search using activity name"}
                        value={chartNotesActivityLogFilterState.search}
                        onSearchChange={(value) => {
                            setChartNotesActivityLogFilterState({...chartNotesActivityLogFilterState, search: value})
                        }}
                    />&nbsp;&nbsp;&nbsp;&nbsp;
                {/*<DateRangePickerComponent*/}
                {/*    label={"Select Date Range"}*/}
                {/*    value={chartNotesActivityLogFilterState.date_range}*/}
                {/*    onDateChange={(value: any) => {*/}
                {/*        setChartNotesActivityLogFilterState((oldState: any) => {*/}
                {/*            const newState = {...oldState};*/}
                {/*            if (value) {*/}
                {/*                newState['start_date'] = moment(value[0])?.format('YYYY-MM-DD');*/}
                {/*                newState['end_date'] = moment(value[1])?.format('YYYY-MM-DD');*/}
                {/*                // newState['date_range'] = value;*/}
                {/*            } else {*/}
                {/*                delete newState['date_range'];*/}
                {/*                delete newState['start_date'];*/}
                {/*                delete newState['end_date'];*/}
                {/*            }*/}
                {/*            return newState;*/}
                {/*        })*/}
                {/*    }}*/}
                {/*/>*/}
                <DateRangePickerComponentV2
                    value={chartNotesActivityLogFilterState.date_range}
                    onDateChange={(value: any) => {
                        setChartNotesActivityLogFilterState((oldState: any) => {
                            const newState = {...oldState};
                            if (value) {
                                newState['start_date'] = moment(value[0])?.format('YYYY-MM-DD');
                                newState['end_date'] = moment(value[1])?.format('YYYY-MM-DD');
                                // newState['date_range'] = value;
                            } else {
                                delete newState['date_range'];
                                delete newState['start_date'];
                                delete newState['end_date'];
                            }
                            return newState;
                        })
                    }}
                />

            </div>
            {
                medicalRecordActivityLogsLoading && <div>
                    <LoaderComponent/>
                </div>
            }
            {
                medicalRecordActivityLogsLoadingFailed &&
                <StatusCardComponent title={"Failed to fetch client Activity logs"}/>
            }
            {
                medicalRecordActivityLogsLoaded &&
                <>
                    <ActivityLogTimelineComponent
                        logsData={medicalRecordActivityLogs}
                    />
                    <CardsPaginationComponent page={pageNumRef.current} totalResultsRef={totalResultsRef}
                                              onPageChange={handlePageNumberChange}/>
                </>
            }
        </div>
    );

};

export default ChartNotesActivityLogsComponent;
