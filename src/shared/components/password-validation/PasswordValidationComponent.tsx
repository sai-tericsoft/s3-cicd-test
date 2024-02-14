import "./PasswordValidationComponent.scss";
import {useEffect, useState} from "react";
import {CircleCheck, CircleInfo} from "../../../constants/ImageConfig";
const passwordValidator = require('password-validator');

interface PasswordValidationComponentProps {
    password: string;
}

const PasswordValidationComponent = (props: PasswordValidationComponentProps) => {

    const { password } = props;

    const [isLengthValid, setIsLengthValid] = useState<boolean>(false);
    const [isDigitValid, setIsDigitValid] = useState<boolean>(false);
    const [isUpperCaseValid, setIsUpperCaseValid] = useState<boolean>(false);
    const [isLowerCaseValid, setIsLowerCaseValid] = useState<boolean>(false);
    const [isSpecialCharacterValid, setIsSpecialCharacterValid] = useState<boolean>(false);

    useEffect(() => {
        const schema = new passwordValidator();
        schema
            .is().min(8)
            .is().max(16)
            .has().uppercase()
            .has().lowercase()
            .has().digits()
            .has().symbols();
        const errors = schema.validate(password, {list: true});

        if (errors.includes('min') || errors.includes('max')) {
            setIsLengthValid(false);
        } else {
            setIsLengthValid(true);
        }

        if (errors.includes('digits')) {
            setIsDigitValid(false);
        } else {
            setIsDigitValid(true);
        }

        if (errors.includes('uppercase')) {
            setIsUpperCaseValid(false);
        } else {
            setIsUpperCaseValid(true);
        }

        if (errors.includes('lowercase')) {
            setIsLowerCaseValid(false);
        } else {
            setIsLowerCaseValid(true);
        }

        if (errors.includes('symbols')) {
            setIsSpecialCharacterValid(false);
        } else {
            setIsSpecialCharacterValid(true);
        }

    }, [password]);


    return (
        <div className="password-validator-component component">
            <div className="validator-rule-list">
                <div className={`validator-rule-item ${isLengthValid ? "valid" : 'invalid'}`}>
                    <div className="validator-rule-icon"> {isLengthValid ? <CircleCheck/> : <CircleInfo/>}</div>
                    <div className="validator-rule-text"> Must contain 8 - 16 characters</div>
                </div>
                <div className={`validator-rule-item ${isSpecialCharacterValid ? "valid" : 'invalid'}`}>
                    <div className="validator-rule-icon"> {isSpecialCharacterValid ? <CircleCheck/> : <CircleInfo/>}</div>
                    <div className="validator-rule-text"> At least one special character</div>
                </div>
                <div className={`validator-rule-item ${isDigitValid ? "valid" : 'invalid'}`}>
                    <div className="validator-rule-icon"> {isDigitValid ? <CircleCheck/> : <CircleInfo/>}</div>
                    <div className="validator-rule-text"> At least one digit</div>
                </div>
                <div className={`validator-rule-item ${isUpperCaseValid ? "valid" : 'invalid'}`}>
                    <div className="validator-rule-icon"> {isUpperCaseValid ? <CircleCheck/> : <CircleInfo/>}</div>
                    <div className="validator-rule-text"> At least one upper-case character</div>
                </div>
                <div className={`validator-rule-item ${isLowerCaseValid ? "valid" : 'invalid'}`}>
                    <div className="validator-rule-icon"> {isLowerCaseValid ? <CircleCheck/> : <CircleInfo/>}</div>
                    <div className="validator-rule-text"> At least one lower-case character</div>
                </div>

            </div>
        </div>
    );

};

export default PasswordValidationComponent;
