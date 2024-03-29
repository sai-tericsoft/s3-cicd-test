import "./UserListComponent.scss";
import React, {useCallback, useState} from "react";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";
import {ITableColumn} from "../../../../shared/models/table.model";
import {CommonService} from "../../../../shared/services";
import ChipComponent from "../../../../shared/components/chip/ChipComponent";
import LinkComponent from "../../../../shared/components/link/LinkComponent";
import SearchComponent from "../../../../shared/components/search/SearchComponent";
import SelectComponent from "../../../../shared/components/form-controls/select/SelectComponent";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import {APIConfig, ImageConfig} from "../../../../constants";
import TableWrapperComponent from "../../../../shared/components/table-wrapper/TableWrapperComponent";
import {IClientBasicDetails} from "../../../../shared/models/client.model";
import CardComponent from "../../../../shared/components/card/CardComponent";

interface UserListComponentProps {

}

const UserListComponent = (props: UserListComponentProps) => {
        const [userListFilterState, setUserListFilterState] = useState<any>({
            search: "",
            is_active: undefined,
            sort: {},
            role: 'provider'
        });
        const {statusList} = useSelector((store: IRootReducerState) => store.staticData);

        const columns: ITableColumn[] = [
            {
                title: "User Name",
                key: "last_name",
                dataIndex: "first_name",
                sortable: true,
                width: 150,
                render: (item: any) => {
                    return <>{CommonService.extractName(item)}</>
                }
            },
            {
                title: "Phone",
                key: "primary_contact_info",
                dataIndex: "primary_contact_info",
                width: 150,
                align: "center",
                render: (item: IClientBasicDetails) => {
                    return <span>{item?.primary_contact_info && item?.primary_contact_info?.phone ? CommonService.formatPhoneNumber(item?.primary_contact_info?.phone) : '-'}</span>
                }
            },
            {
                title: "Role",
                key: "role",
                dataIndex: "role",
                align: "center",
                width: 140,
                render: (item: any) => {
                    return <span>
                    {CommonService.capitalizeFirstLetter(item?.role) || '-'}
                </span>
                }
            },
            {
                title: "Status",
                dataIndex: "status",
                key: "status",
                align: "center",
                width: 140,
                render: (item: any) => {
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
                fixed: "right",
                align: "center",
                render: (item: any) => {
                    if (item?._id) {
                        return <LinkComponent
                            route={CommonService._routeConfig.UserPersonalDetails(item?._id)}>
                            View Details
                        </LinkComponent>
                    }
                }
            }
        ];

        const handleUserSort = useCallback((key: string, order: string) => {
            setUserListFilterState((oldState: any) => {
                const newState = {...oldState};
                newState["sort"] = {
                    key,
                    order
                }
                return newState;
            });
        }, []);

        return (
            <div className={'user-list-component list-screen'}>
                <div className={'list-screen-header'}>
                    <div className={'list-search-filters'}>
                        <div className="ts-row">
                            <div className="ts-col-lg-4 ts-col-md-6 ">
                                <SearchComponent
                                    label={"Search"}
                                    placeholder={"Search using User Name"}
                                    value={userListFilterState.search}
                                    onSearchChange={(value) => {
                                        setUserListFilterState((prevState: any) => {
                                            return {
                                                ...prevState,
                                                search: value,
                                                page: value ? 1 : prevState.page  // Reset the page number to 1
                                            };
                                        });
                                    }}
                                />
                            </div>
                            <div className="ts-col-md-6 ts-col-lg-3">
                                <SelectComponent
                                    label={"Status"}
                                    size={"small"}
                                    fullWidth={true}
                                    options={statusList}
                                    value={userListFilterState.is_active}
                                    keyExtractor={(item) => item.code}
                                    onUpdate={(value) => {
                                        delete userListFilterState.is_active;
                                        setUserListFilterState({...userListFilterState, ...(value !== '' ? {is_active: value} : {})})
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="list-options">
                        <LinkComponent route={CommonService._routeConfig.UserAdd()}>
                            <ButtonComponent id={'add_client_btn'} prefixIcon={<ImageConfig.AddIcon/>}>
                                Add User
                            </ButtonComponent>
                        </LinkComponent>
                    </div>
                </div>

                <div className={'user-list'}>
                    <CardComponent>
                        <TableWrapperComponent url={APIConfig.USER_LIST.URL}
                                               method={APIConfig.USER_LIST.METHOD}
                                               extraPayload={userListFilterState}
                                               noDataText={<div className={'no-data-text'}>
                                                   {(userListFilterState) ? 'Sorry, no data found.' : 'No user added yet.'}
                                               </div>}
                                               onSort={handleUserSort}
                                               columns={columns}/>
                    </CardComponent>
                </div>
            </div>
        );

    }
;

export default UserListComponent;
