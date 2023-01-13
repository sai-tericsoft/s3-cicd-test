import "./MedicalInterventionDetailsCardComponent.scss";
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
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import TableComponent from "../../../shared/components/table/TableComponent";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {ImageConfig} from "../../../constants";
import DrawerComponent from "../../../shared/components/drawer/DrawerComponent";
import EditMedicalRecordComponent from "../edit-medical-record/EditMedicalRecordComponent";
import {ListItem} from "@mui/material";
import MenuDropdownComponent from "../../../shared/components/menu-dropdown/MenuDropdownComponent";
import AddSurgeryRecordComponent from "../add-surgery-record/AddSurgeryRecordComponent";
import moment from "moment-timezone";

interface MedicalInterventionDetailsCardComponentProps {
    showAction?: boolean,
    medicalInterventionDetails: any
}


const MedicalInterventionDetailsCardComponent = (props: MedicalInterventionDetailsCardComponentProps) => {

    const {showAction, medicalInterventionDetails} = props;
    const bodyPartsColumns: any = [
        {
            title: "Body Part",
            dataIndex: "body_part",
            key: "body_part",
            width: 91,
            render: (_: any, item: any) => {
                return <>{item.body_part_details.name}</>
            }

        },
        {
            title: "Body  Side(s)",
            dataIndex: "body_part",
            key: "body_part",
            width: 114,
            render: (_: any, item: any) => {
                return <>{item?.body_side}</>
            }
        }
    ];

    const {medicalRecordId} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isBodyPartsModalOpen, setIsBodyPartsModalOpen] = React.useState<boolean>(false);
    const [isSurgeryAddOpen, setIsSurgeryAddOpen] = React.useState<boolean>(false);
    const [isEditMedicalRecordDrawerOpen, setIsEditMedicalRecordDrawerOpen] = useState<boolean>(false);

    const {
        clientMedicalRecord,
        isClientMedicalRecordLoaded,
        isClientMedicalRecordLoading,
        isClientMedicalRecordLoadingFailed
    } = useSelector((state: IRootReducerState) => state.client);

    useEffect(() => {
        if (medicalRecordId) {
            dispatch(getClientMedicalRecord(medicalRecordId));
        }
    }, [medicalRecordId, dispatch]);

    useEffect(() => {
        if (clientMedicalRecord?.client_id) {
            dispatch(setCurrentNavParams("Medical Record details", null, () => {
                navigate(CommonService._routeConfig.MedicalRecordList(clientMedicalRecord?.client_id));
            }));
        }
    }, [navigate, dispatch, clientMedicalRecord?.client_id]);

    const openBodyPartsModal = useCallback(() => {
        setIsBodyPartsModalOpen(true);
    }, []);

    const closeBodyPartsModal = useCallback(() => {
        setIsBodyPartsModalOpen(false);
    }, []);

    const openEditMedicalRecordDrawer = useCallback(() => {
        setIsEditMedicalRecordDrawerOpen(true);
    }, []);

    const closeEditMedicalRecordDrawer = useCallback(() => {
        setIsEditMedicalRecordDrawerOpen(false);
    }, []);

    const handleMedicalRecordEdit = useCallback(() => {
        closeEditMedicalRecordDrawer();
        if (medicalRecordId) {
            dispatch(getClientMedicalRecord(medicalRecordId));
        }
    }, [dispatch, medicalRecordId, closeEditMedicalRecordDrawer]);

    const comingSoon = useCallback(
        () => {
            CommonService._alert.showToast('Coming Soon!', 'info')
        },
        [],
    );

    return (
        <div className={'client-medical-details-card-component'}>

            {medicalRecordId && clientMedicalRecord &&
                <DrawerComponent isOpen={isSurgeryAddOpen}
                                 showClose={true}
                                 onClose={setIsSurgeryAddOpen.bind(null, false)}
                                 className={"t-surgery-record-drawer"}
                >
                    <AddSurgeryRecordComponent medicalRecordId={medicalRecordId}
                                               medicalRecordDetails={clientMedicalRecord}
                                               onSave={() => {
                                                   dispatch(getClientMedicalRecord(medicalRecordId));
                                                   setIsSurgeryAddOpen(false);
                                               }}/>
                </DrawerComponent>
            }

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
                                        <ChipComponent className={clientMedicalRecord?.status ? "active" : "inactive"}
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
                                                <ButtonComponent size={'large'} variant={'outlined'} fullWidth={true}>
                                                    Select Action &nbsp;<ImageConfig.SelectDropDownIcon/>
                                                </ButtonComponent>
                                            } menuOptions={
                                                [
                                                    <ListItem onClick={comingSoon}>Print SOAP</ListItem>,
                                                    <ListItem onClick={comingSoon}>Transfer SOAP to</ListItem>,
                                                    <ListItem onClick={comingSoon}>Notify Admin</ListItem>,

                                                ]
                                            }/>
                                        </div>}
                                    </div>
                                </div>
                                <DataLabelValueComponent label={'Intervention Linked to:'} direction={"row"}
                                                         className={'intervention-injury-details-wrapper'}>
                                    <div className={'client-intervention'}>{clientMedicalRecord?.intervention_linked_to}
                                        {clientMedicalRecord?.created_at && CommonService.transformTimeStamp(clientMedicalRecord?.created_at)}{" "}
                                        {"-"} {clientMedicalRecord?.injury_details.map((injury: any, index: number) => {
                                            return <>{injury.body_part_details.name}({injury.body_side}) {index !== clientMedicalRecord?.injury_details.length - 1 ? <> | </> : ""}</>
                                        })}</div>
                                    <span className={'view-all-body-parts'}
                                          onClick={openBodyPartsModal}> View All Body Parts </span>
                                </DataLabelValueComponent>
                                <DataLabelValueComponent label={'File Created On:'} direction={"row"}
                                                         className={'intervention-injury-details-wrapper'}>
                                    {(medicalInterventionDetails.created_at ? moment(medicalInterventionDetails.created_at).tz(moment.tz.guess()).format('DD-MM-YYYY | hh:mm A z') : 'N/A')}&nbsp;-&nbsp;
                                    {medicalInterventionDetails?.created_by_details?.first_name ? medicalInterventionDetails?.created_by_details?.first_name + ' ' + medicalInterventionDetails?.created_by_details?.last_name : ' NA'}
                                </DataLabelValueComponent>
                                <div className={'ts-row'}>
                                    <div className={'ts-col-md-3'}>
                                        <DataLabelValueComponent label={'Date of Intervention'}>
                                            {medicalInterventionDetails?.intervention_date ? CommonService.getSystemFormatTimeStamp(medicalInterventionDetails?.intervention_date) : "-"}
                                        </DataLabelValueComponent>
                                    </div>
                                    <div className={'ts-col-md-3'}>
                                        <DataLabelValueComponent label={'Treated by'}>
                                            {medicalInterventionDetails?.treated_by_details?.first_name ? (medicalInterventionDetails?.treated_by_details?.first_name + ' ' + medicalInterventionDetails?.treated_by_details?.last_name) : "-"}
                                        </DataLabelValueComponent>
                                    </div>
                                    <div className={'ts-col-md-3'}>
                                        <DataLabelValueComponent label={'Case Physician'}>
                                            {medicalInterventionDetails?.medical_record_details?.case_physician.name || "N/A"}
                                        </DataLabelValueComponent>
                                    </div>
                                    <div className={'ts-col-md-3'}>
                                        <DataLabelValueComponent label={'Next Appointment'}>
                                            {medicalInterventionDetails?.medical_record_details?.case_physician?.next_appointment || "N/A"}
                                        </DataLabelValueComponent>
                                    </div>
                                </div>
                                <div className={'ts-row'}>
                                    <div className={'ts-col'}>
                                        <DataLabelValueComponent label={'Restrictions and Limitations'}>
                                            {clientMedicalRecord?.limitations || "-"}
                                        </DataLabelValueComponent>
                                    </div>
                                </div>
                            </CardComponent>
                        </>
                    }
                    <ModalComponent isOpen={isBodyPartsModalOpen} onClose={closeBodyPartsModal}>
                        <FormControlLabelComponent label={'View All Body Parts'} className={'view-all-body-parts-header'}/>
                        <TableComponent data={clientMedicalRecord?.injury_details} columns={bodyPartsColumns}/>
                        <div className={'close-modal-btn'}>
                            <ButtonComponent variant={'contained'} onClick={closeBodyPartsModal}>Close</ButtonComponent>
                        </div>
                    </ModalComponent>
                    <DrawerComponent isOpen={isEditMedicalRecordDrawerOpen}
                                     showClose={true}
                                     onClose={closeEditMedicalRecordDrawer}>
                        <EditMedicalRecordComponent medicalRecordId={medicalRecordId}
                                                    medicalRecordDetails={clientMedicalRecord}
                                                    onSave={handleMedicalRecordEdit}/>
                    </DrawerComponent>
                </>
            }
        </div>
    );
};


export default MedicalInterventionDetailsCardComponent;
