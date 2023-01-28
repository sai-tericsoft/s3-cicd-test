import './TestScreen.scss';
import {ITableColumn} from "../../shared/models/table.model";
import {useCallback, useMemo, useState} from "react";
import {MOCK_USER_DATA} from "../../assets/data/user.data";
import ButtonComponent from "../../shared/components/button/ButtonComponent";
import TableComponent from "../../shared/components/table/TableComponent";

const TestScreen = () => {


    const UserTableColumns: ITableColumn[] = useMemo<any>(() => [
        // {
        //     key: 'select',
        //     title: <CheckBoxComponent
        //         onChange={(isChecked) => {
        //             if (isChecked) {
        //                 setSelectedRows(MOCK_USER_DATA);
        //             } else {
        //                 setSelectedRows([]);
        //             }
        //         }}
        //         indeterminate={selectedRows.length > 0 && selectedRows.length < MOCK_USER_DATA.length}
        //         checked={selectedRows.length === MOCK_USER_DATA.length}
        //     />,
        //     dataIndex: 'select',
        //     width: 80,
        //     fixed: 'left',
        //     render: (item: any, index: any) => {
        //         return <CheckBoxComponent
        //             checked={selectedRows.includes(item)}
        //             onChange={(isChecked) => {
        //                 if (isChecked) {
        //                     setSelectedRows([...selectedRows, item]);
        //                 } else {
        //                     setSelectedRows(selectedRows.filter((row) => row !== item));
        //                 }
        //             }}
        //         />
        //     }
        // },
        {
            key: 'name',
            title: 'Name',
            dataIndex: 'first_name',
            fixed: 'left',
            render: (item: any, index: any) => {
                return <>{item.first_name} {item.last_name}</>
            }
        },
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
            width: 200,
        },
        // {
        //     title: 'Date of birth',
        //     dataIndex: 'date_of_birth',
        //     key: 'date_of_birth',
        //     width: 200,
        // },
        // {
        //     title: 'Phone',
        //     dataIndex: 'phone',
        //     key: 'phone',
        //     width: 400,
        // },
        // {
        //     title: 'Email',
        //     dataIndex: 'email',
        //     key: 'email',
        //     width: 400,
        //     sortable: true
        // },
        // {
        //     title: 'Notes',
        //     dataIndex: 'notes',
        //     key: 'notes',
        //     width: 200,
        //     render: (item: any) => {
        //         return <InputComponent size={'small'} value={item.first_name + ' ' + item.last_name}/>
        //     }
        // },
        // {
        //     title: 'Age',
        //     dataIndex: 'age',
        //     key: 'age',
        // },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            fixed: 'right',
            render: (item: any) => {
                return <ButtonComponent>
                    View Details
                </ButtonComponent>
            }
        },
    ], []);

    const [filter, setFilter] = useState<any>({
        sort: {
            key: 'age',
            order: 'asc'
        }
    });

    const handleSort = useCallback((key: string, order: string) => {
        setFilter({
            ...filter,
            sort: {
                key,
                order
            }
        });
    }, [filter]);

    return (
        <div className="test-screen">
            <TableComponent data={MOCK_USER_DATA.slice(0, 19)}
                            columns={UserTableColumns}
                            sort={filter.sort}
                            onSort={handleSort}
                            // defaultExpandAllRows={true}
                            // showExpandColumn={true}
                            // canExpandRow={(item: any) => item.id === 1}
                            // expandRowRenderer={(item: any) => {
                            //     return <div className="expand-row">
                            //         Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam, molestias?
                            //     </div>
                            // }}
            />
        </div>
    );
};
export default TestScreen;
