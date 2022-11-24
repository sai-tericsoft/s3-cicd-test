import "./StatusComponentComponent.scss";

interface StatusComponentComponentProps {
    title: string;
}

const StatusComponentComponent = (props: StatusComponentComponentProps) => {

    const { title } = props;

    return (
        <div className={'status-component-component'}>
            <h2>{title}</h2>
        </div>
    );

};

export default StatusComponentComponent;