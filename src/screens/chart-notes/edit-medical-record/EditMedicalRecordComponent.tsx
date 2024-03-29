import "./EditMedicalRecordComponent.scss";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import {Field, FieldArray, FieldProps, Form, Formik, FormikHelpers} from "formik";
import React, {useCallback, useEffect, useState} from "react";
import FormikDatePickerComponent
    from "../../../shared/components/form-controls/formik-date-picker/FormikDatePickerComponent";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import FormikSelectComponent from "../../../shared/components/form-controls/formik-select/FormikSelectComponent";
import {CommonService} from "../../../shared/services";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import {IBodyPart} from "../../../shared/models/common.model";
import {ImageConfig, Misc} from "../../../constants";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {IAPIResponseType} from "../../../shared/models/api.model";
import * as Yup from "yup";
import HorizontalLineComponent
    from "../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";
import _ from "lodash";
import moment from "moment";

interface EditMedicalRecordComponentProps {
    medicalRecordId: string;
    medicalRecordDetails: any;
    onSave: () => void;
}

const MEDICAL_RECORD_BODY_PART = {
    body_part_id: "",
    body_part_details: "",
    body_side: "",
    injury_type_id: "",
};


const MedicalRecordEditFormInitialValues: any = { // TODO type properly
    onset_date: "",
    case_physician: {
        is_case_physician: false,
        name: "",
        next_appointment: "",
        is_treated_script_received: "",
    },
    injury_details: [
        MEDICAL_RECORD_BODY_PART
    ],
    injury_description: "",
    limitations: "",
};

const InjuryDetailsRecordValidationSchema = Yup.object().shape({
    body_part_id: Yup.mixed().required("Body Part is required"),
    body_part_details: Yup.mixed().nullable(),
    body_side: Yup.mixed().nullable().when("body_part_details", {
        is: (value: IBodyPart) => value && value?.sides?.length > 0,
        then: Yup.string().required('Body Side is required'),
        otherwise: Yup.string().nullable()
    }),
    injury_type_id: Yup.mixed().required("Injury Type is required"),
});

const MedicalRecordValidationSchema = Yup.object({
    onset_date: Yup.mixed().required("Date of Onset is required"),
    injury_details: Yup.array().of(InjuryDetailsRecordValidationSchema),
    case_physician: Yup.object({
        is_case_physician: Yup.boolean(),
        name: Yup.string().when("is_case_physician", {
            is: true,
            then: Yup.string().required("Case Physician Name is required"),
        }),
        is_treated_script_received: Yup.mixed().when("is_case_physician", {
            is: true,
            then: Yup.mixed().required("Input is required"),
        })
    }),
});

