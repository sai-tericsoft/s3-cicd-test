import "./ToolTipComponent.scss";
import React, {ReactElement, ReactFragment, useCallback} from "react";
import {Tooltip} from "@mui/material";

interface ToolTipComponentProps {
    tooltip: string | ReactFragment | ReactElement;
    backgroundColor?: string;
    textColor?: string;
    showArrow?: boolean;
    position?: 'bottom-end' | 'bottom-start' | 'bottom' | 'left-end' | 'left-start' | 'left' | 'right-end' | 'right-start' | 'right' | 'top-end' | 'top-start' | 'top';
    onOpen?: () => void;
    onClose?: () => void;
    showAfter?: number;
    hideAfter?: number;
}

const ToolTipComponent = (props: React.PropsWithChildren<ToolTipComponentProps>) => {

    const {tooltip, showArrow, showAfter, hideAfter, onOpen, onClose, backgroundColor, textColor, children} = props;

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
                 arrow={showArrow}
                 placement={position}
                 onOpen={handleOpen}
                 onClose={handleClose}
                 enterDelay={showAfter}
                 leaveDelay={hideAfter}
                 componentsProps={{
                     tooltip: {
                         sx: {
                             marginRight:'20px',
                             fontSize: '12px',
                             fontFamily: "Roboto",
                             padding: '10px',
                             bgcolor: backgroundColor || '#DEFFE8',
                             color: textColor || '#282828',
                             '& .MuiTooltip-arrow': {
                                 color: backgroundColor || '#DEFFE8',
                             },
                         },
                     },
                 }}
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
