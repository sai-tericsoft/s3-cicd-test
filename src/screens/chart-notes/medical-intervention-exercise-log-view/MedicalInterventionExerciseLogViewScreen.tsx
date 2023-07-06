import "./MedicalInterventionExerciseLogViewScreen.scss";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {CommonService} from "../../../shared/services";
import React, {useCallback, useEffect, useState} from "react";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {IService} from "../../../shared/models/service.model";
import TableComponent from "../../../shared/components/table/TableComponent";
import {useDispatch} from "react-redux";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import {ImageConfig} from "../../../constants";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import MedicalInterventionLinkedToComponent
    from "../medical-intervention-linked-to/MedicalInterventionLinkedToComponent";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";

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
            <PageHeaderComponent title={"View Exercise Log"}/>

            {
                isMedicalInterventionExerciseLogDetailsLoading && <div>
                    <LoaderComponent/>
                </div>
            }

            {
                (medicalInterventionExerciseLogDetails && medicalInterventionExerciseLogDetails?.medical_record_details) && <>
                    <CardComponent color={'primary'}>
                        <div className={'client-name-button-wrapper'}>
                                    <span className={'client-name-wrapper'}>
                                        <span className={'client-name'}>
                                                {medicalInterventionExerciseLogDetails?.medical_record_details?.client_details?.first_name || "N/A"} {medicalInterventionExerciseLogDetails?.medical_record_details?.client_details?.last_name || "N/A"}
                                        </span>
                                        <ChipComponent
                                            className={medicalInterventionExerciseLogDetails?.medical_record_details?.status === "open" ? "active" : "inactive"}
                                            size={'small'}
                                            label={medicalInterventionExerciseLogDetails?.medical_record_details?.status_details?.title || "N/A"}/>
                                    </span>
                            <div className="ts-row width-auto">
                                {
                                    medicalInterventionExerciseLogDetails?.medical_record_details?.status === 'open' && <>
                                        {
                                            (medicalInterventionId && medicalRecordId) &&
                                            <LinkComponent
                                                route={CommonService._routeConfig.MedicalInterventionExerciseLogUpdate(medicalRecordId, medicalInterventionId, 'edit')}>
                                                <ButtonComponent
                                                    prefixIcon={<ImageConfig.EditIcon/>}
                                                >
                                                    Edit Exercise Log
                                                </ButtonComponent>
                                            </LinkComponent>
                                        }
                                    </>
                                }
                            </div>
                        </div>
                        <MedicalInterventionLinkedToComponent
                            medicalRecordDetails={medicalInterventionExerciseLogDetails?.medical_record_details}/>
                        <div className={'ts-row'}>
                            <div className={'ts-col-2'}>
                                <DataLabelValueComponent label={'Date of Intervention'}>
                                    {medicalInterventionExerciseLogDetails?.intervention_date ? CommonService.getSystemFormatTimeStamp(medicalInterventionExerciseLogDetails?.intervention_date) : "N/A"}
                                </DataLabelValueComponent>
                            </div>
                            <div className={'ts-col-2'}>
                                <DataLabelValueComponent className={'provider-details'}
                                                         label={'Provider'}>
                                    {medicalInterventionExerciseLogDetails?.provider_details?.first_name || "N/A"} {medicalInterventionExerciseLogDetails?.provider_details?.last_name || "N/A"}
                                </DataLabelValueComponent>
                            </div>
                        </div>

                    </CardComponent>
                </>
            }

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
                <CardComponent title={'Attachments'}  >
                    <StatusCardComponent title={'No Attachments'}/>
                </CardComponent>
            </div>

            }

            <div className={'medical-intervention-exercise-log-view-table-container'}>
                <TableComponent data={medicalInterventionExerciseLogDetails?.exercise_records}
                    // loading={isMedicalInterventionExerciseLogDetailsLoading}
                                columns={medicalInterventionExerciseLogColumns}/>
            </div>
        </div>
    );

};

export default MedicalInterventionExerciseLogViewScreen;
