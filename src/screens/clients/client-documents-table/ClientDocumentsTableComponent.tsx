import "./ClientDocumentsTableComponent.scss";
import {IClientDocumentsFilterState} from "../../../shared/models/client.model";
import {ITableColumn} from "../../../shared/models/table.model";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";
import {APIConfig, ImageConfig} from "../../../constants";
import React, {useCallback, useEffect, useState} from "react";
import {CommonService} from "../../../shared/services";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import ToolTipComponent from "../../../shared/components/tool-tip/ToolTipComponent";
import {useLocation} from "react-router-dom";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import commonService from "../../../shared/services/common.service";

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

    const removeAccess = useCallback((item: any) => {
        const payload = {
            is_shared: false
        }
        CommonService._chartNotes.MedicalRecordDocumentEditAPICall(item?._id, payload)
            .then((response: any) => {
                CommonService._communications.TableWrapperRefreshSubject.next({
                    moduleName: moduleName
                });
                commonService._alert.showToast("Access removed successfully", "success");
            })
            .catch((error: any) => {
                CommonService._alert.showToast(error.error || "Error removing access", "error");
            });

    }, [moduleName])

    const removeConcussionAccess = useCallback((item: any) => {
        const payload = {
            is_shared: false
        }
        CommonService._chartNotes.ConcussionFileEditAPICall(item?._id, payload)
            .then((response: any) => {
                commonService._alert.showToast("Access removed successfully", "success");
                CommonService._communications.TableWrapperRefreshSubject.next({
                    moduleName: moduleName
                });
            })
            .catch((error: any) => {
                CommonService._alert.showToast(error.error || "Error removing access", "error");
            });

    }, [moduleName])

    const removeDryNeedlingAccess = useCallback((item: any) => {
        const payload = {
            is_shared: false
        }
        CommonService._chartNotes.DryNeedlingFileEditAPICall(item?._id, payload)
            .then((response: any) => {
                commonService._alert.showToast("Access removed successfully", "success");
                CommonService._communications.TableWrapperRefreshSubject.next({
                    moduleName: moduleName
                });
            })
            .catch((error: any) => {
                CommonService._alert.showToast(error.error || "Error removing access", "error");
            });

    }, [moduleName])

    const handleRemoveAccess = useCallback((item: any) => {
        commonService.openConfirmationDialog({
            confirmationTitle: "REMOVE SHARED DOCUMENT",
            confirmationSubTitle: "Are you sure you want to remove the shared document from the client?",
            image: `${ImageConfig.confirmImage}`,
            yes: {
                text: "Yes",
                color: "primary"
            },
            no: {
                text: "No",
                color: "primary"
            }
        }).then((res: any) => {
            switch (item?.note_type_category) {
                case "Dry Needling":
                    removeDryNeedlingAccess(item);
                    break;
                case "Concussion":
                    removeConcussionAccess(item);
                    break;
                default:
                    removeAccess(item);
                    break;
            }
        })
    }, [removeAccess,removeConcussionAccess,removeDryNeedlingAccess])

    const ClientDocumentListTableColumns: ITableColumn[] = [
        {
            title: "Case Name",
            key: "case_name",
            dataIndex: "case_name",
            width: 300,
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
                                <div>
                                    {item?.case_details && CommonService.generateUseCaseFromCaseDetails(item?.case_details).substring(0, 30) + '...'}
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
            // sortable: true,
            width: 175,
            render: (item: any) => {
                return <>
                    {/*{item?.note_type?.length > 20 ?*/}
                    {/*    <ToolTipComponent*/}
                    {/*        tooltip={item?.note_type && item?.note_type}*/}
                    {/*        position={"top"}*/}
                    {/*        showArrow={true}>*/}
                    {/*        <div>{item?.note_type?.substring(0, 20) + '...'}</div>*/}
                    {/*    </ToolTipComponent> : item?.note_type}*/}
                    {item?.note_type}
                </>
            }
        },

        {
            title: "Date of Attachment",
            key: "date_of_attachment_date",
            dataIndex: "dateOfAttachment",
            width: 180,
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
                                    {CommonService.capitalizeFirstLetter(item?.posted_by?.first_name)} {CommonService.capitalizeFirstLetter(item?.posted_by?.last_name)}
                                </div>
                            </ToolTipComponent> :
                            <>
                                {CommonService.capitalizeFirstLetter(item?.posted_by?.first_name)} {CommonService.capitalizeFirstLetter(item?.posted_by?.last_name)}
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
                    route = CommonService._routeConfig.MedicalRecordProgressReportViewDetails(item.medical_record_id, item?._id) + '?referrer=' + location.pathname + '&module_name=client_module';
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

    const ClientSharedDocumentListTableColumns: ITableColumn[] = [
        {
            title: "Case Name",
            key: "case_name",
            dataIndex: "case_name",
            width: 400,
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
                                <div>
                                    {item?.case_details && CommonService.generateUseCaseFromCaseDetails(item?.case_details).substring(0, 50) + '...'}
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
            // sortable: true,
            width: 150,
            render: (item: any) => {
                return <>
                    {item?.note_type?.length > 20 ?
                        <ToolTipComponent
                            tooltip={item?.note_type && item?.note_type}
                            position={"top"}
                            showArrow={true}>
                            <div>{item?.note_type?.substring(0, 20) + '...'}</div>
                        </ToolTipComponent> : item?.note_type}
                </>
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
            width: 130,
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
                                    {CommonService.capitalizeFirstLetter(item?.posted_by?.first_name)} {CommonService.capitalizeFirstLetter(item?.posted_by?.last_name)}
                                </div>
                            </ToolTipComponent> :
                            <>
                                {CommonService.capitalizeFirstLetter(item?.posted_by?.first_name)} {CommonService.capitalizeFirstLetter(item?.posted_by?.last_name)}
                            </>
                    }
                </>
            }
        },
        {
            title: "",
            dataIndex: "remove",
            key: "remove",
            width: 150,
            fixed: "right",
            align: "center",
            render: (item: any) => {
                return (
                    <ButtonComponent
                        prefixIcon={<CancelOutlinedIcon/>}
                        size={'small'}
                        onClick={() => {
                            handleRemoveAccess(item);
                        }
                        }
                        color={'error'}
                        variant={'outlined'}
                    >
                        Remove Access
                    </ButtonComponent>
                )
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
                    route = CommonService._routeConfig.MedicalRecordProgressReportViewDetails(item.medical_record_id, item?._id) + '?referrer=' + location.pathname + '&module_name=client_module';
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
                <div className={'client-documents-list'}>
                    <TableWrapperComponent
                        url={APIConfig.GET_CLIENT_DOCUMENTS.URL(clientId)}
                        method={APIConfig.GET_CLIENT_DOCUMENTS.METHOD}
                        columns={clientDocumentListFilterState?.is_shared ? ClientSharedDocumentListTableColumns : ClientDocumentListTableColumns}
                        extraPayload={clientDocumentFilters}
                        moduleName={moduleName}
                        noDataText={'No documents have been shared yet'}
                        noDataImage={<ImageConfig.NoDataDocumentsIcon/>}
                    />
                </div>
            }
        </div>
    );

};

export default ClientDocumentsTableComponent;
