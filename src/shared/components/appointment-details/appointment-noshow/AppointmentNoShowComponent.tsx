import React, {useCallback, useState} from "react";
import "./AppointmentNoShowComponent.scss";
import {CommonService} from "../../../services";
import {IAPIResponseType} from "../../../models/api.model";
import {ImageConfig} from "../../../../constants";
import ButtonComponent from "../../button/ButtonComponent";
import CheckBoxComponent from "../../form-controls/check-box/CheckBoxComponent";


interface AppointmentNoShowComponentProps {
    onClose?: () => void,
    onBack?: () => void,
    onComplete?: (values: any) => void,
    details: any
}

const AppointmentNoShowComponent = (props: AppointmentNoShowComponentProps) => {
    const {onBack, onComplete, details} = props;
    const [isAPICallRunning, setIsAPIRunning] = useState<boolean>(false);
    const [noShow, setNoShow] = useState<boolean>(false);
    const [noShowMarked, setNoShowMarked] = useState(false);

    const markNoShow = useCallback(
        (payload: any) => {
            setIsAPIRunning(true)
            //medical_record_id
            CommonService._appointment.appointmentNoShow(details._id, payload)
                .then((response: IAPIResponseType<any>) => {
                    setNoShowMarked(true);
                    CommonService._alert.showToast(response.message || 'Marked appointment as No Show')
                })
                .catch((error: any) => {
                    // CommonService.handleErrors(errors);
                })
                .finally(() => {
                    setIsAPIRunning(false)
                })
        },
        [details],
    );

    return (
        <div className={'appointment-details-no-show-component'}>
            {!noShowMarked && <>
                <div className="drawer-header">
                    {/*<div className="back-btn" onClick={onBack}><ImageConfig.LeftArrow/></div>*/}
                    {/*<div className="drawer-title">Mark as No Show</div>*/}
                    {/*<ToolTipComponent tooltip={"Close"} position={"left"}>*/}
                    {/*    <div className="drawer-close"*/}
                    {/*         id={'appintment-details-close-btn'}*/}
                    {/*         onClick={(event) => {*/}
                    {/*             if (onClose) {*/}
                    {/*                 onClose();*/}
                    {/*             }*/}
                    {/*         }*/}
                    {/*         }><ImageConfig.CloseIcon/></div>*/}
                    {/*</ToolTipComponent>*/}
                </div>
                <div className="flex-1 booking-confirmation-status">
                    <div className="booking-confirmation-status-icon"
                         style={{backgroundImage: 'url(' + ImageConfig.AppointmentConfirm + ')'}}>
                        <ImageConfig.VerifiedCheck width={24}/>
                    </div>
                    <div className="booking-confirmation-status-text">
                        Do you want to mark the appointment with&nbsp;
                        <b>{details.provider_details?.first_name + ' ' + details.provider_details?.last_name}</b> on <b>{CommonService.convertDateFormat(details.appointment_date)}</b> as&nbsp;
                        <b>No Show</b>?
                    </div>
                    <CheckBoxComponent value={noShow} label={'Waive No Show Fee'} checked={noShow}
                                       onChange={(isChecked) => setNoShow(isChecked)}/>
                </div>
                <div className="action-buttons">
                    <ButtonComponent fullWidth={true} variant={'outlined'}
                                     disabled={isAPICallRunning}
                                     onClick={event => {
                                         if (onBack) {
                                             onBack()
                                         }
                                     }}>No</ButtonComponent>
                    <ButtonComponent fullWidth={true}
                                     isLoading={isAPICallRunning}
                                     onClick={event => {
                                         markNoShow({waive_no_show_fee: noShow})
                                     }}>Yes</ButtonComponent>
                </div>
            </>}
            {noShowMarked && <>
                <div className="flex-1 booking-confirmation-status">
                    <div className="booking-confirmation-status-icon"
                         style={{backgroundImage: 'url(' + ImageConfig.AppointmentConfirm + ')'}}>
                        <ImageConfig.VerifiedCheck width={24}/>
                    </div>
                    <div className="booking-confirmation-status-text">
                        Appointment status have been marked as 'No Show'
                    </div>
                </div>
                <div className="action-buttons">
                    <ButtonComponent fullWidth={true}
                                     isLoading={isAPICallRunning}
                                     onClick={event => {
                                         if (onComplete) {
                                             onComplete({});
                                         }
                                     }}>Close</ButtonComponent>
                </div>
            </>}
        </div>
    );
};

export default AppointmentNoShowComponent;
