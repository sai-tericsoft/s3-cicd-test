import React, {useCallback, useEffect, useMemo, useState} from "react";
import "./BookAppointmentComponent.scss";
import ButtonComponent from "../button/ButtonComponent";
import {ImageConfig} from "../../../constants";
import {CommonService} from "../../services";
import {IAPIResponseType} from "../../models/api.model";
import LoaderComponent from "../loader/LoaderComponent";
import {RadioButtonComponent} from "../form-controls/radio-button/RadioButtonComponent";
import BookAppointmentFormComponent from "./book-appointment-form/BookAppointmentFormComponent";
import BookAppointmentOverviewComponent from "./book-appointment-overview/BookAppointmentOverviewComponent";
import BookAppointmentPaymentComponent from "./book-appointment-payment/BookAppointmentPaymentComponent";
import SearchComponent from "../search/SearchComponent";
import TableComponent from "../table/TableComponent";
import {ITableColumn} from "../../models/table.model";

interface BookAppointmentComponentProps {
    onClose?: () => void,
    onComplete?: () => void,
    preFillData?: any,
    selectedClient?: any,
    need_intervention?: boolean,
    isComingFromMedicalRecord?: boolean,
    repeatLastTreatment?: (interventionId: any, appointmentId: any) => void,
    addNewTreatment?: (interventionId: any, appointmentId: any) => void,
}

