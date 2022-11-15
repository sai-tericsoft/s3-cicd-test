import React from 'react';
import {ApiService} from "../services";

export class Pagination {
    totalItems = 0;
    pageSize = 10;
    pageIndex = 0;
    pageSizeOptions = [10, 25, 50, 100];
}

export interface TsDataListState {
    table: TsDataListWrapperClass;
    refreshToken?: string;
}


export interface DataListConfig {
    _isDataLoading?: boolean;
    _isDataLoaded?: boolean;
    data?: any[];
    filter?: object;
    sort?: object;
    extraPayload?: object;
    pagination?: Pagination;
}

export class TsDataListOptions {
    _isDataLoading = false;
    _isDataLoaded = false;
    data = [];
    extraPayload: any = {};
    filter: any = {search: ''};
    pagination = new Pagination();
    _mobileQuery: MediaQueryList | null = null;

    constructor(
        config: DataListConfig,
        public url: string,
        public setState: React.Dispatch<React.SetStateAction<TsDataListState | undefined>>,
        public _apiService: typeof ApiService,
        public method = 'post',
        _mobileQuery: MediaQueryList | null = null
    ) {
        if (config) {
            if (config.extraPayload) {
                this.extraPayload = config.extraPayload;
            }
            if (config.filter) {
                this.filter = config.filter;
            }
            if (config.pagination) {
                this.pagination = {...this.pagination, ...config.pagination};
            }
            if (_mobileQuery) {
                this._mobileQuery = _mobileQuery;
            }
        }
    }
}

export class TsDataListWrapperClass {
    _isDataLoading = false;
    _isDataLoaded = false;
    data = [];
    filter: any = {};
    sort: any = {};
    extraPayload: any = {};
    pagination: Pagination = new Pagination();
    _apiService: typeof ApiService;
    url = '';
    method = 'post';
    _apiCall: any;
    refreshToken: string = '';
    setState: React.Dispatch<React.SetStateAction<TsDataListState | undefined>>;

    constructor(options: TsDataListOptions) {
        this._isDataLoading = options._isDataLoading;
        this._isDataLoaded = options._isDataLoaded;
        this.data = options.data;
        this.filter = options.filter;
        this.extraPayload = options.extraPayload;
        this.pagination = options.pagination;
        this._apiService = options._apiService;
        this.url = options.url;
        this.method = options.method;
        this.setState = options.setState;
        this.getList();
    }

    setExtraPayload(payload: any): void {
        this.extraPayload = payload;
    }

    reload(page = this.pagination.pageIndex + 1) {
        this.getList(page);
    }

    canShowTable() {
        return this._isDataLoaded && this.data && this.data.length > 0;
    }

    canShowNoData() {
        return !this._isDataLoading && this._isDataLoaded && (!this.data || this.data.length === 0);
    }

    pageEvent(page: number = 0, limit: number = this.pagination.pageSize) {
        // console.log("page", page, limit);
        this.getList(page + 1, limit);
    }

    getList(page = 1, limit = this.pagination.pageSize) {
        this._isDataLoading = true;
        this.refreshToken = Math.random().toString();
        this.setState({table: this, refreshToken: this.refreshToken});
        const payload = {
            ...this.filter,
            ...this.extraPayload,
            page,
            limit,
            sort: this.sort,
        };
        // const cancelTokenSource = CommonService.getCancelToken();
        let request = this._apiService.post;
        if (this.method === 'get') {
            request = this._apiService.get;
        }
        if (this._apiCall) {
            // this._apiCall.cancel();
        }
        // this._apiCall = cancelTokenSource;
        request(
            this.url,
            payload,
            {},
            // {cancelToken: cancelTokenSource.token}
        ).then(
            (response) => {
                this._isDataLoading = false;
                this._isDataLoaded = true;
                if (response) {
                    this.data = response.data.docs || response.data || [];
                    this.pagination.totalItems = response.data.total || 0;
                    this.pagination.pageSize = response.data.limit || limit;
                    this.pagination.pageIndex = (response.data.page || page) - 1;
                    //   console.log(this.data);
                } else {
                    this.data = [];
                    this.pagination.totalItems = 0;
                    this.pagination.pageSize = limit;
                    this.pagination.pageIndex = page - 1;
                }
                this.setState({table: this, refreshToken: this.refreshToken});
            },
            (err) => {
                this.data = [];
                this._isDataLoaded = true;
                this._isDataLoading = false;
                this.data = [];
                this.pagination.totalItems = 0;
                this.pagination.pageSize = limit;
                this.pagination.pageIndex = page - 1;
                this.setState({table: this, refreshToken: this.refreshToken});
            }
        );
    }

    sortList($event: any) {
        this.sort = {};
        this.sort[$event.active] = $event.direction;
        this.getList(1);
    }
}
