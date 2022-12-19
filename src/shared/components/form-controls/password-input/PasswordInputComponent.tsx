import "./PasswordInputComponent.scss";
import InputComponent from "../input/InputComponent";
import {useCallback, useState} from "react";
import {IPasswordFieldProps} from "../../../models/form-controls.model";
import ButtonComponent from "../../button/ButtonComponent";

export interface PasswordInputComponentProps extends IPasswordFieldProps {
    name: string;
    canToggle?: boolean;
    value?: string;
    errorMessage?: any;
    hasError?: boolean;
}

const PasswordInputComponent = (props: PasswordInputComponentProps) => {

    const {
        canToggle,
        ...otherProps
    } = props;

    const [inputType, setInputType] = useState<"password" | "text">("password");

    const handleClickShowPassword = useCallback(() => {
        setInputType(inputType === "password" ? "text" : "password");
    }, [inputType]);

    return (
        <InputComponent
            type={inputType}
            suffix={
                (canToggle) &&
                <ButtonComponent variant={"text"}
                                 color={"inherit"}
                                 onClick={handleClickShowPassword}>
                    {inputType === "text" ? "Hide" : "Show"}
                </ButtonComponent>
            }
            {...otherProps}
        />
    );

}

export default PasswordInputComponent;