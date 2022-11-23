import "./FormControlLabelComponent.scss";

interface FormControlLabelComponentProps {
    label: string;
    size?: "sm" | "md" | "lg" | "xl";
    required?: boolean;
}

const FormControlLabelComponent = (props: FormControlLabelComponentProps) => {

    const {label, required} = props;
    const size = props.size || "md";

    return (
        <div className={`form-control-label-component ${size}`}>
            <div className="form-control-label">{label}</div>
            {required && <span className="form-control-required"> *</span>}
        </div>
    );

};

export default FormControlLabelComponent;