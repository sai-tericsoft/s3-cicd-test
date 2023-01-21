import "./SchedulingScreen.scss";
import {useDispatch, useSelector} from "react-redux";
import React, {useCallback, useEffect, useState} from "react";
import {setCurrentNavParams} from "../../store/actions/navigation.action";
import {useLocation} from "react-router-dom";
import {ITableColumn} from "../../shared/models/table.model";
import LinkComponent from "../../shared/components/link/LinkComponent";
import {CommonService} from "../../shared/services";
import ChipComponent from "../../shared/components/chip/ChipComponent";
import SearchComponent from "../../shared/components/search/SearchComponent";
import {APIConfig, ImageConfig} from "../../constants";
import TableWrapperComponent from "../../shared/components/table-wrapper/TableWrapperComponent";
import ButtonComponent from "../../shared/components/button/ButtonComponent";
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import moment from "moment/moment";
import SelectComponent from "../../shared/components/form-controls/select/SelectComponent";
import {IRootReducerState} from "../../store/reducers";
import {IUser} from "../../shared/models/user.model";
import IconButtonComponent from "../../shared/components/icon-button/IconButtonComponent";
import FullCalendarComponent from "../../shared/components/full-calendar/FullCalendarComponent";
import DrawerComponent from "../../shared/components/drawer/DrawerComponent";
import BookAppointmentComponent from "../../shared/components/book-appointment/BookAppointmentComponent";

interface SchedulingScreenProps {

}

