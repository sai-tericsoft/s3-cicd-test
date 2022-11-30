import React from "react";
import {AutocompleteRenderOptionState} from "@mui/material";

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
    errorMessage?: any;
    fullWidth?: boolean;
    hasError?: boolean;
    id?: string;
    required?: boolean;
    displayWith?: (item: any) => any;
    keyExtractor?: (item: any) => any;
    valueExtractor?: (item: any, index: number) => any;
    label?: string;
    onUpdate?: (value: any) => void;
    onBlur?: () => void;
    options: any[];
    readOnly?: boolean;
    size?: 'small' | 'medium';
    value?: any;
    variant?: 'filled' | 'outlined' | 'standard';
}

export interface IAutoCompleteProps {
    blurOnSelect?: boolean;
    className?: string;
    clearLocalListData?: boolean;
    color?: "error" | "primary" | "secondary" | "info" | "success" | "warning" | undefined;
    options: any[];
    dataListKey?: string;
    defaultData?: any[];
    disableClearable?: boolean;
    disabled?: boolean;
    displayWith?: (item: any) => any;
    extraPayload?: object;
    freeSolo?: boolean;
    fullWidth?: boolean;
    id?: string;
    isDataLoaded?: boolean;
    isDataLoading?: boolean;
    isDataLoadingFailed?: boolean;
    keyExtractor?: (item: any) => any;
    label: string;
    loading?: boolean;
    loadingText?: string;
    method?: "get" | "post" | string;
    multiple?: boolean;
    name?: string;
    noDataMessage?: string;
    onUpdate?: (value: any) => void;
    openOnFocus?: boolean;
    payload?: object;
    placeholder?: string;
    readOnly?: boolean;
    renderOption?: (
        props: React.HTMLAttributes<HTMLLIElement>,
        option: any,
        state: AutocompleteRenderOptionState,
    ) => React.ReactNode;
    required?: boolean;
    searchMode?: "clientSide" | "serverSide",
    size?: 'small' | 'medium';
    url?: string;
    valueExtractor?: (item: any) => any;
}