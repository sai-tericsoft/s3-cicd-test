import "./FormikPhoneInputComponent.scss";
import _ from "lodash";
import {useCallback} from "react";
import {FieldProps} from "formik";
import {IPhoneInputProps} from "../../../models/form-controls.model";
import PhoneInputComponent from "../../phone-input/PhoneInputComponent";

interface FormikPhoneInputComponentProps extends IPhoneInputProps{
    formikField: FieldProps;
}

const FormikPhoneInputComponent = (props: FormikPhoneInputComponentProps) => {

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
        // setFieldTouched(name);
    }, [name, handleBlur]);

    return (
        <PhoneInputComponent
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

export default FormikPhoneInputComponent;
