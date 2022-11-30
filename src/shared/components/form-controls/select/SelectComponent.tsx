import "./SelectComponent.scss";
import {useCallback, useEffect, useState} from "react";
import {InputLabel, MenuItem} from "@mui/material";
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {ISelectProps} from "../../../models/form-controls.model";

interface SelectComponentProps extends ISelectProps {
    value?: any;
}

const SelectComponent = (props: SelectComponentProps) => {

    const {
        className,
        fullWidth,
        hasError,
        label,
        onBlur,
        onUpdate,
        options,
        required,
        ...otherProps
    } = props;

    const [tmpValue, setTmpValue] = useState(props.value);

    const variant = props.variant || "outlined";
    const size = props.size || "medium";

    const handleUpdate = useCallback((e: SelectChangeEvent) => {
        const selectedValue = e.target.value;
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
           setTmpValue(props.value);
        }
    }, [props.value]);

    const defaultDisplayWith = useCallback((item: any) => item?.title || '', []);
    const defaultValueExtractor = useCallback((item: any) => item?.code || '', []);
    const defaultKeyExtractor = useCallback((item: any, index?: number) => item?.code || index, []);
    const displayWith = props.displayWith || defaultDisplayWith;
    const valueExtractor = props.valueExtractor || defaultValueExtractor;
    const keyExtractor = props.keyExtractor || defaultKeyExtractor;

    return (
    <FormControl className={'select-component ' + className + ' ' + (fullWidth ? "full-width" : "")}
                 error={hasError} fullWidth={fullWidth} size={size}>
         <InputLabel>
            {label} {required ? " * " : ""}
        </InputLabel>
        <Select
            fullWidth={fullWidth}
            value={tmpValue}
            error={hasError}
            label={label + "" + (required ? " * " : "")}
            variant={variant}
            onChange={handleUpdate}
            onBlur={handleOnBlur}
            {...otherProps}
        >
            {
                (options.length > 0) && options?.map((item, index) => {
                    return <MenuItem key={keyExtractor ? keyExtractor(item) : `drop-down-option-${index}`}
                                     value={valueExtractor(item, index)}> {displayWith(item)} </MenuItem>;
                })
            }
        </Select>
    </FormControl>
    );

};

export default SelectComponent;