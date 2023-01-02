import "./ClientMedicalAttachmentsComponent.scss";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import TableComponent from "../../../shared/components/table/TableComponent";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";
import {APIConfig} from "../../../constants";

interface ClientMedicalAttachmentsComponentProps {

}

const ClientMedicalAttachmentsComponent = (props: ClientMedicalAttachmentsComponentProps) => {

    const attachmentRecord: any = [
        {
            title: 'Date of Attachment',
            key: 'date_of_attachment',
            dataIndex: 'date_of_attachment',
            fixed: 'left'

        },
        {
            title: 'File',
            key: 'file',
            dataIndex: 'file',
        },
        {
            title: 'Last Updated',
            key: 'last_updated',
            dataIndex: 'last_updated',
            width: '25%'
        },
        {
            title: 'Posted By',
            key: 'posted_by',
            dataIndex: 'posted_by',
        },
        {
            title: '',
            key: 'actions',
            render: () => {
                return <LinkComponent route={''}>View Details</LinkComponent>
            }
        }
    ];

    const attachmentData: any = [
        {
            date_of_attachment: '08-Nov-2022',
            file: 'Surgery Record',
            last_updated: '08-Nov-2022, 10:45 AM PST',
            posted_by: 'Terill Lobo',

        },
        {
            date_of_attachment: '08-Nov-2022',
            file: 'Surgery Record',
            last_updated: '08-Nov-2022, 10:45 AM PST',
            posted_by: 'Terill Lobo',

        },
        {
            date_of_attachment: '08-Nov-2022',
            file: 'Surgery Record',
            last_updated: '08-Nov-2022, 10:45 AM PST',
            posted_by: 'Terill Lobo',

        }
    ];

    return (
        <div className={'client-medical-attachments-component'}>
            <div className={'client-medical-attachments-header'}>
                Attachment
            </div>
            {/*<TableWrapperComponent url={APIConfig.CLIENT_MEDICAL_ATTACHMENT.URL}*/}
            {/*                       method={APIConfig.CLIENT_MEDICAL_ATTACHMENT.METHOD} columns={attachmentRecord}/>*/}
            <TableComponent data={attachmentData} columns={attachmentRecord}/>
        </div>
    );

};

export default ClientMedicalAttachmentsComponent;