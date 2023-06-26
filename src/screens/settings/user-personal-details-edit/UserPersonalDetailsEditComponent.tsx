import "./UserPersonalDetailsEditComponent.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import FormikDatePickerComponent
    from "../../../shared/components/form-controls/formik-date-picker/FormikDatePickerComponent";
import {CommonService} from "../../../shared/services";
import FormikSelectComponent from "../../../shared/components/form-controls/formik-select/FormikSelectComponent";
import {Patterns} from "../../../constants";
import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import FormikAutoCompleteComponent
    from "../../../shared/components/form-controls/formik-auto-complete/FormikAutoCompleteComponent";
import * as Yup from "yup";
import FormDebuggerComponent from "../../../shared/components/form-debugger/FormDebuggerComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import _ from "lodash";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {setUserBasicDetails} from "../../../store/actions/user.action";

interface UserPersonalDetailsEditComponentProps {
    handleNext: () => void
}

const formValidationSchema = Yup.object({
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
    dob: Yup.mixed().required('Date of Birth is required'),
    ssn: Yup.string()
        .required('SSN Number is required')
        .min(9, 'Enter valid SSN Number')
        .max(9, 'SSN cannot be more than 9-digits'),
    gender: Yup.string().required('Gender is required'),
    npi_number: Yup.string().required('NPI number is required'),
    assigned_facilities: Yup.array().required('Gender is required'),
});

const formInitialValues: any = {
    first_name: "",
    last_name: "",
    gender: "",
    dob: "",
    nick_name: "",
    ssn: "",
    npi_number: "",
    role: "",
    assigned_facilities: [],
    license_number: ""
}

const UserPersonalDetailsEditComponent = (props: UserPersonalDetailsEditComponentProps) => {
    const {
        genderList,
        facilityListLite,
        roleList
    } = useSelector((state: IRootReducerState) => state.staticData);
    const {currentUser}: any = useSelector((state: IRootReducerState) => state.account);
    const [initialValues, setInitialValues] = useState<any>(_.cloneDeep(formInitialValues));
    const {handleNext} = props
    const dispatch = useDispatch();

    const {
        userBasicDetails,
    } = useSelector((state: IRootReducerState) => state.user);

    useEffect(() => {
        if (userBasicDetails) {
            const personal_details = {
                first_name: userBasicDetails?.first_name,
                last_name: userBasicDetails?.last_name,
                gender: userBasicDetails?.gender,
                dob: userBasicDetails?.dob,
                nick_name: userBasicDetails?.nick_name,
                ssn: userBasicDetails?.ssn,
                npi_number: userBasicDetails?.npi_number,
                role: userBasicDetails?.role,
                assigned_facilities: userBasicDetails?.assigned_facility_details,
            }
            setInitialValues(personal_details)
        }
    }, [userBasicDetails])

    const onSubmit = useCallback((values: any, {setErrors, setSubmitting}: FormikHelpers<any>) => {
        setSubmitting(true);
        CommonService._user.userEdit(userBasicDetails._id, values)
            .then((response: IAPIResponseType<any>) => {
                // CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setSubmitting(false);
                dispatch(setUserBasicDetails(response.data));
            }).catch((error: any) => {
            CommonService.handleErrors(setErrors, error, true);
            console.log('errors', error);
            setSubmitting(false);
        })
    }, [userBasicDetails,dispatch]);

    return (
        <div className={'user-personal-details-edit-component'}>
            <div className={'edit-user-heading'}>Edit Personal Details</div>
            <CardComponent title={"Personal Details"} size={"md"}>
                <Formik
                    validationSchema={formValidationSchema}
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

                                <div className="ts-row">
                                    <div className="ts-col">
                                        <Field name={'first_name'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        label={'First Name'}
                                                        placeholder={'E.g. John'}
                                                        type={"text"}
                                                        required={true}
                                                        titleCase={true}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    <div className="ts-col">
                                        <Field name={'last_name'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        label={'Last Name'}
                                                        placeholder={'E.g. Doe'}
                                                        type={"text"}
                                                        required={true}
                                                        titleCase={true}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                </div>
                                <div className="ts-row">
                                    <div className="ts-col">
                                        <Field name={'dob'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikDatePickerComponent
                                                        label={'Date of Birth'}
                                                        placeholder={'MM-DD-YYYY'}
                                                        required={true}
                                                        maxDate={CommonService._staticData.today}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    <div className="ts-col">
                                        <Field name={'gender'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikSelectComponent
                                                        options={genderList}
                                                        label={'Gender'}
                                                        required={true}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                </div>
                                <div className="ts-row">
                                    <div className="ts-col">
                                        <Field name={'nick_name'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        label={'Nickname/Preferred Name'}
                                                        placeholder={'Enter Nickname/Preferred Name'}
                                                        type={"text"}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    <div className="ts-col">
                                        <Field name={'npi_number'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        label={'NPI Number'}
                                                        placeholder={'Enter NPI Number'}
                                                        type={"text"}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                </div>
                                <div className="ts-row">
                                    <div className="ts-col">
                                        <Field name={'license_number'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        label={'License Number'}
                                                        placeholder={'Enter License Number'}
                                                        type={"text"}
                                                        formikField={field}
                                                        fullWidth={true}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    <div className="ts-col">
                                        <Field name={'ssn'}>
                                            {
                                                (field: FieldProps) => (
                                                    <FormikInputComponent
                                                        label={'SSN'}
                                                        placeholder={'Enter SSN'}
                                                        required={true}
                                                        type={'text'}
                                                        validationPattern={Patterns.NINE_DIGITS_ONLY}
                                                        formikField={field}
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
                                                        disabled={currentUser.role !== 'admin'}
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
                                    <ButtonComponent
                                        id={"save_btn"}
                                        size={'large'}
                                        className={'submit-cta'}
                                        isLoading={isSubmitting}
                                        disabled={isSubmitting || !isValid || CommonService.isEqual(values, initialValues)}
                                        type={"submit"}
                                    >
                                        {isSubmitting ? "Saving" : "Save"}
                                    </ButtonComponent>
                                    <ButtonComponent
                                        id={"cancel_btn"}
                                        variant={"outlined"}
                                        size={'large'}
                                        className={'submit-cta'}
                                        disabled={isSubmitting}
                                        onClick={handleNext}
                                    >
                                        Next
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

export default UserPersonalDetailsEditComponent;