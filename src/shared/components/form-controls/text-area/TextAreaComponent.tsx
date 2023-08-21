import "./TextAreaComponent.scss";
import { ITextAreaProps } from "../../../models/form-controls.model";
import { useCallback, useEffect, useRef } from "react";
import { FormControl, InputAdornment, TextField } from "@mui/material";

interface TextAreaComponentProps extends ITextAreaProps {}

const TextAreaComponent = (props: TextAreaComponentProps) => {
    const {
        label,
        errorMessage,
        prefix,
        readOnly,
        autoFocus,
        hasError,
        className,
        textAreaProps,
        disabled,
        id,
        name,
        required,
        value,
        onChange,
    } = props;
    const variant = props.variant || "outlined";
    const size = props.size || "medium";
    const fullWidth = props.fullWidth || false;
    // const rows = props.rows || 3;
    const placeholder = props.placeholder || label;

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleOnChange = useCallback(
        (event: React.ChangeEvent<HTMLTextAreaElement>) => {
            const value = event.target.value;
            if (onChange) {
                onChange(value);
            }
        },
        [onChange]
    );

    useEffect(() => {
        adjustTextareaHeight();
    }, [value]);

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    return (
        <FormControl
            className={"input-component " + className + " " + (fullWidth ? "full-width" : "")}
            error={hasError}
        >
            <TextField
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
                // rows={rows}
                autoFocus={autoFocus}
                inputProps={{
                    ...textAreaProps,
                    readOnly: readOnly,
                }}
                onChange={handleOnChange}
                inputRef={textareaRef}
                InputProps={{
                    startAdornment: prefix && <InputAdornment position="start">{prefix}</InputAdornment>,
                }}
                error={hasError}
                helperText={errorMessage}
                className="resizable-textarea"
            />
        </FormControl>
    );
};

export default TextAreaComponent;
