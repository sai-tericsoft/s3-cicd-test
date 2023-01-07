import "./ClientMedicalAttachmentsComponent.scss";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";
import {APIConfig} from "../../../constants";
import {useParams} from "react-router-dom";
import {CommonService} from "../../../shared/services";
import {ITableColumn} from "../../../shared/models/table.model";

interface ClientMedicalAttachmentsComponentProps {

}

const ClientMedicalAttachmentsComponent = (props: ClientMedicalAttachmentsComponentProps) => {

    const {medicalRecordId} = useParams();

    const attachmentRecord: ITableColumn[] = [
        {
            title: 'Date of Attachment',
            key: 'date_of_attachment',
            dataIndex: 'date_of_attachment',
            fixed: 'left',
            width: 173,
            render: (_: any, item: any) => {
                return <>{CommonService.transformTimeStamp(item?.updated_at)}</>
            }
        },
        {
            title: 'File',
            key: 'file',
            dataIndex: 'file',
            width: 97,
            render: (_: any, item: any) => {
                return <>{item?.note_type}</>
            }
        },
        {
            title: 'Last Updated',
            key: 'last_updated',
            dataIndex: 'last_updated',
            width: 178,
            render: (_: any, item: any) => {
                return <>{CommonService.transformTimeStamp(item?.updated_at)}</>
            }
        },
        {
            title: 'Posted By',
            key: 'posted_by',
            dataIndex: 'posted_by',
            width: 151,
            render: (_: any, item: any) => {
                return <>{item?.posted_by?.first_name} {item?.posted_by?.last_name}</>
            }
        },
        {
            title: '',
            key: 'actions',
            width: 99,
            fixed: 'right',
            render: () => {
                return <LinkComponent route={''}>View Details</LinkComponent>
            }
        }
    ];


    return (
        <div className={'client-medical-attachments-component'}>
            <div className={'client-medical-attachments-header'}>
                Attachment
            </div>
            <TableWrapperComponent url={APIConfig.CLIENT_MEDICAL_ATTACHMENT.URL(medicalRecordId)}
                                   method={APIConfig.CLIENT_MEDICAL_ATTACHMENT.METHOD}
                                   isPaginated={false}
                                   columns={attachmentRecord}/>
        </div>
    );

};

export default ClientMedicalAttachmentsComponent;