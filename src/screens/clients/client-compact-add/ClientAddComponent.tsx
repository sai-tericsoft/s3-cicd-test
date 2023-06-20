import "./ClientAddComponent.scss";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import React, {useCallback, useEffect, useState} from "react";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {CommonService} from "../../../shared/services";
import {ENV, ImageConfig, Misc} from "../../../constants";
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


interface ClientAddComponentProps {
    onAdd: () => void;
}

const clientAddInitialValues: any = {
    first_name: '',
    last_name: '',
    primary_email: '',
    primary_contact_info: {
        phone: ''
    },
    send_invite: false,
    is_onboarded: false
}

const clientAddsValidationSchema = Yup.object({
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
    primary_email: Yup.string().email('Invalid email').required('Email Address is required'),
    primary_contact_info: Yup.object({
        phone: Yup.string().required('Phone Number is required'),
    }),
    is_onboarded: Yup.boolean().required('Onboarded is required'),
});

const ClientAddComponent = (props: ClientAddComponentProps) => {

    const {onAdd} = props;
    const navigate = useNavigate();
    const [addClientInitialValues] = useState<any>(clientAddInitialValues);
    const [isClientAddInProgress, setIsClientAddInProgress] = useState<boolean>(false);
    const dispatch = useDispatch();

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        const payload = {...values};
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

    }, [navigate, dispatch]);

    const handleInviteLink = useCallback((values: any, setErrors: any) => {
        const payload = {
            ...values,
            send_invite: true
        };
        CommonService.onConfirm({
            image: ImageConfig.DeleteAttachmentConfirmationIcon,
            confirmationTitle: 'SEND INVITE LINK',
            confirmationSubTitle: `Are you sure you want to send invite link to 
            ${values.first_name} ${values.last_name} having email ${values.primary_email}?`,
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
        })
    }, [onAdd]);

    return (
        <div className={'client-add-component'}>
            <FormControlLabelComponent label={'Add Client'} size={'lg'}/>
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

                                <Field name={'is_onboarded'}>
                                    {
                                        (field: FieldProps) => (
                                            <FormikCheckBoxComponent
                                                label={'Send an onboarding notification to the provided email address.'}
                                                formikField={field}
                                                required={false}
                                                labelPlacement={"end"}
                                            />
                                        )
                                    }
                                </Field>

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
                                </ButtonComponent>&nbsp;
                                {
                                    <>
                                        {(ENV.ENV_MODE === 'dev' || ENV.ENV_MODE === 'test') && <ButtonComponent
                                            onClick={() => handleInviteLink(values, setErrors)}
                                            variant={"contained"}
                                            className={'adding-client-cta'}
                                            disabled={!isValid || values.is_onboarded}
                                        >
                                            Send Invite Link
                                        </ButtonComponent>}

                                    </>
                                }

                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    );

};

export default ClientAddComponent;
