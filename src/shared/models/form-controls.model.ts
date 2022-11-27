export interface IInputFieldProps {
    className?: string;
    disabled?: boolean;
    errorMessage?: any;
    fullWidth?: boolean;
    hasError?: boolean;
    id?: string;
    inputProps?: any;
    label: string;
    name?: string;
    onChange?: (value: any) => void;
    placeholder?: string;
    prefix?: any;
    readOnly?: boolean;
    required?: boolean;
    size?: 'medium' | 'small';
    value?: any;
    variant?: "outlined" | "filled" | "standard";
}

export interface ICheckBoxProps {
    className?: string;
    color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    disabled?: boolean;
    errorMessage?: any;
    hasError?: boolean;
    id?: string;
    indeterminate?: boolean;
    label: string;
    name?: string;
    onChange?: (isChecked: boolean) => void;
    required?: boolean;
    size?: "medium" | "small";
}

export interface ISwitchProps {
    className?: string;
    color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    disabled?: boolean;
    errorMessage?: any;
    hasError?: boolean;
    id?: string;
    label: string;
    labelPlacement?: 'bottom' | 'end' | 'start' | 'top';
    name?: string;
    onChange?: (isChecked: boolean) => void;
    required?: boolean;
    size?: "medium" | "small";
}

export interface IRadioButtonGroupProps {
    checked?: boolean;
    disabled?: boolean;
    errorMessage?: any;
    hasError?: boolean;
    id?: any;
    label?: string;
    name?: string;
    onChange?: (value: any) => void
    options?: any[];
    required?: boolean;
    titleKey?: string;
    value?: any;
    valueKey?: string;
}

export interface IRadioButtonProps {
    checked?: boolean;
    className?: string;
    color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    disabled?: boolean;
    errorMessage?: any;
    hasError?: boolean;
    id?: any;
    label?: string;
    name?: string;
    onChange?: (value: any) => void
    option?: any;
    required?: boolean;
    size?: 'medium' | 'small';
    titleKey?: string;
    value?: any;
    valueKey?: string;
}

export interface ITextAreaProps {
    className?: string;
    disabled?: boolean;
    errorMessage?: any;
    fullWidth?: boolean;
    hasError?: boolean;
    id?: string;
    inputProps?: any;
    label: string;
    name?: string;
    onChange?: (value: any) => void;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    rows?: number;
    size?: 'medium' | 'small';
    value?: any;
    variant?: "outlined" | "filled" | "standard";
}


export interface ISelectProps {
    autoWidth?: boolean;
    className?: string;
    disabled?: boolean;
    displayWith?: (item: any) => any;
    errorMessage?: any;
    fullWidth?: boolean;
    hasError?: boolean;
    id?: string;
    required?: boolean;
    keyExtractor?: (item: any) => any;
    label?: string;
    onUpdate?: (value: any) => void;
    onBlur?: () => void;
    options: any[];
    readOnly?: boolean;
    size?: 'small' | 'medium';
    value?: any;
    valueExtractor?: (item: any, index: number) => any;
    variant?: 'filled' | 'outlined' | 'standard';
}