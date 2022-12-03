import "./ClientDetailsScreen.scss";
import {useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useCallback, useEffect, useState} from "react";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {IClientBasicDetails, IClientMedicalDetails} from "../../../shared/models/client.model";
import ClientBasicDetailsComponent from "../client-basic-details/ClientBasicDetailsComponent";
import ClientBasicDetailsCardComponent
    from "../../admin/client/client-basic-details-card/ClientBasicDetailsCardComponent";
import ClientMedicalDetailsComponent from "../client-medical-details/ClientMedicalDetailsComponent";

interface ClientDetailsScreenProps {

}

const ClientDetailsScreen = (props: ClientDetailsScreenProps) => {

    const {clientId} = useParams();
    const dispatch = useDispatch();
    const [clientDetails, setClientDetails] = useState<IClientBasicDetails | undefined | any>(undefined);
    const [isClientDetailsLoading, setIsClientDetailsLoading] = useState<boolean>(false);
    const [isClientDetailsLoaded, setIsClientDetailsLoaded] = useState<boolean>(false);
    const [isClientDetailsLoadingFailed, setIsClientDetailsLoadingFailed] = useState<boolean>(false);

    const [clientMedicalDetails, setClientMedicalDetails] = useState<IClientMedicalDetails | undefined | any>(undefined);
    const [isClientMedicalDetailsLoading, setIsClientMedicalDetailsLoading] = useState<boolean>(false);
    const [isClientMedicalDetailsLoaded, setIsClientMedicalDetailsLoaded] = useState<boolean>(false);
    const [isClientMedicalDetailsLoadingFailed, setIsClientMedicalDetailsLoadingFailed] = useState<boolean>(false);


    const fetchClientDetails = useCallback((clientId: string) => {
        setIsClientDetailsLoading(true);
        CommonService._client.ClientDetailsAPICall(clientId, {})
            .then((response: IAPIResponseType<IClientBasicDetails>) => {
                setClientDetails(response.data);
                setIsClientDetailsLoading(false);
                setIsClientDetailsLoaded(true);
                setIsClientDetailsLoadingFailed(false);
            })
            .catch((error: any) => {
                setIsClientDetailsLoading(false);
                setIsClientDetailsLoaded(false);
                setIsClientDetailsLoadingFailed(true);
            })
    }, []);

    const fetchClientMedicalDetails = useCallback((clientId: string) => {
        setIsClientMedicalDetailsLoading(true);
        CommonService._client.ClientMedicalDetailsApiCall(clientId, {})
            .then((response: IAPIResponseType<IClientMedicalDetails>) => {
                setClientMedicalDetails(response.data);
                setIsClientMedicalDetailsLoading(false);
                setIsClientMedicalDetailsLoaded(true);
                setIsClientMedicalDetailsLoadingFailed(false);
            })
            .catch((error: any) => {
                setIsClientMedicalDetailsLoading(false);
                setIsClientMedicalDetailsLoaded(false);
                setIsClientMedicalDetailsLoadingFailed(true);
            })
    }, []);

    useEffect(() => {
        if (clientId) {
            fetchClientDetails(clientId);
            fetchClientMedicalDetails(clientId);
        }
    }, [clientId, fetchClientDetails, fetchClientMedicalDetails]);

    useEffect(() => {
        dispatch(setCurrentNavParams(clientDetails?.name || "Client Details", null, true));
    }, [clientDetails, dispatch]);

    return (
        <>

        <div className={'client-details-screen'}>

            {
                isClientDetailsLoading && <div>Loading</div>
            }
            {
                isClientDetailsLoadingFailed && <div>Loading Failed</div>
            }
            {

                isClientDetailsLoaded && <>
                    <ClientMedicalDetailsComponent clientMedicalDetails={clientMedicalDetails}/>
                    <ClientBasicDetailsCardComponent clientBasicDetails={clientDetails}/>
                    <ClientBasicDetailsComponent clientBasicDetails={clientDetails}/>
                </>
            }
        </div>
        </>
    );

};

export default ClientDetailsScreen;