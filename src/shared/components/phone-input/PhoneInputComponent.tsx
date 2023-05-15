import "./PhoneInputComponent.scss";
import {IPhoneInputProps} from "../../models/form-controls.model";
import InputComponent from "../form-controls/input/InputComponent";
import {useCallback, useEffect} from "react";

interface PhoneInputComponentProps extends IPhoneInputProps {
    name?: string;
    value?: string;
    errorMessage?: any;
    hasError?: boolean;
}

const PhoneInputComponent = (props: PhoneInputComponentProps) => {

    const {
        onChange,
        placeholder,
        value,
        ...otherProps
    } = props;
    // const [selectionStart, setSelectionStart] = useState<number>(0);

    const formatPhoneNumber = useCallback((value: string) => {
        // if input value is falsy eg if the user deletes the input, then just return
        if (!value) return value;

        // clean the input for any non-digit values.
        const phoneNumber = value.replace(/[^\d]/g, '');

        // phoneNumberLength is used to know when to apply our formatting for the phone number
        const phoneNumberLength = phoneNumber.length;

        // we need to return the value with no formatting if its less then four digits
        // this is to avoid weird behavior that occurs if you  format the area code to early

        if (phoneNumberLength < 4) return phoneNumber;

        // if phoneNumberLength is greater than 4 and less the 7 we start to return
        // the formatted number
        if (phoneNumberLength < 7) {
            return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
        }

        // finally, if the phoneNumberLength is greater then seven, we add the last
        // bit of formatting and return it.
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }, []);

    const handleInput = useCallback((value: string) => {
        // this is where we'll call our future formatPhoneNumber function that we haven't written yet.
        const formattedPhoneNumber = formatPhoneNumber(value);
        // const formattedPhoneNumber = value;
        // we'll set the input value using our setInputValue
        onChange && onChange(formattedPhoneNumber);
    }, [onChange, formatPhoneNumber]);

    useEffect(() => {
        if (value) {
            const formattedPhoneNumber = formatPhoneNumber(value);
            onChange && onChange(formattedPhoneNumber);
        }
    }, [onChange, formatPhoneNumber, value]);

    return (
        <div className="phone-input-component">
            <InputComponent
                onChange={handleInput}
                value={value}
                placeholder={placeholder || '(xxx) xxx-xxxx'}
                {...otherProps}/>
        </div>
    );

};

export default PhoneInputComponent;
