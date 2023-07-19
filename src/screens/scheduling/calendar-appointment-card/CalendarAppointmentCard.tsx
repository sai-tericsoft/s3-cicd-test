import "./CalendarAppointmentCard.scss";
import React from "react";
import ToolTipComponent from "../../../shared/components/tool-tip/ToolTipComponent";
import {CommonService} from "../../../shared/services";

interface CalendarAppointmentCardProps {
    style?: React.CSSProperties;
    title?: string;
    timeSlot?: string;
    description?: string;
    status?: string;
    reason?: string;
}

const CalendarAppointmentCard = (props: CalendarAppointmentCardProps) => {

    const {style, description, timeSlot, status, title, reason} = props;
    return (
        <ToolTipComponent backgroundColor="#000000" textColor="#ffffff"
                          tooltip={
                              <>
                                  <b>{CommonService.capitalizeFirstLetter(title) || "No title"}</b><br/>
                                  <div>
                                      {status !== 'blocked' && description} <br/>
                                  </div>

                                  {timeSlot || "-"} <br/>
                                  {status !== 'blocked' ?
                                      <> {CommonService.capitalizeFirstLetter(status) || "-"}</> :
                                      <div className="card-appointment-reason">Reason: {reason || "-"}</div>
                                  }
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
                        {CommonService.capitalizeFirstLetter(title) || "No title"}
                    </div>
                    <div className="card-appointment-status">
                        {CommonService.capitalizeFirstLetter(status) || "-"}
                    </div>
                </div>
                {description && <div className="card-appointment-description">
                    {description || "-"}
                </div>}
            </div>
        </ToolTipComponent>
    );

};

export default CalendarAppointmentCard;
