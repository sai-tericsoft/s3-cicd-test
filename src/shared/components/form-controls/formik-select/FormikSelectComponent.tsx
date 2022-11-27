import "./FormikSelectComponent.scss";
import React, {useCallback} from "react";
import {FieldProps} from "formik";
import SelectComponent from "../select/SelectComponent";
import {ISelectProps} from "../../../models/form-controls.model";

interface FormikSelectComponentProps extends ISelectProps {
    formikField: FieldProps;
}

const FormikSelectComponent = (props: FormikSelectComponentProps) => {

    const {
        onUpdate,
        formikField,
        fullWidth,
        errorMessage,
        ...other
    } = props;

    const {field, form} = formikField;
    const {name, value} = field;
    const {setFieldTouched, touched, errors, setFieldValue} = form;

    const hasError = touched[name] && errors && errors[name];

    const handleUpdate = useCallback((value: any) => {
        setFieldValue(name, value);
        setFieldTouched(name);
        if (onUpdate) {
            onUpdate(value);
        }
    }, [onUpdate, setFieldValue, name]);

    const onBlur = useCallback(() => {
        setFieldTouched(name);
    }, [name, setFieldTouched]);

    return (
        <div className={'formik-select-component component ' + (fullWidth ? "full-width" : "")}>
            <SelectComponent
                value={value}
                fullWidth={fullWidth}
                onUpdate={handleUpdate}
                onBlur={onBlur}
                hasError={(errorMessage || hasError)}
                {...other}
            />
        </div>
    );
};

export default FormikSelectComponent;
