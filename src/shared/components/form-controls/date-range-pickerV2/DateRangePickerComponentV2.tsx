import "./DateRangePickerComponent.scss";
import React, {useEffect, useState, useRef, useCallback} from 'react';
//@ts-ignore
import {DateRange} from 'react-date-range'
import format from 'date-fns/format'

import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import TextField from "@mui/material/TextField";
import {CloseOutlined} from "@mui/icons-material";
import IconButtonComponent from "../../icon-button/IconButtonComponent";
import {ImageConfig} from "../../../../constants";


interface DateRangePickerComponentProps {
    onDateChange?: (value: any) => void;
    value?: any;
}

const DateRangePickerComponentV2 = (props: DateRangePickerComponentProps) => {
    const {onDateChange, value} = props;
    const [range, setRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ])
    const [startDate, setStartDate] = useState<any>("MM-DD-YYYY")
    const [endDate, setEndDate] = useState<any>("MM-DD-YYYY")
    const [startDateSelected, setStartDateSelected] = useState<any>(null)
    // open close
    const [open, setOpen] = useState(false)
    // get the target element to toggle
    const refOne = useRef<any>(null)

    const handleCalender = useCallback((isOpen: boolean) => {
        setOpen(isOpen);
    }, [])

    const hideOnClickOutside =useCallback ((e: any) => {
        if (refOne.current && !refOne.current.contains(e.target)) {
            handleCalender(false)
        }
    },[handleCalender])

    const hideOnEscape = useCallback((e: any) => {
        if (e.key === "Escape") {
            handleCalender(false)
        }
    },[handleCalender])

    useEffect(() => {
        document.addEventListener("keydown", hideOnEscape, true)
        document.addEventListener("click", hideOnClickOutside, true)
    }, [hideOnClickOutside, hideOnEscape])

    const handleDateChange = (item: any) => {
        // Update the state with the selected range
        item.selection?.startDate !== item.selection?.endDate && !item.selection?.endDate && handleCalender(false);
        setStartDate(format(item.selection?.startDate, 'MM-dd-yyyy'));
        setEndDate(format(item.selection?.endDate, 'MM-dd-yyyy'));
        if (!startDateSelected) {
            setStartDateSelected(true);
        } else {
            setStartDateSelected(false);
            handleCalender(false);
        }
        (startDateSelected) && onDateChange && onDateChange([item.selection?.startDate, item.selection?.endDate]);
        setRange([item.selection]);
    };

    const handleClearDate = (e: any) => {
        e.stopPropagation();
        setOpen(false);
        setRange([
            {
                startDate: new Date(),
                endDate: new Date(),
                key: 'selection'
            }
        ])
        onDateChange && onDateChange(null);
        setStartDate("MM-DD-YYYY")
        setEndDate("MM-DD-YYYY")
    }

    useEffect(() => {
        if (value) {
            if (!value[0] || !value[1]) {
                setStartDate("MM-DD-YYYY")
                setEndDate("MM-DD-YYYY")
            } else {
                setStartDate(format(new Date(value[0]), 'MM-dd-yyyy'));
                setEndDate(format(new Date(value[1]), 'MM-dd-yyyy'));
                const tempRange = [{
                    startDate: new Date(value[0]),
                    endDate: new Date(value[1]),
                    key: 'selection'
                }
                ]
                setRange(tempRange);
                // onDateChange && onDateChange(tempRange);
            }
        }
    }, [value])

    return (
        <div
            className={`date-range-picker-component  ${(startDate !== "MM-DD-YYYY" && endDate !== "MM-DD-YYYY") ? "selected" : "not-selected"}`}>
            <div className={'text-field-wrapper'}>
                <TextField
                    value={startDate +"   to   " + endDate}
                    className="inputBox"
                    fullWidth={true}
                    size={"medium"}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            background: "#FAFAFA"
                        }
                    }
                    }
                    color={"secondary"}
                    placeholder={'MM-DD-YYYY  to  MM-DD-YYYY'}
                    onClick={() => setOpen(open => !open)}
                    InputProps={{
                        endAdornment: (
                            <React.Fragment>
                                {
                                    (startDate !== "MM-DD-YYYY" && endDate !== "MM-DD-YYYY") ?
                                    <IconButtonComponent
                                        className="calendarIcon"
                                        onClick={handleClearDate}
                                    >
                                        <CloseOutlined/>
                                    </IconButtonComponent> :
                                        <ImageConfig.EventIcon height={'20'} width={'20'}/>
                                }
                            </React.Fragment>
                        ),
                    }}

                />
            </div>
            <div ref={refOne} className={'date-range-calender'}>
                {open &&
                    <DateRange
                        onChange={handleDateChange} // Call the modified handler
                        editableDateInputs={false}
                        moveRangeOnFirstSelection={false}
                        ranges={range}
                        maxDate={new Date()}
                        months={1}
                        direction="horizontal"
                        className="calendarElement"
                    />
                }
            </div>
        </div>
    );

};

export default DateRangePickerComponentV2;
