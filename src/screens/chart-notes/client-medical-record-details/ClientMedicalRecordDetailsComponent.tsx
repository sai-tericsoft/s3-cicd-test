import "./ClientMedicalRecordDetailsComponent.scss";
import MedicalRecordBasicDetailsCardComponent
    from "../medical-record-basic-details-card/MedicalRecordBasicDetailsCardComponent";
import MedicalInterventionListComponent from "../medical-intervention-list/MedicalInterventionListComponent";
import MedicalRecordAttachmentListComponent
    from "../medical-record-attachment-list/MedicalRecordAttachmentListComponent";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import React, {useCallback, useEffect, useState} from "react";
import TabsWrapperComponent, {
    TabComponent,
    TabContentComponent,
    TabsComponent
} from "../../../shared/components/tabs/TabsComponent";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {ImageConfig, Misc} from "../../../constants";
import moment from "moment/moment";
import {getMedicalInterventionList} from "../../../store/actions/chart-notes.action";
import {IRootReducerState} from "../../../store/reducers";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import ModalComponent from "../../../shared/components/modal/ModalComponent";
import SelectComponent from "../../../shared/components/form-controls/select/SelectComponent";
import {getAppointmentListLite} from "../../../store/actions/appointment.action";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import DrawerComponent from "../../../shared/components/drawer/DrawerComponent";
import BookAppointmentFormComponent
    from "../../../shared/components/book-appointment/book-appointment-form/BookAppointmentFormComponent";

const REPEAT_LAST_TREATMENT = "repeat_last_treatment";
const ADD_NEW_TREATMENT = "add_new_treatment";

interface ClientMedicalDetailsComponentProps {

}

type MedicalListTabType = "medicalRecord" | "attachmentList";

const MedicalListTabTypes: any = ["medicalRecord", "attachmentList"];

