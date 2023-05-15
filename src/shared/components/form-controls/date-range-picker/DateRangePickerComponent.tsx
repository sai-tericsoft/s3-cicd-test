import "./DateRangePickerComponent.scss";
import React, {useCallback, useEffect, useState} from 'react';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css';
import {IDateRangePickerProps} from "../../../models/form-controls.model";
import {FormControl, FormHelperText} from "@mui/material";
import EventIcon from '@mui/icons-material/Event';

interface DateRangePickerComponentProps extends IDateRangePickerProps {
    name?: string;
    onDateChange?: Function;
    hasError?: boolean;
    errorMessage?: any;
    value?: any;
}

const DateRangePickerComponent = (props: DateRangePickerComponentProps) => {

    const {
        name,
        label,
        disabled,
        readOnly,
        required,
        minDate,
        hasError,
        errorMessage,
        className,
        fullWidth,
    } = props;

    const [value, setValue] = useState([]);

    let {color, size, variant, rangeDivider, maxDate, format, onDateChange} = props;
    if (!variant) variant = "outlined";
    if (!size) size = "small";
    if (!rangeDivider) rangeDivider = "-";
    if (!format) format = "y/MM/dd";

    const handleChange = useCallback((newValue: any | null) => {
        setValue(newValue)
        if (onDateChange) onDateChange(newValue);
    }, [onDateChange, setValue]);

    useEffect(() => {
        setValue(props.value ? props.value : null);
    }, [props.value]);

    return (
        <div>
            <FormControl variant={variant}
                         className={'date-range-picker-component ' + className + ' ' + (fullWidth ? "full-width" : "")}
                         fullWidth={fullWidth}
                         error={hasError}
            >
                <DateRangePicker
                    className={`react-daterange-picker ${className} ${size} ${color}`}
                    onChange={handleChange}
                    name={name}
                    showDoubleView={true}
                    placeholder={label}
                    minDate={minDate && minDate.toDate()}
                    maxDate={maxDate && maxDate.toDate()}
                    disabled={disabled}
                    required={required}
                    value={value}
                    readOnly={readOnly}
                    format={format}
                    rangeDivider={rangeDivider}
                    yearPlaceholder={"yyyy"}
                    monthPlaceholder={"mm"}
                    dayPlaceholder={"dd"}
                    clearIcon={null}
                    closeCalendar={true}
                    openCalendarOnFocus={true}
                    calendarIcon={<EventIcon/>}
                />
            </FormControl>
            <FormHelperText>
                {hasError && errorMessage}
            </FormHelperText>
        </div>
    );

};

export default DateRangePickerComponent;