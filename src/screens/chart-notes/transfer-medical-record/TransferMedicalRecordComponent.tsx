import "./TransferMedicalRecordComponent.scss";
import {useCallback, useEffect, useMemo, useState} from "react";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import SearchComponent from "../../../shared/components/search/SearchComponent";
import AvatarComponent from "../../../shared/components/avatar/AvatarComponent";
import {CommonService} from "../../../shared/services";
import {IAPIResponseType} from "../../../shared/models/api.model";
import TableComponent from "../../../shared/components/table/TableComponent";
import {ITableColumn} from "../../../shared/models/table.model";
import {RadioButtonComponent} from "../../../shared/components/form-controls/radio-button/RadioButtonComponent";

interface TransferMedicalRecordComponentProps {
    onMedicalRecordTransfer: () => void;
}

const TransferMedicalRecordComponent = (props: TransferMedicalRecordComponentProps) => {

        const [clientSearchKey, setClientSearchKey] = useState<string>('');
        const {onMedicalRecordTransfer} = props;
        const [isClientListLoading, setIsClientListLoading] = useState<boolean>(false);
        const [clientList, setClientList] = useState<any>([]);
        const [selectedClient, setSelectedClient] = useState<any>(null);

        const [currentStep, setCurrentStep] = useState<"selectClient" | "selectInterventions" | "selectTargetMedicalRecord">("selectClient");

        const handleTransferMedicalRecord = useCallback(() => {
            onMedicalRecordTransfer();
            CommonService._alert.showToast('Medical Record Transferred Successfully', 'success');
        }, [onMedicalRecordTransfer]);

        const handleConfirmation = useCallback(() => {
            switch (currentStep) {
                case "selectClient":
                    setCurrentStep("selectInterventions");
                    break;
                case "selectInterventions":
                    setCurrentStep("selectTargetMedicalRecord");
                    break;
                case "selectTargetMedicalRecord":
                    handleTransferMedicalRecord();
                    break;
            }
        }, [currentStep, handleTransferMedicalRecord]);

        const getClientList = useCallback((searchKey: string = '') => {
            setClientSearchKey(searchKey);
            setIsClientListLoading(true);
            CommonService._client.ClientListLiteAPICall({search: searchKey}).then((response: IAPIResponseType<any>) => {
                setClientList(response.data);
                setIsClientListLoading(false);
            }).catch((error: any) => {
                setClientList([]);
                setIsClientListLoading(false);
            });
        }, []);

        useEffect(() => {
            getClientList();
        }, []);

        const ClientListColumns: ITableColumn[] = useMemo(() => [
            {
                title: 'Name',
                key: 'name',
                dataIndex: 'name',
                render: (_: any, item: any) => {
                    return <RadioButtonComponent
                        label={CommonService.extractName(item)}
                        name={'client'} value={item?._id}
                        checked={selectedClient?._id === item?._id}
                        onChange={() => {
                            setSelectedClient(item);
                        }}
                    />
                }
            }
        ], [selectedClient]);

        return (
            <div className={'transfer-medical-record-component'}>
                <FormControlLabelComponent label={"Transfer File to"}/>
                {
                    currentStep === "selectClient" && <div className={"select-client-wrapper"}>
                        <SearchComponent label={"Search for Client"} value={clientSearchKey}
                                         onSearchChange={(value) => {
                                             getClientList(value);
                                         }}/>
                        <TableComponent data={clientList}
                                        columns={ClientListColumns}
                                        loading={isClientListLoading}
                                        showHeader={false}
                        />
                    </div>
                }
                {
                    currentStep === "selectInterventions" && <div>
                        Select intervention
                        <div>
                            <AvatarComponent title={"Courtney Brittney"}/>
                        </div>

                    </div>
                }
                {
                    currentStep === "selectTargetMedicalRecord" && <div>
                        Select medical record
                        <div>
                            <AvatarComponent title={"Courtney Brittney"}/>
                        </div>
                    </div>
                }
                <div className="t-form-actions">
                    <ButtonComponent
                        fullWidth={true}
                        disabled={(currentStep === "selectClient" && !selectedClient)}
                        onClick={handleConfirmation}>
                        Confirm
                    </ButtonComponent>
                </div>
            </div>
        );

    }
;

export default TransferMedicalRecordComponent;
