 import "./ClientListTableComponent.scss";
import {ITableColumn} from "../../../shared/models/table.model";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import {CommonService} from "../../../shared/services";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";
import {APIConfig} from "../../../constants";
import {IClientBasicDetails, IClientListFilterState} from "../../../shared/models/client.model";

interface ClientListTableComponentProps {
    clientListFilterState: IClientListFilterState;
    onSort?: (key: string, order: string) => void;
}

const ClientListTableComponent = (props: ClientListTableComponentProps) => {

    const {clientListFilterState, onSort} = props;

    const ClientListTableColumns: ITableColumn[] = [
        {
            title: "Client ID",
            key: "client_id",
            dataIndex: "client_id",
            width: 150,
            fixed: "left",
            render: (item: IClientBasicDetails) => {
                if (item?._id) {
                    return <LinkComponent route={CommonService._routeConfig.ClientDetails(item?._id)}>
                        {item?.client_id}
                    </LinkComponent>
                }
            }

        },
        {
            title: "Client Name",
            key: "name",
            dataIndex: "first_name",
            sortable: true,
            width: 250,
            render: (item: IClientBasicDetails) => {
                return <span>{item?.last_name} {item?.first_name}</span>
            }
        },
        {
            title: "Phone",
            key: "primary_contact_info",
            dataIndex: "primary_contact_info",
            width: 150,
            render: (item: IClientBasicDetails) => {
                return <span>{item?.primary_contact_info?.phone}</span>
            }
        },
        {
            title: "Last Appointment",
            key: "last_appointment_date",
            dataIndex: "lastAppointmentDate",
            width: 200,
            render: (item: IClientBasicDetails) => {
                return <span>
                    {item?.last_appointment_date ? CommonService.getSystemFormatTimeStamp(item?.last_appointment_date) : "-"}
                </span>
            }
        },
        {
            title: "Last Provider",
            key: "last_provider",
            dataIndex: "last_provider",
            width: 200,
            render: (item: IClientBasicDetails) => {
                return <span>
                    {item?.last_provider}
                </span>
            }
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 130,
            render: (item: IClientBasicDetails) => {
                return <ChipComponent label={item?.is_active ? "Active" : "Inactive"}
                                      className={item?.is_active ? "active" : "inactive"}
                />
            }
        },
        {
            title: "",
            dataIndex: "actions",
            key: "actions",
            width: 120,
            fixed: "right",
            render: (item: IClientBasicDetails) => {
                if (item?._id) {
                    return <LinkComponent route={CommonService._routeConfig.ClientDetails(item?._id)}>
                        View Details
                    </LinkComponent>
                }
            }
        }
    ];

    return (
        <div className={'client-list-table-component'}>
            <TableWrapperComponent
                id={"client_list"}
                scroll={"scroll"}
                url={APIConfig.CLIENT_LIST.URL}
                method={APIConfig.CLIENT_LIST.METHOD}
                columns={ClientListTableColumns}
                extraPayload={clientListFilterState}
                onSort={onSort}
            />
        </div>
    );

};

export default ClientListTableComponent;
