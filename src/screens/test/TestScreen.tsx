import './TestScreen.scss';
import TableV2Component from "../../shared/components/table-v2/TableV2Component";
import {ITableColumn} from "../../shared/models/table.model";
import {useCallback, useMemo, useState} from "react";
import {MOCK_USER_DATA} from "../../assets/data/user.data";
import CheckBoxComponent from "../../shared/components/form-controls/check-box/CheckBoxComponent";
import InputComponent from "../../shared/components/form-controls/input/InputComponent";
import ButtonComponent from "../../shared/components/button/ButtonComponent";

const TestScreen = () => {

    const [selectedRows, setSelectedRows] = useState<any[]>([]);

    const UserTableColumns: ITableColumn[] = useMemo<any>(() => [
        {
            key: 'select',
            title: <CheckBoxComponent
                onChange={(isChecked) => {
                    if (isChecked) {
                        setSelectedRows(MOCK_USER_DATA);
                    } else {
                        setSelectedRows([]);
                    }
                }}
                indeterminate={selectedRows.length > 0 && selectedRows.length < MOCK_USER_DATA.length}
                checked={selectedRows.length === MOCK_USER_DATA.length}
            />,
            dataIndex: 'select',
            width: 80,
            fixed: 'left',
            render: (item: any, index: any) => {
                return <CheckBoxComponent
                    checked={selectedRows.includes(item)}
                    onChange={(isChecked) => {
                        if (isChecked) {
                            setSelectedRows([...selectedRows, item]);
                        } else {
                            setSelectedRows(selectedRows.filter((row) => row !== item));
                        }
                    }}
                />
            }
        },
        {
            key: 'name',
            title: 'Name',
            dataIndex: 'name',
            width: 200,
            fixed: 'left',
            render: (item: any) => {
                return <span>{item?.first_name} {item?.last_name}</span>
            }
        },
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
            width: 200,
        },
        {
            title: 'Date of birth',
            dataIndex: 'date_of_birth',
            key: 'date_of_birth',
            width: 200,
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            width: 400,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 400,
            sortable: true
        },
        {
            title: 'Notes',
            dataIndex: 'notes',
            key: 'notes',
            width: 200,
            render: (item: any) => {
                return <InputComponent value={item.first_name + ' ' + item.last_name}/>
            }
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
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
    ], [selectedRows]);

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
            <TableV2Component data={MOCK_USER_DATA.slice(0, 2)}
                              columns={UserTableColumns}
                              sort={filter.sort}
                              onSort={handleSort}
                              defaultExpandAllRows={true}
                              // showExpandColumn={true}
                              caxExpandRow={(item: any) => item.id === 1}
                              expandRowRenderer={(item: any) => {
                                  return <div className="expand-row">
                                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam, molestias?
                                  </div>
                              }}
            />
        </div>
    );
};
export default TestScreen;
