import "./ClientAppointmentDetailsComponent.scss";
import React, {useCallback, useEffect, useState} from "react";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import AttachmentComponent from "../../../shared/attachment/AttachmentComponent";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {useDispatch} from "react-redux";
import ClientAllFormsListComponent from "../client-all-forms-list/ClientAllFormsListComponent";
import commonService from "../../../shared/services/common.service";

interface ClientAppointmentDetailsComponentProps {

}

const ClientAppointmentDetailsComponent = (props: ClientAppointmentDetailsComponentProps) => {
    const {clientAppointmentId} = useParams();
    const [appointmentDetails, setAppointmentDetails] = useState<any | null>(null);
    const [isAppointmentDetailsLoading, setIsAppointmentDetailsLoading] = useState<boolean>(false);
    const [isAppointmentDetailsFailed, setIsAppointmentDetailsFailed] = useState<boolean>(false);
    const [isAppointmentDetailsLoaded, setIsAppointmentDetailsLoaded] = useState<boolean>(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

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
        if (appointmentDetails) {
            const referrer: any = searchParams.get("referrer");
            dispatch(setCurrentNavParams("Appointments", null, () => {
                if (referrer) {
                    navigate(referrer);
                } else {
                    navigate(CommonService._routeConfig.ClientAppointments(appointmentDetails.client_id));
                }
            }));
        }
    }, [navigate, dispatch, searchParams, appointmentDetails]);

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
                                        <span
                                            className={appointmentDetails?.client_details?.is_alias_name_set ? 'alias-name' : ''}> {CommonService.extractName(appointmentDetails.client_details)}</span>
                                    </div>
                                    <div className={"medical-record-attachment-basic-details-status"}>
                                        <ChipComponent label={appointmentDetails?.status}
                                                       className={appointmentDetails?.status}/>
                                    </div>
                                </div>
                            </div>
                            {/*<MedicalInterventionLinkedToComponent*/}
                            {/*    label={"Appointment Linked to:"}*/}
                            {/*    medicalRecordDetails={appointmentDetails.case_details}/>*/}
                            <DataLabelValueComponent direction={'row'} label={'Appointment Linked to:'}>
                                {/*{appointmentDetails?.intervention_linked_to}*/}
                                {appointmentDetails?.case_details?.case_date && CommonService.convertDateFormat2(appointmentDetails?.created_at)}{" "}
                                {"-"} {appointmentDetails?.case_details?.injury_details?.map((injury: any, index: number) => {
                                return <>{injury.body_part_details.name} {injury.body_side ? `(${injury.body_side})` : ''} {index !== appointmentDetails?.case_details?.injury_details.length - 1 ? <> | </> : ""}</>
                            })}
                            </DataLabelValueComponent>

                            <div className={"ts-row"}>
                                <div className="ts-col-md-6 ts-col-lg-3">
                                    <DataLabelValueComponent label={"Appointment Date/Time"}>
                                        {appointmentDetails.appointment_date ? CommonService.getSystemFormatTimeStamp(appointmentDetails.appointment_date) : "-"}
                                    </DataLabelValueComponent>
                                </div>
                                <div className="ts-col-md-6 ts-col-lg-3">
                                    <DataLabelValueComponent label={"Appointment Type"}>
                                        {CommonService.capitalizeFirstLetterAndRemoveUnderScore(appointmentDetails?.appointment_type)}
                                    </DataLabelValueComponent>
                                </div>

                                <div className="ts-col-md-6 ts-col-lg-3">
                                    <DataLabelValueComponent label={"Provider"}>
                                        {CommonService.extractName(appointmentDetails?.provider_details)}
                                    </DataLabelValueComponent>
                                </div>

                                <div className="ts-col-md-6 ts-col-lg-3">
                                    <DataLabelValueComponent label={"Appointment Booked By"}>
                                        {
                                            appointmentDetails?.booked_by_details?.first_name ?  commonService.capitalizeFirstLetterOfEachWord(appointmentDetails?.booked_by_details?.first_name + " " + appointmentDetails?.booked_by_details?.last_name) : "N/A"
                                        }
                                    </DataLabelValueComponent>
                                </div>

                            </div>

                        </CardComponent>
                    </div>

                    <ClientAllFormsListComponent clientId={appointmentDetails?.client_id}
                                                 appointmentId={clientAppointmentId}/>

                    <div className={'medical-record-document-attachment'}>
                        {
                            appointmentDetails?.attachment?.length && appointmentDetails?.attachment &&
                            <AttachmentComponent
                                attachment={appointmentDetails?.attachment}
                            />
                        }
                        {
                            appointmentDetails?.attachment?.length === 0 &&
                            <StatusCardComponent title={'No Attachments'}/>
                        }
                    </div>
                </>
            }
        </div>
    );

};

export default ClientAppointmentDetailsComponent;