const EditMedicalRecordComponent = (props: EditMedicalRecordComponentProps) => {

    const {medicalRecordId, medicalRecordDetails, onSave} = props;
    const [isMedicalRecordEditInProgress, setIsMedicalRecordEditInProgress] = useState<boolean>(false);
    const {injuryTypeList, bodyPartList} = useSelector((state: IRootReducerState) => state.staticData);

    const [medicalRecordEditInitialValues, setMedicalRecordEditInitialValues] = useState<any>(_.cloneDeep(MedicalRecordEditFormInitialValues));

    useEffect(() => {
        if (medicalRecordDetails) {
            setMedicalRecordEditInitialValues({
                onset_date: medicalRecordDetails.onset_date,
                injury_description: medicalRecordDetails.injury_description,
                limitations: medicalRecordDetails.limitations,
                case_physician: {
                    is_case_physician: medicalRecordDetails.case_physician.is_case_physician,
                    name: medicalRecordDetails.case_physician.name,
                    next_appointment: medicalRecordDetails.case_physician.next_appointment,
                    is_treated_script_received: medicalRecordDetails.case_physician.is_treated_script_received,
                },
                injury_details: medicalRecordDetails?.injury_details
            });
        }
    }, [medicalRecordDetails]);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        const payload = {...CommonService.removeKeysFromJSON(_.cloneDeep(values), ['body_part_details'])};
        payload.onset_date = moment(payload.onset_date).format('YYYY-MM-DD');

        if (medicalRecordId) {
            setIsMedicalRecordEditInProgress(true);
            CommonService._chartNotes.MedicalRecordEditAPICall(medicalRecordId, payload)
                .then((response: IAPIResponseType<any>) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY] || "Medical Record edited successfully", "success");
                    setIsMedicalRecordEditInProgress(false);
                    onSave();
                })
                .catch((error: any) => {
                    CommonService.handleErrors(setErrors, error, true);
                    setIsMedicalRecordEditInProgress(false)
                });
        }
    }, [medicalRecordId, onSave]);

    return (
        <div className={'edit-medical-record-component'}>
            <FormControlLabelComponent label={'Edit Record Details'} size={'xl'}/>
            <div className={'edit-medical-record-container'}>
                <Formik initialValues={medicalRecordEditInitialValues}
                        validationSchema={MedicalRecordValidationSchema}
                        validateOnChange={false}
                        validateOnBlur={true}
                        enableReinitialize={true}
                        validateOnMount={true}
                        onSubmit={onSubmit}>
                    {({values, touched, errors, setFieldValue, validateForm}) => {
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        useEffect(() => {
                            validateForm();
                        }, [validateForm, values]);
                        return (
                            <Form className="t-form" noValidate={true}>
                                {/*<FormDebuggerComponent values={values} />*/}
                                <div>
                                    <Field name={'onset_date'}>
                                        {
                                            (field: FieldProps) => (
                                                <FormikDatePickerComponent
                                                    label={'Date of Onset'}
                                                    placeholder={'Date of Onset'}
                                                    required={true}
                                                    formikField={field}
                                                    maxDate={moment()}
                                                    fullWidth={true}
                                                />
                                            )
                                        }
                                    </Field>
                                </div>
                                <div>
                                    <Field name={'injury_description'}>
                                        {
                                            (field: FieldProps) => (
                                                <FormikTextAreaComponent
                                                    label={'Injury Description'}
                                                    placeholder={'Enter Injury Description'}
                                                    formikField={field}
                                                    fullWidth={true}
                                                />
                                            )
                                        }
                                    </Field>
                                </div>
                                <div>
                                    <Field name={'limitations'}>
                                        {
                                            (field: FieldProps) => (
                                                <FormikTextAreaComponent
                                                    label={'Restrictions/Limitations'}
                                                    placeholder={'Enter Restrictions/Limitations'}
                                                    formikField={field}
                                                    fullWidth={true}
                                                />
                                            )
                                        }
                                    </Field>
                                </div>
                                <div>
                                    <Field name={'case_physician.is_case_physician'}>
                                        {
                                            (field: FieldProps) => (
                                                <FormikSelectComponent
                                                    options={CommonService._staticData.yesNoOptions}
                                                    displayWith={(option) => option.title}
                                                    valueExtractor={(option) => option.code}
                                                    label={'Is there a Case Physician?'}
                                                    formikField={field}
                                                    required={true}
                                                    fullWidth={true}
                                                    onUpdate={(value: any) => {
                                                        if (!value) {
                                                            setFieldValue('case_physician.name', '');
                                                            setFieldValue('case_physician.is_treated_script_received', '');
                                                            setFieldValue('case_physician.next_appointment', '');
                                                        }
                                                    }}
                                                />
                                            )
                                        }
                                    </Field>
                                </div>
                                {
                                    values?.case_physician?.is_case_physician && <>
                                        <div>
                                            <FormControlLabelComponent label={'MD Appointment Details:'}
                                                                       className={'appointment-heading'}/>
                                            <Field name={'case_physician.name'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikInputComponent
                                                            titleCase={true}
                                                            label={'Case Physician Name'}
                                                            formikField={field}
                                                            required={true}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                        <div>
                                            <Field name={'case_physician.is_treated_script_received'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikSelectComponent
                                                            options={CommonService._staticData.yesNoOptions}
                                                            displayWith={(option) => option.title}
                                                            valueExtractor={(option) => option.code}
                                                            label={'Treatment Script Received?'}
                                                            formikField={field}
                                                            required={true}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                        <div>
                                            <Field name={'case_physician.next_appointment'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikDatePickerComponent
                                                            label={'Next MD Appointment'}
                                                            formikField={field}
                                                            fullWidth={true}
                                                            minDate={moment()}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                    </>
                                }

                                <FormControlLabelComponent label={'Injury Details:'}
                                                           className={'appointment-heading'}/>
                                <FieldArray
                                    name="injury_details"
                                    render={arrayHelpers => (
                                        <>
                                            {values?.injury_details && values?.injury_details?.map((item: any, index: any) => {
                                                return (
                                                    <>
                                                        <div key={index} className="ts-row">
                                                            <div className="ts-col-lg-12">
                                                                <div className="ts-row" key={index}>
                                                                    <div className="ts-col-md-6">
                                                                        <Field
                                                                            name={`injury_details[${index}].body_part_id`}>
                                                                            {
                                                                                (field: FieldProps) => (
                                                                                    <FormikSelectComponent
                                                                                        options={bodyPartList}
                                                                                        label={'Body Part'}
                                                                                        displayWith={(item: any) => item?.name}
                                                                                        valueExtractor={(item: any) => item?._id}
                                                                                        formikField={field}
                                                                                        required={true}
                                                                                        fullWidth={true}
                                                                                        onUpdate={(value) => {
                                                                                            setFieldValue(`injury_details[${index}].body_part_details`, bodyPartList.find((item: any) => item?._id === value));
                                                                                            setFieldValue(`injury_details[${index}].injury_type_id`, '');
                                                                                            setFieldValue(`injury_details[${index}].body_side`, '');
                                                                                        }}
                                                                                    />
                                                                                )
                                                                            }
                                                                        </Field>
                                                                    </div>
                                                                    <div className="ts-col-md-6">
                                                                        <Field
                                                                            name={`injury_details[${index}].body_side`}>
                                                                            {
                                                                                (field: FieldProps) => (
                                                                                    <FormikSelectComponent
                                                                                        disabled={(values?.injury_details[index]?.body_part_details === "" || !values?.injury_details[index]?.body_part_details?.medical_record_applicable_sides || values?.injury_details[index]?.body_part_details?.medical_record_applicable_sides?.length === 0)}
                                                                                        options={values?.injury_details[index]?.body_part_details?.medical_record_applicable_sides}
                                                                                        label={'Body Side'}
                                                                                        displayWith={(item: any) => item}
                                                                                        valueExtractor={(item: any) => item}
                                                                                        formikField={field}
                                                                                        required={values?.injury_details[index]?.body_part_details?.medical_record_applicable_sides?.length > 0}
                                                                                        fullWidth={true}
                                                                                        onUpdate={() => {
                                                                                            setFieldValue(`injury_details[${index}].injury_type_id`, '');
                                                                                        }}
                                                                                    />
                                                                                )
                                                                            }
                                                                        </Field>
                                                                    </div>
                                                                    <div>
                                                                    </div>
                                                                    <div className={'ts-col-lg-12'}>
                                                                        <Field
                                                                            name={`injury_details[${index}].injury_type_id`}>
                                                                            {
                                                                                (field: FieldProps) => (
                                                                                    <FormikSelectComponent
                                                                                        options={injuryTypeList}
                                                                                        displayWith={(item: any) => item?.title}
                                                                                        valueExtractor={(item: any) => item?._id}
                                                                                        label={'Injury Type'}
                                                                                        formikField={field}
                                                                                        required={true}
                                                                                        fullWidth={true}
                                                                                    />
                                                                                )
                                                                            }
                                                                        </Field>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {
                                                            <div className="remove-btn">
                                                                <ButtonComponent
                                                                    disabled={values?.injury_details?.length === 1}
                                                                    color={"error"}
                                                                    fullWidth={true}
                                                                    variant={"outlined"}
                                                                    prefixIcon={<ImageConfig.CrossOutlinedIcon
                                                                        height={'16'}
                                                                        width={'16'}/>}
                                                                    onClick={() => {
                                                                        arrayHelpers.remove(index);
                                                                    }}>
                                                                    Remove Body Part
                                                                </ButtonComponent>
                                                            </div>
                                                        }
                                                        <HorizontalLineComponent/>
                                                    </>

                                                )
                                            })}
                                            {
                                                <div>
                                                    <ButtonComponent
                                                        onClick={() => {
                                                            arrayHelpers.push(MEDICAL_RECORD_BODY_PART);
                                                        }}
                                                        prefixIcon={<ImageConfig.AddCircleIcon/>}
                                                        variant={"text"}
                                                        className={"mrg-bottom-20"}
                                                    >
                                                        Add Another Body Part
                                                    </ButtonComponent>
                                                </div>
                                            }
                                        </>
                                    )}/>
                                <ButtonComponent fullWidth={true}
                                                 type={'submit'}
                                                 disabled={isMedicalRecordEditInProgress}
                                                 variant={'contained'}>
                                    {isMedicalRecordEditInProgress ? "Updating" : "Update"}
                                </ButtonComponent>
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </div>
    );

};

export default EditMedicalRecordComponent;
