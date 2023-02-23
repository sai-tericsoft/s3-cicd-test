import React, {useCallback, useEffect, useState} from 'react';
import './FullCalendarComponent.scss';
import ButtonComponent from "../button/ButtonComponent";
import moment, {Moment} from "moment/moment";

export interface FullCalendarComponentProps {
    minDate?: string;
    maxDate?: string;
    startDay?: string;
    disabledDates?: string [];
    selectedDates?: string[];
    canSelect?: boolean;
    showControls?: boolean;
    hideDay?: boolean;
    onDayRender?: (date: string, dateMoment: Moment) => void;
}

const weekDays = moment.weekdays();
const weekDaysShort = moment.weekdaysShort();
const weekDaysMin = moment.weekdaysMin();
const months = moment.months();
const monthsShort = moment.monthsShort();
const TODAY = moment();

const FullCalendarComponent = (props: FullCalendarComponentProps) => {
    const {selectedDates, minDate, onDayRender, maxDate, hideDay, startDay, disabledDates} = props;
    const canSelect = props.canSelect !== undefined ? props.canSelect : true;
    const showControls = props.showControls !== undefined ? props.showControls : true;
    const [calendar, setCalendar] = useState<any>(null);
    const [tmpSelectedDates, setTmpSelectedDates] = useState<string[] | undefined>(selectedDates)
    // const [contextMenu, setContextMenu] = useState<any>()
    // const [dates, setDates] = useState<any>(null)
    // const [today, setToday] = useState<Moment>(moment())
    // const [currentInstanceStart, setCurrentInstanceStart] = useState<Moment | null>(null)
    // const [currentMonthStart, setCurrentMonthStart] = useState<Moment | null>(null)
    // const [currentMonthEnd, setCurrentMonthEnd] = useState<Moment | null>(null)
    // const [currentMonth, setCurrentMonth] = useState<number | null>(null)
    // const [currentYear, setCurrentYear] = useState<number | null>(null)
    // const [weekRows, setWeekRows] = useState<any[]>([]);
    // const [currentContextDate, setCurrentContextDate] = useState('');

    useEffect(() => {
        setTmpSelectedDates(selectedDates)
    }, [selectedDates])
    const build = useCallback(
        (date: Moment = moment()) => {
            console.log('building...')
            const dates: any = {};
            const currentInstanceStart = date.clone();
            const monthStart = date.clone();
            const monthEnd = date.clone();
            const tmpToday = TODAY.clone().format('YYYY-MM-DD');
            monthStart.startOf('month');
            monthEnd.endOf('month');
            const currentMonthStart = monthStart.clone();
            const currentMonthEnd = monthEnd.clone();
            const start = monthStart.date();
            const end = monthEnd.date();
            const month = date.month();
            const currentYear = date.year();
            const currentMonth = month;
            // weekRows = Array(Math.ceil(end / 7)).fill(0).map((x, i) => i);
            const year = date.year();
            let weekNumber = 1;
            const weekRows: number[] = [weekNumber];
            let dayNumber = 1;
            const tmpMinDate = moment(minDate || '').isValid() ? moment(minDate) : false;
            const tmpMaxDate = moment(maxDate || '').isValid() ? moment(maxDate) : false;
            for (let day = start; day <= end; day++) {
                const dateString = year + '-' + (((month + 1) < 10) ? '0' : '') + (month + 1) + '-' + ((day < 10) ? '0' : '') + day;
                const dateItem = moment(dateString);
                const weekDay = dateItem.clone().weekday();
                // console.log(dayNumber % 7);
                if (dayNumber % 7 === 0) {
                    weekNumber++;
                    weekRows.push(weekNumber);
                }
                if (!dates[weekNumber]) {
                    dates[weekNumber] = [];
                }
                if (day === start) {
                    for (let startEmpty = 1; startEmpty < weekDay + 1; startEmpty++) {
                        // console.log(startEmpty, weekDay);
                        dates[weekNumber].push(null);
                    }
                }
                let isNotAvailable = false;
                if (tmpMinDate && tmpMaxDate) {
                    isNotAvailable = !(dateItem.unix() > tmpMinDate.unix() && dateItem.unix() < tmpMaxDate.unix());
                } else if (tmpMinDate) {
                    isNotAvailable = dateItem.unix() < tmpMinDate.unix();
                } else if (tmpMaxDate) {
                    isNotAvailable = dateItem.unix() > tmpMaxDate.unix();
                }
                dates[weekNumber].push({
                    date: dateString,
                    day: dateItem.date(),
                    dateMoment: dateItem,
                    is_today: tmpToday === dateString,
                    is_disabled: (disabledDates || []).indexOf(dateString) !== -1,
                    is_not_available: isNotAvailable
                });
                dayNumber = weekDay + 1;
                if (day === end) {
                    for (let endEmpty = weekDay + 1; endEmpty < 7; endEmpty++) {
                        dates[weekNumber].push(null);
                    }
                }
            }
            setCalendar({
                dates,
                currentInstanceStart,
                currentMonthStart,
                currentMonthEnd,
                currentMonth,
                currentYear,
                weekRows
            })
        },
        [disabledDates, minDate, maxDate]
    );


    const getPrevMonth = useCallback((currentInstanceStart: Moment) => {
        build(currentInstanceStart.clone().add(-1, 'month'));
    }, [build])

    const getNextMonth = useCallback((currentInstanceStart: Moment) => {
        build(currentInstanceStart.clone().add(1, 'month'));
    }, [build])

    const getToday = useCallback(() => {
        build(TODAY);
    }, [build])

    const canNavigatePrevMonth = useCallback((calendar: any, minDate?: string) => {
        const validMinDate = moment(minDate || '').isValid() ? moment(minDate) : false;
        return !validMinDate || (validMinDate && calendar?.currentMonthStart && calendar?.currentMonthStart?.unix() > validMinDate.unix());
    }, [])

    const canNavigateNextMonth = useCallback((calendar: any, maxDate?: string) => {
        const validMaxDate = moment(maxDate || '').isValid() ? moment(maxDate) : false;
        return !validMaxDate || (validMaxDate && calendar?.currentMonthEnd && calendar?.currentMonthEnd?.unix() < validMaxDate.unix());
    }, [])

    const datesSelected = useCallback((dates: any[]) => {
        console.log(dates);
    }, [])

    const daySelect = useCallback((date: string) => {
        const tmpSelectedDates2 = tmpSelectedDates || [];
        const index = tmpSelectedDates2.indexOf(date);
        if (index > -1) {
            tmpSelectedDates2.splice(index, 1);
        } else {
            tmpSelectedDates2.push(date);
        }
        setTmpSelectedDates(tmpSelectedDates2)
        datesSelected(tmpSelectedDates2);
    }, [tmpSelectedDates, datesSelected])


    useEffect(() => {
        const validStartDay = moment(startDay || '').isValid() ? moment(startDay) : false;
        if (validStartDay) {
            build(validStartDay);
        } else {
            build();
        }
    }, [build, startDay]);

    return (
        <>{calendar &&
            <div className="ts-calendar-wrapper">
                {showControls && <div className="ts-calendar-controls mrg-bottom-10">
                    <div className="current-month-year-title">
                        <span className="d-inline-block d-md-none">
                          {!!monthsShort && calendar?.currentMonth !== undefined && monthsShort[calendar.currentMonth]}
                        </span>
                        <span className="d-none d-md-inline-block">
                              {!!months && calendar?.currentMonth !== undefined && months[calendar.currentMonth]}
                        </span>
                        - {calendar?.currentYear}
                    </div>
                    <div className="ts-mat-button-group text-right">
                        <ButtonComponent disabled={!canNavigatePrevMonth(calendar, minDate)} color="primary"
                                         onClick={getPrevMonth.bind(null, calendar.currentInstanceStart)}>
                            Prev
                        </ButtonComponent>
                        <ButtonComponent color="primary"
                                         onClick={getToday}>Today
                        </ButtonComponent>
                        <ButtonComponent disabled={!canNavigateNextMonth(calendar, maxDate)} color="primary"
                                         onClick={getNextMonth.bind(null, calendar.currentInstanceStart)}>
                            Next
                        </ButtonComponent>
                    </div>

                </div>}
                <div className="ts-calendar-weeks">
                    {weekDays && weekDays.map((dayName, index) => {
                        return (
                            <div className={"ts-week-name-item ts-week-day-" + index}>
                                <span className="d-block d-md-none">{weekDaysMin[index]}</span>
                                <span
                                    className="d-none d-md-block d-lg-none">{weekDaysShort[index]}</span>
                                <span className="d-none d-lg-block">{weekDays[index]}</span>
                            </div>
                        )
                    })
                    }
                </div>
                {
                    calendar?.weekRows && calendar?.weekRows.map((week: string | number, index: string) => {
                        return (
                            <div key={'week-item-' + index} className="ts-calendar-dates">
                                {
                                    calendar?.dates[week] && (calendar?.dates[week] || []).map((day: any, dayIndex: number) => {
                                        return (
                                            <div key={'day-item-' + dayIndex}
                                                 className={`ts-day-item-wrapper ts-week-day-${dayIndex} ts-week-${week} ` + (!day ? ' ts-date-not-available' : '')}>
                                                {
                                                    !!day && <div
                                                        onClick={
                                                            () => {
                                                                if (canSelect && !day?.is_disabled && !day?.is_not_available) {
                                                                    daySelect(day?.date)
                                                                }
                                                            }
                                                        }
                                                        className={"ts-day-item " + (day?.is_today ? ' is_today' : '') + (day?.is_disabled ||
                                                            day?.is_not_available ? ' is_disabled' : '') +
                                                            (tmpSelectedDates && tmpSelectedDates.indexOf(day?.date) > -1 ? ' is_selected' : '') + (calendar?.canSelect ? ' cursor-pointer' : '')}>
                                                        <>
                                                            {!hideDay && <div className="ts-day-text">{day.day}</div>}
                                                            {onDayRender && onDayRender(day.day, day.dateMoment)}
                                                        </>
                                                    </div>
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
        }
        </>
    );
};

export default FullCalendarComponent;
