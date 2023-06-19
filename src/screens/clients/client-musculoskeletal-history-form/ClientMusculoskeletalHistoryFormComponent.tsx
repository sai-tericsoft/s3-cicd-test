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

interface ClientMusculoskeletalFormComponentProps {
    clientId: string;
    mode: "add" | "edit";
    onCancel: () => void;
    onNext?: () => void;
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
    } = useSelector((state: IRootReducerState) => state.client);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        const payload = {...values, mode};
        setIsClientMusculoskeletalHistorySavingInProgress(true);
        CommonService._client.ClientMusculoskeletalHistoryAddAPICall(clientId, payload)
            .then((response: IAPIResponseType<IClientMusculoskeletalHistoryForm>) => {
                if (clientId) {
                    dispatch(getClientMedicalDetails(clientId));
                }
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsClientMusculoskeletalHistorySavingInProgress(false);
                setClientMusculoskeletalHistoryFormInitialValues(_.cloneDeep(values));
                onSave(response);
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error);
                setIsClientMusculoskeletalHistorySavingInProgress(false);
            })
    }, [clientId, onSave, mode, dispatch]);

    useEffect(() => {
        if (clientMedicalDetails) {
            setClientMusculoskeletalHistoryFormInitialValues({
                musculoskeletal_history: clientMedicalDetails?.musculoskeletal_history
            });
        }
    }, [mode, clientId, dispatch, clientMedicalDetails]);

    return (
        <div className={'client-musculoskeletal-form-component'}>
            {
                ((mode === "edit" && clientMedicalDetails) || mode === "add") && <>
                    <FormControlLabelComponent className={'add-musculoskeletal-history-heading'}
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
                            {({values, setFieldValue, isValid, validateForm}) => {
                                // eslint-disable-next-line react-hooks/rules-of-hooks
                                useEffect(() => {
                                    validateForm();
                                }, [validateForm, values]);
                                return (
                                    <Form noValidate={true} className={"t-form"}>
                                        {
                                            musculoskeletalHistoryOptionsList?.map((question: IMusculoskeletalHistoryOption) => {
                                                const {_id, title, placeholder} = question;
                                                return <>
                                                    <div className="ts-row mrg-top-10 mrg-bottom-10"
                                                         key={_id}>
                                                        <div className="ts-col-md-4">
                                                            <div className={"mrg-bottom-10"}>
                                                                {title}
                                                            </div>
                                                            <Field name={`musculoskeletal_history.${_id}.value`}>
                                                                {
                                                                    (field: FieldProps) => (
                                                                        <FormikRadioButtonGroupComponent
                                                                            options={CommonService._staticData.yesNoOptions}
                                                                            displayWith={(option) => option.title}
                                                                            valueExtractor={(option) => option.title}
                                                                            required={true}
                                                                            formikField={field}
                                                                            id={"musculos"}
                                                                            onChange={(value) => {
                                                                                console.log(value);
                                                                                if (value === "No") {
                                                                                    setFieldValue(`musculoskeletal_history.${_id}.text`, undefined);
                                                                                }
                                                                            }}
                                                                        />
                                                                    )
                                                                }
                                                            </Field>
                                                        </div>
                                                        <div className={"ts-col-md-8"}>
                                                            {
                                                                values.musculoskeletal_history[_id]?.value === "Yes" &&
                                                                <Field name={`musculoskeletal_history.${_id}.text`}>
                                                                    {
                                                                        (field: FieldProps) => (
                                                                            <FormikTextAreaComponent
                                                                                id={"musculos_input"}
                                                                                label={placeholder}
                                                                                placeholder={placeholder}
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
                                                </>
                                            })
                                        }
                                        <div className="t-form-actions">
                                            <ButtonComponent
                                                id={"home_btn"}
                                                variant={"outlined"}
                                                size={'large'}
                                                onClick={onCancel}
                                                disabled={isClientMusculoskeletalHistorySavingInProgress}
                                                className={(isClientMusculoskeletalHistorySavingInProgress ? 'mrg-right-15' : '')}
                                            >
                                                Previous
                                            </ButtonComponent>
                                            <ButtonComponent
                                                id={"save_next_btn"}
                                                className={'submit-cta'}
                                                size={'large'}
                                                isLoading={isClientMusculoskeletalHistorySavingInProgress}
                                                disabled={isClientMusculoskeletalHistorySavingInProgress || !isValid || CommonService.isEqual(values, clientMusculoskeletalHistoryFormInitialValues)}
                                                type={"submit"}
                                            >
                                                {isClientMusculoskeletalHistorySavingInProgress ? "Saving" : "Save"}
                                            </ButtonComponent>
                                            {/*<ButtonComponent*/}
                                            {/*    className={'submit-cta'}*/}
                                            {/*    size={'large'}*/}
                                            {/*    id={"next_btn"}*/}
                                            {/*    onClick={onNext}*/}
                                            {/*    disabled={mode === 'add' ? false : true}*/}
                                            {/*>*/}
                                            {/*    Next*/}
                                            {/*</ButtonComponent>*/}
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
