import "./TableComponent.scss";
import Table from 'antd/lib/table';
import {ITableColumn, ITableComponentProps} from "../../models/table.model";
import {useCallback, useEffect, useState} from "react";
import StatusComponentComponent from "../status-component/StatusComponentComponent";
import LoaderComponent from "../loader/LoaderComponent";

interface TableComponentProps extends ITableComponentProps {
    data: any[];
    loading?: boolean;
    errored?: boolean;
}

const TableComponent = (props: TableComponentProps) => {

    const {data, onRowClick, rowKey, rowClassName, bordered, loading, errored} = props;
    const [tableColumns, setTableColumns] = useState<ITableColumn[]>(props.columns);
    const size = props.size || "large";
    const showHeader = props.showHeader !== undefined ? props.showHeader : true;

    const handleRowClick = useCallback((record: any, index: number | undefined) => {
        if (onRowClick) {
            onRowClick(record, index);
        }
    }, [onRowClick]);

    useEffect(() => {
        if (props.columns) {
            const tableCols = props.columns.map((col) => {
                const transformedCol = col;
                if (col.className) {
                    transformedCol['className'] = 't-cell-' + col.key + " " + col.className;
                } else {
                    transformedCol['className'] = 't-cell-' + col.key;
                }
                return transformedCol;
            });
            setTableColumns(tableCols);
        }
    }, [props.columns]);

    return (
        <div className={'table-component'}>
            <Table columns={tableColumns}
                   locale={{
                       emptyText: (
                           <>
                               {
                                   (!loading && data.length === 0) ? <>
                                       {
                                           errored && <StatusComponentComponent title={"Error Loading Data"}/>
                                       }
                                       {
                                           !errored && <StatusComponentComponent title={"No Data"}/>
                                       }
                                   </> : <></>
                               }
                           </>
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
                       indicator: <LoaderComponent type={"spinner"} size={"md"}/>,
                       spinning: loading
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
