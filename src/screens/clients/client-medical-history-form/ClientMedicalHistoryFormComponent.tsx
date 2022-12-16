import "./ClientMedicalHistoryFormComponent.scss";
import * as Yup from "yup";
import {IClientMedicalHistoryForm} from "../../../shared/models/client.model";
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
import {IMedicalHistoryOption} from "../../../shared/models/common.model";
import CheckBoxComponent from "../../../shared/components/form-controls/check-box/CheckBoxComponent";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import FormikCheckBoxComponent from "../../../shared/components/form-controls/formik-check-box/FormikCheckBoxComponent";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import {getClientMedicalDetails} from "../../../store/actions/client.action";

interface ClientMedicalHistoryFormComponentProps {
    clientId: string;
    mode: "add" | "edit";
    onCancel: () => void;
    onSave: (clientMedicalHistoryDetails: any) => void;
}

const ClientMedicalHistoryValidationSchema = Yup.object({
    medical_history: Yup.object({
        isCustomOption: Yup.boolean().nullable(),
        questions: Yup.array().nullable().when("isCustomOption", {
            is: false,
            then: Yup.array().min(1, 'Medical history is required'),
            otherwise: Yup.array().nullable()
        }),
        comments: Yup.string().when("isCustomOption", {
            is: true,
            then: Yup.string().required('Comments is required'),
            otherwise: Yup.string().nullable()
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

    const {mode, onCancel, clientId, onSave} = props;
    const {medicalHistoryOptionsList} = useSelector((state: IRootReducerState) => state.staticData);
    const [clientMedicalHistoryInitialValues, SetClientMedicalHistoryInitialValues] = useState<IClientMedicalHistoryForm>(_.cloneDeep(ClientMedicalHistoryInitialValues));
    const [isClientMedicalHistorySavingInProgress, setIsClientMedicalHistorySavingInProgress] = useState(false);

    const dispatch = useDispatch();

    const {
        clientMedicalDetails,
        isClientMedicalDetailsLoaded,
        isClientMedicalDetailsLoading,
        isClientMedicalDetailsLoadingFailed
    } = useSelector((state: IRootReducerState) => state.client);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        const payload = {...CommonService.removeKeysFromJSON(_.cloneDeep(values), ['questions_details' ]), mode};
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

    useEffect(() => {
        if (mode === "edit") {
            if (clientMedicalDetails) {
                if (clientMedicalDetails?.medical_history?.comments) {
                    clientMedicalDetails.medical_history.isCustomOption = true;
                }
                SetClientMedicalHistoryInitialValues({
                    medical_history: clientMedicalDetails.medical_history
                });
            } else {
                if (clientId) {
                    dispatch(getClientMedicalDetails(clientId));
                }
            }
        }
    }, [mode, clientId, dispatch, clientMedicalDetails]);


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
                    <FormControlLabelComponent label={CommonService.capitalizeFirstLetter(mode) + " Medical History"}/>
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
                            {({values, setFieldError, setFieldTouched, setFieldValue, isValid, validateForm}) => {
                                // eslint-disable-next-line react-hooks/rules-of-hooks
                                useEffect(() => {
                                    validateForm();
                                }, [validateForm, values]);
                                return (
                                    <Form noValidate={true} className={"t-form"}>
                                        <div className="ts-row">
                                            {
                                                medicalHistoryOptionsList?.map((option: IMedicalHistoryOption) => {
                                                    return <div className="ts-col-md-6" key={option?._id}>
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
                                                            onChange={(isChecked) => {
                                                                if (!isChecked) {
                                                                    setFieldValue('medical_history.comments', "");
                                                                    setFieldError('medical_history.comments', undefined);
                                                                    setTimeout(() => { // TODO solve fool proof
                                                                        validateForm();
                                                                    }, 10);
                                                                }
                                                            }}
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
                                                                disabled={!values.medical_history?.isCustomOption}
                                                                required={values.medical_history?.isCustomOption}
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
                                                disabled={isClientMedicalHistorySavingInProgress}
                                            >
                                                Cancel
                                            </ButtonComponent>&nbsp;
                                            <ButtonComponent
                                                isLoading={isClientMedicalHistorySavingInProgress}
                                                disabled={isClientMedicalHistorySavingInProgress || !isValid}
                                                type={"submit"}
                                            >
                                                {isClientMedicalHistorySavingInProgress ? "Saving" : <>{mode === "add" ? "Save & Next" : "Save"}</>}
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

export default ClientMedicalHistoryFormComponent;