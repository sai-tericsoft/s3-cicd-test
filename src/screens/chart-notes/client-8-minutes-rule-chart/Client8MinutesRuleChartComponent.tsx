import "./Client8MinutesRuleChartComponent.scss";
import DrawerComponent from "../../../shared/components/drawer/DrawerComponent";
import {useState} from "react";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import FormControlLabelComponent from "../../../shared/components/form-control-label/FormControlLabelComponent";
import TableComponent from "../../../shared/components/table/TableComponent";


interface Client8MinutesRuleChartComponentProps {

}

const Client8MinutesRuleChartComponent = (props: Client8MinutesRuleChartComponentProps) => {

    const minutesChartColumn:any=[
        {
            title: '',
            width: '5%'

        },
        {
            title:'Time',
            dataIndex:'time',
            key:'name',
            width:'70%'
        },
        {
            title:'Unit(s)',
            dataIndex:'unit',
            key:'unit'
        },
    ];

    const minutesChartData:any=[
        {
            time:'08-22 Minutes',
            unit:'1'
        },
        {
            time:'23-37 Minutes',
            unit:'2'
        },
        {
            time:'38-52 Minutes',
            unit:'3'
        },
        {
            time:'53-67 Minutes',
            unit:'4'
        },
        {
            time:'68-82 Minutes',
            unit:'1'
        },
        {
            time:'83 Minutes',
            unit:'5'
        }
    ]

    const [isDrawerOpen,setIsDrawerOpen]=useState<boolean>(false)
    return (
        <div className={'client-8-minutes-rule-chart-component'}>
            <ButtonComponent onClick={()=>setIsDrawerOpen(true)}>View 8-Minute Rule Chart</ButtonComponent>

                <DrawerComponent isOpen={isDrawerOpen}
                                 showClose={true}
                                 closeOnEsc={false}
                                 closeOnBackDropClick={false}
                                 closeButtonId={"sc_close_btn"}
                          onClose={()=>setIsDrawerOpen(false)}>
                        <FormControlLabelComponent  size={'lg'} label={'8-Minute Rule Reference Chart'}/>
                    <TableComponent data={minutesChartData} columns={minutesChartColumn}/>
                </DrawerComponent>
        </div>
    );

};

export default Client8MinutesRuleChartComponent;