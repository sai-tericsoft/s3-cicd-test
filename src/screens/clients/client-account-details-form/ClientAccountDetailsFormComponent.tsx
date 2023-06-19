import "./ClientAccountDetailsFormComponent.scss";
import React, {useCallback, useEffect, useState} from "react";
import _ from "lodash";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {Misc} from "../../../constants";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import FormikSelectComponent from "../../../shared/components/form-controls/formik-select/FormikSelectComponent";
import HorizontalLineComponent
    from "../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import QuestionComponent from "../../../shared/components/question/QuestionComponent";
import {IClientAccountDetails} from "../../../shared/models/client.model";
import {getClientAccountDetails} from "../../../store/actions/client.action";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import {useNavigate} from "react-router-dom";
import FormikPhoneInputComponent
    from "../../../shared/components/form-controls/formik-phone-input/FormikPhoneInputComponent";
import * as Yup from "yup";

interface ClientAccountDetailsFormComponentProps {
    clientId: string;
    mode: "add" | "edit";
    onCancel: () => void;
    onSave: (clientAccountDetailsFormDetails: any) => void;
}

const ClientAccountDetailsFormInitialValues: IClientAccountDetails = {
    communication_preferences: {
        appointment_reminders: "",
        appointment_confirmations: ""
    },
    referral_details: {
        source: "",
        source_info_name: "",
        source_info_phone: "",
        source_info_email: "",
        source_info_relationship: "",
    }
};

const ClientAccountDetailsValidationSchema = Yup.object({
    referral_details: Yup.object({
        source_info_name: Yup.string().when('source', {
            is: 'friends_family_colleague',
            then: Yup.string().required('Full Name is required'),
            otherwise: Yup.string()
        }),
        source_info_phone: Yup.string().when('source', {
            is: 'friends_family_colleague',
            then: Yup.string().required('Phone Number is required'),
            otherwise: Yup.string()
        }),
        source_info_email: Yup.string().when('source', {
            is: 'friends_family_colleague',
            then: Yup.string().email('Invalid email').required('Email is required'),
            otherwise: Yup.string().email('Invalid email')
        })
    }),
});


