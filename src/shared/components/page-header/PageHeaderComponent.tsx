import "./PageHeaderComponent.scss";

interface PageHeaderComponentProps {
    title: string;
    actions?: any;
}

const PageHeaderComponent = (props: PageHeaderComponentProps) => {

    const {title, actions} = props;

    return (
        <div className={'page-header-component'}>
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
