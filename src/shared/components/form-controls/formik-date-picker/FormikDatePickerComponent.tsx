import './FormikDatePickerComponent.scss'
import React, {useCallback} from 'react';
import _ from "lodash";
import DatePickerComponent from "../date-picker/DatePickerComponent";
import {FieldProps} from "formik";
import {IDatePickerProps} from "../../../models/form-controls.model";

interface FormikDatePickerComponentProps extends IDatePickerProps{
    formikField: FieldProps;
}

const FormikDatePickerComponent = (props: FormikDatePickerComponentProps) => {

        const {
            formikField,
            onUpdate,
            ...otherProps
        } = props;

        const {field, form} = formikField;
        const {name, value} = field;
        const {setFieldTouched, touched, errors, setFieldValue} = form;
        const hasError = _.get(touched, name) && !!(_.get(errors, name));
        otherProps.id = otherProps.id || name;

        const dateChangeHandler = useCallback((value: Date | null) => {
            setFieldValue(name, value);
            setFieldTouched(name);
            if (onUpdate) {
                onUpdate(value)
            }
        }, [setFieldValue, setFieldTouched, name, onUpdate]);

        return (
            <DatePickerComponent
                name={name}
                value={value}
                onDateChange={dateChangeHandler}
                hasError={hasError}
                errorMessage={hasError && _.get(errors, name)}
                {...otherProps}
            />
        )
    }

;

export default FormikDatePickerComponent;
