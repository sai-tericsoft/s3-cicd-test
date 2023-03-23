import "./ClientDetailsScreen.scss";
import {Outlet, useLocation, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import {CommonService} from "../../../shared/services";
import {IRootReducerState} from "../../../store/reducers";
import SubMenuListComponent from "../../../shared/components/sub-menu-list/SubMenuListComponent";
import ClientBasicDetailsCardComponent from "../client-basic-details-card/ClientBasicDetailsCardComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import {
    getClientBasicDetails,
} from "../../../store/actions/client.action";

interface ClientDetailsScreenProps {

}


const ClientDetailsScreen = (props: ClientDetailsScreenProps) => {

    const {clientId} = useParams();
    const dispatch = useDispatch();

    const CLIENT_MENU_ITEMS = [
        {
            title: "Client Profile",
            path: clientId ? CommonService._routeConfig.ClientProfileDetails(clientId) : ""
        },
        {
            title: "Chart Notes",
            path: clientId ? CommonService._routeConfig.MedicalRecordList(clientId) : ""
        },
        {
            title: "Documents",
            path: ""
        },
        {
            title: "Insurance",
            path: ""
        },
        {
            title: "Appointments",
            path: ""
        },
        {
            title: "Billing",
            path: ""
        }
    ];

    const location: any = useLocation();
    const title = (location.state && location.state.title) ? location.state.title : CLIENT_MENU_ITEMS[0].title;

    const {
        isClientBasicDetailsLoaded,
        isClientBasicDetailsLoading,
        isClientBasicDetailsLoadingFailed,
        clientBasicDetails,
    } = useSelector((state: IRootReducerState) => state.client);

    useEffect(() => {
        if (clientId) {
            dispatch(getClientBasicDetails(clientId));
        }
    }, [clientId, dispatch]);


    return (
        <>
            <div className={'client-details-screen'}>
                <>
                    {
                        !clientId && <StatusCardComponent title={"Client ID missing. cannot fetch details"}/>
                    }
                </>

                <>
                    {
                        clientId && <>
                            {
                                isClientBasicDetailsLoading && <div>
                                    <LoaderComponent/>
                                </div>
                            }
                            {
                                isClientBasicDetailsLoadingFailed &&
                                <StatusCardComponent title={"Failed to fetch client Details"}/>
                            }
                            {
                                (isClientBasicDetailsLoaded && clientBasicDetails) && <>

                                    <div className={'client-details-layout'}>
                                        <div className={"client-details-left-bar"}>
                                            <div className={"client-details-title"}>
                                                {title}
                                            </div>
                                            <div className={"client-details-basic-card-holder"}>
                                                <ClientBasicDetailsCardComponent
                                                    clientBasicDetails={clientBasicDetails}/>
                                            </div>
                                            <div className={"client-details-sub-menu-holder"}>
                                                <SubMenuListComponent menuItems={CLIENT_MENU_ITEMS}/>
                                            </div>
                                        </div>
                                        <div className="admin-module-content-wrapper client-details-content-wrapper">
                                            <Outlet/>
                                        </div>
                                    </div>
                                </>
                            }
                        </>
                    }
                </>
            </div>
        </>
    );

};

export default ClientDetailsScreen;
