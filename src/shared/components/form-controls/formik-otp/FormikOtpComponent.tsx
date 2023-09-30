import "./FormikOtpComponent.scss";
import {FieldProps} from "formik";
import _ from "lodash";
import {useCallback} from "react";
import {IOTPFieldProps} from "../../../models/form-controls.model";
import OtpComponent from "../otp/OtpComponent";

interface FormikOTPComponentProps extends IOTPFieldProps {
    formikField: FieldProps;
}

const FormikOTPComponent = (props: FormikOTPComponentProps) => {

    const {
        formikField,
        onChange,
        ...otherProps
    } = props;

    const {field, form} = formikField;
    const {name, value} = field;
    const {setFieldTouched, touched, errors, setFieldValue} = form;
    const hasError = _.get(touched, name) && !!(_.get(errors, name));

    const textChangeHandler = useCallback((text: string) => {
        setFieldValue(name, text);
        setFieldTouched(name);
        if (onChange) {
            onChange(text);
        }
    }, [setFieldValue, setFieldTouched, name, onChange]);

    return (
        <OtpComponent
            value={value}
            onChange={textChangeHandler}
            hasError={hasError}
            errorMessage={hasError && (_.get(errors, name))}
            {...otherProps}
        />
    );

};

export default FormikOTPComponent;