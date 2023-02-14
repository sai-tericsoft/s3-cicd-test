import "./ClientRegistrationMedicalHistorySurgicalHistoryComponent.scss";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../store/reducers";
import {IClientSurgicalHistoryForm} from "../../shared/models/client.model";
import _ from "lodash";
import * as Yup from "yup";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import React, {useCallback, useEffect, useState} from "react";
import {CommonService} from "../../shared/services";
import {IAPIResponseType} from "../../shared/models/api.model";
import FormikTextAreaComponent from "../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import FormikCheckBoxComponent from "../../shared/components/form-controls/formik-check-box/FormikCheckBoxComponent";
import {Misc} from "../../constants";
import {ISurgicalHistoryOption} from "../../shared/models/common.model";
import ButtonComponent from "../../shared/components/button/ButtonComponent";
import CheckBoxComponent from "../../shared/components/form-controls/check-box/CheckBoxComponent";

interface ClientRegistrationMedicalHistorySurgicalHistoryComponentProps {
    onNext?: () => void;
}


const ClientSurgicalHistoryValidationSchema = Yup.object({
    surgical_history: Yup.object({
        isCustomOption: Yup.boolean().nullable(),
        questions: Yup.array().nullable().when("isCustomOption", {
            is: false,
            then: Yup.array().min(1, 'Surgical history is required'),
            otherwise: Yup.array().nullable()
        }),
        comments: Yup.string().when("isCustomOption", {
            is: true,
            then: Yup.string().required('Comments is required'),
            otherwise: Yup.string().nullable()
        })
    }),
});

const ClientSurgicalHistoryInitialValues: any = {
    surgical_history: {
        questions: [],
        isCustomOption: false,
        comments: ""
    }
};

const ClientRegistrationMedicalHistorySurgicalHistoryComponent = (props: ClientRegistrationMedicalHistorySurgicalHistoryComponentProps) => {

    const {onNext} = props;
    const {surgicalHistoryOptionsList} = useSelector((state: IRootReducerState) => state.staticData);
    const [clientSurgicalHistoryInitialValues, setClientSurgicalHistoryInitialValues] = useState<IClientSurgicalHistoryForm>(_.cloneDeep(ClientSurgicalHistoryInitialValues));

    const onSubmit = useCallback((values: any, {setErrors, setSubmitting}: FormikHelpers<any>) => {
        const payload = {...CommonService.removeKeysFromJSON(_.cloneDeep(values), ['questions_details'])};
        setSubmitting(true);
        CommonService._client.ClientSurgicalHistoryAddAPICall(payload)
            .then((response: IAPIResponseType<any>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setSubmitting(false);
                setClientSurgicalHistoryInitialValues(_.cloneDeep(values));
                onNext();
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error, true);
                setSubmitting(false);
            })
    }, [onNext]);

    const handleSurgicalHistoryOptionSelection = useCallback((optionId: string, selectedOptions: string[]) => {
        const options = _.cloneDeep(selectedOptions);
        const index = options?.findIndex((value: string) => value === optionId);
        if (index > -1) {
            options.splice(index, 1);
        } else {
            options.push(optionId);
        }
        return options;
    }, []);

    return (
        <div className={'client-registration-medical-history-surgical-history-component'}>
            <Formik
                validationSchema={ClientSurgicalHistoryValidationSchema}
                initialValues={clientSurgicalHistoryInitialValues}
                onSubmit={onSubmit}
                validateOnChange={false}
                validateOnBlur={true}
                enableReinitialize={true}
                validateOnMount={true}>
                {({values, errors, setFieldTouched, setFieldValue, setFieldError, isValid, validateForm}) => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    useEffect(() => {
                        console.log(values);
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
                                                        id={'cb_' + option?.title}
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
                                                id={"other_cb"}
                                                formikField={field}
                                                label={"Other Surgery not Listed?"}
                                                onChange={(isChecked) => {
                                                    if (!isChecked) {
                                                        setFieldValue('surgical_history.comments', "");
                                                        setFieldError('surgical_history.comments', undefined);
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
                            {values.surgical_history?.isCustomOption && <div className="ts-row">
                                <div className="ts-col-12">
                                    <Field name={`surgical_history.comments`}>
                                        {
                                            (field: FieldProps) => (
                                                <FormikTextAreaComponent
                                                    id={"comments"}
                                                    label={"Comments"}
                                                    placeholder={"Enter your comments here"}
                                                    disabled={!values.surgical_history?.isCustomOption}
                                                    required={values.surgical_history?.isCustomOption}
                                                    formikField={field}
                                                    fullWidth={true}
                                                />
                                            )
                                        }
                                    </Field>
                                </div>
                            </div>}
                            <div className="t-form-actions">
                                <ButtonComponent
                                    id={"home_btn"}
                                    variant={"outlined"}
                                    onClick={onCancel}
                                    disabled={isClientSurgicalHistorySavingInProgress}
                                >
                                    Home
                                </ButtonComponent>&nbsp;
                                <ButtonComponent
                                    id={"save_next_btn"}
                                    isLoading={isClientSurgicalHistorySavingInProgress}
                                    disabled={isClientSurgicalHistorySavingInProgress || !isValid || CommonService.isEqual(values, clientSurgicalHistoryInitialValues)}
                                    type={"submit"}
                                >
                                    {isClientSurgicalHistorySavingInProgress ? "Saving" : <>{mode === "add" ? "Save & Next" : "Save"}</>}
                                </ButtonComponent>
                                {
                                    mode === "edit" && <>
                                        &nbsp;&nbsp;<ButtonComponent
                                        id={"next_btn"}
                                        disabled={isClientSurgicalHistorySavingInProgress || !CommonService.isEqual(values, clientSurgicalHistoryInitialValues)}
                                        onClick={onNext}
                                    >
                                        Next
                                    </ButtonComponent>
                                    </>
                                }
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    );

};

export default ClientRegistrationMedicalHistorySurgicalHistoryComponent;
