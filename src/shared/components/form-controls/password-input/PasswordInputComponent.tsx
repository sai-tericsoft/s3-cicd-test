import "./PasswordInputComponent.scss";
import InputComponent from "../input/InputComponent";
import {useCallback, useState} from "react";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {IInputFieldProps} from "../../../models/form-controls.model";
import IconButtonComponent from "../../icon-button/IconButtonComponent";

export interface PasswordInputComponentProps extends IInputFieldProps {
    canToggle?: boolean;
}

const PasswordInputComponent = (props: PasswordInputComponentProps) => {

    const {
        label,
        prefix,
        canToggle,
        errorMessage,
        readOnly,
        hasError,
        className,
        inputProps,
        disabled,
        id,
        name,
        required,
        value,
        onChange
    } = props;
    const variant = props.variant || "outlined";
    const size = props.size || "medium";
    const fullWidth = props.fullWidth || false;
    const placeholder = props.placeholder || label;

    const [inputType, setInputType] = useState<"password" | "text">("password");

    const handleClickShowPassword = useCallback(() => {
        setInputType(inputType === "password" ? "text" : "password");
    }, [inputType]);

    return (
        <InputComponent label={label}
                        type={inputType}
                        disabled={disabled}
                        id={id}
                        name={name}
                        required={required}
                        value={value}
                        size={size} className={className}
                        fullWidth={fullWidth}
                        variant={variant}
                        placeholder={placeholder}
                        onChange={onChange}
                        hasError={hasError}
                        errorMessage={errorMessage}
                        readOnly={readOnly}
                        inputProps={inputProps}
                        prefix={prefix}
                        suffix={
                            canToggle &&
                            <IconButtonComponent onClick={handleClickShowPassword}>
                                {inputType === "text" ? <VisibilityOff/> : <Visibility/>}
                            </IconButtonComponent>
                        }
        />
    );

}

export default PasswordInputComponent;