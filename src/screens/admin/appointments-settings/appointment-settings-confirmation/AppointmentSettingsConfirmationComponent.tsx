import "./AppointmentSettingsConfirmationComponent.scss";
import {Form, Formik} from "formik";
import React, {useEffect, useState} from "react";
import CardComponent from "../../../../shared/components/card/CardComponent";
import QuestionComponent from "../../../../shared/components/question/QuestionComponent";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../../constants";
import HorizontalLineComponent
    from "../../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";

interface AppointmentSettingsConfirmationComponentProps {

}

const AppointmentSettingsConfirmationComponent = (props: AppointmentSettingsConfirmationComponentProps) => {
    const [messageMode, setMessageMode] = useState<'edit' | 'view'>('view');
    const [emailMode, setEmailMode] = useState<'edit' | 'view'>('view');

    return (
        <div className={'appointment-settings-remainder-component'}>
            <Formik
                initialValues={{}}
                validateOnChange={false}
                validateOnBlur={true}
                enableReinitialize={true}
                validateOnMount={true}
                onSubmit={() => {
                    console.log('submit');
                }}
            >
                {({values, validateForm}) => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    useEffect(() => {
                        validateForm();
                    }, [validateForm, values]);
                    return (
                        <Form className="t-form" noValidate={true}>
                            <CardComponent title={"Appointment Confirmation"}>
                                <div className="t-form-controls">
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
                                        <div className="message-section">
                                            Dear John Richardson,
                                            <div className="message-screen__body__row">
                                                This is a reminder that you have an upcoming appointment with Terrill
                                                Lobo
                                                on
                                                04-April-2023 at 09:00 AM at Kinergy Sports Medicine and Performance. We
                                                value
                                                your time and are committed to providing you with exceptional service.
                                            </div>
                                            <div className="message-screen__body__row">
                                                Please note that if you need to reschedule or cancel your appointment,
                                                we
                                                require at least 24 hours notice in advance. If you have any specific
                                                concerns
                                                or requirements that need to be addressed prior to your appointment,
                                                please
                                                do
                                                not hesitate to contact us.
                                            </div>

                                            <div className="message-screen__body__row">
                                                Thank you for choosing Kinergy. We look forward to seeing you soon.
                                            </div>
                                            <div className="message-screen__body__row">
                                                <div>Best regards,</div>
                                                <div>Kinergy Sports Medicine and Performance</div>

                                            </div>
                                        </div>
                                    </>
                                    }

                                    {messageMode === 'edit' &&
                                    <>
                                        <div className="d-flex ts-justify-content-between">
                                            <QuestionComponent title={"Message (SMS)"}
                                                               description={"Message template for sending appointment confirmations."}
                                            ></QuestionComponent>
                                            <div>
                                                <ButtonComponent prefixIcon={<ImageConfig.EyeIcon/>}
                                                                 onClick={() => {
                                                                     console.log('edit')
                                                                 }}>
                                                    Preview
                                                </ButtonComponent>
                                            </div>
                                        </div>
                                        <div className="message-section">
                                            Edit card
                                        </div>
                                    </>
                                    }

                                    <HorizontalLineComponent/>
                                    <div className="d-flex ts-justify-content-between">
                                        <QuestionComponent title={"Email"}
                                                           description={"Email template for sending appointment confirmations."}
                                        ></QuestionComponent>
                                        <div>
                                            <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>}
                                                             onClick={() => {
                                                                 console.log('edit')
                                                             }}>
                                                Edit
                                            </ButtonComponent>
                                        </div>
                                    </div>
                                    <div className="email-section">
                                        <div className="email-header-section">
                                            <div className="email-screen__header__row">From: Kinergy Sports Medicine
                                                and Performance
                                            </div>
                                            <hr className="hr-line"/>
                                            <div className="email-screen__header__row">To: john@gmail.com</div>
                                            <hr className="hr-line"/>
                                            <div className="email-screen__header__row">Subject: Appointment
                                                Confirmation for John Richardson
                                            </div>
                                            <hr className="hr-line"/>
                                        </div>

                                        <div className="email-screen-body">
                                            <div className="email-screen__body__row">Dear John Richardson,</div>
                                            <div className="email-screen__body__row">
                                                This is a reminder that you have an upcoming appointment with Terrill
                                                Lobo
                                                on
                                                04-April-2023 at 09:00 AM at Kinergy Sports Medicine and Performance. We
                                                value
                                                your time and are committed to providing you with exceptional service.
                                            </div>
                                            <div className="email-screen__body__row">
                                                Please note that if you need to reschedule or cancel your appointment,
                                                we
                                                require at least 24 hours notice in advance. If you have any specific
                                                concerns
                                                or requirements that need to be addressed prior to your appointment,
                                                please
                                                do
                                                not hesitate to contact us.
                                            </div>

                                            <div className="email-screen__body__row">
                                                Thank you for choosing Kinergy. We look forward to seeing you soon.
                                            </div>
                                            <div className="email-screen__body__row">
                                                <div>Best regards,</div>
                                                <div>Kinergy Sports Medicine and Performance</div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardComponent>
                            <div className="t-form-actions">
                                <ButtonComponent
                                    type={"submit"}
                                    id={"save_btn"}
                                >
                                    Save
                                </ButtonComponent>
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    );

};

export default AppointmentSettingsConfirmationComponent;