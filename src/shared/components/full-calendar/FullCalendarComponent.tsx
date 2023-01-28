import React, {useEffect, useState} from 'react';
import './FullCalendarComponent.scss';
import {TsCalendarWrapperClass} from "../../classes/ts-calendar-wrapper.class";
import ButtonComponent from "../button/ButtonComponent";

export interface FullCalendarComponentProps {
    minDate?: string;
    maxDate?: string;
    disabledDates?: string [];
    selectedDates?: string[];
    canSelect?: boolean;
}

const FullCalendarComponent = (props: FullCalendarComponentProps) => {
    const {canSelect, selectedDates, minDate, maxDate, disabledDates} = props;
    const [calendar, setCalendar] = useState<{ item: TsCalendarWrapperClass | null, token: '' }>({
        item: null,
        token: ''
    });
    useEffect(() => {
        new TsCalendarWrapperClass(
            {
                canSelect: canSelect,
                disabledDates: disabledDates,
                selectedDates: selectedDates,
                minDate: minDate,
                maxDate: maxDate
            }, setCalendar)
    }, [canSelect, selectedDates, minDate, maxDate, disabledDates]);

    return (
        <>{calendar && calendar.item &&
            <div className="ts-calendar-wrapper">
                <div className="ts-calendar-controls mrg-bottom-10">
                    <div className="current-month-year-title">
                        <span className="d-inline-block d-md-none">
                          {!!calendar.item?.monthsShort && calendar.item?.currentMonth !== undefined && calendar.item?.monthsShort[calendar.item.currentMonth]}
                        </span>
                        <span className="d-none d-md-inline-block">
                              {!!calendar.item?.months && calendar.item?.currentMonth !== undefined && calendar.item?.months[calendar.item.currentMonth]}
                        </span>
                        - {calendar.item?.currentYear}
                    </div>
                    <div className="ts-mat-button-group text-right">
                        <ButtonComponent color="primary"
                                         onClick={calendar.item?.getPrevMonth.bind(calendar.item)}>
                            Prev
                        </ButtonComponent>
                        <ButtonComponent color="primary"
                                         onClick={calendar.item?.getToday.bind(calendar.item)}>Today
                        </ButtonComponent>
                        <ButtonComponent color="primary"
                                         onClick={calendar.item?.getNextMonth.bind(calendar.item)}>Next
                        </ButtonComponent>
                    </div>

                </div>
                <div className="ts-calendar-weeks">
                    {calendar.item?.weekDays && calendar.item?.weekDays.map((dayName, index) => {
                        return (
                            <div className={"ts-week-name-item ts-week-day-" + index}>
                                <span className="d-block d-md-none">{calendar.item?.weekDaysMin[index]}</span>
                                <span
                                    className="d-none d-md-block d-lg-none">{calendar.item?.weekDaysShort[index]}</span>
                                <span className="d-none d-lg-block">{calendar.item?.weekDays[index]}</span>
                            </div>
                        )
                    })
                    }
                </div>
                {
                    calendar.item?.weekRows && calendar.item?.weekRows.map((week, index) => {
                        return (
                            <div key={'week-item-' + index} className="ts-calendar-dates">
                                {
                                    calendar.item?.dates[week] && (calendar.item?.dates[week] || []).map((day: any, dayIndex: number) => {
                                        return (
                                            <div key={'day-item-' + dayIndex}
                                                 className={`ts-day-item-wrapper ts-week-day-${dayIndex} ts-week-${week} ` + (!day ? ' ts-date-not-available' : '')}>
                                                {
                                                    !!day && <div
                                                        onClick={
                                                            () => {
                                                                if (calendar.item?.canSelect && !day?.is_disabled && !day?.is_not_available) {
                                                                    calendar.item?.daySelect(day?.date)
                                                                }
                                                            }
                                                        }
                                                        className={"ts-day-item " + (day?.is_today ? ' is_today' : '') + (day?.is_disabled ||
                                                            day?.is_not_available ? ' is_disabled' : '') +
                                                            (calendar.item && calendar.item.selectedDates.indexOf(day?.date) > -1 ? ' is_selected' : '') + (calendar.item?.canSelect ? ' cursor-pointer' : '')}>
                                                        <div className="ts-day-text">{day.day}</div>
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
                {/*    <div className="ts-calendar.item?-dates"*/}
                {/*         fxLayout*/}
                {/*         fxLayoutAlign="center"*/}
                {/*         fxLayoutGap="0px"*/}
                {/*    *ngFor="let week of calendar.item?.weekRows">*/}
                {/*    <div *ngFor="let day of calendar.item?.dates[week]; let i = index" fxFlex=""*/}
                {/*    className="ts-day-item-wrapper ts-week-day-{{i}} ts-week-{{week}}"*/}
                {/*    [className.ts-date-not-available]="!day">*/}
                {/*    <div *ngIf="day" className="ts-day-item" [className.cursor-pointer]="calendar.item?.canSelect"*/}
                {/*    [className.is_selected]="calendar.item?.selectedDates.indexOf(day?.date) > -1"*/}
                {/*    (click)="calendar.item?.canSelect && !day?.is_disabled && !day?.is_not_available &&*/}
                {/*    calendar.item?.daySelect(day?.date)"*/}
                {/*    (contextmenu)="!day?.is_disabled && !day?.is_not_available && calendar.item?.onContextMenu($event, day)"*/}
                {/*    [className.is_today]="day?.is_today" [className.is_disabled]="day?.is_disabled ||*/}
                {/*    day?.is_not_available">*/}
                {/*    <div className="ts-day-text">{{day.day}}</div>*/}
                {/*</div>*/}
                {/*</div>*/}
                {/*</div>*/}
            </div>
        }
        </>
    );
};

export default FullCalendarComponent;
