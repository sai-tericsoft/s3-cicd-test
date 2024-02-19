import "./MedicalInterventionICDCodesScreen.scss";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {ImageConfig} from "../../../constants";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {getMedicalInterventionDetails} from "../../../store/actions/chart-notes.action";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {ITableColumn} from "../../../shared/models/table.model";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import {getClientMedicalRecord} from "../../../store/actions/client.action";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import TableV2Component from "../../../shared/components/table-v2/TableV2Component";
import IconButtonComponent from "../../../shared/components/icon-button/IconButtonComponent";
import IcdCodingToolComponent from "../../../shared/components/icd-coding-tool/IcdCodingToolComponent";
import ModalComponent from "../../../shared/components/modal/ModalComponent";
import TextAreaComponent from "../../../shared/components/form-controls/text-area/TextAreaComponent";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import MedicalInterventionDetailsCardComponent
    from "../medical-intervention-details-card/MedicalInterventionDetailsCardComponent";

interface MedicalInterventionICDCodesScreenProps {

}

// const ICDCodesSteps: any = ["icdCodes", "favourites"];

const MedicalInterventionICDCodesScreen = (props: MedicalInterventionICDCodesScreenProps) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        isMedicalInterventionDetailsLoading,
        isMedicalInterventionDetailsLoaded,
        isMedicalInterventionDetailsLoadingFailed,
        medicalInterventionDetails
    } = useSelector((state: IRootReducerState) => state.chartNotes);
    const {medicalRecordId, medicalInterventionId} = useParams();
    const [searchParams] = useSearchParams();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const {
        clientMedicalRecord,
    } = useSelector((state: IRootReducerState) => state.client);
    const last_position: any = searchParams.get("last_position");
    const [openIframe, setOpenIframe] = useState<boolean>(false);

    const [selectedICDCodes, setSelectedICDCodes] = useState<any[]>([]);

    useEffect(() => {
        if (medicalInterventionId) {
            dispatch(getMedicalInterventionDetails(medicalInterventionId));
        }
    }, [medicalInterventionId, dispatch]);

    useEffect(() => {
        if (medicalRecordId) {
            dispatch(getClientMedicalRecord(medicalRecordId));
        }
    }, [dispatch, medicalRecordId]);


    const linkICDCodesToIntervention = useCallback((codes: string[], mode: 'add' | 'edit' = 'add') => {
        if (!medicalInterventionId || !medicalRecordId) {
            CommonService._alert.showToast('InterventionId not found!', "error");
            return;
        }
        const tempCodes: any[] = [];
        codes.forEach((code: any) => {
            tempCodes.push({
                icd_code: code?.icd_code,
                description: code?.description,
            })
        });
        setIsSubmitting(true);
        CommonService._chartNotes.AddMedicalInterventionICDCodesAPICall(medicalInterventionId, {
            "icd_codes": tempCodes,
            "mode": mode
        })
            .then((response: IAPIResponseType<any>) => {
                // CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                // if (medicalInterventionDetails?.status === 'completed') {
                //     navigate(CommonService._routeConfig.ViewMedicalIntervention(medicalRecordId, medicalInterventionId));
                // } else {
                navigate(CommonService._routeConfig.UpdateMedicalIntervention(medicalRecordId, medicalInterventionId) + `?last_position=${last_position}`);
                // }
            })
            .catch((error: any) => {
                CommonService._alert.showToast(error, "error");
            })
            .finally(() => {
                setIsSubmitting(false);
            })
    }, [medicalInterventionId, medicalRecordId, navigate, last_position])


    useEffect(() => {
        if (medicalRecordId && medicalInterventionId) {
            const referrer: any = searchParams.get("referrer");
            dispatch(setCurrentNavParams("ICD codes", null, () => {
                if (referrer) {
                    navigate(CommonService._routeConfig.UpdateMedicalIntervention(medicalRecordId, medicalInterventionId) + '?referrer=' + referrer + `&last_position=${last_position}`);
                } else {
                    navigate(CommonService._routeConfig.UpdateMedicalIntervention(medicalRecordId, medicalInterventionId) + `?last_position=${last_position}`);
                }
            }));

        }
    }, [navigate, dispatch, medicalRecordId, medicalInterventionId, searchParams, last_position]);

    const selectedICDCodesColumns: ITableColumn[] = useMemo(() => [
        {
            title: 'ICD Code',
            dataIndex: 'icd_code',
            key: 'icd_code',
            width: 180,
            // fixed: 'left',
            // align: 'left',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 650,
            render: (_: any, value: any) => {
                return <div className={'description-wrapper'}>
                    {
                        value?.mode === 'edit' ?
                            <TextAreaComponent
                                label={''}
                                value={value?.description}
                                disabled={false}
                                onChange={(text: string) => {
                                    setSelectedICDCodes(selectedICDCodes.map((code) => {
                                            if (code?.icd_code === value?.icd_code) {
                                                code.description = text;
                                            }
                                            return code;
                                        }
                                    ))
                                }
                                }
                                fullWidth={true}
                            /> :
                            <div className={'description'}>
                                {value?.description}
                                <IconButtonComponent
                                    onClick={() => {
                                        setSelectedICDCodes(selectedICDCodes.map((code) => {
                                                if (code?.icd_code === value?.icd_code) {
                                                    code.mode = 'edit';
                                                }
                                                return code;

                                            }
                                        ))
                                    }}>
                                    <ImageConfig.EditIcon/>
                                </IconButtonComponent>
                            </div>
                    }
                </div>
            }
        },
        {
            key: 'actions',
            title: 'Action',
            dataIndex: 'actions',
            align: "center",
            width: 100,
            render: (_: any, record: any) => (
                <ButtonComponent
                    color={"error"}
                    variant={'outlined'}
                    prefixIcon={<ImageConfig.CrossOutlinedIcon/>}
                    onClick={() => {
                        setSelectedICDCodes(selectedICDCodes.filter((code) => code?.icd_code !== record?.icd_code));
                    }}
                >
                    Remove
                </ButtonComponent>
            )
        }
    ], [selectedICDCodes]);

    useEffect(() => {
        if (medicalInterventionDetails) {
            setSelectedICDCodes((medicalInterventionDetails?.linked_icd_codes || []).map((v: any) => {
                return {
                    icd_code: v?.icd_code,
                    description: v?.description,
                    mode: 'view'
                }
            }));
        }
    }, [medicalInterventionDetails]);

    const handleCancel = useCallback(() => {
        if (medicalRecordId && medicalInterventionId) {
            navigate(CommonService._routeConfig.UpdateMedicalIntervention(medicalRecordId, medicalInterventionId) + `?last_position=${last_position}`);
        }
    }, [navigate, medicalRecordId, medicalInterventionId, last_position]);

    return (
        <div className={'medical-intervention-icd-codes-screen'}>
            <FormControlLabelComponent label={"Medical Diagnosis/ICD Codes"} size={'xl'}/>
            {
                isMedicalInterventionDetailsLoading && <LoaderComponent/>
            }
            {
                isMedicalInterventionDetailsLoadingFailed && <StatusCardComponent title={'Failed to load data'}/>
            }
            {
                (isMedicalInterventionDetailsLoaded && clientMedicalRecord) && <>
                    {/*<CardComponent color={'primary'}>*/}
                    {/*    <div className={'client-name-button-wrapper'}>*/}
                    {/*                <span className={'client-name-wrapper'}>*/}
                    {/*                    <span className={'client-name'}>*/}
                    {/*                        <span*/}
                    {/*                            className={clientMedicalRecord?.client_details?.is_alias_name_set ? 'alias-name' : ''}>*/}
                    {/*                            {commonService.generateClientNameFromClientDetails(clientMedicalRecord?.client_details || {})}*/}
                    {/*                        </span>*/}
                    {/*                    </span>*/}
                    {/*                    <ChipComponent*/}
                    {/*                        className={clientMedicalRecord?.status === "open" ? "active" : "inactive"}*/}
                    {/*                        size={'small'}*/}
                    {/*                        label={clientMedicalRecord?.status_details.title || "-"}/>*/}
                    {/*                </span>*/}
                    {/*    </div>*/}
                    {/*    <MedicalInterventionLinkedToComponent medicalRecordDetails={clientMedicalRecord}/>*/}
                    {/*    <div className={'ts-row'}>*/}
                    {/*        <div className={'ts-col-6'}>*/}
                    {/*            <DataLabelValueComponent label={'Date of Intervention'}>*/}
                    {/*                {CommonService.getSystemFormatTimeStamp(clientMedicalRecord?.created_at || "N/A")}*/}
                    {/*            </DataLabelValueComponent>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</CardComponent>*/}
                    <MedicalInterventionDetailsCardComponent medicalInterventionDetails={medicalInterventionDetails}
                                                             mode={"edit"}
                                                             showAction={false}/>
                </>
            }
            <CardComponent className={'icd-table-wrapper'}>
                <div className={'icd-codes-sub-title-and-actions-wrapper'}>
                    <div className={'icd-codes-sub-title'}>
                        Selected ICD Code(s)
                    </div>
                    <div
                        className={isMedicalInterventionDetailsLoading ? "icd-screen-actions-wrapper mrg-top-15" : "icd-screen-actions-wrapper"}>
                        <ButtonComponent
                            prefixIcon={<ImageConfig.AddIcon/>}
                            className={'white-space-nowrap'}
                            type={"button"}
                            onClick={
                                () => {
                                    setOpenIframe(true)
                                }
                            }
                        >
                            ICD Coding Tool
                        </ButtonComponent>
                        <ButtonComponent
                            prefixIcon={<ImageConfig.CrossOutlinedIcon/>}
                            className={'white-space-nowrap'}
                            type={"button"}
                            disabled={selectedICDCodes.length === 0}
                            onClick={
                                () => {
                                    setSelectedICDCodes([]);
                                }
                            }
                            variant={"outlined"}
                            color={"error"}
                        >
                            Clear All Code(s)
                        </ButtonComponent>
                    </div>
                </div>
                <TableV2Component
                    data={selectedICDCodes}
                    columns={selectedICDCodesColumns}
                    noDataText={<div className={'no-data-text'}>No ICD Code Selected</div>}
                />
            </CardComponent>

            <div className="text-center d-flex align-items-center justify-content-center mrg-top-30">
                <ButtonComponent variant={"outlined"}
                                 onClick={handleCancel}
                                 disabled={isSubmitting}
                >
                    Cancel
                </ButtonComponent>

                &nbsp;
                <ButtonComponent type={"button"}
                                 className={'mrg-left-15'}
                                 onClick={() => {
                                     linkICDCodesToIntervention(
                                         selectedICDCodes,
                                         (medicalInterventionDetails.linked_icd_codes || []).length === 0 ? 'add' : 'edit'
                                     )
                                 }}
                                 disabled={isSubmitting}
                                 isLoading={isSubmitting}
                >
                    Save
                </ButtonComponent>
            </div>
            <ModalComponent
                isOpen={openIframe}
                onClose={() => setOpenIframe(false)}
                size={'xl'}
            >
                <IcdCodingToolComponent onCodeSelect={(selectedIcdCode: any) => {
                    //check before adding
                    if (selectedICDCodes.find((code) => code?.icd_code === selectedIcdCode.code)) {
                        CommonService._alert.showToast('ICD Code already added', "error");
                        return;
                    }
                    setSelectedICDCodes([...selectedICDCodes, {
                        icd_code: selectedIcdCode.code,
                        description: selectedIcdCode.selectedText
                    }]);
                }}/>
            </ModalComponent>
        </div>
    );

};

export default MedicalInterventionICDCodesScreen;
