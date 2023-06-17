import "./BasicDetailsCardComponent.scss";
import AvatarComponent from "../avatar/AvatarComponent";
import ChipComponent from "../chip/ChipComponent";

interface BasicDetailsCardComponentProps {
    legend?: string;
    title?: string;
    avatarUrl?: string;
    status?: boolean;
    subTitle?: string;
    actions?: React.ReactNode;
}

const BasicDetailsCardComponent = (props: BasicDetailsCardComponentProps) => {

    const {legend, title, avatarUrl, subTitle, status, actions} = props;

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
                    <div className="basic-details-card-legend-name-status">
                        {legend && <div className="basic-details-card-legend" id={"card-legend"}>{legend}</div>}
                        <div className="basic-details-card-name-status">
                            <div className="basic-details-card-name" id={"card-title"}>{title}</div>
                            <div
                                className="basic-details-card-status" id={"card-status"}>
                                <ChipComponent label={status ? "Active" : "Inactive"} className={status ? "active" : "inactive"}/>
                            </div>
                        </div>
                    </div>
                    <div className="basic-details-card-description" id={"card-sub-title"}>
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