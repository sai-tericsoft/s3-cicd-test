import "./ClientMedicalSupplementsFormComponent.scss";
import {IClientMedicalSupplementsForm} from "../../../shared/models/client.model";
import React, {useCallback, useEffect, useState} from "react";
import _ from "lodash";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {getClientMedicalDetails} from "../../../store/actions/client.action";

interface ClientMedicalSupplementsFormComponentProps {
    clientId: string;
    mode: "add" | "edit";
    onCancel: () => void;
    onNext?: () => void;
    onSave: (clientMedicalSupplementsDetails: any) => void;
}


// const ClientMedicalSupplementsValidationSchema = Yup.object({
//     medications: Yup.object({
//         prescription_medication: Yup.string().required('Input is required'),
//         non_prescription_medication: Yup.string().required('Input is required'),
//     }),
// });

const ClientMedicalSupplementsInitialValues: IClientMedicalSupplementsForm = {
    medications: {
        prescription_medication: "",
        non_prescription_medication: "",
    }
};

const ClientMedicalSupplementsFormComponent = (props: ClientMedicalSupplementsFormComponentProps) => {

    const {mode, onCancel, onNext, clientId, onSave} = props;
    const [clientMedicalSupplementsInitialValues, setClientMedicalSupplementsInitialValues] = useState<IClientMedicalSupplementsForm>(_.cloneDeep(ClientMedicalSupplementsInitialValues));
    const [isClientMedicalSupplementsSavingInProgress, setIsClientMedicalSupplementsSavingInProgress] = useState(false);

    const dispatch = useDispatch();

    const {
        clientMedicalDetails,
    } = useSelector((state: IRootReducerState) => state.client);


    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        const payload = {...values, mode};
        setIsClientMedicalSupplementsSavingInProgress(true);
        CommonService._client.ClientMedicalSupplementsAddAPICall(clientId, payload)
            .then((response: IAPIResponseType<IClientMedicalSupplementsForm>) => {
                if (clientId) {
                    dispatch(getClientMedicalDetails(clientId));
                }
                // CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsClientMedicalSupplementsSavingInProgress(false);
                setClientMedicalSupplementsInitialValues(_.cloneDeep(values));
                onSave(response);
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error, true);
                setIsClientMedicalSupplementsSavingInProgress(false);
            })
    }, [clientId, onSave, mode, dispatch]);

    useEffect(() => {
        if (clientMedicalDetails) {
            setClientMedicalSupplementsInitialValues({
                medications: clientMedicalDetails.medications
            });
        }
    }, [mode, clientId, dispatch, clientMedicalDetails]);

    return (
        <div className={'client-medical-supplements-form-component'}>
            {
                ((mode === "edit" && clientMedicalDetails) || mode === "add") && <>
                    <FormControlLabelComponent className={'add-medication-heading'}
                                               label={CommonService.capitalizeFirstLetter(mode) + " Medications/Supplements"}/>
                    <CardComponent title={"Medications/Supplements"}
                                   description={"Please list all prescription and non-prescription medications for the client:"}>
                        <Formik
                            // validationSchema={ClientMedicalSupplementsValidationSchema}
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
                                        <div>
                                            <Field name={`medications.prescription_medication`}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikTextAreaComponent
                                                            id={"prescription_input"}
                                                            label={"Prescription Medications"}
                                                            placeholder={"Enter your comments"}
                                                            // required={true}
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
                                                            id={"non_prescription_input"}
                                                            label={"Non-Prescription Medications / Supplements"}
                                                            placeholder={"Enter your comments"}
                                                            // required={true}
                                                            formikField={field}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                        <div className="t-form-actions">
                                            <ButtonComponent
                                                id={"home_btn"}
                                                variant={"outlined"}
                                                size={'large'}
                                                onClick={onCancel}
                                                disabled={isClientMedicalSupplementsSavingInProgress}
                                                className={(isClientMedicalSupplementsSavingInProgress ? 'mrg-right-15' : '')}

                                            >
                                                Previous
                                            </ButtonComponent>
                                            <ButtonComponent
                                                id={"save_next_btn"}
                                                className={'submit-cta'}
                                                size={'large'}
                                                isLoading={isClientMedicalSupplementsSavingInProgress}
                                                disabled={isClientMedicalSupplementsSavingInProgress || !isValid || CommonService.isEqual(values, clientMedicalSupplementsInitialValues)}
                                                type={"submit"}
                                            >
                                                {isClientMedicalSupplementsSavingInProgress ? "Saving" : "Save"}
                                            </ButtonComponent>

                                            <ButtonComponent
                                                className={'submit-cta'}
                                                size={'large'}
                                                id={"next_btn"}
                                                disabled={isClientMedicalSupplementsSavingInProgress || !CommonService.isEqual(values, clientMedicalSupplementsInitialValues)}
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

export default ClientMedicalSupplementsFormComponent;
