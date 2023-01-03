import "./ChipComponent.scss";
import {Chip} from "@mui/material";
import {useCallback} from "react";

interface ChipComponentProps {
    id?: string;
    label: string;
    className?: string;
    disabled?: boolean;
    onClick?: () => void;
    onDelete?: () => void;
    size?: 'medium' | 'small';
    variant?: 'filled' | 'outlined';
    prefixIcon?:any;
    color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

const ChipComponent = (props: ChipComponentProps) => {

    const {label, id, disabled, className, onDelete, onClick ,prefixIcon} = props;
    const color = props.color || "primary";
    const size = props.size || "medium";
    const variant = props.variant || "filled";

    const handleChipClick = useCallback(() => {
        if (onClick) {
            onClick();
        }
    }, [onClick]);

    const handleChipDelete = useCallback(() => {
        if (onDelete) {
            onDelete();
        }
    }, [onDelete]);

    return (
        <Chip label={label}
              id={id}
              color={color}
              size={size}
             icon={prefixIcon}
              variant={variant}
              disabled={disabled}
              className={'chip ' + className}
              clickable={!!onClick}
              onDelete={onDelete && handleChipDelete}
              onClick={handleChipClick}
        />
    );

};

export default ChipComponent;