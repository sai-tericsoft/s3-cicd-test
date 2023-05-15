import "./Client8MinutesRuleChartComponent.scss";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import {ITableColumn} from "../../../shared/models/table.model";
import TableComponent from "../../../shared/components/table/TableComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";


interface Client8MinutesRuleChartComponentProps {

}

const Client8MinutesRuleChartComponent = (props: Client8MinutesRuleChartComponentProps) => {

    const {
        eightMinuteRuleChart,
        isEightMinuteRuleChartLoading
    } = useSelector((state: IRootReducerState) => state.staticData);

    const minutesChartColumn: ITableColumn[] = [
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: '# of Billable Unit(s)',
            dataIndex: 'units',
            key: 'units',
            align: 'center'
        },
    ];

    return (
        <div className={'client-8-minutes-rule-chart-component'}>
            <FormControlLabelComponent size={'lg'} label={'8-Minute Rule Reference Chart'}/>
            <TableComponent
                data={eightMinuteRuleChart}
                loading={isEightMinuteRuleChartLoading}
                columns={minutesChartColumn}/>
        </div>
    );
};

export default Client8MinutesRuleChartComponent;
