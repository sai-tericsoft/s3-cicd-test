import "./SchedulingScreen.scss";
import {useDispatch, useSelector} from "react-redux";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {setCurrentNavParams} from "../../store/actions/navigation.action";
import {ITableColumn} from "../../shared/models/table.model";
import {CommonService} from "../../shared/services";
import ChipComponent from "../../shared/components/chip/ChipComponent";
import SearchComponent from "../../shared/components/search/SearchComponent";
import {APIConfig, ImageConfig} from "../../constants";
import ButtonComponent from "../../shared/components/button/ButtonComponent";
import moment from "moment/moment";
import SelectComponent from "../../shared/components/form-controls/select/SelectComponent";
import {IRootReducerState} from "../../store/reducers";
import IconButtonComponent from "../../shared/components/icon-button/IconButtonComponent";
import FullCalendarComponent from "../../shared/components/full-calendar/FullCalendarComponent";
import DrawerComponent from "../../shared/components/drawer/DrawerComponent";
import AppointmentDetailsComponent from "../../shared/components/appointment-details/AppointmentDetailsComponent";
import BookAppointmentComponent from "../../shared/components/book-appointment/BookAppointmentComponent";
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import CalendarAppointmentCard from "./calendar-appointment-card/CalendarAppointmentCard";
import {IAPIResponseType} from "../../shared/models/api.model";
import {IClientBasicDetails} from "../../shared/models/client.model";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import ToolTipComponent from "../../shared/components/tool-tip/ToolTipComponent";
import LoaderComponent from "../../shared/components/loader/LoaderComponent";
import TableWrapperComponent from "../../shared/components/table-wrapper/TableWrapperComponent";
import DateRangePickerComponent from "../../shared/components/form-controls/date-range-picker/DateRangePickerComponent";
import BlockCalendarComponent from "./block-calendar/BlockCalendarComponent";
import LinkComponent from "../../shared/components/link/LinkComponent";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';

interface SchedulingScreenProps {

}

const HOURS_LIST = Array.from(Array(24).keys()).map((item: number) => {
    return moment().hour(item).minute(0).format('HH:mm')
});
const HOURS_LIST_IN_MINUTES = Array.from(Array(24).keys()).map((item: number) => {
    return {start: item * 60, end: (item + 1) * 60, label: moment().hour(item).minute(0).format('HH:mm')}
});

