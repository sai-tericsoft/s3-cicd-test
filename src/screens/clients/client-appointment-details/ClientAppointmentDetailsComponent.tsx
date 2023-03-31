import "./ClientAppointmentDetailsComponent.scss";
import {useCallback, useEffect, useState} from "react";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {useParams} from "react-router-dom";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import AttachmentComponent from "../../../shared/attachment/AttachmentComponent";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import MedicalInterventionLinkedToComponent
    from "../../chart-notes/medical-intervention-linked-to/MedicalInterventionLinkedToComponent";

interface ClientAppointmentDetailsComponentProps {

}

const ClientAppointmentDetailsComponent = (props: ClientAppointmentDetailsComponentProps) => {
    const {clientAppointmentId} = useParams();
    const [appointmentDetails, setAppointmentDetails] = useState<any | null>(null);
    const [isAppointmentDetailsLoading, setIsAppointmentDetailsLoading] = useState<boolean>(false);
    const [isAppointmentDetailsFailed, setIsAppointmentDetailsFailed] = useState<boolean>(false);
    const [isAppointmentDetailsLoaded, setIsAppointmentDetailsLoaded] = useState<boolean>(false);

    const getAppointmentDetails = useCallback(() => {
            setIsAppointmentDetailsLoading(true);
            setIsAppointmentDetailsFailed(false);
            setIsAppointmentDetailsLoaded(false);
            CommonService._appointment.getAppointment(clientAppointmentId)
                .then((response: IAPIResponseType<any>) => {
                    setAppointmentDetails(response.data);
                    setIsAppointmentDetailsLoading(false);
                    setIsAppointmentDetailsFailed(false);
                    setIsAppointmentDetailsLoaded(true);
                })
                .catch(() => {
                    setIsAppointmentDetailsFailed(true)
                    setIsAppointmentDetailsLoading(false);
                    setIsAppointmentDetailsLoaded(true);
                })
        },
        [clientAppointmentId]);


    useEffect(() => {
        if (clientAppointmentId) {
            getAppointmentDetails();
        }
    }, [getAppointmentDetails, clientAppointmentId]);

    return (
        <div className={'medical-record-attachment-basic-details-card-component'}>
            {
                isAppointmentDetailsLoading && <LoaderComponent/>
            }
            {
                isAppointmentDetailsFailed &&
                <StatusCardComponent title={'Failed to load Appointment record details.'}/>
            }
            {
                isAppointmentDetailsLoaded && <>
                    <PageHeaderComponent title={'View Details'}/>
                    <div className={"medical-record-attachment-basic-details-wrapper"}>
                        <CardComponent color={"primary"}>
                            <div className={"medical-record-attachment-basic-details-header"}>
                                <div className={"medical-record-attachment-basic-details-name-status-wrapper"}>
                                    <div className={"medical-record-attachment-basic-details-name"}>
                                        {CommonService.extractName(appointmentDetails.client_details)}
                                    </div>
                                    <div className={"medical-record-attachment-basic-details-status"}>
                                        <ChipComponent label={appointmentDetails?.status}
                                                       className={appointmentDetails?.status}/>
                                    </div>
                                </div>
                            </div>
                            <MedicalInterventionLinkedToComponent
                                label={"Appointment Linked to:"}
                                medicalRecordDetails={appointmentDetails.medicalRecordDetails}/>

                            <div className={"ts-row"}>
                                <div className="ts-col-md-6 ts-col-lg-3">
                                    <DataLabelValueComponent label={"Appointment Date/Time"}>
                                        {appointmentDetails.appointment_date ? CommonService.getSystemFormatTimeStamp(appointmentDetails.appointment_date) : "-"}
                                    </DataLabelValueComponent>
                                </div>
                                <div className="ts-col-md-6 ts-col-lg-3">
                                    <DataLabelValueComponent label={"Appointment Type"}>
                                        {appointmentDetails?.appointment_type}
                                    </DataLabelValueComponent>
                                </div>

                                <div className="ts-col-md-6 ts-col-lg-3">
                                    <DataLabelValueComponent label={"Provider"}>
                                        {CommonService.extractName(appointmentDetails?.provider_details)}
                                    </DataLabelValueComponent>
                                </div>

                                <div className="ts-col-md-6 ts-col-lg-3">
                                    <DataLabelValueComponent label={"Appointment Booked By"}>
                                        {appointmentDetails?.service_details?.name}
                                    </DataLabelValueComponent>
                                </div>

                            </div>

                        </CardComponent>
                    </div>

                    <div className={'medical-record-document-attachment'}>
                        {
                            appointmentDetails?.attachment &&
                            <AttachmentComponent
                                attachment={appointmentDetails?.attachment}
                            />
                        }
                    </div>
                </>
            }
        </div>
    );

};

export default ClientAppointmentDetailsComponent;