import "./MedicalRecordListScreen.scss";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {IRootReducerState} from "../../../store/reducers";
import {getClientBasicDetails,} from "../../../store/actions/client.action";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {CommonService} from "../../../shared/services";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import ClientBasicDetailsCardComponent from "../../clients/client-basic-details-card/ClientBasicDetailsCardComponent";
import {IClientBasicDetails, IClientMedicalStatusFilterState} from "../../../shared/models/client.model";
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
            render: ( item: any) => {
                return <span className={`medical-record-alert ${item?.alert_type}`}>
                    {
                        (item?.alert_type === "high" || item?.alert_type === "medium") && <ImageConfig.AlertIcon/>
                    }
                </span>
            }
        },
        {
            title: "Date of Onset",
            key: "date_of_onset",
            dataIndex: "date_of_onset",
            width: 140,
            render: ( item: any) => {
                return <>{CommonService.convertDateFormat2(item?.onset_date)}</>
            }
        },
        {
            title: "Body Part",
            key: "body_part",
            dataIndex: "body_part",
            width: 120,
            align:'center',
            render: ( item: any) => {
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
            dataIndex: "body_side",
            width: 110,
            align:'center',
            render: ( item: any) => {
                return <>{item?.injury_details[0]?.body_side || "N/A"}</>
            }
        },
        {
            title: "Current Status",
            dataIndex: "status",
            key: "status",
            width: 155,
            align:'center',
            render: ( item: any) => {
                return <ChipComponent label={item?.status}
                                      className={item?.status === 'Open/Active' ? "active" : "inactive"}></ChipComponent>
            }
        },
        {
            title: "Last Provider",
            key: "last_provider",
            dataIndex: "last_provider",
            align:'center',
            width: 140,
        },
        {
            title: "",
            dataIndex: "actions",
            key: "actions",
            width: 120,
            fixed: "right",
            render: ( item: IClientBasicDetails) => {
                if (item?._id) {
                    return <LinkComponent route={CommonService._routeConfig.ClientMedicalRecordDetails(item?._id)}>
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
    const [caseStatusFilterState, setCaseStatusFilterState] = useState<IClientMedicalStatusFilterState>({
        status: undefined,
    })

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
            navigate(CommonService._routeConfig.ClientSearch());
        }));
    }, [navigate, dispatch]);

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
                                                                     setCaseStatusFilterState({
                                                                         ...caseStatusList,
                                                                         status: value
                                                                     })
                                                                 }}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <LinkComponent route={CommonService._routeConfig.AddMedicalRecord(clientId)}>
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
                                            extraPayload={caseStatusFilterState}
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
