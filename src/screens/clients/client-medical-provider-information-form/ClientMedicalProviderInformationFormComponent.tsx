import "./ClientMedicalProviderInformationFormComponent.scss";
import * as Yup from "yup";
import {IClientMedicalProviderForm} from "../../../shared/models/client.model";
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
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import FormikDatePickerComponent
    from "../../../shared/components/form-controls/formik-date-picker/FormikDatePickerComponent";

interface ClientMedicalProviderInformationFormComponentProps {
    clientId: string;
    mode: "add" | "edit";
    onSave: (clientMedicalProviderInformationDetails: any) => void;
}


const ClientMedicalProviderInformationValidationSchema = Yup.object({
    medical_provider_info: Yup.object({
        name: Yup.string().required('Name is required'),
        primary_phone: Yup.string().required('Primary Phone is required'),
        last_examination_date: Yup.string().required('Last Examination Date is required'),
    }),
});

const ClientMedicalProviderInformationInitialValues: IClientMedicalProviderForm = {
    medical_provider_info: {
        name: "",
        primary_phone: "",
        last_examination_date: "",
    }
};

const ClientMedicalProviderInformationFormComponent = (props: ClientMedicalProviderInformationFormComponentProps) => {

    const {mode, clientId, onSave} = props;
    const [clientMedicalProviderInformationInitialValues] = useState<IClientMedicalProviderForm>(_.cloneDeep(ClientMedicalProviderInformationInitialValues));
    const [isClientMedicalProviderInformationSavingInProgress, setIsClientMedicalProviderInformationSavingInProgress] = useState(false);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        const payload = {...values};
        payload.medical_provider_info.last_examination_date = CommonService.convertDateFormat(payload.medical_provider_info.last_examination_date);
        setIsClientMedicalProviderInformationSavingInProgress(true);
        console.log('mode', mode); // TODO make api call based on mode
        CommonService._client.ClientMedicalProviderInformationAddAPICall(clientId, payload)
            .then((response: IAPIResponseType<IClientMedicalProviderForm>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsClientMedicalProviderInformationSavingInProgress(false);
                onSave(response);
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error);
                setIsClientMedicalProviderInformationSavingInProgress(false);
            })
    }, [clientId, onSave, mode]);

    return (
        <div className={'client-medical-provider-information-form-component'}>
            <FormControlLabelComponent label={"Add Medical Provider Information"}/>
            <CardComponent title={"Medical Provider Information"}>
                <Formik
                    validationSchema={ClientMedicalProviderInformationValidationSchema}
                    initialValues={clientMedicalProviderInformationInitialValues}
                    onSubmit={onSubmit}
                    validateOnChange={false}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    validateOnMount={true}>
                    {({values, isValid, validateForm}) => {
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        useEffect(() => {
                            validateForm();
                        }, [validateForm, values]);
                        return (
                            <Form noValidate={true} className={"t-form"}>
                                <FormControlLabelComponent label={"Family Doctor"}/>
                                <div className="ts-row">
                                    <div className="ts-col-4">
                                        <Field name={`medical_provider_info.name`}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        label={"Full Name"}
                                                        placeholder={"Full Name"}
                                                        required={true}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    <div className="ts-col-4">
                                        <Field name={`medical_provider_info.primary_phone`}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        label={"Primary Phone Number"}
                                                        placeholder={"Primary Phone Number"}
                                                        required={true}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                </div>
                                <FormControlLabelComponent label={"Date of Last Physical Examination"}/>
                                <div className="ts-row">
                                    <div className="ts-col-4">
                                        <Field name={`medical_provider_info.last_examination_date`}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikDatePickerComponent
                                                        label={"Date"}
                                                        placeholder={"Date"}
                                                        required={true}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                </div>
                                <div className="t-form-actions">
                                    <LinkComponent route={CommonService._routeConfig.ClientList()}>
                                        <ButtonComponent
                                            variant={"outlined"}
                                            disabled={isClientMedicalProviderInformationSavingInProgress}
                                        >
                                            Cancel
                                        </ButtonComponent>
                                    </LinkComponent>&nbsp;
                                    <ButtonComponent
                                        isLoading={isClientMedicalProviderInformationSavingInProgress}
                                        disabled={isClientMedicalProviderInformationSavingInProgress || !isValid}
                                        type={"submit"}
                                    >
                                        {isClientMedicalProviderInformationSavingInProgress ? "Saving" : "Save & Next"}
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

export default ClientMedicalProviderInformationFormComponent;