import "./ImportSoapNoteComponent.scss";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import {useCallback, useEffect, useState} from "react";
import {CommonService} from "../../../shared/services";
import {useParams} from "react-router-dom";
import TableComponent from "../../../shared/components/table/TableComponent";
import {ITableColumn} from "../../../shared/models/table.model";
import {RadioButtonComponent} from "../../../shared/components/form-controls/radio-button/RadioButtonComponent";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import InputComponent from "../../../shared/components/form-controls/input/InputComponent";
import {ImageConfig, Misc} from "../../../constants";

interface ImportSoapNoteComponentProps {
    medicalRecordDetails: any;
    handleSoapNoteImport: (medicalInterventionId: string) => void;
}

const ImportSoapNoteComponent = (props: ImportSoapNoteComponentProps) => {

    const {medicalRecordDetails, handleSoapNoteImport} = props;
    const {medicalRecordId, medicalInterventionId} = useParams();
    const [interventionList, setInterventionList] = useState([]);
    const [isInterventionListLoading, setIsInterventionListLoading] = useState(false);
    // const [isInterventionListLoadingFailed, setIsInterventionListLoadingFailed] = useState(false);
    // const [isInterventionListLoaded, setIsInterventionListLoaded] = useState(false);
    const [selectedSoapNote, setSelectedSoapNote] = useState<any>(undefined);
    const [isSoapNoteImportBeingImported, setIsSoapNoteImportBeingImported] = useState(false);

    const medicalInterventionListColumns: ITableColumn[] = [
        {
            title: '',
            key: 'select',
            dataIndex: 'select',
            width: 50,
            render: ( item: any) => {
                return <RadioButtonComponent name={"selected-medical-intervention"}
                                             value={item}
                                             checked={selectedSoapNote === item}
                                             onChange={(value: any) => {
                                                 setSelectedSoapNote(value);
                                             }}/>
            }
        },
        {
            title: 'Date',
            key: 'date',
            dataIndex: 'created_at',
            render: ( item: any) => {
                return <>
                    {CommonService.getSystemFormatTimeStamp(item?.created_at)}
                    {item?.is_flagged && <ImageConfig.FlagIcon/>}
                </>
            }
        },
        {
            title: 'Provider',
            key: 'provider',
            dataIndex: 'first_name',
            render: ( item: any) => {
                return <span>{item?.treated_by_details?.first_name} {item?.treated_by_details?.last_name}</span>
            }
        },
        {
            title: '',
            dataIndex: 'actions',
            key: 'actions',
            fixed: 'right',
            render: ( item: any) => {
                return <LinkComponent
                    route={CommonService._routeConfig.MedicalInterventionDetails(item?.medical_record_id, item?._id)}
                    behaviour={"redirect"}
                >
                    View Details
                </LinkComponent>
            }
        }
    ];


    const getMedicalInterventionList = useCallback(() => {
        if (medicalRecordId) {
            setIsInterventionListLoading(true);
            // setIsInterventionListLoadingFailed(false);
            // setIsInterventionListLoaded(false);
            CommonService._chartNotes.MedicalRecordInterventionListAPICall(medicalRecordId, {
                current_intervention_id: medicalInterventionId,
                status: "completed"
            })
                .then((response: any) => {
                    setIsInterventionListLoading(false);
                    // setIsInterventionListLoadingFailed(false);
                    // setIsInterventionListLoaded(true);
                    setInterventionList(response.data);
                }).catch((error: any) => {
                setIsInterventionListLoading(false);
                // setIsInterventionListLoadingFailed(true);
                // setIsInterventionListLoaded(false);
            })
        }
    }, [medicalInterventionId, medicalRecordId]);

    useEffect(() => {
        if (medicalRecordId) {
            getMedicalInterventionList();
        }
    }, [medicalRecordId, getMedicalInterventionList]);

    const handleImportSoapNote = useCallback((selectedIntervention: any) => {
        CommonService.onConfirm({
            image: ImageConfig.DeleteAttachmentConfirmationIcon,
            confirmationTitle: 'Import SOAP Note',
            confirmationSubTitle: 'Are you sure you want to import this SOAP Note?',
        }).then(() => {
            if (medicalInterventionId) {
                setIsSoapNoteImportBeingImported(true);
                CommonService._chartNotes.ImportSoapNoteAPICall(medicalInterventionId, selectedIntervention._id, {})
                    .then((response: any) => {
                        CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                        handleSoapNoteImport(response.data._id);
                        setIsSoapNoteImportBeingImported(false);
                    }).catch((error: any) => {
                    CommonService._alert.showToast(error?.error, "error");
                    setIsSoapNoteImportBeingImported(false);
                })
            }
        })
    }, [handleSoapNoteImport, medicalInterventionId]);

    return (
        <div className={'import-soap-note-component'}>
            <PageHeaderComponent title={'Import SOAP Note'}/>
            <InputComponent value={CommonService.generateInterventionNameFromMedicalRecord(medicalRecordDetails)}
                            disabled={true} label={'Intervention Linked To'} fullWidth={true}/>
            <div className={'import-soap-note-table-wrapper'}>
                <TableComponent data={interventionList} columns={medicalInterventionListColumns}
                                loading={isInterventionListLoading}/>
            </div>
            <ButtonComponent fullWidth={true} className={'mrg-top-20'}
                             disabled={!selectedSoapNote || isSoapNoteImportBeingImported}
                             isLoading={isSoapNoteImportBeingImported}
                             onClick={() => handleImportSoapNote(selectedSoapNote)}>Import</ButtonComponent>
        </div>
    );

};

export default ImportSoapNoteComponent;
