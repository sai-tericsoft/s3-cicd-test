import "./MedicalRecordBasicDetailsCardComponent.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import {useNavigate, useParams} from "react-router-dom";
import {getClientMedicalRecord} from "../../../store/actions/client.action";
import {IRootReducerState} from "../../../store/reducers";
import {CommonService} from "../../../shared/services";
import ModalComponent from "../../../shared/components/modal/ModalComponent";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {ImageConfig, Misc} from "../../../constants";
import DrawerComponent from "../../../shared/components/drawer/DrawerComponent";
import EditMedicalRecordComponent from "../edit-medical-record/EditMedicalRecordComponent";
import {ListItem} from "@mui/material";
import MenuDropdownComponent from "../../../shared/components/menu-dropdown/MenuDropdownComponent";
import AddSurgeryRecordComponent from "../add-surgery-record/AddSurgeryRecordComponent";
import AddBasicProgressReportComponent from "../add-basic-progress-report/AddBasicProgressReportComponent";
import {getMedicalRecordStats, refreshMedicalRecordAttachmentList} from "../../../store/actions/chart-notes.action";
import MedicalRecordStatsComponent from "../medical-record-stats/MedicalRecordStatsComponent";
import MedicalInterventionLinkedToComponent
    from "../medical-intervention-linked-to/MedicalInterventionLinkedToComponent";
import AddMedicalRecordDocumentComponent from "../add-medical-record-document/AddMedicalRecordDocumentComponent";
import TransferMedicalRecordComponent from "../transfer-medical-record/TransferMedicalRecordComponent";

const MedicalInterventionFormInitialValues: any = {
    intervention_date: new Date(),
    subjective: "",
    plan: {
        plan: "",
        md_recommendations: "",
        education: "",
        treatment_goals: "",
    },
    assessment: {
        suspicion_index: '',
        surgery_procedure: ''
    },
    objective: {
        observation: "",
        palpation: "",
        functional_tests: "",
        treatment: "",
        treatment_response: ""
    },
    is_discharge: true,
};

interface ClientMedicalDetailsCardComponentProps {
    showAction?: boolean
}

