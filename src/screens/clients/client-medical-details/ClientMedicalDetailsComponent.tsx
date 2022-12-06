import "./ClientMedicalDetailsComponent.scss";
import CardComponent from "../../../shared/components/card/CardComponent";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import {CommonService} from "../../../shared/services";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import React from "react";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../constants";

interface ClientMedicalDetailsComponentProps {
    clientId: string;
}

const ClientMedicalDetailsComponent = (props: ClientMedicalDetailsComponentProps) => {

    const {clientId} = props;

    const {
        clientMedicalDetails,
        isClientMedicalDetailsLoading,
        isClientMedicalDetailsLoaded,
        isClientMedicalDetailsLoadingFailed
    } = useSelector((state: IRootReducerState) => state.client);

    return (
        <div className={'client-medical-details-component'}>
            {
                isClientMedicalDetailsLoading && <div>
                    <LoaderComponent/>
                </div>
            }
            {
                isClientMedicalDetailsLoadingFailed &&
                <StatusCardComponent title={"Failed to fetch client Details"}/>
            }
            {
                (isClientMedicalDetailsLoaded && clientMedicalDetails) && <>
                    <CardComponent title={'Personal Habits'} actions={<LinkComponent
                        route={CommonService._client.NavigateToClientEdit(clientId, "personalHabits")}>
                        <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>} size={"small"}>
                            Edit
                        </ButtonComponent>
                    </LinkComponent>
                    }>
                        <div className={'ts-row mrg-bottom-20'}>
                            <div className={'ts-col-lg-8'}>
                                Smoke/Chew Tobacco?
                            </div>
                            <div className={'ts-col-lg-2'}>
                                {clientMedicalDetails?.personal_habits?.["Smoke/Chew Tobacco?"]?.value || "-"}
                            </div>
                            <div className={'ts-col-lg-2'}>
                                {clientMedicalDetails?.personal_habits?.["Smoke/Chew Tobacco?"]?.text ? clientMedicalDetails?.personal_habits?.["Smoke/Chew Tobacco?"]?.text + " Cigarettes/day" : "-"}
                            </div>
                        </div>
                        <div className={'ts-row mrg-bottom-20'}>
                            <div className={'ts-col-lg-8'}>
                                Drink Alcohol?
                            </div>
                            <div className={'ts-col-lg-2'}>
                                {clientMedicalDetails?.personal_habits?.["Drink Alcohol?"]?.value || "-"}
                            </div>
                            <div className={'ts-col-lg-2'}>
                                {clientMedicalDetails?.personal_habits?.["Drink Alcohol?"]?.text ? clientMedicalDetails?.personal_habits?.["Drink Alcohol?"]?.text + " Drinks/day" : "-"}
                            </div>
                        </div>
                        <div className={'ts-row mrg-bottom-20'}>
                            <div className={'ts-col-lg-8'}>
                                Drink Coffee?
                            </div>
                            <div className={'ts-col-lg-2'}>
                                {clientMedicalDetails?.personal_habits?.["Drink Coffee?"]?.value || "-"}
                            </div>
                            <div className={'ts-col-lg-2'}>
                                {clientMedicalDetails?.personal_habits?.["Drink Coffee?"]?.text ? clientMedicalDetails?.personal_habits?.["Drink Coffee?"]?.text + " Cups/day" : "-"}
                            </div>
                        </div>
                        <div className={'ts-row mrg-bottom-20'}>
                            <div className={'ts-col-lg-8'}>
                                Drink Soda/Pop?
                            </div>
                            <div className={'ts-col-lg-2'}>
                                {clientMedicalDetails?.personal_habits?.["Drink Soda/Pop?"]?.value || "-"}
                            </div>
                            <div className={'ts-col-lg-2'}>
                                {clientMedicalDetails?.personal_habits?.["Drink Soda/Pop?"]?.text ? clientMedicalDetails?.personal_habits?.["Drink Soda/Pop?"]?.text + " Cups/day" : "-"}
                            </div>
                        </div>
                    </CardComponent>
                    <CardComponent title={'Allergies'}
                                   actions={<LinkComponent
                                       route={CommonService._client.NavigateToClientEdit(clientId, "allergies")}>
                                       <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>} size={"small"}>
                                           Edit
                                       </ButtonComponent>
                                   </LinkComponent>
                                   }>
                        {clientMedicalDetails?.allergies}
                    </CardComponent>
                    <CardComponent title={'Medication/Supplements'} actions={<LinkComponent
                        route={CommonService._client.NavigateToClientEdit(clientId, "medicalSupplements")}>
                        <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>} size={"small"}>
                            Edit
                        </ButtonComponent>
                    </LinkComponent>
                    }>
                        {clientMedicalDetails?.medications?.prescription_medication || "-"},
                        {clientMedicalDetails?.medications?.non_prescription_medication || "-"}
                    </CardComponent>
                    <CardComponent title={'Medical Provider Information'} actions={<LinkComponent
                        route={CommonService._client.NavigateToClientEdit(clientId, "medicalProvider")}>
                        <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>} size={"small"}>
                            Edit
                        </ButtonComponent>
                    </LinkComponent>
                    }>
                        <div className={'ts-row'}>
                            <div className={'ts-col-lg-3'}>
                                <DataLabelValueComponent label={'Family Doctor Name'}>
                                    {clientMedicalDetails?.medical_provider_info?.name || "-"}
                                </DataLabelValueComponent>
                            </div>
                            <div className={'ts-col-lg-3'}>
                                <DataLabelValueComponent label={'Primary Phone'}>
                                    {clientMedicalDetails?.medical_provider_info?.primary_phone || "-"}
                                </DataLabelValueComponent>
                            </div>
                            <div className={'ts-col-lg-6'}>
                                <DataLabelValueComponent label={'Last Date of Physical Examination'}>
                                    {clientMedicalDetails?.medical_provider_info?.last_examination_date ? CommonService.getSystemFormatTimeStamp(clientMedicalDetails?.medical_provider_info?.last_examination_date) : "-"}
                                </DataLabelValueComponent>
                            </div>
                        </div>
                    </CardComponent>
                    <CardComponent title={'Medical History'} actions={<LinkComponent
                        route={CommonService._client.NavigateToClientEdit(clientId, "medicalHistory")}>
                        <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>} size={"small"}>
                            Edit
                        </ButtonComponent>
                    </LinkComponent>
                    }>
                        {
                            clientMedicalDetails?.medical_history?.questions_details?.map((question, index) => {
                                return <span key={question?._id + index}>
                            <span>{question.title}</span>
                                    {(clientMedicalDetails?.medical_history?.questions_details && clientMedicalDetails?.medical_history?.questions_details?.length - 1 !== index) &&
                                        <span>, </span>
                                    }
                        </span>
                            })
                        }
                        {
                            clientMedicalDetails?.medical_history?.questions && clientMedicalDetails?.medical_history?.questions?.length > 0 &&
                            <span>, </span>
                        }
                        {clientMedicalDetails?.medical_history?.comments &&
                            <span> {clientMedicalDetails?.medical_history?.comments}</span>
                        }
                    </CardComponent>
                    <CardComponent title={'Females Only'} actions={<LinkComponent
                        route={CommonService._client.NavigateToClientEdit(clientId, "medicalFemaleOnly")}>
                        <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>} size={"small"}>
                            Edit
                        </ButtonComponent>
                    </LinkComponent>
                    }>
                        <div className={'ts-row'}>
                            <div className={'ts-col-lg-4'}>
                                <DataLabelValueComponent label={'Pregnant or Attempting to be pregnant?'}>
                                    {clientMedicalDetails?.females_only_questions?.["Pregnant or trying to get pregnant?"] || "-"}
                                </DataLabelValueComponent>
                            </div>
                            <div className={'ts-col-lg-4'}>
                                <DataLabelValueComponent label={'Nursing?'}>
                                    {clientMedicalDetails?.females_only_questions?.["Nursing?"] || "-"}
                                </DataLabelValueComponent>
                            </div>
                        </div>
                    </CardComponent>
                    <CardComponent title={'Surgical History'} actions={<LinkComponent
                        route={CommonService._client.NavigateToClientEdit(clientId, "surgicalHistory")}>
                        <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>} size={"small"}>
                            Edit
                        </ButtonComponent>
                    </LinkComponent>
                    }>
                        {
                            clientMedicalDetails?.surgical_history?.questions_details?.map((question, index) => {
                                return <span key={question._id + index}>
                            <span>{question.title}</span>
                                    {(clientMedicalDetails?.surgical_history?.questions_details && clientMedicalDetails?.surgical_history?.questions_details.length - 1 !== index) &&
                                        <span>, </span>
                                    }
                        </span>
                            })
                        }
                        {
                            clientMedicalDetails?.surgical_history?.questions && clientMedicalDetails?.surgical_history?.questions?.length > 0 &&
                            <span>, </span>
                        }
                        {clientMedicalDetails?.surgical_history?.comments &&
                            <span>{clientMedicalDetails?.surgical_history?.comments}</span>
                        }
                    </CardComponent>
                    <CardComponent title={'Musculoskeletal History'} actions={<LinkComponent
                        route={CommonService._client.NavigateToClientEdit(clientId, "musculoskeletalHistory")}>
                        <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>} size={"small"}>
                            Edit
                        </ButtonComponent>
                    </LinkComponent>
                    }>
                        {
                            (Object.keys(clientMedicalDetails?.musculoskeletal_history || {})?.map((question, index) => {
                                return <span key={question + index}>
                            <span>{clientMedicalDetails?.musculoskeletal_history[question]?.title}</span>
                                    {(Object.keys(clientMedicalDetails?.musculoskeletal_history || {})?.length - 1 !== index) &&
                                        <span>, </span>
                                    }
                        </span>
                            }))
                        }
                    </CardComponent>
                </>
            }
        </div>
    );

};

export default ClientMedicalDetailsComponent;