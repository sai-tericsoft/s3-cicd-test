import "./TableV2Component.scss";
import {useBlockLayout, useExpanded, useTable} from 'react-table';
import {useSticky} from "react-table-sticky";
import React, {useCallback, useMemo} from "react";
import {TableStyles} from "./TableStyles";
import {ITableColumn, ITableComponentProps} from "../../models/table.model";
import _ from "lodash";
import LoaderComponent from "../loader/LoaderComponent";
import StatusCardComponent from "../status-card/StatusCardComponent";
import {ImageConfig} from "../../../constants";

interface TableV2ComponentProps extends ITableComponentProps {
    loading?: boolean;
    errored?: boolean;
    id?: string;
    columns: ITableColumn[];
    data: any[];
}

const TableV2Component = (props: TableV2ComponentProps) => {

    const {
        loading,
        errored,
        hideHeader,
        columns,
        defaultExpandAllRows,
        showExpandColumn,
        expandRowRenderer,
        canExpandRow,
        onRowClick,
        data,
        sort,
        onSort
    } = props;
    const size = props.size || "medium";

    const parseRender = useCallback((col: ITableColumn, item: any) => {
        const data = item.row.original;
        const index = item.row.index;
        if (col.render) {
            return col.render(data, index);
        }
    }, []);

    const TransformColumn = useCallback((column: ITableColumn) => {
        const colObject: any = {
            Header: column.title,
            key: column.key,
            accessor: column.dataIndex || column.key,
            sticky: column.fixed,
            sortable: column.sortable,
        };
        if (column.dataIndex) {
            colObject['accessor'] = column.dataIndex;
        }
        if (column.render) {
            colObject['Cell'] = (data: any) => parseRender(column, data);
        }
        if (column.width) {
            colObject['width'] = column.width;
        }
        if (column.children) {
            colObject['columns'] = column.children.map((child: ITableColumn) => TransformColumn(child));
        }
        return colObject;
    }, []);

    const parseColumns = useCallback((columns: ITableColumn[]) => {
        const transformedCols: any = columns.map((column: ITableColumn) => {
            return TransformColumn(column);
        });
        if (showExpandColumn) {
            transformedCols.unshift({
                Header: () => null,
                id: 'expander',
                Cell: ({row}: any) => {
                    return <span {...row.getToggleRowExpandedProps()}>
                        {row.isExpanded ? <ImageConfig.TableRowCollapseIcon/> : <ImageConfig.TableRowExpandIcon/>}
                    </span>
                },
                width: 35,
            });
        }
        return transformedCols;
    }, [showExpandColumn, TransformColumn]);

    const columnsMemoized = useMemo<any>(() =>
        parseColumns(columns), [columns]);

    const dataMemoized = useMemo<any>(() =>
        data, [data]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        visibleColumns,
    } = useTable(
        {
            columns: columnsMemoized,
            data: dataMemoized,
        },
        useBlockLayout,
        useExpanded,
        useSticky
    );

    const getTHClasses = useCallback((column: ITableColumn) => {
        let classes = 'th t-th t-cell t-cell-' + column.key?.split(' ').join('-') + " " + column.className + '';
        if (column?.sortable) {
            classes += " sortable";
            if (sort && sort.key === column.key) {
                if (sort.order === "asc") {
                    classes += " sort-asc";
                } else {
                    classes += " sort-desc";
                }
            }
        }
        return classes;
    }, [sort]);

    const getTDClasses = useCallback((column: ITableColumn) => {
        return 'td t-td t-cell t-cell-' + column.key?.split(' ').join('-') + " " + column.className + '';
    }, []);

    const handleRowClick = useCallback((row: any) => {
        if (onRowClick) {
            const data = row.original;
            const index = row.index;
            onRowClick(data, index);
        }
    }, [onRowClick]);

    const applySort = useCallback((column: ITableColumn) => {
        if (!column.sortable || !sort) return;
        const sortObj: any = _.cloneDeep(sort);
        if (sortObj.key === column.key) {
            sortObj.key = column.key;
            if (sortObj.order === "asc") {
                sortObj.order = "desc";
            } else {
                sortObj.order = "";
                sortObj.key = "";
            }
        } else {
            sortObj.key = column.key;
            sortObj.order = "asc";
        }
        if (onSort) {
            onSort(sortObj.key, sortObj.order);
        }
    }, [sort]);

    return (
        <div className={'table-v2-component'}>
            <TableStyles className={'styled-table'}>
                <div className={`t-table-wrapper`}>
                    <div {...getTableProps()} className={`t-table table sticky ${size}`}>
                        {
                            !hideHeader && <div className="header t-thead">
                            {headerGroups.map((headerGroup) => (
                                <div {...headerGroup.getHeaderGroupProps()} className="t-tr">
                                    {headerGroup.headers.map((column: any) => <div {...column.getHeaderProps()}
                                                                                   onClick={() => applySort(column)}
                                                                                   className={getTHClasses(column)}>
                                            {column.render('Header')}
                                        </div>
                                    )}
                                </div>
                            ))}
                            </div>
                        }
                        {
                            !errored && <div {...getTableBodyProps()} className="body t-body">
                                {
                                    rows.length > 0 && rows.map((row: any) => {
                                        console.log(row);
                                        prepareRow(row);
                                        return (
                                            <>
                                                <div className="t-tr"
                                                     onClick={() => handleRowClick(row)} {...row.getRowProps()}>
                                                    {row.cells.map((cell: any) => {
                                                        return (
                                                            <div {...cell.getCellProps()} className={getTDClasses(cell.column)}>
                                                                {cell.render('Cell')}
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                                {(row.isExpanded || defaultExpandAllRows && (canExpandRow && canExpandRow(row.original))) && expandRowRenderer &&
                                                    <div className={'t-tr'}>
                                                        <div className="t-td">
                                                            {expandRowRenderer(row.original, row.index)}
                                                        </div>
                                                    </div>
                                                }
                                            </>
                                        );
                                    })
                                }
                                {
                                    rows.length === 0 &&
                                    <StatusCardComponent title={"No data found"} className={'table-data-not-found-card'}/>
                                }
                            </div>
                        }
                        {
                            loading && <div className={'data-loading-wrapper'}>
                                <div className="loader">
                                    <LoaderComponent type={"spinner"}/>
                                </div>
                            </div>
                        }
                        {
                            (errored && !loading) &&
                            <StatusCardComponent title={"Error loading data"} className={'table-loading-error-card'}/>
                        }
                    </div>
                </div>
            </TableStyles>
        </div>
    );
};

export default TableV2Component;
