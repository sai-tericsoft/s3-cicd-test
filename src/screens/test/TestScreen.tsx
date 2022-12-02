import './TestScreen.scss';
import ServiceAddScreen from "../admin/service/service-add/ServiceAddScreen";
import React from "react";

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