const ClientMedicalRecordDetailsComponent = (props: ClientMedicalDetailsComponentProps) => {
    const [currentTab, setCurrentTab] = useState<MedicalListTabType>("medicalRecord");
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const {medicalRecordId}: any = useParams();
    const dispatch = useDispatch();
    const {
        medicalInterventionList,
        isMedicalInterventionListLoading,
    } = useSelector((state: IRootReducerState) => state.chartNotes);
    const [isMedicalInterventionBeingAdded, setIsMedicalInterventionBeingAdded] = useState<boolean>(false);
    const [isMedicalInterventionBeingRepeated, setIsMedicalInterventionBeingRepeated] = useState<boolean>(false);
    const [isAddTreatmentModalOpen, setIsAddTreatmentModalOpen] = useState<boolean>(false);
    const [isAppointmentSelectionModalOpen, setIsAppointmentSelectionModalOpen] = useState<boolean>(false);
    const [selectedAppointment, setSelectedAppointment] = useState<any>();
    const [isTreatmentWithoutAppointmentModalOpen, setIsTreatmentWithoutAppointmentModalOpen] = useState<boolean>(false);
    const [isBookAppointmentOpen, setIsBookAppointmentOpen] = useState<boolean>(false);
    const [selectedClient, setSelectedClient] = useState<any | null>(null);
    const [isBookingLoading, setIsBookingLoading] = useState<boolean>(false);
    const [appointmentMode, setAppointmentMode] = useState<string>()

    const {
        clientMedicalRecord,
    } = useSelector((state: IRootReducerState) => state.client);

    const {
        isAppointmentListLiteLoading,
        isAppointmentListLiteLoaded,
        isAppointmentListLiteLoadingFailed,
        appointmentListLite,
    } = useSelector((state: IRootReducerState) => state.appointments);

    const getAppointmentLite = useCallback(() => {
        if (clientMedicalRecord && clientMedicalRecord.client_id) {
            const payload = {client_id: clientMedicalRecord.client_id};
            dispatch(getAppointmentListLite(payload));
        }
    }, [clientMedicalRecord, dispatch])


    useEffect(() => {
        getAppointmentLite();
    }, [clientMedicalRecord, getAppointmentLite]);

    useEffect(() => {
        if (clientMedicalRecord?.client_details) {
            setSelectedClient(clientMedicalRecord?.client_details);
        }
    }, [clientMedicalRecord])

    const handleTabChange = useCallback((e: any, value: any) => {
        searchParams.set("activeTab", value);
        setSearchParams(searchParams);
        setCurrentTab(value);
    }, [searchParams, setSearchParams]);

    useEffect(() => {
        const step: MedicalListTabType = searchParams.get("activeTab") as MedicalListTabType;
        if (step && MedicalListTabTypes.includes(step)) {
            setCurrentTab(step);
        } else {
            searchParams.set("activeTab", MedicalListTabTypes[0]);
            setSearchParams(searchParams);
        }
    }, [dispatch, searchParams, setSearchParams]);

    const repeatLastTreatment = useCallback(
        (is_link_to_appointment: boolean) => {
            if (!medicalRecordId) {
                CommonService._alert.showToast('Medical Record ID not found!', "error");
                return;
            }
            setIsMedicalInterventionBeingRepeated(true);
            const payload = {
                is_link_to_appointment: is_link_to_appointment,
                appointment_id: selectedAppointment,
                "repeat_previous": true //todo: Why Swetha ????
            }
            CommonService._chartNotes.RepeatLastInterventionAPICall(medicalRecordId, payload
            ).then((response: IAPIResponseType<any>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                navigate(CommonService._routeConfig.UpdateMedicalIntervention(medicalRecordId, response?.data._id) + '?showClear=true');
                setIsMedicalInterventionBeingRepeated(false);
                selectedAppointment(null)
            }).catch((error: any) => {
                CommonService._alert.showToast(error?.error || "Error repeating last medical intervention", "error");
                setIsMedicalInterventionBeingRepeated(false);
            });
        },
        [navigate, selectedAppointment, medicalRecordId],
    );
    // const confirmRepeatLastTreatment = useCallback(
    //     () => {
    //         if (!medicalRecordId) {
    //             CommonService._alert.showToast('Medical Record ID not found!', "error");
    //             return;
    //         }
    //         CommonService.onConfirm({
    //             confirmationTitle: "REPEAT LAST TREATMENT",
    //             image: ImageConfig.REPEAT_LAST_INTERVENTION,
    //             confirmationSubTitle: "Do you want to repeat the last treatment\nfrom the same Medical Record?"
    //         })
    //             .then((value) => {
    //                 repeatLastTreatment(medicalRecordId);
    //             })
    //             .catch(reason => {
    //
    //             })
    //     },
    //     [medicalRecordId, repeatLastTreatment],
    // );

    const addNewTreatment = useCallback(
        (is_link_to_appointment: boolean) => {
            if (!medicalRecordId) {
                CommonService._alert.showToast('Medical Record ID not found!', "error");
                return;
            }
            const payload = {
                "intervention_date": moment().format('YYYY-MM-DD'),
                "subjective": "",
                "objective": {
                    "observation": "",
                    "palpation": "",
                    "functional_tests": "",
                    "treatment": "",
                    "treatment_response": ""
                },
                "assessment": {
                    "suspicion_index": "",
                    "surgery_procedure": ""
                },
                "plan": {
                    "plan": "",
                    "md_recommendations": "",
                    "education": "",
                    "treatment_goals": ""
                },
                is_discharge: false,
                is_link_to_appointment: is_link_to_appointment,
                appointment_id: selectedAppointment,
            };
            setIsMedicalInterventionBeingAdded(true);
            CommonService._chartNotes.AddNewMedicalInterventionAPICall(medicalRecordId, payload)
                .then((response: IAPIResponseType<any>) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    navigate(CommonService._routeConfig.UpdateMedicalIntervention(medicalRecordId, response?.data._id));
                    setIsMedicalInterventionBeingAdded(false);
                    selectedAppointment(null)
                })
                .catch((error: any) => {
                    CommonService._alert.showToast(error?.error || "Error creating a medical intervention", "error");
                    setIsMedicalInterventionBeingAdded(false);
                });
        },
        [medicalRecordId, navigate, selectedAppointment],
    );

    useEffect(() => {
        if (medicalRecordId) {
            dispatch(getMedicalInterventionList(medicalRecordId));
        }
    }, [dispatch, medicalRecordId]);
    console.log('medicalInterventionList', medicalInterventionList);

    const createBooking = useCallback(
        (booking: any) => {
            setIsBookingLoading(true)
            //medical_record_id
            const payload: any = {
                client_id: booking.client._id,
                category_id: booking.service_category._id,
                service_id: booking.service._id,
                provider_id: booking.provider.provider_id,
                appointment_type: booking.appointment_type,
                consultation_id: booking.duration._id,
                appointment_date: booking.date,
                duration: parseInt(booking.duration.duration),
                start_time: booking.time.start_min,
                end_time: booking.time.end_min,

            }
            CommonService._appointment.addAppointment(payload)
                .then((response: IAPIResponseType<any>) => {
                    if (response) {
                        getAppointmentLite();
                    }
                })
                .catch((error: any) => {
                    // CommonService.handleErrors(errors);
                })
                .finally(() => {
                    setIsBookingLoading(true)
                })
        },
        [getAppointmentLite],
    );

    return (
        <div className={'client-medical-record-details-component'}>
            <PageHeaderComponent title={"Medical Record Main Page"} className={'mrg-left-10'}/>
            <MedicalRecordBasicDetailsCardComponent showAction={true}/>
            <div className={'client-medical-records-header-button-wrapper'}>
                {clientMedicalRecord?.status_details?.code === 'open' && <div>
                    <ButtonComponent onClick={() => {
                        setIsAddTreatmentModalOpen(true)
                        setAppointmentMode(REPEAT_LAST_TREATMENT)
                    }}
                                     disabled={(isMedicalInterventionBeingRepeated || isMedicalInterventionListLoading || medicalInterventionList.filter((item: any) => (item?.status === 'completed' && item?.note_type?.toLowerCase() === "soap note"))?.length === 0)}
                                     className={'mrg-right-10'}
                                     variant={"outlined"}>
                        Repeat Last Treatment
                    </ButtonComponent>
                    <ButtonComponent onClick={() => {
                        setAppointmentMode(ADD_NEW_TREATMENT)
                        setIsAddTreatmentModalOpen(true)
                    }}
                                     disabled={isMedicalInterventionBeingAdded}
                                     isLoading={isMedicalInterventionBeingAdded}
                                     prefixIcon={<ImageConfig.AddIcon/>}>
                        Add New Treatment
                    </ButtonComponent>
                </div>}
            </div>
            <TabsWrapperComponent>
                <TabsComponent value={currentTab} onUpdate={handleTabChange} variant={"fullWidth"}
                               allowScrollButtonsMobile={false}>

                    <TabComponent label={'Medical Record'} className={'tab-heading'} value={"medicalRecord"}/>
                    <TabComponent label={'Attachments'} className={'tab-heading'} value={"attachmentList"}/>

                </TabsComponent>
                <TabContentComponent value={"medicalRecord"} selectedTab={currentTab}>
                    <MedicalInterventionListComponent/>
                </TabContentComponent>
                <TabContentComponent value={"attachmentList"} selectedTab={currentTab}>
                    <MedicalRecordAttachmentListComponent/>
                </TabContentComponent>
            </TabsWrapperComponent>


            <ModalComponent title={""}
                            size={'xs'}
                            className={'add-new-treatment-modal'}
                            isOpen={isAddTreatmentModalOpen}
                            showClose={true}
                            onClose={() => {
                                setIsAddTreatmentModalOpen(false)
                            }}>
                <>
                    <div className="add-new-treatment-modal-header">
                        {appointmentMode === REPEAT_LAST_TREATMENT ? 'Repeat Last Treatment' : 'Add New Treatment'}
                    </div>
                    <ButtonComponent
                        className={'mrg-top-10 mrg-bottom-10'}
                        fullWidth={true}
                        onClick={() => {
                            setIsAddTreatmentModalOpen(false)
                            setIsAppointmentSelectionModalOpen(true)
                        }}>
                        With Appointment
                    </ButtonComponent>

                    <ButtonComponent
                        className={'mrg-top-10 mrg-bottom-10'}
                        onClick={() => {
                            setIsAddTreatmentModalOpen(false)
                            setIsTreatmentWithoutAppointmentModalOpen(true);
                        }}
                        fullWidth={true}>
                        Without Appointment
                    </ButtonComponent>
                </>

            </ModalComponent>


            <ModalComponent isOpen={isAppointmentSelectionModalOpen}
                            className={'select-appointment-modal'}
                            modalFooter={<>
                                <ButtonComponent variant={'contained'}
                                                 color={'primary'}
                                                 disabled={!selectedAppointment}
                                                 onClick={() => {
                                                     if (appointmentMode === REPEAT_LAST_TREATMENT) {
                                                         repeatLastTreatment(true)
                                                     } else {
                                                         addNewTreatment(true)
                                                     }
                                                 }
                                                 }
                                >
                                    Proceed
                                </ButtonComponent>
                            </>
                            }
            >
                <div className="drawer-header">
                    <div className="back-btn" onClick={() => {
                        setIsAppointmentSelectionModalOpen(false)
                        setIsAddTreatmentModalOpen(true)
                    }}><ImageConfig.LeftArrow/>BACK
                    </div>
                </div>
                <div className="select-appointment-modal-body">
                    <div className="select-appointment-modal-header">Please select the appointment</div>

                    {
                        isAppointmentListLiteLoading && <div>
                            <LoaderComponent/>
                        </div>
                    }
                    {
                        isAppointmentListLiteLoadingFailed &&
                        <StatusCardComponent title={"Failed to fetch Appointment list"}/>
                    }
                    {isAppointmentListLiteLoaded && <SelectComponent
                        options={appointmentListLite || []}
                        fullWidth={true}
                        required={true}
                        label={"Select Appointment"}
                        value={selectedAppointment}
                        displayWith={(item: any) => item?.appointment_type_details?.title + '' + (moment(item.appointment_date).format('DD-MMM-YYYY'))}
                        valueExtractor={(item: any) => item?._id}
                        onUpdate={(value: any) => {
                            console.log(value);
                            setSelectedAppointment(value);
                        }
                        }
                    />}
                </div>
            </ModalComponent>

            <ModalComponent isOpen={isTreatmentWithoutAppointmentModalOpen}
                            className={'treatment-without-application-modal'}
                            onClose={() => setIsTreatmentWithoutAppointmentModalOpen(false)}
                            modalFooter={<>
                                <ButtonComponent variant={'outlined'}
                                                 className={'mrg-right-10'}
                                                 onClick={() => {
                                                     setIsTreatmentWithoutAppointmentModalOpen(false)
                                                     setIsBookAppointmentOpen(true)
                                                 }}
                                >
                                    Create Appointment
                                </ButtonComponent>
                                <ButtonComponent variant={'contained'}
                                                 color={'primary'}
                                                 onClick={() => {
                                                     if (appointmentMode === REPEAT_LAST_TREATMENT) {
                                                         repeatLastTreatment(false)
                                                     } else {
                                                         addNewTreatment(false)
                                                     }
                                                 }
                                                 }
                                >
                                    Yes
                                </ButtonComponent>
                            </>
                            }
            >
                <img className="treatment-without-application-icon" src={ImageConfig.RemoveBodyPartConfirmationIcon}
                     alt=""/>
                <div className={'treatment-without-application-info-title'}>
                    CONTINUE WITHOUT APPOINTMENT
                </div>
                <div className={'treatment-without-application-info-description'}>
                    Are you sure you do not require an appointment?
                </div>
            </ModalComponent>

            <DrawerComponent isOpen={isBookAppointmentOpen}
                             onClose={setIsBookAppointmentOpen.bind(null, false)}
                             className={'book-appointment-component-drawer'}>
                <BookAppointmentFormComponent
                    client={selectedClient}
                    isLoading={isBookingLoading}
                    onComplete={
                        (values) => {
                            createBooking(values);
                            setIsBookAppointmentOpen(false)
                        }
                    }
                    onClose={
                        () => {
                            setIsBookAppointmentOpen(false)
                        }
                    }
                />
            </DrawerComponent>

        </div>
    );

};

export default ClientMedicalRecordDetailsComponent;
