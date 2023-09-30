import React, {InputHTMLAttributes} from "react";
import {AutocompleteRenderOptionState} from "@mui/material";
import {Moment} from "moment/moment";

export interface IInputFieldProps {
    validationPattern?: RegExp;
    className?: string;
    disabled?: boolean;
    fullWidth?: boolean;
    id?: string;
    inputProps?: any;
    label?: string;
    name?: string;
    onChange?: (value: any) => void;
    onFocus?: (event: any) => void;
    onBlur?: (event: any) => void;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    value?: any;
    titleCase?: boolean;
    variant?: "outlined" | "filled" | "standard";
    type?: 'email' | 'number' | 'password' | 'text';
    prefix?: any;
    suffix?: any;
    size?: 'small' | 'medium';
    max?: number;
    maxValue?: number;
    autoFocus?: boolean;
}


export interface IPasswordFieldProps {
    validationPattern?: RegExp;
    canToggle?: boolean;
    className?: string;
    disabled?: boolean;
    fullWidth?: boolean;
    id?: string;
    inputProps?: any;
    label: string;
    onChange?: (value: any) => void;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    value?: any;
    titleCase?: boolean;
    variant?: "outlined" | "filled" | "standard";
    prefix?: any;
    suffix?: any;
    size?: 'small' | 'medium';
}

export interface ICheckBoxProps {
    className?: string;
    color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    disabled?: boolean;
    errorMessage?: any;
    hasError?: boolean;
    id?: string;
    indeterminate?: boolean;
    label?: string;
    name?: string;
    onChange?: (isChecked: boolean) => void;
    required?: boolean;
    labelPlacement?: 'bottom' | 'end' | 'start' | 'top';
    size?: "medium" | "small";
    defaultChecked?: boolean;
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
    isValueBoolean?: boolean;
    id?: any;
    label?: string;
    name?: string;
    color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    direction?: "row" | "column";
    onChange?: (value: any) => void;
    displayWith?: (item: any) => string;
    keyExtractor?: (item: any) => any;
    valueExtractor?: (item: any) => any;
    options?: any[];
    size?: "medium" | "small";
    required?: boolean;
    value?: any;
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
    onChange?: (value: any) => void;
    option?: any;
    required?: boolean;
    size?: 'medium' | 'small';
    value?: any;
}

export interface ITextAreaProps {
    autoFocus?: boolean;
    className?: string;
    disabled?: boolean;
    errorMessage?: any;
    fullWidth?: boolean;
    hasError?: boolean;
    id?: string;
    textAreaProps?: any;
    label: string;
    name?: string;
    onChange?: (value: any) => void;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    rows?: number;
    size?: 'medium' | 'small';
    value?: any;
    prefix?: any;
    ref?: any
    variant?: "outlined" | "filled" | "standard";
}


export interface ISelectProps {
    autoWidth?: boolean;
    className?: string;
    disabled?: boolean;
    fullWidth?: boolean;
    id?: string;
    required?: boolean;
    displayWith?: (item: any) => any;
    keyExtractor?: (item: any) => any;
    valueExtractor?: (item: any, index?: number) => any;
    label?: string;
    onUpdate?: (value: any) => void;
    onBlur?: () => void;
    options: any[];
    readOnly?: boolean;
    size?: 'small' | 'medium';
    value?: any;
    variant?: 'filled' | 'outlined' | 'standard';
    isClear?: boolean;
    selectedValues?: any;
    multiple?: boolean;
}

export interface IAutoCompleteProps {
    blurOnSelect?: boolean;
    className?: string;
    clearLocalListData?: boolean;
    color?: "error" | "primary" | "secondary" | "info" | "success" | "warning" | undefined;
    options?: any[];
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
    label?: string;
    loading?: boolean;
    loadingText?: string;
    method?: "get" | "post" | string;
    multiple?: boolean;
    name?: string;
    noDataMessage?: string;
    onUpdate?: (value: any) => void;
    onBlur?: () => void;
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
    filterSelectedOptions?: boolean;
    filteredOptions?: any[];
    filteredOptionKey?: string;
}

export interface IDatePickerProps {
    fullWidth?: boolean;
    id?: string;
    variant?: "filled" | "standard" | "outlined" | undefined;
    color?: "error" | "primary" | "secondary" | "info" | "success" | "warning" | undefined;
    size?: "small" | "medium" | undefined;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    format?: string;
    minDate?: Moment;
    maxDate?: Moment;
    onUpdate?: Function;
    label?: string;
    mask?: string;
    onBlur?: () => void;
    enableDates?: any;
    onFocus?: () => void;
}


export interface IDateRangePickerProps {
    fullWidth?: boolean;
    id?: string;
    variant?: "filled" | "standard" | "outlined" | undefined;
    color?: "error" | "primary" | "secondary" | "info" | "success" | "warning" | undefined;
    size?: "small" | "medium" | undefined;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    format?: string;
    minDate?: Moment;
    maxDate?: Moment;
    onUpdate?: Function;
    label?: string;
    mask?: string;
    rangeDivider?: 'to' | '-';
    className?: string;
}

export interface IPhoneInputProps {
    className?: string;
    disabled?: boolean;
    fullWidth?: boolean;
    id?: string;
    inputProps?: InputHTMLAttributes<HTMLInputElement>;
    label?: string;
    name?: string;
    onChange?: (value: any) => void;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    value?: any;
}

export interface ITimePickerProps {
    autoFocus?: boolean;
    className?: string;
    errorMessage?: any;
    hasError?: boolean;
    name?: string;
    readOnly?: boolean;
    value?: any;
    id?: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    variant?: "filled" | "standard" | "outlined" | undefined;
    color?: "error" | "primary" | "secondary" | "info" | "success" | "warning" | undefined;
    onChange?: Function;
    size?: "small" | "medium" | undefined;
    fullWidth?: boolean;
    onBlur?: () => void;
}

export interface IColorPickerProps {
    value?: any;
    handleChange?: Function;
    label?: string;
    required?: boolean;
    errorMessage?: any;
    hasError?: boolean;
    className?: any;
    disabled?: boolean;
}

export interface IOTPFieldProps {
    required?: boolean;
    label?: string;
    className?: string;
    disabled?: boolean;
    noOfDigits?: number;
    hasError?: boolean;
    errorMessage?: any;
    isMasked?: boolean;
    placeholder?: string;
    fullWidth?: boolean;
    readOnly?: boolean;
    onChange?: (value: any) => void;
}
