import "./AppointmentSettingsRemainderComponent.scss";
import React, {useCallback, useEffect, useState} from "react";
import CardComponent from "../../../../shared/components/card/CardComponent";
import QuestionComponent from "../../../../shared/components/question/QuestionComponent";
import HorizontalLineComponent
    from "../../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../../constants";
import {CommonService} from "../../../../shared/services";
import MentionsComponent from "../../../../shared/components/mentions/MentionsComponent";
import ChipComponent from "../../../../shared/components/chip/ChipComponent";
import ToolTipComponent from "../../../../shared/components/tool-tip/ToolTipComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";
import SelectComponent from "../../../../shared/components/form-controls/select/SelectComponent";
import FormControlLabelComponent from "../../../../shared/components/form-control-label/FormControlLabelComponent";


interface AppointmentSettingsRemainderComponentProps {
    appointmentSettingsRemainderDetails: any;
    onSubmit: Function;
    isTemplateSaveInProgress: boolean;
    mentionsList: any[]
    primaryReminderBefore: any
    secondaryReminderBefore: any
}

const AppointmentSettingsRemainderComponent = (props: AppointmentSettingsRemainderComponentProps) => {
    const {
        appointmentSettingsRemainderDetails,
        onSubmit,
        isTemplateSaveInProgress,
        mentionsList,
        primaryReminderBefore,
        secondaryReminderBefore
    } = props;
    const [messageMode, setMessageMode] = useState<'edit' | 'view'>('view');
    const [emailMode, setEmailMode] = useState<'edit' | 'view'>('view');

    const [messageValue, setMessageValue] = useState("");
    const [subjectValue, setSubjectValue] = useState("");
    const [emailValue, setEmailValue] = useState("");
    const [selectedPrimaryHours, setSelectedPrimaryHours] = useState<any>("");
    const [selectedSecondaryHours, setSelectedSecondaryHours] = useState<any>("");
    const [selectedSecondaryHoursTemp, setSelectedSecondaryHoursTemp] = useState<any>("");


    const messageVal = CommonService.editMentionsFormat(appointmentSettingsRemainderDetails?.sms?.content, mentionsList);
    const emailSubVal = CommonService.editMentionsFormat(appointmentSettingsRemainderDetails?.email?.subject, mentionsList);
    const emailContentVal = CommonService.editMentionsFormat(appointmentSettingsRemainderDetails?.email?.content, mentionsList);
    const {
        primaryRemainderHoursList,
        secondaryRemainderHoursList
    } = useSelector((state: IRootReducerState) => state.staticData);

    useEffect(() => {
        setMessageValue(messageVal);
        setEmailValue(emailContentVal);
        setSubjectValue(emailSubVal);
        setSelectedPrimaryHours(primaryReminderBefore?.toString())
        setSelectedSecondaryHours(secondaryReminderBefore?.toString())
    }, [appointmentSettingsRemainderDetails, emailContentVal, emailSubVal, primaryReminderBefore, secondaryReminderBefore, messageVal]);

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
            primary_reminder_before: selectedPrimaryHours,
            secondary_reminder_before: selectedSecondaryHours
        }

        if (type === 'primary_reminder_before') {
            payload.primary_reminder_before = value
        } else {
            payload.secondary_reminder_before = value
        }
        onSubmit(payload)
    }, [selectedPrimaryHours, selectedSecondaryHours, emailValue, messageValue, subjectValue, mentionsList, onSubmit]);

    useEffect(() => {
        setSelectedSecondaryHoursTemp(selectedSecondaryHours);
    }, [selectedSecondaryHours]);

    return (
        <div className={'appointment-settings-remainder-component'}>

            <CardComponent title={"Appointment Reminder"} className={'appointment-reminder'}>
                <div className="t-form-controls">
                    <div className="ts-row reschedule-wrapper">
                        <div className="ts-col-md-12 ts-col-md-6 ts-col-lg-8">
                            <QuestionComponent title={"Primary Reminder Before"}
                                               description={"Select the number of hours prior to the appointment a client receives a Primary Appointment Reminder"}
                            ></QuestionComponent>
                        </div>
                        <div className={"ts-col-md-12 ts-col-md-6 ts-col-lg-1"}/>
                        <div className="ts-col-md-12 ts-col-md-6 ts-col-lg-3">

                            <SelectComponent
                                label={"Select hours"}
                                className={'t-form-control'}
                                options={primaryRemainderHoursList || []}
                                value={selectedPrimaryHours}
                                required={true}
                                fullWidth={true}
                                onUpdate={(value) => {
                                    setSelectedPrimaryHours(value)
                                    // onTemplateSubmit('primary_reminder_before', value);
                                }}
                            />
                        </div>
                    </div>
                    <div className="ts-row reschedule-wrapper">
                        <div className="ts-col-md-12 ts-col-md-6 ts-col-lg-8">
                            <QuestionComponent title={"Secondary Reminder Before"}
                                               description={"Select the number of hours prior to the appointment a client receives a Secondary Reminder."}
                            ></QuestionComponent>
                        </div>
                        <div className={"ts-col-md-12 ts-col-md-6 ts-col-lg-1"}/>
                        <div className="ts-col-md-12 ts-col-md-6 ts-col-lg-3">
                            <SelectComponent
                                label={"Select hours"}
                                required={true}
                                className={'t-form-control'}
                                options={secondaryRemainderHoursList || []}
                                value={selectedSecondaryHours}
                                fullWidth={true}
                                keyExtractor={(item) => item.title}
                                valueExtractor={(item) => item.code}
                                onUpdate={(value) => {
                                    setSelectedSecondaryHours(value)
                                    // onTemplateSubmit('secondary_reminder_before', value);
                                }}
                            />
                        </div>
                    </div>
                    <div className={'display-flex ts-justify-content-center mrg-bottom-25'}>
                        <ButtonComponent
                            disabled={!selectedSecondaryHours || !selectedPrimaryHours}
                            onClick={() => {
                                setSelectedSecondaryHours(selectedSecondaryHoursTemp);
                                onTemplateSubmit('secondary_reminder_before', selectedSecondaryHoursTemp);
                            }}
                        >
                            Save
                        </ButtonComponent>
                    </div>

                    <HorizontalLineComponent className={'mrg-top-15 mrg-bottom-15'}/>

                    {messageMode === 'view' &&
                        <>
                            <div className="d-flex ts-justify-content-between">
                                <QuestionComponent title={"Message (SMS):"}
                                                   description={"Create an SMS message that a client will receive as an appointment reminder."}
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
                                 dangerouslySetInnerHTML={{__html: CommonService.cleanMentionsResponse(appointmentSettingsRemainderDetails?.sms?.content, mentionsList)}}>

                            </div>
                        </>
                    }

                    {messageMode === 'edit' &&
                        <>
                            <div>
                                <div className={'d-flex'}>
                                    <FormControlLabelComponent label={"Message (SMS):"} className={'message-heading'}/>
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
                                                                the template box.
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
                                                                to navigate
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
                                    as an appointment reminder.
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
                                        mentionsList?.map((mention) => {
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
                                    disabled={messageValue?.length === 0 || messageValue === messageVal}
                                    onClick={onTemplateSubmit}
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
                                               description={"Create an Email message that a client will receive as an appointment reminder."}
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
                                     dangerouslySetInnerHTML={{__html: CommonService.cleanMentionsResponse(appointmentSettingsRemainderDetails?.email?.subject, mentionsList)}}>
                                </div>
                                <HorizontalLineComponent className={'divider'}/>
                            </div>

                            <div className="email-screen-body"
                                 dangerouslySetInnerHTML={{__html: CommonService.cleanMentionsResponse(appointmentSettingsRemainderDetails?.email?.content, mentionsList)}}>
                            </div>
                        </div>
                    </>
                    }


                    {emailMode === 'edit' &&
                        <>
                            <div>
                                <div className={'d-flex'}>
                                    <FormControlLabelComponent label={"Email:"} className={'message-heading'}/>
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
                                                                the template box.
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
                                                                to navigate
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
                                    client will receive as an appointment reminder.
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
                                    disabled={emailValue?.length === 0 || emailValue === emailContentVal}
                                    onClick={onTemplateSubmit}
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

export default AppointmentSettingsRemainderComponent;
