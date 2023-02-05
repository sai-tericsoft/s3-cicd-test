import "./TransferMedicalRecordComponent.scss";
import {useCallback, useMemo, useState} from "react";
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
import {ImageConfig, Misc} from "../../../constants";

interface TransferMedicalRecordComponentProps {
    onMedicalRecordTransfer: (data: any) => void;
    medicalRecordId: string;
}

const TransferMedicalRecordComponent = (props: TransferMedicalRecordComponentProps) => {

        const {medicalRecordId} = props;
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
        const [selectedOptionToTransferMedicalRecord, setSelectedOptionToTransferMedicalRecord] = useState<boolean>(false);
        const [isMedicalRecordTransferUnderProgress, setIsMedicalRecordTransferUnderProgress] = useState<boolean>(false);

        const ClientListColumns: ITableColumn[] = useMemo(() => [
            {
                title: 'Name',
                key: 'name',
                dataIndex: 'name',
                render: (item: any) => {
                    return <RadioButtonComponent
                        label={CommonService.extractName(item)}
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
                title: <CheckBoxComponent
                    indeterminate={selectedMedicalInterventions.length > 0 && selectedMedicalInterventions.length < medicalInterventionList?.length}
                    disabled={selectedOptionToTransferMedicalRecord || medicalInterventionList?.length === 0}
                    checked={(medicalInterventionList?.length > 0 && (selectedMedicalInterventions?.length === medicalInterventionList?.length))}
                    onChange={(isChecked) => {
                        handleSelectAllMedicalInterventions(isChecked);
                    }
                    }
                />,
                key: 'select',
                dataIndex: 'select',
                render: (item: any) => {
                    return <CheckBoxComponent
                        value={item?._id}
                        disabled={selectedOptionToTransferMedicalRecord}
                        checked={selectedMedicalInterventions?.findIndex((selectedItem: any) => selectedItem?._id === item?._id) > -1}
                        onChange={(isChecked) => {
                            handleSelectMedicalIntervention(isChecked, item);
                        }}
                    />
                },
                width: 50,
            },
            {
                title: 'File',
                key: 'note_type',
                dataIndex: 'note_type',
                width: 200,
            },
            {
                title: 'Date',
                key: 'date',
                dataIndex: 'date',
                render: (item: any) => {
                    return CommonService.getSystemFormatTimeStamp(item?.created_at);
                },
                width: 150,
            },
            {
                title: '',
                key: 'view_details',
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
        ], [selectedOptionToTransferMedicalRecord, selectedMedicalInterventions, medicalInterventionList, medicalRecordId, handleSelectAllMedicalInterventions, handleSelectMedicalIntervention]);

        const MedicalRecordListColumns: ITableColumn[] = useMemo(() => [
            {
                title: '',
                key: 'select',
                dataIndex: 'select',
                render: (item: any) => {
                    return <RadioButtonComponent
                        name={'medical-intervention'}
                        value={item?._id}
                        checked={selectedMedicalRecordToTransferUnder?._id === item?._id}
                        onChange={() => {
                            setSelectedMedicalRecordToTransferUnder(item);
                        }}
                    />
                }
            },
            {
                title: 'Case',
                key: 'case',
                dataIndex: 'case',
                render: (item: any) => {
                    return CommonService.generateInterventionNameFromMedicalRecord(item);
                }
            },
            {
                title: 'Date',
                key: 'date',
                dataIndex: 'date',
                render: (item: any) => {
                    return CommonService.getSystemFormatTimeStamp(item?.onset_date);
                }
            }
        ], [selectedMedicalRecordToTransferUnder]);

        const handleTransferMedicalRecord = useCallback(() => {
            setIsMedicalRecordTransferUnderProgress(true);
            const payload = {
                "is_transfer_record": selectedOptionToTransferMedicalRecord,
                "medical_record_id": medicalRecordId,
                "transfer_records": selectedMedicalInterventions?.map((item: any) => {
                    return {
                        "_id": item?._id,
                        "note_type_category": item?.note_type || item?.note_type_category,
                    }
                }),
            };
            CommonService._chartNotes.TransferMedicalRecordAPICall(selectedClient?._id, payload)
                .then((response: IAPIResponseType<any>) => {
                    onMedicalRecordTransfer(response?.data);
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY] || "Successfully Medical Record transferred", 'success');
                    setIsMedicalRecordTransferUnderProgress(false);
                }).catch((error: any) => {
                CommonService._alert.showToast(error?.error || "Error while transferring Medical Record", 'error');
                setIsMedicalRecordTransferUnderProgress(false);
            });
        }, [onMedicalRecordTransfer, selectedClient, medicalRecordId, selectedOptionToTransferMedicalRecord, selectedMedicalInterventions]);

        const confirmTransferMedicalRecord = useCallback(() => {
            CommonService.onConfirm({
                image: ImageConfig.DeleteAttachmentConfirmationIcon,
                confirmationTitle: "TRANSFER COMPLETE RECORD",
                confirmationSubTitle: "Are you sure you want to transfer the \n" +
                    "complete medical record?"
            })
                .then(() => {
                    handleTransferMedicalRecord();
                }).catch(() => {

            });
        }, [handleTransferMedicalRecord]);

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

        const getClientMedicalInterventionList = useCallback(() => {
            setIsMedicalInterventionListLoading(true);
            CommonService._chartNotes.MedicalRecordConsolidatedInterventionAndAttachmentsListAPICall(medicalRecordId)
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
                    if (selectedOptionToTransferMedicalRecord) {
                        confirmTransferMedicalRecord();
                    } else {
                        setCurrentStep("selectTargetMedicalRecord");
                    }
                    break;
                case "selectTargetMedicalRecord":
                    handleTransferMedicalRecord();
                    break;
            }
        }, [currentStep, confirmTransferMedicalRecord, handleTransferMedicalRecord, getSelectedClientMedicalRecordList, getClientMedicalInterventionList]);

        //
        // useEffect(() => {
        //     getClientList();
        // }, [getClientList]);

        return (
            <div className={'transfer-medical-record-component'}>
                <FormControlLabelComponent label={"Transfer File to"} size={"lg"}/>
                {
                    currentStep === "selectClient" && <div className={"select-client-wrapper"}>
                        <SearchComponent label={"Search for Client"} value={clientSearchKey}
                                         onSearchChange={(value) => {
                                             setSelectedClient(undefined);
                                             getClientList(value);
                                         }}/>
                        {
                            clientSearchKey.length > 0 && <>
                                <FormControlLabelComponent label={"Client List"}/>
                                <TableComponent data={clientList}
                                                columns={ClientListColumns}
                                                loading={isClientListLoading}
                                                hideHeader={true}
                                />
                            </>
                        }
                    </div>
                }
                {
                    currentStep === "selectInterventions" && <div className="select-interventions-wrapper">
                        <CardComponent color={"primary"} size={"sm"}>
                            <div className="client-mini-card">
                                <AvatarComponent title={CommonService.extractName(selectedClient)}/>
                                <div className="client-name">
                                    {CommonService.extractName(selectedClient)}
                                </div>
                            </div>
                        </CardComponent>
                        <div className={"select-intervention-choice-wrapper"}>
                            <FormControlLabelComponent className={"select-intervention-choice-label"}
                                                       label={"Want to transfer complete medical record?"}/>
                            <RadioButtonGroupComponent
                                options={CommonService._staticData.yesNoOptions}
                                direction={"row"}
                                name={'transferMedicalRecord'}
                                isValueBoolean={true}
                                value={selectedOptionToTransferMedicalRecord}
                                onChange={(value) => {
                                    setSelectedMedicalInterventions([]);
                                    setSelectedOptionToTransferMedicalRecord(value);
                                }
                                }
                            />
                        </div>
                        <TableComponent data={medicalInterventionList}
                                        columns={MedicalInterventionListColumns}
                                        loading={isMedicalInterventionListLoading}
                        />
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
                        <TableComponent data={medicalRecordList}
                                        columns={MedicalRecordListColumns}
                                        loading={isMedicalRecordListLoading}
                                        hideHeader={true}
                        />
                    </div>
                }
                {clientSearchKey?.length > 0 && <div className="t-form-actions">
                    <ButtonComponent
                        fullWidth={true}
                        disabled={
                            (currentStep === "selectClient" && !selectedClient) ||
                            (currentStep === "selectInterventions" && (selectedOptionToTransferMedicalRecord === false && selectedMedicalInterventions?.length === 0)) ||
                            (currentStep === "selectTargetMedicalRecord" && !selectedMedicalRecordToTransferUnder) ||
                            isMedicalRecordTransferUnderProgress
                        }
                        isLoading={isMedicalRecordTransferUnderProgress}
                        onClick={handleConfirmation}>
                        {
                            currentStep === "selectClient" && "Next"
                        }
                        {
                            currentStep === "selectInterventions" && "Confirm"
                        }
                        {
                            currentStep === "selectTargetMedicalRecord" && "Transfer"
                        }
                    </ButtonComponent>
                </div>}
            </div>
        );

    }
;

export default TransferMedicalRecordComponent;
