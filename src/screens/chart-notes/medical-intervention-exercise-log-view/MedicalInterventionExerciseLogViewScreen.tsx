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
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import moment from "moment-timezone";
import commonService from "../../../shared/services/common.service";
import momentTimezone from "moment-timezone";

interface MedicalInterventionExerciseLogViewScreenProps {

}

const MedicalInterventionExerciseLogViewScreen = (props: MedicalInterventionExerciseLogViewScreenProps) => {


    const {medicalRecordId, medicalInterventionId} = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [medicalInterventionExerciseLogDetails, setMedicalInterventionExerciseLogDetails] = useState<any>(undefined);
    const [isMedicalInterventionExerciseLogDetailsLoading, setIsMedicalInterventionExerciseLogDetailsLoading] = useState<boolean>(false);
    const [isMedicalInterventionExerciseLogDetailsLoaded, setIsMedicalInterventionExerciseLogDetailsLoaded] = useState<boolean>(false);
    const [isPrintLoading, setIsPrintLoading] = useState<boolean>(false);

    const location = useLocation();


    const medicalInterventionExerciseLogColumns: any = [
        {
            title: 'Exercise',
            dataIndex: 'id',
            key: 'id',
            width: 150,
            fixed: 'left',
        },
        {
            title: 'Exercise Name',
            key: 'name',
            dataIndex: 'name',
            width: 450,
            // align:'center',
            fixed: 'left',
        },
        {
            title: '(B)',
            key: 'bilateral',
            dataIndex: 'bilateral',
            width: 100,
            align: 'center',
            render: (item: any) => {
                return <div>{item?.bilateral ? 'Yes' : '-'}</div>
            }
        },
        {
            title: 'SET',
            key: 'no_of_sets',
            dataIndex: 'no_of_sets',
            align: 'center',
            width: 100,
            render: (item: any) => {
                return <div>{item?.no_of_sets || '-'}</div>
            }
        },
        {
            title: 'REP',
            key: 'no_of_reps',
            dataIndex: 'no_of_reps',
            align: 'center',
            width: 100,
            render: (item: any) => {
                return <div>{item?.no_of_reps || '-'}</div>
            }
        },
        {
            title: 'TIME',
            key: 'time',
            dataIndex: 'time',
            align: 'center',
            width: 100,
            render: (item: any) => {
                return <div>{item?.time || '-'}</div>
            }
        },
        {
            title: 'RESISTANCE',
            key: 'resistance',
            dataIndex: 'resistance',
            width: 130,
            align: 'center',
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
        setIsMedicalInterventionExerciseLogDetailsLoaded(false);
        CommonService._chartNotes.FetchMedicalInterventionExerciseLogAPICall(medicalInterventionId, {})
            .then((response: IAPIResponseType<IService>) => {
                setMedicalInterventionExerciseLogDetails(response.data);
                setIsMedicalInterventionExerciseLogDetailsLoaded(true);
                setIsMedicalInterventionExerciseLogDetailsLoading(false);
            }).catch((error: any) => {
            setMedicalInterventionExerciseLogDetails({});
            setIsMedicalInterventionExerciseLogDetailsLoaded(true);
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

    const handlePrint = useCallback(() => {
        setIsPrintLoading(true);
        const payload={
            timezone: momentTimezone.tz.guess(),
        }
        medicalInterventionId && CommonService._chartNotes.PrintExerciseLog(medicalInterventionId,payload)
            .then((res: any) => {
                setIsPrintLoading(false);
                const attachment = {
                    type: 'application/pdf',
                    url: res.data.url,
                    name: 'progress report',
                    key: ''
                };
                CommonService.printAttachment(attachment);
            })
            .catch((err: any) => {
                setIsPrintLoading(false);
                console.log(err);
            })
    }, [medicalInterventionId]);

    const handleExerciseLogEdit = useCallback(() => {
       if(medicalInterventionExerciseLogDetails?.can_edit===true && medicalRecordId && medicalInterventionId) {
           navigate(CommonService._routeConfig.MedicalInterventionExerciseLogUpdate(medicalRecordId, medicalInterventionId, 'edit'));
       }else{
           CommonService._alert.showToast("ERROR - Unfortunately you are unable to make changes to this file as the time period to edit the file has expired. Please contact your supervisor.", "error");
       }
    }, [medicalInterventionId,medicalInterventionExerciseLogDetails?.can_edit, medicalRecordId,navigate]);

    return (
        <div className={'medical-intervention-exercise-log-view-screen'}>
            <PageHeaderComponent className={'page-header'} title={"View Exercise Log"} actions={
                <div className="last-updated-status">
                    <div className="last-updated-status-text">Last updated on:&nbsp;</div>
                    {isMedicalInterventionExerciseLogDetailsLoaded &&
                        <div
                            className="last-updated-status-bold">
                            {(medicalInterventionExerciseLogDetails?.updated_at ? moment(medicalInterventionExerciseLogDetails.updated_at).tz(moment.tz.guess()).format('DD-MMM-YYYY | hh:mm A z') : 'N/A')}&nbsp;-&nbsp;
                            {medicalInterventionExerciseLogDetails?.last_updated_by_details?.first_name ? medicalInterventionExerciseLogDetails?.last_updated_by_details?.first_name + ' ' + medicalInterventionExerciseLogDetails?.last_updated_by_details?.last_name : ' NA'}
                        </div>
                    }
                </div>}/>

            {
                isMedicalInterventionExerciseLogDetailsLoading && <div>
                    <LoaderComponent/>
                </div>
            }

            {
                (isMedicalInterventionExerciseLogDetailsLoaded && medicalInterventionExerciseLogDetails && medicalInterventionExerciseLogDetails?.medical_record_details) && <>
                    <CardComponent color={'primary'}>
                        <div className={'client-name-button-wrapper'}>
                                    <span className={'client-name-wrapper'}>
                                        <span className={'client-name'}>
                                            <span
                                                className={medicalInterventionExerciseLogDetails?.medical_record_details?.client_details.is_alias_name_set ? "alias-name" : ""}>
                                                {commonService.generateClientNameFromClientDetails(medicalInterventionExerciseLogDetails?.medical_record_details?.client_details)}
                                                </span>
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
                                            <>
                                                <ButtonComponent prefixIcon={<ImageConfig.PrintIcon/>}
                                                                 className={'mrg-right-10'}
                                                                 isLoading={isPrintLoading}
                                                                 onClick={handlePrint}>
                                                    Print
                                                </ButtonComponent>

                                                     {/*route={CommonService._routeConfig.MedicalInterventionExerciseLogUpdate(medicalRecordId, medicalInterventionId, 'edit')}>*/}
                                                    <ButtonComponent
                                                        onClick={handleExerciseLogEdit}
                                                        prefixIcon={<ImageConfig.EditIcon/>}
                                                    >
                                                        Edit Exercise Log
                                                    </ButtonComponent>

                                            </>
                                        }
                                    </>
                                }
                            </div>
                        </div>
                        <MedicalInterventionLinkedToComponent
                            label={'Exercise Log Linked to'}
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

            {isMedicalInterventionExerciseLogDetailsLoaded && medicalInterventionExerciseLogDetails && medicalInterventionExerciseLogDetails.attachments.length > 0 &&
                <CardComponent title={'Attachments'} className={'pdd-bottom-20'}>

                    {
                        medicalInterventionExerciseLogDetails.attachments.map((attachment: any) => {
                            return (
                                <span className={'mrg-right-10 mrg-bottom-10'}>
                                    {/*<div className={'medical-intervention-exercise-log-attachments-view'}*/}
                                    {/*     onClick={() => handleView(attachment)}>*/}
                                    {/*    <div><ImageConfig.DocumentIcon/></div>*/}
                                    {/*    <div className={'attachment-chip-view'}>*/}
                                    {/*        {attachment.name}*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}
                                    <ChipComponent prefixIcon={<ImageConfig.DocumentIcon/>} color={'success'}
                                                   onClick={() => handleView(attachment)}
                                                   label={attachment.name} className={'attachment-chip-view'}/>
                                </span>
                            )
                        })
                    }

                </CardComponent>
            }


            {isMedicalInterventionExerciseLogDetailsLoaded && medicalInterventionExerciseLogDetails && !medicalInterventionExerciseLogDetails.attachments.length &&
                <div className={'no-appointment-text-wrapper'}>
                    <CardComponent title={'Attachments'}>
                        <StatusCardComponent title={'No attachment has been added yet'}/>
                    </CardComponent>
                </div>

            }

            {isMedicalInterventionExerciseLogDetailsLoaded &&
                <div className={'medical-intervention-exercise-log-view-table-container'}>
                    <TableComponent data={medicalInterventionExerciseLogDetails?.exercise_records}
                        // loading={isMedicalInterventionExerciseLogDetailsLoading}
                                    columns={medicalInterventionExerciseLogColumns}/>
                </div>
            }
            {isMedicalInterventionExerciseLogDetailsLoaded && medicalInterventionExerciseLogDetails && medicalInterventionExerciseLogDetails.comments &&
                medicalInterventionExerciseLogDetails.comments.length > 0 &&
                <CardComponent title={'Comments'} className='mrg-top-20'>
                    <div className='pdd-bottom-20'>{medicalInterventionExerciseLogDetails.comments &&
                        medicalInterventionExerciseLogDetails.comments?.split('\n').map((item: any) => {
                            return <div>{item}</div>
                        })
                    }</div>
                </CardComponent>
            }

        </div>
    );

};

export default MedicalInterventionExerciseLogViewScreen;
