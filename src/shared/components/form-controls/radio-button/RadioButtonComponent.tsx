import {FormControlLabel, Radio} from "@mui/material";
import {useCallback} from "react";
import RadioGroup from '@mui/material/RadioGroup';

interface RadioButtonGroupComponentProps {
    name?: string;
    label?: string;
    checked?: boolean;
    options?: any[];
    required?: boolean;
    onChange?: (value: any) => void
    value?: any;
    id?: any,
    disabled?: boolean;
}

const RadioButtonGroupComponent = (props: RadioButtonGroupComponentProps) => {

    const {value, options, name, onChange, checked, disabled, id, required} = props;

    const handleOnChange = useCallback((value: any)=>{
        if (onChange){
            onChange(value);
        }
    }, [onChange]);

    return (<>
            <RadioGroup name={name}>
                {
                    (options && options?.length > 0) && options.map((option: any, index) => {
                        return <RadioButtonComponent
                            key={option.code}
                            value={option.code}
                            checked={checked}
                            required={required}
                            id={id}
                            disabled={disabled}
                            label={option.title}
                            onChange={handleOnChange}
                        />
                    })
                }
            </RadioGroup>
        </>
    )
}
export default RadioButtonGroupComponent;

interface RadioButtonComponentProps {
    onChange?: (value: any) => void;
    value?: any;
    checked?: boolean;
    className?: string;
    color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    disabled?: boolean;
    id?: string;
    required?: boolean;
    size?: 'medium' | 'small';
    label?: string;

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