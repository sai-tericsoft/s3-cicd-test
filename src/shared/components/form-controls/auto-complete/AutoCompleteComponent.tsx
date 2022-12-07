import './AutoCompleteComponent.scss';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Autocomplete, AutocompleteRenderOptionState, CircularProgress, FormHelperText, MenuItem} from "@mui/material";
import CommonService from "../../../services/common.service";
import {AXIOS_REQUEST_CANCELLED} from "../../../services/api.service";
import TextField from "@mui/material/TextField";
import {IAPIResponseType} from "../../../models/api.model";
import _ from "lodash";
import FormControl from '@mui/material/FormControl';
import {IAutoCompleteProps} from "../../../models/form-controls.model";

interface AutoCompleteDropdownComponentProps extends IAutoCompleteProps {
    hasError?: boolean;
    errorMessage?: any;
    value?: any;
}

const AutoCompleteDropdownComponent = (props: AutoCompleteDropdownComponentProps) => {

        const {
            freeSolo,
            label,
            value,
            hasError,
            required,
            errorMessage,
            onUpdate,
            disabled,
            id,
            options,
            url,
            extraPayload,
            readOnly,
            disableClearable,
            blurOnSelect,
            clearLocalListData
        } = props;

        let {
            color,
            placeholder,
            noDataMessage,
            searchMode,
            multiple,
            method,
            fullWidth,
            dataListKey,
            isDataLoading,
            isDataLoaded,
            isDataLoadingFailed,
            defaultData,
            size,
            openOnFocus,
            loadingText
        } = props;
        if (!placeholder) placeholder = label;
        if (!method) method = "get";
        if (!size) size = "medium";
        if (!searchMode) searchMode = "clientSide";
        if (!dataListKey) dataListKey = "data.docs";
        if (multiple === undefined) multiple = false;
        if (fullWidth === undefined) fullWidth = true;
        if (!noDataMessage) noDataMessage = "No Data";
        if (!loadingText) loadingText = "Searching...!";
        if (!defaultData) defaultData = [];
        if (!color) color = "secondary";
        if (!openOnFocus) openOnFocus = true;

        const [isDropDownDataLoading, setIsDropDownDataLoading] = useState(isDataLoading);
        const [isDropDownDataLoaded, setIsDropDownDataLoaded] = useState(isDataLoaded);
        const [isDropDownDataLoadingFailed, setIsDropDownDataLoadingFailed] = useState(isDataLoadingFailed);
        const [dropDownData, setDropDownData] = useState(options);
        const APICallSubscription = useRef<any>(null);
        const [openPopup, setOpenPopup] = useState<boolean>(false);
        const [formControlValue, setFormControlValue] = useState<any | undefined>(props.value || undefined);

        const defaultDisplayWith = useCallback((item: any) => item?.title || '', []);
        const defaultKeyExtractor = useCallback((item: any, index?: number) => item?._id || index, []);
        const defaultValueExtractor = useCallback((item: any) => item?.code || '', []);
        const displayWith = props.displayWith || defaultDisplayWith;
        const valueExtractor = props.valueExtractor || defaultValueExtractor;
        const keyExtractor = props.keyExtractor || defaultKeyExtractor;

        const defaultRenderOption = useCallback((props: React.HTMLAttributes<HTMLLIElement>,
                                                 option: any,
                                                 state: AutocompleteRenderOptionState,) => (<MenuItem
                // selected={state.selected}
                {...props}
                key={keyExtractor ? keyExtractor(option) : `drop-down-option-${option}`}
                value={valueExtractor(option)}>
                {/*<CheckBoxComponent*/}
                {/*    label={displayWith(option)}*/}
                {/*    checked={formControlValue.includes(valueExtractor(option))}*/}
                {/*/>*/}
                { option ? displayWith(option) : "" }
            </MenuItem>
        ), [displayWith, valueExtractor, keyExtractor]);

        const renderOption = props.renderOption || defaultRenderOption;

        useEffect(() => {
            if (clearLocalListData) {
                setDropDownData([...defaultData || []]);
            }
        }, [clearLocalListData, defaultData])


        const handleChange = useCallback((event: any, value: any) => {
            let tempValue = value || null;
            setFormControlValue(tempValue);
            if (onUpdate) {
                onUpdate(tempValue)
            }
        }, [onUpdate, setFormControlValue]);

        useEffect(() => {
            setIsDropDownDataLoading(isDataLoading);
        }, [isDataLoading]);

        useEffect(() => {
            setIsDropDownDataLoaded(isDataLoaded);
        }, [isDataLoaded]);

        useEffect(() => {
            setIsDropDownDataLoadingFailed(isDataLoadingFailed);
        }, [isDataLoadingFailed]);

        useEffect(() => {
            // setNoDataMsg(noDataMessage);
        }, [noDataMessage]);

        // useEffect(() => {
        //     let dropDownData: any[] = [...defaultData || []];
        //     if (defaultData && data) {
        //         dropDownData.unshift(...data);
        //     }
        //     setDropDownData(dropDownData);
        // }, [data, defaultData]);

        // useEffect(() => {
        //     let dropDownData: any[] = [...defaultData || []];
        //     if (data) {
        //         dropDownData.unshift(...data);
        //     }
        //     setDropDownData(dropDownData);
        // }, [data,defaultData]);

        useEffect(() => {
            if (searchMode === "serverSide") {
                if (dropDownData?.length === 0) {
                }
            }
        }, [searchMode, dropDownData]);

        useEffect(() => {
            setFormControlValue(value);
        }, [value]);

        const getDataList = useCallback((searchValue: string) => {
            if (!url) {
                console.warn("URL not provided to fetch dropdown list");
                return;
            }
            if (!method) {
                console.warn("METHOD not provided to fetch dropdown list");
                return;
            }
            const finalPayload = {...extraPayload, search: searchValue};
            const cancelTokenSource = CommonService.getCancelToken();
            let request;
            if (method === "get") {
                request = CommonService._api.get
            } else {
                request = CommonService._api.post
            }
            if (APICallSubscription && APICallSubscription.current) {
                APICallSubscription.current.cancel();
            }
            APICallSubscription.current = cancelTokenSource;
            setIsDropDownDataLoading(true);
            setIsDropDownDataLoaded(false);
            setIsDropDownDataLoadingFailed(false);
            let dropDownData: any[] = [...defaultData || []];
            request(url, finalPayload, {}, {cancelToken: cancelTokenSource.token})
                .then((response: IAPIResponseType<any>) => {
                    if (dataListKey && _.get(response, dataListKey)) {
                        dropDownData.unshift(..._.get(response, dataListKey));
                    }
                    setDropDownData(dropDownData);
                    setIsDropDownDataLoading(false);
                    setIsDropDownDataLoaded(true);
                    setIsDropDownDataLoadingFailed(false);
                })
                .catch((error: any) => {
                    if (error.reason !== AXIOS_REQUEST_CANCELLED) { // if previous request got cancelled do not close loading state
                        setDropDownData(dropDownData);
                        setIsDropDownDataLoading(false);
                        setIsDropDownDataLoaded(false);
                        setIsDropDownDataLoadingFailed(true);
                    }
                });
        }, [defaultData, url, dataListKey, method, extraPayload]);

        const handleInputChange = useCallback((event: any, value: any) => {
            if (value) {
                const sanitizedSearchValue = value.trim();
                if (!event || (sanitizedSearchValue?.length === 0 || event?.type === "click")) {
                    return;
                }
                if (sanitizedSearchValue.length === 0) {
                    if (openPopup) setOpenPopup(false);
                } else {
                    if (!openPopup) setOpenPopup(true);
                }
                if (searchMode === "serverSide") {
                    console.log("fetch API to get the data");
                    getDataList(sanitizedSearchValue);
                }
            }
        }, [getDataList, openPopup, searchMode]);

        // const filterOptions = createFilterOptions({
        //     // if(searchMode === "serverSide"){
        //     //     stringify: (option: any) => option;
        //     // }
        // });

        return (
            <FormControl className="autoComplete-component-wrapper"
                         fullWidth color={color}
                         error={hasError} id={id}>
                <Autocomplete
                    fullWidth={fullWidth}
                    open={openPopup}
                    onClose={() => setOpenPopup(false)}
                    noOptionsText={noDataMessage}
                    isOptionEqualToValue={useCallback((option: any, value: any) => {
                        return JSON.stringify(valueExtractor(option)) === JSON.stringify(value);
                    }, [valueExtractor])}
                    loadingText={loadingText}
                    options={dropDownData || []}
                    getOptionLabel={displayWith}
                    renderOption={renderOption}
                    renderInput={(params) => (
                        <TextField {...params}
                                   label={label}
                                   error={hasError}
                                   required={required}
                                   color={color}
                                   placeholder={placeholder}
                                   onClick={() => {
                                       if ((dropDownData && dropDownData.length > 0) && !disabled) {
                                           setOpenPopup(true);
                                       }
                                   }}
                                   InputProps={{
                                       ...params.InputProps,
                                       endAdornment: (
                                           <React.Fragment>
                                               {(isDropDownDataLoading && !isDropDownDataLoaded) ?
                                                   <CircularProgress color="inherit" size={20}/> : null}
                                               {params.InputProps.endAdornment}
                                           </React.Fragment>
                                       ),
                                   }}/>
                    )}
                    size={size}
                    value={formControlValue || ''}
                    freeSolo={freeSolo}
                    multiple={multiple}
                    disableClearable={disableClearable}
                    openOnFocus={openOnFocus}
                    disabled={disabled}
                    blurOnSelect={blurOnSelect}
                    readOnly={readOnly}
                    loading={isDropDownDataLoading}
                    onChange={handleChange}
                    onInputChange={handleInputChange}
                    onFocus={() => {
                        if (dropDownData && dropDownData.length > 0) {
                            setOpenPopup(true);
                        }
                    }}
                    filterOptions={searchMode === "serverSide" ? (x) => x : undefined}
                />
                <FormHelperText>
                    {hasError && <> {errorMessage} </>}
                    {isDropDownDataLoaded && dropDownData && !value && dropDownData.length === 0 && <> Data is empty </>}
                    {/*{isDropDownDataLoading && <> Data is loading </>}*/}
                    {isDropDownDataLoadingFailed && <> Data failed to load </>}
                </FormHelperText>
            </FormControl>
        )
    }

;

export default AutoCompleteDropdownComponent;



// ****************************** USAGE ****************************** //

// <AutoCompleteComponent
//     value={{fName: 'Mick', lName: 'John', id: 1}}
//     fullWidth={true}
//     displayWith={item => item ? ( item.fName || "") + " " + ( item.lName || "") : ""}
//     valueExtractor={item => item.id}
//     keyExtractor={item => item.id}
//     label={"Reporting Manager"}
//     options={[{fName: 'Mick', lName: 'John', id: 1}, {fName: 'John', lName: 'Doe', id: 2}]}/>

// ****************************** USAGE ****************************** //
