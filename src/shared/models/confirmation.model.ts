export interface IConfirmationButtonItem {
    color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
    variant?: 'contained' | 'outlined' | 'text';
    text?: string;
}

export interface IConfirmationConfig {
    no?: IConfirmationButtonItem;
    yes?: IConfirmationButtonItem;
    direction?: 'left' | 'right' | 'up' | 'down';
    confirmationTitle?: string;
    confirmationDescription?: string;
    image?: any;
    confirmationSubTitle?: string;
    closeOnEsc?: boolean;
    closeOnBackdropClick?: boolean;
    hideNoOption?: boolean;
}
