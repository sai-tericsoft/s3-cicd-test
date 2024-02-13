import "./ClientMedicalProviderInformationFormComponent.scss";
import {IClientMedicalProviderForm} from "../../../shared/models/client.model";
import React, {useCallback, useEffect, useState} from "react";
import _ from "lodash";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import FormikDatePickerComponent
    from "../../../shared/components/form-controls/formik-date-picker/FormikDatePickerComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import FormikPhoneInputComponent
    from "../../../shared/components/form-controls/formik-phone-input/FormikPhoneInputComponent";
import {getClientMedicalDetails} from "../../../store/actions/client.action";
import * as Yup from "yup";

interface ClientMedicalProviderInformationFormComponentProps {
    clientId: string;
    mode: "add" | "edit";
    onCancel: () => void;
    onSave: (clientMedicalProviderInformationDetails: any) => void;
    onNext?: () => void;
}

const ClientMedicalProviderInformationValidationSchema = Yup.object({
    medical_provider_info: Yup.object({
        md_phone: Yup.string()
            .test('is-ten-digits', 'Phone number must contain exactly 10 digits', (value:any) => {
                return value?.length === 10
            }),
        primary_phone:Yup.string()
            .test('is-ten-digits', 'Phone number must contain exactly 10 digits', (value:any) => {
                return value?.length === 10
            }),
    }),
});

const ClientMedicalProviderInformationInitialValues: IClientMedicalProviderForm = {
    medical_provider_info: {
        family_doctor_name: "",
        md_phone: "",
        last_examination_date: "",
        referring_doctor_name: "",
        primary_phone: ""

    }
};

