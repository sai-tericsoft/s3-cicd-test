import "./MedicalRecordStatsComponent.scss";
import TableComponent from "../../../shared/components/table/TableComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";

interface MedicalRecordStatsComponentProps {

}

const MedicalRecordStatsComponent = (props: MedicalRecordStatsComponentProps) => {

    const {
        medicalRecordStats,
        isMedicalRecordStatsLoading
    } = useSelector((state: IRootReducerState) => state.chartNotes);

    const MedicalRecordStatsTableColumns :any = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
            align: 'center',
            render: ( item: any) => {
                return item?.value || 'N/A';
            }
        }
    ];

    return (
        <div className={'medical-record-stats-component'}>
            <TableComponent data={medicalRecordStats}
                            columns={MedicalRecordStatsTableColumns}
                            loading={isMedicalRecordStatsLoading}/>
        </div>
    );

};

export default MedicalRecordStatsComponent;
