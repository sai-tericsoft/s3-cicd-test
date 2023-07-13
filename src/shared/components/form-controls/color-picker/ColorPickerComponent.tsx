import './ColorPickerComponent.scss';
import React, {useState} from 'react';
import reactCSS from 'reactcss';
import {SketchPicker} from 'react-color';
import {FormHelperText} from "@mui/material";
import FormControl from '@mui/material/FormControl';
import {IColorPickerProps} from "../../../models/form-controls.model";
import ButtonComponent from "../../button/ButtonComponent";

interface ColorPickerComponentProps extends IColorPickerProps {

}

const ColorPickerComponent = (props: ColorPickerComponentProps) => {
    const {value, name, handleChange, label, required, errorMessage, hasError, className, disabled} = props;
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const [color, setColor] = useState<any>(value);

    console.log(props);

    const handleClick = () => {
        setDisplayColorPicker(!displayColorPicker);
    };

    const handleClose = () => {
        setDisplayColorPicker(false);
    };

    const handleColorChange = (newColor: any) => {
        setColor(newColor.rgb);
        if (handleChange) {
            handleChange(newColor.rgb, name);
        }
    };

    const handleSelect = () => {
        setDisplayColorPicker(false);
        // Perform any necessary actions when the color is selected
    };


    const styles: any = reactCSS({
        'default': {
            color: {
                width: '18px',
                height: '18px',
                borderRadius: '100%',
                background: color
                    ? `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
                    : 'transparent',
                border: '1px solid #000000',
            },
            swatch: {
                background: '#fff',
                borderRadius: '100%',
                // boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                display: 'inline-block',
                cursor: 'pointer',
            },
            popover: {
                position: 'relative', // Update position to relative
                zIndex: '2',
                // textAlign: 'center',
                marginTop: '10px', // Adjust spacing if needed
                border: 'none', // Remove the border
            },
            cover: {
                position: 'fixed',
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px',
            },
        },
    });

    return (
        <div>
            <FormControl className={'color-component ' + className + ' '} error={hasError} disabled={disabled}>
                {label &&
                <div className="pdd-bottom-15">
                    {label} {required ? " * " : ""}
                </div>
                }

                <div style={styles.swatch} onClick={handleClick}>
                    <div style={styles.color}/>
                </div>

                {displayColorPicker && (
                    <div style={styles.popover}>
                        <div style={styles.cover} onClick={handleClose}/>
                        <SketchPicker color={color} onChange={handleColorChange}/>
                        <ButtonComponent className="select-button"
                            onClick={handleSelect}
                        >Select</ButtonComponent>

                    </div>
                )}
                <FormHelperText>{hasError && <> {errorMessage} </>}</FormHelperText>
            </FormControl>
        </div>
    );


};

export default ColorPickerComponent;
