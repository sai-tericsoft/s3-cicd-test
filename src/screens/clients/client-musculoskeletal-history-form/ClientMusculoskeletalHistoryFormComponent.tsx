import "./ClientMusculoskeletalHistoryFormComponent.scss";
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
import {IClientMusculoskeletalHistoryForm} from "../../../shared/models/client.model";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {IMusculoskeletalHistoryOption} from "../../../shared/models/common.model";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import {getClientMedicalDetails} from "../../../store/actions/client.action";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";

interface ClientMusculoskeletalFormComponentProps {
    clientId: string;
    mode: "add" | "edit";
    onCancel: () => void;
    onSave: (clientMusculoskeletalHistory: any) => void;
}

const ClientMusculoskeletalHistoryFormValidationSchema = Yup.object({
    musculoskeletal_history: Yup.object({}),
});

const ClientMusculoskeletalHistoryFormInitialValues: IClientMusculoskeletalHistoryForm = {
    "musculoskeletal_history": {}
};

const ClientMusculoskeletalHistoryFormComponent = (props: ClientMusculoskeletalFormComponentProps) => {

    const {mode, onCancel, clientId, onSave} = props;
    const [clientMusculoskeletalHistoryFormInitialValues, setClientMusculoskeletalHistoryFormInitialValues] = useState<IClientMusculoskeletalHistoryForm>(_.cloneDeep(ClientMusculoskeletalHistoryFormInitialValues));
    const [isClientMusculoskeletalHistorySavingInProgress, setIsClientMusculoskeletalHistorySavingInProgress] = useState(false);
    const {musculoskeletalHistoryOptionsList} = useSelector((state: IRootReducerState) => state.staticData);
    const dispatch = useDispatch();

    const {
        clientMedicalDetails,
        isClientMedicalDetailsLoaded,
        isClientMedicalDetailsLoading,
        isClientMedicalDetailsLoadingFailed
    } = useSelector((state: IRootReducerState) => state.client);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        const payload = {...values, mode};
        setIsClientMusculoskeletalHistorySavingInProgress(true);
        CommonService._client.ClientMusculoskeletalHistoryAddAPICall(clientId, payload)
            .then((response: IAPIResponseType<IClientMusculoskeletalHistoryForm>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsClientMusculoskeletalHistorySavingInProgress(false);
                onSave(response);
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error);
                setIsClientMusculoskeletalHistorySavingInProgress(false);
            })
    }, [clientId, onSave, mode]);

    useEffect(() => {
        if (mode === "edit") {
            if (clientMedicalDetails) {
                setClientMusculoskeletalHistoryFormInitialValues({
                    musculoskeletal_history: clientMedicalDetails.musculoskeletal_history
                });
            } else {
                if (clientId) {
                    dispatch(getClientMedicalDetails(clientId));
                }
            }
        }
    }, [mode, clientId, dispatch, clientMedicalDetails]);

    return (
        <div className={'client-musculoskeletal-form-component'}>
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
                    <FormControlLabelComponent
                        label={CommonService.capitalizeFirstLetter(mode) + " Musculoskeletal History"}/>
                    <CardComponent title={"Musculoskeletal History"} description={"Has the client ever:"}>
                        <Formik
                            validationSchema={ClientMusculoskeletalHistoryFormValidationSchema}
                            initialValues={clientMusculoskeletalHistoryFormInitialValues}
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
                                            musculoskeletalHistoryOptionsList.map((question: IMusculoskeletalHistoryOption) => {
                                                const {_id, title} = question;
                                                return <div className="ts-row ts-align-items-center mrg-bottom-10"
                                                            key={_id}>
                                                    <div className="ts-col-md-6">
                                                        <div className={"mrg-bottom-10"}>
                                                            {title}
                                                        </div>
                                                        <Field name={`musculoskeletal_history.${_id}.value`}>
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
                                                    <div className="ts-col-md-6">
                                                        {
                                                            values.musculoskeletal_history[_id]?.value === "Yes" &&
                                                            <Field name={`musculoskeletal_history.${_id}.text`}>
                                                                {
                                                                    (field: FieldProps) => (
                                                                        <FormikTextAreaComponent
                                                                            label={"Please provide pertinent information here (date of injury, date of surgery, side of body, injury type, etc)."}
                                                                            placeholder={"Please provide pertinent information here (date of injury, date of surgery, side of body, injury type, etc)."}
                                                                            formikField={field}
                                                                            size={"small"}
                                                                            rows={2}
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
                                                disabled={isClientMusculoskeletalHistorySavingInProgress}
                                            >
                                                Cancel
                                            </ButtonComponent>&nbsp;
                                            <ButtonComponent
                                                isLoading={isClientMusculoskeletalHistorySavingInProgress}
                                                disabled={isClientMusculoskeletalHistorySavingInProgress || !isValid}
                                                type={"submit"}
                                            >
                                                {isClientMusculoskeletalHistorySavingInProgress ? "Saving" : "Save & Next"}
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

export default ClientMusculoskeletalHistoryFormComponent;