import "./ActivityLogTimelineComponent.scss";

import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import React from 'react';
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

    const generateAccordionContent = (logItem: any) => {

    }
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
                                                        subTitle={log?.actionMessage || ''}
                                                        name={log?.userDetails ? (log?.userDetails?.firstName + ' ' + log?.userDetails?.lastName) : ''}
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
                                                        {
                                                            log.action === 'edit' && <>
                                                                <DataLabelValueComponent
                                                                    label={"From"}> {log?.data?.from || '-'} </DataLabelValueComponent>
                                                                <DataLabelValueComponent
                                                                    label={"To"}> {log?.data?.to || '-'} </DataLabelValueComponent>
                                                            </>
                                                        }
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
