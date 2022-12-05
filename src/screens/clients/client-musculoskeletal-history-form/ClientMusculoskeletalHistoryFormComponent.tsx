import "./ClientMusculoskeletalHistoryFormComponent.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import * as Yup from "yup";
import {useCallback, useEffect, useState} from "react";
import _ from "lodash";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {Misc} from "../../../constants";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import FormikRadioButtonGroupComponent
    from "../../../shared/components/form-controls/formik-radio-button/FormikRadioButtonComponent";
import {IClientMusculoskeletalHistoryForm} from "../../../shared/models/client.model";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {IMusculoskeletalHistoryOption} from "../../../shared/models/common.model";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";

interface ClientMusculoskeletalFormComponentProps {
    clientId: number;
    mode: "add" | "edit";
    onSave: (clientMusculoskeletalHistory: any) => void;
}

const ClientMusculoskeletalHistoryFormValidationSchema = Yup.object({
    musculoskeletal_history: Yup.object({
    }),
});

const ClientMusculoskeletalHistoryFormInitialValues: IClientMusculoskeletalHistoryForm = {
    "musculoskeletal_history": {
    }
};

const ClientMusculoskeletalHistoryFormComponent = (props: ClientMusculoskeletalFormComponentProps) => {

    const {mode, clientId, onSave} = props;
    const [clientMusculoskeletalHistoryFormInitialValues] = useState<IClientMusculoskeletalHistoryForm>(_.cloneDeep(ClientMusculoskeletalHistoryFormInitialValues));
    const [isClientMusculoskeletalHistorySavingInProgress, setIsClientMusculoskeletalHistorySavingInProgress] = useState(false);
    const { musculoskeletalHistoryOptionsList } = useSelector((state: IRootReducerState)=> state.staticData);

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

    return (
        <div className={'client-musculoskeletal-form-component'}>
            <FormControlLabelComponent label={"Add Musculoskeletal History"}/>
            <CardComponent title={"Musculoskeletal History"} description={"Has the client ever:"}>
                <Formik
                    validationSchema={ClientMusculoskeletalHistoryFormValidationSchema}
                    initialValues={clientMusculoskeletalHistoryFormInitialValues}
                    onSubmit={onSubmit}
                    validateOnChange={false}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    validateOnMount={true}>
                    {({values,errors, isValid, validateForm}) => {
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        useEffect(() => {
                            validateForm();
                        }, [validateForm, values]);
                        return (
                            <Form noValidate={true} className={"t-form"}>
                                {
                                    musculoskeletalHistoryOptionsList.map((question: IMusculoskeletalHistoryOption) => {
                                        const {_id, title } = question;
                                        return <div className="ts-row ts-align-items-center mrg-bottom-10" key={_id}>
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
                                                    values.musculoskeletal_history[_id]?.value === "Yes" && <Field name={`musculoskeletal_history.${_id}.text`}>
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
                                    <LinkComponent route={CommonService._routeConfig.ClientList()}>
                                        <ButtonComponent
                                            variant={"outlined"}
                                            disabled={isClientMusculoskeletalHistorySavingInProgress}
                                        >
                                            Cancel
                                        </ButtonComponent>
                                    </LinkComponent>&nbsp;
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
        </div>
    );

};

export default ClientMusculoskeletalHistoryFormComponent;