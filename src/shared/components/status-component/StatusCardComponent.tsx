import "./StatusCardComponent.scss";

interface StatusCardComponent {
    title: string;
}

const StatusCardComponent = (props: StatusCardComponent) => {

    const {title} = props;

    return (
        <div className={'status-card-component'}>
            <h2>{title}</h2>
        </div>
    );

};

export default StatusCardComponent;