interface CardComponentProps {
    title?: string;
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
}

const CardComponent = (props: React.PropsWithChildren<CardComponentProps>) => {

    const {title, className, children} = props;
    const size = props.size || "lg";

    return (
        <div className={`card-component ${className} ${size}`}>
            {title && <div className="card-header">
                <div className="card-title">
                    {title}
                </div>
            </div>}
            <div className="card-body">
                {children}
            </div>
        </div>
    );

};

export default CardComponent;