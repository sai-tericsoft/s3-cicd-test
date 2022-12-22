import "./ClientMedicalInterventionDetailsComponent.scss";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import CardComponent from "../../../shared/components/card/CardComponent";
import CheckBoxComponent from "../../../shared/components/form-controls/check-box/CheckBoxComponent";

interface ClientMedicalInterventionDetailsComponentProps {

}

const ClientMedicalInterventionDetailsComponent = (props: ClientMedicalInterventionDetailsComponentProps) => {

    return (
        <div className={'client-medical-intervention-details-component'}>
            <div className={'client-medical-intervention-details-wrapper'}>
                <FormControlLabelComponent label={'SOAP Note'}/>
                <CardComponent title={'Subjective (S)'}>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias commodi distinctio dolorum ducimus,
                    eveniet ex magnam nesciunt perferendis quas qui quo similique tempora vel. Adipisci dolorum expedita
                    iste maiores quo.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi culpa dolorem eligendi, enim eos
                    error explicabo id ipsam molestias neque non quae quis quo quos repellat sequi similique tenetur
                    voluptatibus.
                </CardComponent>
                <CardComponent title={'Objective (O)'}
                               actions={<CheckBoxComponent size={'small'} label={'Flag Note'}/>}>

                    <span className={'observation-wrapper'}> Observation:</span>Lorem ipsum dolor sit amet, consectetur
                    adipisicing elit. Aperiam cumque dolore eligendi hic
                    ipsam iste iusto quas quasi, quisquam quod sed sunt tempora tempore unde voluptatibus. Harum
                    repellat sit vero?
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus ad, consequatur cum
                    dolor eveniet harum magnam natus officiis perspiciatis provident quidem quis similique sunt
                    vitae voluptate. Corporis ea nam soluta.

                    <div className={'objective-table-wrapper'}>
                        <FormControlLabelComponent className={'range-of-motion-label'}
                                                   label={'Range of Motion and Strength:'}/>
                        <CardComponent color={'primary'} title={'Body Part : Shoulder'}>


                        </CardComponent>
                    </div>
                    <div className={'medical-details-wrapper'}>
                        <span className={'observation-wrapper'}>Palpation:</span>Lorem ipsum dolor sit amet, consectetur
                        adipisicing elit. Cum delectus doloremque dolores ducimus ex facere incidunt possimus quo
                        tempore?
                        Earum exercitationem hic pariatur repellendus sequi. Ad ipsam recusandae totam veniam.
                    </div>
                    <div className={'medical-details-wrapper'}>
                        <span className={'observation-wrapper'}>Functional Test:</span>Lorem ipsum dolor sit amet,
                        consectetur
                        adipisicing elit. Cum delectus doloremque dolores ducimus ex facere incidunt possimus quo
                        tempore?
                        Earum exercitationem hic pariatur repellendus sequi. Ad ipsam recusandae totam veniam.
                    </div>

                    <div className={'medical-details-wrapper'}>
                        <span className={'observation-wrapper'}>Treatment:</span>Lorem ipsum dolor sit amet, consectetur
                        adipisicing elit. Cum delectus doloremque dolores ducimus ex facere incidunt possimus quo
                        tempore?
                        Earum exercitationem hic pariatur repellendus sequi. Ad ipsam recusandae totam veniam.
                    </div>
                    <div className={'medical-details-wrapper'}>
                        <span className={'observation-wrapper'}>Response to Treatment:</span>Lorem ipsum dolor sit amet,
                        consectetur
                        adipisicing elit. Cum delectus doloremque dolores ducimus ex facere incidunt possimus quo
                        tempore?
                        Earum exercitationem hic pariatur repellendus sequi. Ad ipsam recusandae totam veniam.
                    </div>
                </CardComponent>
                <CardComponent title={'Assessment (A)'}>
                    <div className={'assessment-table-wrapper'}>
                        <FormControlLabelComponent className={'medical-diagnosis-label'}
                                                   label={'Medical Diagnosis/ICD-10 Codes:'}/>
                    <div className={'assessment-sub-table-wrapper'}>
                        <div className={'header-icd'}>ICD Code</div>
                        <div className={'header-description'}>Description </div>
                    </div>
                        <div className={'assessment-rows'}>
                            <div className={'code-row'}>ICT-10-M15.8</div>
                            <div className={'code-description'}>Intervertibral disc disorders with radiculopathy, lumbar region </div>
                        </div>
                        <div className={'assessment-rows'}>
                            <div className={'code-row'}>ICT-10-M15.10</div>
                            <div className={'code-description'}>Intervertibral disc disorders with radiculopathy, lumbar region </div>
                        </div>
                        <div className={'assessment-rows'}>
                            <div className={'code-row'}>ICT-10-M15.9</div>
                            <div className={'code-description'}>Intervertibral disc disorders with radiculopathy, lumbar region </div>
                        </div>

                    </div>
                    <div className={'medical-details-wrapper'}>
                        <span className={'observation-wrapper'}>Index of Suspicion:</span>Lorem ipsum dolor sit amet,
                        consectetur
                        adipisicing elit. Cum delectus doloremque dolores ducimus ex facere incidunt possimus quo
                        tempore?
                        Earum exercitationem hic pariatur repellendus sequi. Ad ipsam recusandae totam veniam.
                    </div>
                    <div className={'medical-details-wrapper'}>
                        <span className={'observation-wrapper'}>Surgery Procedure Complete:</span>Lorem ipsum dolor sit
                        amet, consectetur
                        adipisicing elit. Cum delectus doloremque dolores ducimus ex facere incidunt possimus quo
                        tempore?
                        Earum exercitationem hic pariatur repellendus sequi. Ad ipsam recusandae totam veniam.
                    </div>
                </CardComponent>
                <CardComponent title={'Plan (P)'}>
                    <div className={'medical-details-wrapper'}>
                        <span className={'observation-wrapper'}>Plan:</span>Lorem ipsum dolor sit amet, consectetur
                        adipisicing elit. Cum delectus doloremque dolores ducimus ex facere incidunt possimus quo
                        tempore?
                        Earum exercitationem hic pariatur repellendus sequi. Ad ipsam recusandae totam veniam.
                    </div>
                    <div className={'medical-details-wrapper'}>
                        <span className={'observation-wrapper'}>MD Recommendations:</span>Lorem ipsum dolor sit amet,
                        consectetur
                        adipisicing elit. Cum delectus doloremque dolores ducimus ex facere incidunt possimus quo
                        tempore?
                        Earum exercitationem hic pariatur repellendus sequi. Ad ipsam recusandae totam veniam.
                    </div>
                    <div className={'medical-details-wrapper'}>
                        <span className={'observation-wrapper'}>Education:</span>Lorem ipsum dolor sit amet, consectetur
                        adipisicing elit. Cum delectus doloremque dolores ducimus ex facere incidunt possimus quo
                        tempore?
                        Earum exercitationem hic pariatur repellendus sequi. Ad ipsam recusandae totam veniam.
                    </div>
                    <div className={'medical-details-wrapper'}>
                        <span className={'observation-wrapper'}>Treatment:</span>Lorem ipsum dolor sit amet, consectetur
                        adipisicing elit. Cum delectus doloremque dolores ducimus ex facere incidunt possimus quo
                        tempore?
                        Earum exercitationem hic pariatur repellendus sequi. Ad ipsam recusandae totam veniam.
                    </div>
                </CardComponent>


            </div>
        </div>
    );

};

export default ClientMedicalInterventionDetailsComponent;