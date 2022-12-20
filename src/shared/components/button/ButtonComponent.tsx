import "./ButtonComponent.scss";
import {Button} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import SaveIcon from '@mui/icons-material/Save';
import {CSSProperties, useCallback} from "react";

interface ButtonComponentProps {
    type?: "button" | "submit" | "reset";
    className?: string;
    color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
    disabled?: boolean;
    fullWidth?: boolean;
    size?: 'small' | 'medium' | 'large';
    variant?: 'contained' | 'outlined' | 'text';
    prefixIcon?: any;
    suffixIcon?: any;
    isLoading?: boolean;
    id?: string;
    onClick?: () => void;
    style?: CSSProperties;
}

const ButtonComponent = (props: React.PropsWithChildren<ButtonComponentProps>) => {

    const {
        className,
        style,
        fullWidth,
        id,
        disabled,
        isLoading,
        prefixIcon,
        suffixIcon,
        onClick,
        children
    } = props;
    const color = props.color || "primary";
    const size = props.size || "medium";
    const variant = props.variant || "contained";
    const type = props.type || "button";

    const handleOnClick = useCallback(() => {
        if (onClick) {
            onClick();
        }
    }, [onClick]);

    return (
        <>
            {
                isLoading && <>
                    <LoadingButton
                        id={id}
                        style={style}
                        loading
                        loadingPosition="start"
                        fullWidth={fullWidth}
                        startIcon={<SaveIcon/>}
                        variant={variant}
                        type={type}
                    >
                        {children}
                    </LoadingButton>
                </>
            }
            {
                !isLoading && <>
                    <Button variant={variant}
                            id={id}
                            style={style}
                            disabled={disabled}
                            fullWidth={fullWidth}
                            className={"button-"+ size + " " +className}
                            size={size}
                            type={type}
                            color={color}
                            startIcon={prefixIcon}
                            endIcon={suffixIcon}
                            onClick={handleOnClick}
                    >
                        {children}
                    </Button>
                </>
            }
        </>
    );

};

export default ButtonComponent;