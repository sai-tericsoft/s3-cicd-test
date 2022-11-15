import {
    AxiosAdapter,
    AxiosBasicCredentials, AxiosProxyConfig,
    AxiosRequestTransformer,
    AxiosResponseTransformer, CancelToken,
    ResponseType
} from "axios";

export interface IAPIResponseType<TYPE> {
    success: boolean,
    data: TYPE | any | { docs: any[], total: number, pages: number, limit: number, page: number },
    message?: string,
    error?: string,
    errors?: any[]
}

export interface IAxiosOptions {
    transformRequest?: AxiosRequestTransformer | AxiosRequestTransformer[];
    transformResponse?: AxiosResponseTransformer | AxiosResponseTransformer[];
    paramsSerializer?: (params: any) => string;
    timeout?: number;
    timeoutErrorMessage?: string;
    withCredentials?: boolean;
    adapter?: AxiosAdapter;
    auth?: AxiosBasicCredentials;
    responseType?: ResponseType;
    xsrfCookieName?: string;
    xsrfHeaderName?: string;
    maxContentLength?: number;
    validateStatus?: ((status: number) => boolean) | null;
    maxBodyLength?: number;
    maxRedirects?: number;
    socketPath?: string | null;
    httpAgent?: any;
    httpsAgent?: any;
    proxy?: AxiosProxyConfig | false;
    cancelToken?: CancelToken;
    decompress?: boolean;
}
