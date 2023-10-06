import "./ClientActivityLogComponent.scss";
import {IClientActivityLog} from "../../../shared/models/client.model";
import {useCallback, useEffect, useState} from "react";
import commonService from "../../../shared/services/common.service";
import ActivityLogTimelineComponent
    from "../../../shared/components/activity-log-timeline/ActivityLogTimelineComponent";

interface ClientActivityLogComponentProps {
    clientId: string;
}

const ClientActivityLogComponent = (props: ClientActivityLogComponentProps) => {

    const {clientId} = props;
    const [clientsActivityLogs, setClientsActivityLogs] = useState<IClientActivityLog[]>();
    const [clientsActivityLogsLoading, setClientsActivityLogsLoading] = useState<boolean>();
    const [clientsActivityLogsLoadingFailed, setClientsActivityLogsLoadingFailed] = useState<boolean>();
    const [clientsActivityLogsLoaded, setClientsActivityLogsLoaded] = useState<boolean>();

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
                clientsActivityLogsLoading && <div className={'loading'}>Loading...</div>
            }
            {
                clientsActivityLogsLoadingFailed && <div className={'loading'}>Loading Failed</div>
            }
            {
                clientsActivityLogsLoaded && <ActivityLogTimelineComponent
                    logsData={clientsActivityLogs}
                />
            }

        </div>
    );

};

export default ClientActivityLogComponent;
