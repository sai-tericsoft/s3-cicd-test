import "./ClientBasicDetailsCardComponent.scss";
import AvatarComponent from "../../../shared/components/avatar/AvatarComponent";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import {IClientBasicDetails} from "../../../shared/models/client.model";
import {CommonService} from "../../../shared/services";
import {Link, useLocation} from "react-router-dom";
import ChipComponent from "../../../shared/components/chip/ChipComponent";

interface ClientBasicDetailsCardComponentProps {
    clientBasicDetails: IClientBasicDetails;
    showViewDetailsRedirection?: boolean;
}


const ClientBasicDetailsCardComponent = (props: ClientBasicDetailsCardComponentProps) => {

    const {clientBasicDetails, showViewDetailsRedirection} = props;
    const location = useLocation();

    return (
        <div className={'client-basic-detail-card-wrapper'}>
            <div className={'client-basic-detail-card'}>
                <div className={'client-basic-detail-card-upper-portion'}>
                    <div className={'client-image-wrapper'}>
                        <AvatarComponent title={clientBasicDetails?.first_name + " " + clientBasicDetails?.last_name}/>
                    </div>
                </div>
                <div className={'client-details-wrapper'}>
                    <div className={'client-name'}>
                        {clientBasicDetails?.first_name} {clientBasicDetails?.last_name}
                    </div>
                    <ChipComponent label={clientBasicDetails?.is_active ? 'Active' : 'Inactive'} className={`client-status ${clientBasicDetails?.is_active ? "active" : "inactive"}`}/>
                    <div className={'dashed-border-wrapper'}>
                        <div className={'dashed-border'}/>
                    </div>
                    <div className={'client-id-age-wrapper'}>
                        <DataLabelValueComponent label={'Client ID'}>
                            {clientBasicDetails?.client_id}
                        </DataLabelValueComponent>
                        <DataLabelValueComponent label={'Age'}>
                            {CommonService.getTheDifferenceBetweenDates(clientBasicDetails?.dob)}
                        </DataLabelValueComponent>
                    </div>
                    {
                        (showViewDetailsRedirection && clientBasicDetails._id )&& <>
                            <div className={'dashed-border'}/>
                            <div className={'client-details-info-wrapper'}>
                                <Link className={'client-details-view-redirection-list'} to={CommonService._routeConfig.ClientDetails(clientBasicDetails._id) + '?referrer=' + location.pathname} >View Details</Link>
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    );

};

export default ClientBasicDetailsCardComponent;
