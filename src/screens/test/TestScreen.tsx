import './TestScreen.scss';
import React from "react";
import ServiceAddScreen from "../admin/service/service-add/ServiceAddScreen";

interface TestScreenProps {

}


const TestScreen = (props: TestScreenProps) => {


    return (
        <div style={{margin: '20px'}}>
            <ServiceAddScreen/>
        </div>
    );
};

export default TestScreen;
