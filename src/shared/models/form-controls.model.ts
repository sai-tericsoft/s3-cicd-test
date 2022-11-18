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
