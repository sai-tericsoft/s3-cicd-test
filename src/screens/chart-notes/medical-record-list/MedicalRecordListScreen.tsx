import "./MedicalRecordListScreen.scss";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import React, {useCallback, useEffect, useState} from "react";
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
import SelectComponent from "../../../shared/components/form-controls/select/SelectComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";

interface ClientBasicDetailsComponentProps {

}

const MedicalRecordListScreen = (props: ClientBasicDetailsComponentProps) => {

    const MedicalRecordListTableColumns: ITableColumn[] = [
        {
            title: '',
            key: 'alert_icon',
            fixed: "left",
            width: 50,
            render: (item: any) => {
                return <span className={`medical-record-alert ${item?.alert_type}`}>
                    {
                        (item?.alert_type === "high" || item?.alert_type === "medium") && <ImageConfig.AlertIcon/>
                    }
                </span>
            }
        },
        {
            title: "Date of Onset",
            key: "onset_date",
            dataIndex: "onset_set",
            width: 150,
            fixed: "left",
            sortable: true,
            render: (item: any) => {
                if (item?._id) {
                    return <LinkComponent
                        route={CommonService._routeConfig.ClientMedicalRecordDetails(item?._id,)}>
                        {CommonService.convertDateFormat2(item?.onset_date)}
                    </LinkComponent>
                }
            }
        },
        {
            title: "Body Part",
            key: "body_part",
            align: 'center',
            dataIndex: "body_part",
            width: 200,
            render: (item: any) => {
                if (item?.injury_details?.length === 1) {
                    return <>{item?.injury_details[0]?.body_part_details?.name}</>
                } else {
                    return <>{item?.injury_details[0]?.body_part_details?.name} ( + {item?.injury_details?.length} )</>
                }
            }
        },
        {
            title: "Body Side",
            key: "body_side",
            align: 'center',
            dataIndex: "body_side",
            width: 110,
            render: (item: any) => {
                return <>{item?.injury_details[0]?.body_side || "N/A"}</>
            }
        },
        {
            title: "Current Status",
            dataIndex: "status",
            key: "status",
            align: 'center',
            width: 155,
            render: (item: any) => {
                return <ChipComponent label={item?.status}
                                      className={item?.status === 'Open - Unresolved' ? "active" : "inactive"}></ChipComponent>
            }
        },
        {
            title: "Last Provider",
            key: "last_provider",
            dataIndex: "last_provider",
            sortable: true,
            width: 140,
        },
        {
            title: "",
            dataIndex: "actions",
            key: "actions",
            width: 120,
            fixed: "right",
            render: (item: IClientBasicDetails) => {
                if (item?._id) {
                    return <LinkComponent
                        route={CommonService._routeConfig.ClientMedicalRecordDetails(item?._id) + '?referrer=' + referrer}>
                        View Details
                    </LinkComponent>
                }
            }
        }
    ];
    const {clientId} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {caseStatusList} = useSelector((state: IRootReducerState) => state.staticData);
    const [medicalRecordListStatusDateAndProviderFilterState, setMedicalRecordListStatusDateAndProviderFilterState] = useState<any>({
        status: undefined,
        sort: {}
    })
    const {
        isClientBasicDetailsLoaded,
        isClientBasicDetailsLoading,
        isClientBasicDetailsLoadingFailed,
        clientBasicDetails,
    } = useSelector((state: IRootReducerState) => state.client);
    const [searchParams] = useSearchParams();
    const referrer: any = searchParams.get("referrer");

    useEffect(() => {
        if (clientId) {
            dispatch(getClientBasicDetails(clientId));
        }
    }, [clientId, dispatch]);

    useEffect(() => {
        dispatch(setCurrentNavParams("Chart Notes", null, () => {
            if (referrer && referrer !== "undefined" && referrer !== "null") {
                navigate(referrer);
            } else {
                navigate(CommonService._routeConfig.ClientSearch());
            }
        }));
    }, [navigate, dispatch, searchParams, referrer]);

    const handleClientMedicalListSort = useCallback((key: string, order: string) => {
        setMedicalRecordListStatusDateAndProviderFilterState((oldState: any) => {
            const newState = {...oldState};
            newState["sort"] = {
                key,
                order
            }
            return newState;
        });
    }, []);

    return (
        <div className={'chart-notes-details-screen'}>
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
                                    <div className="client-details-title">
                                        Medical Record List
                                    </div>
                                    <div className="client-details-filters-options">
                                        <div className="client-details-filters ts-row">
                                            <div className="ts-col-md-6 ts-col-lg-3">
                                                <SelectComponent options={caseStatusList}
                                                                 label={'Status'}
                                                                 fullWidth={true}
                                                                 size={'small'}
                                                                 onUpdate={(value) => {
                                                                     setMedicalRecordListStatusDateAndProviderFilterState({
                                                                         ...caseStatusList,
                                                                         status: value
                                                                     })
                                                                 }}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <LinkComponent
                                                route={CommonService._routeConfig.AddMedicalRecord(clientId)}>
                                                <ButtonComponent
                                                    prefixIcon={<ImageConfig.AddIcon/>}
                                                >
                                                    Add Medical Record
                                                </ButtonComponent>
                                            </LinkComponent>
                                        </div>
                                    </div>
                                </div>
                                <div className={"client-details-layout"}>
                                    <div className={"client-details-basic-card-holder"}>
                                        <ClientBasicDetailsCardComponent
                                            clientBasicDetails={clientBasicDetails}
                                            showViewDetailsRedirection={true}
                                        />
                                    </div>

                                    <div className="client-details-tab-wrapper">
                                        <TableWrapperComponent
                                            url={APIConfig.CLIENT_MEDICAL_INFO.URL(clientId)}
                                            method={APIConfig.CLIENT_MEDICAL_INFO.METHOD}
                                            columns={MedicalRecordListTableColumns}
                                            extraPayload={medicalRecordListStatusDateAndProviderFilterState}
                                            onSort={handleClientMedicalListSort}
                                            id={"client_medical_records_list"}
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

export default MedicalRecordListScreen;
