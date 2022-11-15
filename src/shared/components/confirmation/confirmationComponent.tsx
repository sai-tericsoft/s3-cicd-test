import "./confirmationComponent.scss";
import * as React from 'react';
// import {useEffect, useState} from "react";
// import {Communications} from "../../services";
// import {IConfirmationConfig} from "../../models/confirmation.model";

interface ConfirmationComponentProps {

}

const ConfirmationComponent = (props: ConfirmationComponentProps) => {

    // const [open, setOpen] = useState(false);
    // const [config, setConfig] = useState<IConfirmationConfig | null>(null);
    // const [promise, setPromise] = useState<{ resolve: any, reject: any } | null>(null);

    // useEffect(() => {
    //     const subscription = Communications.ConfirmStateSubject.subscribe(({config, promise}) => {
    //         setPromise(promise);
    //         setConfig(config);
    //         openConfirmationDialog();
    //         console.log(config);
    //     })
    //     return () => {
    //         subscription.unsubscribe();
    //     }
    // }, []);
    //
    // const openConfirmationDialog = () => {
    //     setOpen(true);
    // };

    // const confirm = () => {
    //     promise?.resolve();
    //     closeConfirmationDialog();
    // }
    //
    // const cancel = (event: any, reason: any) => {
    //     if (config?.disableBackdropClose && reason && reason === "backdropClick") {
    //         return;
    //     }
    //     promise?.reject();
    //     closeConfirmationDialog();
    // }

    // const closeConfirmationDialog = () => {
    //     setOpen(false);
    // };

    return (
        <></>
        // <DialogComponent
        //     open={open}
        //     disableEscKeyClose={config?.disableEscKeyClose}
        //     disableBackdropClose={config?.disableBackdropClose}
        //     direction={"down"}
        //     isShowCancel={false}
        // >
        //     <div className="confirmation-dialog-container">
        //         <div className="confirmation-dialog-image">
        //             <img src={config?.imagePath} alt={'imagePath'}/>
        //         </div>
        //         <div className="confirmation-dialog-title">{config?.confirmationTitle || 'Confirm ?'}</div>
        //         <div className="confirmation-dialog-title-and-description">
        //             <div className="confirmation-dialog-sub-title">{config?.confirmationSubTitle}</div>
        //             <div className="confirmation-dialog-sub-description">{config?.confirmationDescription}</div>
        //         </div>
        //
        //         <div className="confirmation-dialog-sub-actions">
        //             {!config?.hideNoOption && <>
        //                 <ButtonComponent
        //                     handleClick={cancel}
        //                     color={config?.no?.color || 'inherit'}
        //                     fullWidth={true}
        //                     variant={"outlined"}>
        //                     {config?.no?.text || 'No, Cancel'}
        //                 </ButtonComponent>
        //                 <div className="width-10"/>
        //             </>
        //             }
        //             <ButtonComponent
        //                 handleClick={confirm}
        //                 color={config?.yes?.color || 'error'}
        //                 fullWidth={true}
        //                 variant={"contained"}>
        //                 {config?.yes?.text || 'Yes, Confirm'}
        //             </ButtonComponent>
        //         </div>
        //     </div>
        // </DialogComponent>
    );
};

export default ConfirmationComponent;

