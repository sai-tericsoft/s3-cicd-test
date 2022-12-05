import "./ClientMedicalHistoryFormComponent.scss";
import * as Yup from "yup";
import {IClientMedicalHistoryForm} from "../../../shared/models/client.model";
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
import {IMedicalHistoryOption} from "../../../shared/models/common.model";
import CheckBoxComponent from "../../../shared/components/form-controls/check-box/CheckBoxComponent";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import FormikCheckBoxComponent from "../../../shared/components/form-controls/formik-check-box/FormikCheckBoxComponent";

interface ClientMedicalHistoryFormComponentProps {
    clientId: string;
    mode: "add" | "edit";
    onSave: (clientMedicalHistoryDetails: any) => void;
}

const ClientMedicalHistoryValidationSchema = Yup.object({
    medical_history: Yup.object({
        questions: Yup.array().min(1, 'Medical history is required'),
        isCustomOption: Yup.boolean().nullable(),
        comments: Yup.string().when("isCustomOption", {
            is: true,
            then: Yup.string().required('Comments is required')
        })
    }),
});

const ClientMedicalHistoryInitialValues: IClientMedicalHistoryForm = {
    medical_history: {
        questions: [],
        isCustomOption: false,
        comments: ""
    }
};

const ClientMedicalHistoryFormComponent = (props: ClientMedicalHistoryFormComponentProps) => {

    const {mode, clientId, onSave} = props;
    const {medicalHistoryOptionsList} = useSelector((state: IRootReducerState) => state.staticData);
    const [clientMedicalHistoryInitialValues] = useState<IClientMedicalHistoryForm>(_.cloneDeep(ClientMedicalHistoryInitialValues));
    const [isClientMedicalHistorySavingInProgress, setIsClientMedicalHistorySavingInProgress] = useState(false);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        const payload = {...values, mode};
        setIsClientMedicalHistorySavingInProgress(true);
        CommonService._client.ClientMedicalHistoryAddAPICall(clientId, payload)
            .then((response: IAPIResponseType<IClientMedicalHistoryForm>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsClientMedicalHistorySavingInProgress(false);
                onSave(response);
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error);
                setIsClientMedicalHistorySavingInProgress(false);
            })
    }, [clientId, onSave, mode]);

    const handleMedicalHistoryOptionSelection = useCallback((optionId: string, selectedOptions: string[]) => {
        const index = selectedOptions?.findIndex((value: string) => value === optionId);
        if (index > -1) {
            selectedOptions.splice(index, 1);
        } else {
            selectedOptions.push(optionId);
        }
        return selectedOptions;
    }, []);

    return (
        <div className={'client-medical-history-form-component'}>
            <FormControlLabelComponent label={"Add Medical History"}/>
            <CardComponent title={"Medical History"}
                           description={"Has the client ever had or do they currently have: (Check all that apply)"}>
                <Formik
                    validationSchema={ClientMedicalHistoryValidationSchema}
                    initialValues={clientMedicalHistoryInitialValues}
                    onSubmit={onSubmit}
                    validateOnChange={false}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    validateOnMount={true}>
                    {({values, errors, setFieldTouched, setFieldValue, isValid, validateForm}) => {
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        useEffect(() => {
                            validateForm();
                        }, [validateForm, values]);
                        return (
                            <Form noValidate={true} className={"t-form"}>
                                <div className="ts-row">
                                    {
                                        medicalHistoryOptionsList?.map((option: IMedicalHistoryOption) => {
                                            return <div className="ts-col-md-6" key={option._id}>
                                                <Field
                                                    name={"medical_history.questions"}>
                                                    {(field: FieldProps) => (
                                                        <CheckBoxComponent
                                                            label={option?.title}
                                                            required={true}
                                                            checked={field.field?.value?.indexOf(option._id) > -1}
                                                            onChange={() => {
                                                                setFieldTouched(field.field?.name);
                                                                setFieldValue(field.field?.name, handleMedicalHistoryOptionSelection(option._id, field.field?.value));
                                                                validateForm();
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </div>
                                        })
                                    }
                                </div>
                                <div className="ts-row">
                                    <div className="ts-col-md-6">
                                        <Field
                                            name={"medical_history.isCustomOption"}>
                                            {(field: FieldProps) => (
                                                <FormikCheckBoxComponent
                                                    formikField={field}
                                                    label={"Any other illnesses or conditions not listed above?"}
                                                />
                                            )}
                                        </Field>
                                    </div>
                                </div>
                                <div className="ts-row">
                                    <div className="ts-col-12">
                                        <Field name={`medical_history.comments`}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikTextAreaComponent
                                                        label={"Comments"}
                                                        placeholder={"Enter your comments here"}
                                                        disabled={!values.medical_history.isCustomOption}
                                                        required={values.medical_history.isCustomOption}
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
                                            disabled={isClientMedicalHistorySavingInProgress}
                                        >
                                            Cancel
                                        </ButtonComponent>
                                    </LinkComponent>&nbsp;
                                    <ButtonComponent
                                        isLoading={isClientMedicalHistorySavingInProgress}
                                        disabled={isClientMedicalHistorySavingInProgress || !isValid}
                                        type={"submit"}
                                    >
                                        {isClientMedicalHistorySavingInProgress ? "Saving" : "Save & Next"}
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

export default ClientMedicalHistoryFormComponent;