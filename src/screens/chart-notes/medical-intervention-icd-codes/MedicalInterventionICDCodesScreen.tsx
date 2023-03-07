import "./MedicalInterventionICDCodesScreen.scss";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import React, {useCallback, useEffect, useState} from "react";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {APIConfig, ImageConfig, Misc} from "../../../constants";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {getMedicalInterventionDetails} from "../../../store/actions/chart-notes.action";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import TabsWrapperComponent, {
    TabComponent,
    TabContentComponent,
    TabsComponent
} from "../../../shared/components/tabs/TabsComponent";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";
import {ITableColumn} from "../../../shared/models/table.model";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {ClearSharp} from "@mui/icons-material";
import SearchComponent from "../../../shared/components/search/SearchComponent";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import CheckBoxComponent from "../../../shared/components/form-controls/check-box/CheckBoxComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import MedicalInterventionLinkedToComponent
    from "../medical-intervention-linked-to/MedicalInterventionLinkedToComponent";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import {getClientMedicalRecord} from "../../../store/actions/client.action";

interface MedicalInterventionICDCodesScreenProps {

}

const ICDCodesSteps: any = ["icdCodes", "favourites"];

const MedicalInterventionICDCodesScreen = (props: MedicalInterventionICDCodesScreenProps) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {medicalInterventionDetails} = useSelector((state: IRootReducerState) => state.chartNotes);
    const {medicalRecordId, medicalInterventionId} = useParams();
    const {
        clientMedicalRecord,
    } = useSelector((state: IRootReducerState) => state.client);

    useEffect(() => {
        if (medicalInterventionId) {
            dispatch(getMedicalInterventionDetails(medicalInterventionId));
        }
    }, [medicalInterventionId, dispatch]);

    useEffect(() => {
        if (medicalRecordId) {
            dispatch(setCurrentNavParams("Medical Record details", null, () => {
                navigate(CommonService._routeConfig.ClientMedicalRecordDetails(medicalRecordId));
            }));
        }
    }, [navigate, dispatch, medicalRecordId]);

    useEffect(() => {
        if (medicalRecordId) {
            dispatch(getClientMedicalRecord(medicalRecordId));
        }
    }, [dispatch, medicalRecordId]);

    const [selectedICDCodes, setSelectedICDCodes] = useState<any[]>([]);
    const [searchICDCodes, setSearchICDCodes] = useState<any>({
        search: "",
    });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
                if (medicalInterventionDetails?.status === 'completed') {
                    navigate(CommonService._routeConfig.ViewMedicalIntervention(medicalRecordId, medicalInterventionId));
                } else {
                    navigate(CommonService._routeConfig.UpdateMedicalIntervention(medicalRecordId, medicalInterventionId));
                }
            })
            .catch((error: any) => {
                CommonService._alert.showToast(error, "error");
            })
            .finally(() => {
                setIsSubmitting(false);
            })
    }, [medicalInterventionId, medicalInterventionDetails, medicalRecordId, navigate])

    const [currentTab, setCurrentTab] = useState<any>("icdCodes");
    const [searchParams, setSearchParams] = useSearchParams();
    const [refreshToken, setRefreshToken] = useState<string>('');

    useEffect(() => {
        let currentTab: any = searchParams.get("currentStep");
        if (currentTab) {
            if (!ICDCodesSteps.includes(currentTab)) {
                currentTab = "icdCodes";
            }
        } else {
            currentTab = "icdCodes";
        }
        setCurrentTab(currentTab);
    }, [searchParams]);

    const handleTabChange = useCallback((e: any, value: any) => {
        searchParams.set("currentStep", value);
        setSearchParams(searchParams);
        setCurrentTab(value);
    }, [searchParams, setSearchParams]);


    const codeListColumns: ITableColumn[] = [
        {
            key: 'select',
            title: '',
            dataIndex: 'select',
            width: 90,
            render: (item: any, record: any) => {
                return <CheckBoxComponent label={""} checked={selectedICDCodes.includes(record?._id)}
                                          onChange={(isChecked) => {
                                              if (isChecked) {
                                                  setSelectedICDCodes([...selectedICDCodes, record?._id]);
                                              } else {
                                                  setSelectedICDCodes(selectedICDCodes.filter((code) => code !== record?._id));
                                              }
                                          }}/>

            }
        },
        {
            title: 'ICD-11 Codes',
            dataIndex: 'icd_code',
            key: 'icd_code',
            width: 120,
            fixed: 'left',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 250,
        },
        {
            title: 'Mark as Favourite',
            dataIndex: 'is_fav',
            key: 'favorite',
            fixed: 'right',
            align: 'center',
            width: 120,
            render: (_: any, item: any) => {
                return <span>
                    {
                        !item?.is_fav &&
                        <div className={'star-icon'} onClick={() => addFavouriteList(item?._id)}>
                            <ImageConfig.StarIcon/>
                        </div>
                    }
                    {
                        item?.is_fav &&
                        <div className={'star-icon'} onClick={() => removeFavouriteCode(item?._id)}>
                            <ImageConfig.FilledStarIcon/></div>
                    }
               </span>
            }
        }
    ];
    const favouriteICDCodesColumns: ITableColumn[] = [
        {
            key: 'select',
            title: '',
            dataIndex: 'select',
            width: 90,
            render: (item: any, record: any) => {
                return <CheckBoxComponent label={""} checked={selectedICDCodes.includes(record?.icd_code_id)}
                                          onChange={(isChecked) => {
                                              if (isChecked) {
                                                  setSelectedICDCodes([...selectedICDCodes, record?.icd_code_id]);
                                              } else {
                                                  setSelectedICDCodes(selectedICDCodes.filter((code) => code !== record?.icd_code_id));
                                              }
                                          }}/>

            }

        },
        {
            title: 'ICD-11 Codes',
            dataIndex: 'icd_code',
            key: 'icd_code',
            width: 120,
            fixed: 'left',
            render: (_: any, item: any) => {
                return <>{item?.icd_code_details?.icd_code}</>
            }
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 250,
            render: (_: any, item: any) => {
                return <>{item?.icd_code_details?.description}</>
            }
        },
        {
            title: ' Favourite Code(s)',
            dataIndex: 'favourite',
            key: 'favorite',
            fixed: 'right',
            align: 'center',
            width: 120,
            render: (_: any, item: any) => {
                return <span onClick={() => removeFavouriteCode(item?.icd_code_id)}>
                  <ImageConfig.FilledStarIcon className={'star-icon-favourite'}/>
               </span>
            }
        }
    ];

    const addFavouriteList = useCallback((codeId: string) => {
        CommonService._client.AddFavouriteCode(codeId, {})
            .then((response: IAPIResponseType<any>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setRefreshToken(Math.random().toString(36).substring(7));
            })
            .catch((error: any) => {
                CommonService._alert.showToast(error, "error");
            })
    }, []);

    const removeFavouriteCode = useCallback((codeId: any) => {
        CommonService._client.RemoveFavouriteCode(codeId, {})
            .then((response: IAPIResponseType<any>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                setRefreshToken(Math.random().toString(36).substring(7));
            })
            .catch((error: any) => {
                CommonService._alert.showToast(error, "error");
            });
    }, []);

    useEffect(() => {
        if (medicalInterventionDetails) {
            setSelectedICDCodes((medicalInterventionDetails?.linked_icd_codes || []).map((v: any) => v?._id));
        }
    }, [medicalInterventionDetails]);
    return (
        <div className={'medical-intervention-icd-codes-screen'}>
            <PageHeaderComponent title={'Add ICD-11 Code'}/>
            {
                (clientMedicalRecord) && <>
                    <CardComponent color={'primary'}>
                        <div className={'client-name-button-wrapper'}>
                                    <span className={'client-name-wrapper'}>
                                        <span className={'client-name'}>
                                                {clientMedicalRecord?.client_details?.first_name || "-"} {clientMedicalRecord?.client_details?.last_name || "-"}
                                        </span>
                                        <ChipComponent
                                            className={clientMedicalRecord?.status === "open" ? "active" : "inactive"}
                                            size={'small'}
                                            label={clientMedicalRecord?.status || "-"}/>
                                    </span>
                        </div>
                        <MedicalInterventionLinkedToComponent medicalRecordDetails={clientMedicalRecord}/>
                        <div className={'ts-row'}>
                            <div className={'ts-col-6'}>
                                <DataLabelValueComponent label={'Date of Intervention'}>
                                    {CommonService.transformTimeStamp(clientMedicalRecord?.created_at || "N/A")}
                                </DataLabelValueComponent>
                            </div>
                        </div>
                    </CardComponent>
                </>
            }
            <div className="ts-row">
                <div className="ts-col ts-col-6">
                    <SearchComponent label={'Search ICD-11 Code'}
                                     placeholder={'Search ICD-11 Code'}
                                     value={searchICDCodes.search}
                                     onSearchChange={(value) => {
                                         setSearchICDCodes({...searchICDCodes, search: value})
                                     }}
                    />
                </div>
                <div className="ts-col-6 text-right">
                    <ButtonComponent
                        className={'white-space-nowrap'}
                        type={"button"}
                        disabled={selectedICDCodes.length === 0}
                        onClick={
                            () => {
                                setSelectedICDCodes([]);
                            }
                        }
                    >
                        <ClearSharp/> Clear ICD-11 Codes
                    </ButtonComponent>
                </div>
            </div>
            <TabsWrapperComponent>
                <TabsComponent
                    value={currentTab}
                    allowScrollButtonsMobile={false}
                    variant={"fullWidth"}
                    onUpdate={handleTabChange}
                >
                    <TabComponent label={'ALL ICD-11 CODES'} value={'icdCodes'}/>
                    <TabComponent label={'FAVOURITES'} value={'favourites'}/>
                </TabsComponent>
                <TabContentComponent value={'icdCodes'} selectedTab={currentTab}>
                    <TableWrapperComponent
                        extraPayload={searchICDCodes}
                        refreshToken={refreshToken}
                        url={APIConfig.ICD_CODE_LIST.URL}
                        method={APIConfig.ICD_CODE_LIST.METHOD}
                        columns={codeListColumns}
                        isPaginated={true}
                        type={"ant"}
                    />
                </TabContentComponent>
                <TabContentComponent value={'favourites'} selectedTab={currentTab}>
                    <TableWrapperComponent
                        extraPayload={searchICDCodes}
                        refreshToken={refreshToken}
                        url={APIConfig.ICD_CODE_FAVOURITE_LIST.URL}
                        method={APIConfig.ICD_CODE_FAVOURITE_LIST.METHOD}
                        columns={favouriteICDCodesColumns}
                        isPaginated={true}
                        type={"ant"}
                    />
                </TabContentComponent>
                <div className="text-center">
                    {(medicalRecordId && medicalInterventionId) && <LinkComponent
                        route={medicalInterventionDetails?.status === 'completed' ? CommonService._routeConfig.ViewMedicalIntervention(medicalRecordId, medicalInterventionId) : CommonService._routeConfig.UpdateMedicalIntervention(medicalRecordId, medicalInterventionId)}>
                        <ButtonComponent variant={"outlined"}
                                         disabled={isSubmitting}
                        >
                            Cancel
                        </ButtonComponent>
                    </LinkComponent>}
                    &nbsp;&nbsp;
                    <ButtonComponent type={"button"}
                                     onClick={() => {
                                         linkICDCodesToIntervention(
                                             selectedICDCodes,
                                             (medicalInterventionDetails.linked_icd_codes || []).length === 0 ? 'add' : 'edit'
                                         )
                                     }}
                                     disabled={selectedICDCodes.length === 0 || isSubmitting}
                                     isLoading={isSubmitting}
                    >
                        Save
                    </ButtonComponent>
                </div>
            </TabsWrapperComponent>
        </div>
    );

};

export default MedicalInterventionICDCodesScreen;
