import "./ClientActivityLogComponent.scss";
import {IClientActivityLog} from "../../../shared/models/client.model";
import React, {useCallback, useEffect, useRef, useState} from "react";
import commonService from "../../../shared/services/common.service";
import ActivityLogTimelineComponent
    from "../../../shared/components/activity-log-timeline/ActivityLogTimelineComponent";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import SearchComponent from "../../../shared/components/search/SearchComponent";
import moment from "moment/moment";
import CardsPaginationComponent from "../../../shared/components/cards-pagination/CardsPaginationComponent";
import DateRangePickerComponentV2
    from "../../../shared/components/form-controls/date-range-pickerV2/DateRangePickerComponentV2";

interface ClientActivityLogComponentProps {
    clientId: string;
}

const clientActivityLogFilterInitialValues = {
    start_date: null,
    end_date: null,
    date_range: [null, null],
    search: ""
}

const ClientActivityLogComponent = (props: ClientActivityLogComponentProps) => {

    const {clientId} = props;
    const [clientsActivityLogs, setClientsActivityLogs] = useState<IClientActivityLog[]>();
    const [clientsActivityLogsLoading, setClientsActivityLogsLoading] = useState<boolean>(false);
    const [clientsActivityLogsLoadingFailed, setClientsActivityLogsLoadingFailed] = useState<boolean>(false);
    const [clientsActivityLogsLoaded, setClientsActivityLogsLoaded] = useState<boolean>(false);
    const [clientActivityLogFilterState, setClientActivityLogFilterState] = useState<any>(clientActivityLogFilterInitialValues);
    const pageNumRef = useRef<number>(0);
    const totalResultsRef = useRef<number>(0);
    const pageSizeRef = useRef<number>(20);

    const getClientActivityLogs = useCallback((clientId: any) => {
        const payload = {...clientActivityLogFilterState, page: pageNumRef.current, limit: pageSizeRef.current}
        setClientsActivityLogsLoaded(false);
        setClientsActivityLogsLoading(true);
        setClientsActivityLogsLoadingFailed(false);
        commonService._client.getClientActivityLogs(clientId, payload)
            .then((res: any) => {
                setClientsActivityLogsLoaded(true);
                setClientsActivityLogsLoading(false);
                setClientsActivityLogsLoadingFailed(false);
                setClientsActivityLogs(res?.data?.docs);
                pageNumRef.current = res?.data?.page;
                pageSizeRef.current = res?.data?.limit;
                totalResultsRef.current = res?.data?.total;
            })
            .catch((err: any) => {
                setClientsActivityLogsLoaded(true);
                setClientsActivityLogsLoading(false);
                setClientsActivityLogsLoadingFailed(true);
                commonService._alert.showToast(err?.error)
            })
    }, [clientActivityLogFilterState]);

    useEffect(() => {
        clientId && getClientActivityLogs(clientId);
    }, [getClientActivityLogs, clientId]);

    const handlePageNumberChange = useCallback((event: unknown, newPage: number) => {
        pageNumRef.current = newPage;
        clientId && getClientActivityLogs(clientId);
    }, [getClientActivityLogs, clientId]);

    return (
        <div className={'client-activity-log-component'}>
            <div className="d-flex ts-justify-content-start pdd-top-5">
                <div className={'ts-col-lg-4 activity-log-search'}>
                    <SearchComponent
                        label={"Search"}
                        placeholder={"Search using activity name"}
                        value={clientActivityLogFilterState.search}
                        onSearchChange={(value) => {
                            setClientActivityLogFilterState({...clientActivityLogFilterState, search: value})
                        }}
                    />&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
                <DateRangePickerComponentV2
                    value={clientActivityLogFilterState.date_range}
                    onDateChange={(value: any) => {
                        setClientActivityLogFilterState((oldState: any) => {
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
                clientsActivityLogsLoading && <div>
                    <LoaderComponent/>
                </div>
            }
            {
                clientsActivityLogsLoadingFailed &&
                <StatusCardComponent title={"Failed to fetch client Activity logs"}/>
            }
            {
                clientsActivityLogsLoaded &&
                <>

                    <ActivityLogTimelineComponent
                        logsData={clientsActivityLogs}
                    />
                    <CardsPaginationComponent page={pageNumRef.current} totalResultsRef={totalResultsRef}
                                              onPageChange={handlePageNumberChange}/>
                </>
            }

        </div>
    );

};

export default ClientActivityLogComponent;