const ClientMedicalProviderInformationFormComponent = (props: ClientMedicalProviderInformationFormComponentProps) => {

        const {mode, onCancel, clientId, onSave, onNext} = props;
        const [clientMedicalProviderInformationInitialValues, setClientMedicalProviderInformationInitialValues] = useState<IClientMedicalProviderForm>(_.cloneDeep(ClientMedicalProviderInformationInitialValues));
        const [isClientMedicalProviderInformationSavingInProgress, setIsClientMedicalProviderInformationSavingInProgress] = useState(false);
        const dispatch = useDispatch();
        const {
            clientMedicalDetails
        } = useSelector((state: IRootReducerState) => state.client);

        const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
            const payload = {...values, mode};
            // payload.medical_provider_info.last_examination_date = CommonService.convertDateFormat(payload.medical_provider_info.last_examination_date);
            setIsClientMedicalProviderInformationSavingInProgress(true);
            CommonService._client.ClientMedicalProviderInformationAddAPICall(clientId, payload)
                .then((response: IAPIResponseType<IClientMedicalProviderForm>) => {
                    if (clientId) {
                        dispatch(getClientMedicalDetails(clientId));
                    }
                    // CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    setIsClientMedicalProviderInformationSavingInProgress(false);
                    setClientMedicalProviderInformationInitialValues(_.cloneDeep(values));
                    onSave(response);
                })
                .catch((error: any) => {
                    CommonService.handleErrors(setErrors, error);
                    setIsClientMedicalProviderInformationSavingInProgress(false);
                })
        }, [clientId, onSave, mode, dispatch]);

        useEffect(() => {
                if (clientMedicalDetails) {
                    setClientMedicalProviderInformationInitialValues({
                        medical_provider_info: clientMedicalDetails.medical_provider_info
                    });
                }
            }, [mode, clientId, dispatch, clientMedicalDetails]
        );

        return (
            <div className={'client-medical-provider-information-form-component'}>
                {
                    ((mode === "edit" && clientMedicalDetails) || mode === "add") && <>
                        <FormControlLabelComponent className={'add-medical-provider-information-heading'}
                                                   label={CommonService.capitalizeFirstLetter(mode) + " Medical Provider Information"}/>
                        <CardComponent title={"Medical Provider Information"}>
                            <Formik
                                validationSchema={ClientMedicalProviderInformationValidationSchema}
                                initialValues={clientMedicalProviderInformationInitialValues}
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
                                            <FormControlLabelComponent label={"Family Doctor"}/>
                                            <div className="ts-row">
                                                <div className="ts-col-md-6 ts-col-lg-4">
                                                    <Field name={`medical_provider_info.family_doctor_name`}>
                                                        {
                                                            (field: FieldProps) => (
                                                                <FormikInputComponent
                                                                    label={"Full Name"}
                                                                    placeholder={'E.g. John Doe'}
                                                                    // required={true}
                                                                    formikField={field}
                                                                    fullWidth={true}
                                                                />
                                                            )
                                                        }
                                                    </Field>
                                                </div>
                                                <div className="ts-col-md-6 ts-col-lg-4">
                                                    <Field name={`medical_provider_info.md_phone`}>
                                                        {
                                                            (field: FieldProps) => (
                                                                <FormikPhoneInputComponent
                                                                    label={"MD Phone"}
                                                                    // disabled={!values?.medical_provider_info?.family_doctor_name}
                                                                    // placeholder={"MD Phone"}
                                                                    // required={true}
                                                                    formikField={field}
                                                                    fullWidth={true}
                                                                />
                                                            )
                                                        }
                                                    </Field>
                                                </div>
                                            </div>
                                            <FormControlLabelComponent label={'Referring Doctor'}/>
                                            <div className="ts-row">
                                                <div className="ts-col-md-6 ts-col-lg-4">
                                                    <Field name={`medical_provider_info.referring_doctor_name`}>
                                                        {
                                                            (field: FieldProps) => (
                                                                <FormikInputComponent
                                                                    label={"Full Name"}
                                                                    placeholder={'E.g. John Doe'}
                                                                    // required={true}
                                                                    formikField={field}
                                                                    fullWidth={true}
                                                                />
                                                            )
                                                        }
                                                    </Field>
                                                </div>
                                                <div className="ts-col-md-6 ts-col-lg-4">
                                                    <Field name={`medical_provider_info.primary_phone`}>
                                                        {
                                                            (field: FieldProps) => (
                                                                <FormikPhoneInputComponent
                                                                    label={"MD Phone"}
                                                                    // required={true}
                                                                    formikField={field}
                                                                    fullWidth={true}
                                                                />
                                                            )
                                                        }
                                                    </Field>
                                                </div>
                                            </div>
                                            <FormControlLabelComponent label={"Date of Last Physical Examination"}/>
                                            <div className="ts-row">
                                                <div className="ts-col-md-6 ts-col-lg-4">
                                                    <Field name={`medical_provider_info.last_examination_date`}>
                                                        {
                                                            (field: FieldProps) => (
                                                                <FormikDatePickerComponent
                                                                    label={"Date"}
                                                                    placeholder={"Date"}
                                                                    // required={true}
                                                                    maxDate={CommonService._staticData.today}
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
                                                    id={"home_btn"}
                                                    variant={"outlined"}
                                                    size={'large'}
                                                    onClick={onCancel}
                                                    disabled={isClientMedicalProviderInformationSavingInProgress}
                                                    className={(isClientMedicalProviderInformationSavingInProgress ? 'mrg-right-15' : '')}
                                                >
                                                    Previous
                                                </ButtonComponent>
                                                <ButtonComponent
                                                    id={"save_next_btn"}
                                                    className={'submit-cta'}
                                                    size={'large'}
                                                    isLoading={isClientMedicalProviderInformationSavingInProgress}
                                                    disabled={isClientMedicalProviderInformationSavingInProgress || !isValid || CommonService.isEqual(values, clientMedicalProviderInformationInitialValues)}
                                                    type={"submit"}
                                                >
                                                    {isClientMedicalProviderInformationSavingInProgress ? "Saving" : "Save" }
                                                </ButtonComponent>
                                                <ButtonComponent
                                                    className={'submit-cta'}
                                                    size={'large'}
                                                    id={"next_btn"}
                                                    disabled={isClientMedicalProviderInformationSavingInProgress  }
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

    }
;

export default ClientMedicalProviderInformationFormComponent;
