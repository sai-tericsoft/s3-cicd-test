import "./ViewExerciseRecordScreen.scss";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import React, {useCallback, useEffect} from "react";
import {getMedicalRecordViewExerciseRecord} from "../../../store/actions/chart-notes.action";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import {CommonService} from "../../../shared/services";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../constants";
import TableComponent from "../../../shared/components/table/TableComponent";
import MedicalInterventionLinkedToComponent
    from "../medical-intervention-linked-to/MedicalInterventionLinkedToComponent";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import commonService from "../../../shared/services/common.service";
import momentTimezone from "moment-timezone";

interface ViewExerciseLogComponentProps {

}

const viewExerciseRecordColumn: any = [
    {
        title: "Exercise",
        key: "exercise",
        dataIndex: 'id'
    },
    {
        title: 'Exercise Name',
        key: 'exercise_name',
        dataIndex: 'name',
        width: 500
    },
    {
        title: '(B)',
        key: 'bilateral',
        dataIndex: 'bilateral',
        align: 'center',
        width: 20,
        render: (item: any) => {
            return <>{item?.bilateral ? "Yes" : "-"}</>
        }
    },
    {
        title: "SET",
        key: "set",
        dataIndex: 'no_of_sets',
        align: 'center',
        width: 100
    },
    {
        title: "REP",
        key: "rep",
        dataIndex: 'no_of_reps',
        align: 'center',
        width: 100
    },
    {
        title: "Time",
        key: "time",
        dataIndex: 'time',
        align: 'center',
        width: 100
    },
    {
        title: "Resistance",
        key: "resistance",
        dataIndex: 'resistance',
        align: 'center',
        width: 100
    }
];

