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
import ToolTipComponent from "../../../shared/components/tool-tip/ToolTipComponent";

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
                        (item?.alert_type === "high" || item?.alert_type === "medium") &&
                        <ToolTipComponent
                            showArrow={true}
                            position={"right"}
                            // tooltip={`Within ${item.diff_days} days, this medical record will reach its 90-day deadline date.`}>
                            tooltip={<div>Within <b> {item.diff_days} days</b>, this medical record will reach its
                                90-day deadline date.</div>}>
                            <ImageConfig.AlertIcon/>
                        </ToolTipComponent>
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
            width: 183,
            render: (item: any) => {
                return <>{item?.injury_details?.length > 1 ?
                    <ToolTipComponent
                        showArrow={true}
                        position={"right"}
                        tooltip={item?.injury_details?.map((injury: any) => <div className={'mrg-bottom-5'}>{injury?.body_part_details?.name}</div>)}
                    >
                       <div> {item?.injury_details[0]?.body_part_details?.name} (+{item?.injury_details?.length})</div>
                    </ToolTipComponent> : <>{item?.injury_details[0]?.body_part_details?.name}</>}
                </>

            }
        },
        {
            title: "Body Side",
            key: "body_side",
            align: 'center',
            dataIndex: "body_side",
            width: 90,
            render: (item: any) => {
                return <>{item?.injury_details[0]?.body_side || "N/A"}</>
            }
        },
        {
            title: "Case Status",
            dataIndex: "status",
            key: "status",
            align: 'center',
            width: 175,
            sortable: true,
            render: (item: any) => {
                return <ChipComponent label={item?.status}
                                      className={item?.status === 'Open - Unresolved' ? "active" : "inactive"}></ChipComponent>
            }
        },
        {
            title: "Last Provider",
            key: "last_provider",
            dataIndex: "last_provider",
            align: "left",
            width: 140,
            sortable: true,
            render: (item: IClientBasicDetails) => {
                return <span>
                    {CommonService.capitalizeFirstLetter(item?.last_provider_details?.first_name) || '-'} {CommonService.capitalizeFirstLetter(item?.last_provider_details?.last_name)}
                </span>
            }
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
        status: "all",
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
                            (isClientBasicDetailsLoaded && clientBasicDetails) &&
                            <div className={'client-details-wrapper '}>
                                <div className="client-details-header">
                                    <div className="client-details-title">
                                        Medical Record List
                                    </div>
                                    <div className="client-details-filters-options">
                                        <div className="client-details-filters ts-row">
                                            <div className="ts-col-md-6 ts-col-lg-4 mrg-left-5">
                                                <SelectComponent options={caseStatusList}
                                                                 label={'Status'}
                                                                 fullWidth={true}
                                                                 value={medicalRecordListStatusDateAndProviderFilterState?.status}
                                                                 keyExtractor={(item) => item.code}
                                                                 size={'small'}
                                                                 onUpdate={(value) => {
                                                                     delete medicalRecordListStatusDateAndProviderFilterState.status;
                                                                     setMedicalRecordListStatusDateAndProviderFilterState({
                                                                         ...medicalRecordListStatusDateAndProviderFilterState,
                                                                         ...(value !== '' ? {status: value} : {})
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
                                        <TableWrapperComponent url={APIConfig.CLIENT_MEDICAL_INFO.URL(clientId)}
                                                               method={APIConfig.CLIENT_MEDICAL_INFO.METHOD}
                                                               extraPayload={medicalRecordListStatusDateAndProviderFilterState}
                                                               onSort={handleClientMedicalListSort}
                                                               noDataText={(medicalRecordListStatusDateAndProviderFilterState?.status === "open" || medicalRecordListStatusDateAndProviderFilterState?.status === "closed") ? " No medical record was found for the applied status filter." : "No medical records available."}
                                                               columns={MedicalRecordListTableColumns}/>
                                    </div>
                                </div>
                            </div>
                        }
                    </>
                }
            </>
        </div>
    );
};

export default MedicalRecordListScreen;
