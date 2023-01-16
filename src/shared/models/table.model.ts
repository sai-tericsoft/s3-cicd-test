import {TableRowSelection} from "antd/lib/table/interface";
import {bool} from "yup";

export interface ITableColumn {
    dataIndex?: string;
    key?: string;
    title?: any;
    render?: any;
    sortable?: any;
    className?: string;
    width?: number | string;
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
    showHeader?: boolean;
    tableLayout?: 'auto' | 'fixed' | undefined;
    scroll?:  "unset" | "scroll";
    size?: 'small' | 'middle' | 'large';
    onSort?: (key: string, order: string) => void;
    rowExpandable?: (row: any) => boolean
    id?: string;
    defaultExpandAllRows?: boolean;
    showExpandColumn?: boolean;
    expandRow?: (row: any) => React.ReactNode;
    rowSelection?: TableRowSelection<any>;
}



