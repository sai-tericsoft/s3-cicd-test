import "./InputComponent.scss";
import {InputAdornment, TextField} from "@mui/material";
import {useCallback} from "react";

export interface InputComponentProps {
    label: string;
    variant?: "outlined" | "filled" | "standard";
    size?: 'medium' | 'small';
    type?: 'email' | 'number' | 'password' | 'text';
    value?: any;
    required?: boolean;
    placeholder?: string;
    onChange?: (value: any) => void;
    name?: string;
    id?: string;
    fullWidth?: boolean;
    disabled?: boolean;
    className?: string;
    prefix?: any;
    suffix?: any;
}

const InputComponent = (props: InputComponentProps) => {

    const {label, prefix, suffix, className, disabled, id, name, required, value, onChange} = props;
    const variant = props.variant || "outlined";
    const size = props.size || "medium";
    const type = props.type || "text";
    const fullWidth = props.fullWidth || false;
    const placeholder = props.placeholder || label;

    const handleOnChange = useCallback((event: any) => {
        const value = event.target.value;
        if (onChange) {
            onChange(value);
        }
    }, []);

    return (
        <div className={'input-component ' + className}>
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
                       InputProps={{
                           startAdornment: prefix && <InputAdornment position="start">{prefix}</InputAdornment>,
                           endAdornment: suffix && <InputAdornment position="end">{suffix}</InputAdornment>,
                       }}
                       onChange={(event) => {
                           handleOnChange(event);
                       }}
            />
        </div>
    );

};

export default InputComponent;