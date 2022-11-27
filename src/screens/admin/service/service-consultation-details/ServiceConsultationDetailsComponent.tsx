import "./ServiceConsultationDetailsComponent.scss";
import {IService} from "../../../../shared/models/service-category.model";
// import {ITableColumn} from "../../../../shared/models/table.model";
// import {Misc} from "../../../../constants";
import CardComponent from "../../../../shared/components/card/CardComponent";
// import TableComponent from "../../../../shared/components/table/TableComponent";

interface ServiceConsultationDetailsComponentProps {
    serviceDetails: IService
}

const ServiceConsultationDetailsComponent = (props: ServiceConsultationDetailsComponentProps) => {

    // const {serviceDetails} = props;
    //
    // const ServiceConsultationColumns: ITableColumn[] = [
    //     {
    //         title: "Duration",
    //         key: "duration",
    //         dataIndex: "duration"
    //     },
    //     {
    //         title: "Price",
    //         key: "price",
    //         dataIndex: "price",
    //         render: (_: any, item: any) => {
    //             return <span> {Misc.CURRENCY_SYMBOL} {item.price} </span>
    //         }
    //     }
    // ]

    return (
        <div className={'service-consultation-details-component'}>
            <div className={"display-flex mrg-bottom-15"}>
                <div>
                    <CardComponent title={"Initial Consultation"} size={"sm"}>
                        {/*<TableComponent data={serviceDetails.initial_consultation.consultation_details. || []}*/}
                        {/*                columns={ServiceConsultationColumns}*/}
                        {/*                size={"small"}*/}
                        {/*/>*/}
                    </CardComponent>
                </div>
                <div>
                    <CardComponent title={"Follow-up Appointment"} size={"sm"}>
                        {/*<TableComponent data={serviceDetails.followup_consultation.consultation_details || []}*/}
                        {/*                columns={ServiceConsultationColumns}*/}
                        {/*                size={"small"}*/}
                        {/*/>*/}
                    </CardComponent>
                </div>
            </div>
        </div>
    );

};

export default ServiceConsultationDetailsComponent;