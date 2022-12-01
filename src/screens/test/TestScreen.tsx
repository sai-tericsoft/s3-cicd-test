import './TestScreen.scss';
import ServiceAddScreen from "../admin/service/service-add/ServiceAddScreen";
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
