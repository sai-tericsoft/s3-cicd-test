import "./PageHeaderComponent.scss";

interface PageHeaderComponentProps {
    title: string;
    actions?: any;
    className?: any;
    id?: string;
}

const PageHeaderComponent = (props: PageHeaderComponentProps) => {

    const {title, actions,className, id} = props;

    return (
        <div className={`page-header-component ${className}`}>
            <div id={id} className="page-header-title">
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
