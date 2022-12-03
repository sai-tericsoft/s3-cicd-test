import './TestScreen.scss';
import React from "react";
import ClientActivityLogComponent from "../admin/client/client-activity-log/ClientActivityLogComponent";

interface TestScreenProps {

}

const TestScreen = (props: TestScreenProps) => {


    return (
        <div style={{margin: '20px'}}>
            <ClientActivityLogComponent/>

        </div>
    );
};

export default TestScreen;
