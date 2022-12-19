import "./RadioButtonComponent.scss";
import {FormControlLabel, Radio} from "@mui/material";
import {useCallback} from "react";
import RadioGroup from '@mui/material/RadioGroup';
import {IRadioButtonGroupProps, IRadioButtonProps} from "../../../models/form-controls.model";
import FormControl from "@mui/material/FormControl";

interface RadioButtonGroupComponentProps extends IRadioButtonGroupProps {
    checked?: boolean;
    value?: any;
    errorMessage?: any;
    hasError?: boolean;
}

const RadioButtonGroupComponent = (props: RadioButtonGroupComponentProps) => {

    let {value, options, name, hasError, onChange, disabled, id, required} = props;

    const defaultDisplayWith = useCallback((item: any) => item?.title || '', []);
    const defaultValueExtractor = useCallback((item: any) => item?.code || '', []);
    const defaultKeyExtractor = useCallback((item: any) => item?._id, []);
    const displayWith = props.displayWith || defaultDisplayWith;
    const valueExtractor = props.valueExtractor || defaultValueExtractor;
    const keyExtractor = props.keyExtractor || defaultKeyExtractor;
    const direction = props.direction || "row";
    const color = props.color || 'primary';
    const size = props.size || 'medium';

    const handleOnChange = useCallback((value: any) => {
        if (onChange) {
            onChange(value);
        }
    }, [onChange]);

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
                            onChange={handleOnChange}
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

const RadioButtonComponent = (props: RadioButtonComponentProps) => {

    const {label, checked, color, size, className, id, disabled, required, onChange, value} = props;

    const handleRadioOnChange = useCallback((e: any) => {
        if (onChange) {
            onChange(value);
        }
    }, [onChange, value])

    return (
        <FormControlLabel
            className={"radio-component"}
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