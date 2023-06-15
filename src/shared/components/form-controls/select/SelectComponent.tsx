import "./SelectComponent.scss";
import React, {useCallback, useEffect, useState} from "react";
import {FormHelperText, InputLabel, MenuItem} from "@mui/material";
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {ISelectProps} from "../../../models/form-controls.model";
import IconButtonComponent from "../../icon-button/IconButtonComponent";
import {ImageConfig} from "../../../../constants";

interface SelectComponentProps extends ISelectProps {
    value?: any;
    hasError?: boolean;
    errorMessage?: any;
    endAdornment?: any;
}

const SelectComponent = (props: SelectComponentProps) => {

    const {
        className,
        fullWidth,
        hasError,
        errorMessage,
        label,
        onBlur,
        onUpdate,
        options,
        required,
        disabled,
        endAdornment,
        id,
        ...otherProps
    } = props;

    const [tmpValue, setTmpValue] = useState(props.value);
    const variant = props.variant || "outlined";
    const size = props.size || "medium";
    const isClear = props.isClear || false;

    console.log(isClear);

    const handleUpdate = useCallback((e: SelectChangeEvent) => {
        console.log(e);
        const selectedValue = e.target.value;
        console.log(selectedValue);
        setTmpValue(selectedValue);
        if (onUpdate) {
            onUpdate(selectedValue);
        }
    }, [onUpdate]);

    const handleOnBlur = useCallback(() => {
        if (onBlur) {
            onBlur();
        }
    }, [onBlur]);

    useEffect(() => {
        if (props.value) {
            console.log(props.value);
            setTmpValue(props.value);
        }
    }, [props.value]);

    const defaultDisplayWith = useCallback((item: any) => item?.title !== undefined ? item?.title : '', []);
    const defaultValueExtractor = useCallback((item: any) => item?.code !== undefined ? item?.code : '', []);
    const defaultKeyExtractor = useCallback((item: any, index?: number) => item?.code || index, []);
    const displayWith = props.displayWith || defaultDisplayWith;
    const valueExtractor = props.valueExtractor || defaultValueExtractor;
    const keyExtractor = props.keyExtractor || defaultKeyExtractor;

    const handleClear = useCallback(() => {
        setTmpValue('')
        onUpdate && onUpdate('');
    }, [onUpdate])

    const ClearOption = useCallback(() => (
        <IconButtonComponent onClick={handleClear} className={'mrg-right-10'}>
            <ImageConfig.CloseIcon/>
        </IconButtonComponent>
    ), [handleClear]);

    return (
        <FormControl className={'select-component ' + className + ' ' + (fullWidth ? "full-width" : "")}
                     error={hasError} fullWidth={fullWidth} size={size}
                     disabled={disabled}>
            {
                label && <InputLabel>
                    {label} {required ? " * " : ""}
                </InputLabel>
            }
            <Select
                fullWidth={fullWidth}
                value={tmpValue}
                error={hasError}
                label={label + "" + (required ? " * " : "")}
                variant={variant}
                onChange={handleUpdate}
                onBlur={handleOnBlur}
                endAdornment={(tmpValue && tmpValue !== "" && isClear) ? <ClearOption /> : null}
                id={id}
                {...otherProps}
            >
                {
                    (options?.length > 0) ? (options?.map((item, index) => {
                        return <MenuItem
                            id={id + `_drop-down-option-${displayWith(item)}`}
                            key={keyExtractor ? keyExtractor(item) : `drop-down-option-${index}`}
                            value={valueExtractor(item, index)}>
                            {displayWith(item)}
                        </MenuItem>;
                    })) : <MenuItem>No Data</MenuItem>
                }
            </Select>
            <FormHelperText>
                {hasError && <> {errorMessage} </>}
            </FormHelperText>
        </FormControl>
    );

};

export default SelectComponent;
