import React from "react";

export interface IConfirmationButtonItem {
    color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
    variant?: 'contained' | 'outlined' | 'text';
    text?: string;
    isLoading?:boolean
}

export interface IConfirmationConfig {
    no?: IConfirmationButtonItem;
    yes?: IConfirmationButtonItem;
    direction?: 'left' | 'right' | 'up' | 'down';
    confirmationTitle?: string;
    confirmationDescription?: string | React.ReactElement;
    image?: any;
    showLottie?: boolean;
    confirmationSubTitle?: string;
    closeOnEsc?: boolean;
    closeOnBackdropClick?: boolean;
    hideNoOption?: boolean;
}
