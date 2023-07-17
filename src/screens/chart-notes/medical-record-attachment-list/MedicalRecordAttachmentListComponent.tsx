import "./MedicalRecordAttachmentListComponent.scss";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";
import {APIConfig} from "../../../constants";
import {useParams} from "react-router-dom";
import {CommonService} from "../../../shared/services";
import {ITableColumn} from "../../../shared/models/table.model";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {useCallback, useState} from "react";

interface ClientMedicalAttachmentsComponentProps {
    referrer?: any;
    refreshToken?: any;
    selectedTab?: any;
}

const MedicalRecordAttachmentListComponent = (props: ClientMedicalAttachmentsComponentProps) => {
    const {referrer, refreshToken, selectedTab} = props;
    const {medicalRecordId} = useParams();
    const {refreshTokenForMedicalRecordAttachments} = useSelector((state: IRootReducerState) => state.chartNotes)
    const [medicalAttachmentListFilterState, setMedicalAttachmentListFilterState] = useState<any>({
        sort: {}
    });
    const attachmentRecord: ITableColumn[] = [
        {
            title: 'Date of Attachment',
            key: 'created_at',
            dataIndex: 'date_of_attachment',
            width: 150,
            sortable: true,
            render: (item: any) => {
                let route = '';
                // if (item.note_type_category.toLowerCase() === 'surgery record') {
                //     route = CommonService._routeConfig.MedicalRecordSurgeryRecordDetails(item.medical_record_id, item._id) + '?referrer=' + referrer;
                // } else
                if (item.note_type_category.toLowerCase() === 'dry needling') {
                    route = CommonService._routeConfig.MedicalInterventionDryNeedlingFileViewDetails(item.medical_record_id, item._id) + '?referrer=' + referrer + '&activeTab=' + selectedTab;
                } else if (item.note_type_category.toLowerCase() === 'concussion') {
                    route = CommonService._routeConfig.MedicalInterventionConcussionFileViewDetails(item.medical_record_id, item._id) + '?referrer=' + referrer + '&activeTab=' + selectedTab;
                } else if (item.note_type_category.toLowerCase() === 'document') {
                    route = CommonService._routeConfig.MedicalRecordDocumentViewDetails(item.medical_record_id, item._id) + '?referrer=' + referrer + '&activeTab=' + selectedTab;
                } else if (item.note_type_category.toLowerCase() === 'progress report') {
                    route = CommonService._routeConfig.MedicalRecordProgressReportViewDetails(item.medical_record_id, item?._id) + '?referrer=' + referrer + '&activeTab=' + selectedTab;
                } else {
                }
                return <><LinkComponent
                    route={route}>{CommonService.getSystemFormatTimeStamp(item?.created_at)}</LinkComponent></>
            }
        },
        {
            title: 'File Type',
            key: 'note_type',
            dataIndex: 'note_type',
            width: 180,
            sortable: true,
            render: (item: any) => {
                return <>{item?.note_type}</>
            }
        },
        {
            title: 'Last Updated',
            key: 'updated_at',
            dataIndex: 'updated_at',
            width: 180,
            align: 'center',
            sortable: true,
            render: (item: any) => {

                return <>{CommonService.transformTimeStamp(item?.updated_at)}</>

            }
        },
        {
            title: 'Posted By',
            key: 'posted_by',
            dataIndex: 'posted_by',
            width: 160,
            sortable: true,
            render: (item: any) => {
                return <>{CommonService.capitalizeFirstLetter(item?.posted_by?.first_name)} {CommonService.capitalizeFirstLetter(item?.posted_by?.last_name)}</>
            }
        },
        {
            title: '',
            key: 'actions',
            width: 120,
            fixed: 'right',
            render: (item: any) => {
                let route = '';

                if (item.note_type_category.toLowerCase() === 'dry needling') {
                    route = CommonService._routeConfig.MedicalInterventionDryNeedlingFileViewDetails(item.medical_record_id, item._id) + '?referrer=' + referrer + '&activeTab=' + selectedTab;
                } else if (item.note_type_category.toLowerCase() === 'concussion') {
                    route = CommonService._routeConfig.MedicalInterventionConcussionFileViewDetails(item.medical_record_id, item._id) + '?referrer=' + referrer + '&activeTab=' + selectedTab;
                } else if (item.note_type_category.toLowerCase() === 'document') {
                    route = CommonService._routeConfig.MedicalRecordDocumentViewDetails(item.medical_record_id, item._id) + '?referrer=' + referrer + '&activeTab=' + selectedTab;
                } else if (item.note_type_category.toLowerCase() === 'progress report') {
                    route = CommonService._routeConfig.MedicalRecordProgressReportViewDetails(item.medical_record_id, item?._id) + '?referrer=' + referrer + '&activeTab=' + selectedTab;
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
    const handleClientMedicalListSort = useCallback((key: string, order: string) => {
        setMedicalAttachmentListFilterState((oldState: any) => {
            const newState = {...oldState};
            newState["sort"] = {
                key,
                order
            }
            return newState;
        });
    }, []);

    return (
        <div className={'client-medical-attachments-component'}>
            <TableWrapperComponent refreshToken={refreshTokenForMedicalRecordAttachments && refreshToken}
                                   url={APIConfig.CLIENT_MEDICAL_ATTACHMENT.URL(medicalRecordId)}
                                   method={APIConfig.CLIENT_MEDICAL_ATTACHMENT.METHOD}
                                   onSort={handleClientMedicalListSort}
                                   noDataText={'Currently, there is no attachment added to this medical record.'}
                                   extraPayload={medicalAttachmentListFilterState}
                                   columns={attachmentRecord}/>
        </div>
    );

};

export default MedicalRecordAttachmentListComponent;
