import "./MedicalRecordAttachmentListComponent.scss";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";
import {APIConfig} from "../../../constants";
import {useParams} from "react-router-dom";
import {CommonService} from "../../../shared/services";
import {ITableColumn} from "../../../shared/models/table.model";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";

interface ClientMedicalAttachmentsComponentProps {

}

const MedicalRecordAttachmentListComponent = (props: ClientMedicalAttachmentsComponentProps) => {

    const {medicalRecordId} = useParams();
    const {refreshTokenForMedicalRecordAttachments} = useSelector((state: IRootReducerState) => state.chartNotes)

    const attachmentRecord: ITableColumn[] = [
        {
            title: 'Date of Attachment',
            key: 'date_of_attachment',
            dataIndex: 'date_of_attachment',
            fixed: 'left',
            width: 150,
            render: ( item: any) => {
                return <>{CommonService.getSystemFormatTimeStamp(item?.updated_at)}</>
            }
        },
        {
            title: 'File',
            key: 'file',
            dataIndex: 'file',
            width: 230,
            render: ( item: any) => {
                return <>{item?.note_type}</>
            }
        },
        {
            title: 'Last Updated',
            key: 'last_updated',
            dataIndex: 'last_updated',
            width: 200,
            render: ( item: any) => {
                return <>{CommonService.transformTimeStamp(item?.updated_at)}</>
            }
        },
        {
            title: 'Posted By',
            key: 'posted_by',
            dataIndex: 'posted_by',
            width: 200,
            render: ( item: any) => {
                return <>{item?.posted_by?.first_name} {item?.posted_by?.last_name}</>
            }
        },
        {
            title: '',
            key: 'actions',
            width: 99,
            fixed: 'right',
            render: ( item: any) => {
                let route = '';
                if (item.note_type_category.toLowerCase() === 'surgery record') {
                    route = CommonService._routeConfig.MedicalRecordSurgeryRecordDetails(item.medical_record_id, item._id);
                } else if (item.note_type_category.toLowerCase() === 'dry needling') {
                    route = CommonService._routeConfig.MedicalInterventionDryNeedlingFileViewDetails(item.medical_record_id, item._id);
                } else if (item.note_type_category.toLowerCase() === 'concussion') {
                    route = CommonService._routeConfig.MedicalInterventionConcussionFileViewDetails(item.medical_record_id, item._id);
                } else if (item.note_type_category.toLowerCase() === 'document') {
                    route = CommonService._routeConfig.MedicalRecordDocumentViewDetails(item.medical_record_id, item._id);
                } else {
                }
                return <LinkComponent route={route}>
                    {
                        route ? "View Details" : "Coming soon"
                    }
                </LinkComponent>
            }
        }
    ];

    return (
        <div className={'client-medical-attachments-component'}>
            <div className={'client-medical-attachments-header'}>
                Attachments
            </div>
            <TableWrapperComponent refreshToken={refreshTokenForMedicalRecordAttachments}
                                   url={APIConfig.CLIENT_MEDICAL_ATTACHMENT.URL(medicalRecordId)}
                                   method={APIConfig.CLIENT_MEDICAL_ATTACHMENT.METHOD}
                                   isPaginated={false}
                                   columns={attachmentRecord}/>
        </div>
    );

};

export default MedicalRecordAttachmentListComponent;
