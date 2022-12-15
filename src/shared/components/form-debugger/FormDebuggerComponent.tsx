import "./FormDebuggerComponent.scss";
import DataLabelValueComponent from "../data-label-value/DataLabelValueComponent";
import HorizontalLineComponent from "../horizontal-line/horizontal-line/HorizontalLineComponent";
import React from "react";
import {FormikProps} from "formik";

interface FormDebuggerComponentProps {
    form: FormikProps<any>;
}

const FormDebuggerComponent = (props: FormDebuggerComponentProps) => {

    const {isValid, values, errors} = props.form;

    return (
        <div className={"form-debugger"}>
            <DataLabelValueComponent label={"Form Valid"}>
                {isValid ? "Valid" : "Invalid"}
            </DataLabelValueComponent>
            <HorizontalLineComponent/>
            <DataLabelValueComponent label={"Values"}>
               <pre>
                   {JSON.stringify(values, null, 2)}
               </pre>
            </DataLabelValueComponent>
            <HorizontalLineComponent/>
            <DataLabelValueComponent label={"Errors"}>
               <pre>
                   {JSON.stringify(errors, null, 2)}
               </pre>
            </DataLabelValueComponent>
        </div>
    );

};

export default FormDebuggerComponent;