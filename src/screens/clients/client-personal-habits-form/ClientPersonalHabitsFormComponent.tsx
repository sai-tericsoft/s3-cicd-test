import "./ClientPersonalHabitsFormComponent.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import * as Yup from "yup";
import React, {useCallback, useEffect, useState} from "react";
import _ from "lodash";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {Misc} from "../../../constants";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import FormikRadioButtonGroupComponent
    from "../../../shared/components/form-controls/formik-radio-button/FormikRadioButtonComponent";
import {IClientPersonalHabitsForm} from "../../../shared/models/client.model";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";

interface ClientPersonalHabitsFormComponentProps {
    clientId: string;
    mode: "add" | "edit";
    onCancel: () => void;
    onSave: (clientPersonalHabits: any) => void;
}

const ClientPersonalHabitsFormValidationSchema = Yup.object({
    personal_habits: Yup.object({
        "Smoke/Chew Tobacco?": Yup.object({
            value: Yup.string().required('Value is required'),
            text: Yup.string().when("value", {
                is: "Yes",
                then: Yup.string().required('Text is required')
            })
        }),
        "Drink Alcohol?": Yup.object({
            value: Yup.string().required('Value is required'),
            text: Yup.string().when("value", {
                is: "Yes",
                then: Yup.string().required('Text is required')
            })
        }),
        "Drink Coffee?": Yup.object({
            value: Yup.string().required('Value is required'),
            text: Yup.string().when("value", {
                is: "Yes",
                then: Yup.string().required('Text is required')
            })
        }),
        "Drink Soda/Pop?": Yup.object({
            value: Yup.string().required('Value is required'),
            text: Yup.string().when("value", {
                is: "Yes",
                then: Yup.string().required('Text is required')
            })
        }),
    }),
});

const ClientPersonalHabitsFormInitialValues: IClientPersonalHabitsForm = {
    "personal_habits": {
        "Smoke/Chew Tobacco?": {
            "value": "",
            "text": ""
        },
        "Drink Alcohol?": {
            "value": ""
        },
        "Drink Coffee?": {
            "value": "",
            "text": ""
        },
        "Drink Soda/Pop?": {
            "value": ""
        }
    }
};

const FormQuestions = [
    {
        key: "Smoke/Chew Tobacco?",
        title: "Smoke/Chew Tobacco?",
        placeholder: "Cigarettes/day"
    },
    {
        key: "Drink Alcohol?",
        title: "Drink Alcohol?",
        placeholder: "Drinks/day"
    },
    {
        key: "Drink Coffee?",
        title: "Drink Coffee?",
        placeholder: "Cups/day"
    },
    {
        key: "Drink Soda/Pop?",
        title: "Drink Soda/Pop?",
        placeholder: "Cups/day"
    }
]

const ClientPersonalHabitsFormComponent = (props: ClientPersonalHabitsFormComponentProps) => {

     const {mode, onCancel, clientId, onSave} = props;
    const [clientPersonalHabitsFormInitialValues] = useState<IClientPersonalHabitsForm>(_.cloneDeep(ClientPersonalHabitsFormInitialValues));
    const [isClientPersonalHabitsSavingInProgress, setIsClientPersonalHabitsSavingInProgress] = useState(false);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        const payload = {...values, mode};
        setIsClientPersonalHabitsSavingInProgress(true);
        CommonService._client.ClientPersonalHabitsAddAPICall(clientId, payload)
            .then((response: IAPIResponseType<IClientPersonalHabitsForm>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsClientPersonalHabitsSavingInProgress(false);
                onSave(response);
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error);
                setIsClientPersonalHabitsSavingInProgress(false);
            })
    }, [clientId, onSave, mode]);

    return (
        <div className={'client-personal-habits-form-component'}>
            <FormControlLabelComponent label={"Add Personal Habits"}/>
            <CardComponent title={"Personal Habits"} description={"Has the client ever or do they currently:"}>
                <Formik
                    validationSchema={ClientPersonalHabitsFormValidationSchema}
                    initialValues={clientPersonalHabitsFormInitialValues}
                    onSubmit={onSubmit}
                    validateOnChange={false}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    validateOnMount={true}>
                    {({values, errors, isValid, validateForm}) => {
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        useEffect(() => {
                            validateForm();
                        }, [validateForm, values]);
                        return (
                            <Form noValidate={true} className={"t-form"}>
                                {
                                    FormQuestions.map((question: any) => {
                                        const {key, title, placeholder} = question;
                                        return <div className="ts-row ts-align-items-center" key={key}>
                                            <div className="ts-col-md-5">
                                                {title}
                                            </div>
                                            <div className="ts-col-md-5">
                                                <Field name={`personal_habits.${key}.value`}>
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
                                            <div className="ts-col-md-2">
                                                {
                                                    // @ts-ignore
                                                    values.personal_habits[key].value === 'Yes' &&
                                                    <Field name={`personal_habits.${key}.text`}>
                                                        {
                                                            (field: FieldProps) => (
                                                                <FormikInputComponent
                                                                    label={placeholder}
                                                                    placeholder={placeholder}
                                                                    type={"text"}
                                                                    required={true}
                                                                    formikField={field}
                                                                    size={"small"}
                                                                    fullWidth={true}
                                                                />
                                                            )
                                                        }
                                                    </Field>
                                                }
                                            </div>
                                        </div>
                                    })
                                }
                                <div className="t-form-actions">
                                    <ButtonComponent
                                        variant={"outlined"}
                                        onClick={onCancel}
                                        disabled={isClientPersonalHabitsSavingInProgress}
                                    >
                                        Cancel
                                    </ButtonComponent>&nbsp;
                                    <ButtonComponent
                                        isLoading={isClientPersonalHabitsSavingInProgress}
                                        disabled={isClientPersonalHabitsSavingInProgress || !isValid}
                                        type={"submit"}
                                    >
                                        {isClientPersonalHabitsSavingInProgress ? "Saving" : "Save & Next"}
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

export default ClientPersonalHabitsFormComponent;