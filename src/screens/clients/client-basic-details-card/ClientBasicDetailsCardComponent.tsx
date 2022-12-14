import "./ClientBasicDetailsCardComponent.scss";
import AvatarComponent from "../../../shared/components/avatar/AvatarComponent";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import {IClientBasicDetails} from "../../../shared/models/client.model";
import {CommonService} from "../../../shared/services";
import {Link} from "react-router-dom";

interface ClientBasicDetailsCardComponentProps {
    clientBasicDetails: IClientBasicDetails;
    viewDetails?:boolean;
}


const ClientBasicDetailsCardComponent = (props: ClientBasicDetailsCardComponentProps) => {


    const {clientBasicDetails,viewDetails} = props;

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
                    <div className={`client-status ${clientBasicDetails?.is_active ? "success" : "error" }`}>
                        {clientBasicDetails?.is_active ? 'Active' : 'Inactive'}
                    </div>
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
                        viewDetails && <>
                            <div className={'dashed-border'}/>
                        <div className={'client-details-info-wrapper'}>
                            <Link className={'client-details'} to={CommonService._routeConfig.ComingSoonRoute()}>
                                    View Details
                                </Link>
                        </div>
                        </>
                    }
                </div>

            </div>
        </div>
            );

};

  export default ClientBasicDetailsCardComponent;