import './TestScreen.scss';
import ServiceAddScreen from "../admin/service/service-add/ServiceAddScreen";
import React from "react";
import ClientActivityLogComponent from "../admin/client/client-activity-log/ClientActivityLogComponent";
import ClientBasicDetailsCardComponent from "../admin/client/client-basic-details-card/ClientBasicDetailsCardComponent";

interface TestScreenProps {

}


const TestScreen = (props: TestScreenProps) => {


    return (
        <div style={{margin: '20px'}}>
            <ClientActivityLogComponent/>

            <ClientBasicDetailsCardComponent/>
        </div>
    );
};

export default TestScreen;
