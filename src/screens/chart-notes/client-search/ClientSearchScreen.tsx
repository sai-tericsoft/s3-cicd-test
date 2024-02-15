import "./ClientSearchScreen.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import SearchComponent from "../../../shared/components/search/SearchComponent";
import {IClientBasicDetails, IClientListFilterState} from "../../../shared/models/client.model";
import React, {useCallback, useEffect, useState} from "react";
import {APIConfig, ImageConfig} from "../../../constants";
import {useDispatch, useSelector} from "react-redux";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {ITableColumn} from "../../../shared/models/table.model";
import {CommonService} from "../../../shared/services";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";
import SelectComponent from "../../../shared/components/form-controls/select/SelectComponent";
import {IRootReducerState} from "../../../store/reducers";

interface ClientSearchScreenProps {

}

const ClientSearchScreen = (props: ClientSearchScreenProps) => {

    const dispatch = useDispatch();
    const {statusList} = useSelector((store: IRootReducerState) => store.staticData);


    const [clientListFilterState, setClientListFilterState] = useState<IClientListFilterState>({
        search: "",
        is_chart_notes: true,
        is_active: "all",
        sort: {},
        page: 1
    });

    const ClientListTableColumns: ITableColumn[] = [
        {
            title: "Client ID",
            key: "client_id",
            dataIndex: "client_id",
            width: 160,
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
            key: "last_name",
            dataIndex: "first_name",
            sortable: true,
            width: 150,
            render: (item: IClientBasicDetails) => {
                return <span
                    className={item?.is_alias_name_set ? 'alias-name' : ''}>{CommonService.extractName(item)}</span>
            }
        },
        {
            title: "Phone",
            key: "primary_contact_info",
            dataIndex: "primary_contact_info",
            width: 150,
            align: "center",
            render: (item: IClientBasicDetails) => {
                return <span>{CommonService.formatPhoneNumber(item?.primary_contact_info?.phone || "-")}</span>
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
                    {CommonService.capitalizeFirstLetter(item?.last_provider_details?.first_name || '-')} {CommonService.capitalizeFirstLetter(item?.last_provider_details?.last_name)}
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
            title: "Action",
            dataIndex: "actions",
            key: "actions",
            width: 120,
            align:'center',
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
            <CardComponent color={"primary"} className={'search-wrapper'}>
                <div className={'ts-row'}>
                    <div className={'ts-col-lg-3'}>
                        <SearchComponent
                            className={'client-search-input mrg-top-20'}
                            label={'Search'}
                            placeholder={'Search using ID/Name/Phone'}
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
                    </div>
                    <div className="ts-col-md-6 ts-col-lg-3 mrg-top-20 status-filter">
                        <SelectComponent
                            label={"Status"}
                            size={"small"}
                            isClear={false}
                            fullWidth={true}
                            options={statusList}
                            value={clientListFilterState.is_active}
                            keyExtractor={(item) => item.code}
                            onUpdate={(value) => {
                                delete clientListFilterState.is_active;
                                setClientListFilterState({...clientListFilterState, ...(value !== '' ? {is_active: value} : {})})
                            }}
                        />
                    </div>
                </div>

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
                        noDataText={(<div className={'no-client-text-wrapper'}>
                            <div>{clientListFilterState.search ?
                                <img src={ImageConfig.Search} alt="client-search"/> : ''}</div>
                            <div
                                className={'no-client-heading mrg-bottom-15'}>{clientListFilterState.search ? 'Sorry, no results found!' : ''}</div>
                            <div className={'no-client-description'}>
                                {clientListFilterState.search ? 'There is no client available by the ID/Name/Phone you have searched' : 'Currently, there is no client added.'}
                            </div>
                        </div>)}
                        method={APIConfig.CLIENT_LIST.METHOD}
                        columns={ClientListTableColumns}
                        extraPayload={clientListFilterState}
                        onSort={handleClientSort}
                    />
                </div>
            </CardComponent>

        </div>
    );

};

export default ClientSearchScreen;