const ViewExerciseRecordScreen = (props: ViewExerciseLogComponentProps) => {

    const {medicalRecordId} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isPrintLoading, setIsPrintLoading] = React.useState<boolean>(false);
    const [printExerciseLogLoading, setPrintExerciseLogLoading] = React.useState<{ [id: string]: boolean }>({});
    const {
        medicalRecordViewExerciseRecord,
        isMedicalRecordViewExerciseRecordLoading,
        isMedicalRecordViewExerciseRecordLoaded,
        isMedicalRecordViewExerciseRecordLoadingFailed
    } = useSelector((state: IRootReducerState) => state.chartNotes);

    useEffect(() => {
        if (medicalRecordId) {
            dispatch(getMedicalRecordViewExerciseRecord(medicalRecordId));
        }
    }, [medicalRecordId, dispatch]);

    useEffect(() => {
        dispatch(setCurrentNavParams("View Exercise Record", null, () => {
            medicalRecordId && navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId));
        }));
    }, [medicalRecordId, navigate, dispatch]);

    const handlePrint = useCallback((medicalInterventionId?: string) => {
        setIsPrintLoading(true);
        const payload = {
            timezone: momentTimezone.tz.guess(),
        }
        if (medicalRecordId) {
            CommonService._chartNotes.PrintExerciseRecord(medicalRecordId, payload)
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
        }
    }, [medicalRecordId]);


    const handlePrintExerciseLog = useCallback((medicalInterventionId?: string) => {
        if (medicalInterventionId) {
            setPrintExerciseLogLoading((prevLoading) => ({
                ...prevLoading,
                [medicalInterventionId]: true,
            }));

            const payload = {
                timezone: momentTimezone.tz.guess(),
            };

            CommonService._chartNotes.PrintExerciseLog(medicalInterventionId, payload)
                .then((res: any) => {
                    setPrintExerciseLogLoading((prevLoading) => ({
                        ...prevLoading,
                        [medicalInterventionId]: false,
                    }));

                    const attachment = {
                        type: 'application/pdf',
                        url: res.data.url,
                        name: 'progress report',
                        key: '',
                    };

                    CommonService.printAttachment(attachment);
                })
                .catch((err: any) => {
                    setPrintExerciseLogLoading((prevLoading) => ({
                        ...prevLoading,
                        [medicalInterventionId]: false,
                    }));
                    console.error(err);
                });
        }
    }, []);


    const handleView = useCallback((attachment: any) => {
        CommonService._communications.LightBoxSubject.next([attachment]);
    }, []);


    return (
        <div className={'view-exercise-log-component'}>
            <PageHeaderComponent title={"View Exercise Record"}/>
            <>
                {
                    !medicalRecordId &&
                    <StatusCardComponent title={"Medical Record ID missing. Cannot fetch Exercise Record  details"}/>
                }
            </>
            {
                medicalRecordId && <>
                    {
                        isMedicalRecordViewExerciseRecordLoading &&
                        <LoaderComponent/>
                    }
                    {
                        isMedicalRecordViewExerciseRecordLoadingFailed &&
                        <StatusCardComponent title={"Failed to fetch client medical record Details"}/>
                    }
                    {
                        (isMedicalRecordViewExerciseRecordLoaded && medicalRecordViewExerciseRecord && medicalRecordId) && <>
                            <CardComponent color={'primary'}>
                                <div className={'client-name-button-wrapper'}>
                                    <span className={'client-name-wrapper'}>
                                        <span className={'client-name'}>
                                            <span
                                                className={medicalRecordViewExerciseRecord?.medical_record_details?.client_details?.is_alias_name_set ? "alias-name" : ""}>
                                            {commonService.generateClientNameFromClientDetails(medicalRecordViewExerciseRecord?.medical_record_details?.client_details)}
                                                </span>
                                        </span>
                                        <ChipComponent
                                            className={medicalRecordViewExerciseRecord?.medical_record_details?.status ? "active" : "inactive"}
                                            size={'small'}
                                            label={medicalRecordViewExerciseRecord?.medical_record_details?.status || "-"}/>
                                    </span>
                                    <div className="ts-row width-auto">
                                        <div className="">
                                            <ButtonComponent prefixIcon={<ImageConfig.PrintIcon/>}
                                                             isLoading={isPrintLoading}
                                                             disabled={medicalRecordViewExerciseRecord?.exercise_logs?.length === 0}
                                                             onClick={handlePrint}
                                            >
                                                Print All Logs
                                            </ButtonComponent>
                                        </div>
                                    </div>
                                </div>
                                <MedicalInterventionLinkedToComponent
                                    label={'Record Linked to:'}
                                    medicalRecordDetails={medicalRecordViewExerciseRecord?.medical_record_details}/>
                            </CardComponent>
                            {/*<div className={'horizontal-line'}></div>*/}
                            {/*<PageHeaderComponent title={'View Exercise Record'}/>*/}
                            {medicalRecordViewExerciseRecord?.exercise_logs?.map((item: any, index: number) => {

                                return <>
                                    <div className={'details-card-wrapper'}>
                                        <CardComponent>
                                            <div className={'ts-row'}>
                                                <div className={'ts-col-4'}>
                                                    <DataLabelValueComponent label={'Date of Intervention'}>
                                                        {item?.intervention_date ? CommonService.getSystemFormatTimeStamp(item?.intervention_date) : "N/A"}
                                                    </DataLabelValueComponent>
                                                </div>
                                                <div className={'ts-col-4'}>
                                                    <DataLabelValueComponent label={'Provider Name'}>
                                                        {item?.provider_details?.first_name} {item?.provider_details?.last_name}
                                                    </DataLabelValueComponent>
                                                </div>
                                                <div className={'ts-col-4 print-button-wrapper'}>
                                                    <ButtonComponent prefixIcon={<ImageConfig.PrintIcon/>}
                                                                     isLoading={printExerciseLogLoading[item?.intervention_id]}
                                                                     onClick={() => {
                                                                         handlePrintExerciseLog(item?.intervention_id)
                                                                     }}>Print</ButtonComponent>
                                                </div>
                                            </div>
                                        </CardComponent>
                                    </div>
                                    <CardComponent title={'Attachments'} className={'attachment-card-wrapper'}>
                                        <div className={'ts-col-md-2 d-flex'}>
                                            {item?.attachments?.length > 0 && item?.attachments?.map((attachment: any) => {
                                                return <ChipComponent label={attachment?.name}
                                                                      color={'success'}
                                                                      onClick={() => handleView(attachment)}
                                                                      className={'mrg-right-10'}
                                                                      key={attachment?._id}
                                                                      prefixIcon={ImageConfig.PDFIcon}/>

                                            })}
                                        </div>
                                        {
                                            item?.attachments?.length === 0 &&
                                            <StatusCardComponent title={'No attachment has been added'}/>
                                        }

                                    </CardComponent>
                                    <div className={'exercise-log-table-wrapper'}>
                                        <TableComponent data={item?.exercise_records}
                                                        noDataText={'No exercise has been added'}
                                                        columns={viewExerciseRecordColumn}
                                                        autoHeight={true}
                                        />
                                    </div>

                                    {item && item.comments &&
                                        item.comments.length > 0 && <div className={'comments-wrapper'}>
                                            <CardComponent title={'Comments'} className='mrg-top-20'>
                                                <div className='pdd-bottom-20'>{item.comments}</div>
                                            </CardComponent>
                                        </div>
                                    }
                                    {index !== medicalRecordViewExerciseRecord.exercise_logs.length - 1 && (
                                        <div className={'horizontal-line'}></div>
                                    )}
                                </>
                            })}
                            <CardComponent className={'no-exercise-record-wrapper'}>
                                {
                                    medicalRecordViewExerciseRecord?.exercise_logs?.length === 0 &&
                                    <StatusCardComponent
                                        title={'Currently, no exercise logs have been added to this medical record.'}/>
                                }
                            </CardComponent>


                        </>
                    }

                </>
            }
        </div>
    );

};

export default ViewExerciseRecordScreen;
