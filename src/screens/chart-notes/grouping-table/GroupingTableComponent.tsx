import TableComponent from "../../../shared/components/table/TableComponent";
import React from "react";

interface GroupingTableComponentProps {
}

const GroupingTableComponent = (props: GroupingTableComponentProps) => {

    const columns: any = [
        {
            title: 'Movement',
            dataIndex: 'movement',
            key: 'movement',
            width: 150,
            fixed: 'left',
            align: "center"
        },
        {
            title: 'Left Side',
            className: 'left_side',
            children: [
                {
                    title: 'AROM',
                    dataIndex: 'arom',
                    key: 'arom',
                    align: "center"
                },
                {
                    title: 'PROM',
                    dataIndex: 'prom',
                    key: 'prom',
                    align: "center"
                },
                {
                    title: 'Strength',
                    dataIndex: 'strength',
                    key: 'strength',
                    align: "center"
                }
            ]

        },
        {
            title: 'Right Side',
            children: [

                {
                    title: 'AROM',
                    dataIndex: 'arom',
                    key: 'arom',
                    align: "center"


                },
                {
                    title: 'PROM',
                    dataIndex: 'prom',
                    key: 'prom',
                    align: "center"
                },
                {
                    title: 'Strength',
                    dataIndex: 'strength',
                    key: 'strength',
                    align: "center"
                }
            ]

        },
        {
            title: 'Central',
            children: [
                {
                    title: 'AROM',
                    dataIndex: 'arom',
                    key: 'arom',
                    align: "center"
                },
                {
                    title: 'PROM',
                    dataIndex: 'prom',
                    key: 'prom',
                    align: "center"
                },
                {
                    title: 'Strength',
                    dataIndex: 'strength',
                    key: 'strength',
                    align: "center"
                }
            ]

        },
        {
            title: 'Bilateral',
            children: [
                {
                    title: 'AROM',
                    dataIndex: 'arom',
                    key: 'arom',
                    align: "center",
                },
                {
                    title: 'PROM',
                    dataIndex: 'prom',
                    key: 'prom',
                    align: "center"
                },
                {
                    title: 'Strength',
                    dataIndex: 'strength',
                    key: 'strength',
                    align: "center"
                }
            ]

        },
    ];

    const data: any = [
        {
            movement: 'Flexion',
            arom: '130',
            prom: '0',
            strength: '5/5',
        },
        {
            movement: 'Flexion',
            arom: '130',
            prom: '0',
            strength: '5/5'
        },
        {
            movement: 'Flexion',
            arom: '130',
            prom: '0',
            strength: '5/5'
        }
    ]

    return (
        <TableComponent data={data} columns={columns} bordered={true}/>
    );
}

export default GroupingTableComponent;
