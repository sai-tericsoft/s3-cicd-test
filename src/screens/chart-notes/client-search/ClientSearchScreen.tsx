import "./ClientSearchScreen.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import SearchComponent from "../../../shared/components/search/SearchComponent";
import {IClientBasicDetails, IClientListFilterState} from "../../../shared/models/client.model";
import React, {useCallback, useEffect, useState} from "react";
import {APIConfig} from "../../../constants";
import {useDispatch} from "react-redux";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {ITableColumn} from "../../../shared/models/table.model";
import {CommonService} from "../../../shared/services";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";

interface ClientSearchScreenProps {

}

const ClientSearchScreen = (props: ClientSearchScreenProps) => {

    const dispatch = useDispatch();

    const [clientListFilterState, setClientListFilterState] = useState<IClientListFilterState>({
        search: "",
        is_chart_notes: true,
        sort: {},
        page: 1
    });

    const ClientListTableColumns: ITableColumn[] = [
        {
            title: "Client ID",
            key: "client_id",
            dataIndex: "client_id",
            width: 120,
            fixed: "left",
            render: (item: IClientBasicDetails) => {
                if (item?._id) {
                    return <LinkComponent route={CommonService._routeConfig.MedicalRecordList(item?._id)}>
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
            align: 'center',
            width: 250,
            render: (item: IClientBasicDetails) => {
                return <span>{CommonService.extractName(item)}</span>
            }
        },
        {
            title: "Phone",
            key: "primary_contact_info",
            dataIndex: "primary_contact_info",
            width: 100,
            align: "center",
            render: (item: IClientBasicDetails) => {
                return <span>{item?.primary_contact_info?.phone}</span>
            }
        },
        {
            title: "Last Intervention",
            key: "last_appointment_date",
            dataIndex: "lastAppointmentDate",
            width: 150,
            align: "center",
            render: (item: IClientBasicDetails) => {
                return <span>
                    {item?.last_completed_intervention_date ? CommonService.getSystemFormatTimeStamp(item?.last_completed_intervention_date) : "-"}
                </span>
            }
        },
        {
            title: "Last Provider",
            key: "last_provider",
            dataIndex: "last_provider",
            width: 140,
            align: "center",
            render: (item: IClientBasicDetails) => {
                return <span>
                    {CommonService.capitalizeFirstLetter(item?.last_provider?.first_name || '-')} {CommonService.capitalizeFirstLetter(item?.last_provider?.last_name)}
                </span>
            }
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "center",
            width: 90,
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
                    return <LinkComponent route={CommonService._routeConfig.MedicalRecordList(item?._id)}>
                        View Details
                    </LinkComponent>
                }
            }
        }
    ];

    const handleClientSort = useCallback((key: string, order: string) => {
        setClientListFilterState((oldState) => {
            const newState = {...oldState};
            newState["sort"] = {
                key,
                order
            }
            return newState;
        });
    }, []);

    useEffect(() => {
        dispatch(setCurrentNavParams("Chart Notes"));
    }, [dispatch]);

    return (
        <div className={'client-search-component'}>
            <CardComponent color={"primary"} size={'md'}>
                <SearchComponent size={'medium'}
                                 className={'client-search-input mrg-top-20'}
                                 label={'Search for Client'}
                                 value={clientListFilterState.search}
                                 onSearchChange={(value) => {
                                     setClientListFilterState((prevState) => {
                                         return {
                                             ...prevState,
                                             search: value,
                                             page: 1 // Reset the page number to 1
                                         };
                                     });
                                 }}
                />
            </CardComponent>
            {/*{*/}
            {/*    !clientListFilterState.search &&*/}
            {/*    <CardComponent className={"client-search-card"}>*/}
            {/*        <div className={'client-search-logo-wrapper'}>*/}
            {/*            <img src={ImageConfig.Search} alt="client-search"/>*/}
            {/*            <div className={'client-search-label'}>Search for Clients</div>*/}
            {/*        </div>*/}
            {/*    </CardComponent>*/}
            {/*}*/}

            <div className="list-content-wrapper">
                <TableWrapperComponent
                    id={"client_search"}
                    url={APIConfig.CLIENT_LIST.URL}
                    method={APIConfig.CLIENT_LIST.METHOD}
                    columns={ClientListTableColumns}
                    extraPayload={clientListFilterState}
                    onSort={handleClientSort}
                />
            </div>

        </div>
    );

};

export default ClientSearchScreen;
