import "./UserAddComponent.scss";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import React, {useCallback, useEffect, useState} from "react";
import CardComponent from "../../../../shared/components/card/CardComponent";
import FormikInputComponent from "../../../../shared/components/form-controls/formik-input/FormikInputComponent";
import {CommonService} from "../../../../shared/services";
import LinkComponent from "../../../../shared/components/link/LinkComponent";
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

interface UserAddComponentProps {

}

const UserAddInitialValues: any = {
    first_name: '',
    last_name: '',
    primary_email: '',
    primary_contact_info: {
        phone: ''
    },
    assigned_facilities: []
};


const userAddValidationSchema = Yup.object({
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
    primary_email: Yup.string().email('Invalid email').required('Email Address is required'),
    primary_contact_info: Yup.object({
        phone: Yup.string().required('Phone Number is required'),
    }),
    assigned_facilities: Yup.array().min(1, 'at least one facility should select')
});

const UserAddComponent = (props: UserAddComponentProps) => {
    const [addUserInitialValues] = useState<any>(_.cloneDeep(UserAddInitialValues));
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        facilityListLite,
        roleList
    } = useSelector((state: IRootReducerState) => state.staticData);


    const onUserAdd = useCallback((values: any, {setErrors, setSubmitting}: FormikHelpers<any>) => {
        const payload = _.cloneDeep(values);
        if (payload?.assigned_facilities?.length) {
            payload.assigned_facilities = payload.assigned_facilities.map((item: any) => item._id,);
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
    }, [navigate]);

    useEffect(() => {
        dispatch(setCurrentNavParams('User List', null, () => {
            navigate(CommonService._routeConfig.UserList());
        }));
    }, [dispatch, navigate]);
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
                            {/*<FormDebuggerComponent values={values} errors={errors} showDebugger={true}/>*/}
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
                                                        label={'Assigned Facilities'}
                                                        formikField={field}
                                                        required={true}
                                                        fullWidth={true}
                                                        multiple={true}
                                                        keyExtractor={item => item.id}
                                                        displayWith={(item: any) => item?.name || ''}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                </div>
                                <div className="t-form-actions">
                                    {
                                        <LinkComponent route={CommonService._routeConfig.UserList()}>
                                            <ButtonComponent
                                                variant={"outlined"}
                                                disabled={isSubmitting}
                                                id={"medical_record_add_cancel_btn"}
                                            >
                                                Cancel
                                            </ButtonComponent>
                                        </LinkComponent>
                                    }
                                    &nbsp;
                                    <ButtonComponent
                                        isLoading={isSubmitting}
                                        type={"submit"}
                                        className={'submit-cta'}
                                        disabled={!isValid || isSubmitting}
                                        id={"medical_record_add_save_btn"}
                                    >
                                        {isSubmitting ? "Saving" : "Save & Next"}
                                    </ButtonComponent>
                                </div>

                            </CardComponent>
                        </Form>
                    )
                }}

            </Formik>
        </div>
    );

};

export default UserAddComponent;