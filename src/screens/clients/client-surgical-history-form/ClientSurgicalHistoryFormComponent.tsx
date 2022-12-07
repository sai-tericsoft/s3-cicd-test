import "./ClientSurgicalHistoryFormComponent.scss";
import * as Yup from "yup";
import {IClientSurgicalHistoryForm} from "../../../shared/models/client.model";
import React, {useCallback, useEffect, useState} from "react";
import _ from "lodash";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {Misc} from "../../../constants";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {ISurgicalHistoryOption} from "../../../shared/models/common.model";
import CheckBoxComponent from "../../../shared/components/form-controls/check-box/CheckBoxComponent";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import FormikCheckBoxComponent from "../../../shared/components/form-controls/formik-check-box/FormikCheckBoxComponent";
import {getClientMedicalDetails} from "../../../store/actions/client.action";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";

interface ClientSurgicalHistoryFormComponentProps {
    clientId: string;
    mode: "add" | "edit";
    onCancel: () => void;
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

    const {mode, onCancel, clientId, onSave} = props;
    const {surgicalHistoryOptionsList} = useSelector((state: IRootReducerState) => state.staticData);
    const [clientSurgicalHistoryInitialValues, setClientSurgicalHistoryInitialValues] = useState<IClientSurgicalHistoryForm>(_.cloneDeep(ClientSurgicalHistoryInitialValues));
    const [isClientSurgicalHistorySavingInProgress, setIsClientSurgicalHistorySavingInProgress] = useState(false);
    const dispatch = useDispatch();

    const {
        clientMedicalDetails,
        isClientMedicalDetailsLoaded,
        isClientMedicalDetailsLoading,
        isClientMedicalDetailsLoadingFailed
    } = useSelector((state: IRootReducerState) => state.client);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        const payload = {...CommonService.removeKeysFromJSON(_.cloneDeep(values), ['questions_details' ]), mode};
        setIsClientSurgicalHistorySavingInProgress(true);
        CommonService._client.ClientSurgicalHistoryAddAPICall(clientId, payload)
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

    useEffect(() => {
        if (mode === "edit") {
            if (clientMedicalDetails) {
                if (clientMedicalDetails.surgical_history.comments) {
                    clientMedicalDetails.surgical_history.isCustomOption = true;
                }
                setClientSurgicalHistoryInitialValues({
                    surgical_history: clientMedicalDetails.surgical_history
                });
            } else {
                if (clientId) {
                    dispatch(getClientMedicalDetails(clientId));
                }
            }
        }
    }, [mode, clientId, dispatch, clientMedicalDetails]);

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
                    <FormControlLabelComponent label={CommonService.capitalizeFirstLetter(mode) + " Surgical History"}/>
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
                                                surgicalHistoryOptionsList?.map((option: ISurgicalHistoryOption) => {
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
                                            <ButtonComponent
                                                variant={"outlined"}
                                                onClick={onCancel}
                                                disabled={isClientSurgicalHistorySavingInProgress}
                                            >
                                                Cancel
                                            </ButtonComponent>&nbsp;
                                            <ButtonComponent
                                                isLoading={isClientSurgicalHistorySavingInProgress}
                                                disabled={isClientSurgicalHistorySavingInProgress || !isValid}
                                                type={"submit"}
                                            >
                                                {isClientSurgicalHistorySavingInProgress ? "Saving" : <>{mode === "add" ? "Save & Next" : "Save"}</>}
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

export default ClientSurgicalHistoryFormComponent;