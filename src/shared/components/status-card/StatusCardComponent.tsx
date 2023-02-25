import "./StatusCardComponent.scss";
import React from "react";

interface StatusCardComponentProps {
    title?: string;
    className?: string;
}

const StatusCardComponent = (props: React.PropsWithChildren<StatusCardComponentProps>) => {

    const {title, className, children} = props;

    return (
        <div className={`status-card-component ${className}`}>
            <h2 className={'status-card-title'}>{title}</h2>
            <div className="status-card-meta">
                {children}
            </div>
        </div>
    );

};

export default StatusCardComponent;
