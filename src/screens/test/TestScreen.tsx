import './TestScreen.scss';
import {useState} from "react";
import ButtonComponent from "../../shared/components/button/ButtonComponent";
import MentionsComponent from "../../shared/components/mentions/MentionsComponent";

const users = [
    {
        id: "isaac",
        display: "Isaac Newton",
    },
    {
        id: "sam",
        display: "Sam Victor",
    },
    {
        id: "emma",
        display: "emmanuel@nobody.com",
    },
];

const TestScreen = () => {
    const [value, setValue] = useState("");


    return (
        <div className="test-screen">

            <MentionsComponent
                data={users}
                inputHeight={180}
                value={value}
                onChange={(value) => setValue(value)}
                placeholder={"Enter text here"}
            />

            <ButtonComponent
                variant={"contained"}
                onClick={() => console.log(value)}
                color={"primary"}>Submit</ButtonComponent>
        </div>
    );
};
export default TestScreen;
