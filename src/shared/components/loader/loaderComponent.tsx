import "./loaderComponent.scss";

import React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

interface LoaderComponentProps {
    size?: "xs" | "s" | "m" | "l" | "xl";
    type?: "progress" | "spinner";
    color?: "error" | "primary" | "secondary" | "info" | "success" | "warning" | undefined;
}

const sizeMap = {
    "xs": 20,
    "s": 30,
    "m": 40,
    "l": 50,
    "xl": 60,
}

const LoaderComponent = (props: LoaderComponentProps) => {

    let {type, color, size} = props;

    if (!type) {
        type = "progress";
    }

    if (!size) {
        size = "m";
    }

    if (!color) {
        color = "secondary";
    }

    return (
        <>
            <Box>
                {type === "progress" &&
                <LinearProgress color={color}/>
                }
                {type === "spinner" &&
                <CircularProgress color={color} size={sizeMap[size]}/>
                }
            </Box>
        </>
    );
};

export default LoaderComponent;