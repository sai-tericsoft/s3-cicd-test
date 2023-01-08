import "./SurgeryRecordViewScreen.scss";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import React, {useCallback, useEffect, useState} from "react";
import {CommonService} from "../../../shared/services";
import {ImageConfig, Misc} from "../../../constants";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {AddIcon, PDF_ICON} from "../../../constants/ImageConfig";
import CardComponent from "../../../shared/components/card/CardComponent";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import {getClientMedicalRecord} from "../../../store/actions/client.action";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import TableComponent from "../../../shared/components/table/TableComponent";
import ModalComponent from "../../../shared/components/modal/ModalComponent";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {DeleteOutlined, PrintRounded, Visibility} from "@mui/icons-material";

interface SurgeryRecordViewScreenProps {

}

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

const SurgeryRecordViewScreen = (props: SurgeryRecordViewScreenProps) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {medicalInterventionDetails} = useSelector((state: IRootReducerState) => state.chartNotes);
    const {medicalRecordId, surgeryRecordId} = useParams();
    const [isBodyPartsModalOpen, setIsBodyPartsModalOpen] = React.useState<boolean>(false);
    const [isSurgeryAddOpen, setIsSurgeryAddOpen] = React.useState<boolean>(false);
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
        if (medicalRecordId) {
            dispatch(getClientMedicalRecord(medicalRecordId));
        }
    }, [dispatch, medicalRecordId, closeEditMedicalRecordDrawer]);

    useEffect(() => {
        if (medicalRecordId) {
            dispatch(setCurrentNavParams("Medical Record details", null, () => {
                navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId));
            }));
        }
    }, [navigate, dispatch, medicalRecordId]);
    const [searchParams, setSearchParams] = useSearchParams();

    const [surgeryRecordDetails, setSurgeryRecordDetails] = useState<any | null>(null)
    const getSurgeryRecord = useCallback(
        (surgeryRecordId: string) => {
            CommonService._chartNotes.FetchSurgeryRecordAPICall(surgeryRecordId, {})
                .then((response: IAPIResponseType<any>) => {
                    setSurgeryRecordDetails(response.data);
                })
                .catch((error: any) => {
                    CommonService._alert.showToast(error, "error");
                    setSurgeryRecordDetails(null);
                });
        },
        [],
    );

    useEffect(() => {
        if (surgeryRecordId) {
            getSurgeryRecord(surgeryRecordId);
        }
    }, [getSurgeryRecord, surgeryRecordId]);

    const [showAttachment, setShowAttachment] = useState<any | null>(null);

    const closeShowAttachment = useCallback(
        () => {
            setShowAttachment(null);
        },
        [],
    );
    const deleteSurgeryAttachment = useCallback(
        (surgeryRecordId: string, attachmentId: string) => {
            CommonService._chartNotes.RemoveSurgeryRecordAttachmentAPICall(surgeryRecordId, attachmentId)
                .then((response: IAPIResponseType<any>) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    getSurgeryRecord(surgeryRecordId);
                })
                .catch((error: any) => {
                    CommonService._alert.showToast(error, "error");
                    getSurgeryRecord(surgeryRecordId);
                });
        },
        [],
    );


    return (
        <div className={'medical-intervention-surgery-record-screen'}>
            <ModalComponent isOpen={isBodyPartsModalOpen} onClose={closeBodyPartsModal}>
                <FormControlLabelComponent label={'View All Body Parts'} className={'view-all-body-parts-header'}/>
                <TableComponent data={clientMedicalRecord?.injury_details} columns={bodyPartsColumns}/>
                <div className={'close-modal-btn'}>
                    <ButtonComponent variant={'contained'} onClick={closeBodyPartsModal}>Close</ButtonComponent>
                </div>
            </ModalComponent>
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
                                <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>}
                                                 onClick={openEditMedicalRecordDrawer}>
                                    Edit Details
                                </ButtonComponent>
                            </div>
                        </div>
                        <DataLabelValueComponent label={'Surgery Linked to:'} direction={"row"}
                                                 className={'intervention-injury-details-wrapper'}>
                            <div className={'client-intervention'}>{clientMedicalRecord?.intervention_linked_to}
                                {clientMedicalRecord?.created_at && CommonService.transformTimeStamp(clientMedicalRecord?.created_at)}{" "}
                                {"-"} {clientMedicalRecord?.injury_details.map((injury: any, index: number) => {
                                    return <>{injury.body_part_details.name}({injury.body_side}) {index !== clientMedicalRecord?.injury_details.length - 1 ? <> | </> : ""}</>
                                })}</div>
                            <span className={'view-all-body-parts'}
                                  onClick={openBodyPartsModal}> View All Body Parts </span>
                        </DataLabelValueComponent>
                        <div className={'ts-row'}>
                            <div className={'ts-col-md-3'}>
                                <DataLabelValueComponent label={'Date of Surgery'}>
                                    {CommonService.transformTimeStamp(surgeryRecordDetails?.surgery_date) || "-"}
                                </DataLabelValueComponent>
                            </div>
                            <div className={'ts-col-md-3'}>
                                <DataLabelValueComponent label={'Reported By'}>
                                    {(surgeryRecordDetails?.reported_by_details?.first_name || '-') + ' ' + (surgeryRecordDetails?.reported_by_details?.last_name || '')}
                                </DataLabelValueComponent>
                            </div>
                            <div className={'ts-col-md-3'}>
                                <DataLabelValueComponent label={'Name of Surgeon'}>
                                    {surgeryRecordDetails?.surgeon_name || "-"}
                                </DataLabelValueComponent>
                            </div>
                        </div>
                        <div className={'ts-row'}>
                            <div className={'ts-col-md-12'}>
                                <DataLabelValueComponent label={'Brief Details'}>
                                    {surgeryRecordDetails?.details || "-"}
                                </DataLabelValueComponent>
                            </div>
                        </div>
                    </CardComponent>
                </>
            }
            <div className="ts-col-12 text-right">
                <ButtonComponent
                    className={'white-space-nowrap'}
                    type={"button"}
                    onClick={
                        () => {

                        }
                    }
                >
                    <AddIcon/>&nbsp;Add Attachment
                </ButtonComponent>
            </div>

            <ModalComponent size={'xl'} fullWidth={true} fullScreen={true} isOpen={!!showAttachment}
                            onClose={closeShowAttachment}>
                {!!showAttachment && <iframe title={'show attachment pdf'} style={{height: '85vh'}} width={'100%'} src={showAttachment}/>}
                <div className={'close-modal-btn'}>
                    <ButtonComponent variant={'contained'} onClick={closeShowAttachment}>Close</ButtonComponent>
                </div>
            </ModalComponent>
            <div className="ts-row">
                <div className="ts-col">
                    {surgeryRecordDetails && surgeryRecordId && surgeryRecordDetails.attachments.map((attachment: any) => {
                        return (
                            <div className="ts-row mrg-top-10">
                                <div className="ts-col-12">
                                    <CardComponent color={'primary'} size={'sm'}>
                                        <div className="attachment-item">
                                            <div className="attachment-bg">
                                                <PDF_ICON/>
                                            </div>
                                            <div className="attachment-text ">{attachment.name}</div>
                                            <div className="attachment-actions">
                                                <div className="">
                                                    <ButtonComponent variant={'outlined'} color={'primary'}
                                                                     onClick={event => {
                                                                         window.open(attachment.url);
                                                                         // setShowAttachment(attachment.url);
                                                                     }}>
                                                        <Visibility/> View
                                                    </ButtonComponent>
                                                    <ButtonComponent variant={'outlined'} color={'error'}
                                                                     onClick={event => {
                                                                         CommonService.onConfirm({
                                                                             confirmationTitle: 'Confirmation',
                                                                             confirmationSubTitle: `Do you want to remove "${attachment.name}""?`
                                                                         }).then(() => {
                                                                             deleteSurgeryAttachment(surgeryRecordId, attachment._id);
                                                                         })
                                                                     }}>
                                                        <DeleteOutlined/> Delete
                                                    </ButtonComponent>
                                                    <ButtonComponent variant={'contained'} color={'primary'}
                                                                     onClick={() => {
                                                                         const windowPdf = window.open(attachment.url, '_blank');

                                                                         if (windowPdf) {
                                                                             windowPdf.onload = (ev) => {
                                                                                 setTimeout(() => {
                                                                                     windowPdf.window.print();
                                                                                 }, 200)
                                                                             }
                                                                         }
                                                                         // printJS(attachment.url, 'pdf')
                                                                     }}>
                                                        <PrintRounded/> Print
                                                    </ButtonComponent>
                                                </div>
                                            </div>
                                        </div>
                                    </CardComponent>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

        </div>
    );

};

export default SurgeryRecordViewScreen;
