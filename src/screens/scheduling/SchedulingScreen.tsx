import "./SchedulingScreen.scss";
import {useDispatch, useSelector} from "react-redux";
import React, {useCallback, useEffect, useState} from "react";
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
import AutoCompleteComponent from "../../shared/components/form-controls/auto-complete/AutoCompleteComponent";
import AppointmentDetailsComponent from "../../shared/components/appointment-details/AppointmentDetailsComponent";
import BookAppointmentComponent from "../../shared/components/book-appointment/BookAppointmentComponent";
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import TableWrapperComponent from "../../shared/components/table-wrapper/TableWrapperComponent";
import CalendarAppointmentCard from "./calendar-appointment-card/CalendarAppointmentCard";
import {IAPIResponseType} from "../../shared/models/api.model";
import {IClientBasicDetails} from "../../shared/models/client.model";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import ToolTipComponent from "../../shared/components/tool-tip/ToolTipComponent";

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

    const SchedulingListColumns: ITableColumn[] = [
        {
            title: "Time",
            key: "time",
            dataIndex: "time",
            width: 120,
            render: (item: any) => {
                return CommonService.getHoursAndMinutesFromMinutes(item.start_time)
            }
        },
        {
            title: "Client Name",
            key: "name",
            dataIndex: "client_name",
            sortable: true,
            width: 150,
            render: (item: any) => {
                return <span>{item?.client_details?.last_name} {item?.client_details?.first_name}</span>
            }
        },
        {
            title: "Phone",
            key: "primary_contact_info",
            dataIndex: "primary_contact_info",
            width: 150,
            render: (item: any) => {
                return <span>{item?.client_details?.primary_contact_info?.phone ? CommonService.formatPhoneNumber(item?.client_details?.primary_contact_info?.phone) : ''}</span>
            }
        },
        {
            title: "Service",
            key: "service",
            dataIndex: "service",
            width: 150,
            render: (item: any) => {
                return <span>
                    {item?.service_details?.name}
                </span>
            }
        },
        {
            title: "Provider",
            key: "provider",
            dataIndex: "provider",
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
            width: 90,
            render: (item: any) => {
                return <ChipComponent label={item?.status}
                                      className={item?.status}
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
    ];

    const {appointmentStatus} = useSelector((state: IRootReducerState) => state.staticData);
    const [schedulingListFilterState, setSchedulingListFilterState] = useState<any>({
        search: "",
        start_date: moment().format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD'),
        sort: {}
    });
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

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
                const startDate = moment(old.start_date);
                let endDate;
                if (mode === 'increasing') {
                    if (duration === 'day') {
                        startDate.add(1, 'day');
                        endDate = startDate.clone();
                    } else if (duration === '3day') {
                        startDate.add(3, 'day');
                        endDate = startDate.clone().add(3, 'day');
                    } else if (duration === '5day') {
                        startDate.add(5, 'day');
                        endDate = startDate.clone().add(5, 'day');
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
                        endDate = startDate.clone().subtract(3, 'day');
                    } else if (duration === '5day') {
                        startDate.subtract(5, 'day');
                        endDate = startDate.clone().subtract(5, 'day');
                    } else if (duration === 'month') {
                        startDate.subtract(1, 'month').startOf('month');
                        endDate = startDate.clone().endOf('month');
                    }
                } else if (mode === 'reset') {
                    if (duration === 'day') {
                        endDate = startDate.clone();
                    } else if (duration === '3day') {
                        endDate = startDate.clone().add(3, 'day');
                    } else if (duration === '5day') {
                        endDate = startDate.clone().add(5, 'day');
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
    const [openedAppointmentDetails, setOpenedAppointmentDetails] = useState<any | null>(null);
    const [refreshToken, setRefreshToken] = useState('');

    const setViewModeHandler = useCallback((mode: 'list' | 'calendar') => {
        if (mode === 'calendar') {
            setSchedulingListFilterState((old: any) => {
                const newState = {...old};
                newState["duration"] = 'month';
                return newState;
            })
            dateSwitcher('reset', 'month');
        }
        setViewMode(mode);
    }, [dateSwitcher]);

    // const handleCalendarData = useCallback((date: any) => {
    //
    // }, []);

    const [serviceCategoryList, setServiceCategoryList] = useState<any[] | null>(null);
    const [serviceCategoryColorMap, setServiceCategoryColorMap] = useState<any>({});
    const getServiceCategoriesList = useCallback(
        () => {
            setServiceCategoryList([]);
            CommonService._serviceCategory.ServiceCategoryListAPICall({is_active: true})
                .then((response: IAPIResponseType<any>) => {
                    const data = response.data || [];
                    const colorMap: any = {};
                    data.forEach((item: any) => {
                        colorMap[`${item._id}`] = item.color_code || '#AAAAAA';
                    })
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

    const [calendarData, setCalendarData] = useState<any>(null)
    const [calendarDaysData, setCalendarDaysData] = useState<any>(null)
    const getCalenderList = useCallback((payload: any) => {
        delete payload.sort;
        setCalendarData(null);
        setCalendarDaysData(null);
        CommonService._appointment.getAppointmentCalendarList(payload)
            .then((response: IAPIResponseType<IClientBasicDetails>) => {
                // console.log(response, 'response');
                // CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                const data = response.data || {};
                setCalendarData(data);
                const daysData: any = {};
                for (let date in data) {
                    // const dayData = {}
                    const appointments = data[date].appointments || [];
                    const dayHourData: any = {};
                    appointments.forEach((appointment: any) => {
                        HOURS_LIST_IN_MINUTES.forEach((hour: any) => {
                            // console.log(hour, 'hour', appointment.start_time, appointment.end_time);
                            if (appointment.start_time >= hour.start && appointment.start_time < hour.end) {
                                if (!dayHourData.hasOwnProperty(hour.label)) {
                                    dayHourData[hour.label] = [];
                                }
                                dayHourData[hour.label].push(appointment);
                            }
                        });
                    })
                    daysData[date] = dayHourData
                }
                setCalendarDaysData(daysData);
                console.log(daysData, 'daysData');
            })
            .catch((error: any) => {
            })
    }, []);
    useEffect(() => {
        if (viewMode === 'calendar') {
            getCalenderList(schedulingListFilterState);
        }
    }, [schedulingListFilterState, getCalenderList, viewMode]);
    return (
        <div className={'scheduling-list-component'}>
            <DrawerComponent isOpen={!!openedAppointmentDetails} onClose={setOpenedAppointmentDetails.bind(null, null)}
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
                             onClose={setIsBookAppointmentOpen.bind(null, false)}
                             className={'book-appointment-component-drawer'}>
                <BookAppointmentComponent
                    onComplete={
                        () => {
                            setRefreshToken(Math.random().toString());
                            setIsBookAppointmentOpen(false);
                        }
                    }
                    onClose={
                        setIsBookAppointmentOpen.bind(null, false)}
                />
            </DrawerComponent>
            <div className="scheduling-header-wrapper">
                <div className="scheduling-header-search-wrapper">
                    <SearchComponent size={'small'}
                                     className={'scheduling-list-input mrg-top-20'}
                                     label={'Search for Client'}
                                     value={schedulingListFilterState.search}
                                     onSearchChange={(value) => {
                                         setSchedulingListFilterState({...schedulingListFilterState, search: value})
                                     }}/>
                </div>
                <div className="scheduling-header-actions-wrapper">
                    <div className="scheduling-header-action-item">
                        <ToggleButtonGroup value={viewMode} color={"primary"} size={'small'}>
                            <ToggleButton value="calendar" onClick={setViewModeHandler.bind(null, 'calendar')}
                                          color={viewMode === 'calendar' ? 'primary' : 'standard'} type={'button'}
                                          aria-label="calender view">
                                <ImageConfig.SchedulingIcon/>
                            </ToggleButton>
                            <ToggleButton value="list" type={'button'} onClick={setViewModeHandler.bind(null, 'list')}
                                          color={viewMode === 'list' ? 'primary' : 'standard'}
                                          aria-label="list view">
                                <ImageConfig.ListIcon/>
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                    {/*<div className="scheduling-header-action-item">*/}
                    {/*    <ButtonComponent variant={'outlined'} prefixIcon={<ImageConfig.BlockIcon/>}>Block*/}
                    {/*        Calender</ButtonComponent>*/}
                    {/*</div>*/}
                    <div className="scheduling-header-action-item">
                        <ButtonComponent onClick={setIsBookAppointmentOpen.bind(null, true)}
                                         prefixIcon={<ImageConfig.AddIcon/>}>Book Appointment</ButtonComponent>
                    </div>
                </div>
            </div>
            {
                <div className={"list-content-wrapper view-" + viewMode}>
                    <div className='scheduling-filter-header-wrapper'>
                        <div className="scheduling-filter-header-date-wrapper">
                            <div
                                className="filter-header-date-text">{CommonService.convertDateFormat(schedulingListFilterState.start_date, (viewMode === 'calendar' && schedulingListFilterState.duration === 'month') ? ('MMMM, YYYY') : 'DD MMMM, YYYY')}</div>
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
                        <div className="scheduling-filter-header-actions-wrapper">
                            <div className="scheduling-filter-header-action-item">
                                <AutoCompleteComponent size={'small'}
                                                       label={'Service Category'}
                                                       dataListKey={'data'}
                                                       displayWith={item => item ? item?.name : ''}
                                                       keyExtractor={item => item?._id}
                                                       valueExtractor={item => item}
                                                       searchMode={'serverSide'}
                                                       openOnFocus={true}
                                                       url={APIConfig.SERVICE_CATEGORY_LIST_LITE.URL}
                                                       method={APIConfig.SERVICE_CATEGORY_LIST_LITE.METHOD}
                                                       fullWidth={true}
                                                       onUpdate={
                                                           (value) => {
                                                               setSchedulingListFilterState({
                                                                   ...schedulingListFilterState,
                                                                   category_id: value?._id,
                                                                   service_id: undefined
                                                               })
                                                           }
                                                       }
                                />
                            </div>
                            <div className="scheduling-filter-header-action-item">
                                <AutoCompleteComponent size={'small'}
                                                       label={'Service'}
                                                       disabled={!schedulingListFilterState?.category_id}
                                                       dataListKey={'data'}
                                                       displayWith={item => item ? item?.name : ''}
                                                       keyExtractor={item => item?._id}
                                                       valueExtractor={item => item}
                                                       searchMode={'serverSide'}
                                                       url={APIConfig.SERVICE_LIST_LITE.URL(schedulingListFilterState?.category_id)}
                                                       method={APIConfig.SERVICE_LIST_LITE.METHOD}
                                                       fullWidth={true}
                                                       onUpdate={
                                                           (value) => {
                                                               setSchedulingListFilterState({
                                                                   ...schedulingListFilterState,
                                                                   service_id: value?._id
                                                               })

                                                           }
                                                       }
                                />
                            </div>
                            <div className="scheduling-filter-header-action-item">
                                <AutoCompleteComponent size={'small'}
                                                       label={'Provider'}
                                                       value={schedulingListFilterState?.provider_id}
                                                       dataListKey={'data'}
                                                       displayWith={item => item ? item?.first_name + ' ' + item?.last_name : ''}
                                                       keyExtractor={item => item?._id}
                                                       valueExtractor={item => item}
                                                       searchMode={'serverSide'}
                                                       url={APIConfig.USER_LIST_LITE.URL}
                                                       method={APIConfig.USER_LIST_LITE.METHOD}
                                                       fullWidth={true}
                                                       onUpdate={
                                                           (value) => {
                                                               setSchedulingListFilterState({
                                                                   ...schedulingListFilterState,
                                                                   provider_id: value?._id
                                                               })
                                                           }
                                                       }
                                />
                            </div>
                            <div className="scheduling-filter-header-action-item">
                                <AutoCompleteComponent size={'small'}
                                                       value={schedulingListFilterState?.status}
                                                       options={appointmentStatus || []}
                                                       displayWith={(option: any) => (option?.title || '')}
                                                       valueExtractor={(option: any) => option?.code}
                                                       label={'Status'}
                                                       onUpdate={
                                                           (value) => {
                                                               setSchedulingListFilterState({
                                                                   ...schedulingListFilterState,
                                                                   status: value?.code
                                                               })
                                                           }
                                                       }
                                                       fullWidth={true}
                                />
                            </div>
                            {viewMode === 'calendar' && <div className="scheduling-filter-header-action-item">
                                <SelectComponent size={'small'}
                                                 options={[{value: 'month', label: 'Month'}, {
                                                     value: 'day',
                                                     label: 'Day'
                                                 }, {value: '3day', label: '3 Day'}, {value: '5day', label: '5 Day'}]}
                                                 label={'Duration'}
                                                 value={schedulingListFilterState.duration || 'month'}
                                                 valueExtractor={item => item.value}
                                                 displayWith={item => item.label}
                                                 onUpdate={
                                                     (value) => {
                                                         setSchedulingListFilterState({
                                                             ...schedulingListFilterState,
                                                             duration: value
                                                         })
                                                     }
                                                 }
                                                 fullWidth={true}
                                />
                            </div>}
                        </div>
                    </div>
                    {viewMode === 'calendar' && <>
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
                                                 className={'calendar-appointments-holder' + ((calendarData && calendarData[date]?.appointments ? calendarData[date]?.appointments : []).length >= 9 ? ' fit-rows-min' : ((calendarData && calendarData[date]?.appointments ? calendarData[date]?.appointments : []).length >= 3 ? ' fit-rows' : ''))}>
                                        {calendarData && calendarData[date] && <>
                                            {(!!schedulingListFilterState.status || !!schedulingListFilterState.provider_id) ? (calendarData[date]?.appointments || [])
                                                .map((value: any, index: number) => {
                                                    return (
                                                        <ToolTipComponent key={index} tooltip={
                                                            <>
                                                                <b>{value.client_details.first_name + ' ' + value.client_details.last_name || "No title"}</b><br/>
                                                                {value.category_details.name + ' / ' + value.service_details.name + ' - ' + (value.provider_details.first_name + ' ' + value.provider_details.last_name) || "-"}
                                                                <br/>
                                                                {CommonService.getHoursAndMinutesFromMinutes(value.start_time) + ' - ' + CommonService.getHoursAndMinutesFromMinutes(value.end_time) || "-"}
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
                                                                     color: '#000000',
                                                                     background: ((serviceCategoryColorMap && serviceCategoryColorMap[schedulingListFilterState.category_id]) ? serviceCategoryColorMap[schedulingListFilterState.category_id] : '#AAAAAA') + '30',
                                                                     // opacity: 0.6,
                                                                     borderColor: (serviceCategoryColorMap && serviceCategoryColorMap[schedulingListFilterState.category_id]) ? serviceCategoryColorMap[schedulingListFilterState.category_id] : '#AAAAAA'
                                                                 }}
                                                            >
                                                                <div
                                                                    className="appointment-title">{CommonService.getNameInitials(value.first_name + ' ' + value.last_name)}</div>
                                                                <div className="appointment-count">({value?.count || 0})
                                                                </div>
                                                            </div>
                                                        </div>)
                                                }) : (!!schedulingListFilterState.category_id) ? (calendarData[date]?.meta?.services || [])
                                                .map((value: any, index: number) => {
                                                    return (
                                                        <div key={index} className={'appointment-count-card'}
                                                             onClick={() => {
                                                                 setSchedulingListFilterState({
                                                                     ...schedulingListFilterState,
                                                                     service_id: value._id
                                                                 })
                                                             }}
                                                        >
                                                            <div className="appointment-count-card-wrapper"
                                                                 style={{
                                                                     color: '#000000',
                                                                     background: ((serviceCategoryColorMap && serviceCategoryColorMap[schedulingListFilterState.category_id]) ? serviceCategoryColorMap[schedulingListFilterState.category_id] : '#AAAAAA') + '60',
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
                                                        </div>)
                                                }) : (calendarData[date]?.meta?.categories || [])
                                                .map((value: any, index: number) => {
                                                    return (
                                                        <div key={index} className={'appointment-count-card '}
                                                             onClick={() => {
                                                                 setSchedulingListFilterState({
                                                                     ...schedulingListFilterState,
                                                                     category_id: value?._id,
                                                                     service_id: undefined
                                                                 })
                                                             }}>
                                                            <div className="appointment-count-card-wrapper"
                                                                 style={{
                                                                     color: CommonService.getContrastYIQ((serviceCategoryColorMap && serviceCategoryColorMap[value._id]) ? serviceCategoryColorMap[value._id] : '#AAAAAA'),
                                                                     background: (serviceCategoryColorMap && serviceCategoryColorMap[value._id]) ? serviceCategoryColorMap[value._id] : '#AAAAAA'
                                                                 }}>
                                                                <div
                                                                    className="appointment-title">{CommonService.getNameInitials(value.name)}</div>
                                                                <div className="appointment-count">({value.count || 0})
                                                                </div>
                                                            </div>
                                                        </div>)
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
                                                 style={{background: value.color_code}}></div>
                                            <div className={'helper-tooltip-window-item-text'}
                                                 style={{color: value.color_code}}>{value.name}</div>
                                        </div>
                                    })}
                                </div>}
                                <QuestionMarkIcon/>
                            </div>
                        </>
                        }

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
                                                {day.format('DD MMMM YYYY')}
                                            </div>
                                            <div className="scheduling-calendar-day-wise-item-body">
                                                {HOURS_LIST_IN_MINUTES.map(
                                                    (value, index) => {
                                                        return <div key={index}
                                                                    className="scheduling-calendar-hour-block">
                                                            <div className="dashed-line"/>
                                                            <div className="scheduling-calendar-hour-block-content">
                                                                {/*actual logic goes here*/}

                                                                {
                                                                    (calendarDaysData && calendarDaysData[date] && calendarDaysData[date][value.label] ? calendarDaysData[date][value.label] : [])
                                                                        .map((appointment: any, index: number) => {
                                                                            return (
                                                                                <div className="card-item"
                                                                                     onClick={() => {
                                                                                         setOpenedAppointmentDetails(appointment);
                                                                                     }}
                                                                                     style={{marginTop: appointment.start_time - value.start}}>
                                                                                    <CalendarAppointmentCard
                                                                                        title={appointment.client_details.first_name + ' ' + appointment.client_details.last_name}
                                                                                        timeSlot={CommonService.getHoursAndMinutesFromMinutes(appointment.start_time) + ' - ' + CommonService.getHoursAndMinutesFromMinutes(appointment.end_time)}
                                                                                        description={
                                                                                            appointment.category_details.name + ' / ' + appointment.service_details.name + ' - ' + (appointment.provider_details.first_name + ' ' + appointment.provider_details.last_name)
                                                                                        }
                                                                                        style={{height: appointment.end_time - appointment.start_time}}
                                                                                        status={appointment.status}
                                                                                    />
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
                    </>}
                    {viewMode === 'list' && <TableWrapperComponent
                        id={"appointment_search"}
                        url={APIConfig.APPOINTMENT_LIST.URL}
                        method={APIConfig.APPOINTMENT_LIST.METHOD}
                        columns={SchedulingListColumns}
                        refreshToken={refreshToken}
                        noDataText={(!!schedulingListFilterState.category_id || !!schedulingListFilterState.search || !!schedulingListFilterState.service_id || !!schedulingListFilterState.provider_id || !!schedulingListFilterState.status) ? 'No Appointments Available' : 'No Appointments Scheduled'}
                        extraPayload={schedulingListFilterState}
                        onSort={handleSchedulingSort}
                    />}
                </div>
            }
        </div>
    );

};

export default SchedulingScreen;
