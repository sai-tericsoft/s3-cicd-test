import "./TableComponent.scss";
import Table from 'antd/lib/table';
import {ITableComponentProps} from "../../models/table.model";
import {CircularProgress} from "@mui/material";
import {useCallback} from "react";
import StatusComponentComponent from "../status-component/StatusComponentComponent";

interface TableComponentProps extends ITableComponentProps {
    data: any[];
    loading?: boolean;
}

const TableComponent = (props: TableComponentProps) => {

    const {data, onRowClick, rowKey, rowClassName, bordered, loading, columns} = props;
    const size = props.size || "large";
    const showHeader = props.showHeader !== undefined ? props.showHeader : true;

    const handleRowClick = useCallback((record: any, index: number | undefined) => {
        if (onRowClick) {
            onRowClick(record, index);
        }
    }, [onRowClick]);

    return (
        <div className={'table-component'}>
            <Table columns={columns}
                   locale={{
                       emptyText: (
                           <StatusComponentComponent title={"No Data"}/>
                       )
                   }}
                   onRow={(record, index) => {
                       return {
                           onClick: (event: any) => {
                               handleRowClick(record, index);
                           }
                       }
                   }}
                   rowKey={rowKey}
                   showHeader={showHeader}
                   rowClassName={rowClassName}
                   loading={loading ? {
                       indicator: <CircularProgress color={"primary"} size={"2rem"}/>,
                       spinning: true
                   } : false}
                   dataSource={data}
                   bordered={bordered}
                   size={size}
                   pagination={false}
                   scroll={{x: "100%"}}
            />
        </div>
    );

};

export default TableComponent;

// ****************************** USAGE ****************************** //

// const columns: ITableColumn[] = [
//     {
//         title: 'Name',
//         dataIndex: 'name',
//         key: 'name',
//         width: 150,
//         fixed: "left"
//     },
//     {
//         title: 'Age',
//         dataIndex: 'age',
//         key: 'age',
//         width: 100,
//     },
//     {
//         title: 'Address',
//         dataIndex: 'address',
//         key: 'address',
//         width: 200,
//     },
//     {
//         title: '',
//         key: 'actions',
//         width: 140,
//         fixed: "right",
//         render: (item: any) => {
//             return <ButtonComponent
//                 size={"small"}
//                 prefixIcon={<ImageConfig.EditIcon/>}
//             >
//                 Edit User
//             </ButtonComponent>
//         }
//     },
// ];
//
// const data = [
//     {
//         key: '1',
//         name: 'John Brown',
//         age: 32,
//         address: 'New York No. 1 Lake Park',
//         tags: ['nice', 'developer'],
//     },
//     {
//         key: '2',
//         name: 'Jim Green',
//         age: 42,
//         address: 'London No. 1 Lake Park',
//         tags: ['loser'],
//     },
//     {
//         key: '3',
//         name: 'Joe Black',
//         age: 32,
//         address: 'Sidney No. 1 Lake Park',
//         tags: ['cool', 'teacher'],
//     },
// ];
//
//
// <TableComponent
//     onRowClick={(data, index)=>{
//         console.log(data, index);
//     }}
//     rowClassName={(row, index)=>{
//         if (index % 2 === 0){
//             return "even-row";
//         } else {
//             return "odd-row";
//         }
//     }}
//     columns={columns} data={data}/>


// ****************************** USAGE ****************************** //
