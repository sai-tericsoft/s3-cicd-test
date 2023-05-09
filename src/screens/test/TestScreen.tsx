import './TestScreen.scss';
import React, { useState} from "react";
import ButtonComponent from "../../shared/components/button/ButtonComponent";
import MentionsComponent from "../../shared/components/mentions/MentionsComponent";
import AccordionComponent from "../../shared/components/accordion/AccordionComponent";
import InputComponent from "../../shared/components/form-controls/input/InputComponent";


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

   const [isExpanded, setIsExpanded] = useState(false);
   const [value,setValue]=useState('')
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
            <AccordionComponent title={"Test Accordion"}
                                isExpand={isExpanded}
                                className={'color-red'}
                                onChange={() => setIsExpanded(!isExpanded)}
            >
                <InputComponent name={'Accordion'} value={'aa'}/>
            </AccordionComponent>


        </div>
    );
};
export default TestScreen;
