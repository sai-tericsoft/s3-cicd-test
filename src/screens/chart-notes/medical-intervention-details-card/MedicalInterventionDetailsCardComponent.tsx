import "./MedicalInterventionDetailsCardComponent.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import {useNavigate, useParams} from "react-router-dom";
import {getClientMedicalRecord} from "../../../store/actions/client.action";
import {CommonService} from "../../../shared/services";
import {ImageConfig, Misc} from "../../../constants";
import DrawerComponent from "../../../shared/components/drawer/DrawerComponent";
import EditMedicalRecordComponent from "../edit-medical-record/EditMedicalRecordComponent";
import {ListItem} from "@mui/material";
import MenuDropdownComponent from "../../../shared/components/menu-dropdown/MenuDropdownComponent";
import AddSurgeryRecordComponent from "../add-surgery-record/AddSurgeryRecordComponent";
import AddDryNeedlingFileComponent from "../add-dry-needling-file/AddDryNeedlingFileComponent";

import ViewPriorNoteComponent from "../view-prior-note/ViewPriorNoteComponent";
import MedicalInterventionLinkedToComponent
    from "../medical-intervention-linked-to/MedicalInterventionLinkedToComponent";
import TransferSoapNoteComponent from "../transfer-soap-note/TransferSoapNoteComponent";
import {
    getMedicalInterventionDetails,
    getMedicalRecordSoapNoteList,
    refreshMedicalRecordAttachmentList
} from "../../../store/actions/chart-notes.action";
import AddConcussionFileComponent from "../add-concussion-file/AddConcussionFileComponent";
import {IRootReducerState} from "../../../store/reducers";
import ImportSoapNoteComponent from "../import-soap-note/ImportSoapNoteComponent";
import FilesUneditableMiddlewareComponent
    from "../../../shared/components/files-uneditable-middleware/FilesUneditableMiddlewareComponent";
import AddMedicalRecordDocumentComponent from "../add-medical-record-document/AddMedicalRecordDocumentComponent";
import ModalComponent from "../../../shared/components/modal/ModalComponent";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import _ from "lodash";
import LottieFileGenerationComponent
    from "../../../shared/components/lottie-file-generation/LottieFileGenerationComponent";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import FormikDatePickerComponent
    from "../../../shared/components/form-controls/formik-date-picker/FormikDatePickerComponent";
import commonService from "../../../shared/services/common.service";
import momentTimezone from "moment-timezone";
import moment from "moment";

interface MedicalInterventionDetailsCardComponentProps {
    showAction?: boolean,
    medicalInterventionDetails: any,
    mode?: "edit" | "view",
}

const NotifyAdminInitialValues: any = {
    message: "",
}

const dateInterventionInitialValues: any = {
    intervention_date: "",
}

