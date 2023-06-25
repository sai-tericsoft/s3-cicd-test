import "./UserEmergencyContactDetailsEditComponent.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import {Field, FieldArray, FieldProps} from "formik";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import FormikSelectComponent from "../../../shared/components/form-controls/formik-select/FormikSelectComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import FormikPhoneInputComponent
    from "../../../shared/components/form-controls/formik-phone-input/FormikPhoneInputComponent";
import IconButtonComponent from "../../../shared/components/icon-button/IconButtonComponent";
import ToolTipComponent from "../../../shared/components/tool-tip/ToolTipComponent";
import {ImageConfig} from "../../../constants";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import HorizontalLineComponent
    from "../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";

interface UserEmergencyContactDetailsEditComponentProps {
    values: any;
    setFieldValue: any
}

const UserEmergencyContactDetailsEditComponent = (props: UserEmergencyContactDetailsEditComponentProps) => {
    const {values, setFieldValue} = props
    const {
        phoneTypeList,
        languageList,
        relationshipList
    } = useSelector((state: IRootReducerState) => state.staticData);

    return (
        <div className={'user-emergency-contact-details-edit-component'}>
            <CardComponent title={"Emergency Contact Information"} size={"md"}>
                <FormControlLabelComponent label={"Primary Emergency Contact"} size={'sm'}/>
                <div className="ts-row">
                    <div className="ts-col">
                        <Field name={'emergency_contact_info.primary_emergency.name'}>
                            {
                                (field: FieldProps) => (
                                    <FormikInputComponent
                                        label={'Full Name'}
                                        placeholder={'E.g. John Doe'}
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
                        <Field name={'emergency_contact_info.primary_emergency.relationship'}>
                            {
                                (field: FieldProps) => (
                                    <FormikSelectComponent
                                        options={relationshipList}
                                        label={'Relationship'}
                                        required={true}
                                        formikField={field}
                                        fullWidth={true}
                                    />
                                )
                            }
                        </Field>
                    </div>
                    <div className="ts-col-1"></div>
                </div>
                <div className="ts-row">
                    <div className="ts-col">
                        <Field name={'emergency_contact_info.primary_emergency.language'}>
                            {
                                (field: FieldProps) => (
                                    <FormikSelectComponent
                                        options={languageList}
                                        label={'Language'}
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
                    <div className="ts-col-1"></div>
                </div>
                <FormControlLabelComponent size={'sm'} label={'Primary Phone :'}/>
                <div className="ts-row">
                    <div className="ts-col">
                        <Field
                            name={'emergency_contact_info.primary_emergency.primary_contact_info.phone_type'}>
                            {
                                (field: FieldProps) => (
                                    <FormikSelectComponent
                                        options={phoneTypeList}
                                        label={'Phone Type'}
                                        required={true}
                                        formikField={field}
                                        fullWidth={true}
                                    />
                                )
                            }
                        </Field>
                    </div>
                    <div className="ts-col">
                        <Field
                            name={'emergency_contact_info.primary_emergency.primary_contact_info.phone'}>
                            {
                                (field: FieldProps) => (
                                    <FormikPhoneInputComponent
                                        label={'Phone Number'}
                                        // placeholder={'Phone Number'}
                                        required={true}
                                        formikField={field}
                                        fullWidth={true}
                                    />
                                )
                            }
                        </Field>
                    </div>
                    <div className="ts-col-1">
                        <IconButtonComponent className={"form-helper-icon"}>
                            <ToolTipComponent
                                showArrow={true}
                                position={"left"}
                                tooltip={"This phone number will be used to communicate with your emergency contact in case of emergency. Please ensure that this number is constantly operational."}>
                                <ImageConfig.InfoIcon/>
                            </ToolTipComponent>
                        </IconButtonComponent>
                    </div>
                </div>
                {/*<HorizontalLineComponent className={'primary-phone-divider'}/>*/}
                <FormControlLabelComponent size={'sm'} label={'Alternate Phone :'}/>
                <FieldArray
                    name="emergency_contact_info.primary_emergency.secondary_contact_info"
                    render={(arrayHelpers) => (
                        <>
                            {values?.emergency_contact_info?.primary_emergency?.secondary_contact_info && values?.emergency_contact_info?.primary_emergency?.secondary_contact_info?.map((item: any, index: any) => {
                                return (
                                    <div className="ts-row" key={index}>
                                        <div className="ts-col">
                                            <Field
                                                name={`emergency_contact_info.primary_emergency.secondary_contact_info[${index}].phone_type`}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikSelectComponent
                                                            options={phoneTypeList}
                                                            label={'Phone Type'}
                                                            formikField={field}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                        <div className="ts-col">
                                            <Field
                                                name={`emergency_contact_info.primary_emergency.secondary_contact_info[${index}].phone`}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikPhoneInputComponent
                                                            label={'Phone Number'}
                                                            // placeholder={'Phone Number'}
                                                            formikField={field}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                        </div>
                                        <div className="ts-col-1">
                                            <div className="d-flex">
                                                <IconButtonComponent className={"form-helper-icon"}
                                                                     onClick={() => {
                                                                         arrayHelpers.push({
                                                                             phone_type: undefined,
                                                                             phone: undefined
                                                                         });
                                                                     }}
                                                >
                                                    <ImageConfig.AddCircleIcon/>
                                                </IconButtonComponent>
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
                                    </div>
                                )
                            })}
                        </>
                    )}/>

                {!values.show_secondary_emergency_form &&
                <div className={'display-flex justify-content-center flex-1'}>
                    <ButtonComponent
                        className={'add-another-contact-cta'}
                        onClick={() => {
                            setFieldValue('show_secondary_emergency_form', true)
                        }}
                        prefixIcon={<ImageConfig.AddIcon/>}>
                        Add Another
                        Contact</ButtonComponent>
                </div>}
                <>
                    {values.show_secondary_emergency_form &&
                    <>
                        <HorizontalLineComponent className={'secondary-emergency-divider'}/>
                        <div className={'d-flex ts-align-items-center mrg-bottom-24'}>
                            <FormControlLabelComponent label={"Secondary Emergency Contact"}/>
                            <ButtonComponent className={'remove-contact-button'}
                                             prefixIcon={<ImageConfig.CloseIcon/>}
                                             variant={'contained'} color={'error'}
                                             onClick={() => {
                                                 setFieldValue('show_secondary_emergency_form', false)
                                             }}
                            >Remove
                                Contact</ButtonComponent>
                        </div>
                        <div className="ts-row">
                            <div className="ts-col">
                                <Field name={'emergency_contact_info.secondary_emergency.name'}>
                                    {
                                        (field: FieldProps) => (
                                            <FormikInputComponent
                                                label={'Full Name'}
                                                placeholder={'E.g John Doe'}
                                                type={"text"}
                                                formikField={field}
                                                fullWidth={true}
                                            />
                                        )
                                    }
                                </Field>
                            </div>
                            <div className="ts-col">
                                <Field
                                    name={'emergency_contact_info.secondary_emergency.relationship'}>
                                    {
                                        (field: FieldProps) => (
                                            <FormikSelectComponent
                                                options={relationshipList}
                                                label={'Relationship'}
                                                formikField={field}
                                                fullWidth={true}
                                            />
                                        )
                                    }
                                </Field>
                            </div>
                            <div className="ts-col-1"></div>
                        </div>
                        <div className="ts-row">
                            <div className="ts-col">
                                <Field name={'emergency_contact_info.secondary_emergency.language'}>
                                    {
                                        (field: FieldProps) => (
                                            <FormikSelectComponent
                                                options={languageList}
                                                label={'Language'}
                                                formikField={field}
                                                fullWidth={true}
                                            />
                                        )
                                    }
                                </Field>
                            </div>
                            <div className="ts-col">
                            </div>
                            <div className="ts-col-1"></div>
                        </div>
                        <div className="ts-row">
                            <div className="ts-col">
                                <Field
                                    name={'emergency_contact_info.secondary_emergency.primary_contact_info.phone_type'}>
                                    {
                                        (field: FieldProps) => (
                                            <FormikSelectComponent
                                                options={phoneTypeList}
                                                label={'Phone Type'}
                                                formikField={field}
                                                fullWidth={true}
                                            />
                                        )
                                    }
                                </Field>
                            </div>
                            <div className="ts-col">
                                <Field
                                    name={'emergency_contact_info.secondary_emergency.primary_contact_info.phone'}>
                                    {
                                        (field: FieldProps) => (
                                            <FormikPhoneInputComponent
                                                label={'Phone Number'}
                                                // placeholder={'Phone Number (Primary)'}
                                                formikField={field}
                                                fullWidth={true}
                                            />
                                        )
                                    }
                                </Field>
                            </div>
                            <div className="ts-col-1">
                                <IconButtonComponent className={"form-helper-icon"}>
                                    <ToolTipComponent
                                        showArrow={true}
                                        position={"left"}
                                        tooltip={"This phone number will be used to communicate with your emergency contact in case of emergency. Please ensure that this number is constantly operational."}>
                                        <ImageConfig.InfoIcon/>
                                    </ToolTipComponent>
                                </IconButtonComponent>
                            </div>
                        </div>
                        <FieldArray
                            name="emergency_contact_info.secondary_emergency.secondary_contact_info"
                            render={(arrayHelpers) => (
                                <>
                                    {values?.emergency_contact_info?.secondary_emergency?.secondary_contact_info && values?.emergency_contact_info?.secondary_emergency?.secondary_contact_info?.map((item: any, index: any) => {
                                        return (
                                            <div className="ts-row" key={index}>
                                                <div className="ts-col">
                                                    <Field
                                                        name={`emergency_contact_info.secondary_emergency.secondary_contact_info[${index}].phone_type`}>
                                                        {
                                                            (field: FieldProps) => (
                                                                <FormikSelectComponent
                                                                    options={phoneTypeList}
                                                                    label={'Phone Type'}
                                                                    formikField={field}
                                                                    fullWidth={true}
                                                                />
                                                            )
                                                        }
                                                    </Field>
                                                </div>
                                                <div className="ts-col">
                                                    <Field
                                                        name={`emergency_contact_info.secondary_emergency.secondary_contact_info[${index}].phone`}>
                                                        {
                                                            (field: FieldProps) => (
                                                                <FormikPhoneInputComponent
                                                                    label={'Phone Number'}
                                                                    // placeholder={'Phone Number'}
                                                                    formikField={field}
                                                                    fullWidth={true}
                                                                />
                                                            )
                                                        }
                                                    </Field>
                                                </div>
                                                <div className="ts-col-1">
                                                    <div className="d-flex">
                                                        <IconButtonComponent
                                                            className={"form-helper-icon"}
                                                            onClick={() => {
                                                                arrayHelpers.push({
                                                                    phone_type: undefined,
                                                                    phone: undefined
                                                                });
                                                            }}
                                                        >
                                                            <ImageConfig.AddCircleIcon/>
                                                        </IconButtonComponent>
                                                        {index > 0 &&
                                                        <IconButtonComponent
                                                            className={"form-helper-icon"}
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
                            )}/>
                    </>
                    }
                </>
            </CardComponent>
        </div>
    );

};

export default UserEmergencyContactDetailsEditComponent;