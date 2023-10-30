import React from 'react';
import {ToastContainer} from "react-toastify";
import {CommonService} from "../../services";
// import {ImageConfig} from "../../../constants";

interface AlertComponentProps {

}

const AlertComponent = (props: AlertComponentProps) => {

    return (
        <ToastContainer position={CommonService._alert.AlertPosition}/>
    )
};

export default AlertComponent;

// export const AlertCloseButton = ({...props}: any) => {
//     return <span className="toast-close-btn"
//                  {...props}
//                  id={"toast-close-btn"}
//     >
//             <ImageConfig.ToastCloseIcon/>
//     </span>
// };

