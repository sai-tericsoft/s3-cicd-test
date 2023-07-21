import "./ViewExerciseRecordScreen.scss";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import React, {useEffect} from "react";
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
    },
    {
        title: "SET",
        key: "set",
        dataIndex: 'no_of_sets',
    },
    {
        title: "REP",
        key: "rep",
        dataIndex: 'no_of_reps',
    },
    {
        title: "Time",
        key: "time",
        dataIndex: 'time',
    },
    {
        title: "Resistance",
        key: "resistance",
        dataIndex: 'resistance',
    }
];

const ViewExerciseRecordScreen = (props: ViewExerciseLogComponentProps) => {

    const {medicalRecordId} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

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
                                            {medicalRecordViewExerciseRecord?.medical_record_details?.client_details?.first_name} {medicalRecordViewExerciseRecord?.medical_record_details?.client_details?.last_name}
                                        </span>
                                        <ChipComponent
                                            className={medicalRecordViewExerciseRecord?.medical_record_details?.status ? "active" : "inactive"}
                                            size={'small'}
                                            label={medicalRecordViewExerciseRecord?.medical_record_details?.status || "-"}/>
                                    </span>
                                    <div className="ts-row width-auto">
                                        <div className="">
                                            <ButtonComponent prefixIcon={<ImageConfig.PrintIcon/>}
                                                             onClick={() => {
                                                                 CommonService._alert.showToast('Coming Soon', 'info');
                                                             }}
                                            >
                                                Print All Logs
                                            </ButtonComponent>
                                        </div>
                                    </div>
                                </div>
                                <MedicalInterventionLinkedToComponent
                                    medicalRecordDetails={medicalRecordViewExerciseRecord?.medical_record_details}/>
                            </CardComponent>
                            <div className={'horizontal-line'}></div>
                            {/*<PageHeaderComponent title={'View Exercise Record'}/>*/}
                            {medicalRecordViewExerciseRecord?.exercise_logs?.map((item: any) => {
                                return <>  <CardComponent color={'primary'}>
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
                                        <div className={'print-button-wrapper'}>
                                            <ButtonComponent prefixIcon={<ImageConfig.PrintIcon/>}
                                                             onClick={() => {
                                                                 CommonService._alert.showToast('Coming Soon', 'info');
                                                             }}>Print</ButtonComponent>
                                        </div>
                                    </div>
                                </CardComponent>
                                    <CardComponent title={'Attachments'} className={'attachment-card-wrapper'}>
                                        <div className={'ts-col-md-2'}>
                                            {item?.attachments?.length > 0 && item?.attachments?.map((attachment: any) => {
                                                return <ChipComponent label={attachment?.name}
                                                                      color={'success'}
                                                                      key={attachment?._id}
                                                                      prefixIcon={ImageConfig.PDFIcon}/>
                                            })}
                                        </div>
                                            {
                                                item?.attachments?.length === 0 && <StatusCardComponent title={'No attachment has been added yet'}/>
                                            }

                                    </CardComponent>
                                    <div className={'exercise-log-table-wrapper'}>
                                    <TableComponent data={item?.exercise_records}
                                                    columns={viewExerciseRecordColumn}
                                                    autoHeight={true}
                                    />
                                    </div>

                                    {item && item.comments &&
                                    item.comments.length > 0 &&
                                    <CardComponent title={'Comments'} className='mrg-top-20'>
                                        <div className='pdd-bottom-20'>{item.comments}</div>
                                    </CardComponent>
                                    }

                                    <div className={'horizontal-line'}></div>
                                </>
                            })}
                        </>
                    }
                </>
            }
        </div>
    );

};

export default ViewExerciseRecordScreen;
