import "./ServiceConsultationDetailsComponent.scss";
import CardComponent from "../../../../shared/components/card/CardComponent";
import {Misc} from "../../../../constants";
import {ITableColumn} from "../../../../shared/models/table.model";
import TableComponent from "../../../../shared/components/table/TableComponent";
import {IConsultation, IService} from "../../../../shared/models/service.model";
import {CommonService} from "../../../../shared/services";
import FormControlLabelComponent from "../../../../shared/components/form-control-label/FormControlLabelComponent";
import HorizontalLineComponent
    from "../../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";

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
            align: 'left',
            render: (item: IConsultation) => {
                return <span> {item?.duration + ' minutes'} </span>
            }
        },
        {
            title: "Price",
            key: "price",
            dataIndex: "price",
            align: 'center',
            fixed: 'right',
            render: (item: any) => {
                return <span> {Misc.CURRENCY_SYMBOL}{CommonService.convertToDecimals(+(item?.price))} </span>
            }
        }
    ]

    return (
        <div className={'service-consultation-details-component'}>
            <CardComponent>
                <FormControlLabelComponent label={"Initial Consultation"} size={'xl'}/>
                <div className={"ts-row"}>
                    {serviceDetails.initial_consultation.map((consultation, index) => (
                        <div className={"ts-col-sm-4 ts-col-md-4 ts-col-lg-4"} key={index}>
                            <CardComponent
                                title={(consultation.title ? CommonService.capitalizeFirstLetter(consultation.title) : "")}
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
                </div>
                <HorizontalLineComponent className={'horizontal-divider'}/>
                <FormControlLabelComponent label={"Follow-up Consultation"} size={'xl'}/>
                <div className={"ts-row"}>
                    {serviceDetails.followup_consultation.map((consultation, index) => (
                        <div className={"ts-col-sm-4 ts-col-md-4 ts-col-lg-4"} key={index}>
                            <CardComponent
                                title={consultation.title ? CommonService.capitalizeFirstLetter(consultation.title) : "Follow-up Appointment " + (index + 1)}
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
            </CardComponent>
        </div>
    );

};

export default ServiceConsultationDetailsComponent;
