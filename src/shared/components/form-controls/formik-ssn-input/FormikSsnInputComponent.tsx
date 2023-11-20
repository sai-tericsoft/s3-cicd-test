import "./FormikSsnInputComponent.scss";
import {FieldProps} from "formik";
import {ISSNInputProps} from "../../../models/form-controls.model";
import _ from "lodash";
import {useCallback} from "react";
import SsnInputComponent from "../../ssn-input/SsnInputComponent";

interface FormikSsnInputComponentProps extends ISSNInputProps{
    formikField: FieldProps;
}

const FormikSsnInputComponent = (props: FormikSsnInputComponentProps) => {

    const {
        formikField,
        onChange,
        ...otherProps
    } = props;

    const {field, form} = formikField;
    const {name, value} = field;
    const {setFieldTouched, touched, handleBlur, errors, setFieldValue} = form;
    const hasError = _.get(touched, name) && !!(_.get(errors, name));

    const textChangeHandler = useCallback((text: string) => {
        setFieldValue(name, text);
        setFieldTouched(name);
        if (onChange) {
            onChange(text);
        }
    }, [setFieldValue, setFieldTouched, name, onChange]);

    const onInputBlur = useCallback(() => {
        handleBlur(name);
        setFieldTouched(name);
    }, [name, handleBlur, setFieldTouched]);


    return (
        <div className={'formik-ssn-input-component'}>
            <SsnInputComponent
                name={name}
                value={value}
                inputProps={{
                    onBlur: onInputBlur,
                }}
                onChange={textChangeHandler}
                hasError={hasError}
                errorMessage={hasError && (_.get(errors, name))}
                {...otherProps}/>
        </div>
    );

};

export default FormikSsnInputComponent;