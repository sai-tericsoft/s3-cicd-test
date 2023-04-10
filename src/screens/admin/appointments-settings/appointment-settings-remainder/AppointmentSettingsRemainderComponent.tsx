import "./AppointmentSettingsRemainderComponent.scss";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import React, {useCallback, useEffect, useState} from "react";
import CardComponent from "../../../../shared/components/card/CardComponent";
import QuestionComponent from "../../../../shared/components/question/QuestionComponent";
import FormikSelectComponent from "../../../../shared/components/form-controls/formik-select/FormikSelectComponent";
import HorizontalLineComponent
    from "../../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import _ from "lodash";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";
import * as Yup from "yup";
import {ImageConfig} from "../../../../constants";


const AppointmentRemainderFormValidationSchema = Yup.object({
    primary_remainder_before: Yup.string(),
    secondary_remainder_before: Yup.string()
});


const AppointmentRemainderFormInitialValues = {
    primary_remainder_before: "",
    secondary_remainder_before: ""
}

interface AppointmentSettingsRemainderComponentProps {

}

const AppointmentSettingsRemainderComponent = (props: AppointmentSettingsRemainderComponentProps) => {
    const [systemSettingsFormInitialValues, setAppointmentRemainderFormInitialValues] = useState<any>(_.cloneDeep(AppointmentRemainderFormInitialValues));
    const {
        systemAutoLockDurationOptionList,
        filesUneditableAfterOptionList,
    } = useSelector((state: IRootReducerState) => state.staticData);
    const [isSaving, setIsSaving] = useState(false);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        setIsSaving(true);
        // CommonService._systemSettings.SaveAppointmentRemainderAPICall(values)
        //     .then((response: IAPIResponseType<IAppointmentRemainderConfig>) => {
        //         CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
        //         setIsSaving(false);
        //     })
        //     .catch((error: any) => {
        //         CommonService.handleErrors(setErrors, error);
        //         setIsSaving(false);
        //     });
    }, []);

    // useEffect(() => {
    //     if (systemSettings) {
    //         setAppointmentRemainderFormInitialValues({
    //             other_settings: {
    //                 auto_lock_minutes: systemSettings?.other_settings?.auto_lock_minutes,
    //                 uneditable_after_days: systemSettings?.other_settings?.uneditable_after_days
    //             }
    //         });
    //     }
    // }, [systemSettings]);

    return (
        <div className={'appointment-settings-remainder-component'}>
            <Formik
                validationSchema={AppointmentRemainderFormValidationSchema}
                initialValues={systemSettingsFormInitialValues}
                validateOnChange={false}
                validateOnBlur={true}
                enableReinitialize={true}
                validateOnMount={true}
                onSubmit={onSubmit}
            >
                {({values, validateForm}) => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    useEffect(() => {
                        validateForm();
                    }, [validateForm, values]);
                    return (
                        <Form className="t-form" noValidate={true}>
                            <CardComponent title={"Appointment Reminder"}>
                                <div className="t-form-controls">
                                    <div className="ts-row">
                                        <div className="ts-col-md-12 ts-col-md-6 ts-col-lg-6">
                                            <QuestionComponent title={"Primary Reminder Before"}
                                                               description={"Select the number of hours prior to the appointment a client receives a Primary Appointment Reminder"}
                                            ></QuestionComponent>
                                        </div>
                                        <div className={"ts-col-md-12 ts-col-md-6 ts-col-lg-2"}/>
                                        <div className="ts-col-md-12 ts-col-md-6 ts-col-lg-4">
                                            <Field name={'primary_remainder_before'} className="t-form-control">
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikSelectComponent
                                                            label={'Select hours'}
                                                            options={systemAutoLockDurationOptionList}
                                                            formikField={field}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                    </div>
                                    <div className="ts-row">
                                        <div className="ts-col-md-12 ts-col-md-6 ts-col-lg-6">
                                            <QuestionComponent title={"Secondary Reminder Before"}
                                                               description={"Select the number of hours prior to the appointment a client receives a Secondary Reminder."}
                                            ></QuestionComponent>
                                        </div>
                                        <div className={"ts-col-md-12 ts-col-md-6 ts-col-lg-2"}/>
                                        <div className="ts-col-md-12 ts-col-md-6 ts-col-lg-4">
                                            <Field name={'secondary_remainder_before'}
                                                   className="t-form-control">
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikSelectComponent
                                                            label={'Select hours'}
                                                            options={filesUneditableAfterOptionList}
                                                            formikField={field}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                    </div>
                                    <HorizontalLineComponent/>
                                    <div className="d-flex ts-justify-content-between">
                                        <QuestionComponent title={"Message (SMS)"}
                                                           description={"Message template for sending appointment confirmations."}
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
                                    <div className="message-section">
                                        Dear John Richardson,
                                        <div className="message-screen__body__row">
                                            This is a reminder that you have an upcoming appointment with Terrill Lobo
                                            on
                                            04-April-2023 at 09:00 AM at Kinergy Sports Medicine and Performance. We
                                            value
                                            your time and are committed to providing you with exceptional service.
                                        </div>
                                        <div className="message-screen__body__row">
                                            Please note that if you need to reschedule or cancel your appointment, we
                                            require at least 24 hours notice in advance. If you have any specific
                                            concerns
                                            or requirements that need to be addressed prior to your appointment, please
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
                                    isLoading={isSaving}
                                    type={"submit"}
                                    id={"save_btn"}
                                >
                                    {isSaving ? "Saving" : "Save"}
                                </ButtonComponent>
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    );

};

export default AppointmentSettingsRemainderComponent;