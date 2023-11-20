import "./SsnInputComponent.scss";
import {ISSNInputProps} from "../../models/form-controls.model";
import {useCallback, useEffect} from "react";
import InputComponent from "../form-controls/input/InputComponent";

interface SsnInputComponentProps extends ISSNInputProps {
    name?: string;
    value?: string;
    errorMessage?: any;
    hasError?: boolean;
}

const SsnInputComponent = (props: SsnInputComponentProps) => {

    const {
        onChange,
        placeholder,
        value,
        ...otherProps
    } = props;

    const formatSSNNumber = useCallback((value: string) => {

        if (!value) return value;

        const SSNNumber = value.replace(/[^\d]/g, '');

        const SSNNumberLength =SSNNumber.length;

        if (SSNNumberLength < 4) return SSNNumber;

        if (SSNNumberLength < 7) {
            return `${SSNNumber.slice(0, 3)}-${SSNNumber.slice(3)}`;
        }
        return `${SSNNumber.slice(0, 3)}-${SSNNumber.slice(3, 5)}-${SSNNumber.slice(5, 9)}`;
    }, []);

    const handleInput = useCallback((value: string) => {
        const SSNNumber = value.replace(/[^\d]/g, '');
        const trimmedSSNNumber = SSNNumber.slice(0, 9);
        onChange && onChange(trimmedSSNNumber);
    }, [onChange]);

    useEffect(() => {
        if (value) {
            const SSNNumber = value.replace(/[^\d]/g, '');
            onChange && onChange(SSNNumber);
        }
    }, [onChange, value]);

    return (
        <div className="phone-input-component">
            <InputComponent
                onChange={handleInput}
                value={value && formatSSNNumber(value)}
                placeholder={placeholder || '000-00-0000'}
                {...otherProps}/>
        </div>
    );

};

export default SsnInputComponent;