import "./ClientListTableComponent.scss";
import {ITableColumn} from "../../../shared/models/table.model";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import {CommonService} from "../../../shared/services";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";
import {APIConfig, ImageConfig} from "../../../constants";
import {IClientBasicDetails, IClientListFilterState} from "../../../shared/models/client.model";
import React from "react";

interface ClientListTableComponentProps {
    moduleName: string;
    clientListFilterState: IClientListFilterState;
    onSort?: (key: string, order: string) => void;
    refreshToken?: string;
}

const ClientListTableComponent = (props: ClientListTableComponentProps) => {

    const {clientListFilterState, moduleName, onSort, refreshToken} = props;

    const ClientListTableColumns: ITableColumn[] = [
        {
            title: "Client ID",
            key: "client_id",
            dataIndex: "client_id",
            width: 160,
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
            key: "last_name",
            dataIndex: "first_name",
            sortable: true,
            width: 150,
            render: (item: IClientBasicDetails) => {
                return <span>{CommonService.extractName(item)}</span>
            }
        },
        {
            title: "Phone",
            key: "primary_contact_info",
            dataIndex: "primary_contact_info",
            width: 150,
            align: "center",
            render: (item: IClientBasicDetails) => {
                return <span>{CommonService.formatPhoneNumber(item?.primary_contact_info?.phone || '-')}</span>
            }
        },
        {
            title: "Last Appointment",
            key: "last_appointment_date",
            dataIndex: "lastAppointmentDate",
            width: 200,
            align: "center",
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
            align: "center",
            width: 140,
            render: (item: IClientBasicDetails) => {
                return <span>
                    {CommonService.capitalizeFirstLetter(item?.last_provider) || '-'}
                </span>
            }
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "center",
            width: 140,
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
            align: "center",
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
                url={APIConfig.CLIENT_LIST.URL}
                method={APIConfig.CLIENT_LIST.METHOD}
                columns={ClientListTableColumns}
                noDataText={ (<div className={'no-client-text-wrapper'}>
                    <div><img src={ImageConfig.Search} alt="client-search"/></div>
                    <div className={'no-client-heading'}>No Results Found</div>
                    <div className={'no-client-description'}>
                        Oops! It seems like there are no clients available for the name you have
                        searched.<br/>
                    </div>
                </div>)}
                refreshToken={refreshToken}
                extraPayload={clientListFilterState}
                onSort={onSort}
                moduleName={moduleName}
            />
        </div>
    );

};

export default ClientListTableComponent;
