import "./ClientActivityLogComponent.scss";
import TableWrapperComponent from "../../../../shared/components/table-wrapper/TableWrapperComponent";
import {APIConfig} from "../../../../constants";
import {CommonService} from "../../../../shared/services";
import {ITableColumn} from "../../../../shared/models/table.model";

interface ClientActivityLogComponentProps {

}

export interface IClientActivityLog {
    _id: string;
    client_id: string;
    module_name: string;
    field_name: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
}


const ClientActivityLogComponent = (props: ClientActivityLogComponentProps) => {

    const ClientActivityLogColumns: ITableColumn[] = [
        {
            key: 'activity',
            title: 'Activity',
            width: '60%',
            render: (item: IClientActivityLog) => {
                return <span>
                    {item.module_name} &gt; {item.field_name}
                </span>
            }
        },
        {
            key: 'staff',
            title: 'Staff',
            width: "25%",
            render: (item: IClientActivityLog) => {
                return <>{item.updated_by}</>
            }
        },
        {
            key: 'date_time',
            title: 'Date/Time Stamp',
            width: "15%",
            render: (item: IClientActivityLog) => {
                return <>
                    {CommonService.transformTimeStamp(item.updated_at)}
                </>
            }
        }
    ]
    return (
        <div className={'client-activity-log-component'}>
            <TableWrapperComponent
                url={APIConfig.CLIENT_ACTIVITY_LOG.URL("6388a3d1e6bdcac0ca1942a7")}
                method={APIConfig.CLIENT_ACTIVITY_LOG.METHOD}
                isPaginated={true}
                columns={ClientActivityLogColumns}/>
        </div>
    );

};

export default ClientActivityLogComponent;