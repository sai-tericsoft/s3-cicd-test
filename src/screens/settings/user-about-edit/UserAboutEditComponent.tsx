import "./UserAboutEditComponent.scss";
import React, {useCallback, useEffect, useState} from "react";
import CardComponent from "../../../shared/components/card/CardComponent";
import {Field, FieldArray, FieldProps, Form, Formik, FormikHelpers} from "formik";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import {ImageConfig} from "../../../constants";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import FormikSelectComponent from "../../../shared/components/form-controls/formik-select/FormikSelectComponent";
import _ from "lodash";
import {CommonService} from "../../../shared/services";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import IconButtonComponent from "../../../shared/components/icon-button/IconButtonComponent";
import FormikCheckBoxComponent from "../../../shared/components/form-controls/formik-check-box/FormikCheckBoxComponent";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {setUserBasicDetails} from "../../../store/actions/user.action";
import * as Yup from "yup";

interface UserAboutEditComponentProps {
    handleNext: () => void
    handlePrevious: () => void
}

const formInitialValues: any = {
    summary: "",
    specialities: [""],
    languages: [{
        name: "",
        read: "",
        write: "",
        speak: ""
    }]
}

const UserAboutValidationSchema = Yup.object().shape({
    languages: Yup.array().of(Yup.object().shape({
        name: Yup.string().required('Language is required'),
    }))

});

