import React, {useCallback, useState} from "react";
import "./BookAppointmentComponent.scss";
import ButtonComponent from "../button/ButtonComponent";
import {ImageConfig} from "../../../constants";
import {CommonService} from "../../services";
import {IAPIResponseType} from "../../models/api.model";
import LoaderComponent from "../loader/LoaderComponent";
import {RadioButtonComponent} from "../form-controls/radio-button/RadioButtonComponent";
import ErrorComponent from "../error/ErrorComponent";
import InputComponent from "../form-controls/input/InputComponent";
import BookAppointmentFormComponent from "./book-appointment-form/BookAppointmentFormComponent";

interface BookAppointmentComponentProps {
    onClose?: () => void
}

const BookAppointmentComponent = (props: BookAppointmentComponentProps) => {
    const {onClose} = props;
    const [step, setStep] = useState<'client' | 'form' | 'overview' | 'payment' | 'confirmation'>('client');
    const [selectedClient, setSelectedClient] = useState<any | null>(null);
    const [clientSearch, setClientSearch] = useState<string>('');
    const [clientList, setClientList] = useState<any[]>([]);
    const [isClientListLoading, setIsClientListLoading] = useState<boolean>(false);
    const [isClientListLoaded, setIsClientListLoaded] = useState<boolean>(false);
    const getClientList = useCallback(
        (search: string) => {
            // if (search === '') {
            //     setClientList([]);
            //     return;
            // }
            setIsClientListLoading(true);
            CommonService._client.GetClientList({search})
                .then((response: IAPIResponseType<any>) => {
                    setClientList(response.data.docs || []);
                })
                .catch((error: any) => {
                    setClientList([]);
                })
                .finally(() => {
                    setIsClientListLoading(false);
                    setIsClientListLoaded(true);
                })
        },
        [],
    );
    const onFormComplete = useCallback(
        () => {
            setStep('overview');
        },
        [],
    );


    return (
        <div className={`book-appointment-component`}>
            {
                step === 'client' && <div className={'client-search-wrapper'}>
                    <div className="client-search-input mrg-bottom-20">
                        <InputComponent value={clientSearch} fullWidth={true}
                                        placeholder={'Client Search'}
                                        suffix={<ImageConfig.SearchIcon/>}
                                        onChange={(value) => {
                                            console.log('search ', value);
                                            setClientSearch(value);
                                            setSelectedClient(null)
                                            getClientList(value);
                                        }}
                        />
                    </div>
                    <div className="client-search-body">
                        <div className="client-search-body-heading">Client List</div>
                        {isClientListLoading && <LoaderComponent/>}
                        {!isClientListLoading && isClientListLoaded && clientList && clientList.length === 0 &&
                            <ErrorComponent errorText={'Client not found'}/>}
                        {!isClientListLoading && isClientListLoaded && clientList && clientList.length > 0 && <>
                            <div className="client-search-list-wrapper">
                                {
                                    clientList.map((value, index) => {
                                        return (
                                            <div key={index}
                                                 className={'client-search-list-item'}
                                                 onClick={
                                                     () => {
                                                         setSelectedClient(value);
                                                     }
                                                 }>
                                                <div className="item-radio">
                                                    <RadioButtonComponent name={'client'} checked={selectedClient === value}
                                                                          id={'client-item-' + index} onChange={value1 => {
                                                        setSelectedClient(value);
                                                    }}/>
                                                </div>
                                                <div className="item-client-name">
                                                    {value.first_name + ' ' + value.last_name}
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </>}
                    </div>
                    <div className="client-search-btn">
                        <ButtonComponent disabled={!selectedClient} fullWidth={true}
                                         onClick={setStep.bind(null, 'form')}>Next</ButtonComponent>
                    </div>
                </div>
            }
            {
                step === 'form' &&
                <BookAppointmentFormComponent client={selectedClient} onComplete={onFormComplete} onClose={onClose}/>
            }
            {
                step === 'overview' && <div className={'book-appointment-overview'}>

                </div>
            }
            {
                step === 'payment' && <div>

                </div>
            }
            {
                step === 'confirmation' && <div className={'booking-confirmation-wrapper'}>
                    <div className="booking-confirmation-status">
                        <div className="booking-confirmation-status-icon"
                             style={{backgroundImage: 'url(' + ImageConfig.AppointmentConfirm + ')'}}>
                            <ImageConfig.VerifiedCheck width={24}/>
                        </div>
                        <div className="booking-confirmation-status-text">Booking Confirmed</div>
                    </div>
                    <div className="booking-confirmation-action">
                        <ButtonComponent fullWidth={true}
                                         onClick={onClose}>Close</ButtonComponent>
                    </div>
                </div>
            }
        </div>
    );
};

export default BookAppointmentComponent;
