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
import {IAPIResponseType} from "../../../shared/models/api.model";
import {IClientBasicDetails} from "../../../shared/models/client.model";

interface ClientAddComponentProps {

}

const clientAddInitialValues: any = {
    first_name: '',
    last_name: '',
    primary_email: '',
    primary_contact_info:{
        phone:''
    },
}

const clientAddsValidationSchema = Yup.object({
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
    primary_email: Yup.string().email('Invalid email').required('Email Address is required'),
    primary_contact_info: Yup.object({
      phone: Yup.string().required('Phone Number is required'),
    }),
});

const ClientAddComponent = (props: ClientAddComponentProps) => {

    const navigate=useNavigate();
    const [addClientInitialValues] = useState<any>(clientAddInitialValues);
    const [isClientAddInProgress, setIsClientAddInProgress] = useState<boolean>(false);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        console.log('values',values);
        const payload = {...values};
        setIsClientAddInProgress(true);
        CommonService._client.ClientBasicDetailsAddAPICall(payload)
            .then((response: any) => {
                console.log('response',response);
                setIsClientAddInProgress(false);
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                navigate(CommonService._routeConfig.ClientAdd(response.data._id));
            }).catch((error: any) => {
            setIsClientAddInProgress(false);
            CommonService.handleErrors(setErrors, error, true);
        });

    }, []);

    const handleInviteLink = useCallback(() => {
        CommonService.onConfirm({
            image: ImageConfig.DeleteAttachmentConfirmationIcon,
            confirmationTitle: 'SEND INVITE LINK',
            confirmationSubTitle: `Are you sure you want to send invite link to ${addClientInitialValues.first_name}?`,
        })
    }, []);

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
                {({values, touched, errors, setFieldValue, validateForm}) => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    useEffect(() => {
                        validateForm();
                    }, [validateForm, values]);
                    return (
                        <Form className={'t-form'} noValidate={true}>
                            <Field name={'first_name'}>
                                {
                                    (field: FieldProps) => (
                                        <FormikInputComponent
                                            titleCase={true}
                                            label={'First Name'}
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
                                            titleCase={true}
                                            label={'Email Address'}
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
                                        <FormikInputComponent
                                            titleCase={true}
                                            label={'Phone Number'}
                                            formikField={field}
                                            required={true}
                                            fullWidth={true}
                                        />
                                    )
                                }
                            </Field>
                            <div className={'note-wrapper'}>
                                <div className={'note-heading'}>Note :</div>
                                <div className={'note-content'}>
                                    The invite link will be sent to the entered email address of the client.
                                </div>
                            </div>
                            <div className={'t-form-actions'}>
                                <ButtonComponent onClick={handleInviteLink}
                                                 variant={"outlined"}
                                >
                                    Send Invite Link
                                </ButtonComponent>
                                &nbsp;
                                <ButtonComponent
                                    type={"submit"}
                                    isLoading={isClientAddInProgress}
                                    disabled={isClientAddInProgress}
                                    >
                                    Proceed with Adding Client
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