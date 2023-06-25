import "./UserEducationDetailsEditComponent.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import {Field, FieldArray, FieldProps} from "formik";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../constants";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import FormikDatePickerComponent
    from "../../../shared/components/form-controls/formik-date-picker/FormikDatePickerComponent";
import {CommonService} from "../../../shared/services";
import React from "react";

interface UserEducationDetailsEditComponentProps {
    values: any

}

const UserEducationDetailsEditComponent = (props: UserEducationDetailsEditComponentProps) => {
    const {values} = props;

    return (
        <div className={'user-education-details-edit-component'}>
            <div className={'edit-user-heading'}>EDIT Education details</div>
            <CardComponent title={"Education details"} size={"md"}>
                <FieldArray
                    name="education_details"
                    render={(arrayHelpers) => (
                        <>
                            {values?.education_details && values?.education_details?.map((item: any, index: any) => {
                                return (
                                    <>
                                        <div className="d-flex ts-align-items-center mrg-bottom-24">
                                            <FormControlLabelComponent label={`Experience ${index + 1}:`}/>
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
                                                <Field name={`education_details[${index}].institution_name`}>
                                                    {
                                                        (field: FieldProps) => (
                                                            <FormikInputComponent
                                                                label={'Company Name'}
                                                                placeholder={'Enter Company Name'}
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
                                                <Field name={`education_details[${index}].institution_location`}>
                                                    {
                                                        (field: FieldProps) => (
                                                            <FormikInputComponent
                                                                label={'Company Location'}
                                                                placeholder={'Enter Company Location'}
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
                                                                label={'Position Title'}
                                                                placeholder={'Enter Position Title'}
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
                                                        company_name: "",
                                                        company_location: "",
                                                        position: "",
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
            </CardComponent>
        </div>
    );

};

export default UserEducationDetailsEditComponent;