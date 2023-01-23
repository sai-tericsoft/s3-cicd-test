import Communications from './communications.service';
import queryString from "query-string";
import {FormikErrors} from "formik";
import axios, {CancelTokenSource} from "axios";
import ApiService from './api.service';
import moment, {Moment} from "moment";
import AlertService from "./alert.service";
import RouteConfigService from "./route-config.service";
import AccountService from "./modules/account.service";
import LocalStorageService from "./local-storage.service";
import {v4 as uuidv4} from 'uuid';
import UserService from "./modules/user.service";
import StaticDataService from "./modules/static-data.service";
import * as yup from "yup";
import {IConfirmationConfig} from "../models/confirmation.model";
import _ from "lodash";
import ServiceCategoryService from "./modules/service-category.service";
import ServiceService from "./modules/service.service";
import FacilityService from "./modules/facility.service";
import ClientService from "./modules/client.service";
import ChartNotesService from "./modules/chart-notes.service";
import printJS from "print-js";
import {IAttachment} from "../models/common.model";
import InventoryService from "./modules/inventory.service";


yup.addMethod(yup.mixed, 'atLeastOne', (args) => {
    const {message} = args;
    // @ts-ignore
    return this.test('atLeastOne', message, (list: any) => {
        // If there are 2+ elements after filtering, we know atMostOne must be false.
        return Object.keys(list).filter(item => item).length > 0
    })
});

const CurrentDate: Moment = moment();

const parseQueryString = (q: string): any => {
    return queryString.parse(q.replace('?', ''));
}

const getBytesInMB = (bytes: number) => {
    return bytes / (1024 * 1024);
}

