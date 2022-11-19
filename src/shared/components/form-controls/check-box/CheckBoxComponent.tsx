import "./CheckBoxComponent.scss";
import {Checkbox, FormControlLabel, FormHelperText, FormControl} from "@mui/material";
import {useCallback} from "react";
import {ICheckBoxProps} from "../../../models/form-controls.model";

interface CheckBoxComponentProps extends ICheckBoxProps {
    checked?: boolean;
    value?: any;
}

const CheckBoxComponent = (props: CheckBoxComponentProps) => {

    const {label, checked, className, disabled, id, hasError, errorMessage, indeterminate, onChange, required, value} = props;
    const size = props.size || "medium";
    const color = props.color || "primary";

    const handleCheckBoxOnChange = useCallback((event: any) => {
        const isChecked = event.target.checked;
        if (onChange) {
            onChange(isChecked);
        }
    }, [onChange]);

    return (
        <FormControl className="check-box-component-with-formik-wrapper" error={hasError}>
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
            <FormHelperText>
                {hasError && <> {errorMessage} </>}
            </FormHelperText>
        </FormControl>
    );

};

export default CheckBoxComponent;