const ClientAccountDetailsFormComponent = (props: ClientAccountDetailsFormComponentProps) => {

    const {mode, clientId, onSave} = props;
    const [clientAccountDetailsFormInitialValues, setClientAccountDetailsFormInitialValues] = useState<IClientAccountDetails>(_.cloneDeep(ClientAccountDetailsFormInitialValues));
    const [isClientAccountDetailsFormSavingInProgress, setIsClientAccountDetailsFormSavingInProgress] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        communicationModeTypeList,
        referralTypeList,
        relationshipList,
        socialMediaPlatformList
    } = useSelector((state: IRootReducerState) => state.staticData);

    const {
        clientAccountDetails,
        isClientAccountDetailsLoading,
        isClientAccountDetailsLoaded,
        isClientAccountDetailsLoadingFailed
    } = useSelector((state: IRootReducerState) => state.client);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        const payload = CommonService.removeKeysFromJSON(_.cloneDeep(values), ['source_details', 'appointment_confirmations_details', 'appointment_reminders_details']);
        setIsClientAccountDetailsFormSavingInProgress(true);
        let apiCall;
        if (mode === "add") {
            apiCall = CommonService._client.ClientAccountDetailsAddAPICall(clientId, payload);
        } else {
            apiCall = CommonService._client.ClientAccountDetailsEditAPICall(clientId, payload);
        }
        apiCall.then((response: IAPIResponseType<IClientAccountDetails>) => {
            CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
            setIsClientAccountDetailsFormSavingInProgress(false);
            onSave(response.data);
            if (mode === 'add') {
                navigate(CommonService._routeConfig.ClientList());
            }
        }).catch((error: any) => {
            CommonService.handleErrors(setErrors, error);
            setIsClientAccountDetailsFormSavingInProgress(false);
        })
    }, [clientId, onSave, mode, navigate]);

    useEffect(() => {
        if (mode === "edit") {
            if (clientAccountDetails) {
                setClientAccountDetailsFormInitialValues(clientAccountDetails);
            } else {
                if (clientId) {
                    dispatch(getClientAccountDetails(clientId));
                }
            }
        }
    }, [mode, clientId, dispatch, clientAccountDetails]);

    return (
        <div className={'client-medical-provider-information-form-component'}>
            <FormControlLabelComponent className={'add-communication-referral-heading'}
                                       label={CommonService.capitalizeFirstLetter(mode) + " Communication and Referral Details"}/>
            <>
                {
                    mode === "edit" && <>
                        {
                            isClientAccountDetailsLoading && <div>
                                <LoaderComponent/>
                            </div>
                        }
                        {
                            isClientAccountDetailsLoadingFailed &&
                            <StatusCardComponent title={"Failed to fetch account Details"}/>
                        }
                    </>
                }
            </>
            {
                ((mode === "edit" && isClientAccountDetailsLoaded && clientAccountDetails) || mode === "add") && <>
                    <CardComponent title={"Communication and Referral Details"}>
                        <Formik
                            initialValues={clientAccountDetailsFormInitialValues}
                            validationSchema={ClientAccountDetailsValidationSchema}
                            onSubmit={onSubmit}
                            validateOnChange={false}
                            validateOnBlur={true}
                            enableReinitialize={true}
                            validateOnMount={true}>
                            {({values, errors, isValid, setFieldValue, validateForm}) => {
                                // eslint-disable-next-line react-hooks/rules-of-hooks
                                useEffect(() => {
                                    validateForm();
                                }, [validateForm, values]);
                                return (
                                    <Form noValidate={true} className={"t-form"}>
                                        <FormControlLabelComponent label={"Communication Preferences"}/>
                                        <div className="ts-row">
                                            <div className="ts-col-md-8">
                                                <QuestionComponent title={"Appointment Reminders"}
                                                                   description={"How would you like to receive appointment reminders?"}/>
                                            </div>
                                            <div className="ts-col-md-4">
                                                <Field name={`communication_preferences.appointment_reminders`}>
                                                    {
                                                        (field: FieldProps) => (
                                                            <FormikSelectComponent
                                                                options={communicationModeTypeList}
                                                                label={"Select"}
                                                                formikField={field}
                                                                fullWidth={true}
                                                            />
                                                        )
                                                    }
                                                </Field>
                                            </div>
                                        </div>
                                        <div className="ts-row">
                                            <div className="ts-col-md-8">
                                                <QuestionComponent title={"Appointment Confirmations"}
                                                                   description={"How would you like to receive appointment confirmations?"}/>
                                            </div>
                                            <div className="ts-col-md-4">
                                                <Field name={`communication_preferences.appointment_confirmations`}>
                                                    {
                                                        (field: FieldProps) => (
                                                            <FormikSelectComponent
                                                                options={communicationModeTypeList}
                                                                label={"Select"}
                                                                formikField={field}
                                                                fullWidth={true}
                                                            />
                                                        )
                                                    }
                                                </Field>
                                            </div>
                                        </div>
                                        <HorizontalLineComponent/>
                                        <FormControlLabelComponent label={"Referral Details"}/>
                                        <div className="ts-row">
                                            <div className="ts-col-md-8">
                                                <QuestionComponent title={"How did you find us?"}
                                                                   description={"Please choose an option that best describes how you heard about us."}/>
                                            </div>
                                            <div className="ts-col-md-4">
                                                <Field name={`referral_details.source`}>
                                                    {
                                                        (field: FieldProps) => (
                                                            <FormikSelectComponent
                                                                options={referralTypeList}
                                                                label={"Select"}
                                                                formikField={field}
                                                                fullWidth={true}
                                                                onUpdate={() => {
                                                                    setFieldValue('referral_details.source_info_name', '');
                                                                    setFieldValue('referral_details.source_info_phone', '');
                                                                    setFieldValue('referral_details.source_info_email', '');
                                                                    setFieldValue('referral_details.source_info_relationship', '');
                                                                }}
                                                            />
                                                        )
                                                    }
                                                </Field>
                                            </div>
                                        </div>
                                        {
                                            values.referral_details.source === "friends_family_colleague" && <>
                                                <QuestionComponent title={"Please complete the following:"}/>
                                                <div className="ts-row">
                                                    <div className="ts-col-md-4">
                                                        <Field name={`referral_details.source_info_name`}>
                                                            {
                                                                (field: FieldProps) => (
                                                                    <FormikInputComponent
                                                                        label={"Full Name"}
                                                                        placeholder={"E.g. John Doe"}
                                                                        required={true}
                                                                        formikField={field}
                                                                        fullWidth={true}
                                                                    />
                                                                )
                                                            }
                                                        </Field>
                                                    </div>
                                                    <div className="ts-col-md-4">
                                                        <Field name={`referral_details.source_info_phone`}>
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
                                                    </div>
                                                </div>
                                                <div className="ts-row">
                                                    <div className="ts-col-md-4">
                                                        <Field name={`referral_details.source_info_email`}>
                                                            {
                                                                (field: FieldProps) => (
                                                                    <FormikInputComponent
                                                                        label={'Email Address'}
                                                                        placeholder={'example@email.com'}
                                                                        formikField={field}
                                                                        fullWidth={true}
                                                                    />
                                                                )
                                                            }
                                                        </Field>
                                                    </div>
                                                    <div className="ts-col-md-4">
                                                        <Field name={`referral_details.source_info_relationship`}>
                                                            {
                                                                (field: FieldProps) => (
                                                                    <FormikSelectComponent
                                                                        options={relationshipList}
                                                                        label={"Relationship"}
                                                                        formikField={field}
                                                                        fullWidth={true}
                                                                    />
                                                                )
                                                            }
                                                        </Field>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                        {
                                            values.referral_details.source === "social_media" && <>
                                                <QuestionComponent title={"Please select an option:"}/>
                                                <div className="ts-row">
                                                    <div className="ts-col-md-4">
                                                        <Field name={`referral_details.source_info_name`}>
                                                            {
                                                                (field: FieldProps) => (
                                                                    <FormikSelectComponent
                                                                        options={socialMediaPlatformList}
                                                                        label={"Select Platform"}
                                                                        formikField={field}
                                                                        fullWidth={true}
                                                                    />
                                                                )
                                                            }
                                                        </Field>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                        {
                                            values.referral_details.source === "other" && <>
                                                <QuestionComponent title={"Please explain"}/>
                                                <div className="ts-row">
                                                    <div className="ts-col-md-4">
                                                        <Field name={`referral_details.source_info_name`}>
                                                            {
                                                                (field: FieldProps) => (
                                                                    <FormikInputComponent
                                                                        label={"Other info"}
                                                                        formikField={field}
                                                                        fullWidth={true}
                                                                    />
                                                                )
                                                            }
                                                        </Field>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                        <div className="t-form-actions">
                                            <ButtonComponent
                                                id={"save_next_btn"}
                                                isLoading={isClientAccountDetailsFormSavingInProgress}
                                                size={'large'}
                                                className={'submit-cta'}
                                                disabled={isClientAccountDetailsFormSavingInProgress || !isValid}
                                                type={"submit"}
                                            >
                                                {isClientAccountDetailsFormSavingInProgress ? "Saving" : "Save"}
                                            </ButtonComponent>
                                        </div>
                                    </Form>
                                )
                            }}
                        </Formik>
                    </CardComponent>
                </>
            }
        </div>
    );

};

export default ClientAccountDetailsFormComponent;