const formatSizeUnits = (bytes: number, decimals = 2) => {
    if (bytes === 0) {
        return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const getRandomID = (length: number) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

const getUUID = () => {
    return uuidv4();
}

const handleErrors = ((setErrors: (errors: FormikErrors<any>) => void, err: any, showGlobalError: boolean = false) => {
    if (err.errors) {
        const errors: any = {};
        for (let field in err.errors) {
            if (err.errors.hasOwnProperty(field)) {
                errors[field] = err.errors[field][0];
            }
        }
        setErrors(errors);
    } else if (err.error) {
        AlertService.showToast(err.error);
    }
    if (showGlobalError) {
        AlertService.showToast('Form contain errors, please check once', 'error');
    }
});

const openDialog = (component: any) => {
    return new Promise((resolve, reject) => {
        Communications.DialogStateSubject.next({component, promise: {resolve, reject}})
    });
}

const getCancelToken = (): CancelTokenSource => {
    return axios.CancelToken.source();
}

const getPayloadFilterDates = (mode: 'day' | 'week' | 'month' | 'year'): { start_date: string, end_date: string } => {
    const payload = {start_date: '', end_date: moment().endOf('day').format('YYYY-MM-DD')}
    switch (mode) {
        case "day":
            payload.start_date = moment().startOf('day').format('YYYY-MM-DD')
            break;
        case "week":
            payload.start_date = moment().subtract(1, 'week').startOf('day').format('YYYY-MM-DD')
            break;
        case "month":
            payload.start_date = moment().subtract(1, "month").startOf('day').format('YYYY-MM-DD')
            break;
        case "year":
            payload.start_date = moment().subtract(1, "year").startOf('day').format('YYYY-MM-DD')
            break;
    }
    return payload;
}

const transformTimeStamp = (date: Date | string | undefined) => {
    return moment(date).format('D-MMM-YYYY | hh:mm A');
}

const convertDateFormat = (date: Date, format: string = 'YYYY-MM-DD') => {
    return moment(date).format(format);
}

const convertDateFormat2 = (date: Date, format: string = 'DD-MMM-YYYY') => {
    return moment(date).format(format);
}

const generateInterventionNameFromMedicalRecord = (medicalRecordDetails: any) => {
    return `${medicalRecordDetails?.injury_details?.map((bodyPart: any, index: number) => {
        return (bodyPart?.body_part_details?.name + (index === medicalRecordDetails?.injury_details?.length - 1 ? '' : '/'))
    })} - ${CommonService.convertDateFormat2(medicalRecordDetails?.created_at)}`
}

const getTheDifferenceBetweenDates = (fromDate: string) => {
    let a = moment();
    let b = moment(moment(fromDate), 'YYYY');
    let diff = a.diff(b, 'years')
    return diff;
}


const getFlatJsonFromNestedJSON = (jsonData: any, rootName: string = "", ignoreList: any[] = []): any => {

    const appendFormData = (data: any, root: any) => {
        let newObj: any = {};
        let tmp: any = {};
        if (!ignore(root)) {
            console.log(data, root);
            root = root || '';
            if (data instanceof File) {
                console.log(root, data, 'appending');
                newObj[root] = data;
            } else if (Array.isArray(data)) {
                for (let i = 0; i < data.length; i++) {
                    tmp = appendFormData(data[i], root + '[' + i + ']');
                    newObj = {...newObj, ...tmp}
                }
            } else if (typeof data === 'object' && data) {
                for (let key in data) {
                    if (data.hasOwnProperty(key)) {
                        if (root === '') {
                            tmp = appendFormData(data[key], key);
                            newObj = {...newObj, ...tmp}
                        } else {
                            tmp = appendFormData(data[key], root + '.' + key);
                            newObj = {...newObj, ...tmp}
                        }
                    }
                }
            } else {
                if (data !== null && typeof data !== 'undefined') {
                    newObj[root] = data;
                    console.log(root, data, newObj, 'appending');
                }
            }
        }
        return newObj;
    }

    const ignore = (root: any) => {
        return Array.isArray(ignoreList)
            && ignoreList.some((x) => {
                return x === root;
            });
    }

    return appendFormData(jsonData, rootName);
};

const getFormDataFromJSON = (obj: any, rootName = '', ignoreList = []): FormData => {

    const formData = new FormData();

    const appendFormData = (data: any, root: any) => {
        if (!ignore(root)) {
            root = root || '';
            if (data instanceof File) {
                formData.append(root, data);
            } else if (Array.isArray(data)) {
                for (let i = 0; i < data.length; i++) {
                    appendFormData(data[i], root + '[' + i + ']');
                }
            } else if (typeof data === 'object' && data) {
                for (let key in data) {
                    if (data.hasOwnProperty(key)) {
                        if (root === '') {
                            appendFormData(data[key], key);
                        } else {
                            appendFormData(data[key], root + '.' + key);
                        }
                    }
                }
            } else {
                if (data !== null && typeof data !== 'undefined') {
                    formData.append(root, data);
                }
            }
        }
    }

    const ignore = (root: any) => {
        return Array.isArray(ignoreList)
            && ignoreList.some((x: any) => {
                return x === root;
            });
    }

    appendFormData(obj, rootName);

    return formData;
}

const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const kFormatter = (num: any) => {
    // @ts-ignore
    return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num)
}

const getLettersFromNumber = (number: number) => {
    const previousLetters: any = (number >= 26 ? getLettersFromNumber(Math.floor(number / 26) - 1) : '');
    const lastLetter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[number % 26];
    return previousLetters + lastLetter;
}

const getRandomNumberBetweenRange = (startingNumber: number, endingNumber: number) => {
    startingNumber = Math.ceil(startingNumber);
    endingNumber = Math.floor(endingNumber);
    return Math.floor(Math.random() * (endingNumber - startingNumber + 1)) + startingNumber;
}

const getMinsAndSecondsFromSeconds = (numberOfSeconds: number) => {
    const minutes = Math.floor(numberOfSeconds / 60);
    const seconds = (numberOfSeconds % 60);
    return {
        minutes: minutes < 10 ? '0' + minutes : minutes,
        seconds: seconds < 10 ? '0' + seconds : seconds
    }
}

const getHoursAndMinutesFromMinutes = (minutes: number) => {
    return moment().startOf('day').add(minutes, 'minutes').format('h:mm a');
}

const downloadFile = (url: string, fileName: any, type = 'pdf') => {
    switch (type) {
        case 'image':
            axios.get(url, {
                headers: {'Content-Type': 'image/*'}
            }).then(
                (data: any) => {
                    const blob = new Blob([data], {
                        type: 'image/*' // must match the Accept type
                    });
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = fileName;
                    link.click();
                }, (error) => {
                    console.log('error')
                });
            break;
        case 'pdf':
            axios.get(url, {
                headers: {Accept: 'application/pdf'}, responseType: 'blob'
            }).then(
                (data: any) => {
                    const blob = new Blob([data], {
                        type: 'application/pdf' // must match the Accept type
                    });
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = fileName;
                    link.click();
                    window.URL.revokeObjectURL(link.href);
                }, (error) => {
                    console.log('error')
                });
            break;
        case 'csv':
            axios.get(url, {
                headers: {Accept: 'application/csv'}, responseType: 'blob'
            }).then(
                (response: any) => {
                    const blob = new Blob([response.data], {
                        type: "application/octet-stream" // or Content-type: "application/vnd.ms-excel"
                    });
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = fileName;
                    link.click();
                    window.URL.revokeObjectURL(link.href);
                }, (error) => {
                    console.log('error')
                });
            break;
        case 'xlsx':
            axios.get(url, {
                headers: {Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'},
                responseType: 'blob'
            }).then(
                (response: any) => {
                    const blob = new Blob([response.data], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    });
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = fileName;
                    link.click();
                    window.URL.revokeObjectURL(link.href);
                }, (error) => {
                    console.log('error')
                });
            break;
        default:
            console.log(type, ' file download not supported');
    }
}

const generateBlobFileFromUrl = (attachmentUrl: string, attachmentTitle: string, attachmentType: string) => {
    return fetch(attachmentUrl)
        .then((res) => res.blob())
        .then((myBlob) => {
            console.log(myBlob);
            const myFile = new File([myBlob], attachmentTitle, {
                type: attachmentType
            });
            return myFile;
        });
};

const getFlatQuestionList = (stepData: any): any => {
    const flatQuestionList: any = [];
    const questionListParser = (arrayData: []) => {
        arrayData.forEach((option: any, index, array) => {
            if (option?.questions) {
                option?.questions.forEach((question: any) => {
                    flatQuestionList.push(question);
                    if (question?.options) {
                        questionListParser(question?.options);
                    }
                })
            }
        })
    }
    if (stepData?.questions) {
        stepData?.questions.forEach((value: any) => {
            flatQuestionList.push(value);
            if (value?.options) {
                questionListParser(value?.options);
            }
        })
    }
    return flatQuestionList;

};

const getArrayOfValuesOfOneKeyFromJSON = (array: any[], key: string) => {
    if (array && array.length > 0) {
        const arrayWithDesiredKeyValue = array.map((item) => {
            return item[key];
        });
        return arrayWithDesiredKeyValue;
    } else {
        return [];
    }
}

const onConfirm = (config: IConfirmationConfig = {}) => {
    return new Promise((resolve, reject) => {
        Communications.ConfirmStateSubject.next({config, promise: {resolve, reject}})
    });
}

const Capitalize = (str: string) => {
    const capitalize = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    return str.split(' ').map(capitalize).join(' ');
}

const getObjectKeyValue = (object: any, key: string) => {
    return _.get(object, key);
}

const getSystemFormatTimeStamp = (date: Date | string, showTime: boolean = false) => {
    if (!date) {
        return "N/A"
    }
    if (showTime) {
        return moment(date).format('DD-MMM-YYYY hh:mm A');
    } else {
        return moment(date).format('DD-MMM-YYYY');
    }
};

const removeKeysFromJSON = (obj: any, keys: string[]): any => {
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            switch (typeof (obj[prop])) {
                case 'object':
                    if (keys.indexOf(prop) > -1) {
                        delete obj[prop];
                    } else {
                        removeKeysFromJSON(obj[prop], keys);
                    }
                    break;
                default:
                    if (keys.indexOf(prop) > -1) {
                        delete obj[prop];
                    }
                    break;
            }
        }
    }
    return obj;
}

