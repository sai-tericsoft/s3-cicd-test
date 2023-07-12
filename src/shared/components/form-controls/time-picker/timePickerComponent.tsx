import './timePickerComponent.scss'
import React, {useCallback, useEffect, useState} from 'react';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {FormHelperText} from "@mui/material";
import moment from "moment";
import FormControl from "@mui/material/FormControl";
import {ITimePickerProps} from "../../../models/form-controls.model";
import {TimePicker} from '@mui/x-date-pickers/TimePicker';
import {DemoContainer} from '@mui/x-date-pickers/internals/demo';

interface TimePickerComponentProps extends ITimePickerProps {

}

const TimePickerComponent = (props: TimePickerComponentProps) => {
        const [value, setValue] = useState<any | null>(props.value);
        const [open, setOpen] = useState<boolean>(false);
        const {
            name,
            id,
            label,
            disabled,
            readonly,
            required,
            hasError,
            onBlur,
            errorMessage,
            fullWidth,
        } = props;
        let {placeholder, color, variant, onChange, size} = props;
        if (!placeholder) placeholder = label;
        if (!color) color = "secondary";
        if (!variant) variant = "outlined";
        if (!size) size = "medium";

        const handleChange = useCallback((newValue: Date | null) => {
            console.log(newValue)
            setValue(newValue);

            if (moment(newValue).format("HH:mm") !== 'Invalid date') {
                const hours = moment(newValue).hours(); // Get the hours value
                const minutes = moment(newValue).minutes(); // Get the minutes value
                const totalMinutes = hours * 60 + minutes; // Calculate the total minutes

                console.log(totalMinutes);

                if (onChange) onChange(totalMinutes);
            } else {
                if (onChange) onChange(null);
            }
        }, [onChange]);


        useEffect(() => {
            setValue((prevValue: any) => {
                if (prevValue) {
                    const date = new Date(0);
                    return date.setMinutes(prevValue);
                    ;
                }
            });
        }, []);

        useEffect(() => {
            if (props.value === "") {
                setValue(props.value);
            }
        }, [props.value]);

        const handleOnBlur = useCallback(() => {
            if (onBlur) {
                onBlur();
            }
        }, [onBlur]);

        return (
            <FormControl variant={variant} size={size} className="input-component-wrapper"
                         fullWidth={fullWidth} error={hasError}
                         sx={{
                             "& .MuiOutlinedInput-root": {
                                 background: "#FAFAFA"
                             }
                         }
                         }>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DemoContainer
                        components={[
                            'TimePicker',
                        ]}
                    >
                        <TimePicker
                            label={label}
                            readOnly={readonly}
                            value={value || null}
                            disabled={disabled}
                            onChange={handleChange}
                            open={open}
                            onOpen={() => setOpen(true)}
                            onClose={() => setOpen(false)}
                            slotProps={{
                                textField: {
                                    required: required,
                                    placeholder: placeholder,
                                    error: hasError,
                                    name: name,
                                    id: id,
                                    color: color,
                                    onBlur: handleOnBlur
                                },
                            }}
                        />
                    </DemoContainer>
                </LocalizationProvider>
                <FormHelperText>
                    {hasError && errorMessage}
                </FormHelperText>
            </FormControl>
        )
    }

;

export default TimePickerComponent;