import "./AppointmentSettingsCancellationComponent.scss";
import React, {useCallback, useEffect, useState} from "react";
import {CommonService} from "../../../../shared/services";
import CardComponent from "../../../../shared/components/card/CardComponent";
import QuestionComponent from "../../../../shared/components/question/QuestionComponent";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../../constants";
import MentionsComponent from "../../../../shared/components/mentions/MentionsComponent";
import ChipComponent from "../../../../shared/components/chip/ChipComponent";
import HorizontalLineComponent
    from "../../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";
import ToolTipComponent from "../../../../shared/components/tool-tip/ToolTipComponent";
import FormControlLabelComponent from "../../../../shared/components/form-control-label/FormControlLabelComponent";

interface AppointmentSettingsCancellationComponentProps {
    appointmentSettingsCancellationDetails: any;
    onSubmit: Function;
    isTemplateSaveInProgress: boolean;
    mentionsList: any[]
}

const AppointmentSettingsCancellationComponent = (props: AppointmentSettingsCancellationComponentProps) => {

    const {appointmentSettingsCancellationDetails, onSubmit, isTemplateSaveInProgress, mentionsList} = props;
    const [messageMode, setMessageMode] = useState<'edit' | 'view'>('view');
    const [emailMode, setEmailMode] = useState<'edit' | 'view'>('view');


    const [messageValue, setMessageValue] = useState("");
    const [subjectValue, setSubjectValue] = useState("");
    const [emailValue, setEmailValue] = useState("");

    const messageVal = CommonService.editMentionsFormat(appointmentSettingsCancellationDetails?.sms?.content, mentionsList);
    const emailSubVal = CommonService.editMentionsFormat(appointmentSettingsCancellationDetails?.email?.subject, mentionsList);
    const emailContentVal = CommonService.editMentionsFormat(appointmentSettingsCancellationDetails?.email?.content, mentionsList);


    useEffect(() => {
        setMessageValue(messageVal);
        setEmailValue(emailContentVal);
        setSubjectValue(emailSubVal);
    }, [messageVal, emailSubVal, emailContentVal]);

    const onTemplateSubmit = useCallback(() => {

        const payload = {
            "sms": {
                "content": CommonService.cleanMentionsPayload(messageValue, mentionsList)
            },
            "email": {
                "subject": CommonService.cleanMentionsPayload(subjectValue, mentionsList),
                "content": CommonService.cleanMentionsPayload(emailValue, mentionsList)
            }
        }
        onSubmit(payload)
    }, [emailValue, messageValue, subjectValue, mentionsList, onSubmit]);

    return (
        <div className={'appointment-settings-remainder-component'}>
            <CardComponent title={"Appointment Cancellation"} className={'appointment-cancellation'}>
                <div className="t-form-controls">
                    {messageMode === 'view' &&
                        <>
                            <div className="d-flex ts-justify-content-between">
                                <QuestionComponent title={"Message (SMS):"}
                                                   description={"Create an SMS message that a client will receive when an appointment is cancelled."}
                                ></QuestionComponent>
                                <div>
                                    <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>}
                                                     variant={"outlined"}
                                                     className={'mrg-top-10'}
                                                     onClick={() => {
                                                         setMessageMode('edit')
                                                     }}>
                                        Edit
                                    </ButtonComponent>
                                </div>
                            </div>
                            <div className="message-section"
                                 dangerouslySetInnerHTML={{__html: CommonService.cleanMentionsResponse(appointmentSettingsCancellationDetails?.sms?.content, mentionsList)}}>

                            </div>
                        </>
                    }

                    {messageMode === 'edit' &&
                        <>
                            <div>
                                <div className={'d-flex'}>
                                    <FormControlLabelComponent label={"Message (SMS)"} className={'message-heading'}/>
                                    <div className="info-tool-tip-wrapper">
                                        <ToolTipComponent
                                            showArrow={true}
                                            position={'top'}
                                            tooltip={<div className="pdd-10">
                                                <b>To create a custom template with pre-defined keywords and specific
                                                    formatting
                                                    rules, please follow the instructions below:
                                                </b>
                                                <div className="mrg-top-10">
                                                    <div className="tooltip-text-row-wrapper">
                                                        {/*<div className="tooltip-text-pointer">*</div>*/}
                                                        <ul>
                                                            <li className="tooltip-text">Start by typing your message in
                                                                the
                                                                template box.
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    <div className="tooltip-text-row-wrapper">
                                                        {/*<div className="tooltip-text-pointer">*</div>*/}
                                                        <ul>
                                                            <li className="tooltip-text">To access the list of
                                                                pre-defined
                                                                keywords, type "@" in the text box. A
                                                                dropdown
                                                                list will appear with the available keywords. Select the
                                                                appropriate
                                                                keyword
                                                                from the list by clicking on it or by using the arrow
                                                                keys
                                                                to
                                                                navigate
                                                                and
                                                                pressing "Enter" to select it.
                                                            </li>
                                                        </ul>
                                                    </div>

                                                </div>
                                            </div>}
                                        >
                                            <ImageConfig.InfoIcon height={'20'} width={'20'}/>

                                        </ToolTipComponent>
                                    </div>
                                </div>
                                <div className={'message-description'}>Create an SMS message that a client will receive
                                    when an appointment is cancelled.
                                </div>

                            </div>
                            <MentionsComponent
                                data={mentionsList}
                                inputHeight={180}
                                value={messageValue}
                                onChange={(value) => setMessageValue(value)}
                                placeholder={"Enter text here"}
                            />
                            <div className="available-mentions-wrapper">
                                <div className="available-mentions-title">Available Keywords</div>
                                <div className="available-mentions-chips-wrapper">
                                    {
                                        mentionsList.map((mention) => {
                                            return (
                                                <div>
                                                    <ChipComponent label={mention.display} className={'inactive'}/>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className="d-flex ts-justify-content-center mrg-bottom-25">
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
                            <QuestionComponent title={"Email:"}
                                               description={"Create an Email message that a client will receive when an appointment is cancelled."}
                            ></QuestionComponent>
                            <div>
                                <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>}
                                                 variant={"outlined"}
                                                 className={'mrg-top-10'}
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
                                     dangerouslySetInnerHTML={{__html: CommonService.cleanMentionsResponse(appointmentSettingsCancellationDetails?.email?.subject, mentionsList)}}>
                                </div>
                                <HorizontalLineComponent className={'divider'}/>
                            </div>

                            <div className="email-screen-body"
                                 dangerouslySetInnerHTML={{__html: CommonService.cleanMentionsResponse(appointmentSettingsCancellationDetails?.email?.content, mentionsList)}}>
                            </div>
                        </div>
                    </>
                    }


                    {emailMode === 'edit' &&
                        <>
                            {/*<div className="d-flex ts-justify-content-between">*/}
                            {/*    <QuestionComponent title={"Email"}*/}
                            {/*                       description={"Email template for sending appointment cancellation."}*/}
                            {/*    ></QuestionComponent>*/}
                            {/*</div>*/}
                            <div>
                                <div className={'d-flex'}>
                                    <FormControlLabelComponent label={"Email"} className={'message-heading'}/>
                                    <div className="info-tool-tip-wrapper">
                                        <ToolTipComponent
                                            showArrow={true}
                                            position={'top'}
                                            tooltip={<div className="pdd-10">
                                                <b>To create a custom template with pre-defined keywords and specific
                                                    formatting
                                                    rules, please follow the instructions below:
                                                </b>
                                                <div className="mrg-top-10">
                                                    <div className="tooltip-text-row-wrapper">
                                                        {/*<div className="tooltip-text-pointer">*</div>*/}
                                                        <ul>
                                                            <li className="tooltip-text">Start by typing your message in
                                                                the
                                                                template box.
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    <div className="tooltip-text-row-wrapper">
                                                        {/*<div className="tooltip-text-pointer">*</div>*/}
                                                        <ul>
                                                            <li className="tooltip-text">To access the list of
                                                                pre-defined
                                                                keywords, type "@" in the text box. A
                                                                dropdown
                                                                list will appear with the available keywords. Select the
                                                                appropriate
                                                                keyword
                                                                from the list by clicking on it or by using the arrow
                                                                keys
                                                                to
                                                                navigate
                                                                and
                                                                pressing "Enter" to select it.
                                                            </li>
                                                        </ul>
                                                    </div>

                                                </div>
                                            </div>}
                                        >
                                            <ImageConfig.InfoIcon height={'20'} width={'20'}/>

                                        </ToolTipComponent>
                                    </div>
                                </div>
                                <div className={'message-description mrg-bottom-5'}>Create an Email message that a
                                    client will receive when an appointment is cancelled.
                                </div>

                            </div>
                            <div>
                                <div className="mention-field-titles">Subject:</div>
                                <MentionsComponent
                                    data={mentionsList}
                                    inputHeight={50}
                                    value={subjectValue}
                                    onChange={(value) => setSubjectValue(value)}
                                    placeholder={"Write Subject here"}
                                />
                            </div>
                            <div>
                                <div className="mention-field-titles">Body:</div>
                                <MentionsComponent
                                    data={mentionsList}
                                    inputHeight={180}
                                    value={emailValue}
                                    onChange={(value) => setEmailValue(value)}
                                    placeholder={"Enter text here"}
                                />
                            </div>
                            <div className="available-mentions-wrapper">
                                <div className="available-mentions-title">Available Keywords</div>
                                <div className="available-mentions-chips-wrapper">
                                    {
                                        mentionsList.map((mention) => {
                                            return (
                                                <div>
                                                    <ChipComponent label={mention.display} className={'inactive'}/>
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
    )
        ;

};

export default AppointmentSettingsCancellationComponent;