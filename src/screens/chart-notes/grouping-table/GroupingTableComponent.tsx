import {Table} from 'antd';

interface GroupingTableComponentProps {
    columns:any;
    bordered?:boolean;
    data:any;
    className?:any;
}

const GroupingTableComponent = (props: GroupingTableComponentProps) => {

    const {bordered,columns,data,className}=props;

        return <>
            <Table
                className={className}
                columns={columns}
                dataSource={data}
                bordered={bordered}
                size={'middle'}

            />
        </>
    }
;

export default GroupingTableComponent;