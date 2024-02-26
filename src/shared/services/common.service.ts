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
import AppointmentService from "./modules/appointment.service";
import InventoryService from "./modules/inventory.service";
import SystemSettingsService from "./modules/settings.service";
import BillingsService from "./modules/billings.service";
import DiscountService from "./modules/discount.service";
import DashboardService from "./modules/dashboard.service";


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

const getRandomID = (length: number = 10) => {
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
            const error = err.errors[field];
            if (err.errors.hasOwnProperty(field)) {
                errors[field] = error;
            }
        }
        setErrors(errors);
    }
    if (err.error) {
        AlertService.showToast(err.error);
    } else {
        if (showGlobalError) {
            AlertService.showToast('Form contain errors, please check once', 'error');
        }
    }

});

const openDialog = (component: any) => {
    return new Promise((resolve, reject) => {
        Communications.DialogStateSubject.next({component, promise: {resolve, reject}})
    });
}

const openConfirmationDialog = (config: IConfirmationConfig = {}) => {
    const defaultConfig: IConfirmationConfig = {
        direction: "down",
        yes: {text: 'Yes, Confirm', color: 'primary'},
        no: {text: 'No, Cancel', color: 'primary'},
    }
    config = {...defaultConfig, ...config};
    return new Promise((resolve, reject) => {
        Communications.ConfirmStateSubject.next({config, promise: {resolve, reject}})
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
    return moment(date).format('DD-MMM-YYYY');
}


const transformTimeStamp2 = (date: Date | string | undefined) => {
    return moment(date).format('hh:mm A, DD-MMM-YYYY ');
}


const convertDateFormat = (date: Date, format: string = 'YYYY-MM-DD') => {
    return moment(date).format(format);
}


const convertDateFormat2 = (date: Date, format: string = 'DD-MMM-YYYY') => {
    return moment(date).format(format);
}
//item?.created_at && CommonService.convertDateFormat2(item?.created_at) + " - " + (item?.injury_details.map((injury: any, index: number) =>
// (injury?.body_part_details?.name + "(" + injury?.body_side + ")"))).join(','))

const generateUseCaseFromCaseDetails = (case_details: any) => {
    return `${CommonService.convertDateFormat2(case_details?.case_date)} - ${case_details?.injury_details?.map((bodyPart: any) => {
        return ((" ") + bodyPart?.body_part_details + " " + (bodyPart?.body_side ? `(${bodyPart.body_side})` : ' '))
    })} `
}

const generateUseCaseFromCaseDetails2 = (case_details: any) => {
    return `${CommonService.convertDateFormat2(case_details?.case_date)} - ${case_details?.injury_details?.map((bodyPart: any) => {
        return ((" ") + bodyPart?.body_part_name + " " + (bodyPart?.body_side ? `(${bodyPart.body_side})` : ' '))
    })} `
}

const generateUseCaseFromCaseDetails3 = (case_details: any) => {
    return `${CommonService.convertDateFormat2(case_details?.created_at)} - ${case_details?.injury_details?.map((bodyPart: any) => {
        return ((" ") + bodyPart?.body_part_name + (" ") + (bodyPart?.body_side ? `(${bodyPart.body_side})` : ' '));
    })} `
}

const generateInterventionNameFromMedicalRecord = (medicalRecordDetails: any) => {
    return `${CommonService.convertDateFormat2(medicalRecordDetails?.created_at)} - ${medicalRecordDetails?.injury_details?.map((bodyPart: any, index: number) => {
        const bodyPartName = bodyPart?.body_part_details?.name;
        const bodySide = bodyPart?.body_side ? ` (${bodyPart.body_side})` : "";
        return " " + bodyPartName + bodySide;
    })} `
}

const getTheDifferenceBetweenDates = (fromDate: string) => {
    let a = moment();
    let b = moment(moment(fromDate), 'YYYY');
    let diff = a.diff(b, 'years')
    return diff;
}

const convertNumberToTime = (number: any) => {
    let hours = Math.floor(number / 30) % 12;
    const minutes = Math.floor((number % 30) * 2);

    const period = hours < 12 ? 'AM' : 'PM';
    hours = hours === 0 ? 12 : hours;

    return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
};


const getFlatJsonFromNestedJSON = (jsonData: any, rootName: string = "", ignoreList: any[] = []): any => {

    const appendFormData = (data: any, root: any) => {
        let newObj: any = {};
        let tmp: any = {};
        if (!ignore(root)) {
            root = root || '';
            if (data instanceof File) {
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

const capitalizeFirstLetter = (string: string | undefined) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const capitalizeFirstLetterAndRemoveUnderScore = (string: string | undefined) => {
    if (!string) return '';
    return string.split('_').map((word: string) => capitalizeFirstLetter(word)).join(' ');
}

const capitalizeFirstLetterOfEachWord = (string: string) => {
    return string?.split(' ').map((word: string) => capitalizeFirstLetter(word)).join(' ');
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
                headers: {Accept: 'application/pdf'}, responseType: 'arraybuffer'
            }).then(
                (data: any) => {
                    const blob = new Blob([data.data], {
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
        return moment(date).format('DD-MMM-YYYY, hh:mm A');
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
    return _.isEqual(a, b);
}

const formatPhoneNumber = (phone: string) => {
    if (typeof phone !== 'string') {
        return '';
    }
    const x = phone?.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    if (x) {
        phone = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    }
    return phone
}

const formatSSNNumber = (ssn: string) => {
    if (typeof ssn !== 'string') {
        return '';
    }
    const x = ssn?.replace(/\D/g, '').match(/(\d{0,3})(\d{0,2})(\d{0,4})/);
    if (x) {
        ssn = !x[2] ? x[1] : x[1] + '-' + x[2] + (x[3] ? '-' + x[3] : '');
    }
    return ssn
}

const validateDecimal = (input: any) => {
    const regex = /^\d*\.?\d{0,2}$/; // Regular expression to allow up to two decimal places
    const inputValue = input.value;

    if (!regex.test(inputValue)) {
        input.value = inputValue.slice(0, -1); // Remove the last character (the extra decimal)
    }
}

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

const isTextEllipsisActive = (e: HTMLDivElement) => {
    return (e.offsetWidth < e.scrollWidth);
}

const getNameInitials = (name: string) => {
    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
}

const getContrastYIQ = (hexcolor: string) => {
    const r = parseInt(hexcolor.substring(1, 3), 16);
    const g = parseInt(hexcolor.substring(3, 5), 16);
    const b = parseInt(hexcolor.substring(5, 7), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
}

const LightenDarkenColor = (col: any, amt: number) => {
    col = parseInt(col, 16);
    return (((col & 0x0000FF) + amt) | ((((col >> 8) & 0x00FF) + amt) << 8) | (((col >> 16) + amt) << 16)).toString(16)
}

const ComingSoon = () => {
    AlertService.showToast("Coming Soon", 'info');
}

const cleanMentionsPayload = (value: string, mentionsData: any) => {
    const ids = mentionsData?.map((item: any) => item.id);
    let cleanedValue: string = value;
    if (ids.length) {
        ids.forEach((id: any) => {
            cleanedValue = cleanedValue?.replaceAll(new RegExp(`\\(${id}\\)`, 'g'), '');
        });
    }
    cleanedValue = cleanedValue?.split('\n').join("\\n");
    return cleanedValue;
}

const cleanMentionsResponse = (value: string, mentionsData: any) => {
    const ids = mentionsData?.map((item: any) => item.id);
    let cleanedValue: string = value;
    if (ids?.length) {
        ids.forEach((id: any) => {
            cleanedValue = cleanedValue?.replaceAll(`@[${id}]`, `@${id}`)
        });
    }
    cleanedValue = cleanedValue?.split('\\n').join("<br />");
    return cleanedValue || '-';
}

const editMentionsFormat = (value: string, mentionsData: any) => {
    const ids = mentionsData?.map((item: any) => item.id);
    let cleanedValue: string = value;
    if (ids?.length) {
        ids?.forEach((id: any) => {
            cleanedValue = cleanedValue?.split(`@[${id}]`).join(`@[${id}](${id})`);
        });
    }
    cleanedValue = cleanedValue?.split('\\n').join("\n");
    return cleanedValue;
}

const convertToDecimals = (value: number | string) => {
    if (typeof (value) !== "number") {
        return
    }
    if (typeof (value) === 'string') {
        let tempValue = +(value)
        return tempValue.toFixed(2)
    }
    if (!value) return 0;
    return value.toFixed(2)
}

const calculateFinalAmountFromDiscountPercentage = (percentage: any, totalAmount: number) => {
    return (parseFloat(percentage) / 100) * totalAmount;
}

const getHoursAndMinutesFromMinutes = (minutes: number) => {
    return moment().startOf('day').add(minutes, 'minutes').format('hh:mm A');
}


const areArraysEqual = (arr1: any[], arr2: any[]) => {
    // Check if arrays have the same length
    if (arr1.length !== arr2.length) {
        return false;
    }

    // Check if all elements in the same index are equal
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }

    // Arrays are equal
    return true;
}


const StartTimingsList = Array.from(Array(24).keys()).map((item: number) => {
    return {code: item * 60, title: moment().hour(item).minute(0).format('HH:mm')}
});

// const generateTimeSlots = (startTime: any, endTime: any) => {
//     console.log(startTime, endTime);
//     const timeSlots = [];
//     while (startTime < endTime) {
//         console.log(startTime);
//         const hours = Math.floor(startTime / 60);
//         const minutes = startTime % 60;
//         const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
//         timeSlots.push({code: startTime, title: formattedTime});
//         startTime += 60; // Add one hour in minutes
//     }
//     console.log(timeSlots);
//     return timeSlots;
// };

const generateTimeSlots = (startTime: number, endTime: number, to?: boolean) => {
    const timeSlots = [];
    if (to) {
        startTime += 60;
    }
    while (startTime <= endTime) { // Update the condition to <=
        const hours = Math.floor(startTime / 60);
        const minutes = startTime % 60;
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        timeSlots.push({code: startTime, title: formattedTime});
        startTime += 60; // Add one hour in minutes
    }
    return timeSlots;
};

const generateDisabledSlots = (startTime: number, endTime: number, exclude?: any, to?: boolean, currentStart?: number, currentEnd?: number, facilityDays?: any, isSameSlot?: boolean) => {
    const timeSlots = [];
    if (!exclude || exclude?.length === 0) {
        return to ? [] : [{"title": endTime, "code": endTime}];
    }
    while (startTime <= endTime) { // Update the condition to <=
        const hours = Math.floor(startTime / 60);
        const minutes = startTime % 60;
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        timeSlots.push({code: startTime, title: formattedTime});
        startTime += 60; // Add one hour in minutes
    }
    let temp = timeSlots;
    let dayIndex = 0;
    if (!isSameSlot && exclude?.length > 0) {
        dayIndex = exclude.findIndex((item: any) => item.day === facilityDays.day);
    }
    if (to) {
        if (currentStart && currentEnd) {
            temp = timeSlots.filter((item: any, index: number) =>
                exclude[dayIndex]?.slots.some((slot: any) => (item.code > slot?.start_time && item.code <= slot?.end_time) || index === 0) && !(item.code > currentStart && item.code <= currentEnd))
        } else {
            temp = timeSlots.filter((item: any, index: number) =>
                exclude[dayIndex]?.slots.some((slot: any) => item.code > slot?.start_time && item.code <= slot?.end_time) || index === 0)
        }
        if (temp.length > 0 && currentStart) {
            const largestExcludedSlot = temp[temp.length - 1].code;
            temp = [...temp, ...timeSlots.filter((item: any) => currentStart < largestExcludedSlot && item.code > largestExcludedSlot)]
        }
    } else {
        if (currentStart && currentEnd) {
            temp = timeSlots.filter((item: any, index: number) =>
                exclude[dayIndex]?.slots.some((slot: any) => (item.code >= slot?.start_time && item.code < slot?.end_time) || index === timeSlots?.length - 1) && !(item.code >= currentStart && item.code < currentEnd))
        } else {
            temp = timeSlots.filter((item: any, index: number) =>
                exclude[dayIndex]?.slots.some((slot: any) => item.code >= slot?.start_time && item.code < slot?.end_time) || index === timeSlots?.length - 1)
        }
    }
    return temp;
}

const EndTimingsList = (time: any) => {
    const startTime = Math.floor(time / 60); // Convert selected start time to hours

    return Array.from(Array(24 - startTime + 1).keys()).map((item: number) => {
        const hour = startTime + item;
        const endTime = moment().hour(hour).minute(0);
        return {
            code: item * 60 >= time, // Change the comparison operator to include the start time
            title: endTime.format('HH:mm'),
        };
    });
};

const generateClientNameFromClientDetails = (clientDetails: any) => {
    if (!clientDetails) return '';
    else if (clientDetails?.is_alias_name_set) {
        return clientDetails?.alias_first_name + ' ' + clientDetails?.alias_last_name;
    } else {
        return clientDetails?.first_name + ' ' + clientDetails?.last_name;
    }
}

const generateClientFirstNameFromClientDetails = (clientDetails: any) => {
    if (!clientDetails) return '';
    else if (clientDetails?.is_alias_name_set) {
        return capitalizeFirstLetterOfEachWord(clientDetails?.alias_first_name);
    } else {
        return capitalizeFirstLetterOfEachWord(clientDetails?.first_name);
    }
}

const generateClientLastNameFromClientDetails = (clientDetails: any) => {
    if (!clientDetails) return '';
    else if (clientDetails?.is_alias_name_set) {
        return capitalizeFirstLetterOfEachWord(clientDetails?.alias_last_name);
    } else {
        return capitalizeFirstLetterOfEachWord(clientDetails?.last_name);
    }
}

const extractName = (data: any) => {
    if (!data) return ('-');
    else if (data?.is_alias_name_set) {
        return (data?.alias_first_name || data?.alias_last_name ? data?.alias_last_name + ', ' + data?.alias_first_name : '-');
    }
    return (data?.first_name || data?.last_name ? data?.last_name + ', ' + data?.first_name : '-');
};

const extractName2 = (data: any) => {
    if (!data) return ('-');
    else if (data?.is_alias_name_set) {
        return (data?.alias_first_name || data?.alias_last_name ? data?.alias_first_name + ' ' + data?.alias_last_name : '-');
    }
    return (data?.first_name || data?.last_name ? data?.first_name + ' ' + data?.last_name : '-');
};


const CommonService = {
    LightenDarkenColor,
    getContrastYIQ,
    getNameInitials,
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
    isTextEllipsisActive,
    ComingSoon,
    generateUseCaseFromCaseDetails,
    cleanMentionsPayload,
    cleanMentionsResponse,
    editMentionsFormat,
    convertToDecimals,
    calculateFinalAmountFromDiscountPercentage,
    generateUseCaseFromCaseDetails2,
    transformTimeStamp2,
    convertNumberToTime,
    getHoursAndMinutesFromMinutes,
    validateDecimal,
    areArraysEqual,
    StartTimingsList,
    generateTimeSlots,
    EndTimingsList,
    openConfirmationDialog,
    capitalizeFirstLetterOfEachWord,
    generateClientNameFromClientDetails,
    generateClientFirstNameFromClientDetails,
    generateClientLastNameFromClientDetails,
    generateDisabledSlots,
    capitalizeFirstLetterAndRemoveUnderScore,
    generateUseCaseFromCaseDetails3,
    formatSSNNumber,
    extractName2,
    // createValidationsObject,
    // createYupSchema,

    _api: ApiService,
    _communications: Communications,
    _routeConfig: RouteConfigService,
    _alert: AlertService,
    _localStorage: LocalStorageService,
    _account: AccountService,
    _user: UserService,
    _appointment: AppointmentService,
    _staticData: StaticDataService,
    _serviceCategory: ServiceCategoryService,
    _service: ServiceService,
    _client: ClientService,
    _facility: FacilityService,
    _chartNotes: ChartNotesService,
    _inventory: InventoryService,
    _systemSettings: SystemSettingsService,
    _billingsService: BillingsService,
    _discountService: DiscountService,
    _dashboardService: DashboardService,
}
export default CommonService;
