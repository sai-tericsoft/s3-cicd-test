import "./TransferSoapNoteComponent.scss";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import React, {useCallback, useEffect, useState} from "react";
import SearchComponent from "../../../shared/components/search/SearchComponent";
import {ITableColumn} from "../../../shared/models/table.model";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {RadioButtonComponent} from "../../../shared/components/form-controls/radio-button/RadioButtonComponent";
import {CommonService} from "../../../shared/services";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import AvatarComponent from "../../../shared/components/avatar/AvatarComponent";
import TableComponent from "../../../shared/components/table/TableComponent";
import {ImageConfig} from "../../../constants";
import {useNavigate} from "react-router-dom";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";

interface TransferSoapNoteComponentProps {
    medicalRecordId: string;
    medicalInterventionId: string;
    onTransferSoapNote: () => void;
    onClose: () => void;
}

const TransferSoapNoteComponent = (props: TransferSoapNoteComponentProps) => {

    const {medicalInterventionId, onTransferSoapNote, onClose} = props;
    const navigate = useNavigate();
    const [clientListSearch, setClientListSearch] = useState<string>("");
    const [clientList, setClientList] = useState<any>([]);
    const [isClientListLoading, setIsClientListLoading] = useState<any>(false);
    // const [isClientListLoaded, setIsClientListLoaded] = useState<any>(false);
    // const [isClientListLoadingFailed, setIsClientListLoadingFailed] = useState<any>(false);
    const [selectedClient, setSelectedClient] = useState<any>("");
    const [currentStep, setCurrentStep] = useState<"selectClient" | "medicalRecordList">("selectClient");
    const [medicalRecordList, setMedicalRecordList] = useState<any>([]);
    const [selectedMedicalRecord, setSelectedMedicalRecord] = useState<any>(null);
    const [isMedicalRecordListLoading, setIsMedicalRecordListLoading] = useState<any>(false);
    // const [isMedicalRecordListLoaded, setIsMedicalRecordListLoaded] = useState<any>(false);
    const [isMedicalRecordListLoadingFailed, setIsMedicalRecordListLoadingFailed] = useState<any>(false);
    const [isSoapNoteTransferUnderProgress, setIsSoapNoteTransferUnderProgress] = useState<any>(false);

    const clientListColumns: ITableColumn[] = [
        {
            title: 'Client Name',
            key: "name",
            dataIndex: "name",
            render: (item: any) => {
                return <RadioButtonComponent name={'selected-client'}
                                             value={item}
                                             label={<><span className={item?.is_alias_name_set ? 'alias-name':''}>{`${CommonService.extractName(item)}`}</span> {`(ID: ${item.client_id || ''})`}</>}
                                             checked={selectedClient?._id === item?._id}
                                             onChange={(value: any) => {
                                                 setSelectedClient(value);
                                             }}/>
            }
        }
    ];

    const medicalRecordColumns: ITableColumn[] = [
        {
            title: 'Case',
            key: 'action',
            dataIndex: 'action',
            width: 250,
            render: (item: any) => {
                return <RadioButtonComponent name={'selected-medical-record'}
                                             value={item}
                                             label={CommonService.generateInterventionNameFromMedicalRecord(item)}
                                             checked={selectedMedicalRecord?._id === item?._id}
                                             onChange={(value: any) => {
                                                 setSelectedMedicalRecord(value);
                                             }}/>
            }
        },
        // {
        //     title: 'Case',
        //     key: 'case',
        //     width: 294,
        //     dataIndex: 'intervention_linked_to',
        //     render: (item: any) => {
        //         return <span className={'medical-record-details'}>{item?.intervention_linked_to}
        //             {item?.created_at && CommonService.transformTimeStamp(item?.created_at)}{" "}
        //             {"-"} {item?.injury_details.map((injury: any, index: number) => {
        //                 return <>{injury.body_part_details.name}({injury.body_side}) {index !== item?.injury_details.length - 1 ? <> | </> : ""}</>
        //             })}
        //                                  </span>
        //     }
        // },
        {
            title: 'Date',
            key: 'date',
            width: 150,
            fixed: 'right',
            dataIndex: 'created_at',
            render: (item: any) => {
                return <span>{CommonService.getSystemFormatTimeStamp(item?.created_at)}</span>

            }

        }
    ];

    const getClientList = useCallback(() => {
        setIsClientListLoading(true);
        // setIsClientListLoaded(false);
        // setIsClientListLoadingFailed(false);
        CommonService._client.ClientListLiteAPICall({search: clientListSearch})
            .then((response: any) => {
                setClientList(response.data);
                setIsClientListLoading(false);
                // setIsClientListLoaded(true);
                // setIsClientListLoadingFailed(false);
            }).catch((error: any) => {
            setClientList(false);
            // setIsClientListLoaded(false);
            // setIsClientListLoadingFailed(true);
        })
    }, [clientListSearch]);

    useEffect(() => {
        getClientList();
    }, [getClientList])

    const getMedicalRecordList = useCallback(() => {
        setIsMedicalRecordListLoading(true);
        // setIsMedicalRecordListLoaded(false);
        setIsMedicalRecordListLoadingFailed(false);
        CommonService._client.GetClientMedicalRecordList(selectedClient?._id, {})
            .then((response: any) => {
                setMedicalRecordList(response.data);
                setIsMedicalRecordListLoading(false);
                // setIsMedicalRecordListLoaded(true);
                setIsMedicalRecordListLoadingFailed(false);
            }).catch((error: any) => {
            setIsMedicalRecordListLoading(false);
            // setIsMedicalRecordListLoaded(false);
            setIsMedicalRecordListLoadingFailed(true);
        })
    }, [selectedClient]);


    const handleClientSelectionConfirmation = useCallback(() => {
        getMedicalRecordList();
        setCurrentStep("medicalRecordList");
    }, [getMedicalRecordList]);

    const handleTransferSoapNote = useCallback(() => {
        CommonService.onConfirm({
            image: ImageConfig.PopupLottie,
            showLottie: true,
            confirmationTitle: "TRANSFER SOAP TO",
            confirmationSubTitle: 'Are you sure you want to transfer this SOAP to:',
            confirmationDescription: <div className="transfer-file-to">
            <div className={'mrg-bottom-10'}>
                <span className={'client-case-name-title'}>Client:</span> <span className={selectedClient?.is_alias_name_set ? "alias-name":""}>  {CommonService.extractName(selectedClient)}</span>
            </div>
            <div>
                <span className={'client-case-name-title '}>Case:</span> <span>{CommonService.generateInterventionNameFromMedicalRecord(selectedMedicalRecord)}</span>
            </div>
        </div>
        }).then(() => {
            setIsSoapNoteTransferUnderProgress(true);
            CommonService._chartNotes.TransferSoapNoteAPICall(medicalInterventionId, {
                medical_record_id: selectedMedicalRecord?._id
            })
                .then((response: any) => {
                    CommonService._alert.showToast('SOAP note has been transferred successfully', "success");
                    onTransferSoapNote();
                    setIsSoapNoteTransferUnderProgress(false);
                    navigate(CommonService._routeConfig.UpdateMedicalIntervention(selectedMedicalRecord?._id, medicalInterventionId));
                }).catch((error: any) => {
                CommonService._alert.showToast(error.error, "error");
                setIsSoapNoteTransferUnderProgress(false);
            })
        });
    }, [navigate, medicalInterventionId, selectedMedicalRecord, onTransferSoapNote, selectedClient]);

    const handleBack = useCallback(() => {
        switch (currentStep) {
            case "medicalRecordList":
                setCurrentStep("selectClient");
                getClientList();
                break;

        }
    }, [currentStep, getClientList]);

    return (
        <div className={'transfer-soap-note-component'}>
            <div>
                {
                    currentStep === "medicalRecordList" && <>
                        <div className={'back-cross-btn-wrapper'}>
                            <div className="back-btn" onClick={handleBack}><ImageConfig.LeftArrow/></div>
                            {/*<ToolTipComponent tooltip={"Close"} position={"left"}>*/}
                            <div className="drawer-close"
                                 id={'book-appointment-close-btn'}
                                 onClick={(event) => {
                                     if (onClose) {
                                         onClose();
                                     }
                                 }
                                 }><ImageConfig.CloseIcon/></div>
                            {/*</ToolTipComponent>*/}
                        </div>
                    </>
                }
                {
                    currentStep === 'selectClient' &&
                    <div className={'cross-btn'}>
                        <div className="drawer-close"
                             id={'book-appointment-close-btn'}
                             onClick={(event) => {
                                 if (onClose) {
                                     onClose();
                                 }
                             }
                             }><ImageConfig.CloseIcon/></div>
                    </div>
                }
                {currentStep === "selectClient" && <div className={'client-search-table-wrapper'}>
                    <FormControlLabelComponent label={'Transfer SOAP to'} className={'transfer-soap-heading'}
                                               size={'lg'}/>
                    <SearchComponent label={'Search'}
                                     value={clientListSearch}
                                     placeholder={'Search using Name/ID'}
                                     onSearchChange={(value) => {
                                         setClientListSearch(value);
                                     }}
                    />
                    {
                        <>
                            <div className={'client-list-header'}>Client List</div>
                            <div className={'mrg-bottom-20'}>
                                <TableComponent data={clientList}
                                                columns={clientListColumns}
                                                loading={isClientListLoading}
                                                hideHeader={false}
                                                noDataText={'No client available by the Name/ID you have searched'}
                                                onRowClick={(row: any) => {
                                                    setSelectedClient(row);
                                                }}
                                />
                            </div>
                            <ButtonComponent fullWidth={true}
                                             onClick={() => handleClientSelectionConfirmation()}
                                             disabled={!selectedClient}>
                                Next
                            </ButtonComponent>
                        </>
                    }
                </div>
                }
                {
                    medicalInterventionId && currentStep === "medicalRecordList" && <>
                        {/*{*/}
                        {/*    isMedicalRecordListLoading && <div><LoaderComponent/></div>*/}
                        {/*}*/}
                        {
                            isMedicalRecordListLoadingFailed &&
                            <StatusCardComponent title={'Failed to load Medical Record list'}/>

                        }
                        <PageHeaderComponent title={'Transfer SOAP to'}/>
                        <div>
                            <CardComponent color={'primary'} size={"sm"}>
                                <div className={'card-content-wrapper'}>
                                    <div className={'client-image-wrapper'}>
                                        <AvatarComponent
                                            title={CommonService.extractName(selectedClient)}/>
                                    </div>
                                    <div>
                                        <div
                                            className={'client-name'}><span className={selectedClient?.is_alias_name_set ? "alias-name":""}>  {CommonService.extractName(selectedClient)}</span></div>
                                    </div>
                                </div>
                            </CardComponent>
                            <div className={'card-table-button-wrapper'}>
                                <div className={'card-table'}>
                                    <TableComponent
                                        data={medicalRecordList}
                                        loading={isMedicalRecordListLoading}
                                        noDataText={'No case is open for this client'}
                                        columns={medicalRecordColumns}
                                        onRowClick={(row) => {
                                            setSelectedMedicalRecord(row)
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="t-form-actions display-flex ts-justify-content-center">
                                {/*<ButtonComponent*/}
                                {/*    variant={"outlined"}*/}
                                {/*    className={isSoapNoteTransferUnderProgress ? 'mrg-right-15' : ''}*/}
                                {/*    id={"medical_intervention_add_cancel_btn"}*/}
                                {/*    onClick={() => setCurrentStep("selectClient")}*/}
                                {/*>*/}
                                {/*    Back*/}
                                {/*</ButtonComponent>*/}
                                {/*&nbsp;*/}
                                <ButtonComponent
                                    onClick={handleTransferSoapNote}
                                    fullWidth={true}
                                    isLoading={isSoapNoteTransferUnderProgress}
                                    disabled={!selectedMedicalRecord || isSoapNoteTransferUnderProgress}>
                                    Transfer
                                </ButtonComponent>
                            </div>

                        </div>
                    </>
                }
            </div>
        </div>
    );

};

export default TransferSoapNoteComponent;
