import "./ClientDocumentsTableComponent.scss";
import {IClientBasicDetails, IClientDocumentsFilterState} from "../../../shared/models/client.model";
import {ITableColumn} from "../../../shared/models/table.model";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";
import {APIConfig} from "../../../constants";
import React, {useEffect, useState} from "react";
import {CommonService} from "../../../shared/services";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import ToolTipComponent from "../../../shared/components/tool-tip/ToolTipComponent";

interface ClientDocumentsTableComponentProps {
    clientId: string | undefined;
    clientDocumentListFilterState: IClientDocumentsFilterState
    moduleName: string;
}

const ClientDocumentsTableComponent = (props: ClientDocumentsTableComponentProps) => {
    const {clientDocumentListFilterState, moduleName, clientId} = props;
    const [clientDocumentFilters, setClientDocumentFilters] = useState<any>();

    // useEffect(() => {
    //     if (clientDocumentListFilterState) {
    //         const prePayload: any = {...clientDocumentListFilterState};
    //         if (clientDocumentListFilterState.posted_by) {
    //             prePayload.posted_by = clientDocumentListFilterState.posted_by._id;
    //         }
    //         delete prePayload.date_range;
    //         setClientDocumentFilters(prePayload);
    //     }
    // }, [clientDocumentListFilterState]);

    const ClientDocumentListTableColumns: ITableColumn[] = [
        {
            title: "Case Name",
            key: "case_name",
            dataIndex: "case_name",
            width: 250,
            align: "left",
            fixed: "left",
            render: (item: any) => {
                if (item?._id) {
                    return <>
                        {CommonService.generateUseCaseFromCaseDetails(item?.case_details).length > 30 ?
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
            width: 200,
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
                        (item?.posted_by.first_name + ' ' + item?.posted_by?.last_name).length > 20 ?
                            <ToolTipComponent
                                tooltip={(item?.posted_by.first_name + ' ' + item?.posted_by?.last_name)}
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
                if (item?._id) {
                    return <LinkComponent
                        route={CommonService._routeConfig.MedicalRecordDocumentViewDetails(item.medical_record_id, item?._id, 'client')}>
                        View Details
                    </LinkComponent>
                }
            }
        }
    ];

    return (
        <div className={'client-documents-list-table-component'}>
            <TableWrapperComponent
                url={APIConfig.GET_CLIENT_DOCUMENTS.URL(clientId)}
                method={APIConfig.GET_CLIENT_DOCUMENTS.METHOD}
                columns={ClientDocumentListTableColumns}
                extraPayload={clientDocumentFilters}
                moduleName={moduleName}
            />
        </div>
    );

};

export default ClientDocumentsTableComponent;