const SchedulingScreen = (props: SchedulingScreenProps) => {

    const dispatch = useDispatch();
    const [showCategoryColors, setShowCategoryColors] = useState<boolean>(false);
    const [openDatePicker, setOpenDatePicker] = useState<boolean>(false);

    const {appointmentStatus} = useSelector((state: IRootReducerState) => state.staticData);
    const [schedulingListFilterState, setSchedulingListFilterState] = useState<any>({
        search: "",
        // start_date: moment().format('YYYY-MM-DD'),
        // end_date: moment().format('YYYY-MM-DD'),
        sort: {}
    });
    const [appointmentDataPresent, setAppointmentDataPresent] = useState<any>(null);
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

    const SchedulingListColumns: ITableColumn[] = useMemo<ITableColumn[]>(() => [
        {
            title: "Date",
            key: "date",
            dataIndex: "date",
            width: 110,
            render: (item: any) => {
                return CommonService.convertDateFormat(item.appointment_date, 'DD-MMM-YYYY')
            }
        },
        {
            title: "Time",
            key: "time",
            dataIndex: "time",
            align: 'center',
            width: 100,
            render: (item: any) => {
                return CommonService.getHoursAndMinutesFromMinutes(item.start_time)
            }
        },
        {
            title: "Duration",
            key: "duration",
            dataIndex: "duration",
            width: 90,
            render: (item: any) => {
                return <>{item?.duration ? item.duration + ' mins' : '-'} </>
            }
        },
        {
            title: "Client Name",
            key: "first_name",
            dataIndex: "first_name",
            sortable: true,
            width: 170,
            render: (item: any) => {
                return <>{CommonService.extractName(item?.client_details)}</>
            }
        },
        {
            title: "Phone",
            key: "primary_contact_info",
            dataIndex: "primary_contact_info",
            width: 120,
            align: 'center',
            render: (item: any) => {
                return <span>{item?.client_details?.primary_contact_info?.phone ? CommonService.formatPhoneNumber(item?.client_details?.primary_contact_info?.phone) : ''}</span>
            }
        },
        {
            title: "Service",
            key: "service",
            dataIndex: "service",
            width: 180,
            align: 'center',
            render: (item: any) => {
                return <span>
                    {item?.service_details?.name?.length > 10 ? item?.service_details?.name.substring(0, 10) + '...' : item?.service_details?.name}
                    </span>
            }
        },
        {
            title: "Provider",
            key: "provider",
            dataIndex: "provider",
            align: 'center',
            width: 140,
            render: (item: any) => {
                return <span>
                    {item?.provider_details?.first_name + ' ' + item?.provider_details?.last_name}
                </span>
            }
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: 'center',
            width: 120,
            render: (item: any) => {
                return <ChipComponent label={item?.status_details?.title}
                                      className={item?.status_details?.code}
                />
            }
        },
        {
            title: "",
            dataIndex: "actions",
            key: "actions",
            width: 120,
            fixed: "right",
            render: (item: any) => {
                if (item?._id) {
                    return <div className={'link-component'} onClick={setOpenedAppointmentDetails.bind(null, item)}>
                        View Details
                    </div>
                }
            }
        }
    ], []);

    const handleSchedulingSort = useCallback((key: string, order: string) => {
        setSchedulingListFilterState((oldState: any) => {
            const newState = {...oldState};
            newState["sort"][key] = order;
            return newState;
        });
    }, []);

    useEffect(() => {
        dispatch(setCurrentNavParams("Scheduling"));
    }, [dispatch]);

    const dateSwitcher = useCallback(
        (mode: 'increasing' | 'decreasing' | 'reset', duration: string) => {
            setSchedulingListFilterState((old: any) => {
                const startDate = (mode === 'decreasing' || mode === 'reset') ? moment(old.start_date) : moment(old.start_date);
                let endDate;
                if (mode === 'increasing') {
                    if (duration === 'day') {
                        startDate.add(1, 'day');
                        endDate = startDate.clone();
                    } else if (duration === '3day') {
                        startDate.add(3, 'day');
                        endDate = startDate.clone().add(2, 'day');
                    } else if (duration === '5day') {
                        startDate.add(5, 'day');
                        endDate = startDate.clone().add(4, 'day');
                    } else if (duration === 'month') {
                        startDate.add(1, 'month').startOf('month');
                        endDate = startDate.clone().endOf('month');
                    }
                } else if (mode === 'decreasing') {
                    if (duration === 'day') {
                        startDate.subtract(1, 'day');
                        endDate = startDate.clone();
                    } else if (duration === '3day') {
                        startDate.subtract(3, 'day');
                        endDate = startDate.clone().add(2, 'day');
                    } else if (duration === '5day') {
                        startDate.subtract(5, 'day');
                        endDate = startDate.clone().add(4, 'day');
                    } else if (duration === 'month') {
                        startDate.subtract(1, 'month').startOf('month');
                        endDate = startDate.clone().endOf('month');
                    }
                } else if (mode === 'reset') {
                    if (duration === 'day') {
                        endDate = startDate.clone();
                    } else if (duration === '3day') {
                        endDate = startDate.clone().add(2, 'day');
                    } else if (duration === '5day') {
                        endDate = startDate.clone().add(4, 'day');
                    } else if (duration === 'month') {
                        startDate.startOf('month');
                        endDate = startDate.clone().endOf('month');
                    }
                }
                const start_date = startDate.format('YYYY-MM-DD');
                const end_date = (endDate || startDate).format('YYYY-MM-DD');
                return {...old, start_date, end_date}
            })
        },
        [],
    );

    const [isBookAppointmentOpen, setIsBookAppointmentOpen] = useState(false);
    const [bookAppointmentPreFill, setBookAppointmentPreFill] = useState({});
    const [openedAppointmentDetails, setOpenedAppointmentDetails] = useState<any | null>(null);
    const [openBlockCalenderDrawer, setOpenBlockCalenderDrawer] = useState<boolean>(false);
    const [refreshToken, setRefreshToken] = useState('');

    const setViewModeHandler = useCallback((mode: 'list' | 'calendar') => {

        if (mode === 'calendar') {
            setSchedulingListFilterState((old: any) => {
                const newState = {...old};
                newState["duration"] = 'month';
                newState["start_date"] = moment().startOf('month').format('YYYY-MM-DD');
                newState["end_date"] = moment().endOf('month').format('YYYY-MM-DD');
                return newState;
            });
        } else {
            setSchedulingListFilterState((old: any) => {
                const newState = {...old};
                delete newState["start_date"]
                delete newState["end_date"]
                delete newState["date_range"]
                delete newState["duration"];
                return newState;
            });
        }
        setViewMode(mode);
    }, [setSchedulingListFilterState, setViewMode]);

    const [serviceCategoryList, setServiceCategoryList] = useState<any[] | null>(null);
    const [serviceCategoryColorMap, setServiceCategoryColorMap] = useState<any>({});

    const getServiceCategoriesList = useCallback(
        () => {
            setServiceCategoryList([]);
            CommonService._serviceCategory.ServiceCategoryListAPICall({is_active: true})
                .then((response: IAPIResponseType<any>) => {
                    const data = response.data || [];
                    const colorMap: any = {};
                    console.log(data);
                    data.forEach((item: any) => {
                        if (item?.bg_color_code && item?.text_color_code) {
                            const bg_color_code = JSON.parse(item?.bg_color_code);
                            const text_color_code = JSON.parse(item?.text_color_code);
                            const bg_color = `rgba(${bg_color_code.r}, ${bg_color_code.g}, ${bg_color_code.b}, ${bg_color_code.a})`;
                            const text_color = `rgba(${text_color_code.r}, ${text_color_code.g}, ${text_color_code.b}, ${text_color_code.a})`;
                            colorMap[item._id] = {
                                bg_color_code: bg_color || '#AAAAAA',
                                text_color_code: text_color || '#000000'
                            };
                        }
                    })
                    console.log(data);
                    setServiceCategoryColorMap(colorMap);
                    setServiceCategoryList(data);
                })
                .catch((error: any) => {
                    setServiceCategoryList([]);
                })
        },
        [],
    );

    useEffect(() => {
        getServiceCategoriesList()
    }, [getServiceCategoriesList]);


    const [serviceList, setServiceList] = useState<any[] | null>(null);
    const getServiceList = useCallback(
        (categoryId: string) => {
            setServiceList([]);
            CommonService._service.ServiceListLiteAPICall(categoryId, {is_active: true})
                .then((response: IAPIResponseType<any>) => {
                    const data = response.data || [];
                    setServiceList(data);
                })
                .catch((error: any) => {
                    setServiceList([]);
                })
        },
        [],
    );

    const [providerList, setProviderList] = useState<any[] | null>(null);
    const getProvidersList = useCallback(
        () => {
            setProviderList([]);
            CommonService._user.getUserListLite({role: 'provider', is_active: true})
                .then((response: IAPIResponseType<any>) => {
                    const data = response.data || [];
                    setProviderList(data);
                })
                .catch((error: any) => {
                    setProviderList([]);
                })
        },
        [],
    );
    useEffect(() => {
        getProvidersList();
    }, [getProvidersList]);

    const [calendarData, setCalendarData] = useState<any>(null)
    const [calendarDaysData, setCalendarDaysData] = useState<any>(undefined);
    const [isCalendarLoading, setIsCalendarLoading] = useState<boolean>(false);

    const getCalenderList = useCallback((payload: any) => {
        delete payload.sort;
        if (payload.provider_id) {
            payload.provider_id = payload.provider_id || payload._id;
        }
        setCalendarData(null);
        setCalendarDaysData(null);
        setIsCalendarLoading(true);
        CommonService._appointment.getAppointmentCalendarList(payload)
            .then((response: IAPIResponseType<IClientBasicDetails>) => {
                const data = response.data || {};
                setCalendarData(data);
                const daysData: any = {};
                Object.keys(data).forEach((date: any) => {
                    const dayData = data[date];
                    daysData[date] = {
                        appointments: [],
                        blocked_slots: [],
                        meta: dayData?.meta
                    }
                    const appointments = dayData?.appointments || [];
                    const blockedSlots = dayData?.blocked_slots || [];
                    const dayHourAppointments: any = {};
                    const dayHourBlockSlots: any = {};
                    appointments.forEach((appointment: any) => {
                        HOURS_LIST_IN_MINUTES.forEach((hour: any) => {
                            if (appointment.start_time >= hour.start && appointment.start_time < hour.end) {
                                if (!dayHourAppointments.hasOwnProperty(hour.label)) {
                                    dayHourAppointments[hour.label] = [];
                                }
                                dayHourAppointments[hour.label].push(appointment);
                            }
                        });
                    })
                    blockedSlots.forEach((blockedSlot: any) => {
                        HOURS_LIST_IN_MINUTES.forEach((hour: any) => {
                            if (blockedSlot?.is_block_all_day) {
                                // For all-day blocked slot, assign start_time as 00:00 and end_time as 24:00
                                const allDaySlot = {
                                    ...blockedSlot,
                                    start_time: 0,      // 00:00 in minutes
                                    end_time: 1439     // 24:00 in minutes
                                };
                                // Store the all-day slot in the dayHourBlockSlots object
                                // if (allDaySlot.start_time >= hour.start && allDaySlot.start_time < hour.end) {
                                if (!dayHourBlockSlots.hasOwnProperty(hour.label)) {
                                    dayHourBlockSlots[hour.label] = [];
                                }
                                dayHourBlockSlots[hour.label].push(allDaySlot);
                                // }
                            } else {
                                if (blockedSlot.start_time >= hour.start && blockedSlot.start_time < hour.end) {
                                    if (!dayHourBlockSlots.hasOwnProperty(hour.label)) {
                                        dayHourBlockSlots[hour.label] = [];
                                    }
                                    dayHourBlockSlots[hour.label].push(blockedSlot);
                                }
                            }
                        });
                    });
                    daysData[date].appointments = dayHourAppointments;
                    daysData[date].blocked_slots = dayHourBlockSlots;
                });
                console.log(daysData);
                setCalendarDaysData(daysData);
                setIsCalendarLoading(false);
            })
            .catch((error: any) => {
                setIsCalendarLoading(false);
            })
    }, []);

    useEffect(() => {
        if (viewMode === 'calendar') {
            getCalenderList({...schedulingListFilterState});
        }
    }, [schedulingListFilterState, getCalenderList, viewMode]);

    const prepareNewAppointmentBooking = useCallback(
        (preState: any) => {
            const prePayload: any = {};
            if (preState.category_id) {
                prePayload.category_id = preState.category_id;
            }
            if (preState.service_id) {
                prePayload.service_id = preState.service_id;
            }
            if (preState.provider_id) {
                prePayload.provider_id = preState.provider_id || preState._id;
            }
            if (preState.date) {
                prePayload.date = preState.date + 'T00:00:00.000Z';
            }
            if (preState.start) {
                prePayload.start_time = preState.start;
            }
            if (preState.end) {
                prePayload.end_time = preState.end;
            }
            setBookAppointmentPreFill(prePayload);
            setIsBookAppointmentOpen(true);
        },
        [],
    );

    // const [schedulingListModeFilterState, setSchedulingListModeFilterState] = useState<any>({})

    // useEffect(() => {
    //     if (schedulingListFilterState) {
    //         const prePayload: any = {...schedulingListFilterState};
    //         if (schedulingListFilterState.category_id) {
    //             prePayload.category_id = schedulingListFilterState.category_id._id;
    //         }
    //         if (schedulingListFilterState.service_id) {
    //             prePayload.service_id = schedulingListFilterState.service_id._id;
    //         }
    //         if (schedulingListFilterState.provider_id) {
    //             prePayload.provider_id = schedulingListFilterState.provider_id.provider_id || schedulingListFilterState.provider_id._id;
    //         }
    //         if (schedulingListFilterState.status) {
    //             prePayload.status = schedulingListFilterState.status.code;
    //         }
    //         setSchedulingListModeFilterState(prePayload);
    //     }
    // }, [schedulingListFilterState]);

    const handleFilters = useCallback((value: any, filterName: string) => {
        if (filterName === 'serviceCategory') {
            setSchedulingListFilterState((oldState: any) => {
                const newState = {...oldState};
                newState['category_id'] = value;
                newState['service_id'] = undefined;
                if (!value) {
                    delete newState['category_id'];
                    delete newState['service_id'];
                    delete newState['provider_id'];
                }
                return newState;
            });
            if (value) {
                getServiceList(value);
            }
        }
        if (filterName === 'service') {
            setSchedulingListFilterState((oldState: any) => {
                const newState = {...oldState};
                newState['service_id'] = value;
                if (!value) {
                    delete newState['service_id'];
                    delete newState['provider_id'];
                }
                return newState;
            });
        }
        if (filterName === 'provider') {
            setSchedulingListFilterState((oldState: any) => {
                const newState = {...oldState};
                newState['provider_id'] = value.provider_id || value;

                if (!value) {
                    delete newState['provider_id'];
                }
                return newState;
            });
        }
        if (filterName === 'status') {
            setSchedulingListFilterState((oldState: any) => {
                const newState = {...oldState};
                newState['status'] = value;

                if (!value) {
                    delete newState['status'];
                }

                return newState;
            });
        }
        if (filterName === 'dateRange') {
            setSchedulingListFilterState((oldState: any) => {
                const newState = {...oldState};
                if (value) {
                    newState['start_date'] = moment(value[0])?.format('YYYY-MM-DD');
                    newState['end_date'] = moment(value[1])?.format('YYYY-MM-DD');
                    // newState['date_range'] = value;
                } else {
                    delete newState['date_range'];
                    delete newState['start_date'];
                    delete newState['end_date'];
                }

                return newState;
            });
        }
    }, [getServiceList]);

    return (
        <div className={'scheduling-list-component'}>
            <div className="scheduling-header-wrapper">
                <div className="scheduling-header-search-wrapper">
                    {viewMode === "list" && <SearchComponent size={'small'}
                                                             className={'scheduling-list-input mrg-top-20'}
                                                             label={'Search'}
                                                             placeholder={'Search using Client Name'}
                                                             value={schedulingListFilterState.search}
                                                             onSearchChange={(value) => {
                                                                 setSchedulingListFilterState({
                                                                     ...schedulingListFilterState,
                                                                     search: value
                                                                 })
                                                             }}/>
                    }
                </div>
                {
                    viewMode === "calendar" && <div/>
                }
                <div className="scheduling-header-actions-wrapper">
                    <div className="scheduling-header-action-item">
                        <ToggleButtonGroup value={viewMode} color={"primary"} size={'small'}>
                            <ToggleButton className={'left-toggle-btn'} value="calendar"
                                          onClick={setViewModeHandler.bind(null, 'calendar')}
                                          color={viewMode === 'calendar' ? 'primary' : 'standard'} type={'button'}
                                          aria-label="calender view">
                                <ImageConfig.SchedulingIcon/>
                            </ToggleButton>
                            <ToggleButton className={'right-toggle-btn'} value="list" type={'button'}
                                          onClick={setViewModeHandler.bind(null, 'list')}
                                          color={viewMode === 'list' ? 'primary' : 'standard'}
                                          aria-label="list view">
                                <ImageConfig.ListIcon/>
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                    <div className="scheduling-header-action-item">
                        <ButtonComponent
                            variant={'outlined'}
                            onClick={() => setOpenBlockCalenderDrawer(true)}
                            prefixIcon={<ImageConfig.BlockIcon/>}>
                            Block Calender</ButtonComponent>
                    </div>
                    <div className="scheduling-header-action-item">
                        <ButtonComponent onClick={setIsBookAppointmentOpen.bind(null, true)}
                                         prefixIcon={<ImageConfig.AddIcon/>}>Book Appointment</ButtonComponent>
                    </div>
                </div>
            </div>
            {
                viewMode === "calendar" && <div/>
            }
            {
                <div className={"list-content-wrapper view-" + viewMode}>
                    <div className='scheduling-filter-header-wrapper'>
                        {viewMode === 'calendar' &&
                            <div className="scheduling-filter-header-date-wrapper">
                                {schedulingListFilterState.duration !== 'month' ?
                                    <LinkComponent onClick={() => setOpenDatePicker?.((prev) => !prev)}>
                                        {CommonService.convertDateFormat(
                                            schedulingListFilterState.start_date,
                                            viewMode === 'calendar' && schedulingListFilterState.duration === 'month'
                                                ? 'MMMM YYYY'
                                                : 'MMMM DD YYYY'
                                        )}
                                    </LinkComponent> : <>
                                        {CommonService.convertDateFormat(
                                            schedulingListFilterState.start_date,
                                            viewMode === 'calendar' && schedulingListFilterState.duration === 'month'
                                                ? 'MMMM YYYY'
                                                : 'MMMM DD YYYY'
                                        )}
                                    </>
                                }
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    {openDatePicker && (schedulingListFilterState.duration !== 'month') && (
                                        <DatePicker
                                            className={`text-date-picker`}
                                            open={openDatePicker}
                                            onClose={() => setOpenDatePicker(false)}
                                            onChange={(newValue: any) => {
                                                setSchedulingListFilterState((oldState: any) => {
                                                    const newDate = moment(newValue).format('YYYY-MM-DD');
                                                    return {...oldState, start_date: newDate, end_date: newDate};
                                                });
                                            }}
                                        />
                                    )}
                                </LocalizationProvider>

                                <div className="filter-header-date-controls">
                                    <div className="filter-header-date-control-item">
                                        <IconButtonComponent
                                            onClick={dateSwitcher.bind(null, 'decreasing', (viewMode === 'calendar') ? (schedulingListFilterState.duration || 'month') : 'day')}>
                                            <ImageConfig.LeftArrow/>
                                        </IconButtonComponent>
                                    </div>
                                    <div className="filter-header-date-control-item">
                                        <IconButtonComponent
                                            onClick={dateSwitcher.bind(null, 'increasing', (viewMode === 'calendar') ? (schedulingListFilterState.duration || 'month') : 'day')}>
                                            <ImageConfig.RightArrow/>
                                        </IconButtonComponent>
                                    </div>
                                </div>
                            </div>
                        }

                        {viewMode === 'list' && <div className="scheduling-filter-header-action-item">
                            <DateRangePickerComponent
                                label={"Select Date Range"}
                                value={schedulingListFilterState.date_range}
                                onDateChange={(value: any) => {
                                    handleFilters(value, 'dateRange')
                                }}
                            />
                        </div>
                        }

                        <div className="scheduling-filter-header-actions-wrapper">

                            <div className="scheduling-filter-header-action-item">
                                <SelectComponent size={'small'}
                                                 label={'Service Category'}
                                                 value={schedulingListFilterState?.category_id || ''}
                                                 displayWith={item => item ? item?.name : ''}
                                                 keyExtractor={item => item?._id}
                                                 valueExtractor={item => item?._id}
                                                 options={serviceCategoryList || []}
                                                 fullWidth={true}
                                                 isClear={true}
                                    // multiple={true}
                                                 onUpdate={(value) => handleFilters(value, 'serviceCategory')}

                                />
                            </div>
                            <div className="scheduling-filter-header-action-item">
                                <SelectComponent size={'small'}
                                                 label={'Service'}
                                                 disabled={!schedulingListFilterState?.category_id}
                                                 value={schedulingListFilterState?.service_id || ''}
                                                 displayWith={item => item ? item?.name : ''}
                                                 keyExtractor={item => item?._id}
                                                 valueExtractor={item => item?._id}
                                                 options={serviceList || []}
                                                 fullWidth={true}
                                                 isClear={schedulingListFilterState?.service_id ? true : false}
                                                 onUpdate={(value) => handleFilters(value, 'service')}
                                />
                            </div>
                            <div className="scheduling-filter-header-action-item">
                                <SelectComponent
                                    size={'small'}
                                    fullWidth={true}
                                    label={'Provider'}
                                    value={schedulingListFilterState?.provider_id || ''}
                                    options={providerList || []}
                                    disabled={!schedulingListFilterState?.service_id}
                                    displayWith={item => item ? item?.provider_name || (item?.first_name + ' ' + item?.last_name) : ''}
                                    keyExtractor={item => item?.provider_id || item?._id}
                                    valueExtractor={item => item?.provider_id || item?._id}
                                    onUpdate={(value) => handleFilters(value, 'provider')}
                                    isClear={schedulingListFilterState?.provider_id ? true : false}
                                />
                            </div>
                            <div className="scheduling-filter-header-action-item">
                                <SelectComponent size={'small'}
                                                 value={schedulingListFilterState?.status || ''}
                                                 options={appointmentStatus || []}
                                                 displayWith={(option: any) => (option?.title || '')}
                                                 valueExtractor={(option: any) => option?.code || ''}
                                                 label={'Status'}
                                                 isClear={true}
                                                 onUpdate={(value) => handleFilters(value, 'status')}
                                                 fullWidth={true}
                                />
                            </div>
                            {viewMode === 'calendar' && <div className="scheduling-filter-header-action-item">
                                <SelectComponent size={'small'}
                                                 options={
                                                     [
                                                         {value: 'month', label: 'Month'},
                                                         {value: 'day', label: '1 Day'},
                                                         {value: '3day', label: '3 Day'},
                                                         {value: '5day', label: '5 Day'}
                                                     ]
                                                 }
                                                 label={'Duration'}
                                                 value={schedulingListFilterState.duration || 'month'}
                                                 valueExtractor={item => item.value}
                                                 displayWith={item => item.label}
                                                 onUpdate={
                                                     (value) => {
                                                         setSchedulingListFilterState({
                                                             ...schedulingListFilterState,
                                                             duration: value
                                                         });
                                                         dateSwitcher("reset", value);
                                                     }
                                                 }
                                                 fullWidth={true}
                                />
                            </div>}
                        </div>
                    </div>
                    {viewMode === 'calendar' ? <>
                            {isCalendarLoading && <div className="scheduling-calendar-loader">
                                <LoaderComponent/>
                            </div>}
                            {schedulingListFilterState.duration === 'month' && <>
                                <FullCalendarComponent
                                    minDate={moment(schedulingListFilterState.start_date).subtract(1, 'months').format('YYYY-MM-DD')}
                                    maxDate={moment(schedulingListFilterState.start_date).add(1, 'year').format('YYYY-MM-DD')}
                                    disabledDates={[]}
                                    canSelect={false}
                                    startDay={schedulingListFilterState.start_date}
                                    showControls={false}
                                    onDayRender={(day, dateMoment) => {
                                        const date = dateMoment.format('YYYY-MM-DD');
                                        return (<div key={'row-day-' + day}
                                                     onClick={
                                                         (event) => {
                                                             // @ts-ignore
                                                             if (event.target?.className.includes('calendar-appointments-holder')) {
                                                                 prepareNewAppointmentBooking({
                                                                     ...schedulingListFilterState,
                                                                     date
                                                                 });
                                                             }
                                                         }
                                                     }
                                                     className={'calendar-appointments-holder ' + ((calendarData && calendarData[date]?.appointments ? calendarData[date]?.appointments : []).length >= 9 ? ' fit-rows-min' : ((calendarData && calendarData[date]?.appointments ? calendarData[date]?.appointments : []).length >= 3 ? ' fit-rows' : ''))}>
                                            {calendarData && calendarData[date]?.appointments && <>
                                                {(!!schedulingListFilterState?.status || !!schedulingListFilterState?.provider_id) ? (calendarData[date]?.appointments || [])
                                                    .map((value: any, index: number) => {
                                                        return (
                                                            <ToolTipComponent key={index} tooltip={
                                                                <>
                                                                    <b>{value?.client_details?.first_name + ' ' + value?.client_details?.last_name || "No title"}</b><br/>
                                                                    {value?.category_details?.name + ' / ' + value?.service_details?.name + ' - ' + (value?.provider_details?.first_name + ' ' + value?.provider_details?.last_name) || "-"}
                                                                    <br/>
                                                                    {CommonService.getHoursAndMinutesFromMinutes(value?.start_time) + ' - ' + CommonService.getHoursAndMinutesFromMinutes(value?.end_time) || "-"}
                                                                    <br/>
                                                                    <i>{value.status || "-"}</i>
                                                                </>
                                                            }
                                                                              backgroundColor={'#000000'}
                                                                              textColor={'#FFFFFF'}>
                                                                <div
                                                                    onClick={() => {
                                                                        setOpenedAppointmentDetails(value);
                                                                    }}
                                                                    className={'appointment-mini-card ' + (value.status)}>
                                                                    <div
                                                                        className="appointment-title">{value?.client_details?.first_name + ' ' + value?.client_details?.last_name}</div>
                                                                    <div
                                                                        className="appointment-status">{value.status || '-'}</div>
                                                                </div>
                                                            </ToolTipComponent>
                                                        )
                                                    }) : (!!schedulingListFilterState.service_id) ? (calendarData[date]?.meta?.providers || [])
                                                    .map((value: any, index: number) => {
                                                        return (
                                                            <ToolTipComponent key={index} tooltip={
                                                                <>
                                                                    <b>{CommonService.capitalizeFirstLetter(value.first_name) + ' ' + CommonService.capitalizeFirstLetter(value.last_name)}</b><br/>
                                                                    <div className={'mrg-top-5'}>No of Appointments
                                                                        : {value?.count || 0}</div>
                                                                </>
                                                            }
                                                                              backgroundColor={'#000000'}
                                                                              textColor={'#FFFFFF'}>
                                                                <div key={index} className={'appointment-count-card'}
                                                                     onClick={() => {
                                                                         setSchedulingListFilterState({
                                                                             ...schedulingListFilterState,
                                                                             provider_id: value._id
                                                                         })
                                                                     }}
                                                                >
                                                                    <div className="appointment-count-card-wrapper"
                                                                         style={{
                                                                             color: ((serviceCategoryColorMap && serviceCategoryColorMap[schedulingListFilterState.category_id]) ? serviceCategoryColorMap[schedulingListFilterState.category_id].text_color_code : '#FFFFFF'),
                                                                             background: ((serviceCategoryColorMap && serviceCategoryColorMap[schedulingListFilterState.category_id]) ? serviceCategoryColorMap[schedulingListFilterState.category_id].bg_color_code : '#AAAAAA'),
                                                                             // opacity: 0.6,
                                                                             borderColor: (serviceCategoryColorMap && serviceCategoryColorMap[schedulingListFilterState.category_id]) ? serviceCategoryColorMap[schedulingListFilterState.category_id] : '#AAAAAA'
                                                                         }}
                                                                    >
                                                                        <div
                                                                            className="appointment-title">{CommonService.getNameInitials(value.first_name + ' ' + value.last_name)}</div>
                                                                        <div
                                                                            className="appointment-count">({value?.count || 0})
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </ToolTipComponent>)
                                                    }) : (!!schedulingListFilterState?.category_id) ? (calendarData[date]?.meta?.services || [])
                                                    .map((value: any, index: number) => {
                                                        return (
                                                            <ToolTipComponent key={index} tooltip={
                                                                <>
                                                                    <b>{value.name || 'No Name'}</b><br/>
                                                                    <i>No of Appointments : {value?.count || 0}</i>
                                                                </>
                                                            }
                                                                              backgroundColor={'#000000'}
                                                                              textColor={'#FFFFFF'}
                                                            >
                                                                <div className={'appointment-count-card'}
                                                                     onClick={() => {
                                                                         setSchedulingListFilterState({
                                                                             ...schedulingListFilterState,
                                                                             service_id: value._id
                                                                         })
                                                                     }}
                                                                >
                                                                    <div className="appointment-count-card-wrapper"
                                                                         style={{
                                                                             color: ((serviceCategoryColorMap && serviceCategoryColorMap[schedulingListFilterState.category_id]) ? serviceCategoryColorMap[schedulingListFilterState.category_id].text_color_code : '#FFFFFF'),
                                                                             background: ((serviceCategoryColorMap && serviceCategoryColorMap[schedulingListFilterState.category_id]) ? serviceCategoryColorMap[schedulingListFilterState.category_id].bg_color_code : '#AAAAAA'),
                                                                             // opacity: 0.6,
                                                                             borderColor: (serviceCategoryColorMap && serviceCategoryColorMap[schedulingListFilterState.category_id]) ? serviceCategoryColorMap[schedulingListFilterState.category_id] : '#AAAAAA'
                                                                         }}
                                                                    >
                                                                        <div
                                                                            className="appointment-title">{CommonService.getNameInitials(value.name)}</div>
                                                                        <div
                                                                            className="appointment-count">({value.count || 0})
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </ToolTipComponent>
                                                        )
                                                    }) : (calendarData[date]?.meta?.categories || [])
                                                    .map((value: any, index: number) => {
                                                        return (
                                                            <ToolTipComponent key={index} tooltip={
                                                                <>
                                                                    <b>{value.name || 'No Name'}</b><br/>
                                                                    <i>No of Appointments : {value?.count || 0}</i>
                                                                </>
                                                            }
                                                                              backgroundColor={'#000000'}
                                                                              textColor={'#FFFFFF'}>
                                                                <div key={index} className={'appointment-count-card '}
                                                                     onClick={() => {
                                                                         setSchedulingListFilterState({
                                                                             ...schedulingListFilterState,
                                                                             category_id: value._id,
                                                                             service_id: undefined,
                                                                             start_date: date,
                                                                             end_date: date,
                                                                             duration: 'day'
                                                                         })
                                                                         if (value) {
                                                                             getServiceList(value?._id);
                                                                         }
                                                                     }}>
                                                                    <div className="appointment-count-card-wrapper"
                                                                         style={{
                                                                             color: (serviceCategoryColorMap && serviceCategoryColorMap[value._id]) ? serviceCategoryColorMap[value._id].text_color_code : '#FFFFFF',
                                                                             background: (serviceCategoryColorMap && serviceCategoryColorMap[value._id]) ? serviceCategoryColorMap[value._id].bg_color_code : '#AAAAAA'
                                                                         }}>
                                                                        <div
                                                                            className="appointment-title">{CommonService.getNameInitials(value.name)}</div>
                                                                        <div
                                                                            className="appointment-count">({value.count || 0})
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </ToolTipComponent>
                                                        )
                                                    })
                                                }
                                            </>}
                                        </div>)
                                    }}
                                />
                                <div className="helper-tooltip"
                                     onClick={setShowCategoryColors.bind(null, !showCategoryColors)}>
                                    {showCategoryColors && <div className="helper-tooltip-window">
                                        {(serviceCategoryList || []).map((value, index) => {
                                            return <div className={'helper-tooltip-window-item '} key={index}>
                                                <div className={'helper-tooltip-window-item-color'}
                                                     style={{
                                                         color: (serviceCategoryColorMap && serviceCategoryColorMap[value._id]) ? serviceCategoryColorMap[value._id].text_color_code : '#FFFFFF',
                                                         background: (serviceCategoryColorMap && serviceCategoryColorMap[value._id]) ? serviceCategoryColorMap[value._id].bg_color_code : '#AAAAAA'
                                                     }}></div>
                                                <div className={'helper-tooltip-window-item-text'}
                                                     style={{
                                                         color: (serviceCategoryColorMap && serviceCategoryColorMap[value._id]) ? serviceCategoryColorMap[value._id].bg_color_code : '#FFFFFF',
                                                     }}>{value.name}</div>
                                            </div>
                                        })}
                                    </div>}
                                    <QuestionMarkIcon/>
                                </div>
                            </>}
                            {schedulingListFilterState.duration !== 'month' &&
                                <div className={'scheduling-calendar-day-wise-holder'}>
                                    <div className="scheduling-calendar-day-wise-time-wrapper">
                                        <div className="scheduling-calendar-day-wise-time-header"></div>
                                        <div className="scheduling-calendar-day-wise-time-body">
                                            {HOURS_LIST.map((value, index) => {
                                                return <div className={'scheduling-calendar-time-body-item'}
                                                            key={index}>{value}</div>
                                            })}
                                        </div>
                                    </div>
                                    <div className={'scheduling-calendar-day-wise-wrapper'}>
                                        {Array.from({
                                            length: (schedulingListFilterState.duration === 'day' ? 1 :
                                                schedulingListFilterState.duration === '3day' ? 3 :
                                                    schedulingListFilterState.duration === '5day' ? 5 : 1)
                                        }, (v, i) => moment(schedulingListFilterState.start_date).add(i, 'days')).map((day, index) => {
                                            const date = day.format('YYYY-MM-DD');
                                            return <div key={index}
                                                        className={"scheduling-calendar-day-wise-item view-" + schedulingListFilterState.duration}>
                                                <div className="scheduling-calendar-day-wise-item-header">
                                                    {day.format(' MMMM DD YYYY')}
                                                </div>
                                                <div className="scheduling-calendar-day-wise-item-body">
                                                    {HOURS_LIST_IN_MINUTES.map(
                                                        (value, index) => {
                                                            return <div key={index}
                                                                        className="scheduling-calendar-hour-block"
                                                                        onClick={
                                                                            (event) => {
                                                                                // @ts-ignore
                                                                                if (event.target?.className === 'scheduling-calendar-hour-block') {
                                                                                    prepareNewAppointmentBooking({
                                                                                        ...schedulingListFilterState, ...value,
                                                                                        date
                                                                                    });
                                                                                    // console.log(event.target.className, 'add new appointment', value, schedulingListFilterState);
                                                                                }
                                                                            }
                                                                        }>
                                                                <div className="dashed-line"/>
                                                                <div className="scheduling-calendar-hour-block-content">
                                                                    {
                                                                        (calendarDaysData && calendarDaysData[date]?.appointments && calendarDaysData[date]?.appointments[value?.label] ? calendarDaysData[date]?.appointments[value?.label] : [])
                                                                            .map((appointment: any) => {
                                                                                return (
                                                                                    <div className="card-item"
                                                                                         onClick={() => {
                                                                                             setOpenedAppointmentDetails(appointment);
                                                                                         }}
                                                                                         style={{
                                                                                             top: appointment.start_time - value.start,
                                                                                             height: appointment.end_time - appointment.start_time
                                                                                         }}>
                                                                                        <CalendarAppointmentCard
                                                                                            title={appointment.client_details.first_name + ' ' + appointment.client_details.last_name}
                                                                                            timeSlot={CommonService.getHoursAndMinutesFromMinutes(appointment.start_time) + ' - ' + CommonService.getHoursAndMinutesFromMinutes(appointment.end_time)}
                                                                                            description={
                                                                                                appointment.category_details.name + ' / ' + appointment.service_details.name + ' - ' + (appointment.provider_details.first_name + ' ' + appointment.provider_details.last_name)
                                                                                            }
                                                                                            status={appointment.status}
                                                                                        />
                                                                                    </div>
                                                                                )
                                                                            })
                                                                    }
                                                                    {
                                                                        (calendarDaysData && calendarDaysData[date]?.blocked_slots && calendarDaysData[date]?.blocked_slots[value?.label] ? calendarDaysData[date]?.blocked_slots[value?.label] : [])
                                                                            .map((blocked_slot: any) => {
                                                                                const nonFirstAllDayBlock = !(index !== 0 && blocked_slot.is_block_all_day);
                                                                                return (
                                                                                    <div className="card-item"
                                                                                         style={{
                                                                                             top: nonFirstAllDayBlock ? blocked_slot.start_time - value.start : 0,
                                                                                             height: nonFirstAllDayBlock ? blocked_slot.end_time - blocked_slot.start_time: 0
                                                                                         }}>
                                                                                        {nonFirstAllDayBlock &&
                                                                                            <CalendarAppointmentCard
                                                                                                title={blocked_slot?.provider_details?.first_name + ' ' + blocked_slot?.provider_details?.last_name}
                                                                                                timeSlot={CommonService.getHoursAndMinutesFromMinutes(blocked_slot?.start_time) + ' - ' + CommonService.getHoursAndMinutesFromMinutes(blocked_slot?.end_time)}
                                                                                                reason={blocked_slot?.reason}
                                                                                                status={'blocked'}
                                                                                            />
                                                                                        }
                                                                                    </div>
                                                                                )
                                                                            })
                                                                    }
                                                                </div>
                                                            </div>
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        })
                                        }
                                    </div>
                                </div>}
                        </> :
                        <>
                            <TableWrapperComponent
                                id={"appointment_search"}
                                url={APIConfig.APPOINTMENT_LIST.URL}
                                method={APIConfig.APPOINTMENT_LIST.METHOD}
                                columns={SchedulingListColumns}
                                refreshToken={refreshToken}
                                onDataLoaded={(data: any) => {
                                    setAppointmentDataPresent(data)
                                }}
                                noDataText={<>{(!!schedulingListFilterState.start_date || !!schedulingListFilterState.category_id || !!schedulingListFilterState.service_id || !!schedulingListFilterState.provider_id || !!schedulingListFilterState.status) &&
                                    (<div className={'no-appointment-text-wrapper'}>
                                        <div><img src={ImageConfig.Search} alt="client-search"/></div>
                                        <div className={'no-appointment-heading'}>No Client Found</div>
                                        <div className={'no-appointment-description'}>
                                            Please adjust filters or choose a different date range to refine your
                                            search.
                                        </div>
                                    </div>)}
                                    {
                                        (schedulingListFilterState?.search ?
                                            <div className={'no-appointment-text-wrapper'}>
                                                <div><img src={ImageConfig.Search} alt="client-search"/></div>
                                                <div className={'no-appointment-heading'}>No Client Found!</div>
                                                <div className={'no-appointment-description'}>
                                                    Oops! It seems like there are no appointments available for the
                                                    client name you have searched.
                                                </div>
                                            </div> : '')
                                    }
                                    {appointmentDataPresent?.length === 0 && (
                                        (!schedulingListFilterState.start_date &&
                                            !schedulingListFilterState.category_id &&
                                            !schedulingListFilterState.service_id &&
                                            !schedulingListFilterState.provider_id &&
                                            !schedulingListFilterState.status)
                                    ) && (
                                        <div className={'no-appointment-text-wrapper'}>
                                            <div className={'no-appointment-description'}>
                                                Currently, there are no appointments scheduled.
                                            </div>
                                        </div>
                                    )}
                                </>

                                }
                                extraPayload={schedulingListFilterState}
                                onSort={handleSchedulingSort}
                            />
                        </>
                    }
                </div>
            }

            <DrawerComponent isOpen={!!openedAppointmentDetails}
                             onClose={setOpenedAppointmentDetails.bind(null, null)}
                             showClose={true}
                             className={'book-appointment-component-drawer'}>

                <AppointmentDetailsComponent
                    appointment_id={openedAppointmentDetails?._id}
                    onComplete={
                        () => {
                            setRefreshToken(Math.random().toString());
                            setOpenedAppointmentDetails(null);
                        }
                    }
                    onClose={
                        setOpenedAppointmentDetails.bind(null, null)
                    }
                />
            </DrawerComponent>

            <DrawerComponent isOpen={isBookAppointmentOpen}
                             showClose={true}
                             onClose={setIsBookAppointmentOpen.bind(null, false)}
                             className={'book-appointment-component-drawer'}>
                <BookAppointmentComponent
                    preFillData={bookAppointmentPreFill}
                    onComplete={
                        () => {
                            if (viewMode === 'calendar') {
                                getCalenderList({...schedulingListFilterState});
                            } else {
                                setRefreshToken(Math.random().toString());
                            }
                            setIsBookAppointmentOpen(false);
                            setBookAppointmentPreFill({})
                        }
                    }
                    onClose={
                        () => {
                            setIsBookAppointmentOpen(false)
                            setBookAppointmentPreFill({})
                        }
                    }
                />
            </DrawerComponent>


            <DrawerComponent isOpen={openBlockCalenderDrawer}
                             showClose={true}
                             onClose={() => setOpenBlockCalenderDrawer(false)}
                             className={'block-calendar-component-drawer'}>
                <BlockCalendarComponent onAddSuccess={() => {
                    setOpenBlockCalenderDrawer(false);
                    getCalenderList({...schedulingListFilterState});
                }
                }/>
            </DrawerComponent>

        </div>
    );
};

export default SchedulingScreen;
