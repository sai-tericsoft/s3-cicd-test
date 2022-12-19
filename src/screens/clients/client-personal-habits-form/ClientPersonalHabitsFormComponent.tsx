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
import FormikRadioButtonGroupComponent
    from "../../../shared/components/form-controls/formik-radio-button/FormikRadioButtonComponent";
import {IClientPersonalHabitsForm} from "../../../shared/models/client.model";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {getClientMedicalDetails} from "../../../store/actions/client.action";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import HorizontalLineComponent
    from "../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";

interface ClientPersonalHabitsFormComponentProps {
    clientId: string;
    mode: "add" | "edit";
    onCancel: () => void;
    onNext?: () => void;
    onSave: (clientPersonalHabits: any) => void;
}

const ClientPersonalHabitsFormValidationSchema = Yup.object({
    personal_habits: Yup.object({
        "Smoke/Chew Tobacco?": Yup.object({
            value: Yup.string().required('Smoke/Chew Tobacco is required'),
            text: Yup.string().when("value", {
                is: "Yes",
                then: Yup.string().required('Smoke/Chew Tobacco is required')
            })
        }),
        "Drink Alcohol?": Yup.object({
            value: Yup.string().required('Drink Alcohol is required'),
            text: Yup.string().when("value", {
                is: "Yes",
                then: Yup.string().required('Drink Alcohol is required')
            })
        }),
        "Drink Coffee?": Yup.object({
            value: Yup.string().required('Drink Coffee is required'),
            text: Yup.string().when("value", {
                is: "Yes",
                then: Yup.string().required('Drink Coffee is required')
            })
        }),
        "Drink Soda/Pop?": Yup.object({
            value: Yup.string().required('Drink Soda/Pop is required'),
            text: Yup.string().when("value", {
                is: "Yes",
                then: Yup.string().required('Drink Soda/Pop is required')
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

    const {mode, onCancel, onNext, clientId, onSave} = props;
    const [clientPersonalHabitsFormInitialValues, setClientPersonalHabitsFormInitialValues] = useState<IClientPersonalHabitsForm>(_.cloneDeep(ClientPersonalHabitsFormInitialValues));
    const [isClientPersonalHabitsSavingInProgress, setIsClientPersonalHabitsSavingInProgress] = useState(false);
    const dispatch = useDispatch();

    const {
        clientMedicalDetails,
        isClientMedicalDetailsLoaded,
        isClientMedicalDetailsLoading,
        isClientMedicalDetailsLoadingFailed
    } = useSelector((state: IRootReducerState) => state.client);

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
                CommonService.handleErrors(setErrors, error, true);
                setIsClientPersonalHabitsSavingInProgress(false);
            })
    }, [clientId, onSave, mode]);

    useEffect(() => {
        if (mode === "edit") {
            if (clientMedicalDetails) {
                setClientPersonalHabitsFormInitialValues({
                    personal_habits: clientMedicalDetails?.personal_habits
                });
            } else {
                if (clientId) {
                    dispatch(getClientMedicalDetails(clientId));
                }
            }
        }
    }, [mode, clientId, dispatch, clientMedicalDetails]);

    return (
        <div className={'client-personal-habits-form-component'}><>
            {
                mode === "edit" && <>
                    {
                        isClientMedicalDetailsLoading && <div>
                            <LoaderComponent/>
                        </div>
                    }
                    {
                        isClientMedicalDetailsLoadingFailed &&
                        <StatusCardComponent title={"Failed to fetch medical Details"}/>
                    }
                </>
            }
        </>
            {
                ((mode === "edit" && isClientMedicalDetailsLoaded && clientMedicalDetails) || mode === "add") && <>
                    <FormControlLabelComponent label={CommonService.capitalizeFirstLetter(mode) + " Personal Habits"}/>
                    <CardComponent title={"Personal Habits"} description={"Has the client ever or do they currently:"}>
                        <Formik
                            validationSchema={ClientPersonalHabitsFormValidationSchema}
                            initialValues={clientPersonalHabitsFormInitialValues}
                            onSubmit={onSubmit}
                            validateOnChange={false}
                            validateOnBlur={true}
                            enableReinitialize={true}
                            validateOnMount={true}>
                            {({values, setFieldValue, isValid, validateForm}) => {
                                // eslint-disable-next-line react-hooks/rules-of-hooks
                                useEffect(() => {
                                    validateForm();
                                }, [validateForm, values]);
                                return (
                                    <Form noValidate={true} className={"t-form form-question-list"}>
                                        {
                                            FormQuestions.map((question: any, index) => {
                                                const {key, title, placeholder} = question;
                                                return <>
                                                    <div className="ts-row ts-align-items-center form-question" key={key}>
                                                        <div className="ts-col-md-4">
                                                            {title}
                                                        </div>
                                                        <div className="ts-col-md-3">
                                                            <Field name={`personal_habits.${key}.value`}>
                                                                {
                                                                    (field: FieldProps) => (
                                                                        <FormikRadioButtonGroupComponent
                                                                            options={CommonService._staticData.yesNoOptions}
                                                                            displayWith={(option) => option.title}
                                                                            valueExtractor={(option) => option.title}
                                                                            required={true}
                                                                            formikField={field}
                                                                            onChange={(value) => {
                                                                                if (value === "No") {
                                                                                    setFieldValue(`personal_habits.${key}.text`, undefined);
                                                                                }
                                                                            }}
                                                                        />
                                                                    )
                                                                }
                                                            </Field>
                                                        </div>
                                                        <div className="ts-col-md-3">
                                                            {
                                                                // @ts-ignore
                                                                values.personal_habits[key]?.value === 'Yes' &&
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
                                                </>
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
                                                disabled={isClientPersonalHabitsSavingInProgress || !isValid || CommonService.isEqual(values, clientPersonalHabitsFormInitialValues)}
                                                type={"submit"}
                                            >
                                                {isClientPersonalHabitsSavingInProgress ? "Saving" : <>{mode === "add" ? "Save & Next" : "Save"}</>}
                                            </ButtonComponent>
                                            {
                                                mode === "edit" && <>
                                                    &nbsp;&nbsp;<ButtonComponent
                                                    disabled={isClientPersonalHabitsSavingInProgress || !CommonService.isEqual(values, clientPersonalHabitsFormInitialValues)}
                                                    onClick={onNext}
                                                >
                                                    Next
                                                </ButtonComponent>
                                                </>
                                            }
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

export default ClientPersonalHabitsFormComponent;