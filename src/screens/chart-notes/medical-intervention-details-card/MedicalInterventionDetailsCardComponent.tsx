import "./MedicalInterventionDetailsCardComponent.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import React, {useCallback, useState} from "react";
import {useDispatch} from "react-redux";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import {useParams} from "react-router-dom";
import {getClientMedicalRecord} from "../../../store/actions/client.action";
import {CommonService} from "../../../shared/services";
import {ImageConfig} from "../../../constants";
import DrawerComponent from "../../../shared/components/drawer/DrawerComponent";
import EditMedicalRecordComponent from "../edit-medical-record/EditMedicalRecordComponent";
import {ListItem} from "@mui/material";
import MenuDropdownComponent from "../../../shared/components/menu-dropdown/MenuDropdownComponent";
import AddSurgeryRecordComponent from "../add-surgery-record/AddSurgeryRecordComponent";
import moment from "moment-timezone";
import AddDryNeedlingFileComponent from "../add-dry-needling-file/AddDryNeedlingFileComponent";
import MedicalInterventionLinkedToComponent
    from "../medical-intervention-linked-to/MedicalInterventionLinkedToComponent";
import TransferSoapNoteComponent from "../transfer-soap-note/TransferSoapNoteComponent";

interface MedicalInterventionDetailsCardComponentProps {
    showAction?: boolean,
    medicalInterventionDetails: any
}


