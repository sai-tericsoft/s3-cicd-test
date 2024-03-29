import "./UserAddComponent.scss";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import React, {useCallback, useEffect, useState} from "react";
import CardComponent from "../../../../shared/components/card/CardComponent";
import FormikInputComponent from "../../../../shared/components/form-controls/formik-input/FormikInputComponent";
import {CommonService} from "../../../../shared/services";
import ButtonComponent from "../../../../shared/components/button/ButtonComponent";
import * as Yup from "yup";
import _ from "lodash";
import {Misc} from "../../../../constants";
import FormikPhoneInputComponent
    from "../../../../shared/components/form-controls/formik-phone-input/FormikPhoneInputComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../../store/reducers";
import FormikAutoCompleteComponent
    from "../../../../shared/components/form-controls/formik-auto-complete/FormikAutoCompleteComponent";
import FormikSelectComponent from "../../../../shared/components/form-controls/formik-select/FormikSelectComponent";
import {setCurrentNavParams} from "../../../../store/actions/navigation.action";
import {useNavigate} from "react-router-dom";
import FormDebuggerComponent from "../../../../shared/components/form-debugger/FormDebuggerComponent";

interface UserAddComponentProps {

}

const UserAddInitialValues: any = {
    first_name: '',
    last_name: '',
    primary_email: '',
    primary_contact_info: {
        phone: ''
    },
    role: "",
    assigned_facilities: [],
};


const userAddValidationSchema = Yup.object({
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
    primary_email: Yup.string().email('Invalid email').required('Email is required'),
    primary_contact_info: Yup.object({
        phone: Yup.string()
            .required('Phone Number is required')
            .test('is-ten-digits', 'Phone number must contain exactly 10 digits', (value: any) => {
                return value?.length === 10
            }),
    }),
    assigned_facilities: Yup.array().min(1, 'At least one facility must be assigned'),
    role: Yup.string().required('Role is required'),
});

const UserAddComponent = (props: UserAddComponentProps) => {
    const [addUserInitialValues] = useState<any>(_.cloneDeep(UserAddInitialValues));
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        facilityListLite,
        isFacilityListLiteLoading,
        roleList
    } = useSelector((state: IRootReducerState) => state.staticData);

    const onUserAdd = useCallback((values: any, { setErrors, setSubmitting }: FormikHelpers<any>) => {
        try {
            const payload = _.cloneDeep(values);
            if (payload?.assigned_facilities?.length) {
                payload.assigned_facilities = payload.assigned_facilities.map((item: any) => item._id);
            }
            setSubmitting(true);
            CommonService._user.getUserAdd(payload)
                .then((response: any) => {
                    setSubmitting(false);
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    navigate(CommonService._routeConfig.UserSlots(response.data._id) + '?currentStepId=' + response.data.assigned_facilities[0]);
                }).catch((error: any) => {
                setSubmitting(false);
                CommonService.handleErrors(setErrors, error, true);
            });
        } catch (error) {
            // Handle any synchronous errors here
            console.error("An error occurred:", error);
            CommonService._alert.showToast("An error occurred", "error");
            setSubmitting(false);
        }
    }, [navigate]);

    useEffect(() => {
        dispatch(setCurrentNavParams('User List', null, () => {
            navigate(CommonService._routeConfig.UserList());
        }));
    }, [dispatch, navigate]);

    const handleBackNavigation = useCallback(() => {
        navigate(CommonService._routeConfig.UserList());
    }, [navigate]);

    return (
        <div className={'user-add-component'}>
            <div className={'add-heading'}>
                Add User
            </div>
            <Formik initialValues={addUserInitialValues}
                    validationSchema={userAddValidationSchema}
                    onSubmit={onUserAdd}
                    validateOnChange={false}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    validateOnMount={true}>
                {({values, isValid, touched, errors, setFieldValue, validateForm, isSubmitting}) => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    useEffect(() => {
                        validateForm();
                    }, [validateForm, values]);
                    return (
                        <Form className="t-form" noValidate={true}>
                            <FormDebuggerComponent values={values} errors={errors} showDebugger={true}/>
                            <CardComponent title={'Basic Details'}>
                                <div className={'ts-row'}>
                                    <div className={'ts-col-md-6'}>
                                        <Field name={'first_name'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        titleCase={true}
                                                        label={'First Name'}
                                                        placeholder={'E.g. John'}
                                                        formikField={field}
                                                        required={true}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>

                                    <div className={'ts-col-md-6'}>
                                        <Field name={'last_name'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        titleCase={true}
                                                        label={'Last Name'}
                                                        placeholder={'E.g. Doe'}
                                                        formikField={field}
                                                        required={true}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                </div>
                                <div className={'ts-row'}>
                                    <div className={'ts-col-md-6'}>
                                        <Field name={'primary_email'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        label={'Email Address'}
                                                        placeholder={'example@email.com'}
                                                        formikField={field}
                                                        required={true}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    <div className={'ts-col-md-6'}>
                                        <Field name={'primary_contact_info.phone'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikPhoneInputComponent
                                                        label={'Phone Number'}
                                                        formikField={field}
                                                        required={true}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                </div>
                                <div className={'ts-row'}>
                                    <div className={'ts-col-md-6'}>
                                        <Field name={'role'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikSelectComponent
                                                        options={roleList}
                                                        label={'Role'}
                                                        required={true}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    <div className={'ts-col-md-6'}>
                                        <Field name={'assigned_facilities'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikAutoCompleteComponent
                                                        options={facilityListLite}
                                                        isDataLoading={isFacilityListLiteLoading}
                                                        label={'Assigned Facilities'}
                                                        placeholder={'Select Facility'}
                                                        formikField={field}
                                                        required={true}
                                                        fullWidth={true}
                                                        multiple={true}
                                                        keyExtractor={item => item.id}
                                                        valueExtractor={item => item.id}
                                                        displayWith={(item: any) => item?.name || ''}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                </div>
                            </CardComponent>
                            <div className="t-form-actions">

                                <ButtonComponent
                                    variant={"outlined"}
                                    onClick={handleBackNavigation}
                                    className={'mrg-right-15'}
                                    disabled={isSubmitting}
                                    id={"medical_record_add_cancel_btn"}
                                >
                                    Cancel
                                </ButtonComponent>
                                &nbsp;
                                <ButtonComponent
                                    isLoading={isSubmitting}
                                    type={"submit"}
                                    disabled={!isValid || isSubmitting}
                                    id={"medical_record_add_save_btn"}
                                >
                                    {isSubmitting ? "Saving" : "Save"}
                                </ButtonComponent>
                            </div>
                        </Form>
                    )
                }}

            </Formik>
        </div>
    );

};

export default UserAddComponent;
