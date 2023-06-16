import "./AppointmentSettingsRescheduleComponent.scss";
import React, {useCallback, useEffect, useState} from "react";
import {CommonService} from "../../../../shared/services";
import CardComponent from "../../../../shared/components/card/CardComponent";
import HorizontalLineComponent
    from "../../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";
import QuestionComponent from "../../../../shared/components/question/QuestionComponent";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../../constants";
import MentionsComponent from "../../../../shared/components/mentions/MentionsComponent";
import ChipComponent from "../../../../shared/components/chip/ChipComponent";
import ToolTipComponent from "../../../../shared/components/tool-tip/ToolTipComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";
import SelectComponent from "../../../../shared/components/form-controls/select/SelectComponent";

interface AppointmentSettingsRescheduleComponentProps {
    appointmentSettingsReschedulingDetails: any;
    onSubmit: Function;
    isTemplateSaveInProgress: boolean;
    mentionsList: any[]
    allowReschedulingBefore: any;
    maxRescheduling: any;
}

const AppointmentSettingsRescheduleComponent = (props: AppointmentSettingsRescheduleComponentProps) => {

    const {
        appointmentSettingsReschedulingDetails,
        onSubmit,
        allowReschedulingBefore,
        maxRescheduling,
        isTemplateSaveInProgress,
        mentionsList
    } = props;
    const [messageMode, setMessageMode] = useState<'edit' | 'view'>('view');
    const [emailMode, setEmailMode] = useState<'edit' | 'view'>('view');


    const [messageValue, setMessageValue] = useState("");
    const [subjectValue, setSubjectValue] = useState("");
    const [emailValue, setEmailValue] = useState("");

    const messageVal = CommonService.editMentionsFormat(appointmentSettingsReschedulingDetails?.sms?.content, mentionsList);
    const emailSubVal = CommonService.editMentionsFormat(appointmentSettingsReschedulingDetails?.email?.subject, mentionsList);
    const emailContentVal = CommonService.editMentionsFormat(appointmentSettingsReschedulingDetails?.email?.content, mentionsList);
    const {reschedulingHoursList, reschedulingTimesList} = useSelector((state: IRootReducerState) => state.staticData);
    const [selectedHours, setSelectedHours] = useState<any>("");
    const [selectedTimes, setSelectedTimes] = useState<any>("");

    useEffect(() => {
        setMessageValue(messageVal);
        setSelectedHours(allowReschedulingBefore?.toString())
        setSelectedTimes(maxRescheduling?.toString());
        setEmailValue(emailContentVal);
        setSubjectValue(emailSubVal);
    }, [appointmentSettingsReschedulingDetails, allowReschedulingBefore, emailContentVal, emailSubVal, maxRescheduling, messageVal]);

    const onTemplateSubmit = useCallback((type?: any, value?: any) => {
        let payload;

        payload = {
            "sms": {
                "content": CommonService.cleanMentionsPayload(messageValue, mentionsList)
            },
            "email": {
                "subject": CommonService.cleanMentionsPayload(subjectValue, mentionsList),
                "content": CommonService.cleanMentionsPayload(emailValue, mentionsList)
            },
            allow_rescheduling_before: parseInt(selectedHours),
            max_rescheduling: parseInt(selectedTimes)
        }

        if (type === 'allow_rescheduling_before') {
            payload.allow_rescheduling_before = value
        } else {
            payload.max_rescheduling = value
        }
        onSubmit(payload)
    }, [emailValue, messageValue, subjectValue, mentionsList, onSubmit, selectedHours, selectedTimes]);

    return (
        <div className={'appointment-settings-remainder-component'}>

            <CardComponent title={"Appointment Reschedule"} className={'appointment-reschedule'}>
                <div className="t-form-controls">
                    <div className="ts-row">
                        <div className="ts-col-md-12 ts-col-md-6 ts-col-lg-6">
                            <QuestionComponent title={"Rescheduling Appointment"}
                                               description={"Rescheduling an appointment cannot be done within ‘x’ hours of the appointment"}
                            ></QuestionComponent>
                        </div>
                        <div className={"ts-col-md-12 ts-col-md-6 ts-col-lg-2"}/>
                        <div className="ts-col-md-12 ts-col-md-6 ts-col-lg-4">
                            <SelectComponent
                                label={"Select hours"}
                                className={'t-form-control'}
                                options={reschedulingHoursList || []}
                                value={selectedHours}
                                fullWidth={true}
                                onUpdate={(value) => {
                                    console.log(value);
                                    setSelectedHours(value);
                                    onTemplateSubmit('allow_rescheduling_before', value);
                                }}
                            />
                        </div>
                    </div>
                    <div className="ts-row">
                        <div className="ts-col-md-12 ts-col-md-6 ts-col-lg-6">
                            <QuestionComponent title={"How many times an appointment can be rescheduled ?"}
                                               description={"Appointment cannot be rescheduled more than the defined amount of times"}
                            ></QuestionComponent>
                        </div>
                        <div className={"ts-col-md-12 ts-col-md-6 ts-col-lg-2"}/>
                        <div className="ts-col-md-12 ts-col-md-6 ts-col-lg-4">
                            <SelectComponent
                                label={"Select number"}
                                className={'t-form-control'}
                                options={reschedulingTimesList || []}
                                value={selectedTimes}
                                fullWidth={true}
                                onUpdate={(value) => {
                                    setSelectedTimes(value)
                                    onTemplateSubmit('max_rescheduling', value);
                                }}
                            />
                        </div>
                    </div>
                    {/*<ButtonComponent className={'ts-form-actions'}>*/}
                    {/*    Save*/}
                    {/*</ButtonComponent>*/}

                    <HorizontalLineComponent/>
                    {messageMode === 'view' &&
                    <>
                        <div className="d-flex ts-justify-content-between">
                            <QuestionComponent title={"Message (SMS)"}
                                               description={"Message template for sending appointment confirmations."}
                            ></QuestionComponent>
                            <div>
                                <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>}
                                                 onClick={() => {
                                                     setMessageMode('edit')
                                                 }}>
                                    Edit
                                </ButtonComponent>
                            </div>
                        </div>
                        <div className="message-section"
                             dangerouslySetInnerHTML={{__html: CommonService.cleanMentionsResponse(appointmentSettingsReschedulingDetails?.sms?.content, mentionsList)}}>

                        </div>
                    </>
                    }

                    {messageMode === 'edit' &&
                    <>
                        <div className="d-flex ts-justify-content-between">
                            <QuestionComponent title={"Message (SMS)"}
                                               description={"Message template for sending appointment confirmations."}
                            ></QuestionComponent>
                        </div>
                        <MentionsComponent
                            data={mentionsList}
                            inputHeight={180}
                            value={messageValue}
                            onChange={(value) => setMessageValue(value)}
                            placeholder={"Enter text here"}
                        />
                        <div className="info-tool-tip-wrapper">
                            <ToolTipComponent
                                showArrow={true}
                                position={'top'}
                                backgroundColor={'#FFF5D3'}
                                tooltip={<div className="pdd-10">
                                    <div>To create a custom template with pre-defined keywords and specific formatting
                                        rules, please follow the instructions below:
                                    </div>
                                    <div className="">
                                        <div className="tooltip-text-row-wrapper">
                                            <div className="tooltip-text-pointer">*</div>
                                            <div className="tooltip-text">Start by typing your message in the template
                                                box.
                                            </div>
                                        </div>

                                        <div className="tooltip-text-row-wrapper">
                                            <div className="tooltip-text-pointer">*</div>
                                            <div className="tooltip-text">To access the list of pre-defined keywords,
                                                type "@" in the text box. A
                                                dropdown
                                                list will appear with the available keywords. Select the appropriate
                                                keyword
                                                from the list by clicking on it or by using the arrow keys to navigate
                                                and
                                                pressing "Enter" to select it.
                                            </div>
                                        </div>

                                    </div>
                                </div>}
                            >
                                <ImageConfig.InfoIcon/>
                            </ToolTipComponent>

                        </div>

                        <div className="available-mentions-wrapper">
                            <div className="available-mentions-title">Available Keywords</div>
                            <div className="available-mentions-chips-wrapper">
                                {
                                    mentionsList?.map((mention) => {
                                        return (
                                            <div>
                                                <ChipComponent label={mention.display}/>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>

                        <div className="d-flex ts-justify-content-center">
                            <ButtonComponent variant={"outlined"}
                                             disabled={isTemplateSaveInProgress}
                                             onClick={() => {
                                                 setMessageMode('view');
                                                 setMessageValue(messageVal);
                                             }}
                            >
                                Cancel
                            </ButtonComponent>&nbsp;&nbsp;
                            <ButtonComponent
                                isLoading={isTemplateSaveInProgress}
                                type="button"
                                onClick={onTemplateSubmit}
                                disabled={messageValue?.length === 0 || messageValue === messageVal}
                            >
                                Save
                            </ButtonComponent>
                        </div>
                    </>
                    }

                    <HorizontalLineComponent/>

                    {emailMode === 'view' && <>

                        <div className="d-flex ts-justify-content-between">
                            <QuestionComponent title={"Email"}
                                               description={"Email template for sending appointment confirmations."}
                            ></QuestionComponent>
                            <div>
                                <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>}
                                                 onClick={() => {
                                                     setEmailMode('edit');
                                                 }}
                                >
                                    Edit
                                </ButtonComponent>
                            </div>
                        </div>
                        <div className="email-section">
                            <div className="email-header-section">
                                <div className="email-screen__header__row"
                                     dangerouslySetInnerHTML={{__html: CommonService.cleanMentionsResponse(appointmentSettingsReschedulingDetails?.email?.subject, mentionsList)}}>
                                </div>
                                <hr className="hr-line"/>
                            </div>

                            <div className="email-screen-body"
                                 dangerouslySetInnerHTML={{__html: CommonService.cleanMentionsResponse(appointmentSettingsReschedulingDetails?.email?.content, mentionsList)}}>
                            </div>
                        </div>
                    </>
                    }


                    {emailMode === 'edit' &&
                    <>
                        <div className="d-flex ts-justify-content-between">
                            <QuestionComponent title={"Email"}
                                               description={"Email template for sending appointment confirmations."}
                            ></QuestionComponent>
                        </div>
                        <div>
                            <div className="mention-field-titles">Subject :</div>
                            <MentionsComponent
                                data={mentionsList}
                                inputHeight={50}
                                value={subjectValue}
                                onChange={(value) => setSubjectValue(value)}
                                placeholder={"Write Subject here"}
                            />
                        </div>
                        <div>
                            <div className="mention-field-titles">Body :</div>
                            <MentionsComponent
                                data={mentionsList}
                                inputHeight={180}
                                value={emailValue}
                                onChange={(value) => setEmailValue(value)}
                                placeholder={"Enter text here"}
                            />
                        </div>
                        <div className="info-tool-tip-wrapper">
                            <ToolTipComponent
                                showArrow={true}
                                position={'top'}
                                backgroundColor={'#FFF5D3'}
                                tooltip={<div className="pdd-10">
                                    <div>To create a custom template with pre-defined keywords and specific formatting
                                        rules, please follow the instructions below:
                                    </div>
                                    <div className="">
                                        <div className="tooltip-text-row-wrapper">
                                            <div className="tooltip-text-pointer">*</div>
                                            <div className="tooltip-text">Start by typing your message in the template
                                                box.
                                            </div>
                                        </div>

                                        <div className="tooltip-text-row-wrapper">
                                            <div className="tooltip-text-pointer">*</div>
                                            <div className="tooltip-text">To access the list of pre-defined keywords,
                                                type "@" in the text box. A
                                                dropdown
                                                list will appear with the available keywords. Select the appropriate
                                                keyword
                                                from the list by clicking on it or by using the arrow keys to navigate
                                                and
                                                pressing "Enter" to select it.
                                            </div>
                                        </div>

                                    </div>
                                </div>}
                            >

                                <ImageConfig.InfoIcon/>
                            </ToolTipComponent>

                        </div>

                        <div className="available-mentions-wrapper">
                            <div className="available-mentions-title">Available Keywords</div>
                            <div className="available-mentions-chips-wrapper">
                                {
                                    mentionsList.map((mention) => {
                                        return (
                                            <div>
                                                <ChipComponent label={mention.display}/>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="d-flex ts-justify-content-center">
                            <ButtonComponent variant={"outlined"}
                                             disabled={isTemplateSaveInProgress}
                                             onClick={() => {
                                                 setEmailMode('view');
                                                 setEmailValue(emailSubVal);
                                                 setSubjectValue(emailContentVal);
                                             }}
                            >
                                Cancel
                            </ButtonComponent>&nbsp;&nbsp;
                            <ButtonComponent
                                isLoading={isTemplateSaveInProgress}
                                type="button"
                                onClick={onTemplateSubmit}
                                disabled={emailValue?.length === 0 || emailValue === emailContentVal}
                            >
                                Save
                            </ButtonComponent>
                        </div>
                    </>
                    }
                </div>
            </CardComponent>
        </div>
    );

};

export default AppointmentSettingsRescheduleComponent;