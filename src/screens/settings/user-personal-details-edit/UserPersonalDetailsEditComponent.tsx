import "./UserPersonalDetailsEditComponent.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import {Field, FieldProps} from "formik";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import FormikDatePickerComponent
    from "../../../shared/components/form-controls/formik-date-picker/FormikDatePickerComponent";
import {CommonService} from "../../../shared/services";
import FormikSelectComponent from "../../../shared/components/form-controls/formik-select/FormikSelectComponent";
import {Patterns} from "../../../constants";
import React from "react";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import FormikAutoCompleteComponent
    from "../../../shared/components/form-controls/formik-auto-complete/FormikAutoCompleteComponent";

interface UserPersonalDetailsEditComponentProps {

}

const UserPersonalDetailsEditComponent = (props: UserPersonalDetailsEditComponentProps) => {
    const {
        genderList,
        facilityListLite,
        roleList
    } = useSelector((state: IRootReducerState) => state.staticData);

    return (
        <div className={'user-personal-details-edit-component'}>
            <div className={'edit-user-heading'}>Edit Personal Details</div>
            <CardComponent title={"Personal Details"} size={"md"}>
                <div className="ts-row">
                    <div className="ts-col">
                        <Field name={'personal_details.first_name'}>
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
                        <Field name={'personal_details.last_name'}>
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
                        <Field name={'personal_details.dob'}>
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
                        <Field name={'personal_details.gender'}>
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
                        <Field name={'personal_details.nick_name'}>
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
                        <Field name={'personal_details.npi_number'}>
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
                        <Field name={'personal_details.license_number'}>
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
                        <Field name={'personal_details.ssn'}>
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
                        <Field name={'personal_details.role'}>
                            {
                                (field: FieldProps) => (
                                    <FormikSelectComponent
                                        options={roleList}
                                        label={'Role'}
                                        required={true}
                                        // disabled={true}
                                        formikField={field}
                                        fullWidth={true}
                                    />
                                )
                            }
                        </Field>
                    </div>
                    <div className={'ts-col-md-6'}>
                        <Field name={'personal_details.assigned_facilities'}>
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
            </CardComponent>
        </div>
    );

};

export default UserPersonalDetailsEditComponent;