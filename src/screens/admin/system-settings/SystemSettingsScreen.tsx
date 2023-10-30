import "./SystemSettingsScreen.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import * as Yup from "yup";
import {useCallback, useEffect, useState} from "react";
import {ILoggedInUser, ISystemSettingsConfig} from "../../../shared/models/account.model";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {Misc} from "../../../constants";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import _ from "lodash";
import QuestionComponent from "../../../shared/components/question/QuestionComponent";
import FormikSelectComponent from "../../../shared/components/form-controls/formik-select/FormikSelectComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import HorizontalLineComponent
    from "../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";
import {getSystemSettings} from "../../../store/actions/settings.action";
import DefaultMessageComponent from "./default-message/DefaultMessageComponent";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import {setLoggedInUserData} from "../../../store/actions/account.action";

const SystemSettingsFormValidationSchema = Yup.object({
    other_settings: Yup.object({
        auto_lock_minutes: Yup.string()
            .required("Input is required"),
        uneditable_after_days: Yup.string()
            .required("Input is required"),
        buffer_time: Yup.string()
            .required("Buffer Time is required"),
        admin_email: Yup.string()
            .required("Admin Email is required"),
    })
});


const SystemSettingsFormInitialValues = {
    other_settings: {
        auto_lock_minutes: 10,
        uneditable_after_days: 7,
        buffer_time: 15,
        admin_email:""
    }
}

interface SystemSettingsScreenProps {

}

