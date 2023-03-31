import "./StatusCardComponent.scss";
import React from "react";

interface StatusCardComponentProps {
    title?: string;
    className?: string;
    id?: string;
}

const StatusCardComponent = (props: React.PropsWithChildren<StatusCardComponentProps>) => {

    const {title, className, children, id} = props;

    return (
        <div className={`status-card-component ${className}`}>
            <h2 id={id} className={'status-card-title'}>{title}</h2>
            <div className="status-card-meta">
                {children}
            </div>
        </div>
    );

};

export default StatusCardComponent;