const SchedulingListColumns: ITableColumn[] = [
    {
        title: "Time",
        key: "time",
        dataIndex: "time",
        width: 120,
        render: (_: any, item: any) => {
            return item?.time
        }
    },
    {
        title: "Client Name",
        key: "name",
        dataIndex: "client_name",
        sortable: true,
        width: 150,
        render: (_: any, item: any) => {
            return <span>{item?.last_name} {item?.first_name}</span>
        }
    },
    {
        title: "Phone",
        key: "primary_contact_info",
        dataIndex: "primary_contact_info",
        width: 150,
        render: (_: any, item: any) => {
            return <span>{item?.primary_contact_info?.phone}</span>
        }
    },
    {
        title: "Service",
        key: "service",
        dataIndex: "service",
        width: 150,
        render: (_: any, item: any) => {
            return <span>
                    {item?.service}
                </span>
        }
    },
    {
        title: "Provider",
        key: "provider",
        dataIndex: "provider",
        width: 140,
        render: (_: any, item: any) => {
            return <span>
                    {item?.provider}
                </span>
        }
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 90,
        render: (_: any, item: any) => {
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
        render: (_: any, item: any) => {
            if (item?._id) {
                //todo: change to new link
                return <LinkComponent route={CommonService._routeConfig.MedicalRecordList(item?._id)}>
                    View Details
                </LinkComponent>
            }
        }
    }
];

const SchedulingScreen = (props: SchedulingScreenProps) => {

    const dispatch = useDispatch();

    const {state} = useLocation();
    const {allProvidersList} = useSelector((state: IRootReducerState) => state.user);
    const {caseStatusList} = useSelector((state: IRootReducerState) => state.staticData);
    const [schedulingListFilterState, setSchedulingListFilterState] = useState<any>({
        search: "",
        filter: {},
        date: moment().format('YYYY-MM-DD'),
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
        (mode: 'increasing' | 'decreasing') => {
            setSchedulingListFilterState((old: any) => {
                const newDate = moment(old.date);
                if (mode === 'increasing') {
                    newDate.add(1, 'day');
                } else {
                    newDate.subtract(1, 'day');
                }
                return {...old, date: newDate.format('YYYY-MM-DD')}
            })
        },
        [],
    );

    const [isBookAppointmentOpen, setIsBookAppointmentOpen] = useState(false);

    return (
        <div className={'scheduling-list-component'}>
            <DrawerComponent isOpen={isBookAppointmentOpen} onClose={setIsBookAppointmentOpen.bind(null, false)}
                             showClose={true} title={'Book Appointment'} className={'book-appointment-component-drawer'}>
                <BookAppointmentComponent onClose={setIsBookAppointmentOpen.bind(null, false)}/>
            </DrawerComponent>
            <div className="scheduling-header-wrapper">
                <div className="scheduling-header-search-wrapper">
                    <SearchComponent size={'small'}
                                     className={'scheduling-list-input mrg-top-20'}
                                     label={'Search for Appointment'}
                                     value={schedulingListFilterState.search}
                                     onSearchChange={(value) => {
                                         setSchedulingListFilterState({...schedulingListFilterState, search: value})
                                     }}/>
                </div>
                <div className="scheduling-header-actions-wrapper">
                    <div className="scheduling-header-action-item">
                        <ToggleButtonGroup value={viewMode} color={"primary"} size={'small'}>
                            <ToggleButton value="calendar" onClick={setViewMode.bind(null, 'calendar')}
                                          color={viewMode === 'calendar' ? 'primary' : 'standard'} type={'button'}
                                          aria-label="calender view">
                                <ImageConfig.SchedulingIcon/>
                            </ToggleButton>
                            <ToggleButton value="list" type={'button'} onClick={setViewMode.bind(null, 'list')}
                                          color={viewMode === 'list' ? 'primary' : 'standard'}
                                          aria-label="list view">
                                <ImageConfig.ListIcon/>
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                    <div className="scheduling-header-action-item">
                        <ButtonComponent variant={'outlined'} prefixIcon={<ImageConfig.BlockIcon/>}>Block
                            Calender</ButtonComponent>
                    </div>
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
                                className="filter-header-date-text">{CommonService.convertDateFormat(schedulingListFilterState.date, 'DD MMMM, YYYY')}</div>
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
                                <SelectComponent size={'small'}
                                                 options={allProvidersList}
                                                 displayWith={(option: IUser) => (option?.first_name || option?.last_name) ? option?.first_name + " " + option?.last_name : "-"}
                                                 valueExtractor={(option: IUser) => option}
                                                 label={'Service Category'}
                                                 onUpdate={
                                                     (value) => {
                                                         setSchedulingListFilterState({
                                                             ...schedulingListFilterState,
                                                             filter: {
                                                                 ...schedulingListFilterState.filter,
                                                                 serviceCategory: value._id
                                                             }
                                                         })
                                                     }
                                                 }
                                                 fullWidth={true}
                                />
                            </div>
                            <div className="scheduling-filter-header-action-item">
                                <SelectComponent size={'small'}
                                                 options={allProvidersList}
                                                 displayWith={(option: IUser) => (option?.first_name || option?.last_name) ? option?.first_name + " " + option?.last_name : "-"}
                                                 valueExtractor={(option: IUser) => option}
                                                 label={'Service'}
                                                 onUpdate={
                                                     (value) => {
                                                         setSchedulingListFilterState({
                                                             ...schedulingListFilterState,
                                                             filter: {
                                                                 ...schedulingListFilterState.filter,
                                                                 service: value._id
                                                             }
                                                         })
                                                     }
                                                 }
                                                 fullWidth={true}
                                />
                            </div>
                            <div className="scheduling-filter-header-action-item">
                                <SelectComponent size={'small'}
                                                 options={allProvidersList}
                                                 displayWith={(option: IUser) => (option?.first_name || option?.last_name) ? option?.first_name + " " + option?.last_name : "-"}
                                                 valueExtractor={(option: IUser) => option}
                                                 label={'Provider'}
                                                 onUpdate={
                                                     (value) => {
                                                         setSchedulingListFilterState({
                                                             ...schedulingListFilterState,
                                                             filter: {
                                                                 ...schedulingListFilterState.filter,
                                                                 provider: value._id
                                                             }
                                                         })
                                                     }
                                                 }
                                                 fullWidth={true}
                                />
                            </div>
                            <div className="scheduling-filter-header-action-item">
                                <SelectComponent size={'small'}
                                                 options={allProvidersList}
                                                 displayWith={(option: IUser) => (option?.first_name || option?.last_name) ? option?.first_name + " " + option?.last_name : "-"}
                                                 valueExtractor={(option: IUser) => option}
                                                 label={'Status'}
                                                 onUpdate={
                                                     (value) => {
                                                         setSchedulingListFilterState({
                                                             ...schedulingListFilterState,
                                                             filter: {
                                                                 ...schedulingListFilterState.filter,
                                                                 status: value._id
                                                             }
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
                                                             filter: {
                                                                 ...schedulingListFilterState.filter,
                                                                 duration: value
                                                             }
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
                        scroll={"scroll"}
                        url={APIConfig.CLIENT_LIST.URL}
                        method={APIConfig.CLIENT_LIST.METHOD}
                        columns={SchedulingListColumns}
                        extraPayload={schedulingListFilterState}
                        onSort={handleSchedulingSort}
                    />}
                </div>
            }
        </div>
    );

};

export default SchedulingScreen;
