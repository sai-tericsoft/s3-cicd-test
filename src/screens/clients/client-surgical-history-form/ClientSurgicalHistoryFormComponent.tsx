import "./ClientSurgicalHistoryFormComponent.scss";
import * as Yup from "yup";
import {IClientSurgicalHistoryForm} from "../../../shared/models/client.model";
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
import {ISurgicalHistoryOption} from "../../../shared/models/common.model";
import CheckBoxComponent from "../../../shared/components/form-controls/check-box/CheckBoxComponent";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import FormikCheckBoxComponent from "../../../shared/components/form-controls/formik-check-box/FormikCheckBoxComponent";

interface ClientSurgicalHistoryFormComponentProps {
    clientId: string;
    mode: "add" | "edit";
    onSave: (clientSurgicalHistoryDetails: any) => void;
}

const ClientSurgicalHistoryValidationSchema = Yup.object({
    surgical_history: Yup.object({
        questions: Yup.array().min(1, 'Surgical history is required'),
        isCustomOption: Yup.boolean().nullable(),
        comments: Yup.string().when("isCustomOption", {
            is: true,
            then: Yup.string().required('Comments is required')
        })
    }),
});

const ClientSurgicalHistoryInitialValues: IClientSurgicalHistoryForm = {
    surgical_history: {
        questions: [],
        isCustomOption: false,
        comments: ""
    }
};

const ClientSurgicalHistoryFormComponent = (props: ClientSurgicalHistoryFormComponentProps) => {

    const {mode, clientId, onSave} = props;
    const {medicalHistoryOptionsList} = useSelector((state: IRootReducerState) => state.staticData);
    const [clientSurgicalHistoryInitialValues] = useState<IClientSurgicalHistoryForm>(_.cloneDeep(ClientSurgicalHistoryInitialValues));
    const [isClientSurgicalHistorySavingInProgress, setIsClientSurgicalHistorySavingInProgress] = useState(false);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        setIsClientSurgicalHistorySavingInProgress(true);
        console.log('mode', mode); // TODO make api call based on mode
        CommonService._client.ClientSurgicalHistoryAddAPICall(clientId, values)
            .then((response: IAPIResponseType<IClientSurgicalHistoryForm>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsClientSurgicalHistorySavingInProgress(false);
                onSave(response);
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error);
                setIsClientSurgicalHistorySavingInProgress(false);
            })
    }, [clientId, onSave, mode]);

    const handleSurgicalHistoryOptionSelection = useCallback((optionId: string, selectedOptions: string[]) => {
        const index = selectedOptions?.findIndex((value: string) => value === optionId);
        if (index > -1) {
            selectedOptions.splice(index, 1);
        } else {
            selectedOptions.push(optionId);
        }
        return selectedOptions;
    }, []);

    return (
        <div className={'client-surgical-history-form-component'}>
            <FormControlLabelComponent label={"Add Surgical History"}/>
            <CardComponent title={"Surgical History"}
                           description={"Has the client ever had:"}>
                <Formik
                    validationSchema={ClientSurgicalHistoryValidationSchema}
                    initialValues={clientSurgicalHistoryInitialValues}
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
                                        medicalHistoryOptionsList?.map((option: ISurgicalHistoryOption) => {
                                            return <div className="ts-col-md-6 ts-col-lg-4" key={option._id}>
                                                <Field
                                                    name={"surgical_history.questions"}>
                                                    {(field: FieldProps) => (
                                                        <CheckBoxComponent
                                                            label={option?.title}
                                                            required={true}
                                                            checked={field.field?.value?.indexOf(option._id) > -1}
                                                            onChange={() => {
                                                                setFieldTouched(field.field?.name);
                                                                setFieldValue(field.field?.name, handleSurgicalHistoryOptionSelection(option._id, field.field?.value));
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
                                    <div className="ts-col-4">
                                        <Field
                                            name={"surgical_history.isCustomOption"}>
                                            {(field: FieldProps) => (
                                                <FormikCheckBoxComponent
                                                    formikField={field}
                                                    label={"Other Surgery not Listed?"}
                                                />
                                            )}
                                        </Field>
                                    </div>
                                </div>
                                <div className="ts-row">
                                    <div className="ts-col-12">
                                        <Field name={`surgical_history.comments`}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikTextAreaComponent
                                                        label={"Comments"}
                                                        placeholder={"Enter your comments here"}
                                                        disabled={!values.surgical_history.isCustomOption}
                                                        required={values.surgical_history.isCustomOption}
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
                                            disabled={isClientSurgicalHistorySavingInProgress}
                                        >
                                            Cancel
                                        </ButtonComponent>
                                    </LinkComponent>&nbsp;
                                    <ButtonComponent
                                        isLoading={isClientSurgicalHistorySavingInProgress}
                                        disabled={isClientSurgicalHistorySavingInProgress || !isValid}
                                        type={"submit"}
                                    >
                                        {isClientSurgicalHistorySavingInProgress ? "Saving" : "Save & Next"}
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

export default ClientSurgicalHistoryFormComponent;