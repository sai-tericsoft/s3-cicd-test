import "./MedicalInterventionListComponent.scss";
import {ImageConfig, Misc} from "../../../constants";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import {useNavigate, useParams} from "react-router-dom";
import {CommonService} from "../../../shared/services";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {useCallback, useEffect, useState} from "react";
import {IAPIResponseType} from "../../../shared/models/api.model";
import moment from "moment";
import {useDispatch, useSelector} from "react-redux";
import {getMedicalInterventionList} from "../../../store/actions/chart-notes.action";
import {IRootReducerState} from "../../../store/reducers";
import TableComponent from "../../../shared/components/table/TableComponent";

interface ClientMedicalRecordsComponentProps {

}

const MedicalInterventionListComponent = (props: ClientMedicalRecordsComponentProps) => {

    const {medicalRecordId} = useParams();
    const dispatch = useDispatch();
    const {
        medicalInterventionList,
        isMedicalInterventionListLoading,
    } = useSelector((state: IRootReducerState) => state.chartNotes);

    const MedicalInterventionListColumns: any = [
        {
            title: '',
            key: "flag",
            dataIndex: 'is_flagged',
            width: 35,
            fixed: 'left',
            render: (item: any) => {
                return <div className={'flag-wrapper'}>{item?.is_flagged && <ImageConfig.FlagIcon/>}</div>
            }
        },
        {
            title: 'Date of Intervention',
            key: 'date_of_intervention',
            dataIndex: 'intervention_date',
            width: 160,
            align: 'center',
            fixed: 'left',
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
                    } else if (item?.note_type?.toLowerCase() === "progress report") {
                        route = CommonService._routeConfig.MedicalRecordProgressReportViewDetails(medicalRecordId, item?._id);
                    } else {
                    }
                    return <LinkComponent route={route}>
                        {item?.created_at ? CommonService.getSystemFormatTimeStamp(item?.created_at) : "N/A"}
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
        },
        {
            title: 'Last Updated',
            key: 'last_updated',
            dataIndex: 'updated_at',
            align: 'center',
            width: 170,
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
            render: (item: any) => {
                return <ChipComponent label={item?.status}
                                      className={item?.status === 'completed' ? "completed" : "draft"}/>
            }
        },
        {
            title: 'Posted By',
            key: 'name',
            dataIndex: 'name',
            align: 'center',
            width: 125,
            render: (item: any) => {
                return (item?.posted_by?.first_name + " " + item?.posted_by?.last_name)
            }
        },
        {
            title: '',
            key: 'actions',
            width: 130,
            fixed: 'right',
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
                    } else if (item?.note_type?.toLowerCase() === "progress report") {
                        route = CommonService._routeConfig.MedicalRecordProgressReportViewDetails(medicalRecordId, item?._id);
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
            <TableComponent data={medicalInterventionList} columns={MedicalInterventionListColumns}
                            loading={isMedicalInterventionListLoading}/>
        </div>
    );

};

export default MedicalInterventionListComponent;
