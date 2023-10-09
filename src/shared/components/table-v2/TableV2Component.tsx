import "./TableV2Component.scss";
import Table from 'antd/lib/table';
import {ITableComponentProps} from "../../models/table.model";
import React, {useCallback, useEffect, useState} from "react";
import StatusCardComponent from "../status-card/StatusCardComponent";
import LoaderComponent from "../loader/LoaderComponent";
import {TablePaginationConfig} from "antd";
import {GetRowKey} from "rc-table/lib/interface";

interface TableV2ComponentProps extends ITableComponentProps {
    data: any[];
    loading?: boolean;
    errored?: boolean;
    noDataText?: string;
    showFooter?: boolean;
    footer?: React.ReactNode;
}

const TableV2Component = (props: TableV2ComponentProps) => {

    const {
        bordered,
        noDataText,
        data,
        defaultExpandAllRows,
        errored,
        id,
        loading,
        onRowClick,
        onSort,
        rowClassName,
        rowSelection,
        showExpandColumn,
        canExpandRow,
        expandRowRenderer,
        hideHeader,
        footer
    } = props;

    const [tableColumns, setTableColumns] = useState<any>(props.columns);
    const size = props.size || "large";
    const showFooter = props.showFooter || false;

    const defaultRowKey = useCallback((item: any, index?: number) => item?._id || index, []);

    const rowKey = props.rowKey || defaultRowKey;

    const handleRowClick = useCallback((record: any, index: number | undefined) => {
        if (onRowClick) {
            onRowClick(record, index);
        }
    }, [onRowClick]);

    useEffect(() => {
        if (props.columns) {
            const tableCols: any = props.columns.map((col) => {
                const transformedCol: any = col;
                transformedCol['className'] = 't-cell t-cell-' + col.key?.split(' ').join('-') + " " + col.className;
                if (col.sortable) {
                    transformedCol['sorter'] = col.sortable;
                }
                return transformedCol;
            });
            setTableColumns(tableCols);
        }
    }, [props.columns]);

    const handleTableChange = useCallback((pagination: TablePaginationConfig, filters: any, sorter: any, extra: any) => {
        if (Object.entries(sorter)?.length && onSort) {
            onSort(sorter.field, sorter.order);
        }
    }, [onSort]);

    return (
        <div className={'table-v2-component'}>
            <Table
                id={id}
                rowSelection={rowSelection}
                expandable={{
                    // expandedRowKeys: rowKey ? data.map(rowKey) : [], // todo: make it unique if required
                    showExpandColumn: showExpandColumn,
                    defaultExpandAllRows: defaultExpandAllRows,
                    rowExpandable: canExpandRow,
                    expandedRowRender: expandRowRenderer,
                    expandRowByClick: !!expandRowRenderer
                }
                }
                columns={tableColumns}
                className={`${loading ? "loading" : ""}`}
                locale={{
                    emptyText: (
                        <>
                            {
                                (!loading && data?.length === 0) ? <>
                                    {
                                        errored && <StatusCardComponent title={"Error Loading Data"}/>
                                    }
                                    {
                                        !errored &&
                                        <StatusCardComponent title={noDataText ? noDataText : "No data found"}/>
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
                rowKey={rowKey as string | GetRowKey<any>}
                showHeader={!hideHeader}
                rowClassName={rowClassName}
                loading={loading ? {
                    indicator: <LoaderComponent type={"spinner"} size={"md"}/>,
                    spinning: loading
                } : false}
                dataSource={data}
                bordered={bordered}
                size={size}
                showSorterTooltip={false}
                onChange={handleTableChange}
                pagination={false}
                footer={showFooter ? () => footer : undefined}
            />
        </div>
    );

};

export default TableV2Component;

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
//         render: ( item: any) => {
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
// <TableV2Component
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
