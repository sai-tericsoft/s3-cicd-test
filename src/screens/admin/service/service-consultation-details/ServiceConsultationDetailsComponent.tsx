import "./ServiceConsultationDetailsComponent.scss";
import CardComponent from "../../../../shared/components/card/CardComponent";
import {Misc} from "../../../../constants";
import {ITableColumn} from "../../../../shared/models/table.model";
import TableComponent from "../../../../shared/components/table/TableComponent";
import {IConsultation, IService} from "../../../../shared/models/service.model";

interface ServiceConsultationDetailsComponentProps {
    serviceDetails: IService
}

const ServiceConsultationDetailsComponent = (props: ServiceConsultationDetailsComponentProps) => {

    const {serviceDetails} = props;

    const ServiceConsultationColumns: ITableColumn[] = [
        {
            title: "Duration",
            key: "duration",
            dataIndex: "duration",
            width: "80%",
            render: ( item: IConsultation) => {
                return <span> {item?.duration_details?.title} </span>
            }
        },
        {
            title: "Price",
            key: "price",
            dataIndex: "price",
            width: "20%",
            render: ( item: any) => {
                return <span> {Misc.CURRENCY_SYMBOL}{item.price} </span>
            }
        }
    ]

    return (
        <div className={'service-consultation-details-component'}>
            <div className={"ts-row display-flex mrg-bottom-15"}>
                <div className={"ts-col-sm-12 ts-col-md-12 ts-col-lg-6"}>
                    {
                        serviceDetails.initial_consultation.map((consultation, index) => {
                            return <CardComponent
                                title={"Initial Consultation " + (index + 1) + (consultation.title ? " ( " + consultation.title + " ) " : "")}
                                size={"sm"}>
                                <TableComponent data={consultation.consultation_details || []}
                                                columns={ServiceConsultationColumns}
                                                size={"small"}
                                                id={"ic_table"}
                                />
                            </CardComponent>
                        })
                    }
                </div>
                <div className={"ts-col-sm-12 ts-col-md-12 ts-col-lg-6"}>
                    {
                        serviceDetails.followup_consultation.map((consultation, index) => {
                            return <CardComponent
                                title={consultation.title ? "Follow-up Appointment" + (index + 1) + " ( " + consultation.title + " ) " : "Follow-up Appointment " + (index + 1)}
                                size={"sm"}>
                                <TableComponent data={consultation.consultation_details || []}
                                                columns={ServiceConsultationColumns}
                                                size={"small"}
                                                id={"fa_table"}
                                />
                            </CardComponent>
                        })
                    }
                </div>
            </div>
        </div>
    );

};

export default ServiceConsultationDetailsComponent;
