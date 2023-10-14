import "./ClientActivityLogComponent.scss";
import {IClientActivityLog} from "../../../shared/models/client.model";
import React, {useCallback, useEffect, useState} from "react";
import commonService from "../../../shared/services/common.service";
import ActivityLogTimelineComponent
    from "../../../shared/components/activity-log-timeline/ActivityLogTimelineComponent";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";

interface ClientActivityLogComponentProps {
    clientId: string;
}

const ClientActivityLogComponent = (props: ClientActivityLogComponentProps) => {

    const {clientId} = props;
    const [clientsActivityLogs, setClientsActivityLogs] = useState<IClientActivityLog[]>();
    const [clientsActivityLogsLoading, setClientsActivityLogsLoading] = useState<boolean>(false);
    const [clientsActivityLogsLoadingFailed, setClientsActivityLogsLoadingFailed] = useState<boolean>(false);
    const [clientsActivityLogsLoaded, setClientsActivityLogsLoaded] = useState<boolean>(false);

    const getClientActivityLogs = useCallback((clientId:any) => {
        const payload = {}
        setClientsActivityLogsLoaded(false);
        setClientsActivityLogsLoading(true);
        setClientsActivityLogsLoadingFailed(false);
        commonService._client.getClientActivityLogs(clientId, payload)
            .then((res: any) => {
                setClientsActivityLogsLoaded(true);
                setClientsActivityLogsLoading(false);
                setClientsActivityLogsLoadingFailed(false);
                setClientsActivityLogs(res?.data?.docs);
                console.log(res);
            })
            .catch((err: any) => {
                setClientsActivityLogsLoaded(true);
                setClientsActivityLogsLoading(false);
                setClientsActivityLogsLoadingFailed(true);
                commonService._alert.showToast(err?.error)
            })
    }, []);

    useEffect(() => {
        clientId && getClientActivityLogs(clientId);
    }, [getClientActivityLogs, clientId]);

    return (
        <div className={'client-activity-log-component'}>
            {
                clientsActivityLogsLoading && <div>
                    <LoaderComponent/>
                </div>
            }
            {
                clientsActivityLogsLoadingFailed &&  <StatusCardComponent title={"Failed to fetch client Activity logs"}/>
            }
            {
                clientsActivityLogsLoaded &&
                (!clientsActivityLogs || clientsActivityLogs?.length === 0 ) ?
                    <StatusCardComponent title={"No Activity logs found"}/> :
                <ActivityLogTimelineComponent
                    logsData={clientsActivityLogs}
                />
            }

        </div>
    );

};

export default ClientActivityLogComponent;
