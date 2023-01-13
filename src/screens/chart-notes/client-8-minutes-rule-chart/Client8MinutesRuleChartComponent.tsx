import "./Client8MinutesRuleChartComponent.scss";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";
import {ITableColumn} from "../../../shared/models/table.model";
import {APIConfig} from "../../../constants";


interface Client8MinutesRuleChartComponentProps {

}

const Client8MinutesRuleChartComponent = (props: Client8MinutesRuleChartComponentProps) => {

    const minutesChartColumn: ITableColumn[] = [
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
            width: '50%'
        },
        {
            title: 'Unit(s)',
            dataIndex: 'units',
            key: 'units'
        },
    ];

    return (
        <div className={'client-8-minutes-rule-chart-component'}>
            <FormControlLabelComponent size={'lg'} label={'8-Minute Rule Reference Chart'}/>
            <TableWrapperComponent url={APIConfig.CLIENT_EIGHT_MINUTES_RULE_CHART.URL}
                                   method={APIConfig.CLIENT_EIGHT_MINUTES_RULE_CHART.METHOD}
                                   isPaginated={false}
                                   columns={minutesChartColumn}/>
        </div>
    );
};

export default Client8MinutesRuleChartComponent;
