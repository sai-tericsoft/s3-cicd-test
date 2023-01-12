import "./FormikRadioButtonComponent.scss";
import {FieldProps} from "formik";
import {IRadioButtonGroupProps} from "../../../models/form-controls.model";
import _ from "lodash";
import {useCallback} from "react";
import RadioButtonGroupComponent from "../radio-button/RadioButtonComponent";

interface FormikRadioButtonComponentProps extends IRadioButtonGroupProps {
    formikField: FieldProps;
}

const FormikRadioButtonGroupComponent = (props: FormikRadioButtonComponentProps) => {

    const {
        formikField,
        onChange,
        ...otherProps
    } = props;
    const {form, field} = formikField;
    const {name, value} = field;
    const {setFieldTouched, touched, errors, setFieldValue} = form;
    const hasError = _.get(touched, name) && !!(_.get(errors, name));
    otherProps.id = otherProps.id || name;

    const onValueChange = useCallback((value: any) => {
        setFieldTouched(name);
        setFieldValue(name, value);
        if (onChange) {
            onChange(value)
        }
    }, [setFieldValue, setFieldTouched, onChange, name])

    return (
        <RadioButtonGroupComponent
            name={name}
            value={value}
            onChange={onValueChange}
            hasError={hasError}
            errorMessage={hasError && _.get(errors, name)}
            {...otherProps}
        />
    );

};

export default FormikRadioButtonGroupComponent;