import "./Client8MinutesRuleChartComponent.scss";
import DrawerComponent from "../../../shared/components/drawer/DrawerComponent";
import {useState} from "react";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import TableWrapperComponent from "../../../shared/components/table-wrapper/TableWrapperComponent";
import {ITableColumn} from "../../../shared/models/table.model";
import {APIConfig} from "../../../constants";


interface Client8MinutesRuleChartComponentProps {

}

const Client8MinutesRuleChartComponent = (props: Client8MinutesRuleChartComponentProps) => {

    const minutesChartColumn: ITableColumn[] = [
        {
            title: '',
            width: '5%'

        },
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
            width: '70%'
        },
        {
            title: 'Unit(s)',
            dataIndex: 'units',
            key: 'units'
        },
    ];

    const [isEightMinuteRuleChartDrawerOpen, setEightMinuteRuleChartDrawerOpen] = useState<boolean>(false);

    return (
        <div className={'client-8-minutes-rule-chart-component'}>
            <ButtonComponent onClick={() => setEightMinuteRuleChartDrawerOpen(true)}>View 8-Minute Rule
                Chart</ButtonComponent>
            <DrawerComponent isOpen={isEightMinuteRuleChartDrawerOpen}
                             showClose={true}
                             closeOnEsc={false}
                             closeOnBackDropClick={false}
                             onClose={() => setEightMinuteRuleChartDrawerOpen(false)}>
                <FormControlLabelComponent size={'lg'} label={'8-Minute Rule Reference Chart'}/>
                <TableWrapperComponent url={APIConfig.CLIENT_EIGHT_MINUTES_RULE_CHART.URL}
                                       method={APIConfig.CLIENT_EIGHT_MINUTES_RULE_CHART.METHOD}
                                       isPaginated={false}
                                       columns={minutesChartColumn}/>
            </DrawerComponent>
        </div>
    );
};

export default Client8MinutesRuleChartComponent;
