import './DatePickerComponent.scss';
import React, {useCallback, useEffect, useState} from 'react';
import FormControl from "@mui/material/FormControl";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {FormHelperText} from "@mui/material";
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import TextField from "@mui/material/TextField";
import {IDatePickerProps} from "../../../models/form-controls.model";

interface DatePickerComponentProps extends IDatePickerProps {
    name: string;
    onDateChange?: Function;
    hasError?: boolean;
    errorMessage?: any;
    value?: any;
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
        size,
        fullWidth
    } = props;

    const [value, setValue] = useState<Date | any>(undefined);
    const [open, setOpen] = useState<boolean>(false);

    let {placeholder, color, variant, mask, maxDate, onDateChange} = props;
    if (!placeholder) placeholder = label;
    if (!variant) variant = "outlined";

    const handleChange = useCallback((newValue: Date | null) => {
        setValue(newValue)
        if (onDateChange) onDateChange(newValue);
    }, [onDateChange, setValue]);

    useEffect(() => {
        setValue(props.value ? new Date(props.value) : null);
    }, [props.value]);

    return (
        <FormControl variant={variant}
                     className="date-picker-component-wrapper"
                     fullWidth={fullWidth}
                     error={hasError}
        >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    label={label}
                    mask={mask}
                    minDate={minDate && minDate.toDate()}
                    maxDate={maxDate && maxDate.toDate()}
                    readOnly={readOnly}
                    value={value}
                    open={open}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    disabled={disabled}
                    onChange={handleChange}
                    renderInput={(params: any) => <TextField
                        required={required}
                        id={id}
                        size={size}
                        name={name}
                        onClick={(e) => setOpen(true)}
                        color={color}
                        placeholder={placeholder}
                        {...params}
                        error={hasError} // to be added to show error in date picker
                    />}
                />
            </LocalizationProvider>
            <FormHelperText>
                {hasError && errorMessage}
            </FormHelperText>
        </FormControl>
    )
};

export default DatePickerComponent;
