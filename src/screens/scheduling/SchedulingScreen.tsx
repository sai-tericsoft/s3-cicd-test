import "./SchedulingScreen.scss";
import {useDispatch, useSelector} from "react-redux";
import React, {useCallback, useEffect, useState} from "react";
import {setCurrentNavParams} from "../../store/actions/navigation.action";
import {ITableColumn} from "../../shared/models/table.model";
import {CommonService} from "../../shared/services";
import ChipComponent from "../../shared/components/chip/ChipComponent";
import SearchComponent from "../../shared/components/search/SearchComponent";
import {APIConfig, ImageConfig} from "../../constants";
import TableWrapperComponent from "../../shared/components/table-wrapper/TableWrapperComponent";
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

interface SchedulingScreenProps {

}


const SchedulingScreen = (props: SchedulingScreenProps) => {

    const dispatch = useDispatch();

    const SchedulingListColumns: ITableColumn[] = [
        {
            title: "Time",
            key: "time",
            dataIndex: "time",
            width: 120,
            render: (item: any) => {
                const hours = Math.floor(item?.start_time / 60);
                const minutes = item?.start_time % 60;
                return moment(hours + ':' + minutes, 'hh:mm').format('hh:mm A')
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
    const [viewMode] = useState<'list' | 'calendar'>('list');

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
        (mode: 'increasing' | 'decreasing') => {
            setSchedulingListFilterState((old: any) => {
                const newDate = moment(old.start_date);
                if (mode === 'increasing') {
                    newDate.add(1, 'day');
                } else {
                    newDate.subtract(1, 'day');
                }
                const start_date = newDate.format('YYYY-MM-DD');
                return {...old, start_date: start_date, end_date: start_date}
            })
        },
        [],
    );

    const [isBookAppointmentOpen, setIsBookAppointmentOpen] = useState(false);
    const [openedAppointmentDetails, setOpenedAppointmentDetails] = useState<any | null>(null);
    const [refreshToken, setRefreshToken] = useState('');

    return (
        <div className={'scheduling-list-component'}>
            <DrawerComponent isOpen={!!openedAppointmentDetails} onClose={setOpenedAppointmentDetails.bind(null, null)}
                             className={'book-appointment-component-drawer'}>

                <AppointmentDetailsComponent appointment_id={openedAppointmentDetails?._id} onComplete={
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

            <DrawerComponent isOpen={isBookAppointmentOpen} onClose={setIsBookAppointmentOpen.bind(null, false)}
                             className={'book-appointment-component-drawer'}>
                <BookAppointmentComponent onComplete={() => {
                    setRefreshToken(Math.random().toString());
                    setIsBookAppointmentOpen(false);
                }} onClose={
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
                    {/*<div className="scheduling-header-action-item">*/}
                    {/*    <ToggleButtonGroup value={viewMode} color={"primary"} size={'small'}>*/}
                    {/*        <ToggleButton value="calendar" onClick={setViewMode.bind(null, 'calendar')}*/}
                    {/*                      color={viewMode === 'calendar' ? 'primary' : 'standard'} type={'button'}*/}
                    {/*                      aria-label="calender view">*/}
                    {/*            <ImageConfig.SchedulingIcon/>*/}
                    {/*        </ToggleButton>*/}
                    {/*        <ToggleButton value="list" type={'button'} onClick={setViewMode.bind(null, 'list')}*/}
                    {/*                      color={viewMode === 'list' ? 'primary' : 'standard'}*/}
                    {/*                      aria-label="list view">*/}
                    {/*            <ImageConfig.ListIcon/>*/}
                    {/*        </ToggleButton>*/}
                    {/*    </ToggleButtonGroup>*/}
                    {/*</div>*/}
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
                <div className="list-content-wrapper">
                    <div className='scheduling-filter-header-wrapper'>
                        <div className="scheduling-filter-header-date-wrapper">
                            <div
                                className="filter-header-date-text">{CommonService.convertDateFormat(schedulingListFilterState.start_date, 'DD MMMM, YYYY')}</div>
                            <div className="filter-header-date-controls">
                                <div className="filter-header-date-control-item">
                                    <IconButtonComponent onClick={dateSwitcher.bind(null, 'decreasing')}>
                                        <ImageConfig.LeftArrow/>
                                    </IconButtonComponent>
                                </div>
                                <div className="filter-header-date-control-item">
                                    <IconButtonComponent onClick={dateSwitcher.bind(null, 'increasing')}>
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
                                                       url={APIConfig.SERVICE_CATEGORY_LIST_LITE.URL}
                                                       method={APIConfig.SERVICE_CATEGORY_LIST_LITE.METHOD}
                                                       fullWidth={true}
                                                       onUpdate={
                                                           (value) => {
                                                               setSchedulingListFilterState({
                                                                   ...schedulingListFilterState,
                                                                   category_id: value._id
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
                                                                   service_id: value._id
                                                               })
                                                           }
                                                       }
                                />
                            </div>
                            <div className="scheduling-filter-header-action-item">
                                <AutoCompleteComponent size={'small'}
                                                       label={'Provider'}
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
                                                                   provider_id: value._id
                                                               })
                                                           }
                                                       }
                                />
                                {/*<SelectComponent size={'small'}*/}
                                {/*                 options={allProvidersList}*/}
                                {/*                 displayWith={(option: IUser) => (option?.first_name || option?.last_name) ? option?.first_name + " " + option?.last_name : "-"}*/}
                                {/*                 valueExtractor={(option: IUser) => option}*/}
                                {/*                 label={'Provider'}*/}
                                {/*                 onUpdate={*/}
                                {/*                     (value) => {*/}
                                {/*                         setSchedulingListFilterState({*/}
                                {/*                             ...schedulingListFilterState,*/}
                                {/*                             provider: value._id*/}
                                {/*                         })*/}
                                {/*                     }*/}
                                {/*                 }*/}
                                {/*                 fullWidth={true}*/}
                                {/*/>*/}
                            </div>
                            <div className="scheduling-filter-header-action-item">
                                <SelectComponent size={'small'}
                                                 options={appointmentStatus || []}
                                                 displayWith={(option: any) => (option?.title || '')}
                                                 valueExtractor={(option: any) => option?.code}
                                                 label={'Status'}
                                                 onUpdate={
                                                     (value) => {
                                                         setSchedulingListFilterState({
                                                             ...schedulingListFilterState,
                                                             status: value
                                                         })
                                                     }
                                                 }
                                                 fullWidth={true}
                                />
                            </div>
                            {viewMode === 'calendar' && <div className="scheduling-filter-header-action-item">
                                <SelectComponent size={'small'}
                                                 options={[]}
                                                 label={'Duration'}
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
                    {viewMode === 'calendar' && <FullCalendarComponent/>}
                    {viewMode === 'list' && <TableWrapperComponent
                        id={"appointment_search"}
                        url={APIConfig.APPOINTMENT_LIST.URL}
                        method={APIConfig.APPOINTMENT_LIST.METHOD}
                        columns={SchedulingListColumns}
                        refreshToken={refreshToken}
                        extraPayload={schedulingListFilterState}
                        onSort={handleSchedulingSort}
                    />}
                </div>
            }
        </div>
    );

};

export default SchedulingScreen;
