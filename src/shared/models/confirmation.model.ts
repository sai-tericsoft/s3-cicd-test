export interface IConfirmationButtonItem {
    color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
    text?: string;
}

export interface IConfirmationConfig {
    no?: IConfirmationButtonItem;
    yes?: IConfirmationButtonItem;
    direction?: 'left' | 'right' | 'up' | 'down';
    confirmationTitle?: string;
    confirmationDescription?: string;
    confirmationSubTitle?: string;
    disableEscKeyClose?: boolean;
    disableBackdropClose?: boolean;
    hideNoOption?: boolean;
    imagePath?: string;
}
