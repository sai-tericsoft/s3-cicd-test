import './TestScreen.scss';
import ServiceAddScreen from "../admin/service/service-add/ServiceAddScreen";
import React from "react";
import HorizontalLineComponent from "../../shared/components/horizontal-line/horizontal-line/HorizontalLineComponent";

interface TestScreenProps {

}


const TestScreen = (props: TestScreenProps) => {


    return (
        <div style={{margin: '20px'}}>
            <HorizontalLineComponent/>
        </div>
    );
};

export default TestScreen;
