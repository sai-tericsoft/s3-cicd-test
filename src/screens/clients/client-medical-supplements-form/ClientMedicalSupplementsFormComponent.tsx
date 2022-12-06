import "./ClientMedicalSupplementsFormComponent.scss";
import * as Yup from "yup";
import {IClientMedicalSupplementsForm} from "../../../shared/models/client.model";
import React, {useCallback, useEffect, useState} from "react";
import _ from "lodash";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {Misc} from "../../../constants";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {getClientMedicalDetails} from "../../../store/actions/client.action";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-component/StatusCardComponent";

interface ClientMedicalSupplementsFormComponentProps {
    clientId: string;
    mode: "add" | "edit";
    onCancel: () => void;
    onSave: (clientMedicalSupplementsDetails: any) => void;
}


const ClientMedicalSupplementsValidationSchema = Yup.object({
    medications: Yup.object({
        prescription_medication: Yup.string().required('Prescription Medication is required'),
        non_prescription_medication: Yup.string().required('Non Prescription Medication is required'),
    }),
});

const ClientMedicalSupplementsInitialValues: IClientMedicalSupplementsForm = {
    medications: {
        prescription_medication: "",
        non_prescription_medication: "",
    }
};

const ClientMedicalSupplementsFormComponent = (props: ClientMedicalSupplementsFormComponentProps) => {

    const {mode, onCancel, clientId, onSave} = props;
    const [clientMedicalSupplementsInitialValues, setClientMedicalSupplementsInitialValues] = useState<IClientMedicalSupplementsForm>(_.cloneDeep(ClientMedicalSupplementsInitialValues));
    const [isClientMedicalSupplementsSavingInProgress, setIsClientMedicalSupplementsSavingInProgress] = useState(false);

    const dispatch = useDispatch();

    const {
        clientMedicalDetails,
        isClientMedicalDetailsLoaded,
        isClientMedicalDetailsLoading,
        isClientMedicalDetailsLoadingFailed
    } = useSelector((state: IRootReducerState) => state.client);


    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        const payload = {...values, mode};
        setIsClientMedicalSupplementsSavingInProgress(true);
        CommonService._client.ClientMedicalSupplementsAddAPICall(clientId, payload)
            .then((response: IAPIResponseType<IClientMedicalSupplementsForm>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsClientMedicalSupplementsSavingInProgress(false);
                onSave(response);
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error);
                setIsClientMedicalSupplementsSavingInProgress(false);
            })
    }, [clientId, onSave, mode]);

    useEffect(() => {
        if (mode === "edit") {
            if (clientMedicalDetails) {
                setClientMedicalSupplementsInitialValues({
                    medications: clientMedicalDetails.medications
                });
            } else {
                if (clientId) {
                    dispatch(getClientMedicalDetails(clientId));
                }
            }
        }
    }, [mode, clientId, dispatch, clientMedicalDetails]);

    return (
        <div className={'client-medical-supplements-form-component'}>
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
                    <FormControlLabelComponent label={CommonService.capitalizeFirstLetter(mode) + " Medications/Supplements"}/>
                    <CardComponent title={"Medications/Supplements"}
                                   description={"Please list all prescription and non-prescription medications for the client:"}>
                        <Formik
                            validationSchema={ClientMedicalSupplementsValidationSchema}
                            initialValues={clientMedicalSupplementsInitialValues}
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
                                        <div className="ts-row">
                                            <div className="ts-col-12">
                                                <Field name={`medications.prescription_medication`}>
                                                    {
                                                        (field: FieldProps) => (
                                                            <FormikTextAreaComponent
                                                                label={"Prescription Medications"}
                                                                placeholder={"Prescription Medications"}
                                                                required={true}
                                                                formikField={field}
                                                                fullWidth={true}
                                                            />
                                                        )
                                                    }
                                                </Field>
                                                <Field name={`medications.non_prescription_medication`}>
                                                    {
                                                        (field: FieldProps) => (
                                                            <FormikTextAreaComponent
                                                                label={"Non-Prescription Medications / Supplements"}
                                                                placeholder={"Non-Prescription Medications / Supplements"}
                                                                required={true}
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
                                                disabled={isClientMedicalSupplementsSavingInProgress}
                                            >
                                                Cancel
                                            </ButtonComponent>&nbsp;
                                            <ButtonComponent
                                                isLoading={isClientMedicalSupplementsSavingInProgress}
                                                disabled={isClientMedicalSupplementsSavingInProgress || !isValid}
                                                type={"submit"}
                                            >
                                                {isClientMedicalSupplementsSavingInProgress ? "Saving" : "Save & Next"}
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

export default ClientMedicalSupplementsFormComponent;