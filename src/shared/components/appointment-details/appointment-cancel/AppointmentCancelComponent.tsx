import React, {useCallback, useState} from "react";
import "./AppointmentCancelComponent.scss";
import {CommonService} from "../../../services";
import {IAPIResponseType} from "../../../models/api.model";
import {ImageConfig} from "../../../../constants";
import ButtonComponent from "../../button/ButtonComponent";
import CheckBoxComponent from "../../form-controls/check-box/CheckBoxComponent";
import LottieFileGenerationComponent from "../../lottie-file-generation/LottieFileGenerationComponent";


interface AppointmentCancelComponentProps {
    onClose?: () => void,
    onBack?: () => void,
    onComplete?: (values: any) => void,
    details: any
}

const AppointmentCancelComponent = (props: AppointmentCancelComponentProps) => {
    const {onBack, onComplete, details} = props;
    const [isAPICallRunning, setIsAPIRunning] = useState<boolean>(false);
    const [cancel, setCancel] = useState<boolean>(false);
    const [cancelMarked, setCancelMarked] = useState(false);

    const markCancel = useCallback(
        (payload: any) => {
            setIsAPIRunning(true)
            //medical_record_id
            CommonService._appointment.appointmentCancel(details._id, payload)
                .then((response: IAPIResponseType<any>) => {
                    setCancelMarked(true);
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
        <div className={'appointment-details-cancel-component'}>
            {!cancelMarked && <>
                <div className="drawer-header">
                    {/*<div className="back-btn" onClick={onBack}><ImageConfig.LeftArrow/></div>*/}
                    {/*<div className="drawer-title">Cancel Appointment</div>*/}
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
                    {/*<div className="booking-confirmation-status-icon"*/}
                    {/*     style={{backgroundImage: 'url(' + ImageConfig.AppointmentConfirm + ')'}}>*/}
                    {/*    <ImageConfig.VerifiedCross width={24}/>*/}
                    {/*</div>*/}
                    <div className="booking-confirmation-status-text">
                        Do you want to cancel the appointment with&nbsp;
                        <b>{details.provider_details?.first_name + ' ' + details.provider_details?.last_name}</b> on<br/> <b>{CommonService.convertDateFormat2(details.appointment_date)}</b>?
                    </div>
                    <CheckBoxComponent value={cancel} checked={cancel} label={'Waive Cancellation Fee'}
                                       onChange={isChecked => {
                                           setCancel(isChecked);
                                       }}/>
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
                                         markCancel({waive_cancellation_fee: cancel})
                                     }}>Yes</ButtonComponent>
                </div>
            </>}
            {cancelMarked && <>
                <div className="flex-1 booking-confirmation-status">
                    {/*<div className="booking-confirmation-status-icon"*/}
                    {/*     style={{backgroundImage: 'url(' + ImageConfig.AppointmentConfirm + ')'}}>*/}
                    {/*    <ImageConfig.VerifiedCheck width={24}/>*/}
                    {/*</div>*/}
                    <LottieFileGenerationComponent autoplay={true} loop={false} animationData={ImageConfig.CheckLottie}/>
                    <div className="booking-confirmation-status-text">
                        Appointment status have <br/> been marked as 'Cancelled'.
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

export default AppointmentCancelComponent;
