import "./UserContactInformationEditComponent.scss";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import CardComponent from "../../../shared/components/card/CardComponent";
import {Field, FieldArray, FieldProps} from "formik";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import FormikSelectComponent from "../../../shared/components/form-controls/formik-select/FormikSelectComponent";
import FormikPhoneInputComponent
    from "../../../shared/components/form-controls/formik-phone-input/FormikPhoneInputComponent";
import IconButtonComponent from "../../../shared/components/icon-button/IconButtonComponent";
import ToolTipComponent from "../../../shared/components/tool-tip/ToolTipComponent";
import {ImageConfig} from "../../../constants";
import HorizontalLineComponent
    from "../../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";
import React from "react";

interface UserContactInformationEditComponentProps {
    contactInformation: any;
}

const UserContactInformationEditComponent = (props: UserContactInformationEditComponentProps) => {
    const {contactInformation} = props
    const {
        phoneTypeList,
    } = useSelector((state: IRootReducerState) => state.staticData);
    return (
        <div className={'user-contact-information-edit-component'}>
            <div className={'edit-user-heading'}>Edit Personal Details</div>
            <CardComponent title={"Contact Information"} size={"md"}>
                <FormControlLabelComponent size={'sm'} label={'Primary Phone :'}/>
                <div className="ts-row">
                    <div className="ts-col">
                        <Field name={'contact_information.primary_contact_info.phone_type'}>
                            {
                                (field: FieldProps) => (
                                    <FormikSelectComponent
                                        options={phoneTypeList}
                                        label={'Phone Type'}
                                        required={true}
                                        id={'primary_phone_type'}
                                        formikField={field}
                                        fullWidth={true}
                                    />
                                )
                            }
                        </Field>
                    </div>
                    <div className="ts-col">
                        <Field name={'contact_information.primary_contact_info.phone'}>
                            {
                                (field: FieldProps) => (
                                    <FormikPhoneInputComponent
                                        label={'Phone Number'}
                                        // placeholder={'Phone Number (Primary)'}
                                        required={true}
                                        formikField={field}
                                        id={'primary_phone_number'}
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
                                tooltip={"This phone number will be used as the primary number for your account. Please ensure that this number is constantly operational."}>
                                <ImageConfig.InfoIcon/>
                            </ToolTipComponent>
                        </IconButtonComponent>
                    </div>
                </div>
                {/*<HorizontalLineComponent className={'primary-phone-divider'}/>*/}
                <FormControlLabelComponent size={'sm'} label={'Alternate Phone :'}/>
                <FieldArray
                    name="contact_information.secondary_contact_info"
                    render={(arrayHelpers) => (
                        <>
                            {contactInformation?.secondary_contact_info && contactInformation?.secondary_contact_info?.map((item: any, index: any) => {
                                return (
                                    <div className="ts-row" key={index}>
                                        <div className="ts-col">
                                            <Field
                                                name={`contact_information.secondary_contact_info[${index}].phone_type`}>
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
                                            <Field name={`contact_information.secondary_contact_info[${index}].phone`}>
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
                <HorizontalLineComponent/>
                <FormControlLabelComponent size={'sm'} label={'Primary Email :'}/>
                <div className="ts-row">
                    <div className="ts-col">
                        <Field name={'contact_information.primary_email'}>
                            {
                                (field: FieldProps) => (
                                    <FormikInputComponent
                                        label={'Email'}
                                        placeholder={'example@email.com'}
                                        type={"email"}
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
                                position={"right"}
                                tooltip={"This email address will be used as the primary email address for your account. Please ensure that this email address is constantly operational."}>
                                <ImageConfig.InfoIcon/>
                            </ToolTipComponent>
                        </IconButtonComponent>
                    </div>
                    <div className="ts-col"/>
                </div>
                {/*<HorizontalLineComponent className={'primary-phone-divider'}/>*/}
                <FormControlLabelComponent size={'sm'} label={'Alternate Email :'}/>
                <FieldArray
                    name="contact_information.secondary_emails"
                    render={(arrayHelpers) => (
                        <>
                            {contactInformation?.secondary_emails && contactInformation?.secondary_emails?.map((item: any, index: any) => {
                                return (
                                    <div className="ts-row" key={index}>
                                        <div className="ts-col">
                                            <Field name={`contact_information.secondary_emails[${index}].email`}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikInputComponent
                                                            label={'Email'}
                                                            placeholder={'example@email.com'}
                                                            type={"email"}
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
                                                                             email: undefined,
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
                                        <div className="ts-col"/>
                                    </div>
                                )
                            })}
                        </>
                    )}/>
            </CardComponent>
        </div>
    );

};

export default UserContactInformationEditComponent;