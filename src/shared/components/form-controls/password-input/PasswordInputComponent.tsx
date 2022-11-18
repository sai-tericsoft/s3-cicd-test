import "./PasswordInputComponent.scss";
import InputComponent, {InputComponentProps} from "../input/InputComponent";
import {useCallback, useState} from "react";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import IconButton from '@mui/material/IconButton';

interface PasswordInputComponentProps extends InputComponentProps {
    type?: "password";
    canToggle?: boolean;
}

const PasswordInputComponent = (props: PasswordInputComponentProps) => {

    const {label, canToggle, prefix, className, disabled, id, name, required, value, onChange} = props;
    const variant = props.variant || "outlined";
    const size = props.size || "medium";
    const fullWidth = props.fullWidth || false;
    const placeholder = props.placeholder || label;

    const [inputType, setInputType] = useState<"password" | "text">("password");

    const handleClickShowPassword = useCallback(() => {
        setInputType(inputType === "password" ? "text" : "password");
    }, [inputType]);

    return (
        <div className={'PasswordInputComponent'}>
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
                            prefix={prefix}
                            suffix={
                                canToggle &&
                                <IconButton onClick={handleClickShowPassword} edge="end">
                                    {inputType === "text" ? <VisibilityOff/> : <Visibility/>}
                                </IconButton>
                            }
            />
        </div>
    );

}

export default PasswordInputComponent;