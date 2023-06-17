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
import _ from "lodash";
import {getClientMedicalDetails} from "../../../store/actions/client.action";

interface ClientAllergiesFormComponentProps {
    clientId: string;
    mode: "add" | "edit";
    onCancel: () => void;
    onNext?: () => void;
    onSave: (clientAllergies: any) => void;
}

const ClientAllergiesValidationSchema = Yup.object({
    allergies: Yup.string().required('Input is required')
})

const ClientAllergiesFormInitialValues: IClientAllergiesForm = {
    allergies: ''
}

const ClientAllergiesFormComponent = (props: ClientAllergiesFormComponentProps) => {

    const {mode, onCancel, onNext, clientId, onSave} = props;
    const [clientAllergiesFormInitialValues, setClientAllergiesFormInitialValues] = useState<IClientAllergiesForm>(_.cloneDeep(ClientAllergiesFormInitialValues));
    const [isClientAllergiesSavingInProgress, setIsClientAllergiesSavingSavingInProgress] = useState(false);
    const dispatch = useDispatch();

    const {
        clientMedicalDetails,
    } = useSelector((state: IRootReducerState) => state.client);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        const payload = {...values, mode};
        setIsClientAllergiesSavingSavingInProgress(true);
        CommonService._client.ClientAllergiesAddAPICall(clientId, payload)
            .then((response: IAPIResponseType<IClientAllergiesForm>) => {
                if (clientId) {
                    dispatch(getClientMedicalDetails(clientId));
                }
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsClientAllergiesSavingSavingInProgress(false);
                setClientAllergiesFormInitialValues(_.cloneDeep(values));
                onSave(response);
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error);
                setIsClientAllergiesSavingSavingInProgress(false);
            })
    }, [clientId, onSave, mode, dispatch]);

    useEffect(() => {
        if (clientMedicalDetails && clientMedicalDetails.allergies) {
            setClientAllergiesFormInitialValues({
                allergies: clientMedicalDetails?.allergies
            });
        }
    }, [clientId, dispatch, clientMedicalDetails]);

    return (
        <div className={'client-allergies-form-component'}>
            {
                ((mode === "edit" && clientMedicalDetails) || mode === "add") && <>
                    <FormControlLabelComponent className={'add-allergies-heading'}
                                               label={CommonService.capitalizeFirstLetter(mode) + " Allergies"}/>
                    <CardComponent title={'Allergies'}
                                   description={"Please list all allergies for the client (i.e. Medications, Food, Environmental, Insects, Adhesives, etc.):"}>
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
                                                    <FormikTextAreaComponent
                                                        id={'allergies_input'}
                                                        formikField={field}
                                                        label={'Allergies'}
                                                        required={true}
                                                        fullWidth={true}
                                                        placeholder={'Enter your comments here'}/>
                                                )
                                            }
                                        </Field>
                                        <div className="t-form-actions">
                                            <ButtonComponent
                                                id={"home"}
                                                variant={"outlined"}
                                                size={'large'}
                                                disabled={isClientAllergiesSavingInProgress}
                                                onClick={onCancel}
                                                className={(isClientAllergiesSavingInProgress ? 'mrg-right-15' : '')}
                                            >
                                                Previous
                                            </ButtonComponent>
                                            <ButtonComponent
                                                id={"save_next_btn"}
                                                size={'large'}
                                                className={'submit-cta'}
                                                isLoading={isClientAllergiesSavingInProgress}
                                                disabled={isClientAllergiesSavingInProgress || !isValid || CommonService.isEqual(values, clientAllergiesFormInitialValues)}
                                                type={"submit"}
                                            >
                                                {isClientAllergiesSavingInProgress ? "Saving" : "Save"}
                                            </ButtonComponent>
                                            <ButtonComponent
                                                size={'large'}
                                                className={'submit-cta'}
                                                id={"next_btn"}
                                                disabled={isClientAllergiesSavingInProgress || !CommonService.isEqual(values, clientAllergiesFormInitialValues)}
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

export default ClientAllergiesFormComponent;
