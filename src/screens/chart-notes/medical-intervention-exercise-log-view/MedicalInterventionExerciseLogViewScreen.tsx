import "./MedicalInterventionExerciseLogViewScreen.scss";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {CommonService} from "../../../shared/services";
import React, {useCallback, useEffect, useState} from "react";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {IService} from "../../../shared/models/service.model";
import TableComponent from "../../../shared/components/table/TableComponent";
import {useDispatch} from "react-redux";
import MedicalRecordBasicDetailsCardComponent
    from "../medical-record-basic-details-card/MedicalRecordBasicDetailsCardComponent";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import {ImageConfig} from "../../../constants";

interface MedicalInterventionExerciseLogViewScreenProps {

}

const MedicalInterventionExerciseLogViewScreen = (props: MedicalInterventionExerciseLogViewScreenProps) => {


    const {medicalRecordId, medicalInterventionId} = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [medicalInterventionExerciseLogDetails, setMedicalInterventionExerciseLogDetails] = useState<any>(undefined);
    const [isMedicalInterventionExerciseLogDetailsLoading, setIsMedicalInterventionExerciseLogDetailsLoading] = useState<boolean>(false);
    const location = useLocation();

    const medicalInterventionExerciseLogColumns = [
        {
            title: 'Exercise',
            dataIndex: 'id',
            key: 'id',
            width: 130
        },
        {
            title: 'Exercise Name',
            key: 'name',
            dataIndex: 'name',
            width: 280
        },
        {
            title: 'SET',
            key: 'no_of_sets',
            dataIndex: 'no_of_sets',
            width: 150,
            render: (item: any) => {
                return <div>{item?.no_of_sets || '-'}</div>
            }
        },
        {
            title: 'REP',
            key: 'no_of_reps',
            dataIndex: 'no_of_reps',
            width: 150,
            render: (item: any) => {
                return <div>{item?.no_of_reps || '-'}</div>
            }
        },
        {
            title: 'TIME',
            key: 'time',
            dataIndex: 'time',
            width: 150,
            render: (item: any) => {
                return <div>{item?.time || '-'}</div>
            }
        },
        {
            title: 'RESISTANCE',
            key: 'resistance',
            dataIndex: 'resistance',
            width: 150,
            render: (item: any) => {
                return <div>{item?.resistance || '-'}</div>
            }
        },
    ];

    useEffect(() => {
        if (medicalRecordId) {
            dispatch(setCurrentNavParams("View Exercise Log Details", null, () => {
                medicalInterventionId && navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId));
            }));
        }
    }, [dispatch, navigate, medicalRecordId, medicalInterventionId]);

    const fetchMedicalInterventionExerciseLogDetails = useCallback((medicalInterventionId: string) => {
        setIsMedicalInterventionExerciseLogDetailsLoading(true);
        CommonService._chartNotes.FetchMedicalInterventionExerciseLogAPICall(medicalInterventionId, {})
            .then((response: IAPIResponseType<IService>) => {
                setMedicalInterventionExerciseLogDetails(response.data);
                setIsMedicalInterventionExerciseLogDetailsLoading(false);
            }).catch((error: any) => {
            setMedicalInterventionExerciseLogDetails({});
            setIsMedicalInterventionExerciseLogDetailsLoading(false);
        })
    }, []);

    useEffect(() => {
        if (medicalInterventionId) {
            fetchMedicalInterventionExerciseLogDetails(medicalInterventionId);
        }
    }, [medicalInterventionId, fetchMedicalInterventionExerciseLogDetails]);


    useEffect(() => {
        if (medicalInterventionExerciseLogDetails) {
            setTimeout(() => {
                const ele = document.getElementById('medical-intervention-exercise-log-view-table-container');
                if (ele) {
                    ele.scrollIntoView({behavior: "smooth", block: "start"});
                }
            }, 100); //TODO: Need to find a better way to scroll to the form
        }
    }, [location, medicalInterventionExerciseLogDetails]);

    const handleView = useCallback((attachment: any) => {
        CommonService._communications.LightBoxSubject.next([attachment]);
    }, []);

    return (
        <div className={'medical-intervention-exercise-log-view-screen'}>
            <PageHeaderComponent title={"View Exercise Record"}/>
            <MedicalRecordBasicDetailsCardComponent/>

            {medicalInterventionExerciseLogDetails && medicalInterventionExerciseLogDetails.attachments.length > 0 &&
                <CardComponent title={'Attachments'}>

                    {
                        medicalInterventionExerciseLogDetails.attachments.map((attachment: any) => {
                            return (
                                <div className="medical-intervention-exercise-log-attachments-view-wrapper">
                                    <div className={'medical-intervention-exercise-log-attachments-view'}
                                         onClick={() => handleView(attachment)}>
                                        <div><ImageConfig.DocumentIcon/></div>
                                        <div className={'attachment-chip-view'}>
                                            {attachment.name}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }

                </CardComponent>
            }

            {medicalInterventionExerciseLogDetails && !medicalInterventionExerciseLogDetails.attachments.length &&<div className={'no-appointment-text-wrapper'}>
                <CardComponent title={'Attachments'} >
                    No attachments Found
                </CardComponent>
            </div>
            }

            <div className={'medical-intervention-exercise-log-view-table-container'}>
                <TableComponent data={medicalInterventionExerciseLogDetails?.exercise_records}
                                loading={isMedicalInterventionExerciseLogDetailsLoading}
                                columns={medicalInterventionExerciseLogColumns}/>
            </div>
        </div>
    );

};

export default MedicalInterventionExerciseLogViewScreen;
