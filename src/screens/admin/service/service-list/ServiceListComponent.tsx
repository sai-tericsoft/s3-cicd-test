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
}

const ServiceListComponent = (props: ServiceListComponentProps) => {

    const {serviceCategoryId} = props;

    const ServiceListTableColumns: ITableColumn[] = [
        {
            dataIndex: "name",
            key: "name",
            width: "70%",
            title: "Service Name"
        },
        {
            dataIndex: "status",
            key: "status",
            width: "20%",
            title: "Status",
            render: ( item: any) => {
                return <ChipComponent label={item?.is_active ? "Active" : "Inactive"}
                                      color={item?.is_active ? "success" : "error"}></ChipComponent>
            }
        },
        {
            dataIndex: "viewDetails",
            key: "viewDetails",
            title: "",
            width: "10%",
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
                    columns={ServiceListTableColumns}
                />
            </div>
        </div>
    );

};

export default ServiceListComponent;
