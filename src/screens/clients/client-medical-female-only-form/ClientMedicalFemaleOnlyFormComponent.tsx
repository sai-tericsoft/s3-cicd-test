import "./ClientMedicalFemaleOnlyFormComponent.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import * as Yup from "yup";
import React, {useCallback, useEffect, useState} from "react";
import _ from "lodash";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {Misc} from "../../../constants";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import FormikRadioButtonGroupComponent
    from "../../../shared/components/form-controls/formik-radio-button/FormikRadioButtonComponent";
import {IClientMedicalFemaleOnlyForm} from "../../../shared/models/client.model";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";

interface ClientMedicalFemaleOnlyFormComponentProps {
    clientId: string;
    mode: "add" | "edit";
    onCancel: () => void;
    onSave: (clientPersonalHabits: any) => void;
}

const ClientMedicalFemaleOnlyValidationSchema = Yup.object({
    females_only_questions: Yup.object({
        "Pregnant or trying to get pregnant?": Yup.string().required('Pregnant or trying to get pregnant is required'),
        "Nursing?": Yup.string().required('Nursing is required')
    }),
});

const ClientMedicalFemaleOnlyInitialValues: IClientMedicalFemaleOnlyForm = {
    "females_only_questions": {
        "Pregnant or trying to get pregnant?": "",
        "Nursing?": ""
    }
};

const FormQuestions = [
    {
        key: "Pregnant or trying to get pregnant?",
        title: "Pregnant or trying to get pregnant?",
    },
    {
        key: "Nursing?",
        title: "Nursing?",
    }
]

const ClientMedicalFemaleOnlyFormComponent = (props: ClientMedicalFemaleOnlyFormComponentProps) => {

     const {mode, onCancel, clientId, onSave} = props;
    const [clientMedicalFemaleOnlyInitialValues] = useState<IClientMedicalFemaleOnlyForm>(_.cloneDeep(ClientMedicalFemaleOnlyInitialValues));
    const [isClientMedicalFemaleOnlyFormSavingInProgress, setIsClientMedicalFemaleOnlyFormSavingInProgress] = useState(false);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        const payload = {...values, mode};
        setIsClientMedicalFemaleOnlyFormSavingInProgress(true);
        CommonService._client.ClientMedicalFemaleOnlyAddAPICall(clientId, payload)
            .then((response: IAPIResponseType<IClientMedicalFemaleOnlyForm>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsClientMedicalFemaleOnlyFormSavingInProgress(false);
                onSave(response);
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error);
                setIsClientMedicalFemaleOnlyFormSavingInProgress(false);
            })
    }, [clientId, onSave, mode]);

    return (
        <div className={'client-medical-female-only-form-component'}>
            <FormControlLabelComponent label={"Add Females Only"}/>
            <CardComponent title={"Females Only"} description={"Is the client currently:"}>
                <Formik
                    validationSchema={ClientMedicalFemaleOnlyValidationSchema}
                    initialValues={clientMedicalFemaleOnlyInitialValues}
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
                                {
                                    FormQuestions.map((question: any) => {
                                        const {key, title} = question;
                                        return <div className="ts-row ts-align-items-center" key={key}>
                                            <div className="ts-col-md-8 ts-col-xl-10">
                                                {title}
                                            </div>
                                            <div className="ts-col-md-4 ts-col-xl-2">
                                                <Field name={`females_only_questions.${key}`}>
                                                    {
                                                        (field: FieldProps) => (
                                                            <FormikRadioButtonGroupComponent
                                                                options={CommonService._staticData.yesNoOptions}
                                                                displayWith={(option) => option}
                                                                valueExtractor={(option) => option}
                                                                required={true}
                                                                formikField={field}
                                                            />
                                                        )
                                                    }
                                                </Field>
                                            </div>
                                        </div>
                                    })
                                }
                                <div className="t-form-actions">
                                    <ButtonComponent
                                        variant={"outlined"}
                                        onClick={onCancel}
                                        disabled={isClientMedicalFemaleOnlyFormSavingInProgress}
                                    >
                                        Cancel
                                    </ButtonComponent>&nbsp;
                                    <ButtonComponent
                                        isLoading={isClientMedicalFemaleOnlyFormSavingInProgress}
                                        disabled={isClientMedicalFemaleOnlyFormSavingInProgress || !isValid}
                                        type={"submit"}
                                    >
                                        {isClientMedicalFemaleOnlyFormSavingInProgress ? "Saving" : "Save & Next"}
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

export default ClientMedicalFemaleOnlyFormComponent;