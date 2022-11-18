import "./CheckBoxComponent.scss";
import {Checkbox, FormControlLabel} from "@mui/material";
import {useCallback} from "react";

interface CheckBoxComponentProps {
    label: string;
    checked?: boolean;
    className?: string;
    color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    disabled?: boolean;
    id?: string;
    indeterminate?: boolean;
    onChange?: (isChecked: boolean) => void;
    required?: boolean;
    size?: "medium" | "small";
    value?: any;
}

const CheckBoxComponent = (props: CheckBoxComponentProps) => {

    const {label, checked, className, disabled, id, indeterminate, onChange, required, value} = props;
    const size = props.size || "medium";
    const color = props.color || "primary";

    const handleCheckBoxOnChange = useCallback((event: any) => {
        const isChecked = event.target.checked;
        if (onChange) {
            onChange(isChecked);
        }
    }, [onChange]);

    return (
        <FormControlLabel
            control={<Checkbox
                size={size}
                color={color}
                checked={checked}
                className={className}
                disabled={disabled}
                id={id}
                required={required}
                value={value}
                indeterminate={indeterminate}
                onChange={handleCheckBoxOnChange}
            />}
            label={label}
        />
    );

};

export default CheckBoxComponent;