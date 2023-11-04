import "./IconButtonComponent.scss";
import IconButton from "@mui/material/IconButton";
import {useCallback} from "react";

interface IconButtonComponentProps {
    type?: "button" | "submit" | "reset";
    className?: string;
    color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
    disabled?: boolean;
    fullWidth?: boolean;
    size?: 'small' | 'medium' | 'large';
    id?: string;
    position?: "start" | "end" | false;
    onClick?: (e:any) => void;
}

const IconButtonComponent = (props: React.PropsWithChildren<IconButtonComponentProps>) => {

    const {
        className,
        id,
        disabled,
        onClick,
        children,
        position
    } = props;
    const color = props.color || "primary";
    const size = props.size || "medium";
    const type = props.type || "button";

    const handleOnClick = useCallback((e:any) => {
        if (onClick) {
            onClick(e);
        }
    }, [onClick]);

    return (
        <IconButton
            id={id}
            disabled={disabled}
            className={className}
            size={size}
            type={type}
            color={color}
            onClick={handleOnClick}
            edge={position}
        >
            {children}
        </IconButton>
    );

};

export default IconButtonComponent;