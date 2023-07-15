import './TestScreen.scss';
import React from "react";
import ColorPickerComponent from "../../shared/components/form-controls/color-picker/ColorPickerComponent";


// const users = [
//     {
//         id: "client_name",
//         display: "client_name",
//     },
//     {
//         id: "client_emailid",
//         display: "client_emailid",
//     },
//     {
//         id: "provider_name",
//         display: "provider_name",
//     },
//     {
//         id: "appointment_date",
//         display: "appointment_date",
//     },
//     {
//         id: "appointment_time",
//         display: "appointment_time",
//     },
//     {
//         id: "service_category",
//         display: "service_category",
//     },
//     {
//         id: "service",
//         display: "service",
//     },
//     {
//         id: "appointment_id",
//         display: "appointment_id",
//     },
// ];


const TestScreen = () => {

    const handleColorChange = () => {
        // Handle color change logic here
    };


    return (
        <div className="test-screen">
            <div className="ts-row">
                <div className="ts-col-6">
                    <ColorPickerComponent
                        // defaultColor={{r: 241, g: 112, b: 19, a: 1}}
                        required={true}
                        label={'Background Color'}
                        handleChange={handleColorChange}
                    />
                </div>
                <div className="ts-col-6">
                    <ColorPickerComponent
                        // defaultColor={{r: 241, g: 112, b: 19, a: 1}}
                        required={true}
                        label={'Text Color'}
                        handleChange={handleColorChange}
                    />
                </div>
            </div>


            {/*<MentionsComponent*/}
            {/*    data={users}*/}
            {/*    value={value}*/}
            {/*    onChange={(value) => setValue(value)}*/}
            {/*    placeholder={"Enter text here"}*/}
            {/*/>*/}

            {/*<ButtonComponent*/}
            {/*    variant={"contained"}*/}
            {/*    onClick={() => console.log(value)}*/}
            {/*    color={"primary"}>Submit</ButtonComponent>*/}
            {/*<AccordionComponent title={"Test Accordion"}*/}
            {/*                    isExpand={isExpanded}*/}
            {/*                    className={'color-red'}*/}
            {/*                    onChange={() => setIsExpanded(!isExpanded)}*/}
            {/*>*/}
            {/*    <InputComponent name={'Accordion'} value={'aa'}/>*/}
            {/*</AccordionComponent>*/}


        </div>
    );
};
export default TestScreen;
