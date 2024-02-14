import "./ClientMedicalHistoryFormComponent.scss";
import * as Yup from "yup";
import {IClientMedicalHistoryForm} from "../../../shared/models/client.model";
import React, {useCallback, useEffect, useState} from "react";
import _ from "lodash";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {IMedicalHistoryOption} from "../../../shared/models/common.model";
import CheckBoxComponent from "../../../shared/components/form-controls/check-box/CheckBoxComponent";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import FormikCheckBoxComponent from "../../../shared/components/form-controls/formik-check-box/FormikCheckBoxComponent";
import {getClientMedicalDetails} from "../../../store/actions/client.action";

interface ClientMedicalHistoryFormComponentProps {
    clientId: string;
    mode: "add" | "edit";
    onCancel: () => void;
    onNext?: () => void;
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
            then: Yup.string().required('Input is required'),
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

    const {mode, onCancel, onNext, clientId, onSave} = props;
    const {medicalHistoryOptionsList} = useSelector((state: IRootReducerState) => state.staticData);
    const [clientMedicalHistoryInitialValues, SetClientMedicalHistoryInitialValues] = useState<IClientMedicalHistoryForm>(_.cloneDeep(ClientMedicalHistoryInitialValues));
    const [isClientMedicalHistorySavingInProgress, setIsClientMedicalHistorySavingInProgress] = useState(false);

    const dispatch = useDispatch();

    const {
        clientMedicalDetails,
    } = useSelector((state: IRootReducerState) => state.client);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        const payload = {...CommonService.removeKeysFromJSON(_.cloneDeep(values), ['questions_details']), mode};
        setIsClientMedicalHistorySavingInProgress(true);
        CommonService._client.ClientMedicalHistoryAddAPICall(clientId, payload)
            .then((response: IAPIResponseType<IClientMedicalHistoryForm>) => {
                if (clientId) {
                    dispatch(getClientMedicalDetails(clientId));
                }
                // CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsClientMedicalHistorySavingInProgress(false);
                SetClientMedicalHistoryInitialValues(_.cloneDeep(values));
                onSave(response);
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error, true);
                setIsClientMedicalHistorySavingInProgress(false);
            })
    }, [clientId, onSave, mode, dispatch]);

    useEffect(() => {
        if (clientMedicalDetails) {
            if (clientMedicalDetails?.medical_history?.comments) {
                clientMedicalDetails.medical_history.isCustomOption = true;
            }
            SetClientMedicalHistoryInitialValues({
                medical_history: clientMedicalDetails.medical_history || []
            });
        }
    }, [mode, clientId, dispatch, clientMedicalDetails]);


    const handleMedicalHistoryOptionSelection = useCallback((optionId: string, selectedOptions: string[]) => {
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
        <div className={'client-medical-history-form-component'}>
            {
                ((mode === "edit" && clientMedicalDetails) || mode === "add") && <>
                    <FormControlLabelComponent className={'add-medical-history-heading'}
                                               label={CommonService.capitalizeFirstLetter(mode) + " Medical History"}/>
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
                                    <CardComponent title={"Medical History"}
                                                   description={"Has the client ever had or do they currently have: (Check all that apply)"}>

                                        <div className="ts-row">
                                            {
                                                medicalHistoryOptionsList?.map((option: IMedicalHistoryOption) => {
                                                    return <div className="ts-col-md-6" key={option?._id}>
                                                        <Field
                                                            name={"medical_history.questions"}>
                                                            {(field: FieldProps) => (
                                                                <CheckBoxComponent
                                                                    id={'cb_' + option?.title}
                                                                    label={option?.title + '?'}
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
                                        {values.medical_history?.isCustomOption && <div className="ts-row mrg-top-10">
                                            <div className="ts-col-12">
                                                <Field name={`medical_history.comments`}>
                                                    {
                                                        (field: FieldProps) => (
                                                            <FormikTextAreaComponent
                                                                label={"Other Illnesses/Conditions"}
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
                                        </div>}
                                    </CardComponent>
                                    <div className="t-form-actions">
                                        <ButtonComponent
                                            id={"home_btn"}
                                            variant={"outlined"}
                                            size={'large'}
                                            onClick={onCancel}
                                            disabled={isClientMedicalHistorySavingInProgress}
                                            className={(isClientMedicalHistorySavingInProgress ? 'mrg-right-15' : '')}
                                        >
                                            Previous
                                        </ButtonComponent>
                                        <ButtonComponent
                                            id={"save_next_btn"}
                                            className={'submit-cta'}
                                            size={'large'}
                                            isLoading={isClientMedicalHistorySavingInProgress}
                                            disabled={isClientMedicalHistorySavingInProgress || !isValid || CommonService.isEqual(values, clientMedicalHistoryInitialValues)}
                                            type={"submit"}
                                        >
                                            {isClientMedicalHistorySavingInProgress ? "Saving" : "Save"}
                                        </ButtonComponent>
                                        <ButtonComponent
                                            id={"next_btn"}
                                            className={'submit-cta'}
                                            size={'large'}
                                            disabled={isClientMedicalHistorySavingInProgress || !CommonService.isEqual(values, clientMedicalHistoryInitialValues)}
                                            onClick={onNext}
                                        >
                                            Next
                                        </ButtonComponent>

                                    </div>
                                </Form>
                            )
                        }}
                    </Formik>
                </>
            }
        </div>
    );

};

export default ClientMedicalHistoryFormComponent;
