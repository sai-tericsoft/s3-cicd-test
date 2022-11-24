import "./BasicDetailsCardComponent.scss";
import AvatarComponent from "../avatar/AvatarComponent";
import ChipComponent from "../chip/ChipComponent";

interface BasicDetailsCardComponentProps {
    title?: string;
    avatarUrl?: string;
    status?: boolean;
    subTitle?: string;
    actions?: React.ReactNode;
}

const BasicDetailsCardComponent = (props: BasicDetailsCardComponentProps) => {

    const {title, avatarUrl, subTitle, status, actions} = props;

    return (
        <div className={'basic-details-card-component'}>
            <div className="basic-details-card">
                <div className="basic-details-card-avatar">
                    <AvatarComponent
                        size={"xl"}
                        url={avatarUrl}
                        title={title}/>
                </div>
                <div className="basic-details-card-meta">
                    <div className="basic-details-card-name-status">
                        <div className="basic-details-card-name">{title}</div>
                        <div
                            className="basic-details-card-status">
                            <ChipComponent label={status ? "Active" : "Inactive"} color={status ? "success" : "error"}/>
                        </div>
                    </div>
                    <div className="basic-details-card-description">
                        {subTitle || "-"}
                    </div>
                </div>
                <div className="basic-details-card-actions">
                    {actions}
                </div>
            </div>
        </div>
    );

};

export default BasicDetailsCardComponent;