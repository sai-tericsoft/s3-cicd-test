import "./ClientAddComponent.scss";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import React, {useCallback, useEffect, useState} from "react";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {CommonService} from "../../../shared/services";
import {ImageConfig, Misc} from "../../../constants";
import {useNavigate} from "react-router-dom";
import * as Yup from "yup";
import FormikPhoneInputComponent
    from "../../../shared/components/form-controls/formik-phone-input/FormikPhoneInputComponent";
import {useDispatch} from "react-redux";
import {
    setClientBasicDetails,
    setClientMedicalDetails
} from "../../../store/actions/client.action";
import FormikCheckBoxComponent from "../../../shared/components/form-controls/formik-check-box/FormikCheckBoxComponent";
import FormikDatePickerComponent
    from "../../../shared/components/form-controls/formik-date-picker/FormikDatePickerComponent";
import moment from "moment";


interface ClientAddComponentProps {
    onAdd: () => void;
}

const clientAddInitialValues: any = {
    first_name: '',
    last_name: '',
    dob: '',
    primary_email: '',
    primary_contact_info: {
        phone: ''
    },
    send_invite: false,
    send_onboarded_email: true
}

const clientAddsValidationSchema = Yup.object({
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
    primary_email: Yup.string().email('Invalid email').required('Email Address is required'),
    primary_contact_info: Yup.object({
        phone: Yup.string()
            .required('Phone Number is required')
            .test('is-ten-digits', 'Phone number must contain exactly 10 digits', (value: any) => {
                return value?.length === 10
            }),
    }),
    send_onboarded_email: Yup.boolean().required('Onboarded is required'),
});


