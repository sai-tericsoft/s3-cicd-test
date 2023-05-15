import "./ClientDocumentsTableComponent.scss";
import {IClientDocumentsFilterState} from "../../../shared/models/client.model";
import {ITableColumn} from "../../../shared/models/table.model";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";
import {APIConfig, ImageConfig} from "../../../constants";
import React, {useEffect, useState} from "react";
import {CommonService} from "../../../shared/services";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import ToolTipComponent from "../../../shared/components/tool-tip/ToolTipComponent";
import {useLocation} from "react-router-dom";

interface ClientDocumentsTableComponentProps {
    clientId: string | undefined;
    clientDocumentListFilterState: IClientDocumentsFilterState
    moduleName: string;
}

const ClientDocumentsTableComponent = (props: ClientDocumentsTableComponentProps) => {
    const {clientDocumentListFilterState, moduleName, clientId} = props;
    const [clientDocumentFilters, setClientDocumentFilters] = useState<any>();
    const location = useLocation();

    useEffect(() => {
        if (clientDocumentListFilterState) {
            const prePayload: any = {...clientDocumentListFilterState};
            if (clientDocumentListFilterState.posted_by) {
                prePayload.posted_by = clientDocumentListFilterState.posted_by._id;
            } else {
                delete prePayload.posted_by;
            }
            delete prePayload.date_range;
            setClientDocumentFilters(prePayload);
        }
    }, [clientDocumentListFilterState]);

    const ClientDocumentListTableColumns: ITableColumn[] = [
        {
            title: "Case Name",
            key: "case_name",
            dataIndex: "case_name",
            width: 350,
            align: "left",
            fixed: "left",
            render: (item: any) => {
                if (item?._id) {
                    return <>
                        {CommonService.generateUseCaseFromCaseDetails(item?.case_details).length > 50 ?
                            <ToolTipComponent
                                tooltip={item?.case_details && CommonService.generateUseCaseFromCaseDetails(item?.case_details)}
                                position={"top"}
                                showArrow={true}
                            >
                                <div className={"ellipses-for-table-data"}>
                                    {item?.case_details && CommonService.generateUseCaseFromCaseDetails(item?.case_details)}
                                </div>
                            </ToolTipComponent> :
                            <>
                                {item?.case_details && CommonService.generateUseCaseFromCaseDetails(item?.case_details)}
                            </>
                        }
                    </>
                }
            }
        },
        {
            title: "File Name",
            key: "file_name",
            dataIndex: "file_name",
            sortable: true,
            width: 150,
            render: (item: any) => {
                return <span>{item?.note_type}</span>
            }
        },

        {
            title: "Date of Attachment",
            key: "date_of_attachment_date",
            dataIndex: "dateOfAttachment",
            width: 200,
            align: "center",
            render: (item: any) => {
                return <span>
                    {item?.created_at ? CommonService.getSystemFormatTimeStamp(item?.created_at) : "-"}
                </span>
            }
        },

        {
            title: 'Posted by',
            key: 'posted_by',
            dataIndex: 'first_name',
            width: 150,
            align: 'center',
            render: (item: any) => {
                return <>
                    {
                        (item?.posted_by?.first_name + ' ' + item?.posted_by?.last_name).length > 20 ?
                            <ToolTipComponent
                                tooltip={(item?.posted_by?.first_name + ' ' + item?.posted_by?.last_name)}
                                position={"top"}
                                showArrow={true}
                            >
                                <div className={"ellipses-for-table-data"}>
                                    {item?.posted_by?.first_name} {item?.posted_by?.last_name}
                                </div>
                            </ToolTipComponent> :
                            <>
                                {item?.posted_by?.first_name} {item?.posted_by?.last_name}
                            </>
                    }
                </>
            }
        },


        {
            title: "",
            dataIndex: "actions",
            key: "actions",
            width: 120,
            fixed: "right",
            align: "center",
            render: (item: any) => {
                let route = '';
                if (item.note_type_category.toLowerCase() === 'surgery record') {
                    route = CommonService._routeConfig.MedicalRecordSurgeryRecordDetails(item.medical_record_id, item._id) + '?referrer=' + location.pathname + '&module_name=client_module';
                } else if (item.note_type_category.toLowerCase() === 'dry needling') {
                    route = CommonService._routeConfig.MedicalInterventionDryNeedlingFileViewDetails(item.medical_record_id, item._id) + '?referrer=' + location.pathname + '&module_name=client_module';
                } else if (item.note_type_category.toLowerCase() === 'concussion') {
                    route = CommonService._routeConfig.MedicalInterventionConcussionFileViewDetails(item.medical_record_id, item._id) + '?referrer=' + location.pathname + '&module_name=client_module';
                } else if (item.note_type_category.toLowerCase() === 'document') {
                    route = CommonService._routeConfig.MedicalRecordDocumentViewDetails(item.medical_record_id, item?._id) + '?referrer=' + location.pathname + '&module_name=client_module';
                } else if (item.note_type_category.toLowerCase() === 'progress report') {
                    route = CommonService._routeConfig.MedicalRecordProgressReportViewDetails(item.medical_record_id, item?._id) + '&referrer=' + location.pathname + '&module_name=client_module';
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
        <div className={'client-documents-list-table-component'}>
            {clientDocumentFilters &&
            <TableWrapperComponent
                url={APIConfig.GET_CLIENT_DOCUMENTS.URL(clientId)}
                method={APIConfig.GET_CLIENT_DOCUMENTS.METHOD}
                columns={ClientDocumentListTableColumns}
                extraPayload={clientDocumentFilters}
                moduleName={moduleName}
                noDataText={'No Documents To Show'}
                noDataImage={<ImageConfig.NoDataDocumentsIcon/>}
            />
            }
        </div>
    );

};

export default ClientDocumentsTableComponent;
