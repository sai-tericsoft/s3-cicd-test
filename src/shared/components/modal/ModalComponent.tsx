import "./ModalComponent.scss";
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import {TransitionProps} from "@mui/material/transitions";
import * as React from 'react';
import {useCallback} from 'react';
import {ImageConfig} from "../../../constants";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    let direction = 'down';
    const classBits = props?.className?.split('direction-');
    if (classBits && classBits?.length > 0 && classBits[1] !== "undefined") {
        direction = classBits[1];
    }
    // @ts-ignore
    return <Slide direction={direction} ref={ref} {...props} />;
});

interface ModalComponentProps {
    id?: string;
    isOpen: boolean;
    title?: string;
    className?: string;
    showClose?: boolean;
    onClose?: (reason: string) => void;
    fullScreen?: boolean;
    fullWidth?: boolean;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    closeOnEsc?: boolean;
    closeOnBackDropClick?: boolean;
    direction?: "up" | "down" | "left" | "right";
    hideBackdrop?: boolean;
    modalFooter?: React.ReactNode;
}

const ModalComponent = (props: React.PropsWithChildren<ModalComponentProps>) => {

    const {
        isOpen,
        id,
        fullWidth,
        fullScreen,
        showClose,
        title,
        onClose,
        className,
        children,
        hideBackdrop,
        modalFooter
    } = props;
    const direction = props.direction || "down";
    const size = props.size || "sm";
    const closeOnBackDropClick = props.closeOnBackDropClick !== undefined ? props.closeOnBackDropClick : true;
    const closeOnEsc = props.closeOnEsc !== undefined ? props.closeOnEsc : true;

    const handleOnClose = useCallback((event: any, reason: string) => {
        if (reason === "backdropClick" && !closeOnBackDropClick ) {
            return;
        }
        if (reason === "escapeKeyDown" && !closeOnEsc ) {
            return;
        }
        if (onClose) {
            onClose(reason);
        }
    }, [closeOnBackDropClick, closeOnEsc, onClose]);

    return (
        <Dialog
            id={id}
            open={isOpen}
            fullScreen={fullScreen}
            fullWidth={fullWidth}
            TransitionProps={{
                className: "direction-" + direction
            }}
            TransitionComponent={Transition}
            keepMounted
            maxWidth={size}
            className={`modal-container ${className}`}
            onClose={handleOnClose}
            hideBackdrop={hideBackdrop}
        >
            <div className="modal-content-wrapper">
                {
                    (title || showClose) && <div className="modal-header">
                        <div className="modal-title">{title}</div>
                        {showClose &&
                            <div className="modal-close"
                                 onClick={(event) => {
                            handleOnClose(event, 'closeBtnClick');
                        }
                        }><ImageConfig.CloseIcon/></div>}
                    </div>
                }
                <div className="modal-body">
                    {children}
                </div>
                {
                    modalFooter && <div className="modal-footer">
                        {modalFooter}
                    </div>
                }
            </div>
        </Dialog>
    );
};

export default ModalComponent;

