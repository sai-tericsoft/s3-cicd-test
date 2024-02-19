import "./ViewPriorNoteComponent.scss";
import InputComponent from "../../../shared/components/form-controls/input/InputComponent";
import {CommonService} from "../../../shared/services";
import {ITableColumn} from "../../../shared/models/table.model";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import TableComponent from "../../../shared/components/table/TableComponent";
import {useLocation} from "react-router-dom";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import {ImageConfig} from "../../../constants";
import React from "react";

interface ViewPriorNoteComponentProps {
    medicalRecordDetails: any;
    medicalInterventionId: string;
    onMedicalInterventionSelection: (medicalInterventionId: string) => void;
}

const ViewPriorNoteComponent = (props: ViewPriorNoteComponentProps) => {

    const {medicalRecordDetails, onMedicalInterventionSelection} = props;
    const location = useLocation();

    const {
        medicalRecordSoapNoteList,
        isMedicalInterventionDetailsLoading,
    } = useSelector((state: IRootReducerState) => state.chartNotes);



    const ViewPriorNoteColumns: ITableColumn[] = [
        {
            title: '',
            key: "flag",
            dataIndex: 'is_flagged',
            width: 40,
            fixed: 'left',
            render: (item: any) => {
                return <div className={'flag-wrapper'}>{item?.is_flagged && <ImageConfig.FlagIcon/>}</div>
            }
        },
        {
            title: "Date",
            key: "date",
            width: 150,
            dataIndex: 'intervention_date',
            render: (item: any) => {
                return <>{CommonService.getSystemFormatTimeStamp(item?.intervention_date)}</>
            }
        },
        {
            title: "Provider",
            key: "provider",
            dataIndex: 'first_name',
            width: 180,
            render: (item: any) => {
                return <span>{item?.treated_by_details?.first_name} {item?.treated_by_details?.last_name}</span>
            }
        },
        {
            title: "Action",
            dataIndex: "actions",
            width: 120,
            key: "actions",
            align: "center",
            fixed: "right",
            render: (item: any) => {
                return <LinkComponent
                    onClick={()=>onMedicalInterventionSelection(item?.id)}
                    behaviour={'redirect'}
                    route={CommonService._routeConfig.MedicalInterventionDetails(item?.medical_record_id, item?._id) + '?referrer=' + location.pathname}>
                    View Details</LinkComponent>
            }
        }
    ];

    return (
        <div className={'view-prior-note-component'}>
            <FormControlLabelComponent label={'View Prior Note'} size={'xl'}/>
            <InputComponent label={'Intervention Linked to'}
                            placeholder={'Intervention Linked To'}
                            value={CommonService.generateInterventionNameFromMedicalRecord(medicalRecordDetails)}
                            required={true}
                            fullWidth={true}
                            disabled={true}/>
            <TableComponent data={medicalRecordSoapNoteList}
                            noDataText={'Currently there are no prior notes to view.'}
                            loading={isMedicalInterventionDetailsLoading}
                            columns={ViewPriorNoteColumns}
            />
        </div>
    );

};

export default ViewPriorNoteComponent;
