import "./FormikCheckBoxComponent.scss";
import {ICheckBoxProps} from "../../../models/form-controls.model";
import {FieldProps} from "formik";
import {useCallback} from "react";
import CheckBoxComponent from "../check-box/CheckBoxComponent";
import _ from "lodash";

interface FormikCheckBoxComponentProps extends ICheckBoxProps {
    formikField: FieldProps;
}

const FormikCheckBoxComponent = (props: FormikCheckBoxComponentProps) => {

    const {formikField, onChange, ...otherProps} = props;
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
        <CheckBoxComponent
            name={name}
            checked={value}
            value={value}
            onChange={onValueChange}
            hasError={hasError}
            errorMessage={hasError && _.get(errors, name)}
            {...otherProps}
        />
    );
};

export default FormikCheckBoxComponent;