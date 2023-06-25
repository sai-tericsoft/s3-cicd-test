import "./UserAddressDetailsEditComponent.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import {Field, FieldProps} from "formik";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";

interface UserAddressDetailsEditComponentProps {

}

const UserAddressDetailsEditComponent = (props: UserAddressDetailsEditComponentProps) => {

    return (
        <div className={'user-address-details-edit-component'}>
            <CardComponent title={"Address Information"} size={"md"}>
                <div className="ts-row">
                    <div className="ts-col">
                        <Field name={'address.address_line'}>
                            {
                                (field: FieldProps) => (
                                    <FormikInputComponent
                                        label={'Address Line'}
                                        placeholder={'Enter Address Line'}
                                        type={"text"}
                                        required={true}
                                        formikField={field}
                                        fullWidth={true}
                                    />
                                )
                            }
                        </Field>
                    </div>
                    <div className="ts-col">
                        <Field name={'address.city'}>
                            {
                                (field: FieldProps) => (
                                    <FormikInputComponent
                                        label={'City'}
                                        placeholder={'Enter City'}
                                        type={"text"}
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
                        <Field name={'address.state'}>
                            {
                                (field: FieldProps) => (
                                    <FormikInputComponent
                                        label={'State'}
                                        placeholder={'Enter State'}
                                        type={"text"}
                                        required={true}
                                        formikField={field}
                                        fullWidth={true}
                                    />
                                )
                            }
                        </Field>
                    </div>
                    <div className="ts-col">
                        <Field name={'address.zip_code'}>
                            {
                                (field: FieldProps) => (
                                    <FormikInputComponent
                                        label={'ZIP Code'}
                                        placeholder={'Enter ZIP Code'}
                                        type={"text"}
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
                        <Field name={'address.country'}>
                            {
                                (field: FieldProps) => (
                                    <FormikInputComponent
                                        label={'Country'}
                                        placeholder={'Enter Country'}
                                        type={"text"}
                                        required={true}
                                        formikField={field}
                                        fullWidth={true}
                                    />
                                )
                            }
                        </Field>
                    </div>
                    <div className="ts-col">
                    </div>
                </div>
            </CardComponent>
        </div>
    );

};

export default UserAddressDetailsEditComponent;