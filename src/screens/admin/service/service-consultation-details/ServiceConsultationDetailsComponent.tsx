import "./ServiceConsultationDetailsComponent.scss";
import CardComponent from "../../../../shared/components/card/CardComponent";
import {Misc} from "../../../../constants";
import {ITableColumn} from "../../../../shared/models/table.model";
import TableComponent from "../../../../shared/components/table/TableComponent";
import {IConsultation, IService} from "../../../../shared/models/service.model";
import {CommonService} from "../../../../shared/services";

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
            render: ( item: IConsultation) => {
                return <span> {item?.duration+' mins'} </span>
            }
        },
        {
            title: "Price",
            key: "price",
            dataIndex: "price",
            align:'center',
            fixed:'right',
            render: ( item: any) => {
                return <span> {Misc.CURRENCY_SYMBOL}{CommonService.convertToDecimals(+(item?.price))} </span>
            }
        }
    ]

    return (
        <div className={'service-consultation-details-component'}>
            <div className={"ts-row"}>
                {serviceDetails.initial_consultation.map((consultation, index) => (
                    <div className={"ts-col-sm-4 ts-col-md-4 ts-col-lg-4"} key={index}>
                        <CardComponent
                            title={"Initial Consultation " + (index + 1) + (consultation.title ? "( " + CommonService.capitalizeFirstLetter(consultation.title) + " ) " : "")}
                            size={"sm"}
                        >
                            <TableComponent
                                data={consultation.consultation_details || []}
                                columns={ServiceConsultationColumns}
                                size={"small"}
                                id={"ic_table"}
                            />
                        </CardComponent>
                    </div>
                ))}

                {serviceDetails.followup_consultation.map((consultation, index) => (
                    <div className={"ts-col-sm-4 ts-col-md-4 ts-col-lg-4"} key={index}>
                        <CardComponent
                            title={consultation.title ? "Follow-up Appointment " + (index + 1) + " ( " + CommonService.capitalizeFirstLetter(consultation.title) + " ) " : "Follow-up Appointment " + (index + 1)}
                            size={"sm"}
                        >
                            <TableComponent
                                data={consultation.consultation_details || []}
                                className={'followup-consultation-table'}
                                columns={ServiceConsultationColumns}
                                size={"small"}
                                id={"fa_table"}
                            />
                        </CardComponent>
                    </div>
                ))}
            </div>
        </div>
    );

};

export default ServiceConsultationDetailsComponent;
