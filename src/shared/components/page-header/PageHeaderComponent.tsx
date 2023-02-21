import "./PageHeaderComponent.scss";

interface PageHeaderComponentProps {
    title: string;
    actions?: any;
    className?: any;
}

const PageHeaderComponent = (props: PageHeaderComponentProps) => {

    const {title, actions,className} = props;

    return (
        <div className={`page-header-component ${className}`}>
            <div className="page-header-title">
                {title}
            </div>
            {
                actions && <div className="page-header-actions">
                    {actions}
                </div>
            }
        </div>
    );

};

export default PageHeaderComponent;
