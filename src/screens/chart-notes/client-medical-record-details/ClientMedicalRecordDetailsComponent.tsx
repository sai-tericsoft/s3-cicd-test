import "./ClientMedicalRecordDetailsComponent.scss";
import MedicalRecordBasicDetailsCardComponent
    from "../medical-record-basic-details-card/MedicalRecordBasicDetailsCardComponent";
import MedicalInterventionListComponent from "../medical-intervention-list/MedicalInterventionListComponent";
import MedicalRecordAttachmentListComponent
    from "../medical-record-attachment-list/MedicalRecordAttachmentListComponent";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import {useCallback, useEffect, useState} from "react";
import TabsWrapperComponent, {
    TabComponent,
    TabContentComponent,
    TabsComponent
} from "../../../shared/components/tabs/TabsComponent";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import {ImageConfig, Misc} from "../../../constants";
import moment from "moment/moment";
import {getMedicalInterventionList} from "../../../store/actions/chart-notes.action";
import {IRootReducerState} from "../../../store/reducers";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";

interface ClientMedicalDetailsComponentProps {

}

type MedicalListTabType = "medicalRecord" | "attachmentList";

const MedicalListTabTypes: any = ["medicalRecord", "attachmentList"];

const ClientMedicalRecordDetailsComponent = (props: ClientMedicalDetailsComponentProps) => {
    const [currentTab, setCurrentTab] = useState<MedicalListTabType>("medicalRecord");
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const {medicalRecordId} = useParams();
    const dispatch = useDispatch();
    const {
        medicalInterventionList,
        isMedicalInterventionListLoading,
    } = useSelector((state: IRootReducerState) => state.chartNotes);
    const [isMedicalInterventionBeingAdded, setIsMedicalInterventionBeingAdded] = useState<boolean>(false);
    const [isMedicalInterventionBeingRepeated, setIsMedicalInterventionBeingRepeated] = useState<boolean>(false);

    const {
        clientMedicalRecord,
    } = useSelector((state: IRootReducerState) => state.client);

    const handleTabChange = useCallback((e: any, value: any) => {
        searchParams.set("activeTab", value);
        setSearchParams(searchParams);
        setCurrentTab(value);
    }, [searchParams, setSearchParams]);

    useEffect(() => {
        const step: MedicalListTabType = searchParams.get("activeTab") as MedicalListTabType;
        if (step && MedicalListTabTypes.includes(step)) {
            setCurrentTab(step);
        } else {
            searchParams.set("activeTab", MedicalListTabTypes[0]);
            setSearchParams(searchParams);
        }
    }, [dispatch, searchParams, setSearchParams]);

    const repeatLastTreatment = useCallback(
        (medicalRecordId: string) => {
            setIsMedicalInterventionBeingRepeated(true);
            CommonService._chartNotes.RepeatLastInterventionAPICall(medicalRecordId, {
                    "repeat_previous": true //todo: Why Swetha ????
                }
            ).then((response: IAPIResponseType<any>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                navigate(CommonService._routeConfig.UpdateMedicalIntervention(medicalRecordId, response?.data._id) + '?showClear=true');
                setIsMedicalInterventionBeingRepeated(false);
            }).catch((error: any) => {
                CommonService._alert.showToast(error?.error || "Error repeating last medical intervention", "error");
                setIsMedicalInterventionBeingRepeated(false);
            });
        },
        [navigate],
    );
    const confirmRepeatLastTreatment = useCallback(
        () => {
            if (!medicalRecordId) {
                CommonService._alert.showToast('Medical Record ID not found!', "error");
                return;
            }
            CommonService.onConfirm({
                confirmationTitle: "REPEAT LAST TREATMENT",
                image: ImageConfig.REPEAT_LAST_INTERVENTION,
                confirmationSubTitle: "Do you want to repeat the last treatment\nfrom the same Medical Record?"
            })
                .then((value) => {
                    repeatLastTreatment(medicalRecordId);
                })
                .catch(reason => {

                })
        },
        [medicalRecordId, repeatLastTreatment],
    );
    const addNewTreatment = useCallback(
        () => {
            if (!medicalRecordId) {
                CommonService._alert.showToast('Medical Record ID not found!', "error");
                return;
            }
            const payload = {
                "intervention_date": moment().format('YYYY-MM-DD'),
                "subjective": "",
                "objective": {
                    "observation": "",
                    "palpation": "",
                    "functional_tests": "",
                    "treatment": "",
                    "treatment_response": ""
                },
                "assessment": {
                    "suspicion_index": "",
                    "surgery_procedure": ""
                },
                "plan": {
                    "plan": "",
                    "md_recommendations": "",
                    "education": "",
                    "treatment_goals": ""
                },
                is_discharge: false,
            };
            setIsMedicalInterventionBeingAdded(true);
            CommonService._chartNotes.AddNewMedicalInterventionAPICall(medicalRecordId, payload)
                .then((response: IAPIResponseType<any>) => {
                    CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                    navigate(CommonService._routeConfig.UpdateMedicalIntervention(medicalRecordId, response?.data._id));
                    setIsMedicalInterventionBeingAdded(false);
                })
                .catch((error: any) => {
                    CommonService._alert.showToast(error?.error || "Error creating a medical intervention", "error");
                    setIsMedicalInterventionBeingAdded(false);
                });
        },
        [medicalRecordId, navigate],
    );

    useEffect(() => {
        if (medicalRecordId) {
            dispatch(getMedicalInterventionList(medicalRecordId));
        }
    }, [dispatch, medicalRecordId]);

    return (
        <div className={'client-medical-record-details-component'}>
            <PageHeaderComponent title={"Medical Record Main Page"} className={'mrg-left-10'}/>
            <MedicalRecordBasicDetailsCardComponent showAction={true}/>
            <div className={'client-medical-records-header-button-wrapper'}>
            {clientMedicalRecord?.status_details?.code === 'open' && <div>
                <ButtonComponent onClick={confirmRepeatLastTreatment}
                                 // disabled={(isMedicalInterventionBeingRepeated || isMedicalInterventionListLoading || medicalInterventionList.filter((item: any) => (item?.status === 'completed' && item?.note_type?.toLowerCase() === "soap note"))?.length === 0)}
                                 className={'mrg-right-10'}
                                 variant={"outlined"}>
                    Repeat Last Treatment
                </ButtonComponent>
                <ButtonComponent onClick={addNewTreatment}
                                 disabled={isMedicalInterventionBeingAdded}
                                 isLoading={isMedicalInterventionBeingAdded}
                                 prefixIcon={<ImageConfig.AddIcon/>}>
                    Add New Treatment
                </ButtonComponent>
            </div>}
            </div>
            <TabsWrapperComponent>
                <TabsComponent value={currentTab} onUpdate={handleTabChange} variant={"fullWidth"}
                               allowScrollButtonsMobile={false}>

                    <TabComponent label={'Medical Record'} className={'tab-heading'} value={"medicalRecord"}/>
                    <TabComponent label={'Attachments'}  className={'tab-heading'}  value={"attachmentList"}/>

                </TabsComponent>
                <TabContentComponent value={"medicalRecord"} selectedTab={currentTab}>
                    <MedicalInterventionListComponent/>
                </TabContentComponent>
                <TabContentComponent value={"attachmentList"} selectedTab={currentTab}>
                    <MedicalRecordAttachmentListComponent/>
                </TabContentComponent>
            </TabsWrapperComponent>

        </div>
    );

};

export default ClientMedicalRecordDetailsComponent;