const SystemSettingsScreen = (props: SystemSettingsScreenProps) => {

    const [systemSettingsFormInitialValues, setSystemSettingsFormInitialValues] = useState<ISystemSettingsConfig>(_.cloneDeep(SystemSettingsFormInitialValues));
    const [isSaving, setIsSaving] = useState(false);
    const dispatch = useDispatch();
    const {currentUser} = useSelector((state: IRootReducerState) => state.account);
    const {
        systemAutoLockDurationOptionList,
        filesUneditableAfterOptionList,
    } = useSelector((state: IRootReducerState) => state.staticData);
    const {
        systemSettings,
        isSystemSettingsLoading,
        isSystemSettingsLoaded
    } = useSelector((state: IRootReducerState) => state.settings);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        setIsSaving(true);
        CommonService._systemSettings.SaveSystemSettingsAPICall(values)
            .then((response: IAPIResponseType<ISystemSettingsConfig>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setIsSaving(false);
                dispatch(setLoggedInUserData({...currentUser,auto_lock_minutes:values.other_settings.auto_lock_minutes} as ILoggedInUser));
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error);
                setIsSaving(false);
            });
    }, [dispatch,currentUser]);

    useEffect(() => {
        if (systemSettings) {
            setSystemSettingsFormInitialValues({
                other_settings: {
                    auto_lock_minutes: systemSettings?.other_settings?.auto_lock_minutes,
                    uneditable_after_days: systemSettings?.other_settings?.uneditable_after_days,
                    buffer_time: systemSettings?.other_settings?.buffer_time,
                    admin_email: systemSettings?.other_settings?.admin_email
                }
            });
        }
    }, [systemSettings]);

    useEffect(() => {
        return () => {
            dispatch(getSystemSettings());
        }
    }, [dispatch]);

    return (
        <div className={'system-settings-screen'}>
            <div>
                <DefaultMessageComponent defaultMessage={systemSettings}/>
                {
                    isSystemSettingsLoading && <LoaderComponent/>
                }
                {
                    isSystemSettingsLoaded && <Formik
                        validationSchema={SystemSettingsFormValidationSchema}
                        initialValues={systemSettingsFormInitialValues}
                        validateOnChange={false}
                        validateOnBlur={true}
                        enableReinitialize={true}
                        validateOnMount={true}
                        onSubmit={onSubmit}
                    >
                        {({values, validateForm}) => {
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            useEffect(() => {
                                validateForm();
                            }, [validateForm, values]);
                            return (
                                <Form className="t-form" noValidate={true}>
                                    <CardComponent title={"Other Settings"}>
                                        <div className="t-form-controls">
                                            <div className="ts-row">
                                                <div className="ts-col-md-12 ts-col-md-6 ts-col-lg-7">
                                                    <QuestionComponent title={"System Auto Lock"}
                                                                       description={"The length of time before the system auto-saves the work that has been done, and locks the system if there’s been a certain length of inactivity."}
                                                    ></QuestionComponent>
                                                </div>
                                                <div className={"ts-col-md-12 ts-col-md-6 ts-col-lg-1"}/>
                                                <div className="ts-col-md-12 ts-col-md-6 ts-col-lg-4">
                                                    <Field name={'other_settings.auto_lock_minutes'}
                                                           className="t-form-control">
                                                        {
                                                            (field: FieldProps) => (
                                                                <FormikSelectComponent
                                                                    label={'Select'}
                                                                    options={systemAutoLockDurationOptionList}
                                                                    required={true}
                                                                    formikField={field}
                                                                    fullWidth={true}
                                                                />
                                                            )
                                                        }
                                                    </Field>
                                                </div>
                                            </div>
                                            <HorizontalLineComponent/>
                                            <div className="ts-row">
                                                <div className="ts-col-md-12 ts-col-md-6 ts-col-lg-7">
                                                    <QuestionComponent title={"Files Uneditable after"}
                                                                       description={"Makes file uneditable after XX days."}
                                                    ></QuestionComponent>
                                                </div>
                                                <div className={"ts-col-md-12 ts-col-md-6 ts-col-lg-1"}/>
                                                <div className="ts-col-md-12 ts-col-md-6 ts-col-lg-4">
                                                    <Field name={'other_settings.uneditable_after_days'}
                                                           className="t-form-control">
                                                        {
                                                            (field: FieldProps) => (
                                                                <FormikSelectComponent
                                                                    label={'Select'}
                                                                    options={filesUneditableAfterOptionList}
                                                                    required={true}
                                                                    formikField={field}
                                                                    fullWidth={true}
                                                                />
                                                            )
                                                        }
                                                    </Field>
                                                </div>
                                            </div>

                                            <HorizontalLineComponent/>
                                            <div className="ts-row">
                                                <div className="ts-col-md-12 ts-col-md-6 ts-col-lg-7">
                                                    <QuestionComponent title={"Scheduling Buffer Time"}
                                                                       description={"The buffer time to be considered while generating appointment time slots for each provider."}
                                                    ></QuestionComponent>
                                                </div>
                                                <div className={"ts-col-md-12 ts-col-md-6 ts-col-lg-1"}/>
                                                <div className="ts-col-md-12 ts-col-md-6 ts-col-lg-4">
                                                    <Field name={'other_settings.buffer_time'}
                                                           className="t-form-control">
                                                        {
                                                            (field: FieldProps) => (
                                                                <FormikSelectComponent
                                                                    label={'Select'}
                                                                    options={systemAutoLockDurationOptionList}
                                                                    required={true}
                                                                    formikField={field}
                                                                    fullWidth={true}
                                                                />
                                                            )
                                                        }
                                                    </Field>
                                                </div>
                                            </div>
                                            <HorizontalLineComponent/>
                                            <div className="ts-row">
                                                <div className="ts-col-md-12 ts-col-md-6 ts-col-lg-7">
                                                    <QuestionComponent title={"Admin Email"}
                                                                       description={"The email address provided here will be notified by application users of any chart note or SOAP Note, if required."}
                                                    ></QuestionComponent>
                                                </div>
                                                <div className={"ts-col-md-12 ts-col-md-6 ts-col-lg-1"}/>
                                                <div className="ts-col-md-12 ts-col-md-6 ts-col-lg-4">
                                                    <Field name={'other_settings.admin_email'}
                                                           className="t-form-control">
                                                        {
                                                            (field: FieldProps) => (
                                                                <FormikInputComponent
                                                                    label={'Enter Admin Email'}
                                                                    required={true}
                                                                    formikField={field}
                                                                    fullWidth={true}
                                                                />
                                                            )
                                                        }
                                                    </Field>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="t-form-actions">
                                            <ButtonComponent
                                                isLoading={isSaving}
                                                type={"submit"}
                                                id={"save_btn"}
                                                disabled={CommonService.isEqual(values, systemSettingsFormInitialValues)}
                                            >
                                                {isSaving ? "Saving" : "Save"}
                                            </ButtonComponent>
                                        </div>
                                    </CardComponent>
                                </Form>
                            )
                        }}
                    </Formik>
                }
            </div>
        </div>
    );

};

export default SystemSettingsScreen;
