import "./UserPasswordChangeEditComponent.scss";
import React, {useCallback, useEffect, useState} from "react";
import CardComponent from "../../../shared/components/card/CardComponent";
import {CommonService} from "../../../shared/services";
import {useLocation, useNavigate} from "react-router-dom";
import _ from "lodash";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {IAPIResponseType} from "../../../shared/models/api.model";
import * as Yup from "yup";
import FormikPasswordInputComponent
    from "../../../shared/components/form-controls/formik-password-input/FormikPasswordInputComponent";
import PasswordValidationComponent from "../../../shared/components/password-validation/PasswordValidationComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";

interface UserPasswordChangeEditComponentProps {

}

const formInitialValues: any = {
    old_password: '',
    new_password: '',
    confirm_password: ''
}


const validationSchema = Yup.object().shape({
    old_password: Yup.string().required('Old Password is required'),
    new_password: Yup.string().required('New Password is required'),
    confirm_password: Yup.string()
        .required('Confirm Password is required')
        .oneOf([Yup.ref('new_password'), null], 'Passwords must match'),
});


const UserPasswordChangeEditComponent = (props: UserPasswordChangeEditComponentProps) => {
    const navigate = useNavigate();
    const location: any = useLocation();
    const path = location.pathname;
    const {
        userBasicDetails,
    } = useSelector((state: IRootReducerState) => state.user);
    const [initialValues] = useState<any>(_.cloneDeep(formInitialValues));


    const onSubmit = useCallback((values: any, {setErrors, setSubmitting}: FormikHelpers<any>) => {
        setSubmitting(true)
        CommonService._user.userPasswordEdit({...values})
            .then((response: IAPIResponseType<any>) => {
                setSubmitting(false);
                if (path.includes('admin')) {
                    navigate(CommonService._routeConfig.UserAccountDetails(userBasicDetails._id));
                } else {
                    navigate(CommonService._routeConfig.PersonalAccountDetails());
                }
            })
            .catch((error: any) => {
                CommonService.handleErrors(setErrors, error, true);
                setSubmitting(false);
            });
    }, [navigate, path]);

    return (
        <div className={'user-password-change-edit-component'}>
            <div className={'edit-user-heading'}>Edit Password</div>
            <CardComponent title={"Password"} size={"md"}>
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    validationSchema={validationSchema}
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
                                {/*<FormDebuggerComponent showDebugger={true} values={values} errors={errors}/>*/}
                                <div className={'ts-row'}>
                                    <div className={'ts-col-6'}>
                                        <div className={'ts-col-12'}>
                                            <Field name={'old_password'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikPasswordInputComponent
                                                            label={'Old Password'}
                                                            required={true}
                                                            canToggle={true}
                                                            formikField={field}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                        <div className={'ts-col-12'}>
                                            <Field name={'new_password'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikPasswordInputComponent
                                                            label={'New Password'}
                                                            required={true}
                                                            canToggle={true}
                                                            formikField={field}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                        <div className={'ts-col-12'}>
                                            <Field name={'confirm_password'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikPasswordInputComponent
                                                            label={'Confirm Password'}
                                                            required={true}
                                                            canToggle={true}
                                                            formikField={field}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                    </div>
                                    <div className={'ts-col-6 password-validation-wrapper'}>
                                        <div>
                                            <div className={'password-header'}>Choose a Password</div>
                                            <div className={'password-message-text'}>To create a new password, you have
                                                to meet all the following requirements:
                                            </div>
                                            <PasswordValidationComponent password={values.new_password}/>
                                        </div>
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

export default UserPasswordChangeEditComponent;