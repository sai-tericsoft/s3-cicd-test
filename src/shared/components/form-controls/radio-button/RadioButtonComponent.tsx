import {FormControlLabel, Radio} from "@mui/material";
import {useCallback} from "react";
import RadioGroup from '@mui/material/RadioGroup';
import {IRadioButtonGroupProps, IRadioButtonProps} from "../../../models/form-controls.model";

interface RadioButtonGroupComponentProps extends IRadioButtonGroupProps {
    checked?: boolean;
    value?: any;
}

const RadioButtonGroupComponent = (props: RadioButtonGroupComponentProps) => {

    let {value, options, name, onChange, checked, titleKey, disabled, id, required, valueKey} = props;

    if (!titleKey) titleKey = "title";
    if (!valueKey) valueKey = "code";

    const handleOnChange = useCallback((value: any) => {
        if (onChange) {
            onChange(value);
        }
    }, [onChange]);

    return (<>
            <RadioGroup name={name}>
                {
                    (options && options?.length > 0) && options.map((option: any, index) => {
                        return <RadioButtonComponent
                            key={option.code}
                            value={valueKey ? option[valueKey] : option}
                            checked={valueKey ? option[valueKey] === value : option === value}
                            required={required}
                            id={id}
                            disabled={disabled}
                            label={titleKey ? option[titleKey] : option}
                            onChange={handleOnChange}
                        />
                    })
                }
            </RadioGroup>
        </>
    )
}
export default RadioButtonGroupComponent;

interface RadioButtonComponentProps extends IRadioButtonProps {

}

const RadioButtonComponent = (props: RadioButtonComponentProps) => {

    const {label, checked, className, id, disabled, required, onChange, value} = props;

    const color = props.color || 'primary';
    const size = props.size || 'medium';

    const handleRadioOnChange = useCallback((e: any) => {
        if (onChange) {
            onChange(value);
        }
    }, [onChange, value])

    return (
        <FormControlLabel
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