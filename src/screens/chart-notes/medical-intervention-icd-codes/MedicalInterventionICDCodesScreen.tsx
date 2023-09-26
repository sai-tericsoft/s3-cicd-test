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
import {ClearSharp, DeleteOutline} from "@mui/icons-material";
import SearchComponent from "../../../shared/components/search/SearchComponent";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import CheckBoxComponent from "../../../shared/components/form-controls/check-box/CheckBoxComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import MedicalInterventionLinkedToComponent
    from "../medical-intervention-linked-to/MedicalInterventionLinkedToComponent";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import {getClientMedicalRecord} from "../../../store/actions/client.action";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import DrawerComponent from "../../../shared/components/drawer/DrawerComponent";
import {AddIcon} from "../../../constants/ImageConfig";
import TableV2Component from "../../../shared/components/table-v2/TableV2Component";
import IconButtonComponent from "../../../shared/components/icon-button/IconButtonComponent";

interface MedicalInterventionICDCodesScreenProps {

}

const ICDCodesSteps: any = ["icdCodes", "favourites"];

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
    const [currentTab, setCurrentTab] = useState<any>("icdCodes");
    const [searchParams, setSearchParams] = useSearchParams();
    const [refreshToken, setRefreshToken] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isIcdCodesDrawerOpen, setIsIcdCodesDrawerOpen] = useState<boolean>(false);
    const {
        clientMedicalRecord,
    } = useSelector((state: IRootReducerState) => state.client);
    const last_position: any = searchParams.get("last_position");
    const [openIframe, setOpenIframe] = useState<boolean>(false);

    const [selectedICDCodes, setSelectedICDCodes] = useState<any[]>([]);
    const [searchICDCodes, setSearchICDCodes] = useState<any>({
        search: "",
    });

    console.log("selectedICDCodes", selectedICDCodes);

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
                        setSelectedICDCodes(selectedICDCodes.filter((code) => code?._id !== record?._id));
                    }}
                >
                    <DeleteOutline color={"error"} fontSize={"inherit"}/>
                </IconButtonComponent>
            )
        }
    ]


    const codeListColumns: ITableColumn[] = [
        // {
        //     key: 'select',
        //     title: '',
        //     dataIndex: 'select',
        //     width: 20,
        //     fixed: 'left',
        //     render: (item: any, record: any) => {
        //         return <CheckBoxComponent label={""} checked={selectedICDCodes.includes(record?._id)}
        //                                   onChange={(isChecked) => {
        //                                       if (isChecked) {
        //                                           setSelectedICDCodes([...selectedICDCodes, record?._id]);
        //                                       } else {
        //                                           setSelectedICDCodes(selectedICDCodes.filter((code) => code !== record?._id));
        //                                       }
        //                                   }}/>
        //
        //     }
        // },
        {
            title: 'ICD Codes',
            dataIndex: 'icd_code',
            key: 'icd_code',
            width: 180,
            // fixed: 'left',
            // align: 'left',

            render: (item: any, record: any) => {
                return <div className="icd-code-column">
                    <CheckBoxComponent label={item} checked={selectedICDCodes.some((code) => code?._id === record?._id)}
                                       onChange={(isChecked) => {
                                           if (isChecked) {
                                               setSelectedICDCodes([...selectedICDCodes, record]);
                                           } else {
                                               setSelectedICDCodes(selectedICDCodes.filter((code) => code?._id !== record?._id));
                                           }
                                       }}/>
                </div>

            }

        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 650,
        },
        {
            title: 'Mark as Favourite',
            dataIndex: 'is_fav',
            key: 'favorite',
            fixed: 'right',
            align: 'center',
            width: 220,
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
        // {
        //     key: 'select',
        //     title: '',
        //     dataIndex: 'select',
        //     width: 20,
        //     render: (item: any, record: any) => {
        //         return <CheckBoxComponent label={""} checked={selectedICDCodes.includes(record?.icd_code_id)}
        //                                   onChange={(isChecked) => {
        //                                       if (isChecked) {
        //                                           setSelectedICDCodes([...selectedICDCodes, record?.icd_code_id]);
        //                                       } else {
        //                                           setSelectedICDCodes(selectedICDCodes.filter((code) => code !== record?.icd_code_id));
        //                                       }
        //                                   }}/>
        //
        //     }
        //
        // },
        {
            title: 'ICD Codes',
            dataIndex: 'icd_code',
            key: 'icd_code',
            width: 180,
            fixed: 'left',
            render: (item: any, record: any) => {
                return <CheckBoxComponent label={record?.icd_code_details?.icd_code}
                                          checked={selectedICDCodes.some((code) => code?._id === record?.icd_code_id)}
                                          onChange={(isChecked) => {
                                              if (isChecked) {
                                                  setSelectedICDCodes([...selectedICDCodes, {
                                                      ...record.icd_code_details,
                                                  }]);
                                              } else {
                                                  setSelectedICDCodes(selectedICDCodes.filter((code) => code?._id !== record?.icd_code_id));
                                              }
                                          }}/>
            }

        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 650,
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
            width: 220,
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
                                                {clientMedicalRecord?.client_details?.first_name || "-"} {clientMedicalRecord?.client_details?.last_name || "-"}
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
                    <ButtonComponent
                        className={'white-space-nowrap'}
                        type={"button"}
                        onClick={
                            () => {
                                setIsIcdCodesDrawerOpen(true)
                            }
                        }
                    >
                        <AddIcon/> Add ICD Code
                    </ButtonComponent>
                </div>
            </div>
            <TableV2Component
                data={selectedICDCodes}
                columns={selectesICDCodesColumns}/>
            <div className="text-center">
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
                                         selectedICDCodes.map((code) => code?._id),
                                         (medicalInterventionDetails.linked_icd_codes || []).length === 0 ? 'add' : 'edit'
                                     )
                                 }}
                                 disabled={selectedICDCodes.length === 0 || isSubmitting}
                                 isLoading={isSubmitting}
                >
                    Save
                </ButtonComponent>
            </div>
            <DrawerComponent
                isOpen={openIframe}
                onClose={() => setOpenIframe(false)}
            >
                <iframe
                    src={"https://icd.who.int/ct11/icd11_mms/en/release"}
                    title={'ICD Codes'}
                    className={'icd-iframe'}
                />
            </DrawerComponent>
            <DrawerComponent isOpen={isIcdCodesDrawerOpen}
                             onClose={() => setIsIcdCodesDrawerOpen(false)}
                             showClose={true}
            >
                <div className={'select-icd-codes-drawer'}>
                    <SearchComponent label={'Search'}
                                     placeholder={'Search ICD Code'}
                                     value={searchICDCodes.search}
                                     onSearchChange={(value) => {
                                         setSearchICDCodes({...searchICDCodes, search: value})
                                     }}
                    />
                    <TabsWrapperComponent className={''}>
                        <TabsComponent
                            value={currentTab}
                            allowScrollButtonsMobile={false}
                            variant={"fullWidth"}
                            onUpdate={handleTabChange}
                        >
                            <TabComponent label={'ALL ICD CODES'} value={'icdCodes'}/>
                            <TabComponent label={'FAVOURITES'} value={'favourites'}/>
                        </TabsComponent>
                        <TabContentComponent value={'icdCodes'} selectedTab={currentTab}>
                            <TableWrapperComponent
                                extraPayload={searchICDCodes}
                                refreshToken={refreshToken}
                                url={APIConfig.ICD_CODE_LIST.URL}
                                method={APIConfig.ICD_CODE_LIST.METHOD}
                                columns={codeListColumns}
                                noDataText={'No ICD Codes found for this search'}
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
                    </TabsWrapperComponent>
                </div>
            </DrawerComponent>
        </div>
    );

};

export default MedicalInterventionICDCodesScreen;