const MedicalRecordBasicDetailsCardComponent = (props: ClientMedicalDetailsCardComponentProps) => {

    const {showAction} = props;
    const {medicalRecordId} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isSurgeryAddOpen, setIsSurgeryAddOpen] = React.useState<boolean>(false);
    const [isEditMedicalRecordDrawerOpen, setIsEditMedicalRecordDrawerOpen] = useState<boolean>(false);
    const [isProgressReportDrawerOpen, setIsProgressReportDrawerOpen] = useState<boolean>(false);
    const [isMedicalRecordDocumentAddDrawerOpen, setIsMedicalRecordDocumentAddDrawerOpen] = useState<boolean>(false);
    const [isMedicalRecordStatsModalOpen, setIsMedicalRecordStatsModalOpen] = useState<boolean>(false);
    const [isTransferMedicalRecordDrawerOpen, setIsTransferMedicalRecordDrawerOpen] = useState<boolean>(false);

    const {
        clientMedicalRecord,
        isClientMedicalRecordLoading,
        isClientMedicalRecordLoaded,
        isClientMedicalRecordLoadingFailed
    } = useSelector((state: IRootReducerState) => state.client);

    useEffect(() => {
        if (medicalRecordId) {
            dispatch(getClientMedicalRecord(medicalRecordId));
            dispatch(getMedicalRecordStats(medicalRecordId));
        }
    }, [medicalRecordId, dispatch]);

    useEffect(() => {
        if (clientMedicalRecord?.client_id) {
            dispatch(setCurrentNavParams("Medical Record details", null, () => {
                navigate(CommonService._routeConfig.MedicalRecordList(clientMedicalRecord?.client_id));
            }));
        }
    }, [navigate, dispatch, clientMedicalRecord?.client_id]);

    const comingSoon = useCallback(
        () => {
            CommonService._alert.showToast('Coming Soon!', 'info')
        }, []);

    const openEditMedicalRecordDrawer = useCallback(() => {
        setIsEditMedicalRecordDrawerOpen(true);
    }, []);

    const closeEditMedicalRecordDrawer = useCallback(() => {
        setIsEditMedicalRecordDrawerOpen(false);
    }, []);

    const openTransferMedicalRecordDrawer = useCallback(() => {
        setIsTransferMedicalRecordDrawerOpen(true);
    }, []);

    const closeTransferMedicalRecordDrawer = useCallback(() => {
        setIsTransferMedicalRecordDrawerOpen(false);
    }, []);

    const handleMedicalRecordEdit = useCallback(() => {
        closeEditMedicalRecordDrawer();
        if (medicalRecordId) {
            dispatch(getClientMedicalRecord(medicalRecordId));
        }
    }, [dispatch, medicalRecordId, closeEditMedicalRecordDrawer]);

    const openAddSurgeryRecord = useCallback(() => {
        setIsSurgeryAddOpen(true)
    }, []);

    const addProgressRecord = useCallback(() => {
        setIsProgressReportDrawerOpen(true);
    }, []);

    const openMedicalRecordStatsModal = useCallback(() => {
        setIsMedicalRecordStatsModalOpen(true);
    }, []);

    const closeMedicalRecordStatsModal = useCallback(() => {
        setIsMedicalRecordStatsModalOpen(false);
    }, []);

    const openMedicalRecordDocumentAddDrawer = useCallback(() => {
        setIsMedicalRecordDocumentAddDrawerOpen(true);
    }, []);

    const closeMedicalRecordDocumentAddDrawer = useCallback(() => {
        setIsMedicalRecordDocumentAddDrawerOpen(false);
    }, []);

    const handleMedicalRecordDocumentAdd = useCallback(() => {
        dispatch(refreshMedicalRecordAttachmentList());
        closeMedicalRecordDocumentAddDrawer();
    }, [dispatch, closeMedicalRecordDocumentAddDrawer]);

    const handleSurgeryRecordAdd = useCallback(() => {
        dispatch(refreshMedicalRecordAttachmentList());
        setIsSurgeryAddOpen(false);
    }, [dispatch]);

    const handleDischargeCase = useCallback(() => {
        if (medicalRecordId) {
            CommonService._chartNotes.AddNewMedicalInterventionAPICall(medicalRecordId, MedicalInterventionFormInitialValues)
                .then((response) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY] || "Successfully created discharging intervention", "success");
                    navigate(CommonService._routeConfig.AddMedicalIntervention(medicalRecordId, response.data._id));
                }).catch((error) => {
                CommonService._alert.showToast(error?.error || "Error discharging the case", "error");
            });
        }
    }, [medicalRecordId, navigate]);

    const handleNotifyAdmin = useCallback(() => {
        if (medicalRecordId) {
            CommonService._chartNotes.MedicalRecordNotifyAdminAPICall(medicalRecordId, {})
                .then((response) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY] || "Successfully Notify the admin", "success");
                }).catch((error) => {
                CommonService._alert.showToast(error?.error || "Error Notifying the admin", "error");
            });
        }
    }, [medicalRecordId]);


    const handleMedicalRecordTransfer = useCallback(() => {
        closeTransferMedicalRecordDrawer();
        if (medicalRecordId) {
            dispatch(getClientMedicalRecord(medicalRecordId));
        }
    }, [closeTransferMedicalRecordDrawer, medicalRecordId, dispatch]);

    return (
        <div className={'client-medical-details-card-component'}>
            <>
                {
                    !medicalRecordId &&
                    <StatusCardComponent title={"Medical Record ID missing. Cannot fetch Medical Record  details"}/>
                }
            </>
            {
                medicalRecordId && <>
                    {
                        isClientMedicalRecordLoading && <div>
                            <LoaderComponent/>
                        </div>
                    }
                    {
                        isClientMedicalRecordLoadingFailed &&
                        <StatusCardComponent title={"Failed to fetch client medical record Details"}/>
                    }

                    {
                        (isClientMedicalRecordLoaded && clientMedicalRecord) && <>
                            <CardComponent color={'primary'}>
                                <div className={'client-name-button-wrapper'}>
                                    <span className={'client-name-wrapper'}>
                                        <span className={'client-name'}>
                                                {clientMedicalRecord?.client_details?.first_name || "-"} {clientMedicalRecord?.client_details?.last_name || "-"}
                                        </span>
                                        <ChipComponent
                                            className={clientMedicalRecord?.status === "open" ? "active" : "inactive"}
                                            size={'small'}
                                            label={clientMedicalRecord?.status || "-"}/>
                                    </span>
                                    <div className="ts-row width-auto">
                                        <div className="">
                                            <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>}
                                                             onClick={openEditMedicalRecordDrawer}>
                                                Edit Details
                                            </ButtonComponent>
                                        </div>
                                        {showAction && <div className="ts-col">
                                            <MenuDropdownComponent menuBase={
                                                <ButtonComponent variant={'outlined'}
                                                                 suffixIcon={<ImageConfig.SelectDropDownIcon/>}
                                                                 fullWidth={true}>
                                                    Select Action
                                                </ButtonComponent>
                                            } menuOptions={
                                                [
                                                    <ListItem onClick={openAddSurgeryRecord}>
                                                        Add Surgery Record
                                                    </ListItem>,
                                                    <ListItem onClick={addProgressRecord}>
                                                        Add Progress Report
                                                    </ListItem>,
                                                    <ListItem onClick={openTransferMedicalRecordDrawer}>
                                                        Transfer File
                                                    </ListItem>,
                                                    <ListItem onClick={handleNotifyAdmin} >
                                                       Notify Admin
                                                    </ListItem>,
                                                    <ListItem onClick={openMedicalRecordStatsModal}>
                                                        View Case Statistics
                                                    </ListItem>,
                                                    <ListItem onClick={openMedicalRecordDocumentAddDrawer}>
                                                        Add Document
                                                    </ListItem>,
                                                    <ListItem onClick={comingSoon}>
                                                        View Exercise Record
                                                    </ListItem>,
                                                    // <Link
                                                    //     to={CommonService._routeConfig.MedicalRecordViewExerciseRecord(medicalRecordId)}>
                                                    //     <ListItem>
                                                    //         View Exercise Record
                                                    //     </ListItem>
                                                    // </Link>,
                                                    <ListItem onClick={handleDischargeCase}>
                                                        Discharge Case
                                                    </ListItem>
                                                ]
                                            }/>
                                        </div>}
                                    </div>
                                </div>
                                <MedicalInterventionLinkedToComponent medicalRecordDetails={clientMedicalRecord}/>
                                <div className={'ts-row'}>
                                    <div className={'ts-col-md-4 ts-col-lg'}>
                                        <DataLabelValueComponent label={'Date of Onset'}>
                                            {clientMedicalRecord?.onset_date ? CommonService.getSystemFormatTimeStamp(clientMedicalRecord?.onset_date) : "NA"}
                                        </DataLabelValueComponent>
                                    </div>
                                    <div className={'ts-col-md-4 ts-col-lg'}>
                                        <DataLabelValueComponent label={'Date of Surgery'}>
                                            {clientMedicalRecord?.surgery_date ? CommonService.getSystemFormatTimeStamp(clientMedicalRecord?.surgery_date) : "NA"}
                                        </DataLabelValueComponent>
                                    </div>
                                    <div className={'ts-col-md-4 ts-col-lg'}>
                                        <DataLabelValueComponent label={'Case Physician'}>
                                            {clientMedicalRecord?.case_physician.name || "-"}
                                        </DataLabelValueComponent>
                                    </div>
                                    <div className={'ts-col-md-4 ts-col-lg'}>
                                        <DataLabelValueComponent label={'Next MD Appointment'}>
                                            {clientMedicalRecord?.next_md_appointment ? CommonService.getSystemFormatTimeStamp(clientMedicalRecord?.next_md_appointment) : "NA"}
                                        </DataLabelValueComponent>
                                    </div>
                                    <div className={'ts-col-md-4 ts-col-lg'}>
                                        <DataLabelValueComponent label={'Total Direct Minutes'}>
                                            {clientMedicalRecord?.total_direct_minutes || "-"}
                                        </DataLabelValueComponent>
                                    </div>
                                </div>
                                <div className={'ts-row'}>
                                    <div className={'ts-col-md-4 ts-col-lg'}>
                                        <DataLabelValueComponent label={'Injury/Condition Description'}>
                                            {clientMedicalRecord?.injury_description || "-"}
                                        </DataLabelValueComponent>
                                    </div>
                                    <div className={'ts-col-md-4 ts-col-lg'}/>
                                    <div className={'ts-col-md-4 ts-col-lg'}>
                                        <DataLabelValueComponent label={'Restrictions and Limitations'}>
                                            {clientMedicalRecord?.limitations || "-"}
                                        </DataLabelValueComponent>
                                    </div>
                                    <div className={'ts-col-md-4 ts-col-lg'}/>
                                    <div className={'ts-col-md-4 ts-col-lg'}/>
                                </div>
                            </CardComponent>
                        </>
                    }

                    {/*Add Surgery Record drawer start*/}
                    <DrawerComponent isOpen={isSurgeryAddOpen}
                                     showClose={true}
                                     onClose={setIsSurgeryAddOpen.bind(null, false)}
                                     className={"t-surgery-record-drawer"}
                    >
                        <AddSurgeryRecordComponent medicalRecordId={medicalRecordId}
                                                   medicalRecordDetails={clientMedicalRecord}
                                                   onSave={handleSurgeryRecordAdd}/>
                    </DrawerComponent>
                    {/*Add Surgery Record end*/}

                    {/*Edit medical record drawer start*/}
                    <DrawerComponent isOpen={isEditMedicalRecordDrawerOpen}
                                     showClose={true}
                                     onClose={closeEditMedicalRecordDrawer}>
                        <EditMedicalRecordComponent medicalRecordId={medicalRecordId}
                                                    medicalRecordDetails={clientMedicalRecord}
                                                    onSave={handleMedicalRecordEdit}/>
                    </DrawerComponent>
                    {/*Edit medical record drawer end*/}

                    {/*Add progress record drawer start*/}
                    <DrawerComponent isOpen={isProgressReportDrawerOpen}
                                     showClose={true}
                                     closeOnEsc={false}
                                     closeOnBackDropClick={false}
                                     onClose={() => setIsProgressReportDrawerOpen(false)}>
                        <AddBasicProgressReportComponent
                            onCancel={() => setIsProgressReportDrawerOpen(false)}
                        />
                    </DrawerComponent>
                    {/*Add progress record drawer end*/}

                    {/*Medical record statistics  modal start*/}
                    <ModalComponent isOpen={isMedicalRecordStatsModalOpen}
                                    title={"Case Statistics"}
                                    onClose={closeMedicalRecordStatsModal}
                                    modalFooter={<>
                                        <ButtonComponent onClick={closeMedicalRecordStatsModal}>Close</ButtonComponent>
                                    </>
                                    }
                    >
                        <MedicalRecordStatsComponent/>
                    </ModalComponent>
                    {/*Medical record statistics  modal end*/}

                    {/*Add medical record document drawer start*/}
                    <DrawerComponent isOpen={isMedicalRecordDocumentAddDrawerOpen}
                                     showClose={true}
                                     onClose={() => closeMedicalRecordDocumentAddDrawer()}>
                        <AddMedicalRecordDocumentComponent
                            onAdd={handleMedicalRecordDocumentAdd}
                            medicalRecordId={medicalRecordId}
                            medicalRecordDetails={clientMedicalRecord}
                        />
                    </DrawerComponent>
                    {/*Add medical record document drawer end*/}

                    {/*Transfer medical record drawer start*/}
                    <DrawerComponent isOpen={isTransferMedicalRecordDrawerOpen}
                                     showClose={true}
                                     onClose={() => closeTransferMedicalRecordDrawer()}>
                        <TransferMedicalRecordComponent medicalRecordId={medicalRecordId}
                                                        onMedicalRecordTransfer={handleMedicalRecordTransfer}/>
                    </DrawerComponent>
                    {/*Transfer medical record drawer end*/}

                </>

            }
        </div>
    );
};


export default MedicalRecordBasicDetailsCardComponent;
