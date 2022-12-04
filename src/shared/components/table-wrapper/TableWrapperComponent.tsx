import "./TableWrapperComponent.scss";

import * as React from 'react';
import {useCallback, useEffect, useRef, useState} from 'react';
import {IAPIResponseType} from "../../models/api.model";
import {ITableComponentProps} from "../../models/table.model";
import TableComponent from "../table/TableComponent";
import {CommonService} from "../../services";
import PaginationComponent from "../pagination/PaginationComponent";

export interface TableComponentProps extends ITableComponentProps {
    url: string,
    method: "get" | "post" | string,
    isPaginated?: boolean,
    extraPayload?: any;
    refreshToken?: string; // TODO review and make it standard
}

const TableWrapperComponent = (props: TableComponentProps) => {

    const {columns, size, showHeader, refreshToken, url, method, extraPayload, fixedHeader, onSort} = props;

    const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
    const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
    const [isDataLoadingFailed, setIsDataLoadingFailed] = useState<boolean>(false);
    const [data, setData] = useState<any>([]);
    const pageNumRef = useRef<number>(0);
    const totalResultsRef = useRef<number>(0);
    const pageSizeRef = useRef<number>(10);
    const fetchPageDataSubscriptionRef = useRef<boolean>(true);
    const isPaginated = props.isPaginated !== undefined ? props.isPaginated : true;

    const getListData = useCallback(() => {
        const payload = {page: pageNumRef.current + 1, limit: pageSizeRef.current, ...extraPayload};
        let apiCall;
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
            setIsDataLoading(false);
            setIsDataLoaded(true);
            setIsDataLoadingFailed(false);
        }).catch((error) => {
            setData(listData);
            setIsDataLoading(false);
            setIsDataLoaded(false);
            setIsDataLoadingFailed(true);
        })
    }, [isPaginated, method, url, extraPayload]);

    useEffect(()=>{
        getListData();
    }, [getListData, refreshToken]);

    const handlePageNumberChange = useCallback((event: unknown, newPage: number) => {
        pageNumRef.current = newPage;
        getListData();
    }, [getListData]);

    const handlePageSizeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        pageSizeRef.current = +event.target.value;
        pageNumRef.current = 0;
        getListData();
    }, [getListData]);

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
            <TableComponent
                showHeader={showHeader}
                fixedHeader={fixedHeader}
                columns={columns}
                size={size}
                loading={isDataLoading}
                errored={isDataLoadingFailed}
                onSort={onSort}
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
