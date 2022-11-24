import "./TableWrapperComponent.scss";

import * as React from 'react';
import {useCallback, useEffect, useRef, useState} from 'react';
import {IAPIResponseType} from "../../models/api.model";
import {ITableComponentProps} from "../../models/table.model";
import TableComponent from "../table/TableComponent";
import {CommonService} from "../../services";
import PaginationComponent from "../pagination/PaginationComponent";

export interface TableComponentProps extends ITableComponentProps{
    url: string,
    method: "get" | "post" | string,
    isPaginated: boolean,
    extraPayload?: any;
}

const TableWrapperComponent = (props: TableComponentProps) => {

    const {columns, size, url, method, extraPayload, fixedHeader, isPaginated} = props;

    const [isDataLoading, setIsDataLoading] = useState<any>(false);
    const [isDataLoaded, setIsDataLoaded] = useState<any>(false);
    const [isDataLoadingFailed, setIsDataLoadingFailed] = useState<any>(false);
    const [data, setData] = useState<any>([]);
    // const [error, setError] = useState<any>(null);
    const pageNumRef = useRef<number>(0);
    const totalResultsRef = useRef<number>(0);
    const pageSizeRef = useRef<number>(10);
    const fetchPageDataSubscriptionRef = useRef<boolean>(true);


    const getListData = useCallback(() => {
        const payload = {page: pageNumRef.current + 1, limit: pageSizeRef.current, ...extraPayload};
        let apiCall = null;
        if (method === "post") {
            apiCall = CommonService._api.post(url, payload);
        } else {
            apiCall = CommonService._api.get(url, payload);
        }
        setIsDataLoading(true);
        setIsDataLoaded(false);
        setIsDataLoadingFailed(false);
        let listData: any[] = [];
        apiCall.then((response: IAPIResponseType<any>) => {
            if (response.data) {
                if (isPaginated) {
                    listData = response?.data?.docs || [];
                    totalResultsRef.current = response?.data?.total;
                } else {
                    listData = response?.data
                }
            }
            setData(listData);
            // setError(null);
            setIsDataLoading(false);
            setIsDataLoaded(true);
            setIsDataLoadingFailed(false);
        }).catch((error) => {
            setData(listData);
            // setError(error);
            setIsDataLoading(false);
            setIsDataLoaded(false);
            setIsDataLoadingFailed(true);
        })
    }, [isPaginated, method, url, extraPayload]);

    const handlePageNumberChange = useCallback((event: unknown, newPage: number) => {
        pageNumRef.current = newPage;
        getListData();
    }, [getListData]);

    const handlePageSizeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        pageSizeRef.current = +event.target.value;
        pageNumRef.current = 0;
        getListData();
    }, [getListData]);

    // const handleSortColumn = useCallback((columnName: string, mode: string) => {
    //     extraPayload.sort = {
    //         columnName: mode
    //     }
    // }, []);

    useEffect(() => {
        getListData();
    }, [url, extraPayload, getListData]);

    useEffect(() => {
        CommonService._communications.FetchPageDataSubject.subscribe(() => {
            if (!fetchPageDataSubscriptionRef.current) return null;
            getListData();
        });
        return () => {
            fetchPageDataSubscriptionRef.current = false;
        }
    }, [getListData]);

    return (
        <>
            {isDataLoadingFailed && <div>Failed to load</div>}
            <div className="t-table-wrapper">
                <TableComponent
                    fixedHeader={fixedHeader}
                    columns={columns}
                    size={size}
                    loading={isDataLoading}
                    data={data}/>
                {
                    (isDataLoaded && (data && data?.length) > 0 && isPaginated) && <PaginationComponent
                        paginationOptions={[10, 25, 100]}
                        totalResults={totalResultsRef.current}
                        limit={pageSizeRef.current}
                        page={pageNumRef.current}
                        onPageChange={handlePageNumberChange}
                        onRowsPerPageChange={handlePageSizeChange}
                    />
                }
            </div>
        </>
    );
};

export default TableWrapperComponent;

// ****************************** USAGE ****************************** //

// <TableWrapperComponent
//     columns={[
//         {
//             key: "name",
//             dataIndex: "name",
//             title: "Name"
//         },
//         {
//             key: "description",
//             dataIndex: "description",
//             title: "Description"
//         }
//     ]}
//     rowKey={(record: any) => {
//         return record._id;
//     }}
//     url={ENV.API_URL + "/category/637caaa4ef59e8a8cdc9f4b3/service"}
//     method={"get"}
//     isPaginated={true}
// />

// ****************************** USAGE ****************************** //
