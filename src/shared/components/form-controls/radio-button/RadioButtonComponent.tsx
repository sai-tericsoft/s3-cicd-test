import "./RadioButtonComponent.scss";
import {FormControlLabel, Radio} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import RadioGroup from '@mui/material/RadioGroup';
import {IRadioButtonGroupProps, IRadioButtonProps} from "../../../models/form-controls.model";
import FormControl from "@mui/material/FormControl";

interface RadioButtonGroupComponentProps extends IRadioButtonGroupProps {
    value?: any;
    errorMessage?: any;
    hasError?: boolean;
}

const RadioButtonGroupComponent = (props: RadioButtonGroupComponentProps) => {

    let {options, name, hasError, onChange, disabled, id, required} = props;
    const [value, setValue] = useState(props.value);

    const defaultDisplayWith = useCallback((item: any) => item?.title || '', []);
    const defaultValueExtractor = useCallback((item: any) => item?.code, []);
    const defaultKeyExtractor = useCallback((item: any) => item?._id, []);
    const displayWith = props.displayWith || defaultDisplayWith;
    const valueExtractor = props.valueExtractor  || defaultValueExtractor;
    const keyExtractor = props.keyExtractor || defaultKeyExtractor;
    const direction = props.direction || "row";
    const color = props.color || 'primary';
    const size = props.size || 'medium';

    useEffect(() => {
        setValue(props.value);
    }, [props.value]);

    return (<FormControl error={hasError}>
            <RadioGroup name={name} row={direction === "row"} color={color} className={"radio-group-component"}>
                {
                    (options && options?.length > 0) && options.map((option: any) => {
                        return <RadioButtonComponent
                            size={size}
                            color={color}
                            key={keyExtractor(option)}
                            value={valueExtractor(option)}
                            checked={valueExtractor(option) === value}
                            required={required}
                            id={id}
                            disabled={disabled}
                            label={displayWith(option)}
                            onChange={(value: any) => {
                                let selectedValue: any = value;
                                if (typeof valueExtractor(option) === "boolean") {
                                    selectedValue = selectedValue === true;
                                }
                                if (typeof valueExtractor(option) === "number") {
                                    selectedValue = Number(selectedValue);
                                }
                                if (onChange) {
                                    onChange(selectedValue);
                                }
                            }}
                        />
                    })
                }
            </RadioGroup>
        </FormControl>
    )
}
export default RadioButtonGroupComponent;

interface RadioButtonComponentProps extends IRadioButtonProps {

}

export const RadioButtonComponent = (props: RadioButtonComponentProps) => {

    const {label, checked, color, size, className, id, disabled, required, onChange, value} = props;

    const handleRadioOnChange = useCallback((e: any) => {
        if (onChange) {
            onChange(value);
        }
    }, [onChange, value]);

    return (
        <FormControlLabel
            className={`radio-component ${className}`}
            onChange={handleRadioOnChange}
            control={<Radio value={value}
                            checked={checked}
                            className={className}
                            id={id}
                            onChange={handleRadioOnChange}
                            color={color}
                            size={size}
                            disabled={disabled}
                            required={required}/>}
            label={label}/>
    )

}
