import "./UserEducationDetailsEditComponent.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import {Field, FieldArray, FieldProps, Form, Formik, FormikHelpers} from "formik";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../constants";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import FormikDatePickerComponent
    from "../../../shared/components/form-controls/formik-date-picker/FormikDatePickerComponent";
import {CommonService} from "../../../shared/services";
import React, {useCallback, useEffect, useState} from "react";
import _ from "lodash";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {setUserBasicDetails} from "../../../store/actions/user.action";
import FormDebuggerComponent from "../../../shared/components/form-debugger/FormDebuggerComponent";
import {useLocation, useNavigate} from "react-router-dom";

interface UserEducationDetailsEditComponentProps {
    handlePrevious: () => void
}

const formInitialValues: any = {
    education_details: [
        {
            institution_name: "",
            institution_location: "",
            degree: "",
            start_date: "",
            end_date: ""
        }
    ],
}

const UserEducationDetailsEditComponent = (props: UserEducationDetailsEditComponentProps) => {
    const [initialValues, setInitialValues] = useState<any>(_.cloneDeep(formInitialValues));
    const {handlePrevious} = props
    const dispatch = useDispatch();
    const location: any = useLocation();
    const path = location.pathname;
    const navigate = useNavigate();


    const {
        userBasicDetails,
    } = useSelector((state: IRootReducerState) => state.user);

    useEffect(() => {
        if (userBasicDetails) {
            const education_details = userBasicDetails.education_details.length ? userBasicDetails.education_details : formInitialValues.education_details
            setInitialValues({education_details});
        }
    }, [userBasicDetails]);

    const onSubmit = useCallback((values: any, {setErrors, setSubmitting}: FormikHelpers<any>) => {
        console.log(values);
        const payload = {...values}
        if (payload.education_details.length) {
            payload.education_details = payload.education_details.map((item: any) => ({
                ...item,
                start_date: CommonService.convertDateFormat(item?.start_date),
                end_date: CommonService.convertDateFormat(item?.end_date),
            }));
        }
        setSubmitting(true);
        CommonService._user.userEdit(userBasicDetails._id, payload)
            .then((response: IAPIResponseType<any>) => {
                // CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setSubmitting(false);
                dispatch(setUserBasicDetails(response.data));
                if (path.includes('settings')) {
                    navigate(CommonService._routeConfig.PersonalDetails());
                } else {
                    navigate(CommonService._routeConfig.UserPersonalDetails() + '?userId=' + userBasicDetails?._id)
                }
            }).catch((error: any) => {
            CommonService.handleErrors(setErrors, error, true);
            console.log('errors', error);
            setSubmitting(false);
        })
    }, [userBasicDetails, dispatch, navigate, path]);


    return (
        <div className={'user-education-details-edit-component'}>
            <div className={'edit-user-heading'}>EDIT Education details</div>
            <CardComponent title={"Education details"} size={"md"}>

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
                            console.log(values);
                        }, [validateForm, values]);
                        return (
                            <Form noValidate={true} className={"t-form"}>
                                <FormDebuggerComponent showDebugger={true} values={values} errors={errors}/>

                                <FieldArray
                                    name="education_details"
                                    render={(arrayHelpers) => (
                                        <>
                                            {values?.education_details && values?.education_details?.map((item: any, index: any) => {
                                                return (
                                                    <>
                                                        <div className="d-flex ts-align-items-center mrg-bottom-24">
                                                            <FormControlLabelComponent
                                                                label={`Education ${index + 1}:`}/>
                                                            {values?.education_details.length > 1 &&
                                                            <ButtonComponent className={'remove-contact-button'}
                                                                             prefixIcon={<ImageConfig.CloseIcon/>}
                                                                             variant={'contained'} color={'error'}
                                                                             onClick={() => {
                                                                                 arrayHelpers.remove(index);
                                                                             }}
                                                            >Remove</ButtonComponent>}
                                                        </div>
                                                        <div className="ts-row">
                                                            <div className="ts-col">
                                                                <Field
                                                                    name={`education_details[${index}].institution_name`}>
                                                                    {
                                                                        (field: FieldProps) => (
                                                                            <FormikInputComponent
                                                                                label={'Institution Name'}
                                                                                placeholder={'Enter Institution Name'}
                                                                                type={"text"}
                                                                                titleCase={true}
                                                                                formikField={field}
                                                                                fullWidth={true}
                                                                            />
                                                                        )
                                                                    }
                                                                </Field>
                                                            </div>
                                                            <div className="ts-col">
                                                                <Field
                                                                    name={`education_details[${index}].institution_location`}>
                                                                    {
                                                                        (field: FieldProps) => (
                                                                            <FormikInputComponent
                                                                                label={'Institution Location'}
                                                                                placeholder={'Enter Institution Location'}
                                                                                type={"text"}
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
                                                                <Field name={`education_details[${index}].degree`}>
                                                                    {
                                                                        (field: FieldProps) => (
                                                                            <FormikInputComponent
                                                                                label={'Degree Title'}
                                                                                placeholder={'Enter Degree Title'}
                                                                                type={"text"}
                                                                                titleCase={true}
                                                                                formikField={field}
                                                                                fullWidth={true}
                                                                            />
                                                                        )
                                                                    }
                                                                </Field>
                                                            </div>
                                                            <div className="ts-col">
                                                                <Field name={`education_details[${index}].start_date`}>
                                                                    {
                                                                        (field: FieldProps) => (
                                                                            <FormikDatePickerComponent
                                                                                label={'Start Date'}
                                                                                placeholder={'MM-DD-YYYY'}
                                                                                maxDate={CommonService._staticData.today}
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
                                                                <Field name={`education_details[${index}].end_date`}>
                                                                    {
                                                                        (field: FieldProps) => (
                                                                            <FormikDatePickerComponent
                                                                                label={'End Date'}
                                                                                placeholder={'MM-DD-YYYY'}
                                                                                maxDate={CommonService._staticData.today}
                                                                                formikField={field}
                                                                                fullWidth={true}
                                                                            />
                                                                        )
                                                                    }
                                                                </Field>
                                                            </div>
                                                            <div className="ts-col"/>
                                                        </div>

                                                        {index + 1 === values?.education_details.length &&
                                                        <div className={'display-flex justify-content-center flex-1'}>
                                                            <ButtonComponent
                                                                className={'add-another-contact-cta'}
                                                                onClick={() => {
                                                                    arrayHelpers.push({
                                                                        institution_name: "",
                                                                        institution_location: "",
                                                                        degree: "",
                                                                        start_date: "",
                                                                        end_date: ""
                                                                    });
                                                                }}
                                                                prefixIcon={<ImageConfig.AddIcon/>}>
                                                                Add Another Education</ButtonComponent>
                                                        </div>}
                                                    </>
                                                )
                                            })
                                            }
                                        </>
                                    )}
                                />

                                <div className="t-form-actions">
                                    <ButtonComponent
                                        id={"cancel_btn"}
                                        variant={"outlined"}
                                        size={'large'}
                                        className={'submit-cta'}
                                        disabled={isSubmitting}
                                        onClick={handlePrevious}
                                    >
                                        Previous
                                    </ButtonComponent>
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
                                </div>
                            </Form>
                        )
                    }}
                </Formik>
            </CardComponent>
        </div>
    );

};

export default UserEducationDetailsEditComponent;
