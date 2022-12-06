import "./StatusCardComponent.scss";

interface StatusCardComponentProps {
    title: string;
}

const StatusCardComponent = (props: StatusCardComponentProps) => {

    const {title} = props;

    return (
        <div className={'status-card-component'}>
            <h2>{title}</h2>
        </div>
    );

};

export default StatusCardComponent;