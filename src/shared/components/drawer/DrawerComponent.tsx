import Drawer from '@mui/material/Drawer';
import {ImageConfig} from "../../../constants";
import * as React from "react";
import {useCallback} from "react";
import ToolTipComponent from "../tool-tip/ToolTipComponent";

interface DrawerComponentProps {
    isOpen: boolean;
    title?: string;
    showClose?: boolean;
    onClose?: (reason: string) => void;
    className?: string;
    hideBackdrop?: boolean;
    closeOnEsc?: boolean;
    closeOnBackDropClick?: boolean;
    direction?: "top" | "bottom" | "left" | "right";
    closeButtonId?: string;
}

const DrawerComponent = (props: React.PropsWithChildren<DrawerComponentProps>) => {

    const {isOpen, hideBackdrop, className, title, onClose, showClose, closeButtonId, children} = props;
    const direction = props.direction || "right";
    const closeOnEsc = props.closeOnEsc  !== undefined ? props.closeOnEsc : true;
    const closeOnBackDropClick = props.closeOnBackDropClick  !== undefined ? props.closeOnBackDropClick : true;

    const handleOnClose = useCallback((event: any, reason: string) => {
        console.log(event, reason);

        if(reason === "backdropClick" && !closeOnBackDropClick){
            return;
        }

        if(reason === "escapeKeyDown" && !closeOnEsc){
            return;
        }

        if (onClose) {
            onClose(reason);
        }
    }, [closeOnBackDropClick, closeOnEsc, onClose]);

    return (
        <Drawer
            open={isOpen}
            anchor={direction}
            onClose={handleOnClose}
            hideBackdrop={hideBackdrop}
            transitionDuration={300}
            classes={{
                root: className
            }}
            id={"close-drawer-btn"}
        >
            <div className="drawer-container">
                {
                    (title || showClose) && <div className="drawer-header">
                        <div className="drawer-title">{title}</div>
                        {showClose && <ToolTipComponent tooltip={"Close"} position={"left"}>
                            <div className="drawer-close"
                                 id={closeButtonId}
                                 onClick={(event) => {
                                handleOnClose(event, 'closeBtnClick');
                            }
                            }><ImageConfig.CloseIcon/></div>
                        </ToolTipComponent>}
                    </div>
                }
                <div className="drawer-body">
                    {children}
                </div>
            </div>
        </Drawer>
    );

};

export default DrawerComponent;

// ****************************** USAGE ****************************** //

// const [isDrawerOpened, setIsDrawerOpened] = useState(false);
//
// <div className="text-decoration-underline mrg-bottom-10 cursor-pointer"
//      onClick={() => {
//          setIsDrawerOpened(true);
//      }}>
//     Open drawer
// </div>

// <DrawerComponent
//     isOpen={isDrawerOpened}
//     title={"Add User"}
//     closeOnEsc={false}
//     hideBackdrop={false}
//     showClose={true}
//     direction={"right"}
//     className={"add-user-drawer"}
//     onClose={(reason)=>{
//         setIsDrawerOpened(false);
//     }}
// >
//     Lorem ipsum dolor sit amet, consectetur adipisicing elit. Explicabo facilis nihil non omnis
//     perferendis quasi quidem repudiandae soluta, veniam.
// </DrawerComponent>

// ****************************** USAGE ****************************** //
