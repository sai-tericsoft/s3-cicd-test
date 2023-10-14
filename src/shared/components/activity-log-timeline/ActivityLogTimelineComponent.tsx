import "./ActivityLogTimelineComponent.scss";

import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import React, {useCallback, useMemo} from 'react';
import {timelineItemClasses} from "@mui/lab/TimelineItem";
import ChipComponent from "../chip/ChipComponent";
import moment from "moment";
import commonService from "../../services/common.service";
import AccordionComponent from "../accordion/AccordionComponent";
import DataLabelValueComponent from "../data-label-value/DataLabelValueComponent";
import {ITableColumn} from "../../models/table.model";
import {CommonService} from "../../services";
import TableComponent from "../table/TableComponent";

interface ActivityLogTimelineComponentProps {
    logsData?: any;
}

const ICDTableColumns: any = [
    {
        title: 'ICD Code',
        dataIndex: 'icd_code',
        key: 'icd_code',
        width: 200,
        fixed: 'left'
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',

    }
]

const listOfObjectsFields: any = [
    "Contact Information",
    "Secondary Contact Information",
    "Email",
    ]

const ActivityLogTimelineComponent = (props: ActivityLogTimelineComponentProps) => {
    const {logsData} = props;

    const getLogsStringWithArrows = (log: any) => {
        let str = log?.module_name && (log?.module_name + '$');
        str += log?.sub_module && (log?.sub_module + '$');
        str += log?.feature && (log?.feature + '$');
        str += log?.section && (log?.section + '$');
        str += log?.sub_section && (log?.sub_section + '$');
        str += log?.field_name && (log?.field_name + '$');
        str += log?.value ? (log?.value) : '';
        str.charAt(str.length - 1) === '$' && (str = str.slice(0, -1));
        str = str.replace(/\$+/g, ' > ');
        return str;
    }

    const SpecialTestsColumns: ITableColumn[] = useMemo<ITableColumn[]>(() => [
        {
            title: 'Test Name',
            dataIndex: 'name',
            key: 'test_name',
            fixed: 'left',
            width: 150,
        },
        {
            title: 'Left Side',
            dataIndex: 'result',
            align: 'center',
            fixed: 'left',
            key: 'left_result',
            width: 150,
            render: (item: any) => {
                return <div className={'result'}>
                    {item?.config?.Left?.result || "-"}
                </div>
            }
        },
        {
            title: 'Right Side',
            dataIndex: 'result',
            align: 'center',
            fixed: 'left',
            key: 'right_result',
            width: 150,
            render: (item: any) => {
                return <div className={'result'}>
                    {item?.config?.Right?.result || "-"}
                </div>
            }
        },
        {
            title: 'Central Side',
            dataIndex: 'result',
            align: 'center',
            fixed: 'left',
            key: 'central_result',
            width: 150,
            render: (item: any) => {
                return <div className={'result'}>
                    {item?.config?.Central?.result || "-"}
                </div>
            }
        },
        {
            title: 'Comments',
            dataIndex: 'comments',
            key: 'comments',
            width: 147,
            // align: 'center',
            // fixed: 'right',
            render: (item: any) => {
                return <div className={'comments'}>
                    {item?.config?.comments || "N/A"}
                </div>
            }
        }
    ], []);

    const getMedicalInterventionROMConfigColumns = useCallback((body_part: any): ITableColumn[] => {
        const ROMColumns: any[] = [
            {
                title: '',
                fixed: 'left',
                width: 180,
                children: [
                    {
                        title: 'Movement',
                        key: 'movement',
                        width: 180,
                        // fixed: 'left',
                        render: (record: any) => {
                            console.log('record', record);
                            return <div className="movement-name">
                                {record?.movement_name}
                            </div>
                        }
                    }
                ]
            }
        ];
        (body_part?.selected_sides || []).forEach((side: any) => {
            ROMColumns.push({
                title: side,
                className: side,
                // fixed: 'left',
                align: 'center',
                children: [
                    {
                        title: 'AROM',
                        dataIndex: 'arom',
                        key: side + 'arom',
                        align: 'center',
                        // fixed: 'left',
                        width: 37,
                        render: (item: any) => {
                            return <div className={'movement-name'}>{item?.config[side]?.arom || '-'}</div>
                        }
                    },
                    {
                        title: 'PROM',
                        dataIndex: 'prom',
                        key: side + 'prom',
                        align: 'center',
                        // fixed: 'left',
                        width: 37,
                        render: (item: any) => {
                            return <div className={'movement-name'}>{item?.config[side]?.prom || "-"}</div>
                        }
                    },
                    {
                        title: 'Strength',
                        dataIndex: 'strength',
                        key: side + 'strength',
                        align: 'center',
                        // fixed: 'left',
                        width: 41,
                        render: (item: any) => {
                            return <div className={'movement-name'}>{item?.config[side]?.strength || "-"}</div>
                        }
                    }
                ]
            });
        });
        ROMColumns.push(
            {
                title: '',
                key: 'comments-header',
                fixed: 'right',
                width: 300,
                children: [
                    {
                        title: 'Comments',
                        dataIndex: 'comments',
                        key: 'comments',
                        width: 300,
                        render: (item: any) => {
                            return <div
                                className={'comment-text'}>{item?.config?.comments ? CommonService.capitalizeFirstLetter(item?.config?.comments) : "-"}</div>
                        }
                    }]
            }
        )
        return ROMColumns;
    }, []);
    const tConvert = (time: any) => {
        // Check correct time format and split into components
        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) { // If time format correct
            time = time.slice(1);  // Remove full string match value
            time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join(''); // return adjusted time or original string
    }

    const generateObjectsContent = useCallback((item: any) => {
        return Object.keys(item).map((key: any, index: number) => {
            return (
                <span key={index} className={'activity-log-key-value-wrapper'}>
                                                                <span className={'activity-log-key'}>{key} :</span>
                                                                <span
                                                                    className={'activity-log-value'}>{item[key]}</span>
                                                            </span>
            )
        })
    }, [])

    const generateAccordionContent = useCallback((logItem: any) => {
        let {
            updated_value,
            field_name,
            old_value
        } = logItem;
        field_name = field_name === "Surgeries" || field_name === "Medical History" ? "list of titles" : field_name;
        field_name = listOfObjectsFields.includes(field_name)? "List of objects" : field_name;
        switch (field_name) {
            case "Musculoskeletal History":
                return (
                    <div className={'musculoskeletal-activity-log'}>
                        <DataLabelValueComponent label={"From"}
                        >
                            {old_value && old_value?.length ? <>
                                <div>
                                    {
                                        old_value?.map((item: any, index: number) => {
                                            return (
                                                <div key={index}>
                                                    <div>{item?.title}</div>
                                                    <span>{item?.value ? "Yes ," : "No"} {
                                                        item?.value && <span>{item?.text}
                                                        </span>
                                                    }</span>

                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </> : 'N/A'}
                        </DataLabelValueComponent>
                        <DataLabelValueComponent label={"To"}
                        >
                            {updated_value && updated_value?.length ? <>
                                <div>
                                    {
                                        updated_value?.map((item: any, index: number) => {
                                            return (
                                                <div key={index}>
                                                    <div>{item?.title}</div>
                                                    <span>{item?.value ? "Yes ," : "No"} {
                                                        item?.value && <span>{item?.text}
                                                        </span>
                                                    }</span>

                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </> : 'N/A'}
                        </DataLabelValueComponent>
                    </div>
                )
            case "list of titles":
                return (
                    <div className={'medication-activity-log'}>
                        <DataLabelValueComponent label={"From"}
                        >
                            {old_value && old_value?.length > 0 ? <>
                                <div>
                                    {
                                        old_value?.map((item: any, index: number) => {
                                            return (
                                                <div key={index}>
                                                    {item?.title}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </> : 'N/A'}
                        </DataLabelValueComponent>
                        <DataLabelValueComponent label={"To"}
                        >

                            {updated_value ? <>
                                <div>
                                    {
                                        updated_value?.map((item: any, index: number) => {
                                            return (
                                                <div key={index}>
                                                    {item?.title}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </> : 'N/A'}
                        </DataLabelValueComponent>
                    </div>
                )
            case "Work Information":
                return (
                    <div className={'work-information-activity-log'}>
                        <DataLabelValueComponent label={"From"}
                        >
                            {old_value && old_value !== {} ? <>
                            {generateObjectsContent(old_value)}
                            </> : 'N/A'}
                        </DataLabelValueComponent>
                        <DataLabelValueComponent label={"To"}
                        >
                            {updated_value ? <>
                                {generateObjectsContent(updated_value)}
                            </> : 'N/A'}
                        </DataLabelValueComponent>
                    </div>
                )

            case "Medical Diagnosis/Icd Codes":
                return (<div>
                    <DataLabelValueComponent label={"From"}
                    >
                        {
                            logItem?.old_value && logItem?.old_value?.length > 0 ?
                                <TableComponent
                                    data={logItem?.old_value}
                                    bordered={true}
                                    columns={ICDTableColumns}/> :
                                "N/A"
                        }
                    </DataLabelValueComponent>
                    <DataLabelValueComponent label={"To"}
                    >
                        {
                            logItem?.updated_value && logItem?.updated_value?.length > 0 ?
                                <TableComponent
                                    data={logItem?.updated_value}
                                    bordered={true}
                                    columns={ICDTableColumns}/> :
                                "N/A"
                        }
                    </DataLabelValueComponent>
                </div>)
            case "Special Tests":
                return (<div>
                    <DataLabelValueComponent label={"From"}
                    >
                        {
                            logItem?.old_value && logItem?.old_value?.special_tests?.length > 0 ?
                                <TableComponent
                                    data={logItem?.old_value?.special_tests}
                                    columns={SpecialTestsColumns}
                                    bordered={true}
                                /> :
                                "N/A"
                        }
                    </DataLabelValueComponent>
                    <DataLabelValueComponent label={"To"}
                    >
                        {
                            logItem?.updated_value && logItem?.updated_value?.special_tests.length > 0 ?
                                <TableComponent
                                    data={logItem?.updated_value?.special_tests}
                                    columns={SpecialTestsColumns}
                                    bordered={true}
                                /> :
                                "N/A"
                        }
                    </DataLabelValueComponent>
                </div>)
            case "Range of Motion and Strength":
                return (<div>
                    <DataLabelValueComponent label={"From"}
                    >
                        {
                            logItem?.old_value ?
                                <TableComponent
                                    data={updated_value?.rom_config}
                                    bordered={true}
                                    className={'view-arom-prom-table'}
                                    showExpandColumn={false}
                                    defaultExpandAllRows={true}
                                    canExpandRow={(row: any) => row?.config?.comments?.length > 0}
                                    // noDataText={body_part?.rom_config?.length === 0 ? 'No Range of Motion or Strength found.' : 'No Range of Motion or Strength found for this body part.'}
                                    // expandRowRenderer={
                                    //     (row: any) => {
                                    //         return (
                                    //             <div
                                    //                 key={row?.config?._id}
                                    //                 className={'comment-row'}>
                                    //                 <div
                                    //                     className={'comment-icon'}>
                                    //                     <ImageConfig.CommentIcon/>
                                    //                 </div>
                                    //                 <div
                                    //                     className={'comment-text'}>{row?.config?.comments ? CommonService.capitalizeFirstLetter(row?.config?.comments) : "-"}</div>
                                    //             </div>
                                    //         )
                                    //     }
                                    // }
                                    columns={getMedicalInterventionROMConfigColumns(updated_value)}/> :
                                "N/A"
                        }
                    </DataLabelValueComponent>
                    <DataLabelValueComponent label={"To"}
                    >
                        {
                            logItem?.updated_value && updated_value?.rom_config?.length > 0 ?
                                <TableComponent
                                    data={updated_value?.rom_config}
                                    bordered={true}
                                    className={'view-arom-prom-table'}
                                    showExpandColumn={false}
                                    defaultExpandAllRows={true}
                                    canExpandRow={(row: any) => row?.config?.comments?.length > 0}
                                    // noDataText={body_part?.rom_config?.length === 0 ? 'No Range of Motion or Strength found.' : 'No Range of Motion or Strength found for this body part.'}
                                    // expandRowRenderer={
                                    //     (row: any) => {
                                    //         return (
                                    //             <div
                                    //                 key={row?.config?._id}
                                    //                 className={'comment-row'}>
                                    //                 <div
                                    //                     className={'comment-icon'}>
                                    //                     <ImageConfig.CommentIcon/>
                                    //                 </div>
                                    //                 <div
                                    //                     className={'comment-text'}>{row?.config?.comments ? CommonService.capitalizeFirstLetter(row?.config?.comments) : "-"}</div>
                                    //             </div>
                                    //         )
                                    //     }
                                    // }
                                    columns={getMedicalInterventionROMConfigColumns(updated_value)}/> :
                                "N/A"
                        }
                    </DataLabelValueComponent>
                </div>)
            case "List of objects":
                return (
                    <div className={'list-of-objects-activity-log'}>
                        <DataLabelValueComponent label={"From"}
                        >
                            {old_value && old_value?.length > 0 ? <>
                                <div>
                                    {
                                        old_value?.map((item: any, index: number) => {
                                            return (
                                                <div key={index}>
                                                    {generateObjectsContent(item)}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </> : 'N/A'}
                        </DataLabelValueComponent>
                        <DataLabelValueComponent label={"To"}
                        >
                            {updated_value && updated_value?.length > 0 ?
                                <div>
                                    {
                                        updated_value?.map((item: any, index: number) => {
                                            return (
                                                <div key={index}>
                                                    {generateObjectsContent(item)}
                                                </div>
                                            )
                                        })
                                    }
                                </div> : 'N/A'}
                        </DataLabelValueComponent>
                    </div>
                )
            default:
                return (
                    <div className={'default-activity-log'}>
                        <DataLabelValueComponent label={"From"}
                        >
                            {old_value ? <>
                                <div>
                                    {
                                        JSON.stringify(old_value)
                                    }
                                </div>
                            </> : 'N/A'}
                        </DataLabelValueComponent>
                        <DataLabelValueComponent label={"To"}
                        >
                            {updated_value ? <>
                                <div className={'updated-value-log'}>
                                    {
                                        JSON.stringify(updated_value)
                                    }
                                </div>
                            </> : 'N/A'}
                        </DataLabelValueComponent>
                    </div>
                )
        }

    }, [])

    return (
        <div className={'activity-logs-timeline-component'}>
            <Timeline
                sx={{
                    [`& .${timelineItemClasses.root}:before`]: {
                        flex: 0,
                        padding: 0,
                    },
                }}>
                <>
                    {
                        logsData?.map((log: any, index: number) => {
                            return (
                                <TimelineItem key={index}>
                                    <TimelineSeparator>
                                        <TimelineConnector className={'initial-timeline-connector'}/>
                                        <TimelineDot color={"primary"}/>
                                        <TimelineConnector/>
                                    </TimelineSeparator>
                                    <TimelineContent>
                                        <div className={'log-item'}>
                                            <div className={'log-item-header'}>
                                                {log?.created_at && moment(log?.created_at).format('DD-MMM-YYYY')}
                                            </div>
                                            <div className={'log-item-body'}>
                                                <div className={'mrg-bottom-20'} key={index}>
                                                    <AccordionComponent
                                                        key={index}
                                                        forActivityLog={true}
                                                        title={getLogsStringWithArrows(log)}
                                                        disableExpanding={log.action !== 'Modified' ? true : false}
                                                        subTitle={` was ${log?.action?.toLowerCase()} by `}
                                                        name={log?.updated_by ? log?.updated_by?.name : ''}
                                                        actions={<div className={'log-status-wrapper'}>
                                                            <div className={'log-item-action'}>
                                                                <ChipComponent
                                                                    label={commonService.capitalizeFirstLetter(log.action)}
                                                                    className={log.action}/>
                                                            </div>
                                                            <div className={'updated-date mrg-left-20'}>
                                                                {tConvert(moment(log?.updated_at).format('HH:mm'))}
                                                            </div>
                                                        </div>}
                                                    >
                                                        {generateAccordionContent(log)}
                                                    </AccordionComponent>
                                                </div>

                                            </div>
                                        </div>
                                    </TimelineContent>
                                </TimelineItem>
                            )
                        })
                    }
                </>
            </Timeline>
        </div>
    );

};

export default ActivityLogTimelineComponent;
