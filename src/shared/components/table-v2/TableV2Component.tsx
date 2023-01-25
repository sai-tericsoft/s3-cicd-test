import "./TableV2Component.scss";
import {useBlockLayout, useTable} from 'react-table';
import {useSticky} from "react-table-sticky";
import {useCallback, useMemo} from "react";
import {TableStyles} from "./TableStyles";
import {ITableColumn, ITableComponentProps} from "../../models/table.model";
import _ from "lodash";
import LoaderComponent from "../loader/LoaderComponent";
import StatusCardComponent from "../status-card/StatusCardComponent";

interface TableV2ComponentProps extends ITableComponentProps {
    loading?: boolean;
    errored?: boolean;
    id?: string;
    columns: ITableColumn[];
    data: any[];
}

const TableV2Component = (props: TableV2ComponentProps) => {

    const {loading, errored, columns, onRowClick, data, sort, onSort} = props;
    const size = props.size || "medium";

    console.log(sort);

    const parseRender = useCallback((col: ITableColumn, item: any) => {
        const data = item.row.original;
        const index = item.row.index;
        if (col.render) {
            return col.render(data, index);
        }
    }, []);

    const parseColumns = useCallback((columns: ITableColumn[]) => {
        const transformedCols: any = columns.map((column: ITableColumn) => {
            const col = _.cloneDeep(column);
            const colObject: any = {
                Header: col.title,
                key: col.key,
                accessor: col.dataIndex || col.key,
                sticky: col.fixed,
                sortable: col.sortable,
                verticalAlign: "middle",
            };
            if (col.dataIndex) {
                colObject['accessor'] = col.dataIndex;
            }
            if (col.render) {
                colObject['Cell'] = (data: any) => parseRender(col, data);
            }
            if (col.width) {
                colObject['width'] = col.width;
            }
            return colObject;
        });
        return transformedCols;
    }, []);

    const columnsMemoized = useMemo<any>(() =>
            parseColumns(columns)
        , [columns]);
    const dataMemoized = useMemo<any>(() =>
            data
        , [data]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable(
        {
            columns: columnsMemoized,
            data: dataMemoized
        },
        useBlockLayout,
        useSticky
    );

    const getTHClasses = useCallback((column: ITableColumn) => {
        let classes = 'th t-th t-cell t-cell-' + column.key?.split(' ').join('-') + " " + column.className + '';
        if (column.sortable) {
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
            const data = row.values;
            const index = row.index;
            onRowClick(data, index);
        }
    }, [onRowClick]);

    const applySort = useCallback((column: ITableColumn) => {
        console.log(column);
        if (!column.sortable || !sort) return;
        const sortObj = _.cloneDeep(sort);
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
            <TableStyles>
                <div className={`t-table-wrapper`}>
                    <div {...getTableProps()} className={`t-table table sticky ${size}`}>
                        <div className="header">
                            {headerGroups.map((headerGroup) => (
                                <div {...headerGroup.getHeaderGroupProps()} className="tr">
                                    {headerGroup.headers.map((column: any) => <div {...column.getHeaderProps()}
                                                                                   onClick={() => applySort(column)}
                                                                                   className={getTHClasses(column)}>
                                            {column.render('Header')}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {
                            !errored && <div {...getTableBodyProps()} className="t-body body">
                                {
                                    rows.length > 0 && rows.map((row: any) => {
                                        prepareRow(row);
                                        return (
                                            <div {...row.getRowProps()} className="tr" onClick={() => handleRowClick(row)}>
                                                {row.cells.map((cell: any) => <div {...cell.getCellProps()}
                                                                                   onClick={() => applySort(cell.column)}
                                                                                   className={getTDClasses(cell.column)}>
                                                        {cell.render('Cell')}
                                                    </div>
                                                )}
                                            </div>
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
