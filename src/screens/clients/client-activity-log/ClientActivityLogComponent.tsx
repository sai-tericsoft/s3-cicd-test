import "./ClientActivityLogComponent.scss";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";
import {APIConfig} from "../../../constants";
import {CommonService} from "../../../shared/services";
import {ITableColumn} from "../../../shared/models/table.model";
import {IClientActivityLog} from "../../../shared/models/client.model";

interface ClientActivityLogComponentProps {
    clientId: string;
}

const ClientActivityLogComponent = (props: ClientActivityLogComponentProps) => {

    const {clientId} = props;
    const ClientActivityLogColumns: ITableColumn[] = [
        {
            key: 'activity',
            title: 'Activity',
            width: '600',
            fixed: "left",
            render: (item: IClientActivityLog) => {
                return <span className={'module-field-name'}>
                    {item?.module_name} &gt; {item?.field_name}
                </span>
            }
        },
        {
            key: 'staff',
            title: 'Staff',
            width: "150",
            align:'center',
            render: (item: IClientActivityLog) => {
                return <>{CommonService.capitalizeFirstLetter(item?.updated_by?.name)}</>
            }
        },
        {
            key: 'date_time',
            title: 'Date/Time Stamp',
            width: "200",
            fixed: "right",
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