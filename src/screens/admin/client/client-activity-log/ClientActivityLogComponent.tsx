import "./ClientActivityLogComponent.scss";
import TableWrapperComponent from "../../../../shared/components/table-wrapper/TableWrapperComponent";
import {APIConfig, ENV} from "../../../../constants";
import TableComponent from "../../../../shared/components/table/TableComponent";
// import moment from "moment";
import moment from 'moment-timezone';
import {CommonService} from "../../../../shared/services";


interface ClientActivityLogComponentProps {

}

const data = [
    {
        section: "Medical History Questionnaire",
        subSection: "Personal Habits",
        field: "Drink Coffee",
        oldValue: "Yes",
        newValue: "No",
        updateBy: {
            first_name: "Terrill",
            last_name: "Lobo"
        },
        updateAt: "2022-11-29T18:13:32.656Z"
    }
]

const column = [
    {
        key: 'activity',
        title: 'Activity',
        width: '50%',
        render: (item: any) => {
            return <div>
                <div className={'client-activity-log-section'}>
                    {item.section}
                </div>
                <div className={'client-activity-log-subsection'}>
                    {item.subSection} &gt; {item.field} :   {item.oldValue} &rarr; {item.newValue}
                </div>
            </div>
        }

    },
    {
        key: 'staff',
        title: 'Staff',
        width: "25%",
        render: (item: any) => {
            return <>{item.updateBy.first_name}&nbsp;{item.updateBy.last_name}</>
        },

    },
    {
        key: 'date/time',
        title: 'Date/Time Stamp',
        width: "25%",
        render: (item: any) => {
            return <>
                {CommonService.transformTimeStamp(item.updateAt)}
            </>
        }

    }
]


const ClientActivityLogComponent = (props: ClientActivityLogComponentProps) => {

    return (
        <div>
            <TableWrapperComponent
                url={APIConfig.CLIENT_ACTIVITY_LOG.URL}
                method={APIConfig.CLIENT_ACTIVITY_LOG.METHOD}
                isPaginated={false} columns={column}/>
            {/*<TableComponent data={data} columns={column}/>*/}
        </div>
    );

};

export default ClientActivityLogComponent;