import "./ClientAppointmentsTableComponent.scss";
import {IClientAppointmentsFilterState} from "../../../shared/models/client.model";
import {ITableColumn} from "../../../shared/models/table.model";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";
import React, {useEffect, useState} from "react";
import {APIConfig, ImageConfig} from "../../../constants";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import {CommonService} from "../../../shared/services";
import ToolTipComponent from "../../../shared/components/tool-tip/ToolTipComponent";
import ChipComponent from "../../../shared/components/chip/ChipComponent";

interface ClientAppointmentsTableComponentProps {
    clientId: string | undefined;
    clientAppointmentListFilterState: IClientAppointmentsFilterState;
    moduleName: string;
}

const ClientAppointmentsTableComponent = (props: ClientAppointmentsTableComponentProps) => {
    const {clientAppointmentListFilterState, moduleName, clientId} = props;
    const [clientAppointmentFilters, setClientAppointmentFilters] = useState<any>();

    useEffect(() => {
        if (clientAppointmentListFilterState) {
            const prePayload: any = {...clientAppointmentListFilterState};
            if (clientAppointmentListFilterState.provider_id) {
                prePayload.provider_id = clientAppointmentListFilterState.provider_id._id;
            } else {
                delete prePayload.provider_id;
            }

            if (clientAppointmentListFilterState.status) {
                prePayload.status = clientAppointmentListFilterState.status;
            } else {
                delete prePayload.status;
            }

            setClientAppointmentFilters(prePayload);
        }
    }, [clientAppointmentListFilterState]);

    const ClientAppointmentListTableColumns: ITableColumn[] = [
        {
            title: "Case Name",
            key: "case_name",
            dataIndex: "case_name",
            width: 250,
            align: "left",
            fixed: "left",
            render: (item: any) => {
                if (item?._id) {
                    return <>
                        {CommonService.generateUseCaseFromCaseDetails(item?.case_details).length > 30 ?
                            <ToolTipComponent
                                tooltip={item?.case_details && CommonService.generateUseCaseFromCaseDetails(item?.case_details)}
                                position={"top"}
                                showArrow={true}
                            >
                                <div className={"ellipses-for-table-data"}>
                                    {item?.case_details && CommonService.generateUseCaseFromCaseDetails(item?.case_details)}
                                </div>
                            </ToolTipComponent> :
                            <>
                                {item?.case_details && CommonService.generateUseCaseFromCaseDetails(item?.case_details)}
                            </>
                        }
                    </>
                }
            }
        },

        {
            title: "Appointment Type",
            key: "appointment_type",
            dataIndex: "appointment_type",
            width: 150,
            align: "center",
            render: (item: any) => {
                return <span>{item?.appointment_type}</span>
            }
        },
        {
            title: "Appointment Date/Time",
            key: "appointment_date",
            dataIndex: "appointmentDate",
            width: 200,
            align: "center",
            render: (item: any) => {
                return <span>
                    {item?.appointment_date ? CommonService.getSystemFormatTimeStamp(item?.appointment_date, true) : "-"}
                </span>
            }
        },

        {
            title: 'Provider',
            key: 'provider',
            dataIndex: 'first_name',
            width: 150,
            align: 'center',
            render: (item: any) => {
                return <>
                    {
                        (item?.provider_details.first_name + ' ' + item?.provider_details?.last_name).length > 20 ?
                            <ToolTipComponent
                                tooltip={(item?.provider_details.first_name + ' ' + item?.provider_details?.last_name)}
                                position={"top"}
                                showArrow={true}
                            >
                                <div className={"ellipses-for-table-data"}>
                                    {item?.provider_details?.first_name} {item?.provider_details?.last_name}
                                </div>
                            </ToolTipComponent> :
                            <>
                                {item?.provider_details?.first_name} {item?.provider_details?.last_name}
                            </>
                    }
                </>
            }
        },

        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 90,
            render: (item: any) => {
                return <ChipComponent label={item?.status}
                                      className={item?.status}
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
            render: (item: any) => {
                if (item?._id) {
                    return <LinkComponent
                        route={CommonService._routeConfig.ClientAppointmentViewDetails(clientId, item?._id)}>
                        View Details
                    </LinkComponent>
                }
            }
        }
    ];

    return (

        <div className={'client-appointment-list-table-component'}>
            <TableWrapperComponent
                id={"client_appointment_list"}
                url={APIConfig.GET_CLIENT_APPOINTMENTS.URL(clientId)}
                method={APIConfig.GET_CLIENT_APPOINTMENTS.METHOD}
                columns={ClientAppointmentListTableColumns}
                extraPayload={clientAppointmentFilters}
                moduleName={moduleName}
                noDataText={'No Appointments To Show'}
                noDataImage={<ImageConfig.NoDataAppointmentsIcon/>}
            />
        </div>
    );
};

export default ClientAppointmentsTableComponent;
