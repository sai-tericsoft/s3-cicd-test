import "./CommunicationPreferencesEditComponent.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import React, {useCallback, useEffect, useState} from "react";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {CommonService} from "../../../shared/services";
import _ from "lodash";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import FormikSelectComponent from "../../../shared/components/form-controls/formik-select/FormikSelectComponent";
import QuestionComponent from "../../../shared/components/question/QuestionComponent";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {useNavigate} from "react-router-dom";
import FormDebuggerComponent from "../../../shared/components/form-debugger/FormDebuggerComponent";

interface CommunicationPreferencesComponentProps {

}

const formInitialValues: any = {
        communication_preferences: {
            appointment_reminders: ''
        }
    }
;



const CommunicationPreferencesEditComponent = (props: CommunicationPreferencesComponentProps) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [initialValues, setInitialValues] = useState<any>(_.cloneDeep(formInitialValues));

    const {
        userBasicDetails,
    } = useSelector((state: IRootReducerState) => state.user);
    const {
        communicationModeTypeList,
    } = useSelector((state: IRootReducerState) => state.staticData);

    useEffect(() => {
        dispatch(setCurrentNavParams('Back', null, () => {
            navigate(CommonService._routeConfig.UserAccountDetails());
        }));
    }, [navigate, dispatch]);


    useEffect(() => {
        if (userBasicDetails) {
            setInitialValues({
                communication_preferences: {
                    appointment_reminders: userBasicDetails.communication_preferences.appointment_reminders
                }
            });
        }
    }, [userBasicDetails]);



    const onSubmit = useCallback((values: any, {setErrors, setSubmitting}: FormikHelpers<any>) => {
        setSubmitting(true);

        const payload = {
            communication_preferences: {
                appointment_reminders: values.communication_preferences.appointment_reminders
            }
        };
        CommonService._user.userEdit(userBasicDetails._id, payload)
            .then((response: IAPIResponseType<any>) => {
                setSubmitting(false);
                navigate(CommonService._routeConfig.UserAccountDetails());
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error, true);
                setSubmitting(false);
            });
    }, [userBasicDetails, navigate]);


    return (
        <div className={'communication-preferences-component'}>
            <div className={'edit-user-heading'}>Edit Communication Preferences</div>
            <CardComponent title={"Communication Preferences"} size={"md"}>
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    validateOnChange={false}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    validateOnMount={true}>
                    {({values, touched, errors, setFieldValue, validateForm, isSubmitting, isValid}) => {
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        useEffect(() => {
                            validateForm();
                        }, [validateForm, values]);
                        return (
                            <Form noValidate={true} className={"t-form"}>
                                <FormDebuggerComponent showDebugger={true} values={values} errors={errors}/>
                                <div className={'ts-row'}>
                                    <div className={'ts-col-6'}>
                                        <QuestionComponent title={'Appointment Reminders'}
                                                           description={"How would you like to receive appointment reminders? *"}
                                        />
                                    </div>
                                    <div className={'ts-col-2'}/>
                                    <div className={'ts-col-4'}>
                                        <Field name={'communication_preferences.appointment_reminders'}>
                                            {(field: FieldProps) => (
                                                <FormikSelectComponent
                                                    options={communicationModeTypeList}
                                                    displayWith={(item: any) => item.title}
                                                    valueExtractor={(item: any) => item.code}
                                                    keyExtractor={(item: any) => item._id}
                                                    required={true}
                                                    label={'Select'}
                                                    formikField={field}
                                                    fullWidth={true}
                                                />
                                            )}
                                        </Field>
                                    </div>

                                </div>


                                <div className="t-form-actions">
                                    <ButtonComponent
                                        id={"save_btn"}
                                        size={'large'}
                                        className={'submit-cta'}
                                        isLoading={isSubmitting}
                                        disabled={isSubmitting || !isValid}
                                        type={"submit"}
                                    >
                                        {isSubmitting ? "Saving" : "Save"}
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

export default CommunicationPreferencesEditComponent;