const UserAboutEditComponent = (props: UserAboutEditComponentProps) => {
    const {handleNext, handlePrevious} = props;
    const dispatch = useDispatch();
    const [initialValues, setInitialValues] = useState<any>(_.cloneDeep(formInitialValues));
    const {languageList} = useSelector(
        (state: IRootReducerState) => state.staticData
    );
    const {
        userBasicDetails,
    } = useSelector((state: IRootReducerState) => state.user);

    useEffect(() => {
        if (userBasicDetails.summary || userBasicDetails?.specialities || userBasicDetails?.languages) {
            const about = {
                summary: userBasicDetails?.summary,
                specialities: userBasicDetails?.specialities.length ? userBasicDetails?.specialities : formInitialValues.specialities,
                languages: userBasicDetails?.languages.length ? userBasicDetails?.languages : formInitialValues.languages,
            }
            setInitialValues(about)
        }
    }, [userBasicDetails])

    const onSubmit = useCallback((values: any, {setErrors, setSubmitting}: FormikHelpers<any>) => {
        console.log(values);
        let payload = {
            ...CommonService.removeKeysFromJSON(_.cloneDeep(values), ['assigned_facility_details', 'gender_details']),
        };

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
        <div className={'user-about-edit-component'}>
            <div className={'edit-user-heading'}>Edit About</div>
            <CardComponent title={"ABOUT"} size={"md"}>

                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    validationSchema={UserAboutValidationSchema}
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
                                    <div className={'ts-col-md-12'}>
                                        <Field name={'summary'}>
                                            {(field: FieldProps) => (
                                                <FormikTextAreaComponent
                                                    label={'Profile Summary'}
                                                    formikField={field}
                                                    fullWidth={true}
                                                    placeholder={'Enter Profile Summary'}
                                                />
                                            )}
                                        </Field>
                                    </div>
                                </div>
                                <FormControlLabelComponent label={'Specialities:'}/>
                                <FieldArray
                                    name="specialities"
                                    render={(arrayHelpers) => (
                                        <>
                                            {values.specialities && values?.specialities?.map((item: any, index: any) => {
                                                return (
                                                    <div className="ts-row" key={index}>
                                                        <div className="ts-col">
                                                            <Field name={`specialities.${index}`}>
                                                                {(field: FieldProps) => (
                                                                    <FormikInputComponent
                                                                        label={`Specialty ${index + 1}`}
                                                                        placeholder={'Enter Specialty'}
                                                                        type={"text"}
                                                                        formikField={field}
                                                                        fullWidth={true}
                                                                    />
                                                                )}
                                                            </Field>
                                                        </div>
                                                        <div className="ts-col-1">
                                                            <div className="d-flex">
                                                                {
                                                                    values?.specialities && (index === values?.specialities?.length - 1)
                                                                    && values?.specialities?.length < 5 &&
                                                                    <IconButtonComponent className={"form-helper-icon"}
                                                                                         onClick={() => {
                                                                                             arrayHelpers.push("");
                                                                                         }}
                                                                    >
                                                                        <ImageConfig.AddCircleIcon/>
                                                                    </IconButtonComponent>}

                                                                {index > 0 &&
                                                                    <IconButtonComponent className={"form-helper-icon"}
                                                                                         onClick={() => {
                                                                                             arrayHelpers.remove(index);
                                                                                         }}
                                                                    >
                                                                        <ImageConfig.DeleteIcon/>
                                                                    </IconButtonComponent>}
                                                            </div>
                                                        </div>
                                                        <div className="ts-col"/>
                                                    </div>
                                                )
                                            })}
                                        </>
                                    )}
                                />

                                <FormControlLabelComponent label={'Languages:'}/>

                                <FieldArray
                                    name="languages"
                                    render={(arrayHelpers) => (
                                        <>{values?.languages && values?.languages.map((item: any, index: any) => {
                                            return (
                                                <div className="ts-row" key={index}>
                                                    <div className="ts-col">
                                                        <Field name={`languages.${index}.name`}>
                                                            {(field: FieldProps) => (
                                                                <FormikSelectComponent
                                                                    options={languageList}
                                                                    label={'Language'}
                                                                    required={true}
                                                                    formikField={field}
                                                                    fullWidth={true}
                                                                />
                                                            )}
                                                        </Field>
                                                    </div>
                                                    <div className="ts-col">
                                                        <div className="language-select ts-row">
                                                            <div className="ts-col">
                                                                <Field name={`languages.${index}.read`}>
                                                                    {(field: FieldProps) => (
                                                                        <FormikCheckBoxComponent
                                                                            label={'Read'}
                                                                            formikField={field}
                                                                            required={false}
                                                                            labelPlacement={"start"}
                                                                        />
                                                                    )}
                                                                </Field>
                                                            </div>
                                                            <div className="ts-col">
                                                                <Field name={`languages.${index}.write`}>
                                                                    {(field: FieldProps) => (
                                                                        <FormikCheckBoxComponent
                                                                            label={'Write'}
                                                                            formikField={field}
                                                                            required={false}
                                                                            labelPlacement={"start"}
                                                                        />
                                                                    )}
                                                                </Field>
                                                            </div>
                                                            <div className="ts-col">
                                                                <Field name={`languages.${index}.speak`}>
                                                                    {(field: FieldProps) => (
                                                                        <FormikCheckBoxComponent
                                                                            label={'Speak'}
                                                                            formikField={field}
                                                                            required={false}
                                                                            labelPlacement={"start"}
                                                                        />
                                                                    )}
                                                                </Field>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="ts-col-1">
                                                        <div className="d-flex">
                                                            {values?.languages && (index === values?.languages?.length - 1)
                                                                && values?.languages?.length < 5 &&
                                                                <IconButtonComponent className={"form-helper-icon"}
                                                                                     onClick={() => {
                                                                                         arrayHelpers.push("");
                                                                                     }}
                                                                >
                                                                    <ImageConfig.AddCircleIcon/>
                                                                </IconButtonComponent>}
                                                            {index > 0 &&
                                                                <IconButtonComponent
                                                                    className={"form-helper-icon delete"}
                                                                    onClick={() => {
                                                                        arrayHelpers.remove(index);
                                                                    }}
                                                                >
                                                                    <ImageConfig.DeleteIcon/>
                                                                </IconButtonComponent>}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
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

export default UserAboutEditComponent;
