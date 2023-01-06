import React from "react";

interface CardComponentProps {
    title?: string;
    color?: 'default' | 'primary' | 'error';
    description?: string;
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
    actions?: React.ReactNode;
}

const CardComponent = (props: React.PropsWithChildren<CardComponentProps>) => {

    const {title, description, actions, className, children} = props;
    const size = props.size || "lg";
    const color = props.color || 'default';

    return (
        <div className={`card-component ${className} ${size} ${color}`}>
            {(title || actions) && <div className="card-header">
                <div className="card-title-description-wrapper">
                    <div className="card-title">
                        {title}
                    </div>
                    {description && <div className="card-description">
                        {description}
                    </div>}
                </div>
                {
                    actions && <div className="card-actions">
                        {actions}
                    </div>
                }
            </div>}
            {
                children && <div className="card-body">
                    {children}
                </div>
            }
        </div>
    );

};

export default CardComponent;
