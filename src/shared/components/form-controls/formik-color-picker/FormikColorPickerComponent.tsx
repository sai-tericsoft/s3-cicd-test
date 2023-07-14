import "./FormikColorPickerComponent.scss";
import {FieldProps} from "formik";
import _ from "lodash";
import {useCallback} from "react";
import {IColorPickerProps} from "../../../models/form-controls.model";
import TextAreaComponent from "../text-area/TextAreaComponent";
import ColorPickerComponent from "../color-picker/ColorPickerComponent";

interface FormikColorPickerComponentProps extends IColorPickerProps{
    formikField: FieldProps;
}

const FormikColorPickerComponent = (props: FormikColorPickerComponentProps) => {

    const {
        formikField,
        handleChange,
        ...otherProps
    } = props;

    const {field, form} = formikField;
    const {name, value} = field;
    const {setFieldTouched, touched, handleBlur, errors, setFieldValue} = form;
    const hasError = _.get(touched, name) && !!(_.get(errors, name));

    const colorChangeHandler = useCallback((text: string) => {
        setFieldValue(name, text);
        setFieldTouched(name);
        if (handleChange) {
            handleChange(text);
        }
    }, [setFieldValue, setFieldTouched, name, handleChange]);


    return (
        <div className={'formik-color-picker-component'}>
            <ColorPickerComponent
                value={value}
                handleChange={colorChangeHandler}
                hasError={hasError}
                errorMessage={hasError && (_.get(errors, name))}
                {...otherProps}
            />
        </div>
    );

};

export default FormikColorPickerComponent;