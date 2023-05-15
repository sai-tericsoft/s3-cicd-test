import "./LoaderComponent.scss";

import React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

interface LoaderComponentProps {
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    type?: "progress" | "spinner";
    color?: "error" | "primary" | "secondary" | "info" | "success" | "warning" | undefined;
}

const sizeMap = {
    "xs": 20,
    "sm": 30,
    "md": 40,
    "lg": 50,
    "xl": 60,
}

const LoaderComponent = (props: LoaderComponentProps) => {

    const type = props.type || "progress";
    const size = props.size || "lg";
    const color = props.color || "primary";

    return (
        <>
            {type === "progress" &&
                <LinearProgress color={color}/>
            }
            {type === "spinner" &&
                <CircularProgress color={color} size={sizeMap[size]}/>
            }
        </>
    );
};

export default LoaderComponent;
