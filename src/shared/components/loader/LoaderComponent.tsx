import "./LoaderComponent.scss";

import React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import {Box} from "@mui/material";

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

    const type = props.type || "progress";
    const size = props.size || "m";
    const color = props.color || "primary";

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