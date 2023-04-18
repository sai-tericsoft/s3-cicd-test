import './TestScreen.scss';
import {useState} from "react";
import ButtonComponent from "../../shared/components/button/ButtonComponent";
import MentionsComponent from "../../shared/components/mentions/MentionsComponent";

const users = [
    {
        id: "client_name",
        display: "client_name",
    },
    {
        id: "client_emailid",
        display: "client_emailid",
    },
    {
        id: "provider_name",
        display: "provider_name",
    },
    {
        id: "appointment_date",
        display: "appointment_date",
    },
    {
        id: "appointment_time",
        display: "appointment_time",
    },
    {
        id: "service_category",
        display: "service_category",
    },
    {
        id: "service",
        display: "service",
    },
    {
        id: "appointment_id",
        display: "appointment_id",
    },
];


const TestScreen = () => {
    const [value, setValue] = useState("");


    return (
        <div className="test-screen">

            <MentionsComponent
                data={users}
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
