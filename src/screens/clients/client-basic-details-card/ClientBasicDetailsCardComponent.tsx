import "./ClientBasicDetailsCardComponent.scss";
import AvatarComponent from "../../../shared/components/avatar/AvatarComponent";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import {IClientBasicDetails} from "../../../shared/models/client.model";
import {CommonService} from "../../../shared/services";

interface ClientBasicDetailsCardComponentProps {
    clientBasicDetails: IClientBasicDetails;
}


const ClientBasicDetailsCardComponent = (props: ClientBasicDetailsCardComponentProps) => {


    const {clientBasicDetails} = props;

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
                    <div className={'dashed-border'}/>
                    <div className={'client-id-age-wrapper'}>
                        <DataLabelValueComponent label={'Client ID'}>
                            {clientBasicDetails?.client_id}
                        </DataLabelValueComponent>
                        <DataLabelValueComponent label={'Age'}>
                            {CommonService.getTheDifferenceBetweenDates(clientBasicDetails?.dob)}
                        </DataLabelValueComponent>
                    </div>
                </div>

            </div>
        </div>
            );

};

  export default ClientBasicDetailsCardComponent;