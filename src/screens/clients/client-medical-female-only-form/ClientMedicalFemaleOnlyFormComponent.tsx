import "./ClientMedicalFemaleOnlyFormComponent.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import * as Yup from "yup";
import React, {useCallback, useEffect, useState} from "react";
import _ from "lodash";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import FormikRadioButtonGroupComponent
    from "../../../shared/components/form-controls/formik-radio-button/FormikRadioButtonComponent";
import {IClientMedicalFemaleOnlyForm} from "../../../shared/models/client.model";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {getClientMedicalDetails} from "../../../store/actions/client.action";

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
        clientMedicalDetails
    } = useSelector((state: IRootReducerState) => state.client);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        const payload = {...values, mode};
        setIsClientMedicalFemaleOnlyFormSavingInProgress(true);
        CommonService._client.ClientMedicalFemaleOnlyAddAPICall(clientId, payload)
            .then((response: IAPIResponseType<IClientMedicalFemaleOnlyForm>) => {
                if (clientId) {
                    dispatch(getClientMedicalDetails(clientId));
                }
                // CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsClientMedicalFemaleOnlyFormSavingInProgress(false);
                setClientMedicalFemaleOnlyInitialValues(_.cloneDeep(values));
                onSave(response);
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error);
                setIsClientMedicalFemaleOnlyFormSavingInProgress(false);
            })
    }, [clientId, onSave, mode, dispatch]);

    useEffect(() => {
        if (clientMedicalDetails) {
            setClientMedicalFemaleOnlyInitialValues({
                females_only_questions: clientMedicalDetails.females_only_questions
            });
        }
    }, [mode, clientId, dispatch, clientMedicalDetails]);

    return (
        <div className={'client-medical-female-only-form-component'}>
            {
                ((mode === "edit" && clientMedicalDetails) || mode === "add") && <>
                    <FormControlLabelComponent className={'add-females-only-heading'}
                                               label={CommonService.capitalizeFirstLetter(mode) + " Females Only"}/>
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
                                                size={'large'}
                                                disabled={isClientMedicalFemaleOnlyFormSavingInProgress}
                                                className={(isClientMedicalFemaleOnlyFormSavingInProgress ? 'mrg-right-15' : '')}
                                            >
                                                Previous
                                            </ButtonComponent>
                                            <ButtonComponent
                                                className={'submit-cta'}
                                                size={'large'}
                                                isLoading={isClientMedicalFemaleOnlyFormSavingInProgress}
                                                disabled={isClientMedicalFemaleOnlyFormSavingInProgress || !isValid || CommonService.isEqual(values, clientMedicalFemaleOnlyInitialValues)}
                                                type={"submit"}
                                            >
                                                {isClientMedicalFemaleOnlyFormSavingInProgress ? "Saving" : "Save"}
                                            </ButtonComponent>
                                            <ButtonComponent
                                                className={'submit-cta'}
                                                disabled={isClientMedicalFemaleOnlyFormSavingInProgress || !isValid || !CommonService.isEqual(values, clientMedicalFemaleOnlyInitialValues)}
                                                onClick={onNext}
                                            >
                                                Next
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

export default ClientMedicalFemaleOnlyFormComponent;