const isEqual = (a: any, b: any) => {
    console.log(a, b);
    return _.isEqual(a, b);
}

const formatPhoneNumber = (phone: string) => {
    const x = phone.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    if (x) {
        phone = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? ' ' + x[3] : '');
    }
    return phone
}

const extractName = (data: any) => {
    return (data?.first_name || data?.last_name ? data?.last_name + ' ' + data?.first_name : '-');
};

const getNormalizedFileType = (fileType: any) => {
    let type: any = fileType;
    if (type.includes('image')) {
        type = "image";
    } else if (type.includes('pdf')) {
        type = "pdf";
    } else if (type.includes('word')) {
        type = "word";
    } else if (type.includes('spreadsheet')) {
        type = "xls";
    } else if (type.includes('video')) {
        type = "video";
    } else {
        type = "application";
    }
    return type;
}

const printAttachment = (attachment: IAttachment) => {
    let type: any = getNormalizedFileType(attachment?.type);
    printJS({
        printable: attachment.url,
        type: type
    });
}

const openLinkInNewTab = (url: string) => {
    window.open(url, '_blank');
}

const CommonService = {
    CurrentDate,
    parseQueryString,
    handleErrors,
    openDialog,
    onConfirm,
    formatSizeUnits,
    getRandomID,
    getBytesInMB,
    getCancelToken,
    getPayloadFilterDates,
    getFormDataFromJSON,
    capitalizeFirstLetter,
    kFormatter,
    getUUID,
    getLettersFromNumber,
    getRandomNumberBetweenRange,
    getMinsAndSecondsFromSeconds,
    convertDateFormat,
    downloadFile,
    generateBlobFileFromUrl,
    getFlatJsonFromNestedJSON,
    getFlatQuestionList,
    getArrayOfValuesOfOneKeyFromJSON,
    Capitalize,
    getObjectKeyValue,
    getHoursAndMinutesFromMinutes,
    getSystemFormatTimeStamp,
    transformTimeStamp,
    getTheDifferenceBetweenDates,
    removeKeysFromJSON,
    isEqual,
    convertDateFormat2,
    formatPhoneNumber,
    generateInterventionNameFromMedicalRecord,
    extractName,
    printAttachment,
    getNormalizedFileType,
    openLinkInNewTab,

    // createValidationsObject,
    // createYupSchema,

    _api: ApiService,
    _communications: Communications,
    _routeConfig: RouteConfigService,
    _alert: AlertService,
    _localStorage: LocalStorageService,
    _account: AccountService,
    _user: UserService,
    _staticData: StaticDataService,
    _serviceCategory: ServiceCategoryService,
    _service: ServiceService,
    _client: ClientService,
    _facility: FacilityService,
    _chartNotes: ChartNotesService,
    _inventory: InventoryService,
}
export default CommonService;
