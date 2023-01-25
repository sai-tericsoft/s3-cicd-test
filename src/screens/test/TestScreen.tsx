import './TestScreen.scss';
import TableV2Component from "../../shared/components/table-v2/TableV2Component";
import {ITableColumn} from "../../shared/models/table.model";
import {useCallback, useState} from "react";
import {MOCK_USER_DATA} from "../../assets/data/user.data";

const cols: ITableColumn[] = [
    {
        key: 'id',
        title: 'Id',
        dataIndex: 'id',
        width: 100,
        fixed: 'left'
    },
    {
        key: 'name',
        title: 'Name',
        dataIndex: 'name',
        children: [
            {
                key: 'first_name',
                title: 'First Name',
                dataIndex: 'first_name',
                width: 100,
            },
            {
                key: 'last_name',
                title: 'Last Name',
                dataIndex: 'last_name',
                width: 100,
            }
        ]
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
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        fixed: "right",
        sortable: true
    },
]

const TestScreen = () => {

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
            <TableV2Component data={MOCK_USER_DATA}
                              columns={cols}
                              loading={false}
                              errored={false}
                              sort={filter.sort}
                              onSort={handleSort}
            />
        </div>
    );
};
export default TestScreen;
