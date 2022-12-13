import "./ClientSearchComponent.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import SearchComponent from "../../../shared/components/search/SearchComponent";
import {IClientBasicDetails, IClientListFilterState} from "../../../shared/models/client.model";
import {useCallback, useEffect, useState} from "react";
import {APIConfig, ImageConfig} from "../../../constants";
import {useDispatch} from "react-redux";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {ITableColumn} from "../../../shared/models/table.model";
import {CommonService} from "../../../shared/services";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";

interface ClientSearchComponentProps {

}

const ClientSearchComponent = (props: ClientSearchComponentProps) => {

    const ClientListTableColumns: ITableColumn[] = [
        {
            title: "Client ID",
            key: "client_id",
            dataIndex: "client_id",
            width: "10%",
            fixed: "left"
        },
        {
            title: "Client Name",
            key: "name",
            dataIndex: "first_name",
            sortable: true,
            width: "15%",
            render: (_: any, item: IClientBasicDetails) => {
                return <span>{item?.last_name} {item?.first_name}</span>
            }
        },
        {
            title: "Phone",
            key: "primary_contact_info",
            dataIndex: "primary_contact_info",
            width: "15%",
            render: (_: any, item: IClientBasicDetails) => {
                return <span>{item?.primary_contact_info?.phone}</span>
            }
        },
        {
            title: "Last Appointment",
            key: "last_appointment_date",
            dataIndex: "lastAppointmentDate",
            width: "15%",
            render: (_: any, item: IClientBasicDetails) => {
                return <span>
                    {item?.last_appointment_date ? CommonService.getSystemFormatTimeStamp(item?.last_appointment_date) : "-"}
                </span>
            }
        },
        {
            title: "Last Provider",
            key: "last_provider",
            dataIndex: "last_provider",
            width: "15%",
            render: (_: any, item: IClientBasicDetails) => {
                return <span>
                    {item?.last_provider}
                </span>
            }
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: "10%",
            render: (_: any, item: IClientBasicDetails) => {
                return <ChipComponent label={item?.is_active ? "Active" : "Inactive"}
                                      className={item?.is_active ? "active" : "inactive"}
                />
            }
        },
        {
            title: "",
            dataIndex: "actions",
            key: "actions",
            width: "10%",
            fixed: "right",
            render: (_: any, item: IClientBasicDetails) => {
                if (item?._id) {
                    return <LinkComponent route={CommonService._routeConfig.ComingSoonRoute()}>
                        View Details
                    </LinkComponent>
                }
            }
        }
    ];

    const dispatch = useDispatch();

    const [clientListFilterState, setClientListFilterState] = useState<IClientListFilterState>({
        search: "",
        sort: {}
    });
    const handleClientSort = useCallback((key: string, order: string) => {
        setClientListFilterState((oldState) => {
            const newState = {...oldState};
            newState["sort"][key] = order;
            return newState;
        });
    }, []);

    useEffect(() => {
        dispatch(setCurrentNavParams("Chart Notes"));
    }, [dispatch]);
    return (

        <div className={'client-search-component'}>
            <CardComponent color={"primary"} size={'md'}>
                <div className="ts-col-lg mrg-top-15 ">
                    <SearchComponent size={'medium'}
                                     className={'searchbar'}
                                     label={'Search for Client'}
                                     value={clientListFilterState.search}
                                     onSearchChange={(value) => {
                                         setClientListFilterState({...clientListFilterState, search: value})
                                     }}/>

                </div>
            </CardComponent>




                    {clientListFilterState.search && <div className="list-content-wrapper">
                        <TableWrapperComponent
                            url={APIConfig.CLIENT_LIST.URL}
                            method={APIConfig.CLIENT_LIST.METHOD}
                            columns={ClientListTableColumns}
                            extraPayload={clientListFilterState}
                            onSort={handleClientSort}
                        />
                    </div>
                    }

                    {
                        !clientListFilterState.search &&
                        <CardComponent>
                        <div className={'big-search-logo'}>
                           <div>
                            <img src={ImageConfig.BigSearch}/>
                            <div className={'search-logo-heading'}>Search for Clients</div>
                        </div>
                        </div>
                        </CardComponent>
                    }




        </div>

    );

};

export default ClientSearchComponent;


// CommonService._routeConfig.ClientDetails(item?._id)