import "./FacilityListScreen.scss";
import {ITableColumn} from "../../../../shared/models/table.model";
import {APIConfig} from "../../../../constants";
import TableWrapperComponent from "../../../../shared/components/table-wrapper/TableWrapperComponent";
import {IFacility} from "../../../../shared/models/facility.model";
import ChipComponent from "../../../../shared/components/chip/ChipComponent";
import LinkComponent from "../../../../shared/components/link/LinkComponent";
import {CommonService} from "../../../../shared/services";
import {useEffect} from "react";
import {setCurrentNavParams} from "../../../../store/actions/navigation.action";
import {useDispatch} from "react-redux";

interface FacilityListScreenProps {

}

const FacilityListScreen = (props: FacilityListScreenProps) => {

    const dispatch = useDispatch();

    const FacilityListColumns: ITableColumn[] = [
        {
            title: "Facility",
            dataIndex: "name",
            width: "30%",
            key: "name"
        },
        {
            title: "Facility Location",
            dataIndex: "location",
            width: "20%",
            key: "location"
        },
        {
            title: "Phone Number",
            dataIndex: "phone_number",
            key: "phone_number",
            width: "20%",
            render: (_: any, item: IFacility) => {
                return <span>{item.primary_contact_info.phone}</span>
            }
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: "10%",
            render: (_: any, item: IFacility) => {
                return <ChipComponent label={item.is_active ? "Active" : "Inactive"}
                                      className={item?.is_active ? "active" : "inactive"}
                />
            }
        },
        {
            title: "",
            dataIndex: "actions",
            key: "actions",
            width: "15%",
            render: (_: any, item: IFacility) => {
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
                <div className="facility-list-title">
                    Facility Management
                </div>
            </div>
            <div className="facility-list-wrapper">
                <TableWrapperComponent url={APIConfig.FACILITY_LIST.URL}
                                       method={APIConfig.FACILITY_LIST.METHOD}
                                       rowKey={(item: IFacility) => item._id}
                                       isPaginated={true}
                                       columns={FacilityListColumns}/>
            </div>
        </div>
    );

};

export default FacilityListScreen;