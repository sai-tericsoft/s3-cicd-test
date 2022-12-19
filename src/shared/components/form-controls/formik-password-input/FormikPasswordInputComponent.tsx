import "./FormikPasswordInputComponent.scss";
import {FieldProps} from "formik";
import _ from "lodash";
import {useCallback} from "react";
import PasswordInputComponent from "../password-input/PasswordInputComponent";
import {IPasswordFieldProps} from "../../../models/form-controls.model";

interface FormikPasswordInputComponentProps extends IPasswordFieldProps {
    formikField: FieldProps;
}

const FormikPasswordInputComponent = (props: FormikPasswordInputComponentProps) => {

    const {
        formikField,
        onChange,
        ...otherProps
    } = props;

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
        <PasswordInputComponent
            name={name}
            value={value}
            inputProps={{
                onBlur: onInputBlur,
            }}
            hasError={hasError}
            errorMessage={hasError && (_.get(errors, name))}
            onChange={textChangeHandler}
            {...otherProps}
        />
    );

};

export default FormikPasswordInputComponent;