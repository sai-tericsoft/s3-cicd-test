import "./MedicalInterventionListComponent.scss";
import {ImageConfig, Misc} from "../../../constants";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import {useNavigate, useParams} from "react-router-dom";
import {CommonService} from "../../../shared/services";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {useCallback, useEffect} from "react";
import {IAPIResponseType} from "../../../shared/models/api.model";
import moment from "moment";
import {useDispatch, useSelector} from "react-redux";
import {getMedicalInterventionList} from "../../../store/actions/chart-notes.action";
import {IRootReducerState} from "../../../store/reducers";
import TableComponent from "../../../shared/components/table/TableComponent";

interface ClientMedicalRecordsComponentProps {

}

const MedicalInterventionListComponent = (props: ClientMedicalRecordsComponentProps) => {

    const navigate = useNavigate();
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
            width: '3%',
            render: (_: any, item: any) => {
                return <div className={'flag-wrapper'}>{item?.is_flagged && <ImageConfig.FlagIcon/>}</div>
            }
        },
        {
            title: 'Date of Intervention',
            key: 'date_of_intervention',
            dataIndex: 'intervention_date',
            width: '20%',
            fixed: 'left',
            render: (_: any, item: any) => {
                return <>{CommonService.getSystemFormatTimeStamp(item?.intervention_date)}</>
            }
        },
        {
            title: 'Note Type',
            key: 'note_type',
            dataIndex: 'note_type',
        },
        {
            title: 'Last Updated',
            key: 'last_updated',
            dataIndex: 'updated_at',
            width: '25%',
            render: (_: any, item: any) => {
                return <>{CommonService.transformTimeStamp(item?.updated_at)}</>
            }
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: (_: any, item: any) => {
                return <ChipComponent label={item?.status}
                                      className={item?.status === 'completed' ? "completed" : "draft"}/>
            }
        },
        {
            title: 'Posted By',
            key: 'name',
            dataIndex: 'name',
            render: (_: any, item: any) => {
                if (item?.note_type?.toLowerCase() === "progress report") {
                    return item?.posted_by
                } else {
                    return item?.posted_by?.first_name + " " + item?.posted_by?.last_name
                }
            }
        },
        {
            title: '',
            key: 'actions',
            render: (_: any, item: any) => {
                if (medicalRecordId) {
                    if (item?.note_type?.toLowerCase() === 'exercise log') {
                        return <LinkComponent
                            route={CommonService._routeConfig.MedicalInterventionExerciseLogView(medicalRecordId, item?.intervention_id)}>
                            View Details
                        </LinkComponent>
                    } else if (item?.note_type?.toLowerCase() === "soap note") {
                        return <LinkComponent
                            route={CommonService._routeConfig.MedicalInterventionDetails(medicalRecordId, item?._id)}>
                            View Details
                        </LinkComponent>
                    } else if (item?.note_type?.toLowerCase() === "progress report") {
                        return <LinkComponent
                            route={CommonService._routeConfig.MedicalRecordProgressReportViewDetails(medicalRecordId, item?._id)}>
                            View Details
                        </LinkComponent>
                    } else {
                        return <LinkComponent route={CommonService._routeConfig.ComingSoonRoute()}>
                            Coming soon
                        </LinkComponent>
                    }
                }
            }
        }
    ];

    const repeatLastTreatment = useCallback(
        (medicalRecordId: string) => {
            CommonService._chartNotes.RepeatLastInterventionAPICall(medicalRecordId, {
                    "repeat_previous": true //todo: Why Swetha ????
                }
            )
                .then((response: IAPIResponseType<any>) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    navigate(CommonService._routeConfig.AddMedicalIntervention(medicalRecordId, response?.data._id) + '?showClear=true');
                })
                .catch((error: any) => {
                    CommonService._alert.showToast(error, "error");
                });
        },
        [navigate],
    );
    const confirmRepeatLastTreatment = useCallback(
        () => {
            if (!medicalRecordId) {
                CommonService._alert.showToast('Medical Record ID not found!', "error");
                return;
            }
            CommonService.onConfirm({
                confirmationTitle: "REPEAT LAST TREATMENT",
                image: ImageConfig.REPEAT_LAST_INTERVENTION,
                confirmationSubTitle: "Do you want to repeat the last treatment\nfrom the same Medical Record?"
            })
                .then((value) => {
                    repeatLastTreatment(medicalRecordId);
                })
                .catch(reason => {

                })
        },
        [medicalRecordId, repeatLastTreatment],
    );
    const addNewTreatment = useCallback(
        () => {
            if (!medicalRecordId) {
                CommonService._alert.showToast('Medical Record ID not found!', "error");
                return;
            }
            const payload = {
                "intervention_date": moment().format('YYYY-MM-DD'),
                "subjective": "",
                "objective": {
                    "observation": "",
                    "palpation": "",
                    "functional_tests": "",
                    "treatment": "",
                    "treatment_response": ""
                },
                "assessment": {
                    "suspicion_index": "",
                    "surgery_procedure": ""
                },
                "plan": {
                    "plan": "",
                    "md_recommendations": "",
                    "education": "",
                    "treatment_goals": ""
                }
            };
            CommonService._chartNotes.AddNewMedicalInterventionAPICall(medicalRecordId, payload)
                .then((response: IAPIResponseType<any>) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    navigate(CommonService._routeConfig.AddMedicalIntervention(medicalRecordId, response?.data._id));
                })
                .catch((error: any) => {
                    CommonService._alert.showToast(error, "error");
                });
        },
        [medicalRecordId, navigate],
    );

    useEffect(() => {
        if (medicalRecordId) {
            dispatch(getMedicalInterventionList(medicalRecordId));
        }
    }, [dispatch, medicalRecordId]);

    return (
        <div className={'client-medical-records-component'}>
            <div className={'client-medical-records-header-button-wrapper'}>
                <div className={'client-medical-records-header'}>Medical Records</div>
                <div>
                    <ButtonComponent onClick={confirmRepeatLastTreatment}
                                     disabled={(isMedicalInterventionListLoading || medicalInterventionList.filter((item: any) => (item?.status === 'completed' && item?.note_type?.toLowerCase() === "soap note")).length === 0)}
                                     className={'outlined-button'}
                                     variant={"outlined"}>
                        Repeat Last Treatment
                    </ButtonComponent>
                    <ButtonComponent onClick={addNewTreatment} prefixIcon={<ImageConfig.AddIcon/>}>
                        Add New Treatment
                    </ButtonComponent>
                </div>
            </div>
            <TableComponent data={medicalInterventionList} columns={MedicalInterventionListColumns}
                            loading={isMedicalInterventionListLoading}/>
        </div>
    );

};

export default MedicalInterventionListComponent;
