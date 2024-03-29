import "./ClientMedicalRecordDetailsComponent.scss";
import MedicalRecordBasicDetailsCardComponent
    from "../medical-record-basic-details-card/MedicalRecordBasicDetailsCardComponent";
import MedicalInterventionListComponent from "../medical-intervention-list/MedicalInterventionListComponent";
import MedicalRecordAttachmentListComponent
    from "../medical-record-attachment-list/MedicalRecordAttachmentListComponent";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import React, {useCallback, useEffect, useState} from "react";
import TabsWrapperComponent, {
    BasicTabsComponent,
    TabComponent,
    TabContentComponent,
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
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import BookAppointmentComponent from "../../../shared/components/book-appointment/BookAppointmentComponent";
import LottieFileGenerationComponent
    from "../../../shared/components/lottie-file-generation/LottieFileGenerationComponent";
import CardComponent from "../../../shared/components/card/CardComponent";

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
    const [appointmentMode, setAppointmentMode] = useState<string>();
    const [refreshToken, setRefreshToken] = useState<string>('');
    const [preFillData, setPreFillData] = useState<any>({});

    const {
        clientMedicalRecord,
    } = useSelector((state: IRootReducerState) => state.client);
    const referrer: any = searchParams.get("referrer");

    const {
        isAppointmentListLiteLoading,
        isAppointmentListLiteLoaded,
        isAppointmentListLiteLoadingFailed,
        appointmentListLite,
    } = useSelector((state: IRootReducerState) => state.appointments);

    const getAppointmentLite = useCallback(() => {
        if (clientMedicalRecord && clientMedicalRecord.client_id) {
            const payload = {
                client_id: clientMedicalRecord.client_id,
                medical_record_id: medicalRecordId,
                is_link_to_intervention: true,
                appointment_type: 'followup_consultation',
            };
            dispatch(getAppointmentListLite(payload));
        }
    }, [clientMedicalRecord, dispatch, medicalRecordId])


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

    useEffect(() => {
        dispatch(setCurrentNavParams("Chart Notes", null, () => {
            console.log("referrer", referrer);
            if (clientMedicalRecord && clientMedicalRecord.client_details._id) {
                if (referrer) {
                    navigate(CommonService._routeConfig.MedicalRecordList(clientMedicalRecord.client_details._id) + '?referrer=' + referrer);
                } else {
                    navigate(CommonService._routeConfig.MedicalRecordList(clientMedicalRecord.client_details._id));
                }
            }
        }));
    }, [navigate, dispatch, searchParams, clientMedicalRecord, referrer]);

    const repeatLastTreatment = useCallback(
        (is_link_to_appointment: boolean, tempMedicalRecordId?: string, tempAppointmentId?: string) => {
            if (!medicalRecordId && !tempMedicalRecordId) {
                CommonService._alert.showToast('Medical Record ID not found!', "error");
                return;
            }
            setIsMedicalInterventionBeingRepeated(true);
            const payload = {
                is_link_to_appointment: is_link_to_appointment,
                appointment_id: tempAppointmentId || selectedAppointment,
                "repeat_previous": true //todo: Why Swetha ????
            }
            CommonService._chartNotes.RepeatLastInterventionAPICall(tempMedicalRecordId || medicalRecordId, payload
            ).then((response: IAPIResponseType<any>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                navigate(CommonService._routeConfig.UpdateMedicalIntervention(tempMedicalRecordId || medicalRecordId, response?.data._id) + '?showClear=true');
                setIsMedicalInterventionBeingRepeated(false);
                setSelectedAppointment(null)
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
        (is_link_to_appointment: boolean, tempMedicalRecordId?: string, tempAppointmentId?: string) => {
            if (!medicalRecordId && !tempMedicalRecordId) {
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
                appointment_id: tempAppointmentId || selectedAppointment,
            };
            setIsMedicalInterventionBeingAdded(true);
            CommonService._chartNotes.AddNewMedicalInterventionAPICall(tempMedicalRecordId || medicalRecordId, payload)
                .then((response: IAPIResponseType<any>) => {
                    // CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    navigate(CommonService._routeConfig.UpdateMedicalIntervention(tempMedicalRecordId || medicalRecordId, response?.data._id) + '?mode=add');
                    setIsMedicalInterventionBeingAdded(false);
                    setSelectedAppointment(null);
                })
                .catch((error: any) => {
                    CommonService._alert.showToast(error?.error || "Error creating a medical intervention", "error");
                })
                .finally(() => {
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

    const handleGetCaseDetails = useCallback((caseDetails: any) => {
        if (caseDetails && caseDetails !== {}) {
            setPreFillData(() => {
                return {
                    category_id: caseDetails?.category_details?._id,
                    service_id: caseDetails?.service_details?._id,
                    appointment_type: "followup_consultation",
                    case: caseDetails,
                }
            });
        }
    }, [setPreFillData]);

    return (
        <div className={'client-medical-record-details-component'}>
            <PageHeaderComponent title={"Medical Record Main Page"}/>
            <MedicalRecordBasicDetailsCardComponent showAction={true} setRefreshToken={setRefreshToken}
                                                    onMedicalRecordDataLoad={handleGetCaseDetails}/>

            <CardComponent className={'list-attachment-wrapper'}>
                <TabsWrapperComponent className={'basic-tabs-wrapper medical-record'}>
                    <BasicTabsComponent value={currentTab} onUpdate={handleTabChange} variant={"fullWidth"}
                                        allowScrollButtonsMobile={false}>

                        <TabComponent label={'Medical Records'} className={'tab-heading'} value={"medicalRecord"}/>
                        <TabComponent label={'Attachments'} className={'tab-heading'} value={"attachmentList"}/>

                    </BasicTabsComponent>
                    <TabContentComponent value={"medicalRecord"} selectedTab={currentTab}>
                        <div className={'client-medical-records-header-button-wrapper'}>
                            {clientMedicalRecord?.status_details?.code === 'open' && <div>
                                <ButtonComponent onClick={() => {
                                    setIsAddTreatmentModalOpen(true)
                                    setAppointmentMode(REPEAT_LAST_TREATMENT)
                                }}
                                                 disabled={(isMedicalInterventionBeingRepeated || isMedicalInterventionListLoading || medicalInterventionList.filter((item: any) => (item?.status === 'completed' && item?.note_type?.toLowerCase() === "soap note"))?.length === 0)}
                                                 className={'mrg-right-10'}
                                                 prefixIcon={<ImageConfig.RepeatIcon/>}
                                                 variant={"outlined"}>
                                    Repeat Last Treatment
                                </ButtonComponent>
                                <ButtonComponent onClick={() => {
                                    setAppointmentMode(ADD_NEW_TREATMENT)
                                    setIsAddTreatmentModalOpen(true)
                                }}
                                                 prefixIcon={<ImageConfig.AddIcon/>}>
                                    Add New Treatment
                                </ButtonComponent>
                            </div>}
                        </div>
                        <MedicalInterventionListComponent refreshToken={refreshToken} referrer={referrer}/>
                    </TabContentComponent>
                    <TabContentComponent value={"attachmentList"} selectedTab={currentTab}>
                        <MedicalRecordAttachmentListComponent refreshToken={refreshToken} referrer={referrer}
                                                              selectedTab={currentTab}/>
                    </TabContentComponent>
                </TabsWrapperComponent>
            </CardComponent>


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
                        Scheduled Appointment
                    </ButtonComponent>

                    <ButtonComponent
                        className={'mrg-top-10 mrg-bottom-10'}
                        onClick={() => {
                            setIsAddTreatmentModalOpen(false)
                            setIsTreatmentWithoutAppointmentModalOpen(true);
                        }}
                        fullWidth={true}>
                        Walk In Client
                    </ButtonComponent>
                </>

            </ModalComponent>


            <ModalComponent isOpen={isAppointmentSelectionModalOpen}
                            className={'select-appointment-modal'}
                            modalFooter={<>
                                <ButtonComponent variant={'contained'}
                                                 color={'primary'}
                                                 disabled={!selectedAppointment || isMedicalInterventionBeingAdded || isMedicalInterventionBeingRepeated}
                                                 isLoading={isMedicalInterventionBeingAdded || isMedicalInterventionBeingRepeated}
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
                        displayWith={(item: any) => item?.appointment_type + ' (' + (moment(item.appointment_date).format('DD-MMM-YYYY')) + ", " + CommonService.getHoursAndMinutesFromMinutes(item?.start_time) + ')'}
                        valueExtractor={(item: any) => item?._id}
                        onUpdate={(value: any) => {
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
                                <ButtonComponent
                                    color={'primary'}
                                    variant={'outlined'}
                                    isLoading={isMedicalInterventionBeingAdded}
                                    onClick={() => {
                                        if (appointmentMode === REPEAT_LAST_TREATMENT) {
                                            repeatLastTreatment(false)
                                        } else {
                                            addNewTreatment(false)
                                        }
                                    }
                                    }
                                >
                                    Continue As Walk In
                                </ButtonComponent>
                                <ButtonComponent
                                    className={'mrg-left-10'}
                                    onClick={() => {
                                        setIsTreatmentWithoutAppointmentModalOpen(false)
                                        setIsBookAppointmentOpen(true)
                                    }}
                                >
                                    Schedule Now
                                </ButtonComponent>
                            </>
                            }
            >
                <LottieFileGenerationComponent loop={true} animationData={ImageConfig.PopupLottie}
                                               autoplay={true}/>
                <div className={'treatment-without-application-info-title mrg-top-10'}>
                    SCHEDULE APPOINTMENT
                </div>
                <div className={'treatment-without-application-info-description'}>
                    Scheduling promotes productivity, so for a better visit, shall we schedule your appointment first?
                </div>
            </ModalComponent>

            <DrawerComponent isOpen={isBookAppointmentOpen}
                             onClose={setIsBookAppointmentOpen.bind(null, false)}
                             className={'book-appointment-component-drawer'}>

                <DrawerComponent isOpen={isBookAppointmentOpen}
                    // showClose={true}
                                 onClose={setIsBookAppointmentOpen.bind(null, false)}
                                 className={'book-appointment-component-drawer'}>
                    <BookAppointmentComponent
                        selectedClient={selectedClient}
                        isComingFromMedicalRecord={true}
                        onComplete={
                            () => {
                                getAppointmentLite();
                                setIsBookAppointmentOpen(false)
                            }
                        }
                        onClose={
                            () => {
                                setIsBookAppointmentOpen(false)
                            }
                        }
                        need_intervention={true}
                        preFillData={preFillData}
                        repeatLastTreatment={(medicalRecordId: string, appointmentId: string) => repeatLastTreatment(true, medicalRecordId, appointmentId)}
                        addNewTreatment={(medicalRecordId: string, appointmentId: string) => addNewTreatment(true, medicalRecordId, appointmentId)}
                    />
                </DrawerComponent>


                {/*<BookAppointmentFormComponent*/}
                {/*    client={selectedClient}*/}
                {/*    isLoading={isBookingLoading}*/}
                {/*    onComplete={*/}
                {/*        (values) => {*/}
                {/*            createBooking(values);*/}
                {/*            setIsBookAppointmentOpen(false)*/}
                {/*        }*/}
                {/*    }*/}
                {/*    onClose={*/}
                {/*        () => {*/}
                {/*            setIsBookAppointmentOpen(false)*/}
                {/*        }*/}
                {/*    }*/}
                {/*/>*/}
            </DrawerComponent>


        </div>
    );

};

export default ClientMedicalRecordDetailsComponent;
