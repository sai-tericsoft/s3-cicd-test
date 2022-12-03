import "./ClientAccountDetailsFormComponent.scss";
import * as Yup from "yup";
import {IClientAccountDetailsForm} from "../../../shared/models/client.model";
import {useCallback, useEffect, useState} from "react";
import _ from "lodash";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {Misc} from "../../../constants";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import FormikSelectComponent from "../../../shared/components/form-controls/formik-select/FormikSelectComponent";
import HorizontalLineComponent
    from "../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import QuestionComponent from "../../../shared/components/question/QuestionComponent";

interface ClientAccountDetailsFormComponentProps {
    clientId: string;
    mode: "add" | "edit";
    onSave: (clientAccountDetailsFormDetails: any) => void;
}

const ClientAccountDetailsFormValidationSchema = Yup.object({
    communication_preferences: Yup.object({
        appointment_reminders: Yup.string().required('Appointment Reminders is required'),
        appointment_confirmations: Yup.string().required('Appointment Confirmation is required'),
    }),
    referral_details: Yup.object({
        source: Yup.string().required('Source is required'),
        source_info_name: Yup.string().when("source", {
            is: 'friends_family_colleague',
            then: Yup.string().required("Full name is required")
        }).when("source", {
            is: 'social_media',
            then: Yup.string().required("Social media type is required")
        }).when("source", {
            is: 'other',
            then: Yup.string().required("Data is required")
        }),
        source_info_phone: Yup.string().when("source", {
            is: 'friends_family_colleague',
            then: Yup.string().required('Phone is required')
        }),
        source_info_email: Yup.string().when("source", {
            is: 'friends_family_colleague',
            then: Yup.string().required('Email is required')
        }),
        source_info_relationship: Yup.string().when("source", {
            is: 'friends_family_colleague',
            then: Yup.string().required('Relationship is required')
        })
    }),
});

const ClientAccountDetailsFormInitialValues: IClientAccountDetailsForm = {
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

const ClientAccountDetailsFormComponent = (props: ClientAccountDetailsFormComponentProps) => {

    const {mode, clientId, onSave} = props;
    const [clientAccountDetailsFormInitialValues] = useState<IClientAccountDetailsForm>(_.cloneDeep(ClientAccountDetailsFormInitialValues));
    const [isClientAccountDetailsFormSavingInProgress, setIsClientAccountDetailsFormSavingInProgress] = useState(false);
    const {
        communicationModeTypeList,
        referralTypeList,
        relationshipList,
        socialMediaPlatformList
    } = useSelector((state: IRootReducerState) => state.staticData);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        setIsClientAccountDetailsFormSavingInProgress(true);
        console.log('mode', mode); // TODO make api call based on mode
        CommonService._client.ClientAccountDetailsAddAPICall(clientId, values)
            .then((response: IAPIResponseType<IClientAccountDetailsForm>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsClientAccountDetailsFormSavingInProgress(false);
                onSave(response);
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error);
                setIsClientAccountDetailsFormSavingInProgress(false);
            })
    }, [clientId, onSave, mode]);

    return (
        <div className={'client-medical-provider-information-form-component'}>
            <FormControlLabelComponent label={"Add Communication and Referral Details"}/>
            <CardComponent title={"Communication and Referral Details"}>
                <Formik
                    validationSchema={ClientAccountDetailsFormValidationSchema}
                    initialValues={clientAccountDetailsFormInitialValues}
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
                                                           description={"How would you like to receive appointment reminders"}/>
                                    </div>
                                    <div className="ts-col-md-4">
                                        <Field name={`communication_preferences.appointment_reminders`}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikSelectComponent
                                                        options={communicationModeTypeList}
                                                        label={"Select"}
                                                        required={true}
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
                                                           description={"How would you like to receive appointment confirmations"}/>
                                    </div>
                                    <div className="ts-col-md-4">
                                        <Field name={`communication_preferences.appointment_confirmations`}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikSelectComponent
                                                        options={communicationModeTypeList}
                                                        label={"Select"}
                                                        required={true}
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
                                                        required={true}
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
                                                            <FormikInputComponent
                                                                label={"Phone Number"}
                                                                required={true}
                                                                formikField={field}
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
                                                                label={"Email"}
                                                                type={"email"}
                                                                required={true}
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
                                                                label={"Select"}
                                                                required={true}
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
                                                                label={"Select"}
                                                                required={true}
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
                                                                required={true}
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
                                    <LinkComponent route={CommonService._routeConfig.ClientList()}>
                                        <ButtonComponent
                                            variant={"outlined"}
                                            disabled={isClientAccountDetailsFormSavingInProgress}
                                        >
                                            Cancel
                                        </ButtonComponent>
                                    </LinkComponent>&nbsp;
                                    <ButtonComponent
                                        isLoading={isClientAccountDetailsFormSavingInProgress}
                                        disabled={isClientAccountDetailsFormSavingInProgress || !isValid}
                                        type={"submit"}
                                    >
                                        {isClientAccountDetailsFormSavingInProgress ? "Saving" : "Save & Next"}
                                    </ButtonComponent>
                                </div>
                            </Form>
                        )
                    }}
                </Formik>
            </CardComponent>
        </div>
    );

};

export default ClientAccountDetailsFormComponent;