import "./TextAreaComponent.scss";
import {ITextAreaProps} from "../../../models/form-controls.model";
import {useCallback} from "react";
import {FormControl, InputAdornment, TextField} from "@mui/material";

interface TextAreaComponentProps extends ITextAreaProps {

}

const TextAreaComponent = (props: TextAreaComponentProps) => {

    const {label, errorMessage, prefix,readOnly, hasError, className, inputProps, disabled, id, name, required, value, onChange} = props;
    const variant = props.variant || "outlined";
    const size = props.size || "medium";
    const fullWidth = props.fullWidth || false;
    const rows = props.rows || 4;
    const placeholder = props.placeholder || label;

    const handleOnChange = useCallback((event: any) => {
        const value = event.target.value;
        if (onChange) {
            onChange(value);
        }
    }, [onChange]);

    return (
        <FormControl className={'input-component ' + className + ' ' + (fullWidth ? "full-width" : "")} error={hasError}>
            <TextField id={id}
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
                       inputProps={{
                           ...inputProps,
                           readOnly: readOnly
                       }}
                       onChange={(event) => {
                           handleOnChange(event);
                       }}
                       InputProps={{
                           startAdornment: prefix && <InputAdornment position="start">{prefix}</InputAdornment>,
                       }}
                       error={hasError}
                       helperText={errorMessage}
            />
        </FormControl>
    );

};

export default TextAreaComponent;