import "./DateRangePickerComponent.scss";
import {TextField} from "@mui/material";
import {useState} from "react";

import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker, DateRange } from '@mui/x-date-pickers-pro/DateRangePicker';

interface DateRangePickerComponentProps {

}

// TODO

const DateRangePickerComponent = (props: DateRangePickerComponentProps) => {

    // const [calendarValue, setCalendarValue] = useState<DateRange<Date>>([null, null]);
    const [selectedDate, setSelectedDate] = useState<DateRange<Date>>([null, null]);
    // const [isOpenCalendar, setIsOpenCalendar] = useState<boolean>(false);

    // const toggleCalendar = useCallback(() => {
    //     console.log("toggleCalendar");
    //     setIsOpenCalendar(!isOpenCalendar);
    // }, [isOpenCalendar]);
    //
    //
    // const handleDateChange = useCallback((date: any) => {
    //
    // }, []);

    return (
        <div className={'date-range-picker-component mrg-top-20 mrg-bottom-20'}>
            {/*<Box position="relative">*/}
            {/*    <TextField value={calendarValue} onClick={toggleCalendar}/>*/}
            {/*    {true && (*/}
            {/*        <>*/}
            {/*            <StaticDateRangePicker*/}
            {/*                displayStaticWrapperAs="desktop"*/}
            {/*                // value={selectedDate}*/}
            {/*                onChange={(date: any) => handleDateChange(date)}*/}
            {/*            />*/}
            {/*            /!*<span className={classes.overlay} onClick={toggleCalendar}>*!/*/}
            {/*            /!*    &nbsp;*!/*/}
            {/*            /!*</span>*!/*/}
            {/*        </>*/}
            {/*    )}*/}
            {/*</Box>*/}
            <LocalizationProvider
                dateAdapter={AdapterDayjs}
                localeText={{ start: 'Check-in', end: 'Check-out' }}
            >
                <DateRangePicker
                    value={selectedDate}
                    onChange={(newValue) => {
                        setSelectedDate(newValue);
                    }}
                    // renderInput={(startProps, endProps) => (
                    //     <>
                    //         <TextField {...startProps} />
                    //         <Box sx={{ mx: 2 }}> to </Box>
                    //         <TextField {...endProps} />
                    //     </>
                    // )}
                    renderInput={({ inputProps, ...startProps }: any, endProps) => {
                        const startValue = inputProps.value;
                        delete inputProps.value
                        return (
                            <TextField
                                {...startProps}
                                inputProps={inputProps}
                                value={`${startValue}-${endProps.value}`}
                            />
                        )
                    }}
                />
            </LocalizationProvider>
        </div>
    );

};

export default DateRangePickerComponent;