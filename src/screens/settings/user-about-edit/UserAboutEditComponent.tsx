import "./UserAboutEditComponent.scss";
import React from "react";
import CardComponent from "../../../shared/components/card/CardComponent";
import {Field, FieldArray, FieldProps} from "formik";
import FormikTextAreaComponent from "../../../shared/components/form-controls/formik-text-area/FormikTextAreaComponent";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import FormikInputComponent from "../../../shared/components/form-controls/formik-input/FormikInputComponent";
import IconButtonComponent from "../../../shared/components/icon-button/IconButtonComponent";
import {ImageConfig} from "../../../constants";
import FormikCheckBoxComponent from "../../../shared/components/form-controls/formik-check-box/FormikCheckBoxComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import FormikSelectComponent from "../../../shared/components/form-controls/formik-select/FormikSelectComponent";

interface UserAboutEditComponentProps {
    values: any
}

const UserAboutEditComponent = (props: UserAboutEditComponentProps) => {
    const {values} = props;
    const {
        languageList,
    } = useSelector((state: IRootReducerState) => state.staticData);


    return (
        <div className={'user-about-edit-component'}>
            <div className={'edit-user-heading'}>EDIT ABOUT</div>
            <CardComponent title={"ABOUT"} size={"md"}>
                <div className={'ts-row'}>
                    <div className={'ts-col-md-12'}>
                        <Field name={'about.summary'}>
                            {
                                (field: FieldProps) => (
                                    <FormikTextAreaComponent
                                        label={'Profile Summary'}
                                        formikField={field}
                                        fullWidth={true}
                                        placeholder={'Enter Profile Summary'}
                                    />
                                )
                            }
                        </Field>
                    </div>
                </div>
                <FormControlLabelComponent label={'Specialities'}/>
                <FieldArray
                    name="specialities"
                    render={(arrayHelpers) => (
                        <>
                            {values?.specialities && values?.specialities?.map((item: any, index: any) => {
                                return (
                                    <div className="ts-row" key={index}>
                                        <div className="ts-col">
                                            <Field name={`specialities.${index}`}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikInputComponent
                                                            label={`Specialty ${index + 1}`}
                                                            placeholder={'Enter Specialty'}
                                                            type={"text"}
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
                                                                         arrayHelpers.push("");
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
                <FormControlLabelComponent label={'Languages'}/>

                <FieldArray
                    name="languages"
                    render={(arrayHelpers) => (
                        <>
                            {values?.languages && values?.languages?.map((item: any, index: any) => {
                                return (
                                    <div className="ts-row" key={index}>
                                        <div className="ts-col">
                                            <Field name={`languages.${index}.name`}>
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
                                            <div className="language-select ts-row">
                                                <div className="ts-col">
                                                    <Field name={`languages.${index}.read`}>
                                                        {
                                                            (field: FieldProps) => (
                                                                <FormikCheckBoxComponent
                                                                    label={'Read'}
                                                                    formikField={field}
                                                                    required={false}
                                                                    labelPlacement={"start"}
                                                                />
                                                            )
                                                        }
                                                    </Field>
                                                </div>
                                                <div className="ts-col">
                                                    <Field name={`languages.${index}.write`}>
                                                        {
                                                            (field: FieldProps) => (
                                                                <FormikCheckBoxComponent
                                                                    label={'Write'}
                                                                    formikField={field}
                                                                    required={false}
                                                                    labelPlacement={"start"}
                                                                />
                                                            )
                                                        }
                                                    </Field>
                                                </div>
                                                <div className="ts-col">
                                                    <Field name={`languages.${index}.speak`}>
                                                        {
                                                            (field: FieldProps) => (
                                                                <FormikCheckBoxComponent
                                                                    label={'Speak'}
                                                                    formikField={field}
                                                                    required={false}
                                                                    labelPlacement={"start"}
                                                                />
                                                            )
                                                        }
                                                    </Field>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ts-col-1">
                                            <div className="d-flex">
                                                <IconButtonComponent className={"form-helper-icon"}
                                                                     onClick={() => {
                                                                         arrayHelpers.push("");
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
            </CardComponent>
        </div>
    );

};

export default UserAboutEditComponent;