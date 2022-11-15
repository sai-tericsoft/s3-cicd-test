import React from 'react';
import { ToastContainer } from "react-toastify";
import {CommonService} from "../../services";

interface AlertComponentProps {

}

const AlertComponent = (props: AlertComponentProps) => {
    return (
        <ToastContainer position={CommonService._alert.AlertPosition}/>
    )
};

export default AlertComponent;
