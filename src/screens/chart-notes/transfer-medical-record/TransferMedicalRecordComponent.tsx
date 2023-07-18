import "./TransferMedicalRecordComponent.scss";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import SearchComponent from "../../../shared/components/search/SearchComponent";
import AvatarComponent from "../../../shared/components/avatar/AvatarComponent";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import TableComponent from "../../../shared/components/table/TableComponent";
import {ITableColumn} from "../../../shared/models/table.model";
import RadioButtonGroupComponent, {
    RadioButtonComponent
} from "../../../shared/components/form-controls/radio-button/RadioButtonComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import CheckBoxComponent from "../../../shared/components/form-controls/check-box/CheckBoxComponent";
import {ImageConfig} from "../../../constants";

interface TransferMedicalRecordComponentProps {
    onClose: () => void;
    onMedicalRecordTransfer: (data: any) => void;
    medicalRecordId: string;
    setRefreshToken?: any;
}

const TransferMedicalRecordComponent = (props: TransferMedicalRecordComponentProps) => {

        const {medicalRecordId, onClose, setRefreshToken} = props;
        const [currentStep, setCurrentStep] = useState<"selectClient" | "selectInterventions" | "selectTargetMedicalRecord">("selectClient");
        const [clientSearchKey, setClientSearchKey] = useState<string>('');
        const {onMedicalRecordTransfer} = props;
        const [isClientListLoading, setIsClientListLoading] = useState<boolean>(false);
        const [clientList, setClientList] = useState<any>([]);
        const [isMedicalInterventionListLoading, setIsMedicalInterventionListLoading] = useState<boolean>(false);
        const [medicalInterventionList, setMedicalInterventionList] = useState<any>([]);
        const [selectedClient, setSelectedClient] = useState<any>(null);
        const [selectedMedicalInterventions, setSelectedMedicalInterventions] = useState<any>([]);
        const [selectedMedicalRecordToTransferUnder, setSelectedMedicalRecordToTransferUnder] = useState<any>(undefined);
        const [isMedicalRecordListLoading, setIsMedicalRecordListLoading] = useState<boolean>(false);
        const [medicalRecordList, setMedicalRecordList] = useState<any>([]);
        const [shouldTransferEntireMedicalRecord, setShouldTransferEntireMedicalRecord] = useState<boolean>(false);
        const [isMedicalRecordTransferUnderProgress, setIsMedicalRecordTransferUnderProgress] = useState<boolean>(false);
        const ClientListColumns: ITableColumn[] = useMemo(() => [
            {
                title: 'Client Name',
                key: 'name',
                dataIndex: 'name',
                render: (item: any) => {
                    return <RadioButtonComponent
                        label={`${CommonService.extractName(item)} (ID: ${item.client_id || ''})`}
                        name={'client'} value={item?._id}
                        checked={selectedClient?._id === item?._id}
                        onChange={() => {
                            setSelectedClient(item);
                        }}
                    />
                }
            }
        ], [selectedClient]);

        const handleSelectAllMedicalInterventions = useCallback((value: boolean) => {
            if (value) {
                setSelectedMedicalInterventions(medicalInterventionList);
            } else {
                setSelectedMedicalInterventions([]);
            }
        }, [medicalInterventionList]);

        const handleSelectMedicalIntervention = useCallback((isChecked: boolean, intervention: any) => {
            if (isChecked) {
                setSelectedMedicalInterventions([...selectedMedicalInterventions, intervention]);
            } else {
                setSelectedMedicalInterventions(selectedMedicalInterventions.filter((item: any) => item?._id !== intervention?._id));
            }
        }, [selectedMedicalInterventions]);

        const MedicalInterventionListColumns: ITableColumn[] = useMemo(() => [
            {
                title: "File Name",
                key: 'select',
                dataIndex: 'select',
                render: (item: any) => {
                    return <CheckBoxComponent
                        value={item?._id}
                        label={item?.note_type}
                        disabled={shouldTransferEntireMedicalRecord}
                        checked={selectedMedicalInterventions?.findIndex((selectedItem: any) => selectedItem?._id === item?._id) > -1}
                        onChange={(isChecked) => {
                            handleSelectMedicalIntervention(isChecked, item);
                        }}
                    />
                },
                width: 200,
            },
            {
                title: 'Date',
                key: 'date',
                dataIndex: 'date',
                align: 'center',
                render: (item: any) => {
                    return CommonService.getSystemFormatTimeStamp(item?.created_at);
                },
                width: 100,
            },
            {
                title: '',
                key: 'view_details',
                width: 100,
                render: (item: any) => {
                    let route = '';
                    if (medicalRecordId) {
                        if (item?.note_type_category?.toLowerCase() === 'surgery record') {
                            route = CommonService._routeConfig.MedicalRecordSurgeryRecordDetails(medicalRecordId, item._id);
                        } else if (item?.note_type_category?.toLowerCase() === 'dry needling') {
                            route = CommonService._routeConfig.MedicalInterventionDryNeedlingFileViewDetails(medicalRecordId, item._id);
                        } else if (item?.note_type_category?.toLowerCase() === 'concussion') {
                            route = CommonService._routeConfig.MedicalInterventionConcussionFileViewDetails(medicalRecordId, item._id);
                        } else if (item?.note_type_category?.toLowerCase() === 'document') {
                            route = CommonService._routeConfig.MedicalRecordDocumentViewDetails(medicalRecordId, item._id);
                        } else if (item?.note_type?.toLowerCase() === 'exercise log') {
                            route = CommonService._routeConfig.MedicalInterventionExerciseLogView(medicalRecordId, item?.intervention_id);
                        } else if (item?.note_type?.toLowerCase() === "soap note") {
                            route = CommonService._routeConfig.MedicalInterventionDetails(medicalRecordId, item?._id);
                        } else if (item?.note_type?.toLowerCase() === "progress report") {
                            route = CommonService._routeConfig.MedicalRecordProgressReportViewDetails(medicalRecordId, item?._id);
                        } else {
                        }
                        return <LinkComponent route={route} behaviour={"redirect"}>
                            {
                                route ? "View Details" : "Coming soon"
                            }
                        </LinkComponent>
                    }
                }
            }
        ], [shouldTransferEntireMedicalRecord, selectedMedicalInterventions, medicalRecordId, handleSelectMedicalIntervention]);

        const MedicalRecordListColumns: ITableColumn[] = useMemo(() => [
            {
                title: 'Case',
                key: 'select',
                dataIndex: 'select',
                width: 255,
                render: (item: any) => {
                    return <RadioButtonComponent
                        name={'medical-intervention'}
                        value={item?._id}
                        label={CommonService.generateInterventionNameFromMedicalRecord(item)}
                        checked={selectedMedicalRecordToTransferUnder?._id === item?._id}
                        onChange={() => {
                            setSelectedMedicalRecordToTransferUnder(item);
                        }}
                    />
                }
            },
            // {
            //     title: 'Case',
            //     key: 'case',
            //     dataIndex: 'case',
            //     render: (item: any) => {
            //         return CommonService.generateInterventionNameFromMedicalRecord(item);
            //     }
            // },
            {
                title: 'Date',
                key: 'date',
                width: 50,
                align: "center",
                dataIndex: 'date',
                render: (item: any) => {
                    return CommonService.getSystemFormatTimeStamp(item?.onset_date);
                }
            }
        ], [selectedMedicalRecordToTransferUnder]);


        const handleTransferMedicalRecord = useCallback(() => {
            setIsMedicalRecordTransferUnderProgress(true);
            const payload = {
                "is_transfer_record": shouldTransferEntireMedicalRecord,
                "medical_record_id": shouldTransferEntireMedicalRecord ? medicalRecordId : selectedMedicalRecordToTransferUnder?._id,
                "transfer_records": !shouldTransferEntireMedicalRecord ? selectedMedicalInterventions?.map((item: any) => {
                    return {
                        "_id": item?._id,
                        "note_type_category": item?.note_type || item?.note_type_category,
                    }
                }) : [],
            };
            CommonService._chartNotes.TransferMedicalRecordAPICall(selectedClient?._id, payload)
                .then((response: IAPIResponseType<any>) => {
                    onMedicalRecordTransfer(response?.data);
                    CommonService._alert.showToast("File(s) have been transferred successfully.", 'success');
                    setRefreshToken(Math.random().toString(36).substring(7));
                    setIsMedicalRecordTransferUnderProgress(false);
                }).catch((error: any) => {
                CommonService._alert.showToast(error?.error || "Error while transferring Medical Record", 'error');
                setIsMedicalRecordTransferUnderProgress(false);
            });
        }, [onMedicalRecordTransfer, setRefreshToken, selectedClient, medicalRecordId, shouldTransferEntireMedicalRecord, selectedMedicalInterventions, selectedMedicalRecordToTransferUnder]);

        const confirmTransferMedicalRecord = useCallback(() => {
            CommonService.onConfirm({
                image: ImageConfig.PopupLottie,
                showLottie: true,
                confirmationTitle: "TRANSFER COMPLETE RECORD",
                confirmationSubTitle: "Are you sure you want to transfer the \n" +
                    "complete medical record?"
            })
                .then(() => {
                    handleTransferMedicalRecord();
                }).catch(() => {

            });
        }, [handleTransferMedicalRecord]);

        const confirmTransferCase = useCallback(() => {
            console.log("selectedMedicalRecordToTransferUnder", selectedMedicalRecordToTransferUnder);
            CommonService.onConfirm({
                image: ImageConfig.PopupLottie,
                showLottie: true,
                confirmationTitle: "TRANSFER FILE TO",
                confirmationSubTitle: "Are you sure you want to transfer this File to : ",
                confirmationDescription: <div className="transfer-file-to">
                        <div className={'mrg-bottom-10'}>
                            <span className={'client-case-name-title'}>Client:</span> <span>{selectedClient?.first_name} {selectedClient?.last_name}</span>
                        </div>
                        <div>
                            <span className={'client-case-name-title'}>Case:</span> <span>{selectedMedicalRecordToTransferUnder?.injury_details?.map((injury: any, index: number) => {
                            return <>{injury.body_part_details.name} {injury.body_side ? `( ${injury.body_side} )` : ''} {index !== selectedMedicalRecordToTransferUnder?.injury_details.length - 1 ? <> | </> : ""}</>
                        })}</span>
                        </div>
                </div>
            })
                .then(() => {
                    handleTransferMedicalRecord();
                }).catch(() => {

            });
        }, [handleTransferMedicalRecord, selectedClient, selectedMedicalRecordToTransferUnder]);

        const getClientList = useCallback((searchKey: string = '') => {
            setClientSearchKey(searchKey);
            setIsClientListLoading(true);
            CommonService._client.ClientListLiteAPICall({search: searchKey}).then((response: IAPIResponseType<any>) => {
                setClientList(response.data);
                setIsClientListLoading(false);
            }).catch((error: any) => {
                setClientList([]);
                setIsClientListLoading(false);
            });
        }, []);
        useEffect(() => {
            getClientList()
        }, [getClientList])

        const getClientMedicalInterventionList = useCallback(() => {
            setIsMedicalInterventionListLoading(true);
            CommonService._chartNotes.MedicalRecordFilesListAPICall(medicalRecordId)
                .then((response: IAPIResponseType<any>) => {
                    setMedicalInterventionList(response.data);
                    setIsMedicalInterventionListLoading(false);
                }).catch((error: any) => {
                setMedicalInterventionList([]);
                setIsMedicalInterventionListLoading(false);
            });
        }, [medicalRecordId]);

        const getSelectedClientMedicalRecordList = useCallback(() => {
            setIsMedicalRecordListLoading(true);
            CommonService._chartNotes.MedicalRecordListLiteAPICall(selectedClient?._id).then((response: IAPIResponseType<any>) => {
                setMedicalRecordList(response.data);
                setIsMedicalRecordListLoading(false);
            }).catch((error: any) => {
                setMedicalRecordList([]);
                setIsMedicalRecordListLoading(false);
            });
        }, [selectedClient]);

        const handleConfirmation = useCallback(() => {
            switch (currentStep) {
                case "selectClient":
                    getSelectedClientMedicalRecordList();
                    getClientMedicalInterventionList();
                    setCurrentStep("selectInterventions");
                    break;
                case "selectInterventions":
                    if (shouldTransferEntireMedicalRecord) {
                        confirmTransferMedicalRecord();
                    } else {
                        setCurrentStep("selectTargetMedicalRecord");
                    }
                    break;
                case "selectTargetMedicalRecord":
                    confirmTransferCase();
                    break;
            }
        }, [shouldTransferEntireMedicalRecord, currentStep, confirmTransferMedicalRecord, getSelectedClientMedicalRecordList, getClientMedicalInterventionList, confirmTransferCase]);

        const handleBack = useCallback(() => {
            switch (currentStep) {
                case "selectInterventions":
                    setCurrentStep("selectClient");
                    getClientMedicalInterventionList();
                    break;
                case  "selectTargetMedicalRecord"  :
                    setCurrentStep("selectInterventions");
                    break;
            }
        }, [currentStep, getClientMedicalInterventionList]);
        //
        // useEffect(() => {
        //     getClientList();
        // }, [getClientList]);

        return (
            <div className={'transfer-medical-record-component'}>

                {
                    (currentStep === "selectInterventions" || currentStep === 'selectTargetMedicalRecord') &&
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
                }
                {
                    currentStep === "selectClient" &&
                    <div className={'cross-btn'}>
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
                }
                <FormControlLabelComponent label={"Transfer File to"} className={'transfer-file-to-heading'} size={"lg"}/>
                {
                    currentStep === "selectClient" && <div className={"select-client-wrapper"}>
                        <SearchComponent label={"Search "}
                                         placeholder={"Search using Name/ID"}
                                         value={clientSearchKey}
                                         onSearchChange={(value) => {
                                             setSelectedClient(undefined);
                                             getClientList(value);
                                         }}/>
                        <>
                            <FormControlLabelComponent label={"Client List"} className={"client-list-heading"}/>
                            <TableComponent data={clientList}
                                            className={'client-list-table'}
                                            columns={ClientListColumns}
                                            loading={isClientListLoading}
                                            noDataText={"No clients available for the name/ID you have searched."}
                                            bordered={true}
                                            hideHeader={false}
                                            onRowClick={(row: any) => {
                                                setSelectedClient(row);
                                            }}
                            />
                        </>

                    </div>
                }
                {
                    currentStep === "selectInterventions" &&
                    <div className="select-interventions-wrapper">
                        <CardComponent color={"primary"} size={"sm"} className={'mini-card-wrapper'}>
                            <div className="client-mini-card">
                                <AvatarComponent title={CommonService.extractName(selectedClient)} className={'avatar'}/>
                                <div className="client-name">
                                    {CommonService.extractName(selectedClient)}
                                </div>
                            </div>
                        </CardComponent>
                        <div className={"select-intervention-choice-wrapper"}>
                            <FormControlLabelComponent className={"select-intervention-choice-label"}
                                                       size={'sm'}
                                                       label={"Want to transfer complete medical record?"}/>
                            <RadioButtonGroupComponent
                                options={CommonService._staticData.yesNoOptions}
                                direction={"row"}
                                name={'transferMedicalRecord'}
                                isValueBoolean={true}
                                value={shouldTransferEntireMedicalRecord}
                                onChange={(value) => {
                                    setSelectedMedicalInterventions([]);
                                    setShouldTransferEntireMedicalRecord(value);
                                    if (value) {
                                        handleSelectAllMedicalInterventions(true);
                                    }
                                }
                                }
                            />
                        </div>
                        <div className={'medical-intervention-list-wrapper'}>
                            <TableComponent data={medicalInterventionList}
                                            columns={MedicalInterventionListColumns}
                                            loading={isMedicalInterventionListLoading}
                            />
                        </div>
                    </div>
                }
                {
                    currentStep === "selectTargetMedicalRecord" && <div className={"select-medical-record-wrapper"}>
                        <CardComponent color={"primary"} size={"sm"}>
                            <div className="client-mini-card">
                                <AvatarComponent title={CommonService.extractName(selectedClient)}/>
                                <div className="client-name">
                                    {CommonService.extractName(selectedClient)}
                                </div>
                            </div>
                        </CardComponent>
                        <div className={'case-list-table'}>
                            <TableComponent data={medicalRecordList}
                                            className={isMedicalRecordTransferUnderProgress ? 'mrg-bottom-20':''}
                                            noDataText={'Currently, there are no open cases for this client.'}
                                            columns={MedicalRecordListColumns}
                                            loading={isMedicalRecordListLoading}
                                // hideHeader={true}
                            />
                        </div>
                    </div>
                }
                {(currentStep === 'selectInterventions' || currentStep === 'selectTargetMedicalRecord') &&
                    <ButtonComponent
                        fullWidth={true}
                        className={"t-form-actions"}
                        disabled={
                            (currentStep === "selectInterventions" && (shouldTransferEntireMedicalRecord === false && selectedMedicalInterventions?.length === 0)) ||
                            (currentStep === "selectTargetMedicalRecord" && !selectedMedicalRecordToTransferUnder) ||
                            isMedicalRecordTransferUnderProgress
                        }
                        isLoading={isMedicalRecordTransferUnderProgress}
                        onClick={handleConfirmation}>
                        {
                            currentStep === "selectInterventions" && "Confirm"
                        }
                        {
                            currentStep === "selectTargetMedicalRecord" && "Transfer"
                        }
                    </ButtonComponent>
                }
                {
                    currentStep === "selectClient" && <div className="t-form-actions">
                        <ButtonComponent fullWidth={true}
                                         disabled={(currentStep === "selectClient" && !selectedClient)}
                                         isLoading={isMedicalRecordTransferUnderProgress}
                                         onClick={handleConfirmation}>
                            {
                                currentStep === "selectClient" && "Next"
                            }
                        </ButtonComponent>
                    </div>}
            </div>
        );

    }
;

export default TransferMedicalRecordComponent;
