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
import FormControlLabelComponent from "../../../../shared/components/form-control-label/FormControlLabelComponent";

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
    const [selectedTimesTemp, setSelectedTimesTemp] = useState("");
    const [selectedTimes, setSelectedTimes] = useState<any>("");


    useEffect(() => {
        setMessageValue(messageVal);
        setSelectedHours(allowReschedulingBefore?.toString())
        setSelectedTimes(maxRescheduling?.toString());
        setEmailValue(emailContentVal);
        setSubjectValue(emailSubVal);
    }, [appointmentSettingsReschedulingDetails, allowReschedulingBefore, emailContentVal, emailSubVal, maxRescheduling, messageVal]);

    useEffect(() => {
        setSelectedTimesTemp(selectedTimes);
    }, [selectedTimes]);

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
                    <div className="ts-row reschedule-wrapper">
                        <div className="ts-col-md-12 ts-col-md-6 ts-col-lg-8">
                            <QuestionComponent title={"Rescheduling Appointment"}
                                               description={"Rescheduling an appointment cannot be done within ‘x’ hours of the appointment"}
                            ></QuestionComponent>
                        </div>
                        <div className={"ts-col-md-12 ts-col-md-6 ts-col-lg-1"}/>
                        <div className="ts-col-md-12 ts-col-md-6 ts-col-lg-3">
                            <SelectComponent
                                label={"Select hours"}
                                className={'t-form-control'}
                                required={true}
                                options={reschedulingHoursList || []}
                                value={selectedHours}
                                fullWidth={true}
                                onUpdate={(value) => {
                                    console.log(value);
                                    setSelectedHours(value);
                                    // onTemplateSubmit('allow_rescheduling_before', value);
                                }}
                            />
                        </div>
                    </div>
                    <div className="ts-row reschedule-wrapper">
                        <div className="ts-col-md-12 ts-col-md-6 ts-col-lg-8">
                            <QuestionComponent title={"How many times an appointment can be rescheduled ?"}
                                               description={"Appointment cannot be rescheduled more than the defined amount of times"}
                            ></QuestionComponent>
                        </div>
                        <div className={"ts-col-md-12 ts-col-md-6 ts-col-lg-1"}/>
                        <div className="ts-col-md-12 ts-col-md-6 ts-col-lg-3">
                            <SelectComponent
                                label="Select Option"
                                className="t-form-control"
                                options={reschedulingTimesList || []}
                                value={selectedTimesTemp}
                                required={true}
                                fullWidth={true}
                                onUpdate={(value: any) => {
                                    setSelectedTimesTemp(value);
                                }}
                            />
                        </div>
                    </div>
                    <div className={'display-flex ts-justify-content-center mrg-bottom-25'}>
                        <ButtonComponent
                            disabled={!selectedTimesTemp || !selectedHours}
                            onClick={() => {
                                setSelectedTimes(selectedTimesTemp);
                                onTemplateSubmit('max_rescheduling', selectedTimesTemp);
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
                                                   description={"Create an SMS message that a client will receive when an appointment is rescheduled."}
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
                                 dangerouslySetInnerHTML={{__html: CommonService.cleanMentionsResponse(appointmentSettingsReschedulingDetails?.sms?.content, mentionsList)}}>

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
                                                                template
                                                                box.
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    <div className="tooltip-text-row-wrapper">
                                                        {/*<div className="tooltip-text-pointer">*</div>*/}
                                                        <ul>
                                                            <li className="tooltip-text">To access the list of
                                                                pre-defined
                                                                keywords,
                                                                type "@" in the text box. A
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
                                    when an appointment is rescheduled.
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
                                               description={"Create an Email message that a client will receive when an appointment is rescheduled."}
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
                                     dangerouslySetInnerHTML={{__html: CommonService.cleanMentionsResponse(appointmentSettingsReschedulingDetails?.email?.subject, mentionsList)}}>
                                </div>
                                <HorizontalLineComponent className={'divider'}/>
                            </div>

                            <div className="email-screen-body"
                                 dangerouslySetInnerHTML={{__html: CommonService.cleanMentionsResponse(appointmentSettingsReschedulingDetails?.email?.content, mentionsList)}}>
                            </div>
                        </div>
                    </>
                    }


                    {emailMode === 'edit' &&
                        <>
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
                                                                template
                                                                box.
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    <div className="tooltip-text-row-wrapper">
                                                        {/*<div className="tooltip-text-pointer">*</div>*/}
                                                        <ul>
                                                            <li className="tooltip-text">To access the list of
                                                                pre-defined
                                                                keywords,
                                                                type "@" in the text box. A
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
                                    client will receive when an appointment is rescheduled.
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
    );

};

export default AppointmentSettingsRescheduleComponent;