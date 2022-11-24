export interface ITableColumn {
    dataIndex?: string;
    key: string;
    title?: any;
    render?: any;
    sorter?: any;
    width?: number | string;
    fixed?: "left" | "right" | undefined;
}

export interface ITableComponentProps {
    columns: ITableColumn[];
    size?: 'small' | 'middle' | 'large';
    bordered?: boolean;
    fixedHeader?: boolean;
    loading?: boolean;
    rowClassName?: (row: any, index: number) => string;
    rowKey?: (row: any) => string;
    showHeader?: boolean;
    onRowClick?: (row: any, index: any) => void;
}



