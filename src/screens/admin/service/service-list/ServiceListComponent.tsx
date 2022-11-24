import "./ServiceListComponent.scss";
import {ITableColumn} from "../../../../shared/models/table.model";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import {APIConfig, ImageConfig} from "../../../../constants";
import TableWrapperComponent from "../../../../shared/components/table-wrapper/TableWrapperComponent";
import ChipComponent from "../../../../shared/components/chip/ChipComponent";
import {CommonService} from "../../../../shared/services";
import LinkComponent from "../../../../shared/components/link/LinkComponent";

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
            render: (_: any, item: any) => {
                console.log(item);
                return <ChipComponent label={item?.is_active ? "Active" : "Inactive"}
                                      color={item?.is_active ? "success" : "error"}></ChipComponent>
            }
        },
        {
            dataIndex: "viewDetails",
            key: "viewDetails",
            title: "",
            width: "10%",
            render: (_: any, item: any) => {
                return <LinkComponent route={CommonService._routeConfig.ComingSoonRoute()}>
                    View Details
                </LinkComponent>
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
                        <ButtonComponent
                            prefixIcon={<ImageConfig.AddIcon/>}
                        >
                            Add Service
                        </ButtonComponent>
                    </div>
                </div>
            </div>
            <div className="service-list-table-container">
                <TableWrapperComponent
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
