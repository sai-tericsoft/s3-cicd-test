import "./AppointmentListComponent.scss";
import {ITableColumn} from "../../../shared/models/table.model";
import React, {useMemo, useState} from "react";
import {CommonService} from "../../../shared/services";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";
import {APIConfig} from "../../../constants";
import DrawerComponent from "../../../shared/components/drawer/DrawerComponent";
import AppointmentDetailsComponent from "../../../shared/components/appointment-details/AppointmentDetailsComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import LinkComponent from "../../../shared/components/link/LinkComponent";

interface AppointmentListComponentProps {

}

const AppointmentListComponent = (props: AppointmentListComponentProps) => {

    const [openedAppointmentDetails, setOpenedAppointmentDetails] = useState<any | null>(null);
    const [refreshToken, setRefreshToken] = useState('');


    const appointmentListColumns: ITableColumn[] = useMemo<ITableColumn[]>(() => [
        {
            title: "Time",
            key: "time",
            dataIndex: "time",
            width: 120,
            render: (item: any) => {
                return CommonService.getHoursAndMinutesFromMinutes(item.start_time)
            }
        },
        {
            title: "Client Name",
            key: "first_name",
            dataIndex: "first_name",
            // sortable: true,
            width: 120,
            render: (item: any) => {
                return <>{CommonService.extractName(item?.client_details)}</>
            }

        },
        {
            title: "Phone Number",
            key: "primary_contact_info",
            dataIndex: "primary_contact_info",
            width: 150,
            align: 'center',
            render: (item: any) => {
                return <span>{item?.client_details?.phone ? CommonService.formatPhoneNumber(item?.client_details?.phone) : ''}</span>
            }
        },
        {
            title: "Service",
            key: "service",
            dataIndex: "service",
            width: 150,
            align: 'center',
            render: (item: any) => {
                return <span>
                    {item?.service_name}
                </span>
            }
        },
        {
            title: "Provider",
            key: "provider",
            dataIndex: "provider",
            align: 'center',
            width: 140,
            render: (item: any) => {
                return <span>
                    {CommonService.capitalizeFirstLetter(item?.provider_details?.first_name) + ' ' + CommonService.capitalizeFirstLetter(item?.provider_details?.last_name)}
                </span>
            }
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: 'center',
            width: 100,
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
            align:'center',
            // fixed: "right",
            render: (item: any) => {
                if (item?.status === 'upcoming') {
                    return <LinkComponent
                        onClick={() => CommonService.ComingSoon()}
                        // route={CommonService._routeConfig.UpdateMedicalIntervention(item?.medical_record_id, item?._id)}
                    >
                        <ButtonComponent>Start Appointment</ButtonComponent></LinkComponent>
                } else {
                    if (item?._id) {
                        return <div className={'link-component'} onClick={setOpenedAppointmentDetails.bind(null, item)}>
                            View Details
                        </div>
                    }
                }
            }
        }
    ], []);

    return (
        <div className={'appointment-list-component'}>
            <CardComponent>
                <div className={'appointment-list-heading'}>
                    Today’s Appointments
                </div>
                <div className={'appointment-list-wrapper'}>
                    <TableWrapperComponent columns={appointmentListColumns}
                                           fixedHeader={true}
                                           autoHeight={true}
                                           refreshToken={refreshToken}
                                           noDataText={'Currently, there are no appointments scheduled for today.'}
                                           url={APIConfig.DASHBOARD_APPOINTMENT_LIST.URL}
                                           isPaginated={false}
                                           method={APIConfig.DASHBOARD_APPOINTMENT_LIST.METHOD}
                    />
                </div>
            </CardComponent>
            <DrawerComponent isOpen={!!openedAppointmentDetails} onClose={setOpenedAppointmentDetails.bind(null, null)}
                             className={'book-appointment-component-drawer'}>

                <AppointmentDetailsComponent
                    appointment_id={openedAppointmentDetails?._id}
                    onComplete={
                        () => {
                            setRefreshToken(Math.random().toString());
                            setOpenedAppointmentDetails(null);
                        }
                    }
                    onClose={
                        setOpenedAppointmentDetails.bind(null, null)
                    }
                />
            </DrawerComponent>
        </div>
    );

};

export default AppointmentListComponent;