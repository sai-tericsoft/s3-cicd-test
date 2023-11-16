import "./UserProfessionalDetailsEditComponent.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import {Field, FieldArray, FieldProps, Form, Formik, FormikHelpers} from "formik";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import React, {useCallback, useEffect, useState} from "react";
import FormikDatePickerComponent
    from "../../../shared/components/form-controls/formik-date-picker/FormikDatePickerComponent";
import {CommonService} from "../../../shared/services";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../constants";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import _ from "lodash";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {setUserBasicDetails} from "../../../store/actions/user.action";
import moment from "moment";
import * as Yup from "yup";
import HorizontalLineComponent
    from "../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";

interface UserProfessionalDetailsEditComponentProps {
    handleNext: () => void
    handlePrevious: () => void
}


const UserProfessionalDetailsValidationSchema = Yup.object().shape({
    professional_details: Yup.array().of(
        Yup.object().shape({
            company_name: Yup.string().required('Company name is required'),
            start_date: Yup.mixed().required('Start date is required'),
            end_date: Yup.mixed().required('End date is required'),
        })
    ),
});


const formInitialValues: any = {
    professional_details: [
        {
            company_name: "",
            company_location: "",
            position: "",
            start_date: "",
            end_date: ""
        }
    ],
}


const UserProfessionalDetailsEditComponent = (props: UserProfessionalDetailsEditComponentProps) => {
    const [initialValues, setInitialValues] = useState<any>(_.cloneDeep(formInitialValues));
    const {handleNext, handlePrevious} = props
    const dispatch = useDispatch();

    const {
        userBasicDetails,
    } = useSelector((state: IRootReducerState) => state.user);

    useEffect(() => {
        if (userBasicDetails) {
            const professional_details = userBasicDetails.professional_details.length ? userBasicDetails.professional_details : formInitialValues.professional_details
            console.log(professional_details);
            setInitialValues({professional_details: professional_details});
        }
    }, [userBasicDetails]);


    const onSubmit = useCallback((values: any, {setErrors, setSubmitting}: FormikHelpers<any>) => {
        const payload = {...values}
        if (payload.professional_details.length) {
            payload.professional_details = payload.professional_details.map((item: any) => ({
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
            }).catch((error: any) => {
            CommonService.handleErrors(setErrors, error, true);
            console.log('errors', error);
            setSubmitting(false);
        })
    }, [userBasicDetails, dispatch]);


    return (
        <div className={'user-professional-details-edit-component'}>
            <div className={'edit-user-heading'}>EDIT Professional details</div>
            <CardComponent title={"professional details"} size={"md"}>

                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    validationSchema={UserProfessionalDetailsValidationSchema}
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

                                <FieldArray
                                    name="professional_details"
                                    render={(arrayHelpers) => (
                                        <>
                                            {values?.professional_details?.map((item: any, index: any) => {
                                                return (
                                                    <>
                                                        <div className="d-flex ts-align-items-center mrg-bottom-24">
                                                            <FormControlLabelComponent
                                                                label={`Experience ${index + 1}:`}/>
                                                            {values?.professional_details.length > 1 &&
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
                                                                    name={`professional_details[${index}].company_name`}>
                                                                    {
                                                                        (field: FieldProps) => (
                                                                            <FormikInputComponent
                                                                                label={'Company Name'}
                                                                                placeholder={'Enter Company Name'}
                                                                                type={"text"}
                                                                                formikField={field}
                                                                                fullWidth={true}
                                                                                required={true}
                                                                            />
                                                                        )
                                                                    }
                                                                </Field>
                                                            </div>
                                                            <div className="ts-col">
                                                                <Field
                                                                    name={`professional_details[${index}].company_location`}>
                                                                    {
                                                                        (field: FieldProps) => (
                                                                            <FormikInputComponent
                                                                                label={'Company Location'}
                                                                                placeholder={'Enter Company Location'}
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
                                                                <Field name={`professional_details[${index}].position`}>
                                                                    {
                                                                        (field: FieldProps) => (
                                                                            <FormikInputComponent
                                                                                label={'Position Title'}
                                                                                placeholder={'Enter Position Title'}
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
                                                                <Field
                                                                    name={`professional_details[${index}].start_date`}>
                                                                    {
                                                                        (field: FieldProps) => (
                                                                            <FormikDatePickerComponent
                                                                                label={'Start Date'}
                                                                                placeholder={'MM-DD-YYYY'}
                                                                                formikField={field}
                                                                                maxDate={moment()}
                                                                                fullWidth={true}
                                                                                required={true}
                                                                            />
                                                                        )
                                                                    }
                                                                </Field>
                                                            </div>
                                                            <div className="ts-col">
                                                                <Field name={`professional_details[${index}].end_date`}>
                                                                    {
                                                                        (field: FieldProps) => (
                                                                            <FormikDatePickerComponent
                                                                                label={'End Date'}
                                                                                placeholder={'MM-DD-YYYY'}
                                                                                formikField={field}
                                                                                minDate={moment(values?.professional_details[index]?.start_date)}
                                                                                fullWidth={true}
                                                                                required={true}
                                                                            />
                                                                        )
                                                                    }
                                                                </Field>
                                                            </div>
                                                        </div>
                                                        {
                                                            index + 1 !== values?.professional_details?.length &&
                                                            <HorizontalLineComponent
                                                                className={'secondary-emergency-divider'}/>
                                                        }
                                                        {index + 1 === values?.professional_details.length &&
                                                            <div
                                                                className={'display-flex justify-content-center flex-1'}>
                                                                <ButtonComponent
                                                                    className={'add-another-contact-cta'}
                                                                    onClick={() => {
                                                                        arrayHelpers.push({
                                                                            company_name: "",
                                                                            company_location: "",
                                                                            position: "",
                                                                            start_date: "",
                                                                            end_date: ""
                                                                        });
                                                                    }}
                                                                    prefixIcon={<ImageConfig.AddIcon/>}>
                                                                    Add Another Experience</ButtonComponent>
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
                                    <ButtonComponent
                                        id={"cancel_btn"}
                                        variant={"outlined"}
                                        size={'large'}
                                        className={'submit-cta'}
                                        disabled={isSubmitting || !(!isValid || CommonService.isEqual(values, initialValues))}
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

export default UserProfessionalDetailsEditComponent;
