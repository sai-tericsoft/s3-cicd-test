import "./ClientEditScreen.scss";
import {useParams} from "react-router-dom";

interface ClientEditScreenProps {

}

const ClientEditScreen = (props: ClientEditScreenProps) => {

    const {clientId} = useParams();

    return (
        <div className={'client-edit-screen'}>
            <div>ClientEditScreen</div>
        </div>
    );

};

export default ClientEditScreen;