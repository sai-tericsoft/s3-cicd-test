import "./ClientAllergiesFormComponent.scss";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import * as Yup from "yup";
import {useCallback, useEffect, useState} from "react";
import {IClientAllergiesForm} from "../../../shared/models/client.model";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {Misc} from "../../../constants";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";

interface ClientAllergiesFormComponentProps {
    clientId: string;
    mode: "add" | "edit";
    onSave: (clientAllergies: any) => void;
}

const ClientAllergiesValidationSchema = Yup.object({
    allergies: Yup.string().required('Allergies are required')
})

const ClientAllergiesFormInitialValues: IClientAllergiesForm = {
    allergies: ''
}

const ClientAllergiesFormComponent = (props: ClientAllergiesFormComponentProps) => {

    const {mode, clientId, onSave} = props;
    const [clientAllergiesFormInitialValues] = useState(ClientAllergiesFormInitialValues)
    const [isClientAllergiesSavingInProgress, setIsClientAllergiesSavingSavingInProgress] = useState(false);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        setIsClientAllergiesSavingSavingInProgress(true);
        console.log('mode', mode); // TODO make api call based on mode
        CommonService._client.ClientAllergiesAddAPICall(clientId, values)
            .then((response: IAPIResponseType<IClientAllergiesForm>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsClientAllergiesSavingSavingInProgress(false);
                onSave(response);
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error);
                setIsClientAllergiesSavingSavingInProgress(false);
            })
    }, [clientId, onSave, mode]);

    return (
        <div className={'client-allergies-form-component'}>
            <FormControlLabelComponent label={"Add Allergies"}/>
            <CardComponent title={'Allergies'}
                           description={"Please list all allergies for the client (ie. Medications, Food, Environmental, Insects, Adhesives, Etc.):"}>
                <Formik initialValues={clientAllergiesFormInitialValues}
                        validationSchema={ClientAllergiesValidationSchema}
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
                                <Field name={'allergies'}>
                                    {
                                        (field: FieldProps) => (
                                            <FormikTextAreaComponent formikField={field}
                                                                     label={'Allergies'}
                                                                     required={true}
                                                                     fullWidth={true}
                                                                     placeholder={'Allergies'}/>
                                        )
                                    }
                                </Field>
                                <div className="t-form-actions">
                                    <LinkComponent route={CommonService._routeConfig.ClientList()}>
                                        <ButtonComponent
                                            variant={"outlined"}
                                            disabled={isClientAllergiesSavingInProgress}
                                        >
                                            Cancel
                                        </ButtonComponent>
                                    </LinkComponent>&nbsp;
                                    <ButtonComponent
                                        isLoading={isClientAllergiesSavingInProgress}
                                        disabled={isClientAllergiesSavingInProgress || !isValid}
                                        type={"submit"}
                                    >
                                        {isClientAllergiesSavingInProgress ? "Saving" : "Save & Next"}
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

export default ClientAllergiesFormComponent;