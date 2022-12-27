import "./ClientBasicDetailsComponent.scss";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import {IRootReducerState} from "../../../store/reducers";
import {getClientBasicDetails,} from "../../../store/actions/client.action";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {CommonService} from "../../../shared/services";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import ClientBasicDetailsCardComponent from "../../clients/client-basic-details-card/ClientBasicDetailsCardComponent";
import {IClientBasicDetails} from "../../../shared/models/client.model";
import {ITableColumn} from "../../../shared/models/table.model";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";
import {APIConfig, ImageConfig} from "../../../constants";

interface ClientBasicDetailsComponentProps {

}

const ClientBasicDetailsComponent = (props: ClientBasicDetailsComponentProps) => {

    const ClientListTableColumns: ITableColumn[] = [
        {
            title: '',
            key: 'alert_icon',
            width: '5%',
            render: (re_: any, item: any) => {
                return <>
                    {item.alert_type === "high" && <ImageConfig.RedAlertIcon/>}
                    {item.alert_type === "medium" && <ImageConfig.YellowAlertIcon/>}
                </>
            }
        },
        {
            title: "Date of Onset",
            key: "date_of_onset",
            dataIndex: "date_of_onset",
            width: "15%",
            fixed: "left",
            render: (_: any, item: any) => {
                return <>{CommonService.convertDateFormat2(item.date_of_onset)}</>
            }
        },
        {
            title: "Body Part",
            key: "body part",
            dataIndex: "body_part",
            width: "13%",

            render: (_: any, item: any) => {
                return <>{item.injury_details.map((e: any) => {
                    return <>{e.body_part_id?.name}</>
                })}{item.injury_details.length > 1 && "(+" + item.injury_details.length + ")"}</>

            }
        },
        {
            title: "Body Side",
            key: "body_side",
            dataIndex: "body_side",
            width: "15%",
            render: (_: any, item: any) => {
                return <>{item.injury_details.map((e: any) => {
                    return <>{e.body_side}</>
                })}</>
            }
        },
        {
            title: "Current Case Status",
            dataIndex: "status",
            key: "status",
            width: "20%",
            render: (_: any, item: any) => {
                return <ChipComponent label={item?.status}
                                      className={item?.status === 'Open/Active' ? "active" : "inactive"}></ChipComponent>
            }
        },
        {
            title: "Last Provider",
            key: "last_provider",
            dataIndex: "last_provider",
            width: "15%",
        },
        {
            title: "",
            dataIndex: "actions",
            key: "actions",
            width: "12%",
            fixed: "right",
            render: (_: any, item: IClientBasicDetails) => {
                if (item?._id) {
                    return <LinkComponent route={CommonService._routeConfig.ComingSoonRoute()}>
                        View Details
                    </LinkComponent>
                }
            }
        }
    ];
    const {clientId} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
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

    useEffect(() => {
        dispatch(setCurrentNavParams("Chart Notes", null, () => {
            navigate(CommonService._routeConfig.ComingSoonRoute());
        }));
    }, [navigate, dispatch]);
    return (
        <div className={'client-basic-details-component'}>
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
                                <div className="client-details-header">
                                    <div className={"client-details-title"}>
                                        Medical Records
                                    </div>
                                </div>
                                <div className={"client-details-layout"}>
                                    <div className={"client-details-basic-card-holder"}>
                                        <ClientBasicDetailsCardComponent
                                            clientBasicDetails={clientBasicDetails} viewDetails={true}/>
                                    </div>

                                    <div className="client-details-tab-wrapper">
                                        <TableWrapperComponent
                                            url={APIConfig.CLIENT_MEDICAL_INFO.URL(clientId)}
                                            method={APIConfig.CLIENT_MEDICAL_INFO.METHOD}
                                            columns={ClientListTableColumns}
                                        />
                                    </div>
                                </div>
                            </>
                        }
                    </>
                }
            </>
        </div>
    );
};

export default ClientBasicDetailsComponent;