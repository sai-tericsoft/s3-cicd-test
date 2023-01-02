import "./ClientMedicalRecordsComponent.scss";
import {APIConfig, ImageConfig} from "../../../constants";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import ChipComponent from "../../../shared/components/chip/ChipComponent";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";
import {useParams} from "react-router-dom";
import {CommonService} from "../../../shared/services";

interface ClientMedicalRecordsComponentProps {

}

const ClientMedicalRecordsComponent = (props: ClientMedicalRecordsComponentProps) => {

    const {medicalRecordId} = useParams();

    const medicalRecord: any = [
        {
            title: '',
            key: "flag",
            dataIndex: 'flag',
            width: '3%',
            render: (_: any, item: any) => {
                return <div className={'flag-wrapper'}>{item.flag && <ImageConfig.FlagIcon/>}</div>
            }
        },
        {
            title: 'Date of Intervention',
            key: 'date_of_intervention',
            dataIndex: 'intervention_date',
            width: '20%',
            fixed: 'left',
            render: (_: any, item: any) => {
                return <>{CommonService.transformTimeStamp(item.intervention_date)}</>
            }
        },
        {
            title: 'Note Type',
            key: 'note_type',
            dataIndex: 'note_type',
        },
        {
            title: 'Last Updated',
            key: 'last_updated',
            dataIndex: 'updated_at',
            width: '25%',
            render:(_:any,item:any)=>{
                return <>{CommonService.transformTimeStamp(item.updated_at)}</>
            }
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: (_: any, item: any) => {
                return <ChipComponent label={item?.status}
                                      className={item?.status==='completed' ? "completed" : "draft"}/>
            }
        },
        {
            title: 'Posted By',
            key: 'name',
            dataIndex: 'name',
            render:(_:any,item:any)=>{
                return <>{item?.posted_by.first_name} {item?.posted_by.last_name}</>
            }
        },
        {
            title: '',
            key: 'actions',
            render: () => {
                return <LinkComponent route={''}>View Details</LinkComponent>
            }
        }
    ];

    return (
        <div className={'client-medical-records-component'}>
            <div className={'client-medical-records-header-button-wrapper'}>
                <div className={'client-medical-records-header'}>Medical Records</div>
                {/*<div>*/}
                {/*    <ButtonComponent className={'outlined-button'} variant={"outlined"}>Repeat Last*/}
                {/*        Treatment</ButtonComponent>*/}
                {/*    <ButtonComponent prefixIcon={<ImageConfig.AddIcon/>}>Add New Treatment</ButtonComponent>*/}
                {/*</div>*/}
            </div>
            <TableWrapperComponent url={APIConfig.CLIENT_MEDICAL_INTERVENTION_LIST.URL(medicalRecordId)}
                                   method={APIConfig.CLIENT_MEDICAL_INTERVENTION_LIST.METHOD} columns={medicalRecord}
                                   isPaginated={false}/>
        </div>
    );

};

export default ClientMedicalRecordsComponent;
