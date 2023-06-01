import "./MedicalRecordBasicDetailsCardComponent.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import {Link, useNavigate, useParams} from "react-router-dom";
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
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import _ from "lodash";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import FormDebuggerComponent from "../../../shared/components/form-debugger/FormDebuggerComponent";

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
    setRefreshToken?:any;
}

const NotifyAdminInitialValues: any = {
    message: "",
}

const MedicalRecordBasicDetailsCardComponent = (props: ClientMedicalDetailsCardComponentProps) => {

    const {showAction,setRefreshToken} = props;
    const {medicalRecordId} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isSurgeryAddOpen, setIsSurgeryAddOpen] = React.useState<boolean>(false);
    const [isEditMedicalRecordDrawerOpen, setIsEditMedicalRecordDrawerOpen] = useState<boolean>(false);
    const [isProgressReportDrawerOpen, setIsProgressReportDrawerOpen] = useState<boolean>(false);
    const [isMedicalRecordDocumentAddDrawerOpen, setIsMedicalRecordDocumentAddDrawerOpen] = useState<boolean>(false);
    const [isMedicalRecordStatsModalOpen, setIsMedicalRecordStatsModalOpen] = useState<boolean>(false);
    const [isTransferMedicalRecordDrawerOpen, setIsTransferMedicalRecordDrawerOpen] = useState<boolean>(false);
    const [medicalRecordMenuOptions, setMedicalRecordMenuOptions] = useState<any[]>([]);
    const [isNotifyModalOpen, setIsNotifyModalOpen] = useState<boolean>(false);
    const [notifyAdminFormInitialValues, setNotifyAdminFormInitialValues] = useState<any>(_.cloneDeep(NotifyAdminInitialValues));
    const [isNotifyAdminProgressIsLoading, setIsNotifyAdminProgressIsLoading] = useState<boolean>(false);
    const [isFullCardOpen, setIsFullCardOpen] = useState<boolean>(false);

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
        if (medicalRecordId) {
            dispatch(getClientMedicalRecord(medicalRecordId));
        }
        setIsSurgeryAddOpen(false);
    }, [dispatch, medicalRecordId]);

    const handleNotifyAdminModalOpen = useCallback(() => {
        setNotifyAdminFormInitialValues(_.cloneDeep(NotifyAdminInitialValues));
        setIsNotifyModalOpen(true);
    }, []);

    const handleNotifyAdminModalClose = useCallback(() => {
        setNotifyAdminFormInitialValues(_.cloneDeep(NotifyAdminInitialValues));
        setIsNotifyModalOpen(false);
    }, []);

    // const closeSurgeryRecordDrawer=useCallback(()=>{
    //     setIsSurgeryAddOpen(false);
    // },[])

    const handleDischargeCase = useCallback(() => {
        if (medicalRecordId) {
            CommonService._chartNotes.AddNewMedicalInterventionAPICall(medicalRecordId, MedicalInterventionFormInitialValues)
                .then((response) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY] || "Successfully created discharging intervention", "success");
                    navigate(CommonService._routeConfig.UpdateMedicalIntervention(medicalRecordId, response.data._id));
                }).catch((error) => {
                CommonService._alert.showToast(error?.error || "Error discharging the case", "error");
            });
        }
    }, [medicalRecordId, navigate]);

    const handleNotifyAdmin = useCallback((values: any, {setErrors, resetForm}: FormikHelpers<any>) => {
        setIsNotifyAdminProgressIsLoading(true);
        if (medicalRecordId) {
            CommonService._chartNotes.MedicalRecordNotifyAdminAPICall(medicalRecordId, values)
                .then((response) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY] || "Successfully Notify the admin", "success");
                    setIsNotifyAdminProgressIsLoading(false);
                    setIsNotifyAdminProgressIsLoading(false);
                    handleNotifyAdminModalClose();
                    resetForm();
                }).catch((error) => {
                CommonService.handleErrors(setErrors, error, true);
                setIsNotifyModalOpen(false);
            });
        }
    }, [medicalRecordId, handleNotifyAdminModalClose]);

    const handleMedicalRecordTransfer = useCallback(() => {
        closeTransferMedicalRecordDrawer();
        if (medicalRecordId) {
            dispatch(getClientMedicalRecord(medicalRecordId));
        }
    }, [closeTransferMedicalRecordDrawer, medicalRecordId, dispatch]);

    const handleMedicalRecordReOpen = useCallback(() => {
        if (medicalRecordId) {
            CommonService._chartNotes.ReOpenMedicalRecordAPICall(medicalRecordId, {})
                .then((response) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY] || "Successfully re-opened the case", "success");
                    dispatch(getClientMedicalRecord(medicalRecordId));
                }).catch((error) => {
                CommonService._alert.showToast(error?.error || "Error re-opening the case", "error");
            });
        }
    }, [medicalRecordId, dispatch]);

    useEffect(() => {
        if (medicalRecordId) {
            if (clientMedicalRecord?.status_details?.code === "open") {
                setMedicalRecordMenuOptions([
                    <ListItem onClick={openAddSurgeryRecord}>
                        Add Surgery Record
                    </ListItem>,
                    <ListItem onClick={addProgressRecord}>
                        Add Progress Report
                    </ListItem>,
                    <ListItem onClick={openTransferMedicalRecordDrawer}>
                        Transfer File To
                    </ListItem>,
                    <ListItem onClick={handleNotifyAdminModalOpen}>
                        Notify Admin
                    </ListItem>,
                    <ListItem onClick={openMedicalRecordStatsModal}>
                        View Case Statistics
                    </ListItem>,
                    <ListItem onClick={openMedicalRecordDocumentAddDrawer}>
                        Add Document
                    </ListItem>,
                    <Link
                        to={CommonService._routeConfig.MedicalRecordViewExerciseRecord(medicalRecordId)}>
                        <ListItem>
                            View Exercise Record
                        </ListItem>
                    </Link>,
                    <ListItem onClick={handleDischargeCase}>
                        Discharge Case
                    </ListItem>
                ]);
            } else {
                setMedicalRecordMenuOptions([
                    <ListItem onClick={openMedicalRecordStatsModal}>
                        View Case Statistics
                    </ListItem>,
                    <Link
                        to={CommonService._routeConfig.MedicalRecordViewExerciseRecord(medicalRecordId)}>
                        <ListItem>
                            View Exercise Record
                        </ListItem>
                    </Link>,
                    <ListItem onClick={handleMedicalRecordReOpen}>
                        Reopen Case
                    </ListItem>
                ]);
            }
        }
    }, [clientMedicalRecord, medicalRecordId, handleMedicalRecordReOpen, openAddSurgeryRecord, addProgressRecord, openTransferMedicalRecordDrawer, handleNotifyAdmin, openMedicalRecordStatsModal, openMedicalRecordDocumentAddDrawer, handleDischargeCase, handleNotifyAdminModalOpen]);

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
                                                {clientMedicalRecord?.client_details?.first_name || "N/A"} {clientMedicalRecord?.client_details?.last_name || "N/A"}
                                        </span>
                                        <ChipComponent
                                            className={clientMedicalRecord?.status === "open" ? "active" : "inactive"}
                                            size={'small'}
                                            label={clientMedicalRecord?.status_details?.title || "N/A"}/>
                                    </span>
                                    <div className="ts-row width-auto">
                                        {
                                            clientMedicalRecord?.status_details?.code === 'open' && <div className="">
                                                <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>}
                                                                 onClick={openEditMedicalRecordDrawer}>
                                                    Edit Details
                                                </ButtonComponent>
                                            </div>
                                        }
                                        {showAction && <div className="ts-col">
                                            <MenuDropdownComponent menuBase={
                                                <ButtonComponent variant={'outlined'}
                                                                 suffixIcon={<ImageConfig.SelectDropDownIcon/>}
                                                                 fullWidth={true}>
                                                    Select Action
                                                </ButtonComponent>
                                            } menuOptions={medicalRecordMenuOptions}/>
                                        </div>}
                                    </div>
                                </div>
                                <MedicalInterventionLinkedToComponent medicalRecordDetails={clientMedicalRecord}/>
                                <div className={'ts-row'}>
                                    <div className={'ts-col-md-4 ts-col-lg'}>
                                        <DataLabelValueComponent label={'Date of Onset'}>
                                            {clientMedicalRecord?.onset_date ? CommonService.getSystemFormatTimeStamp(clientMedicalRecord?.onset_date) : "N/A"}
                                        </DataLabelValueComponent>
                                    </div>
                                    <div className={'ts-col-md-4 ts-col-lg'}>
                                        <DataLabelValueComponent className={'date-of-surgery'}
                                                                 label={'Date of Surgery'}>
                                            {clientMedicalRecord?.surgery_date ? CommonService.getSystemFormatTimeStamp(clientMedicalRecord?.surgery_date) : "N/A"}
                                        </DataLabelValueComponent>
                                    </div>
                                    <div className={'ts-col-md-4 ts-col-lg'}>
                                        <DataLabelValueComponent label={'Case Physician'}>
                                            {clientMedicalRecord?.case_physician.name || "N/A"}
                                        </DataLabelValueComponent>
                                    </div>
                                    <div className={'ts-col-md-4 ts-col-lg'}>
                                        <DataLabelValueComponent label={'Next MD Appointment'}>
                                            {clientMedicalRecord?.case_physician.next_appointment ? CommonService.getSystemFormatTimeStamp(clientMedicalRecord?.case_physician.next_appointment) : "N/A"}
                                        </DataLabelValueComponent>
                                    </div>
                                    <div className={'ts-col-md-4 ts-col-lg'}>
                                        <DataLabelValueComponent label={'Total Direct Minutes'}>
                                            {clientMedicalRecord?.total_direct_minutes || "N/A"}
                                        </DataLabelValueComponent>
                                    </div>
                                </div>

                                {isFullCardOpen && <>
                                    <div className={'ts-row'}>
                                        <div className={'ts-col-md-4 ts-col-lg'}>
                                            <DataLabelValueComponent label={'Injury/Condition Description'}>
                                                {clientMedicalRecord?.injury_description.split("\n").map((i: any, key: any) => {
                                                    return <li key={key}>{i}</li>;
                                                }) || "N/A"}
                                            </DataLabelValueComponent>
                                        </div>
                                    </div>
                                    <div className={'ts-row'}>
                                        <div className={'ts-col-md-4 ts-col-lg'}>
                                            <DataLabelValueComponent label={'Restrictions/Limitations'}>
                                                {clientMedicalRecord?.limitations.split("\n").map((i: any, key: any) => {
                                                    return <li key={key}>{i}</li>;
                                                }) || "N/A"}
                                            </DataLabelValueComponent>
                                        </div>
                                        <div className={'ts-col-md-4 ts-col-lg'}/>
                                        <div className={'ts-col-md-4 ts-col-lg'}/>
                                    </div>
                                </>
                                }
                                <div className={'ts-row'}>
                                    <div className={'ts-col-md-4 ts-col-lg'}/>
                                    <div className={'ts-col-md-4 ts-col-lg'}/>
                                    <div className={'show-more-less'}
                                         onClick={() => setIsFullCardOpen(!isFullCardOpen)}>
                                        {isFullCardOpen ? 'Less' : 'More'} Details &nbsp;&nbsp;
                                        {isFullCardOpen ? <ImageConfig.UpArrowIcon/> : <ImageConfig.DownArrowIcon/>}
                                    </div>
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
                                                   onSave={handleSurgeryRecordAdd}
                                                   onCancel={() => setIsSurgeryAddOpen(false)}/>
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
                            onCancel={() => closeMedicalRecordDocumentAddDrawer()}
                        />
                    </DrawerComponent>
                    {/*Add medical record document drawer end*/}

                    {/*Transfer medical record drawer start*/}
                    <DrawerComponent isOpen={isTransferMedicalRecordDrawerOpen}
                                     onClose={setIsTransferMedicalRecordDrawerOpen.bind(null, false)}>
                        <TransferMedicalRecordComponent medicalRecordId={medicalRecordId}
                                                        setRefreshToken={setRefreshToken}
                                                        onClose={setIsTransferMedicalRecordDrawerOpen.bind(null, false)}
                                                        onMedicalRecordTransfer={handleMedicalRecordTransfer}/>
                    </DrawerComponent>
                    {/*Transfer medical record drawer end*/}

                    {/*Notify admin for medical record modal start*/}
                    <ModalComponent isOpen={isNotifyModalOpen} closeOnBackDropClick={true}
                                    className={'notify-admin-modal'}>
                        <div className={'display-flex ts-justify-content-center mrg-bottom-20'}>
                            <ImageConfig.ConfirmIcon/>
                        </div>
                        <FormControlLabelComponent label={'NOTIFY ADMIN'}
                                                   className={'display-flex ts-justify-content-center '}/>
                        <Formik initialValues={notifyAdminFormInitialValues}
                                onSubmit={handleNotifyAdmin}
                                validateOnChange={false}
                                validateOnBlur={true}
                                enableReinitialize={true}
                                validateOnMount={true}>
                            {({values, isValid, resetForm, validateForm}) => {
                                // eslint-disable-next-line react-hooks/rules-of-hooks
                                useEffect(() => {
                                    validateForm();
                                }, [values, validateForm]);
                                return (
                                    <Form className={'t-form'} noValidate={true}>
                                        <FormDebuggerComponent values={values} showDebugger={false}/>
                                        <div className={'ts-row ts-justify-content-center'}>
                                            <div className={'ts-col-lg-12'}>
                                                <Field name={'message'}>
                                                    {
                                                        (field: FieldProps) => (
                                                            <FormikTextAreaComponent formikField={field}
                                                                                     label={''}
                                                                                     fullWidth={true}
                                                                                     placeholder={'Enter your message here (if any) '}/>
                                                        )
                                                    }
                                                </Field>
                                            </div>
                                        </div>
                                        <div className={'ts-action display-flex ts-justify-content-center'}>
                                            <ButtonComponent variant={'outlined'}
                                                             onClick={() => {
                                                                 handleNotifyAdminModalClose();
                                                                 resetForm(); // TODO : check if this is required compare with Inventory stock update form
                                                             }}>
                                                Cancel
                                            </ButtonComponent>
                                            &nbsp;&nbsp;
                                            <ButtonComponent variant={'contained'} color={'primary'}
                                                             isLoading={isNotifyAdminProgressIsLoading}
                                                             disabled={!isValid || isNotifyAdminProgressIsLoading}
                                                             type={'submit'}>
                                                Notify
                                            </ButtonComponent>
                                        </div>
                                    </Form>
                                )
                            }}
                        </Formik>
                    </ModalComponent>
                    {/*Notify admin for medical record modal end*/}
                </>

            }
        </div>
    );
};


export default MedicalRecordBasicDetailsCardComponent;
