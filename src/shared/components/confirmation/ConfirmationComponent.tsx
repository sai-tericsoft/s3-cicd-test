import "./ConfirmationComponent.scss";
import * as React from 'react';
import {useEffect, useState} from 'react';
import {Communications} from "../../services";
import {IConfirmationConfig} from "../../models/confirmation.model";
import ModalComponent from "../modal/ModalComponent";
import ButtonComponent from "../button/ButtonComponent";

interface ConfirmationComponentProps {

}

const ConfirmationComponent = (props: ConfirmationComponentProps) => {

    const [open, setOpen] = useState(false);
    const [config, setConfig] = useState<IConfirmationConfig | null>(null);
    const [promise, setPromise] = useState<{ resolve: any, reject: any } | null>(null);

    useEffect(() => {
        const subscription = Communications.ConfirmStateSubject.subscribe(({config, promise}) => {
            setPromise(promise);
            setConfig(config);
            openConfirmationDialog();
            console.log(config);
        })
        return () => {
            subscription.unsubscribe();
        }
    }, []);

    const openConfirmationDialog = () => {
        setOpen(true);
    };

    const confirm = () => {
        promise?.resolve();
        closeConfirmationDialog();
    }

    const cancel = () => {
        promise?.reject();
        closeConfirmationDialog();
    }

    const closeConfirmationDialog = () => {
        setOpen(false);
    };

    return (
        <ModalComponent
            isOpen={open}
            onClose={() => {
                closeConfirmationDialog();
            }}
            id={"confirmation-popup"}
            closeOnEsc={config?.closeOnEsc}
            closeOnBackDropClick={config?.closeOnBackdropClick}
            direction={config?.direction || "down"}
            size={"md"}
            showClose={false}
            modalFooter={<>
                {!config?.hideNoOption && <>
                    <ButtonComponent
                        onClick={cancel}
                        color={config?.no?.color || 'primary'}
                        variant={config?.no?.variant || "outlined"}
                        id={"no-btn"}
                        className={"pdd-left-60 pdd-right-60"}
                    >
                        {config?.no?.text || 'No'}
                    </ButtonComponent>&nbsp;&nbsp;&nbsp;
                </>
                }
                <ButtonComponent
                    onClick={confirm}
                    color={config?.yes?.color || 'primary'}
                    variant={config?.yes?.variant || "contained"}
                    id={"yes-btn"}
                    className={"pdd-left-60 pdd-right-60"}
                >
                    {config?.yes?.text || 'Yes'}
                </ButtonComponent>
            </>
            }>
            <div className="confirmation-dialog-container">
                <div className="confirmation-dialog-sub-title-and-description">
                    {config?.image && <div className="confirmation-dialog-image-container">
                        <div className={"confirmation-dialog-image"}>
                            {(typeof (config.image) === 'string') &&
                                <img src={config.image} alt={config?.confirmationTitle}/>}
                            {(typeof (config.image) !== 'string') && <config.image/>}
                        </div>
                    </div>}
                    <div className={"confirmation-dialog-title"}>
                        {config?.confirmationTitle || 'Confirm ?'}
                    </div>
                    <div className="confirmation-dialog-sub-title">{config?.confirmationSubTitle}</div>
                    <div className="confirmation-dialog-sub-description">{config?.confirmationDescription}</div>
                </div>
            </div>
        </ModalComponent>
    );
};

export default ConfirmationComponent;

// ****************************** USAGE ****************************** //

// CommonService.onConfirm({
// closeOnBackdropClick: true,
// closeOnEsc: false,
// confirmationTitle: "Confirm",
// confirmationSubTitle: "Are you sure ?",
// confirmationDescription: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione, repellendus! ",
// direction: "left",
// yes: {
//     color: "primary",
//     text: "Agree",
//     variant: "contained"
// },
// no: {
//     color: "error",
//     text: "DisAgree",
//     variant: "outlined"
// }
// })
//     .then(() => {
//         setIsTnCModalOpened(true);
//     }).catch(() => {
//     console.log('rejected');
// });

// ****************************** USAGE ****************************** //
