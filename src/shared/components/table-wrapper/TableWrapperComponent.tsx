import "./TableWrapperComponent.scss";

import * as React from 'react';
import {useCallback, useEffect, useRef, useState} from 'react';
import {IAPIResponseType} from "../../models/api.model";
import {ITableComponentProps} from "../../models/table.model";
import {CommonService} from "../../services";
import PaginationComponent from "../pagination/PaginationComponent";
import _ from "lodash";
import TableComponent from "../table/TableComponent";
import TableV2Component from "../table-v2/TableV2Component";

export interface TableComponentProps extends ITableComponentProps {
    moduleName?: string;
    type?: "ant" | "custom",
    url: string,
    method: "get" | "post" | string,
    isPaginated?: boolean,
    extraPayload?: any;
    refreshToken?: string; // TODO review and make it standard
    autoHeight?: boolean;
}

const TableWrapperComponent = (props: TableComponentProps) => {
    const {refreshToken, moduleName, autoHeight, id, url, method, extraPayload, ...otherProps} = props;
    const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
    // const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
    const [isDataLoadingFailed, setIsDataLoadingFailed] = useState<boolean>(false);
    const [data, setData] = useState<any>([]);
    const pageNumRef = useRef<number>(0);
    const totalResultsRef = useRef<number>(0);
    const pageSizeRef = useRef<number>(10);
    const isPaginated = props.isPaginated !== undefined ? props.isPaginated : true;
    const type = props.type || "custom";
    const APICallSubscription = useRef<any>(null);

    const getListData = useCallback(() => {
        const cancelTokenSource = CommonService.getCancelToken();
        const payload = _.cloneDeep({limit: pageSizeRef.current, ...extraPayload, page: pageNumRef.current + 1});
        console.log(payload);
        if (payload?.sort && payload?.sort?.key) { // TODO to make sort more consistent
            payload.sort[payload.sort.key] = payload?.sort?.order;
            delete payload.sort.key;
            delete payload.sort.order;
        } else {
            delete payload.sort;
        }
        let apiCall;
        if (method === "post") {
            apiCall = CommonService._api.post(url, payload, {cancelToken: cancelTokenSource.token});
        } else {
            apiCall = CommonService._api.get(url, payload, {cancelToken: cancelTokenSource.token});
        }
        if (APICallSubscription && APICallSubscription.current) {
            APICallSubscription.current.cancel();
        }
        APICallSubscription.current = cancelTokenSource;
        setIsDataLoading(true);
        // setIsDataLoaded(false);
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
            // setIsDataLoaded(true);
            setIsDataLoadingFailed(false);
        }).catch((error) => {
            setData(listData);
            setIsDataLoading(false);
            // setIsDataLoaded(false);
            setIsDataLoadingFailed(true);

        })
    }, [isPaginated, method, url, extraPayload]);

    useEffect(() => {
        if (extraPayload?.page) {
            pageNumRef.current = extraPayload.page - 1;
        }
        getListData();
    }, [getListData, refreshToken, extraPayload]);

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
        const sub = CommonService._communications.TableWrapperRefreshSubject.subscribe((data) => {
            if (data.moduleName === moduleName) {
                getListData();
            }
        });
        return () => {
            sub.unsubscribe();
        }
    }, [getListData, moduleName]);

    return (
        <>
            {
                type === "custom" && <TableComponent
                    loading={isDataLoading}
                    errored={isDataLoadingFailed}
                    data={data}
                    id={id}
                    sort={extraPayload?.sort}
                    {...otherProps}
                />
            }
            {
                type === "ant" && <TableV2Component
                    loading={isDataLoading}
                    errored={isDataLoadingFailed}
                    data={data}
                    id={id}
                    sort={extraPayload?.sort}
                    {...otherProps}
                />
            }
            {
                (data && isPaginated) && <PaginationComponent
                    paginationOptions={[10, 25, 100]}
                    totalResults={totalResultsRef.current}
                    limit={pageSizeRef.current}
                    page={pageNumRef.current}
                    onPageChange={handlePageNumberChange}
                    onRowsPerPageChange={handlePageSizeChange}
                    id={id + "_pagination"}
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
