import "./FormikPasswordInputComponent.scss";
import {FieldProps} from "formik";
import _ from "lodash";
import {useCallback} from "react";
import PasswordInputComponent, {PasswordInputComponentProps} from "../password-input/PasswordInputComponent";

interface FormikPasswordInputComponentProps extends PasswordInputComponentProps {
    formikField: FieldProps;
    canToggle?: boolean;
}

const FormikPasswordInputComponent = (props: FormikPasswordInputComponentProps) => {

    const {
        label,
        prefix,
        className,
        disabled,
        id,
        required,
        formikField,
        onChange
    } = props;

    const variant = props.variant || "outlined";
    const size = props.size || "medium";
    const fullWidth = props.fullWidth || false;
    const placeholder = props.placeholder || label;

    const {field, form} = formikField;
    const {name, value} = field;
    const {setFieldTouched, touched, handleBlur, errors, setFieldValue} = form;
    const hasError = _.get(touched, name) && !!(_.get(errors, name));

    const textChangeHandler = useCallback((text: string) => {
        setFieldValue(name, text);
        setFieldTouched(name);
        if (onChange) {
            onChange(text);
        }
    }, [setFieldValue, setFieldTouched, name, onChange]);

    const onInputBlur = useCallback(() => {
        handleBlur(name);
        setFieldTouched(name);
    }, [name, handleBlur, setFieldTouched]);

    return (
        <div className={'FormikPasswordInputComponent'}>
            <PasswordInputComponent label={label}
                                    disabled={disabled}
                                    id={id}
                                    name={name}
                                    required={required}
                                    value={value}
                                    size={size} className={className}
                                    fullWidth={fullWidth}
                                    variant={variant}
                                    placeholder={placeholder}
                                    inputProps={{
                                        onBlur: onInputBlur,
                                    }}
                                    onChange={textChangeHandler}
                                    prefix={prefix}
                                    hasError={hasError}
                                    errorMessage={hasError && (_.get(errors, name))}
            />
        </div>
    );

};

export default FormikPasswordInputComponent;