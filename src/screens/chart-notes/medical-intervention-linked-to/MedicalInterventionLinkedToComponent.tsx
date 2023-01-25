import "./MedicalInterventionLinkedToComponent.scss";
import {CommonService} from "../../../shared/services";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import React, {useCallback} from "react";
import ModalComponent from "../../../shared/components/modal/ModalComponent";
import TableComponent from "../../../shared/components/table/TableComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";

interface MedicalInterventionLinkedToComponentProps {
    medicalRecordDetails: any;
}

const MedicalInterventionLinkedToComponent = (props: MedicalInterventionLinkedToComponentProps) => {

    const {medicalRecordDetails} = props;
    const [isBodyPartsModalOpen, setIsBodyPartsModalOpen] = React.useState<boolean>(false);

    const openBodyPartsModal = useCallback(() => {
        setIsBodyPartsModalOpen(true);
    }, []);

    const closeBodyPartsModal = useCallback(() => {
        setIsBodyPartsModalOpen(false);
    }, []);

    const bodyPartsColumns: any = [
        {
            title: "Body Part",
            dataIndex: "body_part",
            key: "body_part",
            width: 91,
            render: ( item: any) => {
                return <>{item?.body_part_details?.name}</>
            }

        },
        {
            title: "Body  Side(s)",
            dataIndex: "body_part",
            key: "body_part",
            width: 114,
            render: ( item: any) => {
                return <>{item?.body_side}</>
            }
        }
    ];

    return (
        <div className={'medical-intervention-linked-to-component'}>
            <DataLabelValueComponent label={'Intervention Linked to:'} direction={"row"}
                                     className={'medical-record-injury-details-wrapper'}>
                <div className={'medical-record-injury-details'}>{medicalRecordDetails?.intervention_linked_to}
                    {medicalRecordDetails?.created_at && CommonService.transformTimeStamp(medicalRecordDetails?.created_at)}{" "}
                    {"-"} {medicalRecordDetails?.injury_details.map((injury: any, index: number) => {
                        return <>{injury.body_part_details.name}({injury.body_side}) {index !== medicalRecordDetails?.injury_details.length - 1 ? <> | </> : ""}</>
                    })}
                </div>
                <span className={'medical-record-injury-details-view-all-body-parts'}
                      onClick={openBodyPartsModal}> View All Body Parts </span>
            </DataLabelValueComponent>

            {/*Body Parts Modal Start*/}
            <ModalComponent title={"All Body Parts"} isOpen={isBodyPartsModalOpen} onClose={closeBodyPartsModal}>
                <TableComponent data={medicalRecordDetails?.injury_details} columns={bodyPartsColumns}/>
                <div className={'close-modal-btn'}>
                    <ButtonComponent onClick={closeBodyPartsModal}>Close</ButtonComponent>
                </div>
            </ModalComponent>
            {/*Body Parts Modal End*/}

        </div>
    );

};

export default MedicalInterventionLinkedToComponent;
