import "./ChartNotesActivityLogsComponent.scss";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import commonService from "../../../shared/services/common.service";
import {useNavigate, useParams} from "react-router-dom";
import {IClientActivityLog} from "../../../shared/models/client.model";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import ActivityLogTimelineComponent
    from "../../../shared/components/activity-log-timeline/ActivityLogTimelineComponent";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {CommonService} from "../../../shared/services";
import {useDispatch} from "react-redux";

interface ChartNotesActivityLogsComponentProps {

}
const ChartNotesActivityLogsComponent = (props: ChartNotesActivityLogsComponentProps) => {
    const {medicalRecordId} = useParams();
    const [medicalRecordActivityLogs, setMedicalRecordActivityLogs] = useState<IClientActivityLog[]>();
    const [medicalRecordActivityLogsLoading, setMedicalRecordActivityLogsLoading] = useState<boolean>();
    const [medicalRecordActivityLogsLoadingFailed, setMedicalRecordActivityLogsLoadingFailed] = useState<boolean>();
    const [medicalRecordActivityLogsLoaded, setMedicalRecordActivityLogsLoaded] = useState<boolean>();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (medicalRecordId) {
            dispatch(setCurrentNavParams("Medical Record details", null, () => {
                navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId));
            }));
        }
    }, [navigate, dispatch, medicalRecordId]);

    const getClientActivityLogs = useCallback((medicalRecordId: any) => {
        const payload = {}
        setMedicalRecordActivityLogsLoaded(false);
        setMedicalRecordActivityLogsLoading(true);
        setMedicalRecordActivityLogsLoadingFailed(false);
        commonService._chartNotes.getMedicalRecordActivityLogs(medicalRecordId, payload)
            .then((res: any) => {
                setMedicalRecordActivityLogsLoaded(true);
                setMedicalRecordActivityLogsLoading(false);
                setMedicalRecordActivityLogsLoadingFailed(false);
                setMedicalRecordActivityLogs(res?.data?.docs);
            })
            .catch((err: any) => {
                setMedicalRecordActivityLogsLoaded(true);
                setMedicalRecordActivityLogsLoading(false);
                setMedicalRecordActivityLogsLoadingFailed(true);
                commonService._alert.showToast(err?.error)
            })
    }, []);

    useEffect(() => {
        medicalRecordId && getClientActivityLogs(medicalRecordId);
    }, [getClientActivityLogs, medicalRecordId]);


    return (
        <div className={'chart-notes-activity-logs-component'}>
            <PageHeaderComponent title={"View Activity Log"}/>
            {
                medicalRecordActivityLogsLoading && <div>
                    <LoaderComponent/>
                </div>
            }
            {
                medicalRecordActivityLogsLoadingFailed &&
                <StatusCardComponent title={"Failed to fetch client Activity logs"}/>
            }
            {
                medicalRecordActivityLogsLoaded &&
                (!medicalRecordActivityLogs || medicalRecordActivityLogs?.length === 0) ?
                    <StatusCardComponent title={"No Activity logs found"}/> :
                    <ActivityLogTimelineComponent
                        logsData={medicalRecordActivityLogs}
                    />
            }
        </div>
    );

};

export default ChartNotesActivityLogsComponent;
