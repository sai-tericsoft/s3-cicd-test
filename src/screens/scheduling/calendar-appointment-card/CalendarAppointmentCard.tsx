import "./CalendarAppointmentCard.scss";
import React from "react";
import ToolTipComponent from "../../../shared/components/tool-tip/ToolTipComponent";

interface CalendarAppointmentCardProps {
    style?: React.CSSProperties;
    title?: string;
    timeSlot?: string;
    description?: string;
    status?: string;
}

const CalendarAppointmentCard = (props: CalendarAppointmentCardProps) => {
    const {style, description,timeSlot, status, title} = props;


    return (
        <ToolTipComponent backgroundColor="#000000" textColor="#ffffff"
            tooltip={
                <>
                    <b>{title || "No title"}</b><br/>
                    {description || "-"} <br/>
                    {timeSlot || "-"} <br/>
                    <i>{status || "-"}</i>
                </>
            }
            // tooltip={
            //     (title || 'No title') + '\n' + (description || "-") + '\r\n' + (status || "-")
            // }
        >

            <div style={style}
                 className={"calendar-appointment-card-component card-appointment-with-status " + status}>
                <div className="card-appointment-header">
                    <div className="card-appointment-title">
                        {title || "No title"}
                    </div>
                    <div className="card-appointment-status">
                        {status || "-"}
                    </div>
                </div>
                <div className="card-appointment-description">
                    {description || "-"}
                </div>
            </div>
        </ToolTipComponent>
    );

};

export default CalendarAppointmentCard;