const MedicalInterventionDetailsCardComponent = (props: MedicalInterventionDetailsCardComponentProps) => {

    const {showAction, medicalInterventionDetails} = props;

    const {medicalRecordId} = useParams();
    const dispatch = useDispatch();
    const [isSurgeryAddOpen, setIsSurgeryAddOpen] = React.useState<boolean>(false);
    const [isEditMedicalRecordDrawerOpen, setIsEditMedicalRecordDrawerOpen] = useState<boolean>(false);
    const [isAddDryNeedlingFileDrawerOpen, setIsAddDryNeedlingFileDrawerOpen] = useState<boolean>(false)
    const [isTransferSoapNoteDrawerOpen, setIsTransferSoapNoteDrawerOpen] = useState<boolean>(true);

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
    },[]);

    const closeTransferSoapNoteDrawer = useCallback(() => {
        setIsTransferSoapNoteDrawerOpen(false);
    },[]);

    const handleMedicalRecordEdit = useCallback(() => {
        closeEditMedicalRecordDrawer();
        if (medicalRecordId) {
            dispatch(getClientMedicalRecord(medicalRecordId));
        }
    }, [dispatch, medicalRecordId, closeEditMedicalRecordDrawer]);

    const comingSoon = useCallback(
        () => {
            CommonService._alert.showToast('Coming Soon!', 'info')
        }, []);

    const handleDryNeedlingFileAdd = useCallback(() => {
        closeAddDryNeedlingFileDrawer();
    }, [closeAddDryNeedlingFileDrawer]);

    return (
        <div className={'client-medical-details-card-component'}>
            {
                !medicalRecordId &&
                <StatusCardComponent title={"Medical Record ID missing. Cannot fetch Medical Record  details"}/>
            }
            {medicalRecordId &&
                <DrawerComponent isOpen={isSurgeryAddOpen}
                                 showClose={true}
                                 onClose={setIsSurgeryAddOpen.bind(null, false)}
                                 className={"t-surgery-record-drawer"}
                >
                    <AddSurgeryRecordComponent medicalRecordId={medicalRecordId}
                                               medicalRecordDetails={medicalInterventionDetails?.medical_record_details}
                                               onSave={() => {
                                                   dispatch(getClientMedicalRecord(medicalRecordId));
                                                   setIsSurgeryAddOpen(false);
                                               }}/>
                </DrawerComponent>
            }
            {
                <>
                    <CardComponent color={'primary'}>
                        <div className={'client-name-button-wrapper'}>
                                    <span className={'client-name-wrapper'}>
                                        <span className={'client-name'}>
                                         {CommonService.extractName(medicalInterventionDetails?.medical_record_details?.client_details)}
                                        </span>
                                        <ChipComponent
                                            className={medicalInterventionDetails?.status ? "active" : "inactive"}
                                            size={'small'}
                                            label={medicalInterventionDetails?.status || "-"}/>
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
                                        <ButtonComponent size={'large'} variant={'outlined'} fullWidth={true}>
                                            Select Action &nbsp;<ImageConfig.SelectDropDownIcon/>
                                        </ButtonComponent>
                                    } menuOptions={
                                        [
                                            <ListItem onClick={comingSoon}>Print SOAP</ListItem>,
                                            <ListItem onClick={openTransferSoapNoteDrawer}>Transfer SOAP to</ListItem>,
                                            <ListItem onClick={comingSoon}>Notify Admin</ListItem>,
                                            <ListItem onClick={openAddDryNeedlingFileDrawer}>Add Dry Needling
                                                File</ListItem>,
                                        ]
                                    }/>
                                </div>}
                            </div>
                        </div>
                        <MedicalInterventionLinkedToComponent
                            medicalRecordDetails={medicalInterventionDetails?.medical_record_details}/>
                        <DataLabelValueComponent label={'File Created On:'} direction={"row"}
                                                 className={'intervention-injury-details-wrapper'}>
                            {(medicalInterventionDetails?.created_at ? moment(medicalInterventionDetails?.created_at).tz(moment.tz.guess()).format('DD-MM-YYYY | hh:mm A z') : 'N/A')}&nbsp;-&nbsp;
                            {medicalInterventionDetails?.created_by_details?.first_name ? medicalInterventionDetails?.created_by_details?.first_name + ' ' + medicalInterventionDetails?.created_by_details?.last_name : ' NA'}
                        </DataLabelValueComponent>
                        <div className={'ts-row'}>
                            <div className={'ts-col-md-3'}>
                                <DataLabelValueComponent label={'Date of Intervention'}>
                                    {medicalInterventionDetails?.intervention_date ? CommonService.getSystemFormatTimeStamp(medicalInterventionDetails?.intervention_date) : "N/A"}
                                </DataLabelValueComponent>
                            </div>
                            <div className={'ts-col-md-3'}>
                                <DataLabelValueComponent label={'Treated by'}>
                                    {medicalInterventionDetails?.treated_by_details?.first_name ? (medicalInterventionDetails?.treated_by_details?.first_name + ' ' + medicalInterventionDetails?.treated_by_details?.last_name) : "N/A"}
                                </DataLabelValueComponent>
                            </div>
                            <div className={'ts-col-md-3'}>
                                <DataLabelValueComponent label={'Case Physician'}>
                                    {medicalInterventionDetails?.medical_record_details?.case_physician.name || "N/A"}
                                </DataLabelValueComponent>
                            </div>
                            <div className={'ts-col-md-3'}>
                                <DataLabelValueComponent label={'Next Appointment'}>
                                    {medicalInterventionDetails?.medical_record_details?.case_physician?.next_appointment ? CommonService.getSystemFormatTimeStamp(medicalInterventionDetails?.medical_record_details?.case_physician?.next_appointment) : "N/A"}
                                </DataLabelValueComponent>
                            </div>
                        </div>
                        <div className={'ts-row'}>
                            <div className={'ts-col'}>
                                <DataLabelValueComponent label={'Restrictions and Limitations'}>
                                    {medicalInterventionDetails?.limitations || "-"}
                                </DataLabelValueComponent>
                            </div>
                        </div>
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
            <DrawerComponent isOpen={isAddDryNeedlingFileDrawerOpen}
                             showClose={true}
                             onClose={closeAddDryNeedlingFileDrawer}>
                <AddDryNeedlingFileComponent
                    medicalRecordDetails={medicalInterventionDetails?.medical_record_details}
                    medicalInterventionId={medicalInterventionDetails?._id}
                    onAdd={handleDryNeedlingFileAdd}/>
            </DrawerComponent>
            <DrawerComponent isOpen={isTransferSoapNoteDrawerOpen}
                             showClose={true}
                                onClose={closeTransferSoapNoteDrawer}>
                <TransferSoapNoteComponent/>
            </DrawerComponent>
        </div>
    );
}


export default MedicalInterventionDetailsCardComponent;
