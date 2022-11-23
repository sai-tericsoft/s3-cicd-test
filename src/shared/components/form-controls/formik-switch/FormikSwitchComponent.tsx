import "./FormikSwitchComponent.scss";
import {ISwitchProps} from "../../../models/form-controls.model";
import {FieldProps} from "formik";
import {useCallback} from "react";
import _ from "lodash";
import SwitchComponent from "../switch/SwitchComponent";

interface FormikSwitchComponentProps extends ISwitchProps {
    formikField: FieldProps;
}

const FormikSwitchComponent = (props: FormikSwitchComponentProps) => {

    const {formikField, color, size, id, label, disabled, onChange, required} = props;
    const labelPlacement = props.labelPlacement || 'end';

    const {field, form} = formikField;
    const {name, value} = field;
    const {setFieldTouched, touched, errors, setFieldValue} = form;
    const hasError = _.get(touched, name) && !!(_.get(errors, name));

    const onValueChange = useCallback((isChecked: boolean) => {
        setFieldValue(name, isChecked);
        setFieldTouched(name);
        if (onChange) {
            onChange(isChecked);
        }
    }, [setFieldValue, setFieldTouched, name, onChange]);

    return (
        <SwitchComponent
            color={color}
            size={size}
            name={name}
            checked={value}
            label={label}
            labelPlacement={labelPlacement}
            id={id}
            required={required}
            disabled={disabled}
            value={value}
            onChange={onValueChange}
            hasError={hasError}
            errorMessage={hasError && _.get(errors, name)}
        />
    );
};

export default FormikSwitchComponent;