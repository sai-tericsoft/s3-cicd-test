import "./ClientActivityLogComponent.scss";
import TableWrapperComponent from "../../../../shared/components/table-wrapper/TableWrapperComponent";
import {APIConfig} from "../../../../constants";
import {CommonService} from "../../../../shared/services";
import {ITableColumn} from "../../../../shared/models/table.model";
import {IClientActivityLog} from "../../../../shared/models/client.model";

interface ClientActivityLogComponentProps {
    clientId: string;
}

const ClientActivityLogComponent = (props: ClientActivityLogComponentProps) => {

    const {clientId} = props;
    const ClientActivityLogColumns: ITableColumn[] = [
        {
            key: 'activity',
            title: 'Activity',
            width: '50%',
            render: (item: IClientActivityLog) => {
                return <span>
                    {item?.module_name} &gt; {item?.field_name}
                </span>
            }
        },
        {
            key: 'staff',
            title: 'Staff',
            width: "20%",
            render: (item: IClientActivityLog) => {
                return <>{item?.updated_by?.name}</>
            }
        },
        {
            key: 'date_time',
            title: 'Date/Time Stamp',
            width: "20%",
            render: (item: IClientActivityLog) => {
                return <>
                    {CommonService.transformTimeStamp(item?.updated_at)}
                </>
            }
        }
    ]

    return (
        <div className={'client-activity-log-component'}>
            <TableWrapperComponent
                url={APIConfig.CLIENT_ACTIVITY_LOG.URL(clientId)}
                method={APIConfig.CLIENT_ACTIVITY_LOG.METHOD}
                isPaginated={true}
                columns={ClientActivityLogColumns}/>
        </div>
    );

};

export default ClientActivityLogComponent;