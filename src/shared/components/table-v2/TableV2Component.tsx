import "./TableV2Component.scss";

import {ColumnDef, createColumnHelper, flexRender, getCoreRowModel, useReactTable,} from '@tanstack/react-table'
import {useEffect, useState} from "react";

type Person = {
    firstName: string
    lastName: string
    age: number
    visits: number
    status: string
    progress: number
}

const columnHelper = createColumnHelper<Person>()

const columns: ColumnDef<Person, any>[] = [
    columnHelper.accessor('firstName', {
        cell: info => info.getValue(),
        header: "First Name",
        size: 10,
        minSize: 10,
        maxSize: 50,
    }),
    columnHelper.accessor(row => row.lastName, {
        id: 'lastName',
        cell: info => <i>{info.getValue()}</i>,
        header: () => <span>Last Name</span>,
        size: 300,
        minSize: 100,
        maxSize: 500,
    }),
    columnHelper.accessor('age', {
        header: () => 'Age',
        cell: info => info.renderValue(),
        size: 300,
        minSize: 100,
        maxSize: 500,
    }),
    columnHelper.accessor('visits', {
        header: () => <span>Visits</span>,
        size: 300,
        minSize: 100,
        maxSize: 500,
    }),
    columnHelper.accessor('status', {
        header: 'Status',
    }),
    columnHelper.accessor('progress', {
        header: 'Profile Progress',
        minSize: 1000,
    }),
    columnHelper.accessor('progress', {
        header: 'Profile Progress',
    }),
    columnHelper.accessor('progress', {
        header: 'Profile Progress',
    }),
    columnHelper.accessor('progress', {
        header: 'Profile Progress',
    }),
    columnHelper.accessor('progress', {
        header: 'Profile Progress',
    }),
]

interface TableV2ComponentProps {

}

const TableV2Component = (props: TableV2ComponentProps) => {

    const [data, setData] = useState<Person[]>([]);

    useEffect(() => {
        for (let i = 0; i < 10; i++) {
            data.push({
                firstName: 'tanner',
                lastName: 'linsley',
                age: 24,
                visits: 100,
                status: 'In Relationship',
                progress: 50,
            });
        }
        setData([...data]);
    }, []);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className={'table-v2-component'}>
            <table>
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id} >
                        {headerGroup.headers.map(header => (
                            <th key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
                <tfoot>
                {table.getFooterGroups().map(footerGroup => (
                    <tr key={footerGroup.id}>
                        {footerGroup.headers.map(header => (
                            <th key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.footer,
                                        header.getContext()
                                    )}
                            </th>
                        ))}
                    </tr>
                ))}
                </tfoot>
            </table>
        </div>
    );

};

export default TableV2Component;
