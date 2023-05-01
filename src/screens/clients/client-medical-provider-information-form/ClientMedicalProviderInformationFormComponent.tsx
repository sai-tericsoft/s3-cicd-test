import "./ClientMedicalProviderInformationFormComponent.scss";
import * as Yup from "yup";
import {IClientMedicalProviderForm} from "../../../shared/models/client.model";
import React, {useCallback, useEffect, useState} from "react";
import _ from "lodash";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {Misc} from "../../../constants";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import FormikDatePickerComponent
    from "../../../shared/components/form-controls/formik-date-picker/FormikDatePickerComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {getClientMedicalDetails} from "../../../store/actions/client.action";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";

interface ClientMedicalProviderInformationFormComponentProps {
    clientId: string;
    mode: "add" | "edit";
    onCancel: () => void;
    onSave: (clientMedicalProviderInformationDetails: any) => void;
}

const ClientMedicalProviderInformationValidationSchema = Yup.object({
    medical_provider_info: Yup.object({
        name: Yup.string().required('Name is required'),
        primary_phone: Yup.string().required('Primary Phone is required'),
        last_examination_date: Yup.string().required('Last Examination Date is required'),
    }),
});

const ClientMedicalProviderInformationInitialValues: IClientMedicalProviderForm = {
    medical_provider_info: {
        name: "",
        primary_phone: "",
        last_examination_date: "",
        referring_name:"",
        phone_number:""

    }
};

const ClientMedicalProviderInformationFormComponent = (props: ClientMedicalProviderInformationFormComponentProps) => {

    const {mode, onCancel, clientId, onSave} = props;
    const [clientMedicalProviderInformationInitialValues, setClientMedicalProviderInformationInitialValues] = useState<IClientMedicalProviderForm>(_.cloneDeep(ClientMedicalProviderInformationInitialValues));
    const [isClientMedicalProviderInformationSavingInProgress, setIsClientMedicalProviderInformationSavingInProgress] = useState(false);
    const dispatch = useDispatch();
    const {
        clientMedicalDetails,
        isClientMedicalDetailsLoaded,
        isClientMedicalDetailsLoading,
        isClientMedicalDetailsLoadingFailed
    } = useSelector((state: IRootReducerState) => state.client);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        const payload = {...values, mode};
        payload.medical_provider_info.last_examination_date = CommonService.convertDateFormat(payload.medical_provider_info.last_examination_date);
        setIsClientMedicalProviderInformationSavingInProgress(true);
        CommonService._client.ClientMedicalProviderInformationAddAPICall(clientId, payload)
            .then((response: IAPIResponseType<IClientMedicalProviderForm>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsClientMedicalProviderInformationSavingInProgress(false);
                setClientMedicalProviderInformationInitialValues(_.cloneDeep(values));
                onSave(response);
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error);
                setIsClientMedicalProviderInformationSavingInProgress(false);
            })
    }, [clientId, onSave, mode]);

    useEffect(() => {
        if (mode === "edit") {
            if (clientMedicalDetails) {
                setClientMedicalProviderInformationInitialValues({
                    medical_provider_info: clientMedicalDetails.medical_provider_info
                });
            } else {
                if (clientId) {
                    dispatch(getClientMedicalDetails(clientId));
                }
            }
        }
    }, [mode, clientId, dispatch, clientMedicalDetails]);

    return (
        <div className={'client-medical-provider-information-form-component'}>
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
                    <FormControlLabelComponent className={'add-medical-provider-information-heading'} label={CommonService.capitalizeFirstLetter(mode) + " Medical Provider Information"}/>
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
                                                <Field name={`medical_provider_info.name`}>
                                                    {
                                                        (field: FieldProps) => (
                                                            <FormikInputComponent
                                                                label={"Full Name"}
                                                                placeholder={"Full Name"}
                                                                required={true}
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
                                                            <FormikInputComponent
                                                                label={"MD Phone"}
                                                                placeholder={"MD Phone"}
                                                                required={true}
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
                                                <Field name={`medical_provider_info. referring_name`}>
                                                    {
                                                        (field: FieldProps) => (
                                                            <FormikInputComponent
                                                                label={"Full Name"}
                                                                placeholder={"Full Name"}
                                                                required={true}
                                                                formikField={field}
                                                                fullWidth={true}
                                                            />
                                                        )
                                                    }
                                                </Field>
                                            </div>
                                            <div className="ts-col-md-6 ts-col-lg-4">
                                                <Field name={`medical_provider_info.phone_number`}>
                                                    {
                                                        (field: FieldProps) => (
                                                            <FormikInputComponent
                                                                label={"Primary Phone Number"}
                                                                placeholder={"Primary Phone Number"}
                                                                required={true}
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
                                                                required={true}
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
                                                onClick={onCancel}
                                                disabled={isClientMedicalProviderInformationSavingInProgress}
                                            >
                                                Home
                                            </ButtonComponent>&nbsp;
                                            <ButtonComponent
                                                id={"save_next_btn"}
                                                isLoading={isClientMedicalProviderInformationSavingInProgress}
                                                disabled={isClientMedicalProviderInformationSavingInProgress || !isValid}
                                                type={"submit"}
                                            >
                                                {isClientMedicalProviderInformationSavingInProgress ? "Saving" : <>{mode === "add" ? "Save & Next" : "Save"}</>}
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

export default ClientMedicalProviderInformationFormComponent;
