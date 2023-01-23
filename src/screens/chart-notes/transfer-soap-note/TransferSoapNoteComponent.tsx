import "./TransferSoapNoteComponent.scss";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import React, {useCallback, useEffect, useState} from "react";
import SearchComponent from "../../../shared/components/search/SearchComponent";
import {IClientBasicDetails} from "../../../shared/models/client.model";
import {ITableColumn} from "../../../shared/models/table.model";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {RadioButtonComponent} from "../../../shared/components/form-controls/radio-button/RadioButtonComponent";
import {CommonService} from "../../../shared/services";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import AvatarComponent from "../../../shared/components/avatar/AvatarComponent";
import TableComponent from "../../../shared/components/table/TableComponent";
import {ImageConfig, Misc} from "../../../constants";
import {useParams} from "react-router-dom";

interface TransferSoapNoteComponentProps {
    closeTransferSoapNoteDrawer: () => void;
}


const TransferSoapNoteComponent = (props: TransferSoapNoteComponentProps) => {

    const {closeTransferSoapNoteDrawer} = props;
    const [clientListSearch, setClientListSearch] = useState<string>("");
    const [clientList, setClientList] = useState<any>([]);
    const [isClientListLoading, setIsClientListLoading] = useState<any>(false);
    const [isClientListLoaded, setIsClientListLoaded] = useState<any>(false);
    const [isClientListLoadingFailed, setIsClientListLoadingFailed] = useState<any>(false);
    const [clientSelectedName, setClientSelectedName] = useState<any>("");
    const [clientNameSelectedValue, setClientNameSelectedValue] = useState<any>(false);
    const [selectedSoapNoteFile, setSelectedSoapNoteFile] = useState<any | undefined>(undefined);
    const [currentStep, setCurrentStep] = useState<"selectType" | "medicalRecordList">("selectType");
    const [medicalRecordList, setMedicalRecordList] = useState<any>([]);
    const [clientSelectedMedicalRecordName, setClientSelectedMedicalRecordName] = useState<any>("");
    const [clientSelectedMedicalRecordValue, setClientSelectedMedicalRecordValue] = useState<any>("");
    const [isMedicalRecordListLoading, setIsMedicalRecordListLoading] = useState<any>(false);
    const [isMedicalRecordListLoaded, setIsMedicalRecordListLoaded] = useState<any>(false);
    const [isMedicalRecordListLoadingFailed, setIsMedicalRecordListLoadingFailed] = useState<any>(false);

    const {medicalRecordId, medicalInterventionId} = useParams();
    console.log("medicalRecordId", medicalRecordId);
    console.log("interventionId", medicalInterventionId);

    const clientListColumns: ITableColumn[] = [
        {
            key: "name",
            dataIndex: "name",
            render: (_: string, item: any) => {
                return  <RadioButtonComponent name={clientSelectedName} value={item}
                                              label={CommonService.extractName(item)}
                                              checked={clientSelectedName === item}
                                              onChange={(value: any) => {
                                                  setClientSelectedName(value);
                                                  setClientNameSelectedValue(true);
                                              }}/>
            }
        }
    ]

    const medicalRecordColumns: ITableColumn[] = [
        {
            title: '',
            key: 'action',
            dataIndex: 'action',
            width: 50,
            render: (_: any, item: any) => {
                return <RadioButtonComponent name={clientSelectedMedicalRecordName}
                                             value={item}
                                             checked={clientSelectedMedicalRecordName === item}
                                             onChange={(value: any) => {
                                                 setClientSelectedMedicalRecordName(value);
                                                 console.log('ClientSelectedMedicalRecordName', clientSelectedMedicalRecordName);
                                                 setClientSelectedMedicalRecordValue(true);
                                             }}/>
            }
        },
        {
            title: 'Case',
            key: 'case',
            width: 294,
            dataIndex: 'intervention_linked_to',
            render: (_: any, item: any) => {
                return <span className={'medical-record-details'}>{item?.intervention_linked_to}
                    {item?.created_at && CommonService.transformTimeStamp(item?.created_at)}{" "}
                    {"-"} {item?.injury_details.map((injury: any, index: number) => {
                        return <>{injury.body_part_details.name}({injury.body_side}) {index !== item?.injury_details.length - 1 ? <> | </> : ""}</>
                    })}
                                         </span>
            }
        },
        {
            title: 'Date',
            key: 'date',
            width: 100,
            dataIndex: 'created_at',
            render: (_: any, item: any) => {
                return <span>{CommonService.getSystemFormatTimeStamp(item?.created_at)}</span>

            }

        }
    ];


    useEffect(() => {
        getClientList();
    }, []);

    const getClientList = useCallback(() => {
        setIsClientListLoading(true);
        setIsClientListLoaded(false);
        setIsClientListLoadingFailed(false);
        CommonService._client.GetClientList({search: clientListSearch})
            .then((response: any) => {
                setClientList(response.data);
                setIsClientListLoading(false);
                setIsClientListLoaded(true);
                setIsClientListLoadingFailed(false);
            }).catch((error: any) => {
            setClientList(false);
            setIsClientListLoaded(false);
            setIsClientListLoadingFailed(true);
        })
    }, [clientListSearch]);
    console.log('clientSelectedName1', clientSelectedName._id);

    const onSoapNoteSelect = useCallback((type: any, id: any) => {
        getMedicalRecordList(id);
        setSelectedSoapNoteFile(type);
        setCurrentStep("medicalRecordList");

    }, []);


    const getMedicalRecordList = useCallback((id: string) => {
        console.log('clientSelectedName2', id);
        setIsMedicalRecordListLoading(true);
        setIsMedicalRecordListLoaded(false);
        setIsMedicalRecordListLoadingFailed(false);
        CommonService._client.GetClientMedicalRecordList(id, {})
            .then((response: any) => {
                setMedicalRecordList(response.data);
                setIsMedicalRecordListLoading(false);
                setIsMedicalRecordListLoaded(true);
                setIsMedicalRecordListLoadingFailed(false);
            }).catch((error: any) => {
            setIsMedicalRecordListLoading(false);
            setIsMedicalRecordListLoaded(false);
            setIsMedicalRecordListLoadingFailed(true);
        })
    }, [clientSelectedName]);

    const handleTransferSoapNote = useCallback((item1: any, item2: any, medicalInterventionId: string) => {
        console.log('record', item1);
        console.log('client', item2);
        CommonService.onConfirm({
            image: ImageConfig.DeleteAttachmentConfirmationIcon,
            confirmationTitle: "TRANSFER SOAP TO",
            confirmationSubTitle: `Are you sure you want to transfer this SOAP to: ${item2.first_name} ${item2.last_name}`,
        }).then(() => {
            CommonService._chartNotes.TransferSoapNoteAPICall(medicalInterventionId, {medical_record_id: item1._id})
                .then((response: any) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    closeTransferSoapNoteDrawer();
                }).catch((error: any) => {
                CommonService._alert.showToast(error.error, "error");
            })
        });
    }, []);

    return (
        <div className={'transfer-soap-note-component'}>
            <div>
                {currentStep === "selectType" && <>
                    <PageHeaderComponent title={'Transfer SOAP to'}/>
                    <SearchComponent label={'Search for Clients'}
                                     value={clientListSearch}
                                     placeholder={'Search for Clients'}
                                     onSearchChange={(value) => {
                                         setClientListSearch(value);
                                         getClientList();
                                     }}
                    />
                    {
                        clientListSearch &&
                        <>
                            <div className={'client-list-heading'}>Client List</div>
                            <TableComponent data={clientList} columns={clientListColumns} loading={isClientListLoading}
                                            showHeader={false}/>
                        </>}

                    {
                        <ButtonComponent fullWidth={true}
                                         onClick={() => onSoapNoteSelect(currentStep, clientSelectedName._id)}
                                         disabled={!clientNameSelectedValue}>
                            Next
                        </ButtonComponent>
                    }
                </>
                }
                {
                    medicalInterventionId && currentStep === "medicalRecordList" && <>
                        {
                            isMedicalRecordListLoading && <div><LoaderComponent/></div>
                        }
                        {
                            isMedicalRecordListLoadingFailed &&
                            <StatusCardComponent title={'Failed to load Medical Record list'}/>

                        }
                        <PageHeaderComponent title={'Transfer SOAP to'}/>
                        <div>
                            <CardComponent color={'primary'}>
                                <div className={'card-content-wrapper'}>
                                    <div className={'client-image-wrapper'}>
                                        <AvatarComponent
                                            title={clientSelectedName?.first_name + " " + clientSelectedName?.last_name}/>
                                    </div>
                                    <div>
                                        <div
                                            className={'client-name'}>{clientSelectedName?.first_name} {clientSelectedName?.last_name}</div>
                                    </div>
                                </div>
                            </CardComponent>
                            <div className={'card-table'}>
                                <TableComponent data={medicalRecordList} columns={medicalRecordColumns}/>

                                {
                                    <ButtonComponent fullWidth={true} className={'transfer-button'}
                                                     onClick={() => handleTransferSoapNote(clientSelectedMedicalRecordName, clientSelectedName, medicalInterventionId)}
                                                     disabled={!clientSelectedMedicalRecordValue}>
                                        Transfer
                                    </ButtonComponent>
                                }
                            </div>

                        </div>
                    </>

                }
            </div>

        </div>
    );

};

export default TransferSoapNoteComponent;