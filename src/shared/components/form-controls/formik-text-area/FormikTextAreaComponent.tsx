import "./FormikTextAreaComponent.scss";
import {FieldProps} from "formik";
import _ from "lodash";
import {useCallback} from "react";
import TextAreaComponent from "../text-area/TextAreaComponent";
import {ITextAreaProps} from "../../../models/form-controls.model";

interface FormikTextAreaComponentProps extends ITextAreaProps {
    formikField: FieldProps;
}

const FormikTextAreaComponent = (props: FormikTextAreaComponentProps) => {

    const {
        className,
        formikField,
        onChange,
        textAreaProps,
        ref,
        ...otherProps
    } = props;

    const {field, form} = formikField;
    const {name, value} = field;
    const {setFieldTouched, touched, handleBlur, errors, setFieldValue} = form;
    const hasError = _.get(touched, name) && !!(_.get(errors, name));
    otherProps.id = otherProps.id || name;

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
        <TextAreaComponent
            name={name}
            value={value}
            className={className}
            textAreaProps={{
                onBlur: onInputBlur,
            }}
            ref={ref}
            onChange={textChangeHandler}
            hasError={hasError}
            errorMessage={hasError && (_.get(errors, name))}
            {...otherProps}
        />
    );

};

export default FormikTextAreaComponent;
