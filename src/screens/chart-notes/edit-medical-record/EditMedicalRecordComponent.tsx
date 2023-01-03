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

interface EditMedicalRecordComponentProps {
    medicalRecordId: string;
    medicalRecordDetails: any;
    onSave: () => void;
}

const MEDICAL_RECORD_BODY_PART = {
    body_part_id: "",
    body_side: "",
    injury_type_id: "",
};

const InjuryDetailsRecordValidationSchema = Yup.object().shape({
    body_part_id: Yup.string().required("Body Part is required"),
    body_side: Yup.mixed().required("Body Side is required"),
    injury_type_id: Yup.mixed().required("Injury Type is required"),
});

const MedicalRecordValidationSchema = Yup.object({
    onset_date: Yup.date().required("Onset date is required"),
    case_physician: Yup.object({
        name: Yup.string().required("Case physician name is required"),
    }),
    injury_details: Yup.array().of(InjuryDetailsRecordValidationSchema)
});


const EditMedicalRecordComponent = (props: EditMedicalRecordComponentProps) => {

    const {medicalRecordId, medicalRecordDetails, onSave} = props;
    const [isMedicalRecordEditInProgress, setIsMedicalRecordEditInProgress] = useState<boolean>(false);
    const {injuryTypeList, bodyPartList} = useSelector((state: IRootReducerState) => state.staticData);

    const [medicalRecordEditInitialValues, setMedicalRecordEditInitialValues] = useState<any>({
        onset_date: "",
        injury_description: "",
        limitations: "",
        case_physician: {
            is_case_physician: false,
            name: "",
            next_appointment: "",
            is_treated_script_received: false,
        },
        injury_details: [
            MEDICAL_RECORD_BODY_PART
        ],
    });

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
                },
                injury_details: medicalRecordDetails.injury_details
            });
        }
    }, [medicalRecordDetails]);

    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        const payload = {...CommonService.removeKeysFromJSON(_.cloneDeep(values), ['body_part_details'])};
        if (medicalRecordId) {
            setIsMedicalRecordEditInProgress(true);
            payload.onset_date = CommonService.convertDateFormat(payload?.onset_date);
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
    }, [medicalRecordId]);

    return (
        <div className={'edit-medical-record-component'}>
            <FormControlLabelComponent label={'Edit Details'} size={'lg'}/>
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
                                <div>
                                    <Field name={'onset_date'}>
                                        {
                                            (field: FieldProps) => (
                                                <FormikDatePickerComponent
                                                    label={'Date Of Onset'}
                                                    placeholder={'Date Of Onset'}
                                                    formikField={field}
                                                    required={true}
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
                                            <Field name={'case_physician.next_appointment'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikDatePickerComponent
                                                            label={'Next MD appointment'}
                                                            formikField={field}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                    </>
                                }
                                <FormControlLabelComponent label={'Injury Details'} size={'md'}/>
                                <FieldArray
                                    name="injury_details"
                                    render={arrayHelpers => (
                                        <>
                                            {values?.injury_details && values?.injury_details?.map((item: any, index: any) => {
                                                return (
                                                    <>
                                                        {
                                                            <div className="remove-btn">
                                                                <ButtonComponent
                                                                    size={"small"}
                                                                    color={"error"}
                                                                    variant={"outlined"}
                                                                    prefixIcon={<ImageConfig.DeleteIcon/>}
                                                                    onClick={() => {
                                                                        arrayHelpers.remove(index);
                                                                    }}>
                                                                    Delete
                                                                </ButtonComponent>
                                                            </div>
                                                        }
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
                                                                                        onUpdate={() => {
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
                                                                                        disabled={values?.injury_details[index]?.body_part_id === ""}
                                                                                        options={bodyPartList?.find((item: IBodyPart) => item?._id === values?.injury_details[index]?.body_part_id)?.sides}
                                                                                        label={'Body Side'}
                                                                                        displayWith={(item: any) => item}
                                                                                        valueExtractor={(item: any) => item}
                                                                                        formikField={field}
                                                                                        required={true}
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
                                                        <HorizontalLineComponent/>
                                                    </>
                                                )
                                            })}
                                            {
                                                <div className={'add-body-part-button'}>
                                                    <ButtonComponent
                                                        onClick={() => {
                                                            arrayHelpers.push(MEDICAL_RECORD_BODY_PART);
                                                        }}
                                                        prefixIcon={<ImageConfig.AddIcon/>}
                                                        variant={"text"}
                                                        className={"mrg-bottom-20"}
                                                    >
                                                        Add New Body Part
                                                    </ButtonComponent>
                                                </div>
                                            }
                                        </>
                                    )}/>
                                <ButtonComponent fullWidth={true}
                                                 type={'submit'}
                                                 disabled={isMedicalRecordEditInProgress}
                                                 variant={'contained'}>
                                    {isMedicalRecordEditInProgress ? "Saving" : "Save"}
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
