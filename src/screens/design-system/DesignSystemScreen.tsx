import "./DesignSystemScreen.scss";
import InputComponent from "../../shared/components/form-controls/input/InputComponent";
import PasswordInputComponent from "../../shared/components/form-controls/password-input/PasswordInputComponent";

interface DesignSystemScreenProps {

}

const DesignSystemScreen = (props: DesignSystemScreenProps) => {

    return (
        <div className="design-system-screen screen">
            <h2>Design System</h2>
            <div>
                <InputComponent label={"Email ID / Username"}/>
                <PasswordInputComponent label={"Password"}/>
            </div>
        </div>
    )
};

export default DesignSystemScreen;