const ClientAddComponent = (props: ClientAddComponentProps) => {

    const {onAdd} = props;
    const navigate = useNavigate();
    const [addClientInitialValues] = useState<any>(clientAddInitialValues);
    const [isClientAddInProgress, setIsClientAddInProgress] = useState<boolean>(false);
    const dispatch = useDispatch();

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        try {
            const payload = {
                ...values,
                send_onboarded_email: (values?.send_onboarded_email ? false : true),
                dob: moment(values?.dob).format('YYYY-MM-DD')
            };
            setIsClientAddInProgress(true);
            CommonService._client.ClientBasicDetailsAddAPICall(payload)
                .then((response: any) => {
                    console.log('response', response);
                    setIsClientAddInProgress(false);
                    dispatch(setClientBasicDetails(response.data));
                    dispatch(setClientMedicalDetails(undefined));
                    // CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    navigate(CommonService._routeConfig.ClientAdd(response.data._id));
                }).catch((error: any) => {
                setIsClientAddInProgress(false);
                CommonService.handleErrors(setErrors, error, true);
            });
        } catch (error) {
            // Handle any synchronous errors here
            console.error("An error occurred:", error);
            // Optionally, notify the user or handle the error as needed
            setIsClientAddInProgress(false);
        }
    }, [navigate, dispatch]);


    const handleInviteLink = useCallback((values: any, setErrors: any) => {
        try {
            const payload = {
                ...values,
                send_invite: true,
                send_onboarded_email: false
            };
            CommonService.onConfirm({
                image: ImageConfig.PopupLottie,
                showLottie: true,
                confirmationTitle: 'SEND INVITE LINK',
                confirmationSubTitle: 'Are you sure you want to send invite link to:',//${values.first_name} ${values.last_name} having email ${values.primary_email}?`,
                confirmationDescription: <div className="transfer-file-to">
                    <div className={'mrg-bottom-15'}>
                        <span className={'client-case-name-title '}>Client:</span>
                        <span>{values.first_name} {values.last_name}</span>
                    </div>
                    <div>
                        <span className={'client-case-name-title'}>&nbsp;Email:</span>
                        <span>{values.primary_email}</span>
                    </div>
                </div>

            }).then(() => {
                CommonService._client.ClientBasicDetailsAddAPICall(payload)
                    .then((response: any) => {
                        CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                        onAdd();
                    }).catch((error: any) => {
                    setIsClientAddInProgress(false);
                    CommonService.handleErrors(setErrors, error, true);
                    CommonService._alert.showToast(error.error || "Error in sending link", "error");
                });
            });
        } catch (error) {
            // Handle any synchronous errors here
            console.error("An error occurred:", error);
            // Optionally, notify the user or handle the error as needed
        }
    }, [onAdd]);


    return (
        <div className={'client-add-component'}>
            <FormControlLabelComponent label={'Add Client'} size={'xl'}/>
            <Formik initialValues={addClientInitialValues}
                    validationSchema={clientAddsValidationSchema}
                    validateOnChange={false}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    validateOnMount={true}
                    onSubmit={onSubmit}>
                {({values, isValid, touched, setErrors, errors, setFieldValue, validateForm}) => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    useEffect(() => {
                        validateForm();
                    }, [validateForm, values]);
                    return (
                        <Form className={'t-form'} noValidate={true}>
                            <div className="t-form-controls">
                                <Field name={'first_name'}>
                                    {
                                        (field: FieldProps) => (
                                            <FormikInputComponent
                                                titleCase={true}
                                                label={'First Name'}
                                                placeholder={'E.g. John'}
                                                formikField={field}
                                                required={true}
                                                fullWidth={true}
                                            />
                                        )
                                    }
                                </Field>
                                <Field name={'last_name'}>
                                    {
                                        (field: FieldProps) => (
                                            <FormikInputComponent
                                                titleCase={true}
                                                label={'Last Name'}
                                                placeholder={'E.g. Doe'}
                                                formikField={field}
                                                required={true}
                                                fullWidth={true}
                                            />
                                        )
                                    }
                                </Field>
                                <Field name={'dob'}>
                                    {
                                        (field: FieldProps) => (
                                            <FormikDatePickerComponent
                                                label={'Date of Birth'}
                                                placeholder={'MM/DD/YYYY'}
                                                formikField={field}
                                                maxDate={moment()}
                                                required={true}
                                                fullWidth={true}
                                            />
                                        )
                                    }
                                </Field>
                                <Field name={'primary_email'}>
                                    {
                                        (field: FieldProps) => (
                                            <FormikInputComponent
                                                label={'Email Address'}
                                                placeholder={'example@email.com'}
                                                formikField={field}
                                                required={true}
                                                fullWidth={true}
                                            />
                                        )
                                    }
                                </Field>
                                <Field name={'primary_contact_info.phone'}>
                                    {
                                        (field: FieldProps) => (
                                            <FormikPhoneInputComponent
                                                label={'Phone Number'}
                                                formikField={field}
                                                required={true}
                                                fullWidth={true}
                                            />
                                        )
                                    }
                                </Field>

                                <Field name={'send_onboarded_email'}>
                                    {
                                        (field: FieldProps) => (
                                            <FormikCheckBoxComponent
                                                label={'Do not send an onboarding email to the respective client.'}
                                                formikField={field}
                                                required={false}
                                                labelPlacement={"end"}

                                            />
                                        )
                                    }
                                </Field>
                                <div className={'ts-row'}>
                                    <div className={'message-box-wrapper'}>
                                        <div className={'message-heading'}>
                                            Check the box based on client type:
                                        </div>
                                        <ul className={'list-text'}>
                                            <li>
                                                If client is new and will self sign up: Uncheck box, Click "Send
                                                Invite Link"
                                            </li>
                                        </ul>
                                        <ul>
                                            <li>
                                                If client exists already:
                                            </li>
                                        </ul>
                                        <ul className={'pdd-left-25'}>
                                            <li>
                                                Want notification: Uncheck box, Click "Proceed with Adding Client"
                                            </li>
                                            <li>
                                                Do NOT want notification: Check box, Click "Proceed with Adding
                                                Client"
                                            </li>
                                        </ul>
                                    </div>

                                </div>

                                {/*<>*/}
                                {/*    {*/}
                                {/*        (ENV.ENV_MODE === 'dev' || ENV.ENV_MODE === 'test') &&*/}
                                {/*        <div className={'note-wrapper'}>*/}
                                {/*            <div className={'note-content'}>*/}
                                {/*                Note : The invite link will be sent to the entered email address of the*/}
                                {/*                client.*/}
                                {/*            </div>*/}
                                {/*        </div>*/}
                                {/*    }*/}
                                {/*</>*/}
                            </div>
                            <div className={'t-form-actions'}>
                                <ButtonComponent
                                    variant={"outlined"}
                                    type={"submit"}
                                    isLoading={isClientAddInProgress}
                                    disabled={!isValid || isClientAddInProgress}
                                >
                                    Proceed with Adding Client
                                </ButtonComponent>
                                <ButtonComponent
                                    onClick={() => handleInviteLink(values, setErrors)}
                                    variant={"contained"}
                                    className={'adding-client-cta'}
                                    disabled={!isValid || values.send_onboarded_email}
                                >
                                    Send Invite Link
                                </ButtonComponent>


                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    );

};

export default ClientAddComponent;
