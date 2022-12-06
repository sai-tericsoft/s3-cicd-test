import "./ClientAllergiesFormComponent.scss";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import * as Yup from "yup";
import React, {useCallback, useEffect, useState} from "react";
import {IClientAllergiesForm} from "../../../shared/models/client.model";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {Misc} from "../../../constants";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {getClientMedicalDetails} from "../../../store/actions/client.action";
import _ from "lodash";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";

interface ClientAllergiesFormComponentProps {
    clientId: string;
    mode: "add" | "edit";
    onCancel: () => void;
    onSave: (clientAllergies: any) => void;
}

const ClientAllergiesValidationSchema = Yup.object({
    allergies: Yup.string().required('Allergies are required')
})

const ClientAllergiesFormInitialValues: IClientAllergiesForm = {
    allergies: ''
}

const ClientAllergiesFormComponent = (props: ClientAllergiesFormComponentProps) => {

    const {mode, onCancel, clientId, onSave} = props;
    const [clientAllergiesFormInitialValues, setClientAllergiesFormInitialValues] = useState<IClientAllergiesForm>(_.cloneDeep(ClientAllergiesFormInitialValues));
    const [isClientAllergiesSavingInProgress, setIsClientAllergiesSavingSavingInProgress] = useState(false);
    const dispatch = useDispatch();

    const {
        clientMedicalDetails,
        isClientMedicalDetailsLoaded,
        isClientMedicalDetailsLoading,
        isClientMedicalDetailsLoadingFailed
    } = useSelector((state: IRootReducerState) => state.client);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        const payload = {...values, mode};
        setIsClientAllergiesSavingSavingInProgress(true);
        CommonService._client.ClientAllergiesAddAPICall(clientId, payload)
            .then((response: IAPIResponseType<IClientAllergiesForm>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsClientAllergiesSavingSavingInProgress(false);
                onSave(response);
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error);
                setIsClientAllergiesSavingSavingInProgress(false);
            })
    }, [clientId, onSave, mode]);

    useEffect(() => {
        if (mode === "edit") {
            if (clientMedicalDetails) {
                setClientAllergiesFormInitialValues({
                    allergies: clientMedicalDetails.allergies
                });
            } else {
                if (clientId) {
                    dispatch(getClientMedicalDetails(clientId));
                }
            }
        }
    }, [mode, clientId, dispatch, clientMedicalDetails]);

    return (
        <div className={'client-allergies-form-component'}>
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
                    <FormControlLabelComponent label={CommonService.capitalizeFirstLetter(mode) + " Allergies"}/>
                    <CardComponent title={'Allergies'}
                                   description={"Please list all allergies for the client (ie. Medications, Food, Environmental, Insects, Adhesives, Etc.):"}>
                        <Formik initialValues={clientAllergiesFormInitialValues}
                                validationSchema={ClientAllergiesValidationSchema}
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
                                        <Field name={'allergies'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikTextAreaComponent formikField={field}
                                                                             label={'Allergies'}
                                                                             required={true}
                                                                             fullWidth={true}
                                                                             placeholder={'Allergies'}/>
                                                )
                                            }
                                        </Field>
                                        <div className="t-form-actions">
                                            <ButtonComponent
                                                variant={"outlined"}
                                                disabled={isClientAllergiesSavingInProgress}
                                                onClick={onCancel}
                                            >
                                                Cancel
                                            </ButtonComponent>&nbsp;
                                            <ButtonComponent
                                                isLoading={isClientAllergiesSavingInProgress}
                                                disabled={isClientAllergiesSavingInProgress || !isValid}
                                                type={"submit"}
                                            >
                                                {isClientAllergiesSavingInProgress ? "Saving" : "Save & Next"}
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

export default ClientAllergiesFormComponent;