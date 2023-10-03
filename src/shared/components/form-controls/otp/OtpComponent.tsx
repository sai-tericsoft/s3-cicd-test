import "./OtpComponent.scss";
import OtpInput from 'react-otp-input';
import {useCallback} from "react";
import {IOTPFieldProps} from "../../../models/form-controls.model";
// import LabelComponent from "../../label/LabelComponent";
// import ErrorTextComponent from "../../error-text/ErrorTextComponent";

interface OtpComponentProps extends IOTPFieldProps {
    value?: string;
    errorMessage?: any;
    hasError?: boolean;
}

const OtpComponent = (props: OtpComponentProps) => {

    const {
        className,
        label,
        hasError,
        required,
        errorMessage,
        placeholder,
        isMasked,
        fullWidth,
        readOnly,
        onChange,
        value
    } = props;

    const noOfDigits = props.noOfDigits || 6;

    const handleChange = useCallback((otp: string) => {
        onChange && onChange(otp);
    }, [onChange]);

    return (
        <div
            className={`otp-component ${className}  ${readOnly ? 'read-only' : ''} ${fullWidth ? 'full-width' : ''} ${hasError ? "has-error" : ''}`}>
            {/*{label && <LabelComponent title={label} required={required}/>}*/}
            <OtpInput
                value={value}
                onChange={handleChange}
                numInputs={noOfDigits}
                separator={undefined}
                hasErrored={hasError}
                isInputSecure={isMasked}
                isInputNum={true}
                placeholder={placeholder}
                containerStyle={'otp-container'}
            />
            {/*{(errorMessage && hasError) && (*/}
            {/*    <ErrorTextComponent error={errorMessage}/>*/}
            {/*)}*/}
            {(errorMessage && hasError) && (
                <div className="error-text">{errorMessage}</div>
            )}
        </div>
    );

};

export default OtpComponent;