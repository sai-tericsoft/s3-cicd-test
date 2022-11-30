export interface ITableColumn {
    dataIndex?: string;
    key: string;
    title?: any;
    render?: any;
    sorter?: any;
    className?: string;
    width?: number | string;
    fixed?: "left" | "right" | undefined;
}

export interface ITableComponentProps {
    bordered?: boolean;
    columns: ITableColumn[];
    fixedHeader?: boolean;
    onRowClick?: (row: any, index: any) => void;
    rowClassName?: (row: any, index: number) => string;
    rowKey?: (row: any) => string;
    showHeader?: boolean;
    size?: 'small' | 'middle' | 'large';
}



