import "./ErrorComponent.scss";

interface ErrorComponentProps {
    errorText: string | any;
}

const ErrorComponent = (props: ErrorComponentProps) => {

    const {errorText} = props;

    return (
        <div className={'error-component error-text'}>
            {errorText}
        </div>
    );

};

export default ErrorComponent;