const BookAppointmentComponent = (props: BookAppointmentComponentProps) => {

    const {onClose,onComplete,isComingFromMedicalRecord, repeatLastTreatment, addNewTreatment, need_intervention, preFillData} = props;
    const [step, setStep] = useState<'client' | 'form' | 'overview' | 'payment' | 'confirmation'>(props.selectedClient ? 'form' : 'client');
    const [selectedClient, setSelectedClient] = useState<any | null>(props.selectedClient ? props.selectedClient : null);
    const [clientSearch, setClientSearch] = useState<string>('');
    const [clientList, setClientList] = useState<any[]>([]);
    const [isClientListLoading, setIsClientListLoading] = useState<boolean>(false);
    // const [isClientListLoaded, setIsClientListLoaded] = useState<boolean>(false);
    const [booking, setBooking] = useState<any | null>(null)
    const [bookingDraft, setBookingDraft] = useState<any | null>(null);
    const [interventionId, setInterventionId] = useState<any | null>(null);
    const [appointmentId, setAppointmentId] = useState<any | null>(null);
    const getClientList = useCallback((search: string) => {
        // if (search === '') {
        //     setClientList([]);
        //     return;
        // }
        const payload: any = {
            is_active: true,
            search: search
        };
        setIsClientListLoading(true);
        CommonService._client.GetClientList(payload)
            .then((response: IAPIResponseType<any>) => {
                setClientList(response.data.docs || []);
            })
            .catch((error: any) => {
                setClientList([]);
            })
            .finally(() => {
                setIsClientListLoading(false);
                // setIsClientListLoaded(true);
            })
    }, []);


    const onFormComplete = useCallback(
        (values: any) => {
            setBookingDraft(values);
            setStep('overview');
        },
        [],
    );
    const onOverviewComplete = useCallback((values: any) => {
        setBooking(values);
        setStep('payment');
    }, [],);

    const onPaymentComplete = useCallback((values: any) => {
        if (values?.appointment_id) {
            setAppointmentId(values?.appointment_id)
        }
        if (values?.intervention_id) {
            setInterventionId(values?.intervention_id)
        }
        setStep('confirmation');
    }, [],);

    const getClientListOnLoading = useCallback(() => {
        setIsClientListLoading(true);
        CommonService._client.GetClientList({is_active: true})
            .then((response: IAPIResponseType<any>) => {
                setClientList(response.data.docs || []);
            })
            .catch((error: any) => {
                setClientList([]);
            })
            .finally(() => {
                setIsClientListLoading(false);
                // setIsClientListLoaded(true);
            })
    }, []);

    useEffect(() => {
        getClientListOnLoading();
    }, [getClientListOnLoading])

    const clientListColumns: ITableColumn[] = useMemo<ITableColumn[]>(() => [
        {
            title: "Client Name",
            key: "name",
            dataIndex: "name",
            render: (item: any) => {
                return <RadioButtonComponent name={'selected-client'}
                                             value={item}
                                             label={<><span
                                                 className={item?.is_alias_name_set ? 'alias-name' : ''}>{`${CommonService.extractName(item)}`}</span> {`(ID: ${item.client_id || ''})`}</>}
                                             checked={selectedClient?._id === item?._id}
                                             onChange={(value: any) => {
                                                 setSelectedClient(value);
                                             }}/>
            }
        }
    ], [selectedClient]);

    return (
        <div className={`book-appointment-component`}>
            {
                step === 'client' && <>
                    <div className={'client-search-wrapper'}>
                        <div className="drawer-header">
                            <div className="back-btn"/>
                            <div className="drawer-close"
                                 id={'book-appointment-close-btn'}
                                 onClick={(event) => {
                                     if (onClose) {
                                         onClose();
                                     }
                                 }
                                 }><ImageConfig.CloseIcon/></div>
                        </div>
                        <div className="client-search-input">
                            <SearchComponent value={clientSearch}
                                             label={"Search"}
                                             placeholder={'Search using Client Name or Client ID'}
                                             onSearchChange={(value) => {
                                                 setClientSearch(value);
                                                 setSelectedClient(null)
                                                 getClientList(value);
                                             }}
                            />
                        </div>
                        <div className="client-search-body">
                            <div className="client-search-body-heading">Clients List</div>
                            {isClientListLoading && <LoaderComponent/>}
                            {/*{!isClientListLoading && !isClientListLoaded && clientList && clientList.length === 0 &&*/}
                            {/*    <div className={'text-center'}>*/}
                            {/*        <img src={ImageConfig.Search} alt={'search'}/>*/}
                            {/*    </div>}*/}
                            {/*{!isClientListLoading && isClientListLoaded && clientList && clientList.length === 0 &&*/}
                            {/*    <ErrorComponent errorText={'Client not found'}/>}*/}
                            {/*{!isClientListLoading && isClientListLoaded && clientList && clientList.length > 0 && <>*/}
                            <TableComponent data={clientList} columns={clientListColumns}
                                            loading={isClientListLoading}
                                            hideHeader={false}
                                            noDataText={'No clients available by the name/ID you have searched.'}
                                            onRowClick={(row: any) => {
                                                setSelectedClient(row);
                                            }}
                            />
                            {/*</>}*/}
                        </div>
                        <div className="client-search-btn">
                            <ButtonComponent disabled={!selectedClient} fullWidth={true}
                                             onClick={setStep.bind(null, 'form')}>Next</ButtonComponent>
                        </div>
                    </div>
                </>
            }
            {
                step === 'form' &&
                <BookAppointmentFormComponent preFillData={preFillData} client={selectedClient}
                                              shouldDisable={isComingFromMedicalRecord}
                                              onBack={() => {
                                                  setStep('client');
                                              }}
                                              onComplete={onFormComplete} onClose={onClose}
                                              need_intervention={need_intervention}
                />
            }
            {
                step === 'overview' && <>
                    <BookAppointmentOverviewComponent onBack={() => {
                        setStep('form');
                    }
                    } bookingDraft={bookingDraft} onClose={onClose}
                                                      onComplete={onOverviewComplete}/>
                </>
            }
            {
                step === 'payment' && <BookAppointmentPaymentComponent onBack={
                    () => {
                        setStep('overview');
                    }
                } booking={booking} onComplete={onPaymentComplete} onClose={onClose}
                                                                       need_intervention={need_intervention}
                />
            }
            {
                step === 'confirmation' && <div className={'booking-confirmation-wrapper'}>
                    <div className="drawer-header">
                        <div className="back-btn"/>
                        <div className="drawer-close"
                             id={'book-appointment-close-btn'}
                             onClick={(event) => {
                                 if (onComplete) {
                                     onComplete();
                                 }
                             }
                             }><ImageConfig.CloseIcon/></div>
                    </div>
                    <div className="booking-confirmation-status">
                        <div className="booking-confirmation-status-icon"
                             style={{backgroundImage: 'url(' + ImageConfig.AppointmentConfirm + ')'}}>
                            <ImageConfig.VerifiedCheck width={24}/>
                        </div>
                        <div className="booking-confirmation-status-text">Booking Confirmed!</div>
                    </div>
                    <div className="booking-confirmation-action">
                        {/*<ButtonComponent fullWidth={true}*/}
                        {/*                 onClick={*/}
                        {/*                     onComplete*/}
                        {/*                 }>Close</ButtonComponent>*/}
                        {
                            need_intervention && <>
                                <ButtonComponent
                                    className={'width-50'}
                                    onClick={() => {
                                        repeatLastTreatment && repeatLastTreatment(interventionId, appointmentId)
                                    }}
                                    variant={"outlined"}>
                                    Repeat Last Treatment
                                </ButtonComponent>
                                <ButtonComponent
                                    className={'width-50'}
                                    onClick={() => {
                                        addNewTreatment && addNewTreatment(interventionId, appointmentId)
                                    }}
                                    prefixIcon={<ImageConfig.AddIcon/>}>
                                    Add New Treatment
                                </ButtonComponent>
                            </>
                        }
                    </div>
                </div>
            }
        </div>
    );
};

export default BookAppointmentComponent;
