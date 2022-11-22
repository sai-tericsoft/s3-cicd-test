import "./ToolTipComponent.scss";
import React, {ReactFragment, useCallback} from "react";
import {Tooltip} from "@mui/material";

interface ToolTipComponentProps {
    tooltip: string | ReactFragment;
    arrow?: boolean;
    position?: 'bottom-end' | 'bottom-start' | 'bottom' | 'left-end' | 'left-start' | 'left' | 'right-end' | 'right-start' | 'right' | 'top-end' | 'top-start' | 'top';
    onOpen?: () => void;
    onClose?: () => void;
    showAfter?: number;
    hideAfter?: number;
}

const ToolTipComponent = (props: React.PropsWithChildren<ToolTipComponentProps>) => {

    const {tooltip, arrow, showAfter, hideAfter, onOpen, onClose, children} = props;

    const position = props.position || "top";

    const handleOpen = useCallback((e: any) => {
        if (onOpen) {
            onOpen();
        }
    }, [onOpen]);

    const handleClose = useCallback((e: any) => {
        if (onClose) {
            onClose();
        }
    }, [onClose]);

    return (
        <Tooltip title={
            <React.Fragment>
                {tooltip}
            </React.Fragment>
        }
                 arrow={arrow}
                 placement={position}
                 onOpen={handleOpen}
                 onClose={handleClose}
                 enterDelay={showAfter}
                 leaveDelay={hideAfter}
        >
            {children}
        </Tooltip>
    );

};

export default ToolTipComponent;

// ****************************** USAGE ****************************** //

// <ToolTipComponent tooltip={serviceCategory?.name || "-"}
//                   position={"top"}
//                   onOpen={()=>{
//                       console.log("tooltip opened");
//                   }}
//                   onClose={()=>{
//                       console.log("tooltip CLOSED");
//                   }}
// >
//     <div className="service-category-name" id={`sc_${serviceCategory?.name}`}>
//         {serviceCategory?.name || "-"}
//     </div>
// </ToolTipComponent>

// ****************************** USAGE ****************************** //
