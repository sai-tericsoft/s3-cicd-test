import "./FacilityListScreen.scss";
import {ITableColumn} from "../../../../shared/models/table.model";
import {APIConfig, ImageConfig} from "../../../../constants";
import TableWrapperComponent from "../../../../shared/components/table-wrapper/TableWrapperComponent";
import {IFacility, IFacilityListFilterState} from "../../../../shared/models/facility.model";
import ChipComponent from "../../../../shared/components/chip/ChipComponent";
import LinkComponent from "../../../../shared/components/link/LinkComponent";
import {CommonService} from "../../../../shared/services";
import React, {useEffect, useState} from "react";
import {setCurrentNavParams} from "../../../../store/actions/navigation.action";
import {useDispatch} from "react-redux";
import SearchComponent from "../../../../shared/components/search/SearchComponent";

interface FacilityListScreenProps {

}

const FacilityListScreen = (props: FacilityListScreenProps) => {

    const dispatch = useDispatch();
    const [facilityListFilterState, setFacilityListFilterState] = useState<IFacilityListFilterState>({
        search: "",
    });

    const FacilityListColumns: ITableColumn[] = [
        {
            title: "Facility Name",
            dataIndex: "name",
            width: 195,
            key: "name",
            fixed: "left",
            render: (item: IFacility) => {
                return <LinkComponent route={CommonService._routeConfig.FacilityDetails(item._id)}>
                    {item?.name}
                </LinkComponent>
            }
        },
        {
            title: "Facility Location",
            dataIndex: "location",
            width: 115,
            align: "center",
            key: "location",
            render: (item: any) => {
                return <>{(item?.location)?.toLocaleUpperCase()}</>
            }
        },
        {
            title: "Phone Number",
            dataIndex: "phone_number",
            key: "phone_number",
            width: 90,
            align: "center",
            render: (item: IFacility) => {
                return <span>{CommonService.formatPhoneNumber(item.primary_contact_info.phone)}</span>
            }
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 160,
            align: "center",
            render: (item: IFacility) => {
                return <ChipComponent label={item.is_active ? "Active" : "Inactive"}
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
            align:'right',
            render: (item: IFacility) => {
                return <LinkComponent route={CommonService._routeConfig.FacilityDetails(item._id)}>
                    View Details
                </LinkComponent>
            }
        }
    ];

    useEffect(() => {
        dispatch(setCurrentNavParams("Admin"));
    }, [dispatch]);

    return (
        <div className={'facility-list-screen'}>
            <div className="facility-list-header">
                <div className="facility-list-filters">
                    <div className="ts-row">
                        <div className="ts-col-lg-4">
                            <SearchComponent
                                label={"Search"}
                                placeholder={"Search using Facility Name"}
                                value={facilityListFilterState.search}
                                onSearchChange={(value) => {
                                    setFacilityListFilterState((prevState:any) => {
                                        return {
                                            ...prevState,
                                            search: value,
                                            page: 1 // Reset the page number to 1
                                        };
                                    });
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="facility-list-wrapper">
                <TableWrapperComponent id="facility_list"
                                       url={APIConfig.FACILITY_LIST.URL}
                                       method={APIConfig.FACILITY_LIST.METHOD}
                                       rowKey={(item: IFacility) => item._id}
                                       isPaginated={true}
                                       autoHeight={false}
                                       noDataText={(<div className={'no-features-text-wrapper'}>
                                           <div>{facilityListFilterState.search ?<img src={ImageConfig.Search} alt="client-search"/>:''}</div>
                                           <div className={'no-feature-heading'}>{facilityListFilterState.search ? 'Sorry, no results found!' : ''}</div>
                                           <div className={'no-features-description'}>
                                               {facilityListFilterState.search ? 'There is no facility available by the name you have searched' : 'Currently, there is no facility added.'}<br/>
                                           </div>
                                       </div>)}
                                       extraPayload={facilityListFilterState}
                                       columns={FacilityListColumns}

                />
            </div>
        </div>
    );

};

export default FacilityListScreen;
