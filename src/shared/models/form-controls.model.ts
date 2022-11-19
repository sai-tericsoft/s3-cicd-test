export interface IInputFieldProps {
    label: string;
    variant?: "outlined" | "filled" | "standard";
    size?: 'medium' | 'small';
    value?: any;
    required?: boolean;
    placeholder?: string;
    onChange?: (value: any) => void;
    name?: string;
    id?: string;
    fullWidth?: boolean;
    disabled?: boolean;
    className?: string;
    prefix?: any;
    hasError?: boolean;
    errorMessage?: any;
    inputProps?: any;
    readOnly?: boolean;
}

export interface ICheckBoxProps {
    label: string;
    className?: string;
    name?: string;
    color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    disabled?: boolean;
    id?: string;
    indeterminate?: boolean;
    onChange?: (isChecked: boolean) => void;
    required?: boolean;
    size?: "medium" | "small";
    hasError?: boolean;
    errorMessage?: any;
}
