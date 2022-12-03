import "./QuestionComponent.scss";

interface QuestionComponentProps {
    title?: string;
    description?: string;
}

const QuestionComponent = (props: QuestionComponentProps) => {

    const {title, description} = props;

    return (
        <div className={'question-component'}>
            <div className={'question-title'}>{title}</div>
            <div className={'question-description'}>{description}</div>
        </div>
    );

};

export default QuestionComponent;