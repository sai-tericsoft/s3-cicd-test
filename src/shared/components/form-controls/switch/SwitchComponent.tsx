import "./SwitchComponent.scss";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import {useCallback} from "react";

interface SwitchComponentProps {
    label: string;
    checked?: boolean;
    className?: string;
    color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    disabled?: boolean;
    edge?: 'end' | 'start' | false;
    id?: string;
    onChange?: (isChecked: boolean) => void;
    required?: boolean;
    size?: 'medium' | 'small';
    value?: any;
}

const SwitchComponent = (props: SwitchComponentProps) => {

    const {label, checked, className, disabled, id, onChange, required, value} = props;
    const color = props.color || 'primary';
    const edge = props.edge || false;
    const size = props.size || 'medium';

    const handleSwitchChange = useCallback((event: any) => {
        const isSwitched = event.target.checked;
        if (onChange) {
            onChange(isSwitched);
        }
    }, [onChange]);

    return (
        <FormControlLabel control={
            <Switch className={className}
                    color={color}
                    checked={checked}
                    disabled={disabled}
                    id={id}
                    onChange={handleSwitchChange}
                    required={required}
                    value={value}
                    edge={edge}
                    size={size}
            />}
          label={label}/>
    );

};

export default SwitchComponent;