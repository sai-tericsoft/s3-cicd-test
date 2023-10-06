import "./ActivityLogTimelineComponent.scss";

import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import React, {useCallback} from 'react';
import {timelineItemClasses} from "@mui/lab/TimelineItem";
import ChipComponent from "../chip/ChipComponent";
import moment from "moment";
import commonService from "../../services/common.service";
import AccordionComponent from "../accordion/AccordionComponent";
import DataLabelValueComponent from "../data-label-value/DataLabelValueComponent";

interface ActivityLogTimelineComponentProps {
    logsData?: any;
}

const ActivityLogTimelineComponent = (props: ActivityLogTimelineComponentProps) => {
    const {logsData} = props;

    const getLogsStringWithArrows = (log: any) => {
        let str = log?.module_name && (log?.module_name + '?');
        str += log?.sub_module && (log?.sub_module + '?');
        str += log?.feature && (log?.feature + '?');
        str += log?.section && (log?.section + '?');
        str += log?.sub_section && (log?.sub_section + '?');
        str += log?.field_name && (log?.field_name + '?');
        str += log?.value ? (log?.value) : '';
        str.charAt(str.length - 1) === '?' && (str = str.slice(0, -1));
        str = str.replace(/\?+/g, ' > ');
        return str;
    }

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

    const generateAccordionContent = useCallback((logItem: any) => {
        let {
            updated_value,
            field_name,
            old_value
        } = logItem;
        field_name = field_name === "Surgeries" || field_name === "Medical History" ? "list of titles" : field_name;
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
                                                       item?.value  && <span>{item?.text}
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
                                                        item?.value  && <span>{item?.text}
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
                            {old_value && old_value !=={} ? <>
                                <div>
                                    <div className={''}>{old_value?.employment_status}</div>
                                    <div className={''}>{old_value?.occupation}</div>
                                </div>
                            </> : 'N/A'}
                        </DataLabelValueComponent>
                        <DataLabelValueComponent label={"To"}
                        >
                            {updated_value ? <>
                                <div>
                                    <div className={''}>{updated_value?.employment_status}</div>
                                    <div className={''}>{updated_value?.occupation}</div>
                                </div>
                            </> : 'N/A'}
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
