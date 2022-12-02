import "./ClientBasicDetailsComponent.scss";
import {IClientBasicDetails} from "../../../shared/models/client.model";

interface ClientBasicDetailsComponentProps {
    clientBasicDetails?: IClientBasicDetails;
}

const ClientBasicDetailsComponent = (props: ClientBasicDetailsComponentProps) => {

    const {clientBasicDetails} = props;

    return (
        <div className={'client-basic-details-component'}>
            <div>{clientBasicDetails?.nick_name}</div>
        </div>
    );

};

export default ClientBasicDetailsComponent;