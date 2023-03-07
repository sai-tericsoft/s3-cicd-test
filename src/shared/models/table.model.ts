import {TableRowSelection} from "antd/lib/table/interface";

export interface ITableColumn {
    dataIndex?: string;
    key: string;
    title?: any;
    render?: (row: any, index: number) => void;
    sortable?: any;
    className?: string;
    width?: number | string;
    align?: 'left' | 'right' | 'center';
    fixed?: "left" | "right" | undefined;
    children?: ITableColumn[];
}

export interface ITableComponentProps {
    bordered?: boolean;
    columns: ITableColumn[];
    fixedHeader?: boolean;
    onRowClick?: (row: any, index: any) => void;
    rowClassName?: (row: any, index: number) => string;
    rowKey?: (row: any, index: number) => string;
    hideHeader?: boolean;
    size?: 'small' | 'middle' | 'large';
    onSort?: (key: string, order: string) => void;
    canExpandRow?: (row: any) => boolean;
    id?: string;
    defaultExpandAllRows?: boolean;
    showExpandColumn?: boolean;
    expandRowRenderer?: (row: any, index: number) => React.ReactNode;
    rowSelection?: TableRowSelection<any>;
    noDataText?:string;
    sort?: {
        key: string;
        order: string;
    },
    autoHeight?: boolean;
}



