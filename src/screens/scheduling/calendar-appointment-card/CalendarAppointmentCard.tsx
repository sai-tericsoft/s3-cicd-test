import "./CalendarAppointmentCard.scss";
import React from "react";
import ToolTipComponent from "../../../shared/components/tool-tip/ToolTipComponent";
import {CommonService} from "../../../shared/services";

interface CalendarAppointmentCardProps {
    style?: React.CSSProperties;
    title?: any;
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
                                  <b><span className={title?.is_alias_name_set ? "alias-name" : ""}>{CommonService.generateClientNameFromClientDetails(title) || "No title"}</span></b><br/>
                                  <div>
                                      {status !== 'blocked' && description} <br/>
                                  </div>

                                  {timeSlot || "-"} <br/>
                                  {status !== 'blocked' ?
                                      <> {CommonService.capitalizeFirstLetterAndRemoveUnderScore(status) || "-"}</> :
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
                        <span className={title?.is_alias_name_set ? "alias-name" : ""}>
                        {CommonService.generateClientNameFromClientDetails(title) || "No title"}
                            </span>
                    </div>
                    <div className="card-appointment-status">
                        {CommonService.capitalizeFirstLetterAndRemoveUnderScore(status) || "-"}
                    </div>
                </div>
                {status !== 'blocked' ?
                    <>{description && <div className="card-appointment-description">
                        {description || "-"}
                    </div>}</> :
                    <div className="card-appointment-description">{reason || "-"}</div>
                }

            </div>
        </ToolTipComponent>
    );

};

export default CalendarAppointmentCard;
