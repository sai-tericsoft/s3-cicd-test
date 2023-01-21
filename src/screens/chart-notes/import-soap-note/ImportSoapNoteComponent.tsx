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
    handleSoapNoteDrawer:(id:string)=> void;

}


const ImportSoapNoteComponent = (props: ImportSoapNoteComponentProps) => {

    const {medicalRecordDetails,handleSoapNoteDrawer} = props;
    const {medicalRecordId, medicalInterventionId} = useParams();
    const [interventionList, setInterventionList] = useState([]);
    const [isInterventionListLoading, setIsInterventionListLoading] = useState(false);
    const [isInterventionListLoadingFailed, setIsInterventionListLoadingFailed] = useState(false);
    const [isInterventionListLoaded, setIsInterventionListLoaded] = useState(false);
    const [selectedSoapNote, setSelectedSoapNote] = useState<any>('');
    const [isSoapNoteSelected, setIsSoapNoteSelected] = useState(false);

    const medicalInterventionListColumns: ITableColumn[] = [
        {
            title: '',
            key: 'select',
            dataIndex: 'select',
            width: 50,
            render: (_: any, item: any) => {

                return <RadioButtonComponent name={selectedSoapNote}
                                             value={item}
                                             checked={selectedSoapNote === item}
                                             onChange={(value: any) => {
                                                 setSelectedSoapNote(value);
                                                 console.log('item', item);
                                                 setIsSoapNoteSelected(true)
                                             }}/>

            }
        },
        {
            title: 'Date',
            key: 'date',
            dataIndex: 'created_at',
            render: (_: any, item: any) => {
                return <>{CommonService.getSystemFormatTimeStamp(item?.created_at)}</>
            }
        },
        {
            title: 'Provider',
            key: 'provider',
            dataIndex: 'first_name',
            render: (_: any, item: any) => {
                return <span>{item?.treated_by_details?.first_name} {item?.treated_by_details?.last_name}</span>
            }
        },
        {
            title: '',
            dataIndex: 'actions',
            key: 'actions',
            fixed: 'right',
            render: (_: any, item: any) => {
                return <LinkComponent route={CommonService._routeConfig.MedicalInterventionDetails(item?.medical_record_id, item?._id)}>
                    View Details</LinkComponent>
            }
        }
    ];

    useEffect(() => {
        if (medicalRecordId) {
            getMedicalInterventionList();
        }
    }, [medicalRecordId]);

    console.log('interventionList', interventionList);

    const getMedicalInterventionList = useCallback(() => {
        if (medicalRecordId) {
            setIsInterventionListLoading(true);
            setIsInterventionListLoadingFailed(false);
            setIsInterventionListLoaded(false);
            CommonService._chartNotes.MedicalRecordInterventionListAPICall(medicalRecordId, {current_intervention_id: medicalInterventionId, status: "completed"})
                .then((response: any) => {
                    setIsInterventionListLoading(false);
                    setIsInterventionListLoadingFailed(false);
                    setIsInterventionListLoaded(true);
                    setInterventionList(response.data);
                    console.log('response', response.data);
                }).catch((error: any) => {
                setIsInterventionListLoading(false);
                setIsInterventionListLoadingFailed(true);
                setIsInterventionListLoaded(false);
            })
        }
    }, [medicalRecordId]);

    const handleImportSoapNote = useCallback((selectedIntervention: any) => {
        console.log('selectedIntervention', selectedIntervention);
        CommonService.onConfirm({
            image: ImageConfig.DeleteAttachmentConfirmationIcon,
            confirmationTitle: 'Import SOAP Note',
            confirmationSubTitle: 'Are you sure you want to import this SOAP Note?',
        }).then(() => {
            if (medicalInterventionId) {
                CommonService._chartNotes.ImportSoapNoteAPICall( medicalInterventionId, selectedIntervention._id, {})
                    .then((response: any) => {
                        CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                        console.log('response._id', response.data._id);
                        handleSoapNoteDrawer(response.data._id);
                    }).catch((error: any) => {
                    CommonService._alert.showToast(error[Misc.API_RESPONSE_MESSAGE_KEY], "error");
                })
            }
        })
    }, [])

    return (
        <div className={'import-soap-note-component'}>
            <PageHeaderComponent title={'Import SOAP Note'}/>
            <InputComponent value={CommonService.generateInterventionNameFromMedicalRecord(medicalRecordDetails)}
                            disabled={true} label={'Intervention Linked To'} fullWidth={true}/>
            <TableComponent data={interventionList} columns={medicalInterventionListColumns}
                            loading={isInterventionListLoading}/>
            <ButtonComponent fullWidth={true} className={'mrg-top-20'}
                             disabled={!isSoapNoteSelected}
                             onClick={() => handleImportSoapNote(selectedSoapNote)}>Import</ButtonComponent>
        </div>
    );

};

export default ImportSoapNoteComponent;