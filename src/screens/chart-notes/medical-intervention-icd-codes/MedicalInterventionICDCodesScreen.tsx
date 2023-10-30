import "./MedicalInterventionICDCodesScreen.scss";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import React, {useCallback, useEffect, useState} from "react";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {Misc} from "../../../constants";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {getMedicalInterventionDetails} from "../../../store/actions/chart-notes.action";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {ITableColumn} from "../../../shared/models/table.model";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {ClearSharp, DeleteOutline} from "@mui/icons-material";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import MedicalInterventionLinkedToComponent
    from "../medical-intervention-linked-to/MedicalInterventionLinkedToComponent";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import {getClientMedicalRecord} from "../../../store/actions/client.action";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import DrawerComponent from "../../../shared/components/drawer/DrawerComponent";
import TableV2Component from "../../../shared/components/table-v2/TableV2Component";
import IconButtonComponent from "../../../shared/components/icon-button/IconButtonComponent";
import IcdCodingToolComponent from "../../../shared/components/icd-coding-tool/IcdCodingToolComponent";
import commonService from "../../../shared/services/common.service";

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
        setIsSubmitting(true);
        CommonService._chartNotes.AddMedicalInterventionICDCodesAPICall(medicalInterventionId, {
            "icd_codes": codes,
            "mode": mode
        })
            .then((response: IAPIResponseType<any>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
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

    const selectesICDCodesColumns: ITableColumn[] = [
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
        },
        {
            key: 'actions',
            title: 'Action',
            dataIndex: 'actions',
            align: "center",
            width: 100,
            fixed: 'right',
            render: (_: any, record: any) => (
                <IconButtonComponent
                    size={"large"}
                    type={"button"}
                    onClick={() => {
                        setSelectedICDCodes(selectedICDCodes.filter((code) => code?.icd_code !== record?.icd_code));
                    }}
                >
                    <DeleteOutline color={"error"} fontSize={"inherit"}/>
                </IconButtonComponent>
            )
        }
    ]

    useEffect(() => {
        if (medicalInterventionDetails) {
            setSelectedICDCodes((medicalInterventionDetails?.linked_icd_codes || []).map((v: any) => v));
        }
    }, [medicalInterventionDetails]);

    return (
        <div className={'medical-intervention-icd-codes-screen'}>
            <PageHeaderComponent title={'Add ICD Code'}/>
            {
                isMedicalInterventionDetailsLoading && <LoaderComponent/>
            }
            {
                isMedicalInterventionDetailsLoadingFailed && <StatusCardComponent title={'Failed to load data'}/>
            }
            {
                (isMedicalInterventionDetailsLoaded && clientMedicalRecord) && <>
                    <CardComponent color={'primary'}>
                        <div className={'client-name-button-wrapper'}>
                                    <span className={'client-name-wrapper'}>
                                        <span className={'client-name'}>
                                            <span
                                                className={clientMedicalRecord?.client_details?.is_alias_name_set ? 'alias-name' : ''}>
                                                {commonService.generateClientNameFromClientDetails(clientMedicalRecord?.client_details || {})}
                                            </span>
                                        </span>
                                        <ChipComponent
                                            className={clientMedicalRecord?.status === "open" ? "active" : "inactive"}
                                            size={'small'}
                                            label={clientMedicalRecord?.status_details.title || "-"}/>
                                    </span>
                        </div>
                        <MedicalInterventionLinkedToComponent medicalRecordDetails={clientMedicalRecord}/>
                        <div className={'ts-row'}>
                            <div className={'ts-col-6'}>
                                <DataLabelValueComponent label={'Date of Intervention'}>
                                    {CommonService.getSystemFormatTimeStamp(clientMedicalRecord?.created_at || "N/A")}
                                </DataLabelValueComponent>
                            </div>
                        </div>
                    </CardComponent>
                </>
            }
            <div className={'icd-codes-sub-title-and-actions-wrapper'}>
                <div className={'icd-codes-sub-title'}>
                    Selected ICD Code(s)
                </div>
                <div className="icd-screen-actions-wrapper">
                    <ButtonComponent
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
                        <ClearSharp/> Clear ICD Codes
                    </ButtonComponent>
                </div>
            </div>
            <TableV2Component
                data={selectedICDCodes}
                columns={selectesICDCodesColumns}
                noDataText={"No ICD Codes selected"}
            />

            <div className="text-center d-flex align-items-center justify-content-center">
                {(medicalRecordId && medicalInterventionId) && <LinkComponent
                    route={CommonService._routeConfig.UpdateMedicalIntervention(medicalRecordId, medicalInterventionId) + `?last_position=${last_position}`}>
                    <ButtonComponent variant={"outlined"}
                                     size={"large"}
                                     className={isSubmitting ? 'mrg-right-15' : ''}
                                     disabled={isSubmitting}
                    >
                        Cancel
                    </ButtonComponent>
                </LinkComponent>}
                &nbsp;&nbsp;
                <ButtonComponent type={"button"}
                                 size={"large"}
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
            <DrawerComponent
                isOpen={openIframe}
                onClose={() => setOpenIframe(false)}
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
            </DrawerComponent>
        </div>
    );

};

export default MedicalInterventionICDCodesScreen;
