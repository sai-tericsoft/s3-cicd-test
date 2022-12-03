import "./ClientMedicalDetailsComponent.scss";
import {IClientMedicalDetails} from "../../../shared/models/client.model";
import CardComponent from "../../../shared/components/card/CardComponent";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import {CommonService} from "../../../shared/services";

interface ClientMedicalDetailsComponentProps {
    clientMedicalDetails: IClientMedicalDetails
}

const ClientMedicalDetailsComponent = (props: ClientMedicalDetailsComponentProps) => {

    const {clientMedicalDetails} = props;

    return (
        <div className={'client-medical-details-component'}>
            <CardComponent title={'Personal Habits'} className={'client-medical-details'}>
                <div className={'ts-row mrg-bottom-20'}>
                    <div className={'ts-col-lg-8 '}>
                        Smoke/Chew Tobacco?
                    </div>
                    <div className={'ts-col-lg-1 '}>
                        {clientMedicalDetails?.personal_habits?.["Smoke/Chew Tobacco?"]?.text ||"-"}
                    </div>
                    <div className={'ts-col-lg-3'}>
                        {clientMedicalDetails?.personal_habits?.["Smoke/Chew Tobacco?"]?.value ||"-"}
                    </div>
                </div>
                <div className={'ts-row mrg-bottom-20'}>
                    <div className={'ts-col-lg-8'}>
                        Drink Alcohol?
                    </div>
                    <div className={'ts-col-lg-1'}>
                        {clientMedicalDetails?.personal_habits?.["Drink Alcohol?"]?.text ||"-"}
                    </div>
                    <div className={'ts-col-lg-3'}>
                        {clientMedicalDetails?.personal_habits?.["Drink Alcohol?"]?.value ||"-"}
                    </div>
                </div>
                <div className={'ts-row mrg-bottom-20'}>
                    <div className={'ts-col-lg-8'}>
                        Drink Coffee?
                    </div>
                    <div className={'ts-col-lg-1'}>
                        {clientMedicalDetails?.personal_habits?.["Drink Coffee?"]?.text ||"-"}
                    </div>
                    <div className={'ts-col-lg-3'}>
                        {clientMedicalDetails?.personal_habits?.["Drink Coffee?"]?.value ||"-"}
                    </div>
                </div>
                <div className={'ts-row mrg-bottom-20'}>
                    <div className={'ts-col-lg-8'}>
                        Drink Soda/Pop?
                    </div>
                    <div className={'ts-col-lg-1'}>
                        {clientMedicalDetails?.personal_habits?.["Drink Soda/Pop?"]?.text ||"-"}
                    </div>
                    <div className={'ts-col-lg-3'}>
                        {clientMedicalDetails?.personal_habits?.["Drink Soda/Pop?"]?.value ||"-"}
                    </div>
                </div>
            </CardComponent>
            <CardComponent title={'Allergies'} className={'client-medical-details'}>
                {clientMedicalDetails?.allergies}
            </CardComponent>
            <CardComponent title={'Medication/Supplements'} className={'client-medical-details'}>
                {clientMedicalDetails?.medications?.prescription_medication ||"-"},
                {clientMedicalDetails?.medications?.non_prescription_medication ||"-"}

            </CardComponent>
            <CardComponent title={'Medical Provider Information'} className={'client-medical-details'}>
                <div className={'ts-row'}>
                    <div className={'ts-col-lg-3'}>
                        <DataLabelValueComponent label={'Family Doctor Name'}>
                            {clientMedicalDetails?.medical_provider_info?.name ||"-"}
                        </DataLabelValueComponent>
                    </div>
                    <div className={'ts-col-lg-3'}>
                        <DataLabelValueComponent label={'Primary Phone'}>
                            {clientMedicalDetails?.medical_provider_info?.primary_phone ||"-"}
                        </DataLabelValueComponent>
                    </div>
                    <div className={'ts-col-lg-3'}>
                        <DataLabelValueComponent label={'Last Date of Physical Examination'}>
                            {CommonService.getSystemFormatTimeStamp(clientMedicalDetails?.medical_provider_info?.last_examination_date) ||"-"}
                        </DataLabelValueComponent>
                    </div>
                </div>
            </CardComponent>
            <CardComponent title={'Medical History'} className={'client-medical-details'}>
                {/*{clientMedicalDetails?.medical_history?.questions}*/}
            </CardComponent>
            <CardComponent title={'Females Only'} className={'client-medical-details'}>
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

            <CardComponent title={'Surgical History'} className={'client-medical-details'}>
                {/*{clientMedicalDetails?.surgical_history?.questions?.map((question)=>{*/}
                {/*    return <>{question}</>*/}
                {/*})}*/}
            </CardComponent>
            <CardComponent title={'Musculoskeletal History'} className={'client-medical-details'}>
                {/*{clientMedicalDetails?.musculoskeletal_history}*/}

            </CardComponent>

        </div>
    );

};

export default ClientMedicalDetailsComponent;