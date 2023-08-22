import './formikTimePickerComponent.scss'
import React, {useCallback} from 'react';
import {FieldProps} from "formik";
import _ from "lodash";
import TimePickerComponent from "../time-picker/timePickerComponent";
import {ITimePickerProps} from "../../../models/form-controls.model";

interface FormikTimePickerComponentProps extends ITimePickerProps {
    formikField: FieldProps;
}

const FormikTimePickerComponent = (props: FormikTimePickerComponentProps) => {
        const {
            className,
            formikField,
            onChange,
            ...otherProps
        } = props;

        const {field, form} = formikField;
        const {name, value} = field;
        const {setFieldTouched, touched, errors, setFieldValue} = form;
        const hasError = _.get(touched, name) && !!(_.get(errors, name));
        otherProps.id = otherProps.id || name;

        const handleChange = (newValue: Date | null) => {
            console.log(newValue);
            setFieldValue(name, newValue);
            setFieldTouched(name);

            if (onChange) {
                onChange(newValue);
            }
        };

        const onBlur = useCallback(() => {
            setFieldTouched(name);
        }, [name, setFieldTouched]);

        return (
            <div>
                <TimePickerComponent
                    name={name}
                    value={value}
                    onChange={handleChange}
                    hasError={hasError}
                    onBlur={onBlur}
                    errorMessage={hasError && _.get(errors, name)}
                    {...otherProps}
                />
            </div>

        )
    }

;

export default FormikTimePickerComponent;