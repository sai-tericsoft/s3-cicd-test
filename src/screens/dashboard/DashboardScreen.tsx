import "./DashboardScreen.scss";
import {useDispatch} from "react-redux";
import React, {useEffect, useState} from "react";
import {setCurrentNavParams} from "../../store/actions/navigation.action";
import {Form, Radio, RadioChangeEvent, Space, Switch, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {DownOutlined} from "@ant-design/icons";

interface DashboardScreenProps {

}


interface DataType {
    key: number;
    name: string;
    age: number;
    address: string;
    description: string;
}

const columns: ColumnsType<DataType> = [
    {
        title: 'Name',
        dataIndex: 'name',
    },
    {
        title: 'Age',
        dataIndex: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address'
    },
    {
        title: 'Action',
        key: 'action',
        sorter: true,
        render: () => (
            <Space size="middle">
                <Space>
                    More actions
                    <DownOutlined/>
                </Space>
            </Space>
        ),
    },
];

const data: DataType[] = [];
for (let i = 1; i <= 50; i++) {
    data.push({
        key: i,
        name: 'John Brown',
        age: Number(`${i}2`),
        address: `New York No. ${i} Lake Park`,
        description: `My name is John Brown, I am ${i}2 years old, living in New York No. ${i} Lake Park.`,
    });
}

const DashboardScreen = (props: DashboardScreenProps) => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setCurrentNavParams("Dashboard"));
    }, [dispatch]);

    const [tableLayout, setTableLayout] = useState(undefined);
    const [ellipsis, setEllipsis] = useState(false);
    const [xScroll, setXScroll] = useState<string | undefined>(undefined);

    const handleTableLayoutChange = (e: RadioChangeEvent) => {
        setTableLayout(e.target.value);
    };

    const handleEllipsisChange = (enable: boolean) => {
        setEllipsis(enable);
    };

    const handleXScrollChange = (e: RadioChangeEvent) => {
        setXScroll(e.target.value);
    };

    const scroll: { x?: number | string; y?: number | string } = {};
    if (xScroll) {
        scroll.x = '100vw';
    }

    const tableColumns = columns.map((item) => ({...item, ellipsis}));
    if (xScroll === 'fixed') {
        tableColumns[0].fixed = true;
        tableColumns[tableColumns.length - 1].fixed = 'right';
    }

    return (
        <div className={'DashboardScreen'}>
            <Form
                layout="inline"
                className="components-table-demo-control-bar"
                style={{marginBottom: 16}}
            >
                <Form.Item label="Ellipsis">
                    <Switch checked={ellipsis} onChange={handleEllipsisChange}/>
                </Form.Item>
                <Form.Item label="Table Scroll">
                    <Radio.Group value={xScroll} onChange={handleXScrollChange}>
                        <Radio.Button value={undefined}>Unset</Radio.Button>
                        <Radio.Button value="scroll">Scroll</Radio.Button>
                        <Radio.Button value="fixed">Fixed Columns</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="Table Layout">
                    <Radio.Group value={tableLayout} onChange={handleTableLayoutChange}>
                        <Radio.Button value={undefined}>Unset</Radio.Button>
                        <Radio.Button value="fixed">Fixed</Radio.Button>
                    </Radio.Group>
                </Form.Item>
            </Form>
            <Table
                tableLayout={tableLayout}
                pagination={false}
                columns={tableColumns}
                dataSource={data}
                scroll={scroll}
            />
        </div>
    );

};

export default DashboardScreen;