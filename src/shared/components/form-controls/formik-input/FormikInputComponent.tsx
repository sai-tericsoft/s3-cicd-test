import "./FormikInputComponent.scss";
import InputComponent from "../input/InputComponent";
import {FieldProps} from "formik";
import _ from "lodash";
import {useCallback} from "react";
import {IInputFieldProps} from "../../../models/form-controls.model";

interface FormikInputComponentProps extends IInputFieldProps {
    formikField: FieldProps;
}

const FormikInputComponent = (props: FormikInputComponentProps) => {

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
        <InputComponent
            name={name}
            value={value}
            inputProps={{
                onBlur: onInputBlur,
            }}
            onChange={textChangeHandler}
            hasError={hasError}
            errorMessage={hasError && (_.get(errors, name))}
            {...otherProps}
        />
    );

};

export default FormikInputComponent;