const MedicalInterventionDetailsCardComponent = (props: MedicalInterventionDetailsCardComponentProps) => {

    const {showAction, mode, medicalInterventionDetails,} = props;

    const {medicalRecordId, medicalInterventionId} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isSurgeryAddOpen, setIsSurgeryAddOpen] = React.useState<boolean>(false);
    const [isEditMedicalRecordDrawerOpen, setIsEditMedicalRecordDrawerOpen] = useState<boolean>(false);
    const [isAddDryNeedlingFileDrawerOpen, setIsAddDryNeedlingFileDrawerOpen] = useState<boolean>(false)
    const [isTransferSoapNoteDrawerOpen, setIsTransferSoapNoteDrawerOpen] = useState<boolean>(false);
    const [isAddConcussionFileDrawerOpen, setIsAddConcussionFileDrawerOpen] = useState<boolean>(false);
    const [isViewPriorNoteDrawerOpen, setIsViewPriorNoteDrawerOpen] = useState<boolean>(false);
    const [isImportSoapNoteDrawerOpen, setIsImportSoapNoteDrawerOpen] = useState<boolean>(false);
    const [isMedicalRecordDocumentAddDrawerOpen, setIsMedicalRecordDocumentAddDrawerOpen] = useState<boolean>(false);
    const [isNotifyModalOpen, setIsNotifyModalOpen] = useState<boolean>(false);
    const [notifyAdminFormInitialValues, setNotifyAdminFormInitialValues] = useState<any>(_.cloneDeep(NotifyAdminInitialValues));
    const [editInterventionDateInitialValues] = useState<any>(_.cloneDeep(dateInterventionInitialValues));
    const [isNotifyAdminProgressIsLoading, setIsNotifyAdminProgressIsLoading] = useState<boolean>(false);
    const [isFullCardOpen, setIsFullCardOpen] = useState<boolean>(false);
    const [isEditInterventionDateOpen, setIsEditInterventionDateOpen] = useState<boolean>(false);

    const {
        clientMedicalRecord,
        isClientMedicalRecordLoading,
        isClientMedicalRecordLoaded,
    } = useSelector((state: IRootReducerState) => state.client);

    useEffect(() => {
        if (medicalRecordId) {
            dispatch(getClientMedicalRecord(medicalRecordId));
            if (medicalInterventionId) {
                dispatch(getMedicalRecordSoapNoteList({medicalRecordId, medicalInterventionId}));
            }
        }
    }, [medicalRecordId, medicalInterventionId, dispatch]);

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

    const openAddDryNeedlingFileDrawer = useCallback(() => {
        setIsAddDryNeedlingFileDrawerOpen(true);
    }, []);

    const closeAddDryNeedlingFileDrawer = useCallback(() => {
        setIsAddDryNeedlingFileDrawerOpen(false);
    }, []);

    const openTransferSoapNoteDrawer = useCallback(() => {
        setIsTransferSoapNoteDrawerOpen(true);
    }, []);

    const closeTransferSoapNoteDrawer = useCallback(() => {
        setIsTransferSoapNoteDrawerOpen(false);
    }, []);

    const openAddConcussionFileDrawer = useCallback(() => {
        setIsAddConcussionFileDrawerOpen(true);
    }, []);

    const closeAddConcussionFileDrawer = useCallback(() => {
        setIsAddConcussionFileDrawerOpen(false);
    }, []);

    const openViewPriorNoteDrawer = useCallback(() => {
        setIsViewPriorNoteDrawerOpen(true);
    }, []);

    const closeViewPriorNoteDrawer = useCallback(() => {
        setIsViewPriorNoteDrawerOpen(false);
    }, []);

    const openImportSoapNoteDrawer = useCallback(() => {
        setIsImportSoapNoteDrawerOpen(true);
    }, []);

    const closeImportSoapNoteDrawer = useCallback(() => {
        setIsImportSoapNoteDrawerOpen(false);
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

    const handleMedicalRecordEdit = useCallback(() => {
        closeEditMedicalRecordDrawer();
        if (medicalRecordId) {
            dispatch(getClientMedicalRecord(medicalRecordId));
            if (medicalInterventionId) {
                dispatch(getMedicalInterventionDetails(medicalInterventionId));
            }
        }
    }, [dispatch, medicalRecordId, closeEditMedicalRecordDrawer, medicalInterventionId]);

    const handleDryNeedlingFileAdd = useCallback(() => {
        if (medicalInterventionDetails?._id) {
            dispatch(getMedicalInterventionDetails(medicalInterventionDetails?._id));
        }
        closeAddDryNeedlingFileDrawer();
    }, [closeAddDryNeedlingFileDrawer, dispatch, medicalInterventionDetails]);

    const handleTransferSoapNote = useCallback(() => {
        if (medicalInterventionDetails?._id) {
            dispatch(getMedicalInterventionDetails(medicalInterventionDetails?._id));
        }
        closeTransferSoapNoteDrawer();
    }, [medicalInterventionDetails, closeTransferSoapNoteDrawer, dispatch]);

    const handleConcussionFileAdd = useCallback(() => {
        if (medicalInterventionDetails?._id) {
            dispatch(getMedicalInterventionDetails(medicalInterventionDetails?._id));
        }
        closeAddConcussionFileDrawer();
    }, [dispatch, medicalInterventionDetails, closeAddConcussionFileDrawer]);

    const handleSoapNoteDrawer = useCallback((medicalInterventionId: string) => {
        closeImportSoapNoteDrawer();
        if (medicalRecordId) {
            if (medicalInterventionDetails?.status === 'completed') {
                navigate(CommonService._routeConfig.ViewMedicalIntervention(medicalRecordId, medicalInterventionId));

            } else {
                navigate(CommonService._routeConfig.UpdateMedicalIntervention(medicalRecordId, medicalInterventionId));
            }
        }
    }, [medicalRecordId, medicalInterventionDetails, closeImportSoapNoteDrawer, navigate]);


    const handleNotifyAdminModalOpen = useCallback(() => {
        setNotifyAdminFormInitialValues(_.cloneDeep(NotifyAdminInitialValues));
        setIsNotifyModalOpen(true);
    }, []);

    const handleSOAPNotePrint = useCallback(() => {
        if (medicalInterventionId) {
            try {
                const payload = {
                    timezone: momentTimezone.tz.guess(),
                };
                CommonService._chartNotes.PrintSOAPNote(medicalInterventionId, payload)
                    .then((res: any) => {
                        const attachment = {
                            type: 'application/pdf',
                            url: res.data.url,
                            name: 'progress report',
                            key: ''
                        };
                        CommonService.printAttachment(attachment);
                    })
                    .catch((err: any) => {
                        console.log(err);
                    });
            } catch (error) {
                // Handle synchronous errors here
                console.error(error);
            }
        }
    }, [medicalInterventionId]);


    const handleNotifyAdminModalClose = useCallback(() => {
        setNotifyAdminFormInitialValues(_.cloneDeep(NotifyAdminInitialValues));
        setIsNotifyModalOpen(false);
    }, []);

    const handleNotifyAdmin = useCallback((values: any, {setErrors, resetForm}: FormikHelpers<any>) => {
        setIsNotifyAdminProgressIsLoading(true);
        if (medicalInterventionId) {
            try {
                CommonService._chartNotes.MedicalInterventionNotifyAdminAPICall(medicalInterventionId, values)
                    .then((response) => {
                        CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                        setIsNotifyAdminProgressIsLoading(false);
                        handleNotifyAdminModalClose();
                        resetForm();
                    }).catch((error) => {
                    CommonService.handleErrors(setErrors, error, true);
                    setIsNotifyModalOpen(false);
                    setIsNotifyAdminProgressIsLoading(false);
                });
            } catch (error) {
                // Handle synchronous errors here
                CommonService.handleErrors(setErrors, error, true);
                setIsNotifyModalOpen(false);
                setIsNotifyAdminProgressIsLoading(false);
            }
        }
    }, [medicalInterventionId, handleNotifyAdminModalClose]);


    const onInterventionDateEdit = useCallback((values: any, {setErrors, setSubmitting}: FormikHelpers<any>) => {
        const payload = {
            ...values,
            intervention_date: moment(values.intervention_date).format('YYYY-MM-DD'),
        };
        setSubmitting(true);
        if (medicalInterventionId) {
            try {
                CommonService._chartNotes.MedicalInterventionBasicDetailsUpdateAPICall(medicalInterventionId, payload)
                    .then((response) => {
                        CommonService._alert.showToast("Details edited", "success");
                        setSubmitting(false);
                        setIsEditInterventionDateOpen(false);
                        dispatch(getMedicalInterventionDetails(medicalInterventionId));
                    }).catch((error) => {
                    CommonService.handleErrors(setErrors, error, true);
                    setSubmitting(false);
                });
            } catch (error) {
                // Handle synchronous errors here
                CommonService.handleErrors(setErrors, error, true);
                setSubmitting(false);
            }
        }
    }, [medicalInterventionId, dispatch]);


    // const handleEditSoapNote = useCallback(() => {
    //     if (medicalRecordId && medicalInterventionId) {
    //         navigate(CommonService._routeConfig.UpdateMedicalIntervention(medicalRecordId, medicalInterventionId));
    //     }
    // }, [navigate, medicalRecordId, medicalInterventionId]);

    const [medicalInterventionDropDownOptions, setMedicalInterventionDropDownOptions] = useState<any>([]);

    useEffect(() => {
        if (medicalInterventionDetails?.status === 'completed') {
            const options = [
                // <ListItem
                //     onClick={comingSoon}>Print SOAP</ListItem>,
                <ListItem onClick={handleNotifyAdminModalOpen}>Notify Admin</ListItem>,
                <ListItem onClick={handleSOAPNotePrint}>Print SOAP</ListItem>,
                <ListItem onClick={openTransferSoapNoteDrawer}>Transfer SOAP to</ListItem>,
            ];
            if (mode === 'view') {
                options.unshift(<FilesUneditableMiddlewareComponent
                    timeStamp={medicalInterventionDetails?.completed_date}>
                    {/*<ListItem onClick={handleEditSoapNote}>Edit SOAP</ListItem>*/}
                </FilesUneditableMiddlewareComponent>)
            }
            setMedicalInterventionDropDownOptions(options);
        } else {
            setMedicalInterventionDropDownOptions([
                <ListItem onClick={openTransferSoapNoteDrawer}>Transfer SOAP to</ListItem>,
                <ListItem onClick={openMedicalRecordDocumentAddDrawer}>Add Document</ListItem>,
                <ListItem onClick={openAddDryNeedlingFileDrawer}>
                    Add Dry Needling File
                </ListItem>,
                <ListItem onClick={openAddConcussionFileDrawer}>Add Concussion</ListItem>,
                <ListItem onClick={openViewPriorNoteDrawer}>View Prior Note</ListItem>,
                <ListItem onClick={openImportSoapNoteDrawer}>Import SOAP Note</ListItem>]
            );
        }
    }, [handleNotifyAdmin, handleSOAPNotePrint, handleNotifyAdminModalOpen, comingSoon, mode, openMedicalRecordDocumentAddDrawer, openTransferSoapNoteDrawer, openAddConcussionFileDrawer, openAddDryNeedlingFileDrawer, openImportSoapNoteDrawer, openViewPriorNoteDrawer, medicalInterventionDetails]);

    return (
        <div className={'client-medical-details-card-component'}>
            {
                !medicalRecordId &&
                <StatusCardComponent title={"Medical Record ID missing. Cannot fetch Medical Record  details"}/>
            }
            {
                medicalRecordId && <>
                    {
                        isClientMedicalRecordLoading &&
                        <div className={'mrg-bottom-25'}>
                            <LoaderComponent/>
                        </div>
                    }
                </>

            }
            {medicalRecordId &&
                <DrawerComponent isOpen={isSurgeryAddOpen}
                                 showClose={true}
                                 onClose={setIsSurgeryAddOpen.bind(null, false)}
                                 className={"t-surgery-record-drawer"}
                >
                    <AddSurgeryRecordComponent medicalRecordId={medicalRecordId}
                                               medicalRecordDetails={medicalInterventionDetails?.medical_record_details}
                                               onCancel={() => setIsSurgeryAddOpen(false)}
                                               onSave={() => {
                                                   dispatch(getClientMedicalRecord(medicalRecordId));
                                                   setIsSurgeryAddOpen(false);
                                               }}/>
                </DrawerComponent>
            }
            {
                (isClientMedicalRecordLoaded && medicalRecordId) &&
                <>
                    <CardComponent color={'primary'}>
                        <div className={'client-name-button-wrapper'}>
                                    <span className={'client-name-wrapper'}>
                                        <span className={'client-name'}>
                                            <span
                                                className={clientMedicalRecord?.client_details?.is_alias_name_set ? "alias-name" : ""}>  {commonService.generateClientNameFromClientDetails(clientMedicalRecord?.client_details)}</span>
                                        </span>
                                        <ChipComponent
                                            className={clientMedicalRecord?.status === 'open' ? "active" : "inactive"}
                                            size={'small'}
                                            label={clientMedicalRecord?.status_details?.title || "N/A"}/>
                                    </span>

                            <div className="ts-row width-auto">
                                <div className="">
                                    <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>}
                                                     variant={'outlined'}
                                                     onClick={openEditMedicalRecordDrawer}>
                                        Edit Details
                                    </ButtonComponent>
                                </div>
                                {showAction && <div className="ts-col">
                                    <MenuDropdownComponent menuBase={
                                        <ButtonComponent variant={'outlined'} fullWidth={true}>
                                            Select Action &nbsp;<ImageConfig.SelectDropDownIcon/>
                                        </ButtonComponent>
                                    } menuOptions={medicalInterventionDropDownOptions}
                                    />
                                </div>}
                            </div>
                        </div>
                        <MedicalInterventionLinkedToComponent
                            medicalRecordDetails={medicalInterventionDetails?.medical_record_details}/>
                        {/*<DataLabelValueComponent label={'File Created On:'} direction={"row"}*/}
                        {/*                         className={'intervention-injury-details-wrapper'}>*/}
                        {/*    {(medicalInterventionDetails?.created_at ? moment(medicalInterventionDetails?.created_at).tz(moment.tz.guess()).format('DD-MMM-YYYY') : 'N/A')}&nbsp;-&nbsp;*/}
                        {/*    {medicalInterventionDetails?.created_by_details?.first_name ? medicalInterventionDetails?.created_by_details?.first_name + ' ' + medicalInterventionDetails?.created_by_details?.last_name : ' N/A'}*/}
                        {/*</DataLabelValueComponent>*/}
                        <div className={'ts-row'}>
                            <div className={'ts-col'}>
                                <DataLabelValueComponent label={'Date of Intervention'}>
                                    <div className={'cursor-pointer d-flex'} onClick={() => {
                                        setIsEditInterventionDateOpen(true);
                                    }}>
                                        {medicalInterventionDetails?.intervention_date ? CommonService.convertDateFormat2(medicalInterventionDetails?.intervention_date) : "N/A"}

                                        {/*<IconButtonComponent */}
                                        {/*    id={"edit"}>*/}
                                        <ImageConfig.EditIcon className={'edit-icon'} width={'16'} height={'16'}/>
                                        {/*</IconButtonComponent>*/}
                                    </div>
                                </DataLabelValueComponent>
                            </div>
                            <div className={'ts-col'}>
                                <DataLabelValueComponent label={'Treated by'}>
                                    {CommonService.capitalizeFirstLetter(medicalInterventionDetails?.treated_by_details?.first_name ? (medicalInterventionDetails?.treated_by_details?.first_name) + ' ' + CommonService.capitalizeFirstLetter(medicalInterventionDetails?.treated_by_details?.last_name) : "N/A")}
                                </DataLabelValueComponent>
                            </div>
                            <div className={'ts-col'}>
                                <DataLabelValueComponent label={'Case Physician'}>
                                    {medicalInterventionDetails?.medical_record_details?.case_physician.name || "N/A"}
                                </DataLabelValueComponent>
                            </div>
                            <div className={'ts-col'}>
                                <DataLabelValueComponent label={'Scheduled Start Time'}>
                                    {medicalInterventionDetails?.appointment_details?.start_time ? CommonService.getHoursAndMinutesFromMinutes(medicalInterventionDetails?.appointment_details?.start_time) : "N/A"}
                                </DataLabelValueComponent>
                            </div>
                            <div className={'ts-col'}>
                                <DataLabelValueComponent label={'Scheduled End Time'}>
                                    {medicalInterventionDetails?.appointment_details?.end_time ? CommonService.getHoursAndMinutesFromMinutes(medicalInterventionDetails?.appointment_details?.end_time) : "N/A"}
                                </DataLabelValueComponent>
                            </div>
                        </div>
                        {
                            isFullCardOpen && <div className={'ts-row'}>
                                <div className={'ts-col card-container'}>
                                    <DataLabelValueComponent label={'Injury/Condition Description'}>
                                        <ul>
                                            {medicalInterventionDetails?.medical_record_details?.injury_description && medicalInterventionDetails?.medical_record_details?.injury_description.split("\n")?.filter((i: any) => i !== "")?.map((i: any, key: any) => {
                                                return <li key={key}>{i}</li>;
                                            })}
                                        </ul>
                                        <div className={'no-text'}>
                                            {
                                                !medicalInterventionDetails?.medical_record_details?.injury_description &&
                                                "N/A"
                                            }
                                        </div>
                                    </DataLabelValueComponent>
                                </div>
                            </div>

                        }
                        {isFullCardOpen && <div className={'ts-row'}>
                            <div className={'ts-col card-container'}>
                                <DataLabelValueComponent label={'Restrictions/Limitations'}>
                                    <ul>
                                        {medicalInterventionDetails?.medical_record_details?.limitations && medicalInterventionDetails?.medical_record_details?.limitations?.split("\n")?.filter((i: any) => i !== "")?.map((i: any, key: any) => {
                                            return <li key={key}>{i}</li>;
                                        })}
                                    </ul>
                                    <div className={'no-text'}>
                                        {!medicalInterventionDetails?.medical_record_details?.limitations && "N/A"}
                                    </div>
                                </DataLabelValueComponent>
                            </div>
                        </div>}
                        <div className={'ts-row'}>
                            <div className={'ts-col-md-4 ts-col-lg'}/>
                            <div className={'ts-col-md-4 ts-col-lg'}/>
                            <div className={'show-more-less'}
                                 onClick={() => setIsFullCardOpen(!isFullCardOpen)}>
                                {isFullCardOpen ? 'Less' : 'More'} Details &nbsp;&nbsp;
                                {isFullCardOpen ? <ImageConfig.UpArrowIcon/> : <ImageConfig.DownArrowIcon/>}
                            </div>
                        </div>
                        <DrawerComponent isOpen={isEditMedicalRecordDrawerOpen}
                                         showClose={true}
                                         onClose={closeEditMedicalRecordDrawer}>
                            <EditMedicalRecordComponent medicalRecordId={medicalRecordId}
                                                        medicalRecordDetails={medicalInterventionDetails?.medical_record_details}
                                                        onSave={handleMedicalRecordEdit}/>
                        </DrawerComponent>
                        <DrawerComponent isOpen={isAddDryNeedlingFileDrawerOpen}
                                         showClose={true}
                                         onClose={closeAddDryNeedlingFileDrawer}>
                            <AddDryNeedlingFileComponent
                                medicalRecordDetails={medicalInterventionDetails?.medical_record_details}
                                medicalInterventionId={medicalInterventionDetails?._id}
                                onCancel={() => closeAddDryNeedlingFileDrawer()}
                                onAdd={handleDryNeedlingFileAdd}
                            />
                        </DrawerComponent>
                        <DrawerComponent isOpen={isViewPriorNoteDrawerOpen}
                                         showClose={true}
                                         onClose={closeViewPriorNoteDrawer}>
                            <ViewPriorNoteComponent
                                medicalRecordDetails={medicalInterventionDetails?.medical_record_details}
                                medicalInterventionId={medicalInterventionDetails?._id}
                                onMedicalInterventionSelection={closeViewPriorNoteDrawer}
                            />
                        </DrawerComponent>

                    </CardComponent>
                </>
            }
            <DrawerComponent isOpen={isEditMedicalRecordDrawerOpen}
                             showClose={true}
                             onClose={closeEditMedicalRecordDrawer}>
                {
                    medicalRecordId &&
                    <EditMedicalRecordComponent medicalRecordId={medicalRecordId}
                                                medicalRecordDetails={medicalInterventionDetails?.medical_record_details}
                                                onSave={handleMedicalRecordEdit}/>
                }
            </DrawerComponent>

            <DrawerComponent isOpen={isTransferSoapNoteDrawerOpen}
                             onClose={closeTransferSoapNoteDrawer}>
                {
                    medicalRecordId && <TransferSoapNoteComponent
                        medicalRecordId={medicalRecordId}
                        onClose={closeTransferSoapNoteDrawer}
                        medicalInterventionId={medicalInterventionDetails?._id}
                        onTransferSoapNote={handleTransferSoapNote}/>
                }
            </DrawerComponent>

            <DrawerComponent isOpen={isAddConcussionFileDrawerOpen}
                // showClose={true}
                             className={'t-document-record-drawer'}
                             onClose={closeAddConcussionFileDrawer}>
                <AddConcussionFileComponent
                    medicalRecordDetails={medicalInterventionDetails?.medical_record_details}
                    medicalInterventionDetails={medicalInterventionDetails}
                    medicalInterventionId={medicalInterventionDetails?._id}
                    onClose={closeAddConcussionFileDrawer}
                    onAdd={handleConcussionFileAdd}/>
            </DrawerComponent>
            {/*Add Concussion File Drawer End*/}

            {/*Import Soap Note Drawer Start*/}
            <DrawerComponent isOpen={isImportSoapNoteDrawerOpen} showClose={true} onClose={closeImportSoapNoteDrawer}>
                <ImportSoapNoteComponent medicalRecordDetails={medicalInterventionDetails?.medical_record_details}
                                         handleSoapNoteImport={handleSoapNoteDrawer}
                />
            </DrawerComponent>

            <DrawerComponent isOpen={isMedicalRecordDocumentAddDrawerOpen}
                             showClose={true}
                             onClose={() => closeMedicalRecordDocumentAddDrawer()}>
                {medicalRecordId && <AddMedicalRecordDocumentComponent
                    onAdd={handleMedicalRecordDocumentAdd}
                    medicalRecordId={medicalRecordId}
                    medicalRecordDetails={clientMedicalRecord}
                    onCancel={() => closeMedicalRecordDocumentAddDrawer()}
                />}
            </DrawerComponent>

            {/*Notify admin for medical record modal start*/}
            <ModalComponent isOpen={isNotifyModalOpen} closeOnBackDropClick={true}
                            className={'notify-admin-modal'}>
                <div className={'display-flex ts-justify-content-center mrg-bottom-20'}>
                    <LottieFileGenerationComponent loop={true}
                                                   animationData={ImageConfig.PopupLottie}
                                                   autoplay={true}
                    />
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
                                {/*<FormDebuggerComponent values={values} showDebugger={false} />*/}
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
                                                     className={isNotifyAdminProgressIsLoading ? 'mrg-right-15' : ""}
                                                     onClick={() => {
                                                         handleNotifyAdminModalClose();
                                                         resetForm(); // TODO : check if this is required compare with Inventory stock update form
                                                     }}>
                                        Cancel
                                    </ButtonComponent>
                                    &nbsp;&nbsp;
                                    <ButtonComponent variant={'contained'} color={'primary'}
                                                     className={'mrg-left-15'}
                                                     disabled={!isValid || isNotifyAdminProgressIsLoading || !values.message}
                                                     isLoading={isNotifyAdminProgressIsLoading}
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

            <ModalComponent
                title={'Edit Intervention Date'}
                size={'xs'}
                isOpen={isEditInterventionDateOpen}
                closeOnBackDropClick={true}
                className={'edit-intervention-date-modal'}
            >
                <Formik initialValues={editInterventionDateInitialValues}
                        onSubmit={onInterventionDateEdit}
                        validateOnChange={false}
                        validateOnBlur={true}
                        enableReinitialize={true}
                        validateOnMount={true}>
                    {({values, isValid, isSubmitting, validateForm}) => {
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        useEffect(() => {
                            validateForm();
                        }, [values, validateForm]);
                        return (
                            <Form className={'t-form'} noValidate={true}>
                                <div className={'ts-row ts-justify-content-center'}>
                                    <div className={'ts-col-lg-12'}>
                                        <Field name={'intervention_date'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikDatePickerComponent
                                                        label={'Intervention Date'}
                                                        placeholder={'Enter Intervention Date'}
                                                        formikField={field}
                                                        required={true}
                                                        // minDate={moment()}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                </div>
                                <div className={'ts-action display-flex ts-justify-content-center'}>
                                    <ButtonComponent variant={'outlined'}
                                                     className={isSubmitting ? 'mrg-right-15' : ""}
                                                     disabled={isSubmitting}
                                                     onClick={() => {
                                                         setIsEditInterventionDateOpen(false);
                                                     }}>
                                        Cancel
                                    </ButtonComponent>
                                    &nbsp;&nbsp;
                                    <ButtonComponent variant={'contained'} color={'primary'}
                                                     className={'mrg-left-15'}
                                                     isLoading={isSubmitting}
                                                     disabled={!isValid || isSubmitting}
                                                     type={'submit'}>
                                        Submit
                                    </ButtonComponent>
                                </div>
                            </Form>
                        )
                    }}
                </Formik>

            </ModalComponent>
        </div>
    );
}


export default MedicalInterventionDetailsCardComponent;
