import "./InputComponent.scss";
import {FormControl, InputAdornment, TextField} from "@mui/material";
import {useCallback} from "react";
import {IInputFieldProps} from "../../../models/form-controls.model";
import {CommonService} from "../../../services";

export interface InputComponentProps extends IInputFieldProps {
    name?: string;
    value?: string;
    errorMessage?: any;
    hasError?: boolean;
}

const InputComponent = (props: InputComponentProps) => {

    const {
        label,
        prefix,
        titleCase,
        errorMessage,
        readOnly,
        suffix,
        hasError,
        className,
        inputProps,
        disabled,
        name,
        required,
        value,
        validationPattern,
        onChange,
        onFocus,
        onBlur,
        autoFocus,
        maxValue,
    } = props;

    const variant = props.variant || "outlined";
    const size = props.size || "medium";
    const type = props.type || "text";
    const fullWidth = props.fullWidth || false;
    const placeholder = props.placeholder || label;

    const id = props.id || name;
    const handleOnChange = useCallback((event: any) => {
        let nextValue = event.target.value;
        if (titleCase) {
            nextValue = CommonService.Capitalize(nextValue);
        }
        if (onChange) {
            if (type === "number" && maxValue) {
                if (maxValue >= nextValue) {
                    onChange(nextValue);
                } else {
                    return;
                }
            }
            if (validationPattern) {
                const reg = RegExp(validationPattern);
                if (nextValue === "" || reg.test(nextValue)) {
                    onChange(type === "number" ? parseInt(nextValue) : nextValue);
                } else {
                    console.log(nextValue, reg, reg.test(nextValue), "regex failed");
                }
            } else {
                onChange(type === "number" ? parseInt(nextValue) : nextValue);
            }
        }
    }, [titleCase, type, validationPattern, onChange, maxValue]);

    const handleOnFocus = useCallback((event: any) => {
        if (onFocus) {
            onFocus(event);
        }
    }, [onFocus]);

    const handleOnBlur = useCallback((event: any) => {
        if (onBlur) {
            onBlur(event);
        }
    }, [onBlur]);

    return (
        <FormControl className={'input-component ' + className + ' ' + (fullWidth ? "full-width" : "")}
                     error={hasError}
                     fullWidth={fullWidth}>
            <TextField type={type === "password" ? "password" : "text"}
                       id={id}
                       fullWidth={fullWidth}
                       placeholder={placeholder}
                       required={required}
                       name={name}
                       size={size}
                       label={label}
                       value={value || ""}
                       autoFocus={autoFocus}
                       variant={variant}
                       disabled={disabled}
                       InputProps={{
                           startAdornment: prefix && <InputAdornment position="start">{prefix}</InputAdornment>,
                           endAdornment: suffix && <InputAdornment position="end">{suffix}</InputAdornment>,
                       }}
                       inputProps={{
                           ...inputProps,
                           max: props.max,
                           readOnly: readOnly
                       }}
                       onChange={(event) => {
                           handleOnChange(event);
                       }}
                       onFocus={(event) => {
                           handleOnFocus(event);
                       }
                       }
                       onBlur={(event) => {
                           handleOnBlur(event);
                       }
                       }
                       error={hasError}
                       helperText={errorMessage}
            />
        </FormControl>
    );

};

export default InputComponent;
