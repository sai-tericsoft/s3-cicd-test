import "./ServiceListComponent.scss";
import {ITableColumn} from "../../../../shared/models/table.model";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import {APIConfig, ImageConfig} from "../../../../constants";
import TableWrapperComponent from "../../../../shared/components/table-wrapper/TableWrapperComponent";
import ChipComponent from "../../../../shared/components/chip/ChipComponent";
import {CommonService} from "../../../../shared/services";
import LinkComponent from "../../../../shared/components/link/LinkComponent";
import {IService} from "../../../../shared/models/service.model";

interface ServiceListComponentProps {
    serviceCategoryId: string;
    refreshToken:any;
}

const ServiceListComponent = (props: ServiceListComponentProps) => {

    const {serviceCategoryId,refreshToken} = props;

    const ServiceListTableColumns: ITableColumn[] = [
        {
            dataIndex: "name",
            key: "name",
            width: 500,
            fixed:'left',
            title: "Service Name",
            render: ( item: IService, index: number) => {
                if (item._id){
                    return <LinkComponent id={"sv_view_details_" + index} route={CommonService._routeConfig.ServiceDetails(item._id)}>
                        {item?.name}
                    </LinkComponent>
                }
            }
        },
        {
            dataIndex: "status",
            key: "status",
            width: 500,
            align:'center',
            title: "Status",
            render: ( item: any) => {
                return <ChipComponent label={item?.is_active ? "Active" : "Inactive"}
                                      className={item?.is_active ? "active" : "inactive"}/>
            }
        },
        {
            dataIndex: "viewDetails",
            key: "viewDetails",
            title: "",
            fixed:'right',
            render: ( item: IService, index: number) => {
                if (item._id){
                    return <LinkComponent id={"sv_view_details_" + index} route={CommonService._routeConfig.ServiceDetails(item._id)}>
                        View Details
                    </LinkComponent>
                }
            }
        }];

    return (
        <div className={'service-list-component'}>
            <div className="service-list-wrapper">
                <div className="service-list-header">
                    <div className="service-list-title">
                        Services
                    </div>
                    <div className="service-list-options">
                        <LinkComponent route={CommonService._routeConfig.ServiceAdd(serviceCategoryId)}>
                            <ButtonComponent
                                prefixIcon={<ImageConfig.AddIcon/>}
                                id={"add_sv_btn"}
                            >
                                Add Service
                            </ButtonComponent>
                        </LinkComponent>
                    </div>
                </div>
            </div>
            <div className="service-list-table-container">
                <TableWrapperComponent
                    id={"service_list"}
                    url={APIConfig.SERVICE_LIST.URL(serviceCategoryId)}
                    method={APIConfig.SERVICE_LIST.METHOD}
                    isPaginated={true}
                    refreshToken={refreshToken}
                    noDataText={"Currently, there is no service added in this category.."}
                    columns={ServiceListTableColumns}
                />
            </div>
        </div>
    );

};

export default ServiceListComponent;
