import React, {useCallback, useEffect, useState} from "react";
import "./BookAppointmentComponent.scss";
import ButtonComponent from "../button/ButtonComponent";
import {APIConfig, ImageConfig} from "../../../constants";
import {CommonService} from "../../services";
import {IAPIResponseType} from "../../models/api.model";
import LoaderComponent from "../loader/LoaderComponent";
import {RadioButtonComponent} from "../form-controls/radio-button/RadioButtonComponent";
import ErrorComponent from "../error/ErrorComponent";
import InputComponent from "../form-controls/input/InputComponent";
import {Field, FieldProps, Form, Formik, FormikHelpers} from "formik";
import * as Yup from "yup";
import FormikAutoCompleteComponent from "../form-controls/formik-auto-complete/FormikAutoCompleteComponent";
import {IUser} from "../../models/user.model";
import FormikSelectComponent from "../form-controls/formik-select/FormikSelectComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";

interface BookAppointmentComponentProps {
    onClose?: () => void
}

const addAppointmentFormInitialValues: any = {
    client: "",
};

const APPOINTMENT_TYPES = [{label: 'Initial Consult', key: 'initial'}, {label: 'Follow Up', key: 'follow'}];
const DURATION_TYPES = [{label: '30 min', key: 30}, {label: '60 min', key: 60}];

const addAppointmentValidationSchema = Yup.object().shape({
    client: Yup.mixed().required("Client is required"),
});

const BookAppointmentComponent = (props: BookAppointmentComponentProps) => {
    const {onClose} = props;
    const {allProvidersList} = useSelector((state: IRootReducerState) => state.user);
    const {caseStatusList} = useSelector((state: IRootReducerState) => state.staticData);
    const [step, setStep] = useState<'client' | 'form' | 'overview' | 'payment' | 'confirmation'>('confirmation');
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

    // useEffect(() => {
    //     return () => {
    //         setSelectedClient(null)
    //         getClientList(clientSearch);
    //     };
    // }, [clientSearch, getClientList]);

    const onSubmitAppointment = useCallback((values: any, {setErrors}: FormikHelpers<any>) => {

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
                step === 'form' && <div className={'appointment-form-wrapper'}>
                    <Formik
                        validationSchema={addAppointmentValidationSchema}
                        initialValues={{...addAppointmentFormInitialValues, client: selectedClient}}
                        onSubmit={onSubmitAppointment}
                        validateOnChange={false}
                        validateOnBlur={true}
                        enableReinitialize={true}
                        validateOnMount={true}>
                        {
                            ({values, isValid, errors, setFieldValue, validateForm}) => {
                                // eslint-disable-next-line react-hooks/rules-of-hooks
                                useEffect(() => {
                                    validateForm();
                                }, [validateForm, values]);
                                return (
                                    <Form className="t-form" noValidate={true}>
                                        <div className={"t-appointment-drawer-form-controls"}>
                                            <Field name={'client'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikAutoCompleteComponent
                                                            label={'Search Client (Name or Phone Number)'}
                                                            placeholder={'Search Client (Name or Phone Number)'}
                                                            formikField={field}
                                                            displayWith={item => item ? item?.first_name + ' ' + item?.last_name : ''}
                                                            keyExtractor={item => item?._id}
                                                            valueExtractor={item => item}
                                                            searchMode={'serverSide'}
                                                            required={true}
                                                            url={APIConfig.CLIENT_LIST.URL}
                                                            method={APIConfig.CLIENT_LIST.METHOD}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>

                                            <Field name={'serviceCategory'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikSelectComponent
                                                            formikField={field}
                                                            required={true}
                                                            options={allProvidersList}
                                                            displayWith={(option: IUser) => (option?.first_name || option?.last_name) ? option?.first_name + " " + option?.last_name : "-"}
                                                            valueExtractor={(option: IUser) => option}
                                                            label={'Service Category'}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>

                                            <Field name={'service'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikSelectComponent
                                                            required={true}
                                                            formikField={field}
                                                            options={allProvidersList}
                                                            displayWith={(option: IUser) => (option?.first_name || option?.last_name) ? option?.first_name + " " + option?.last_name : "-"}
                                                            valueExtractor={(option: IUser) => option}
                                                            label={'Service'}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                            <Field name={'appointment_type'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikSelectComponent
                                                            formikField={field}
                                                            options={APPOINTMENT_TYPES}
                                                            required={true}
                                                            displayWith={(option: any) => (option.label)}
                                                            valueExtractor={(option: any) => option.key}
                                                            label={'Appointment Type'}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>
                                            <Field name={'duration'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikSelectComponent
                                                            formikField={field}
                                                            required={true}
                                                            options={DURATION_TYPES}
                                                            displayWith={(option: any) => (option.label)}
                                                            valueExtractor={(option: any) => option.key}
                                                            label={'Duration'}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>

                                            <Field name={'case'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikSelectComponent
                                                            formikField={field}
                                                            required={true}
                                                            options={allProvidersList}
                                                            displayWith={(option: IUser) => (option?.first_name || option?.last_name) ? option?.first_name + " " + option?.last_name : "-"}
                                                            valueExtractor={(option: IUser) => option}
                                                            label={'Case'}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>

                                            <Field name={'provider'}>
                                                {
                                                    (field: FieldProps) => (
                                                        <FormikSelectComponent
                                                            formikField={field}
                                                            required={true}
                                                            options={allProvidersList}
                                                            displayWith={(option: IUser) => (option?.first_name || option?.last_name) ? option?.first_name + " " + option?.last_name : "-"}
                                                            valueExtractor={(option: IUser) => option}
                                                            label={'Provider'}
                                                            fullWidth={true}
                                                        />
                                                    )
                                                }
                                            </Field>

                                            <div className="ts-row">

                                                <div className="ts-col">
                                                    <Field name={'date'}>
                                                        {
                                                            (field: FieldProps) => (
                                                                <FormikSelectComponent
                                                                    formikField={field}
                                                                    required={true}
                                                                    options={allProvidersList}
                                                                    displayWith={(option: IUser) => (option?.first_name || option?.last_name) ? option?.first_name + " " + option?.last_name : "-"}
                                                                    valueExtractor={(option: IUser) => option}
                                                                    label={'Date'}
                                                                    fullWidth={true}
                                                                />
                                                            )
                                                        }
                                                    </Field>
                                                </div>
                                                <div className="ts-col">
                                                    <Field name={'time'}>
                                                        {
                                                            (field: FieldProps) => (
                                                                <FormikSelectComponent
                                                                    formikField={field}
                                                                    required={true}
                                                                    options={allProvidersList}
                                                                    displayWith={(option: any) => (option?.first_name || option?.last_name) ? option?.first_name + " " + option?.last_name : "-"}
                                                                    valueExtractor={(option: any) => option}
                                                                    label={'Time'}
                                                                    fullWidth={true}
                                                                />
                                                            )
                                                        }
                                                    </Field>
                                                </div>
                                            </div>


                                        </div>
                                    </Form>)
                            }
                        }
                    </Formik>
                </div>
            }
            {
                step === 'overview' && <div>

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
