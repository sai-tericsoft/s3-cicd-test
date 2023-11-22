import './FormikDatePickerComponent.scss'
import React, {useCallback} from 'react';
import _ from "lodash";
import {FieldProps} from "formik";
import {IDatePickerProps} from "../../../models/form-controls.model";
import DatePickerComponent from "../date-picker/DatePickerComponent";

interface FormikDatePickerComponentProps extends IDatePickerProps {
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
        const {setFieldTouched, touched,errors, setFieldValue} = form;
        const hasError = _.get(touched, name) && !!(_.get(errors, name));
        otherProps.id = otherProps.id || name;

        const dateChangeHandler = useCallback((value: Date | null) => {
            (async () => {
                await setFieldValue(name, value,true);
                await setFieldTouched(name);
            })()
            if (onUpdate) {
                onUpdate(value)
            }
        }, [setFieldValue, setFieldTouched, name, onUpdate]);

        const onBlur = useCallback(() => {
            setFieldTouched(name);
        }, [name, setFieldTouched]);

        return (
            <DatePickerComponent
                name={name}
                value={value}
                onDateChange={dateChangeHandler}
                hasError={hasError}
                onBlur={onBlur}
                errorMessage={hasError && _.get(errors, name)}
                {...otherProps}
            />
        )
    }

;

export default FormikDatePickerComponent;
