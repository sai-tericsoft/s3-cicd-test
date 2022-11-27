import React from "react";

interface CardComponentProps {
    title?: string;
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
    actions?: React.ReactNode;
}

const CardComponent = (props: React.PropsWithChildren<CardComponentProps>) => {

    const {title, actions, className, children} = props;
    const size = props.size || "lg";

    return (
        <div className={`card-component ${className} ${size}`}>
            {title && <div className="card-header">
                <div className="card-title">
                    {title}
                </div>
                {
                    actions && <div className="card-actions">
                        {actions}
                    </div>
                }
            </div>}
            <div className="card-body">
                {children}
            </div>
        </div>
    );

};

export default CardComponent;