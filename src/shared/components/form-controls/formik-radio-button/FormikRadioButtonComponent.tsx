import "./FormikRadioButtonComponent.scss";
import {FieldProps} from "formik";
import {IRadioProps} from "../../../models/form-controls.model";
import _ from "lodash";
import {useCallback} from "react";
import RadioButtonGroupComponent from "../radio-button/RadioButtonComponent";

interface FormikRadioButtonComponentProps extends IRadioProps {
    formikField: FieldProps;
}

const FormikRadioButtonComponent = (props: FormikRadioButtonComponentProps) => {
    const {formikField, id, label, disabled, options, onChange, required} = props;
    const {form, field} = formikField;
    const {name, value} = field;
    const {setFieldTouched, touched, errors, setFieldValue} = form;
    const hasError = _.get(touched, name) && !!(_.get(errors, name));

    const onValueChange = useCallback((value: any) => {
        setFieldTouched(name);
        setFieldValue(name, value);

        if (onChange) {
            onChange(value)
        }
    }, [setFieldValue, setFieldTouched, onChange, name])

    return (
        <RadioButtonGroupComponent label={label}
                                   id={id}
                                   name={name}
                                   options={options}
                                   value={value}
                                   disabled={disabled}
                                   required={required}
                                   onChange={onValueChange}
                                   hasError={hasError}
                                   errorMessage={hasError && _.get(errors, name)}

        />
    );

};

export default FormikRadioButtonComponent;