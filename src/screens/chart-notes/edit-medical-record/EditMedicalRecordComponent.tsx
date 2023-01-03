import "./EditMedicalRecordComponent.scss";
import DrawerComponent from "../../../shared/components/drawer/DrawerComponent";
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
import {useParams} from "react-router-dom";
import * as Yup from "yup";
import HorizontalLineComponent
    from "../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";
import _ from "lodash";

interface EditMedicalRecordComponentProps {

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

    const {medicalId} = useParams();
    const [isMedicalRecordEditInProgress, setIsMedicalRecordEditInProgress] = useState<boolean>(false);
    const [MedicalDetails, setMedicalDetails] = useState<any | undefined>(undefined);
    const {injuryTypeList, bodyPartList} = useSelector((state: IRootReducerState) => state.staticData);
    const [isMedicalRecordDrawerOpen, setIsMedicalRecordDrawerOpen] = useState<boolean>(false);

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
        if (medicalId) {
            getMedicalRecordData(medicalId)
        }
    }, [medicalId]);

    const handleMedicalDrawer = useCallback( () => {
        setIsMedicalRecordDrawerOpen(false)
    }, []);

    const getMedicalRecordData = useCallback((medicalId: string) => {
        CommonService._chartNotes.MedicalRecordDetailsAPICall(medicalId, {})
            .then((response: IAPIResponseType<any>) => {
                setMedicalDetails(response.data);
            }).catch((error: any) => {

        })
    }, []);

    useEffect(() => {
        if (MedicalDetails) {
            setMedicalRecordEditInitialValues({
                onset_date: MedicalDetails.onset_date,
                injury_description: MedicalDetails.injury_description,
                limitations: MedicalDetails.limitations,
                case_physician: {
                    is_case_physician: MedicalDetails.case_physician.is_case_physician,
                    name: MedicalDetails.case_physician.name,
                    next_appointment: MedicalDetails.case_physician.next_appointment,
                },
                injury_details: MedicalDetails.injury_details
            });
        }
    }, [MedicalDetails]);


    const onSubmit = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {
        const payload = {...CommonService.removeKeysFromJSON(_.cloneDeep(values), ['body_part_details'])};
        if (medicalId) {
            setIsMedicalRecordEditInProgress(true);
            values.onset_date = CommonService.convertDateFormat(values?.onset_date);
            const formData = CommonService.getFormDataFromJSON(payload);
            CommonService._chartNotes.MedicalRecordEditAPICall(medicalId, formData)
                .then((response: IAPIResponseType<any>) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    setIsMedicalRecordEditInProgress(false);
                })
                .catch((error: any) => {
                    CommonService.handleErrors(setErrors, error, true);
                    setIsMedicalRecordEditInProgress(false)
                })
        }
    }, [medicalId]);

    return (
        <div className={'edit-medical-record-component'}>
            <ButtonComponent onClick={()=>setIsMedicalRecordDrawerOpen(true)}>Open</ButtonComponent>
            <div>
                <DrawerComponent isOpen={isMedicalRecordDrawerOpen}
                                 showClose={true}
                                 onClose={handleMedicalDrawer}>

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
                                                                            <div className="ts-col-lg-6">
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
                                                                            <div className="ts-col-lg-6">
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
                </DrawerComponent>
            </div>
        </div>
    );

};

export default EditMedicalRecordComponent;
