import "./ClientMedicalDetailsCardComponent.scss";
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

interface ClientMedicalDetailsCardComponentProps {
}

const ClientMedicalDetailsCardComponent = (props: ClientMedicalDetailsCardComponentProps) => {

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
    const [isEditMedicalRecordDrawerOpen, setIsEditMedicalRecordDrawerOpen] = useState<boolean>(false);

    const {
        clientMedicalRecord,
        isClientMedicalRecordLoading,
        isClientMedicalRecordLoaded,
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
        if (medicalRecordId){
            dispatch(getClientMedicalRecord(medicalRecordId));
        }
    },[medicalRecordId, closeEditMedicalRecordDrawer]);

    return (
        <div className={'client-medical-details-card-component'}>
            <>
                {
                    !medicalRecordId && <StatusCardComponent title={"Medical Record ID missing. Cannot fetch Medical Record  details"}/>
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
                                    <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>}
                                                     onClick={openEditMedicalRecordDrawer}>
                                        Edit Details
                                    </ButtonComponent>
                                </div>
                                <DataLabelValueComponent label={'Intervention Linked to:'} direction={"row"} className={'intervention-injury-details-wrapper'}>
                                    <div className={'client-intervention'}>{clientMedicalRecord?.intervention_linked_to}
                                    {clientMedicalRecord?.created_at && CommonService.transformTimeStamp(clientMedicalRecord?.created_at)}{" "}
                                    {"-"} {clientMedicalRecord?.injury_details.map((injury: any, index: number) => {
                                    return <>{injury.body_part_details.name}({injury.body_side}) {index !== clientMedicalRecord?.injury_details.length - 1 ? <> | </> : ""}</>
                                    })}</div>
                                    <span className={'view-all-body-parts'} onClick={openBodyPartsModal}> View All Body Parts </span>
                                </DataLabelValueComponent>
                                <div className={'ts-row'}>
                                    <div className={'ts-col-md-3'}>
                                        <DataLabelValueComponent label={'Date of Onset'}>
                                            {CommonService.transformTimeStamp(clientMedicalRecord?.onset_date) || "-"}
                                        </DataLabelValueComponent>
                                    </div>
                                    <div className={'ts-col-md-3'}>
                                        <DataLabelValueComponent label={'Date of Surgery'}>
                                            {clientMedicalRecord?.date_of_surgery || "-"}
                                        </DataLabelValueComponent>
                                    </div>
                                    <div className={'ts-col-md-3'}>
                                        <DataLabelValueComponent label={'Case Physician'}>
                                            {clientMedicalRecord?.case_physician.name || "-"}
                                        </DataLabelValueComponent>
                                    </div>
                                    <div className={'ts-col-md-3'}>
                                        <DataLabelValueComponent label={'Next MD Appointment'}>
                                            {clientMedicalRecord?.case_physician.next_appointment || "-"}
                                        </DataLabelValueComponent>
                                    </div>
                                </div>
                                <div className={'ts-row'}>
                                    <div className={'ts-col-md-3'}>
                                        <DataLabelValueComponent label={'Total Direct Minutes'}>
                                            {clientMedicalRecord?.total_direct_minutes || "-"}
                                        </DataLabelValueComponent>
                                    </div>
                                    <div className={'ts-col-lg-4'}>
                                        <DataLabelValueComponent label={'Injury/Condition Description'}>
                                            {clientMedicalRecord?.injury_description || "-"}
                                        </DataLabelValueComponent>
                                    </div>
                                    <div className={'ts-col-lg-4'}>
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
                        <EditMedicalRecordComponent medicalRecordId={medicalRecordId} medicalRecordDetails={clientMedicalRecord} onSave={handleMedicalRecordEdit}/>
                    </DrawerComponent>
                </>
            }
        </div>
    );
};


export default ClientMedicalDetailsCardComponent;
