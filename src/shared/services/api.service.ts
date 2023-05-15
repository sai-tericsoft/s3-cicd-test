import axios, {
    AxiosRequestConfig,
    AxiosResponse,
} from 'axios';
import Communications from "./communications.service";
import {ENV, Misc} from "../../constants";
import { IAPIResponseType, IAxiosOptions } from "../models/api.model";
import localStorageService from "./local-storage.service";

export const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
};

export const AXIOS_REQUEST_CANCELLED = 'AXIOS_REQUEST_CANCELLED';

// let jwtToken: string | undefined = localStorageService.getItem(Misc.LOCAL_STORAGE_JWT_TOKEN) || '';
let jwtToken: string | undefined = localStorageService.getItem(Misc.LOCAL_STORAGE_JWT_TOKEN) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTE1LCJmaXJzdE5hbWUiOiJkaXZ5YSIsImxhc3ROYW1lIjoiYXNhcyIsInV1SWQiOiI5YjMwMjk5My01NjNlLTRhNzAtYmEwNi1hMGIwNjg4ZWFhZTgiLCJkYXRlT2ZCaXJ0aCI6IjIwMjItMDctMTQiLCJnZW5kZXIiOiJmZW1hbGUiLCJwaG9uZU51bWJlciI6IjkyMTEyMTIxMjEiLCJ6aXBjb2RlIjoiNjAxMjItOTA5OSIsInN0YXRlIjoiUFIiLCJoZWlnaHRJbkluY2hlcyI6bnVsbCwiaGVpZ2h0SW5GZWV0IjpudWxsLCJ3ZWlnaHQiOm51bGwsImNpdHkiOiJBZ3VhZGEiLCJlbWFpbElkIjoiZGl2eWFAZ21haWwuY29tIiwiaGVpZ2h0SW5DbXMiOiIwIiwidXBkYXRlZEF0IjoiMjAyMi0wNy0xNVQwOTo0NjowMy43ODFaIiwiY3JlYXRlZEF0IjoiMjAyMi0wNy0xNVQwOTo0NjowMy43ODFaIiwibWlkZGxlTmFtZSI6bnVsbCwiaWF0IjoxNjU3ODc4MzYzLCJleHAiOjE2NTkwNzgzNjN9.Cwj2yzoRpG0i7OVpQ1wcc9rWSU-5od32Npifj92lkks';

Communications.updateLoginUserTokenSubject.subscribe((token: string | undefined) => {
    jwtToken = token;
});

const getHeaders = (headers: any) => {
    const AuthorizationHeaders = {'Authorization': 'Bearer ' + jwtToken};
    headers = {
        ...defaultHeaders, ...AuthorizationHeaders, ...headers
    };
    return headers;
}

const ApiService = {
    post: (url: string, payload = {},
           headers = {}, options: IAxiosOptions = {},
           progressCallback: (progress: number) => void = (progress) => {
           }): Promise<IAPIResponseType<any>> => {
        const axiosOptions: AxiosRequestConfig = {
            headers: getHeaders(headers),
            ...options,
            onUploadProgress: uploadProgressHandler.bind(null, progressCallback)
        };
        let request = axios.post(url, payload, axiosOptions);
        return getRequestPromise(request);
    },
    put: (url: string, payload = {},
          headers = {}, options: IAxiosOptions = {},
          progressCallback: (progress: number) => void = (progress) => {
          }): Promise<IAPIResponseType<any>> => {
        const axiosOptions: AxiosRequestConfig = {
            headers: getHeaders(headers),
            ...options,
            onUploadProgress: uploadProgressHandler.bind(null, progressCallback)
        };
        let request = axios.put(url, payload, axiosOptions);
        return getRequestPromise(request);
    },
    upload: (url: string, payload = new FormData(),
             headers = {}, options: IAxiosOptions = {},
             progressCallback: (progress: number) => void = (progress) => {
             }): Promise<IAPIResponseType<any>> => {
        const axiosOptions: AxiosRequestConfig = {
            headers: getHeaders({...headers}),
            ...options,
            onUploadProgress: uploadProgressHandler.bind(null, progressCallback)
        };
        let request = axios.post(url, payload, axiosOptions);
        return getRequestPromise(request);
    },
    get: (url: string, payload = {}, headers = {},
          options: IAxiosOptions = {}): Promise<IAPIResponseType<any>> => {
        const axiosOptions: AxiosRequestConfig = {
            headers: getHeaders(headers),
            params: payload,
            ...options,
        };
        let request = axios.get(url, axiosOptions);
        return getRequestPromise(request);
    },
    delete: (url: string, payload = {}, headers = {},
             options: IAxiosOptions = {}): Promise<IAPIResponseType<any>> => {
        // options = getParsedOptions(headers, options);
        const axiosOptions: AxiosRequestConfig = {
            headers: getHeaders(headers),
            data: payload,
            ...options
        };
        let request = axios.delete(url, axiosOptions);
        return getRequestPromise(request);
    }
}

const uploadProgressHandler = (progressCallback: (progress: number) => void, progressEvent: any) => {
    if (progressCallback) {
        const percentFraction = progressEvent.loaded / progressEvent.total;
        const percent = Math.floor(percentFraction * 100);
        progressCallback(percent);
    }
}

const getRequestPromise = (request: Promise<AxiosResponse>) => {
    return new Promise<any>((resolve, reject) => {
        request
            .then((resp) => {
                if (ENV.ENABLE_HTTP_LOGS) {
                    // console.log('====>>>>>>', resp.data);
                }
                setTimeout(() => {
                    resolve({...resp.data, status: resp.status});
                }, 300);
            })
            .catch((err: any) => {
                if (ENV.ENABLE_HTTP_LOGS) {
                    // console.error('=====>', err, 'API Error');
                }
                try {
                    const response: any = (err.response) ? err.response : {data: null};
                    let error: any = (response.data) ? {...response.data} : {status: 500};
                    error.status = response.status ? parseInt(response.status) : 500;
                    if (error.status === 401) {
                        Communications.logoutSubject.next();
                    }
                    if (error.status === 403) {
                        Communications.ReloadStateSubject.next();
                    }
                    if (axios.isCancel(err)) {
                        error.status = 499;
                        error.reason = AXIOS_REQUEST_CANCELLED;
                    }
                    setTimeout(() => {
                        reject(error);
                    }, 300);
                } catch (e) {
                    console.error('=====>', e, 'Api Function Catch');
                }
            });
    });
}

export default ApiService;
