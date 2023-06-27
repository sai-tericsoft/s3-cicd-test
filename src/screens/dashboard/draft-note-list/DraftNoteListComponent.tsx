import "./DraftNoteListComponent.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";
import {APIConfig} from "../../../constants";
import {ITableColumn} from "../../../shared/models/table.model";
import React, {useMemo} from "react";
import {CommonService} from "../../../shared/services";
import ToolTipComponent from "../../../shared/components/tool-tip/ToolTipComponent";
import LinkComponent from "../../../shared/components/link/LinkComponent";

interface DraftNoteListComponentProps {

}


const DraftNoteListComponent = (props: DraftNoteListComponentProps) => {
    const draftNoteListColumn: ITableColumn[] = useMemo<any>(() => [
        {
            title: 'Client Name',
            key: 'first_name',
            dataIndex: 'first_name',
            width:116,
            render: (item: any) => {
                return <>{CommonService.extractName(item?.client_details)}</>
            }
        },
        {
            title: 'Case Name',
            key: 'case_details',
            dataIndex: 'case_details',
            width:280,
            render: (item: any) => {
                return <>   {CommonService.generateUseCaseFromCaseDetails(item?.case_details)?.length > 50 ?
                    <ToolTipComponent
                        tooltip={item?.case_details && CommonService.generateUseCaseFromCaseDetails2(item?.case_details)}
                        position={"top"}
                        showArrow={true}
                    >
                        <div className={"ellipses-for-table-data"}>
                            {item?.case_details && CommonService.generateUseCaseFromCaseDetails2(item?.case_details)}
                        </div>
                    </ToolTipComponent> :
                    <>
                        {item?.case_details && CommonService.generateUseCaseFromCaseDetails2(item?.case_details)}
                    </>
                }</>
            }
        },
        {
            title:'Date of Intervention',
            key:'intervention_date',
            dataIndex: 'intervention_date',
            width:206,
            align:'center',
            render:(item:any)=>{
                return <>{CommonService.convertDateFormat2(item?.intervention_date) || "N/A"}</>
            }
        },
        {
           title:'Provider',
           key:'provider',
           dataIndex: 'provider',
            align: 'center',
            width: 180,
            render:(item:any)=>{
              return <div className={'provider-name'}>{item?.provider_details?.first_name || 'N/A'} {item?.provider_details?.last_name}</div>
            }
        },
        {
            key:'action',
            fixed:'right',
            width: 130,
            render:(item:any)=>{
                return <><LinkComponent route={CommonService._routeConfig.UpdateMedicalIntervention(item?.medical_record_id, item?._id)}>
                    View Details
                </LinkComponent> </>
            }
        }

    ], [])
    return (
        <div className={'draft-note-list-component'}>
            <CardComponent >
                <div className={'draft-note-heading'}>
                    Draft Notes
                </div>
                <div className={'draft-note-list-wrapper'}>
                    <TableWrapperComponent columns={draftNoteListColumn}
                                           fixedHeader={true}
                                           autoHeight={true}
                                           isPaginated={true}
                                           noDataText={'Currently, there are no pending draft notes'}
                                           url={APIConfig.DASHBOARD_DRAFT_NOTE_LIST.URL}
                                           method={APIConfig.DASHBOARD_DRAFT_NOTE_LIST.METHOD}
                    />
                </div>
            </CardComponent>
        </div>
    );

};

export default DraftNoteListComponent;