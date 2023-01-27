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

    const navigate = useNavigate();
    const {medicalRecordId} = useParams();
    const dispatch = useDispatch();
    const {
        medicalInterventionList,
        isMedicalInterventionListLoading,
    } = useSelector((state: IRootReducerState) => state.chartNotes);
    const [isMedicalInterventionBeingAdded, setIsMedicalInterventionBeingAdded] = useState<boolean>(false);
    const [isMedicalInterventionBeingRepeated, setIsMedicalInterventionBeingRepeated] = useState<boolean>(false);

    const MedicalInterventionListColumns: any = [
        {
            title: '',
            key: "flag",
            dataIndex: 'is_flagged',
            width: 10,
            render: ( item: any) => {
                return <div className={'flag-wrapper'}>{item?.is_flagged && <ImageConfig.FlagIcon/>}</div>
            }
        },
        {
            title: 'Date of Intervention',
            key: 'date_of_intervention',
            dataIndex: 'intervention_date',
            width: 160,
            fixed: 'left',
            render: ( item: any) => {
                return <>{CommonService.getSystemFormatTimeStamp(item?.intervention_date)}</>
            }
        },
        {
            title: 'Note Type',
            key: 'note_type',
            width: 150,
            dataIndex: 'note_type',
        },
        {
            title: 'Last Updated',
            key: 'last_updated',
            dataIndex: 'updated_at',
            width: 170,
            render: ( item: any) => {
                return <>{CommonService.transformTimeStamp(item?.updated_at)}</>
            }
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            align: 'center',
            width: 110,
            render: ( item: any) => {
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
            render: ( item: any) => {
                    return (item?.posted_by?.first_name + " " + item?.posted_by?.last_name)
            }
        },
        {
            title: '',
            key: 'actions',
            width: 130,
            fixed: 'right',
            render: ( item: any) => {
                let route = '';
                if (medicalRecordId) {
                    if (item?.note_type?.toLowerCase() === 'exercise log') {
                        route = CommonService._routeConfig.MedicalInterventionExerciseLogView(medicalRecordId, item?.intervention_id);
                    } else if (item?.note_type?.toLowerCase() === "soap note") {
                        route = CommonService._routeConfig.MedicalInterventionDetails(medicalRecordId, item?._id);
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

    const repeatLastTreatment = useCallback(
        (medicalRecordId: string) => {
            setIsMedicalInterventionBeingRepeated(true);
            CommonService._chartNotes.RepeatLastInterventionAPICall(medicalRecordId, {
                    "repeat_previous": true //todo: Why Swetha ????
                }
            ).then((response: IAPIResponseType<any>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                navigate(CommonService._routeConfig.AddMedicalIntervention(medicalRecordId, response?.data._id) + '?showClear=true');
                setIsMedicalInterventionBeingRepeated(false);
            }).catch((error: any) => {
                CommonService._alert.showToast(error?.error || "Error repeating last medical intervention", "error");
                setIsMedicalInterventionBeingRepeated(false);
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
                },
                is_discharge: false,
            };
            setIsMedicalInterventionBeingAdded(true);
            CommonService._chartNotes.AddNewMedicalInterventionAPICall(medicalRecordId, payload)
                .then((response: IAPIResponseType<any>) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    navigate(CommonService._routeConfig.AddMedicalIntervention(medicalRecordId, response?.data._id));
                    setIsMedicalInterventionBeingAdded(false);
                })
                .catch((error: any) => {
                    CommonService._alert.showToast(error?.error || "Error creating a medical intervention", "error");
                    setIsMedicalInterventionBeingAdded(false);
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
                                     disabled={(isMedicalInterventionBeingRepeated || isMedicalInterventionListLoading || medicalInterventionList.filter((item: any) => (item?.status === 'completed' && item?.note_type?.toLowerCase() === "soap note")).length === 0)}
                                     className={'outlined-button'}
                                     variant={"outlined"}>
                        Repeat Last Treatment
                    </ButtonComponent>
                    <ButtonComponent onClick={addNewTreatment}
                                     disabled={isMedicalInterventionBeingAdded}
                                     isLoading={isMedicalInterventionBeingAdded}
                                     prefixIcon={<ImageConfig.AddIcon/>}>
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
