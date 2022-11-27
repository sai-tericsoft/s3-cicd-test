import "./InputComponent.scss";
import {FormControl, InputAdornment, TextField} from "@mui/material";
import {useCallback} from "react";
import {IInputFieldProps} from "../../../models/form-controls.model";

export interface InputComponentProps extends IInputFieldProps{
    type?: 'email' | 'number' | 'password' | 'text';
    prefix?: any;
    suffix?: any;
    rows?: number;
}

const InputComponent = (props: InputComponentProps) => {

    const {label, prefix, errorMessage, readOnly, suffix, hasError, className, inputProps, disabled, id, name, required, value, onChange} = props;
    const variant = props.variant || "outlined";
    const size = props.size || "medium";
    const type = props.type || "text";
    const fullWidth = props.fullWidth || false;
    const rows = props.rows || 1;
    const placeholder = props.placeholder || label;

    const handleOnChange = useCallback((event: any) => {
        const value = event.target.value;
        if (onChange) {
            onChange(value);
        }
    }, [onChange]);
    
    return (
        <FormControl className={'input-component ' + className + ' ' + (fullWidth ? "full-width" : "")} error={hasError} fullWidth={fullWidth}>
            <TextField type={type}
                       id={id}
                       fullWidth={fullWidth}
                       placeholder={placeholder}
                       required={required}
                       name={name}
                       size={size}
                       label={label}
                       value={value}
                       variant={variant}
                       disabled={disabled}
                       multiline={true}
                       rows={rows}
                       InputProps={{
                           startAdornment: prefix && <InputAdornment position="start">{prefix}</InputAdornment>,
                           endAdornment: suffix && <InputAdornment position="end">{suffix}</InputAdornment>,
                       }}
                       inputProps={{
                           ...inputProps,
                           readOnly: readOnly
                       }}
                       onChange={(event) => {
                           handleOnChange(event);
                       }}
                       error={hasError}
                       helperText={errorMessage}
            />
        </FormControl>
    );

};

export default InputComponent;