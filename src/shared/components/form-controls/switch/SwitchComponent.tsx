import "./SwitchComponent.scss";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import {useCallback} from "react";
import {ISwitchProps} from "../../../models/form-controls.model";

interface SwitchComponentProps extends ISwitchProps{
    checked?: boolean;
    value?: any;
}

const SwitchComponent = (props: SwitchComponentProps) => {

    const {label, checked, name, className, disabled, id, onChange, required, value} = props;
    const color = props.color || 'primary';
    const size = props.size || 'medium';
    const labelPlacement = props.labelPlacement || 'end';

    const handleSwitchChange = useCallback((event: any) => {
        const isSwitched = event.target.checked;
        if (onChange) {
            onChange(isSwitched);
        }
    }, [onChange]);

    return (
        <FormControlLabel
            labelPlacement={labelPlacement}
            label={label}
            control={
            <Switch className={className}
                    color={color}
                    checked={checked}
                    disabled={disabled}
                    name={name}
                    id={id}
                    onChange={handleSwitchChange}
                    required={required}
                    value={value}
                    size={size}
            />}/>
    );

};

export default SwitchComponent;