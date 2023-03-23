import "./ClientAppointmentsTableComponent.scss";
import {IClientAppointmentsFilterState} from "../../../shared/models/client.model";
import {ITableColumn} from "../../../shared/models/table.model";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";
import {APIConfig} from "../../../constants";
import React from "react";

interface ClientAppointmentsTableComponentProps {
    clientAppointmentListFilterState: IClientAppointmentsFilterState;
    moduleName: string;
}

const ClientAppointmentsTableComponent = (props: ClientAppointmentsTableComponentProps) => {
    const {clientAppointmentListFilterState, moduleName} = props;

    const ClientAppointmentListTableColumns: ITableColumn[] = [
        // {
        //     title: "Client ID",
        //     key: "client_id",
        //     dataIndex: "client_id",
        //     width: 150,
        //     align: "center",
        //     fixed: "left",
        //     render: (item: IClientBasicDetails) => {
        //         if (item?._id) {
        //             return  <div className={'medical-record-injury-details'}>
        //                 {medicalRecordDetails?.created_at && CommonService.transformTimeStamp(medicalRecordDetails?.created_at)}{" "}
        //                 {"-"} {medicalRecordDetails?.injury_details.map((injury: any, index: number) => {
        //                 return <>{injury.body_part_details.name} {injury.body_side ? `( ${injury.body_side} )` : ''} {index !== medicalRecordDetails?.injury_details.length - 1 ? <> | </> : ""}</>
        //             })}
        //             </div>
        //         }
        //     }
        // },
        // {
        //     title: "Client Name",
        //     key: "first_name",
        //     dataIndex: "first_name",
        //     sortable: true,
        //     width: 250,
        //     render: (item: IClientBasicDetails) => {
        //         return <span>{item?.last_name} {item?.first_name}</span>
        //     }
        // },
        // {
        //     title: "Phone",
        //     key: "primary_contact_info",
        //     dataIndex: "primary_contact_info",
        //     width: 150,
        //     align: "center",
        //     render: (item: IClientBasicDetails) => {
        //         return <span>{item?.primary_contact_info?.phone}</span>
        //     }
        // },
        // {
        //     title: "Last Appointment",
        //     key: "last_appointment_date",
        //     dataIndex: "lastAppointmentDate",
        //     width: 200,
        //     align: "center",
        //     render: (item: IClientBasicDetails) => {
        //         return <span>
        //             {item?.last_appointment_date ? CommonService.getSystemFormatTimeStamp(item?.last_appointment_date) : "-"}
        //         </span>
        //     }
        // },
        // {
        //     title: "Last Provider",
        //     key: "last_provider",
        //     dataIndex: "last_provider",
        //     align: "center",
        //     width: 200,
        //     render: (item: IClientBasicDetails) => {
        //         return <span>
        //             {item?.last_provider}
        //         </span>
        //     }
        // },
        // {
        //     title: "Status",
        //     dataIndex: "status",
        //     key: "status",
        //     align: "center",
        //     width: 130,
        //     render: (item: IClientBasicDetails) => {
        //         return <ChipComponent label={item?.is_active ? "Active" : "Inactive"}
        //                               className={item?.is_active ? "active" : "inactive"}
        //         />
        //     }
        // },
        // {
        //     title: "",
        //     dataIndex: "actions",
        //     key: "actions",
        //     width: 120,
        //     fixed: "right",
        //     align: "center",
        //     render: (item: IClientBasicDetails) => {
        //         if (item?._id) {
        //             return <LinkComponent route={CommonService._routeConfig.ClientDetails(item?._id)}>
        //                 View Details
        //             </LinkComponent>
        //         }
        //     }
        // }
    ];

    return (
        <div className={'client-list-table-component'}>
            <TableWrapperComponent
                id={"client_list"}
                url={APIConfig.CLIENT_LIST.URL}
                method={APIConfig.CLIENT_LIST.METHOD}
                columns={ClientAppointmentListTableColumns}
                extraPayload={clientAppointmentListFilterState}
                moduleName={moduleName}
            />
        </div>
    );
};

export default ClientAppointmentsTableComponent;