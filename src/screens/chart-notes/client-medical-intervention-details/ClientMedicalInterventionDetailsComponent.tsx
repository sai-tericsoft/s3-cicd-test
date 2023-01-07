import "./ClientMedicalInterventionDetailsComponent.scss";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import {useCallback, useEffect} from "react";
import {getClientMedicalInterventionDetails} from "../../../store/actions/chart-notes.action";

import TableComponent from "../../../shared/components/table/TableComponent";
import {CommonService} from "../../../shared/services";
import {ImageConfig} from "../../../constants";

interface ClientMedicalInterventionDetailsComponentProps {

}

const ClientMedicalInterventionDetailsComponent = (props: ClientMedicalInterventionDetailsComponentProps) => {

    const ClientMedicalInterventionDetailsColumn: any = [
        {
            title: 'Movement',
            dataIndex: 'movement_name',
            key: 'name',
            width: 147,
            fixed: 'left',
            align: "center",
            render: (_: any, item: any) => {
                return <div>{item.rom_config?.map((e: any) => {

                    return <div className={'movement-name'}>{e.movement_name}</div>
                })}</div>
            }
        },
        {
            title: 'Left Side',
            className: 'left_side',
            children: [
                {
                    title: 'AROM',
                    dataIndex: 'arom',
                    key: 'arom',
                    width: 87,
                    align: "center",
                    render: (_: any, item: any) => {
                        return <div>{item.rom_config?.map((e: any) => {
                            return <div className={'movement-name'}>{e?.config?.Left?.arom || '-'}</div>
                        })}</div>
                    }
                },
                {
                    title: 'PROM',
                    dataIndex: 'prom',
                    key: 'prom',
                    width: 87,
                    align: "center",
                    render: (_: any, item: any) => {
                        return <div>{item.rom_config?.map((e: any) => {
                            return <div className={'movement-name'}>{e?.config?.Left?.prom || "-"}</div>
                        })}</div>
                    }
                },
                {
                    title: 'Strength',
                    dataIndex: 'strength',
                    key: 'strength',
                    width: 107,
                    align: "center",
                    render: (_: any, item: any) => {
                        return <div>{item.rom_config?.map((e: any) => {
                            return <div className={'movement-name'}>{e?.config?.Left?.strength || "-"}</div>
                        })}</div>
                    }
                }
            ]

        },
        {
            title: 'Right Side',
            children: [

                {
                    title: 'AROM',
                    dataIndex: 'arom',
                    key: 'arom',
                    width: 87,
                    align: "center",
                    render: (_: any, item: any) => {
                        return <div>{item.rom_config?.map((e: any) => {
                            return <div className={'movement-name'}>{e?.config?.Right?.arom || "-"}</div>
                        })}</div>
                    }
                },
                {
                    title: 'PROM',
                    dataIndex: 'prom',
                    key: 'prom',
                    width: 87,
                    align: "center",
                    render: (_: any, item: any) => {
                        return <div>{item.rom_config?.map((e: any) => {
                            return <div className={'movement-name'}>{e?.config?.Right?.prom || "-"}</div>
                        })}</div>
                    }

                },
                {
                    title: 'Strength',
                    dataIndex: 'strength',
                    key: 'strength',
                    width: 107,
                    align: "center",
                    render: (_: any, item: any) => {
                        return <div>{item.rom_config?.map((e: any) => {
                            return <div className={'movement-name'}>{e?.config?.Right?.strength || "-"}</div>
                        })}</div>
                    }

                }
            ]

        },
        {
            title: 'Central',
            children: [
                {
                    title: 'AROM',
                    dataIndex: 'arom',
                    key: 'arom',
                    width: 87,
                    align: "center",
                    render: (_: any, item: any) => {
                        return <div>{item.rom_config?.map((e: any) => {
                            return <div className={'movement-name'}>
                                {e?.config?.Central?.arom || "-"}
                            </div>
                        })}</div>
                    }

                },
                {
                    title: 'PROM',
                    dataIndex: 'prom',
                    key: 'prom',
                    width: 87,
                    align: "center",
                    render: (_: any, item: any) => {
                        return <div>{item.rom_config?.map((e: any) => {
                            return <div className={'movement-name'}>{e?.config?.Central?.prom || "-"}</div>
                        })}</div>
                    }
                },
                {
                    title: 'Strength',
                    dataIndex: 'strength',
                    key: 'strength',
                    width: 107,
                    align: "center",
                    render: (_: any, item: any) => {
                        return <div>{item.rom_config?.map((e: any) => {
                            return <div className={'movement-name'}>{e?.config?.Central?.strength || "-"}</div>
                        })}</div>
                    }
                }
            ]

        },
        {
            title: 'Bilateral',
            children: [
                {
                    title: 'AROM',
                    dataIndex: 'arom',
                    key: 'arom',
                    width: 87,
                    align: "center",
                    render: (_: any, item: any) => {
                        return <div>{item.rom_config?.map((e: any) => {
                            return <div className={'movement-name'}>{e?.config?.Bilateral?.arom || "-"}</div>
                        })}</div>
                    }
                },
                {
                    title: 'PROM',
                    dataIndex: 'prom',
                    key: 'prom',
                    width: 87,
                    align: "center",
                    render: (_: any, item: any) => {
                        return <div>{item.rom_config?.map((e: any) => {
                            return <div className={'movement-name'}>{e?.config?.Bilateral?.prom || "-"}</div>
                        })}</div>
                    }
                },
                {
                    title: 'Strength',
                    dataIndex: 'strength',
                    key: 'strength',
                    width: 107,
                    align: "center",
                    render: (_: any, item: any) => {
                        return <div>{item.rom_config?.map((e: any) => {
                            return <div className={'movement-name'}>{e?.config?.Bilateral?.strength || "-"}</div>
                        })}</div>
                    }
                }
            ]

        },
    ];

    const specialDetailsColumns: any = [
        {
            title: 'Test Name',
            dataIndex: 'name',
            key: 'test_name',
            width: 150,
            render: (_: any, item: any) => {
                return <div>{item.special_tests.map((test: any) => {
                    return <div className={'test-name'}>{test?.name}</div>
                })}</div>
            }
        },
        {
            title: ' Results',
            dataIndex: 'result',
            key: 'result',
            width: 150,
            render: (_: any, item: any) => {
                return <div>{item.special_tests.map((test: any) => {
                    return <div className={'test-name'}>{test?.result}</div>
                })}
                </div>
            }
        },
        {
            title: 'Comments',
            dataIndex: 'comments',
            key: 'comments',
            render: (_: any, item: any) => {
                return <div>{item.special_tests.map((test: any) => {
                    return <div className={'test-name'}>{test?.comments}</div>
                })}
                </div>
            }
        }
    ];

    const ICDTableColumns: any = [
        {
            title: 'ICD Code',
            dataIndex: 'icd_code',
            key: 'icd_code',
            width: 150,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        }
    ]

    const {medicalInterventionId} = useParams();
    const dispatch = useDispatch();
    const {currentUser} = useSelector((state: IRootReducerState) => state.account)
    const {
        isClientMedicalInterventionDetailsLoaded,
        isClientMedicalInterventionDetailsLoading,
        isClientMedicalInterventionDetailsLoadingFailed,
        clientMedicalInterventionDetails
    } = useSelector((state: IRootReducerState) => state.chartNotes);


    useEffect(() => {
        if (medicalInterventionId) {
            dispatch(getClientMedicalInterventionDetails(medicalInterventionId));
        }
    }, []);

    return (
        <div className={'client-medical-intervention-details-component'}>
            <>
                {
                    !medicalInterventionId && (
                        <StatusCardComponent title={'Medical Intervention Id is missing cannot fetch details'}/>)
                }
            </>
            <>
                {
                    medicalInterventionId && <>
                        {
                            isClientMedicalInterventionDetailsLoading && <div><LoaderComponent/></div>
                        }
                        {
                            isClientMedicalInterventionDetailsLoadingFailed &&
                            <StatusCardComponent title={'Failed to load medical intervention details'}/>
                        }
                        {
                            (isClientMedicalInterventionDetailsLoaded && clientMedicalInterventionDetails) && <>
                                <div className={'client-medical-intervention-details-wrapper'}>
                                    <FormControlLabelComponent className={'soap-note-heading'} label={'SOAP Note'}/>
                                    <CardComponent title={'Subjective (S)'}>
                                        {clientMedicalInterventionDetails?.subjective || "-"}
                                    </CardComponent>
                                    <CardComponent title={'Objective (O)'}>

                                        <div className={'observation-wrapper'}> Observation:</div>
                                        <div>{clientMedicalInterventionDetails?.objective.observation || "-"}</div>

                                        <div className={'objective-table-wrapper'}>
                                            <FormControlLabelComponent className={'range-of-motion-label'}
                                                                       label={'Range of Motion and Strength:'}/>
                                            <CardComponent
                                                title={clientMedicalInterventionDetails?.rom_config?.map((body_details: any) => {
                                                    return <div>Body Part : {body_details?.body_part_details?.name || "-"}</div>
                                                })}>
                                                <TableComponent data={clientMedicalInterventionDetails.rom_config}
                                                                bordered={true}
                                                                showExpandColumn={false}
                                                                defaultExpandAllRows={false}
                                                                expandRow={(row: any) => {
                                                                    return <>{row.rom_config.map((config: any) => {
                                                                        return <div key={config?._id} className={'comment-row'}>
                                                                            <div className={'comment-icon'}><ImageConfig.CommentIcon/></div>
                                                                            <div>{config?.config?.comments || "-"}</div>
                                                                        </div>
                                                                    })}</>
                                                                    }
                                                                }
                                                                columns={ClientMedicalInterventionDetailsColumn}/>
                                            </CardComponent>

                                        </div>
                                        <div className={'special-test'}>
                                            <FormControlLabelComponent className={'special-test-label'}
                                                                       label={'Special Test:'}/>
                                            <CardComponent
                                                title={clientMedicalInterventionDetails?.rom_config?.map((body_details: any) => {
                                                    return <div>Body Part : {body_details?.body_part_details?.name || "-"}</div>
                                                })}>
                                                <TableComponent data={clientMedicalInterventionDetails?.special_tests}
                                                                columns={specialDetailsColumns}
                                                                bordered={true}/>

                                            </CardComponent>
                                        </div>
                                        <div className={'medical-details-wrapper'}>
                                            <div className={'observation-wrapper'}>Palpation:</div>
                                            <div>{clientMedicalInterventionDetails?.objective?.palpation || "-"}</div>
                                        </div>
                                        <div className={'medical-details-wrapper'}>
                                            <div className={'observation-wrapper'}>Functional Test:</div>
                                            <div>{clientMedicalInterventionDetails?.objective?.functional_tests || "-"}</div>
                                        </div>

                                        <div className={'medical-details-wrapper'}>
                                            <div className={'observation-wrapper'}>Treatment:</div>
                                            <div>{clientMedicalInterventionDetails?.objective?.treatment || "-"}</div>
                                        </div>
                                        <div className={'medical-details-wrapper'}>
                                            <div className={'observation-wrapper'}>Response to Treatment:</div>
                                            <div>{clientMedicalInterventionDetails?.objective?.treatment_response || "-"}</div>
                                        </div>
                                    </CardComponent>
                                    <CardComponent title={'Assessment (A)'}>
                                        <div className={'assessment-table-wrapper'}>
                                            <FormControlLabelComponent className={'medical-diagnosis-label'}
                                                                       label={'Medical Diagnosis/ICD-11 Codes:'}/>
                                            <TableComponent data={clientMedicalInterventionDetails.linked_icd_codes}
                                                            bordered={true} columns={ICDTableColumns}/>
                                        </div>
                                        <div className={'medical-details-wrapper'}>
                                            <div className={'index-of-suspicion'}>Index of Suspicion:</div>
                                            <div>{clientMedicalInterventionDetails?.assessment?.suspicion_index || "-"}</div>
                                        </div>
                                        <div className={'medical-details-wrapper'}>
                                            <div className={'observation-wrapper'}>Surgery Procedure Complete:</div>
                                            <div>{clientMedicalInterventionDetails?.assessment?.surgery_procedure || "-"}</div>
                                        </div>
                                    </CardComponent>
                                    <CardComponent title={'Plan (P)'}>
                                        <div className={'medical-details-wrapper'}>
                                            <div className={'observation-wrapper'}>Plan:</div>
                                            <div> {clientMedicalInterventionDetails?.plan?.plan || "-"}</div>
                                        </div>
                                        <div className={'medical-details-wrapper'}>
                                            <div className={'observation-wrapper'}>MD Recommendations:</div>
                                            <div> {clientMedicalInterventionDetails?.plan?.md_recommendations || "-"}</div>
                                        </div>
                                        <div className={'medical-details-wrapper'}>
                                            <div className={'observation-wrapper'}>Education:</div>
                                            <div> {clientMedicalInterventionDetails?.plan?.education || "-"}</div>
                                        </div>
                                        <div className={'medical-details-wrapper'}>
                                            <div className={'observation-wrapper'}>Treatment:</div>
                                            <div>{clientMedicalInterventionDetails?.plan?.treatment_goals || "-"}</div>
                                        </div>
                                        <div className={'signature-wrapper'}>
                                            <div className={'signature-container'}>
                                                <img width="200" height="50" src={currentUser?.signature_url || "-"}/>
                                            </div>
                                        </div>
                                        <div className={'electronic-sign'}>Electronically signed on
                                            : {CommonService.transformTimeStamp(clientMedicalInterventionDetails?.signed_on) || "-"}</div>

                                    </CardComponent>
                                </div>

                            </>
                        }
                    </>

                }
            </>
        </div>
    );

};

export default ClientMedicalInterventionDetailsComponent;