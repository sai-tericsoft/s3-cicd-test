import "./MedicalInterventionListComponent.scss";
import {APIConfig, ImageConfig} from "../../../constants";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import {useParams} from "react-router-dom";
import {CommonService} from "../../../shared/services";
import {useCallback, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {getMedicalInterventionList} from "../../../store/actions/chart-notes.action";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";

interface ClientMedicalRecordsComponentProps {
    referrer?: any;
    refreshToken?: any;
}

const MedicalInterventionListComponent = (props: ClientMedicalRecordsComponentProps) => {
    const {referrer, refreshToken} = props
    const {medicalRecordId} = useParams();
    const dispatch = useDispatch();
    // const {
    //     medicalInterventionList,
    //     isMedicalInterventionListLoading,
    // } = useSelector((state: IRootReducerState) => state.chartNotes);

    const [medicalRecordListFilterState, setMedicalRecordListFilterState] = useState<any>({
        sort: {}
    });

    const handleClientMedicalListSort = useCallback((key: string, order: string) => {
        setMedicalRecordListFilterState((oldState: any) => {
            const newState = {...oldState};
            newState["sort"] = {
                key,
                order
            }
            return newState;
        });
    }, []);

    const MedicalInterventionListColumns: any = [
        {
            title: '',
            key: "flag",
            dataIndex: 'is_flagged',
            width: 55,
            fixed: 'left',
            render: (item: any) => {
                return <div className={'flag-wrapper'}>{item?.is_flagged && <ImageConfig.FlagIcon/>}</div>
            }
        },
        {
            title: 'Date of Intervention',
            key: 'record_date',
            dataIndex: 'record_date',
            width: 200,
            align: 'left',
            fixed: 'left',
            sortable: true,
            render: (item: any) => {
                let route = '';
                if (medicalRecordId) {
                    if (item?.note_type?.toLowerCase() === 'exercise log') {
                        route = CommonService._routeConfig.MedicalInterventionExerciseLogView(medicalRecordId, item?.intervention_id);
                    } else if (["soap note", "discharge summary"].includes(item?.note_type?.toLowerCase())) {
                        if (item?.status?.toLowerCase() === 'completed') {
                            route = CommonService._routeConfig.ViewMedicalIntervention(medicalRecordId, item?._id);
                        } else {
                            route = CommonService._routeConfig.UpdateMedicalIntervention(medicalRecordId, item?._id);
                        }
                    } else if (item?.note_type?.toLowerCase() === 'surgery record') {
                        route = CommonService._routeConfig.MedicalRecordSurgeryRecordDetails(medicalRecordId, item._id) + '?referrer=' + referrer;
                    } else if (item?.note_type?.toLowerCase() === "progress report") {
                        route = CommonService._routeConfig.MedicalRecordProgressReportViewDetails(medicalRecordId, item?._id);
                    } else {
                    }
                    return <LinkComponent route={route}>
                        {item?.intervention_date ? CommonService.getSystemFormatTimeStamp(item?.intervention_date) : "N/A"}
                    </LinkComponent>
                }
            }
        },
        {
            title: 'Note Type',
            key: 'note_type',
            width: 150,
            align: 'center',
            dataIndex: 'note_type',
            // sortable: true,
        },
        {
            title: 'Exercise Log',
            key: 'exercise_log',
            width: 150,
            align: 'center',
            dataIndex: 'is_exercise_log_added',
            render: (item: any) => {
                return <>
                    {medicalRecordId && item?.is_exercise_log_added && <LinkComponent
                        route={CommonService._routeConfig.MedicalInterventionExerciseLogView(medicalRecordId, item?._id)}>
                        View Log
                    </LinkComponent>
                    }
                    {
                        medicalRecordId && !item?.is_exercise_log_added && <div>N/A</div>
                    }
                </>
            }

        },
        {
            title: 'Last Updated',
            key: 'last_updated',
            dataIndex: 'updated_at',
            align: 'center',
            width: 170,
            sortable: true,
            render: (item: any) => {
                return <>{CommonService.transformTimeStamp(item?.updated_at)}</>
            }
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            align: 'center',
            width: 110,
            sortable: true,
            render: (item: any) => {
                return <ChipComponent label={item?.status}
                                      className={item?.status === 'completed' ? "completed" : "draft"}/>
            }
        },
        {
            title: 'Posted By',
            key: 'posted_by',
            dataIndex: 'name',
            width: 125,
            sortable: true,
            render: (item: any) => {
                return (CommonService.capitalizeFirstLetter(item?.posted_by?.first_name) + " " + CommonService.capitalizeFirstLetter(item?.posted_by?.last_name))
            }
        },
        {
            title: '',
            key: 'actions',
            width: 120,
            fixed: 'right',
            render: (item: any) => {
                let route = '';
                if (medicalRecordId) {
                    if (item?.note_type?.toLowerCase() === 'exercise log') {
                        route = CommonService._routeConfig.MedicalInterventionExerciseLogView(medicalRecordId, item?.intervention_id) + '?referrer=' + referrer;
                    } else if (["soap note", "discharge summary"].includes(item?.note_type?.toLowerCase())) {
                        if (item?.status?.toLowerCase() === 'completed') {
                            route = CommonService._routeConfig.ViewMedicalIntervention(medicalRecordId, item?._id) + '?referrer=' + referrer;
                        } else {
                            route = CommonService._routeConfig.UpdateMedicalIntervention(medicalRecordId, item?._id) + '?referrer=' + referrer;
                        }
                    } else {
                    }
                    return <LinkComponent route={route}>
                        {
                            route ? "View Details" : "Coming soon"
                        }
                    </LinkComponent>
                }
            }
        }
    ];

    useEffect(() => {
        if (medicalRecordId) {
            dispatch(getMedicalInterventionList(medicalRecordId));
        }
    }, [dispatch, medicalRecordId]);

    return (
        <div className={'client-medical-records-component'}>
            {/*<TableComponent data={medicalInterventionList}*/}
            {/*                columns={MedicalInterventionListColumns}*/}
            {/*                onSort={handleClientMedicalListSort}*/}
            {/*                loading={isMedicalInterventionListLoading}/>*/}
            <TableWrapperComponent
                url={APIConfig.MEDICAL_RECORD_CONSOLIDATED_INTERVENTIONS_AND_ATTACHMENTS.URL(medicalRecordId)}
                method={APIConfig.MEDICAL_RECORD_CONSOLIDATED_INTERVENTIONS_AND_ATTACHMENTS.METHOD}
                columns={MedicalInterventionListColumns}
                refreshToken={refreshToken}
                onSort={handleClientMedicalListSort}
                extraPayload={medicalRecordListFilterState}
            />
        </div>
    );

};

export default MedicalInterventionListComponent;
