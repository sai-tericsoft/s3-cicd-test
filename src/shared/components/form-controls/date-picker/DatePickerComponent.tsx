import './DatePickerComponent.scss';
import React, {useCallback, useEffect, useState} from 'react';
import FormControl from "@mui/material/FormControl";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {FormHelperText} from "@mui/material";
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {IDatePickerProps} from "../../../models/form-controls.model";
import moment from "moment";

interface DatePickerComponentProps extends IDatePickerProps {
    name: string;
    onDateChange?: Function;
    hasError?: boolean;
    errorMessage?: any;
    value?: any;
    enableDates?: any
}

const DatePickerComponent = (props: DatePickerComponentProps) => {

    const {
        name,
        id,
        label,
        disabled,
        readOnly,
        required,
        minDate,
        hasError,
        errorMessage,
        onBlur,
        fullWidth,
        enableDates
    } = props;

    const [value, setValue] = useState<Date | any>(undefined);
    const [open, setOpen] = useState<boolean>(false);

    let {placeholder, color, variant, maxDate, onDateChange} = props;
    if (!placeholder) placeholder = label;
    if (!variant) variant = "outlined";

    const handleChange = useCallback((newValue: Date | null) => {
        setValue(newValue)
        if (onDateChange) onDateChange(newValue);
    }, [onDateChange, setValue]);

    useEffect(() => {
        setValue(props.value ? new Date(props.value) : null);
    }, [props.value]);

    const handleOnBlur = useCallback(() => {
        if (onBlur) {
            onBlur();
        }
    }, [onBlur]);

    const shouldDisableDate = useCallback(
        (date: any) => {
            if (enableDates) {
                const formattedDate = moment(date).format('YYYY-MM-DD');
                return !enableDates.includes(formattedDate);
            }
            return false;
        },
        [enableDates]
    );

    return (
        <FormControl variant={variant}
                     className="date-picker-component-wrapper"
                     fullWidth={fullWidth}
                     error={hasError}
        >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    label={label}
                    minDate={minDate && minDate.toDate()}
                    maxDate={maxDate && maxDate.toDate()}
                    readOnly={readOnly}
                    value={value}
                    open={open}
                    views={['year', 'month', 'day']}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    disabled={disabled}
                    onChange={handleChange}
                    shouldDisableDate={shouldDisableDate}
                    slotProps={{
                        textField: {
                            required: required,
                            placeholder: placeholder,
                            error: hasError,
                            name: name,
                            id: id,
                            color: color,
                            onBlur: handleOnBlur,
                            onClick: () => setOpen(true)
                        },
                    }}
                />
            </LocalizationProvider>
            <FormHelperText>
                {hasError && errorMessage}
            </FormHelperText>
        </FormControl>
    )
};

export default DatePickerComponent;
