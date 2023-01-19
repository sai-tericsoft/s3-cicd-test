import "./ViewPriorNoteComponent.scss";
import InputComponent from "../../../shared/components/form-controls/input/InputComponent";
import {CommonService} from "../../../shared/services";
import PageHeaderComponent from "../../../shared/components/page-header/PageHeaderComponent";
import {ITableColumn} from "../../../shared/models/table.model";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import TableComponent from "../../../shared/components/table/TableComponent";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";
import {APIConfig} from "../../../constants";

interface ViewPriorNoteComponentProps {
    medicalRecordDetails: any;
    medicalInterventionId: string;

}

const viewPriorNoteColumn: ITableColumn[] = [
    {
        title: "Date",
        key: "date",
        dataIndex: 'intervention_date',
        render: (_: any, item: any) => {
            return <>{CommonService.getSystemFormatTimeStamp(item?.intervention_date)}</>
        }
    },
    {
        title: "Provider",
        key: "provider",
        dataIndex: 'first_name',
        render: (_: any, item: any) => {
            return <span>{item?.treated_by_details?.first_name} {item?.treated_by_details?.last_name}</span>
        }
    },
    {
        title: "",
        dataIndex: "actions",
        key: "actions",
        fixed: "right",
        render: (_: any, item: any) => {
            return <LinkComponent route={CommonService._routeConfig.MedicalInterventionDetails(item?.medical_record_id,item?._id)}>
                View Details</LinkComponent>
        }
    }
];

const ViewPriorNoteComponent = (props: ViewPriorNoteComponentProps) => {

    const {medicalRecordDetails, medicalInterventionId} = props;
    const {
        viewPriorNoteInterventionList,
        isViewPriorNoteInterventionListLoading
    } = useSelector((state: IRootReducerState) => state.chartNotes);

    return (
        <div className={'view-prior-note-component'}>
            <PageHeaderComponent title={'View Prior Note'}/>
            <InputComponent label={'Intervention Linked To'}
                            placeholder={'Intervention Linked To'}
                            value={CommonService.generateInterventionNameFromMedicalRecord(medicalRecordDetails)}
                            required={true}
                            fullWidth={true}
                            disabled={true}/>
            <TableComponent data={viewPriorNoteInterventionList}
                            loading={isViewPriorNoteInterventionListLoading}
                            columns={viewPriorNoteColumn}
            />
            <TableWrapperComponent url={APIConfig.VIEW_PRIOR_NOTE_INTERVENTION_LIST.URL(medicalRecordDetails?._id)}
                                   method={APIConfig.VIEW_PRIOR_NOTE_INTERVENTION_LIST.METHOD}
                                   isPaginated={false}
                                   extraPayload={{current_intervention_id: medicalInterventionId}}
                                   columns={viewPriorNoteColumn}/>

        </div>
    );

};

export default ViewPriorNoteComponent;