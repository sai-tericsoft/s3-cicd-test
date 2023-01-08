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
import FormikRadioButtonGroupComponent
    from "../../../shared/components/form-controls/formik-radio-button/FormikRadioButtonComponent";
import {IClientMedicalFemaleOnlyForm} from "../../../shared/models/client.model";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {getClientMedicalDetails} from "../../../store/actions/client.action";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";

interface ClientMedicalFemaleOnlyFormComponentProps {
    clientId: string;
    mode: "add" | "edit";
    onCancel: () => void;
    onNext?: () => void;
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

    const {mode, onCancel, onNext, clientId, onSave} = props;
    const [clientMedicalFemaleOnlyInitialValues, setClientMedicalFemaleOnlyInitialValues] = useState<IClientMedicalFemaleOnlyForm>(_.cloneDeep(ClientMedicalFemaleOnlyInitialValues));
    const [isClientMedicalFemaleOnlyFormSavingInProgress, setIsClientMedicalFemaleOnlyFormSavingInProgress] = useState(false);
    const dispatch = useDispatch();

    const {
        clientMedicalDetails,
        isClientMedicalDetailsLoaded,
        isClientMedicalDetailsLoading,
        isClientMedicalDetailsLoadingFailed
    } = useSelector((state: IRootReducerState) => state.client);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        const payload = {...values, mode};
        setIsClientMedicalFemaleOnlyFormSavingInProgress(true);
        CommonService._client.ClientMedicalFemaleOnlyAddAPICall(clientId, payload)
            .then((response: IAPIResponseType<IClientMedicalFemaleOnlyForm>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsClientMedicalFemaleOnlyFormSavingInProgress(false);
                setClientMedicalFemaleOnlyInitialValues(_.cloneDeep(values));
                onSave(response);
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error);
                setIsClientMedicalFemaleOnlyFormSavingInProgress(false);
            })
    }, [clientId, onSave, mode]);

    useEffect(() => {
        if (mode === "edit") {
            if (clientMedicalDetails) {
                setClientMedicalFemaleOnlyInitialValues({
                    females_only_questions: clientMedicalDetails.females_only_questions
                });
            } else {
                if (clientId) {
                    dispatch(getClientMedicalDetails(clientId));
                }
            }
        }
    }, [mode, clientId, dispatch, clientMedicalDetails]);

    return (
        <div className={'client-medical-female-only-form-component'}>
            <>
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
                    <FormControlLabelComponent className={'add-females-only-heading'} label={CommonService.capitalizeFirstLetter(mode) + " Females Only"}/>
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
                                                    <div className="ts-col-md-4">
                                                        {title}
                                                    </div>
                                                    <div className="ts-col-md-4">
                                                        <Field name={`females_only_questions.${key}`}>
                                                            {
                                                                (field: FieldProps) => (
                                                                    <FormikRadioButtonGroupComponent
                                                                        options={CommonService._staticData.yesNoOptions}
                                                                        displayWith={(option) => option.title}
                                                                        valueExtractor={(option) => option.title}
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
                                                Home
                                            </ButtonComponent>&nbsp;
                                            <ButtonComponent
                                                isLoading={isClientMedicalFemaleOnlyFormSavingInProgress}
                                                disabled={isClientMedicalFemaleOnlyFormSavingInProgress || !isValid || CommonService.isEqual(values, clientMedicalFemaleOnlyInitialValues)}
                                                type={"submit"}
                                            >
                                                {isClientMedicalFemaleOnlyFormSavingInProgress ? "Saving" : <>{mode === "add" ? "Save & Next" : "Save"}</>}
                                            </ButtonComponent>
                                            {
                                                mode === "edit" && <>
                                                    &nbsp;&nbsp;<ButtonComponent
                                                    disabled={isClientMedicalFemaleOnlyFormSavingInProgress || !CommonService.isEqual(values, clientMedicalFemaleOnlyInitialValues)}
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

export default ClientMedicalFemaleOnlyFormComponent;
