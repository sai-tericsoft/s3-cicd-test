import "./FormikAutoCompleteComponent.scss";
import {FieldProps} from "formik";
import {IAutoCompleteProps} from "../../../models/form-controls.model";
import _ from "lodash";
import {useCallback} from "react";
import AutoCompleteDropdownComponent from "../auto-complete/AutoCompleteComponent";

interface FormikAutoCompleteComponentProps extends IAutoCompleteProps{
    formikField: FieldProps;
}

const FormikAutoCompleteComponent = (props: FormikAutoCompleteComponentProps) => {

    const {
        formikField,
        onUpdate,
        ...otherProps
    } = props;

    const {field, form} = formikField;
    const {name, value} = field;
    const {setFieldTouched, touched, errors, setFieldValue} = form;
    const hasError = _.get(touched, name) && !!(_.get(errors, name));

    const handleValueChange = useCallback((value: any) => {
        let tempValue = value || '';
        setFieldValue(name, tempValue);
        setFieldTouched(name);
        if (onUpdate) {
            onUpdate(tempValue)
        }
    }, [name, onUpdate, setFieldTouched, setFieldValue]);

    const onBlur = useCallback(() => {
       setFieldTouched(name);
    }, [name, setFieldTouched]);


    return (
            <AutoCompleteDropdownComponent
                onUpdate={(value: any) => {handleValueChange(value)}}
                hasError={hasError}
                errorMessage={hasError && (_.get(errors, name))}
                value={value}
                onBlur={onBlur}
                {...otherProps}
            />
    );
};

export default FormikAutoCompleteComponent;