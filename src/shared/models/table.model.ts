export interface ITableColumn {
    dataIndex?: string;
    key: string;
    title?: any;
    render?: any;
    sorter?: any;
    width?: number;
    fixed?: "left" | "right" | undefined;
}

