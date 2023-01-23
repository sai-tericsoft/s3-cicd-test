import "./TableV2Component.scss";
import {useBlockLayout, useTable} from 'react-table';
import {useSticky} from "react-table-sticky";
import {useCallback, useMemo} from "react";
import {TableStyles} from "./TableStyles";
import {ITableColumn} from "../../models/table.model";
import _ from "lodash";
import LoaderComponent from "../loader/LoaderComponent";
import StatusCardComponent from "../status-card/StatusCardComponent";

interface TableV2ComponentProps {
    loading: boolean;
    errored: boolean;
    id?: string;
    columns: ITableColumn[];
    data: any[];
}

const TableV2Component = (props: TableV2ComponentProps) => {

    const {loading, columns, data} = props;

    const parseRender = (col: ITableColumn, item: any) => {
        const data = item.row.original;
        const index = item.row.index;
        return (col?.render ? col.render(data, index) : data.value)
    }

    const parseColumns = useCallback((columns: ITableColumn[]) => {
        const transformedCols: any = columns.map((column: ITableColumn) => {
            const col = _.cloneDeep(column);
            const colObject: any = {
                Header: col.title,
                key: col.key,
                accessor: col.dataIndex || col.key,
                sticky: col.fixed,
            }
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

    const columnsMemoized = useMemo<any>(() => parseColumns(columns), [columns]);
    const dataMemoized = useMemo<any>(() => data, [data]);

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
    )

    return (
        <div className={'table-v2-component'}>
            <TableStyles>
                <div {...getTableProps()} className="t-table table sticky">
                    <div className="header">
                        {headerGroups.map((headerGroup) => (
                            <div {...headerGroup.getHeaderGroupProps()} className="tr">
                                {headerGroup.headers.map((column: any) => <div {...column.getHeaderProps()}
                                                                               className={`th t-cell t-cell-${column.key?.split(' ').join('-')}`}>
                                        {column.render('Header')}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div {...getTableBodyProps()} className="body">
                        {
                            rows.length > 0 && rows.map((row: any) => {
                                prepareRow(row);
                                return (
                                    <div {...row.getRowProps()} className="tr">
                                        {row.cells.map((cell: any) => <div {...cell.getCellProps()}
                                                                           className={`td t-cell t-cell-${cell.column.key?.split(' ').join('-')}`}>
                                                {cell.render('Cell')}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        }
                        {
                            rows.length === 0 && <StatusCardComponent title={"No data found"} className={'table-data-not-found-card'}/>
                        }
                    </div>
                    {
                        loading && <div className={'data-loading-wrapper'}>
                            <div className="loader">
                                <LoaderComponent type={"spinner"}/>
                            </div>
                        </div>
                    }
                </div>
            </TableStyles>
        </div>
    );
};

export default TableV2Component;
