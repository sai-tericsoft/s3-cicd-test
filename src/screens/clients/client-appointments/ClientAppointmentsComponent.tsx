import "./ClientAppointmentsComponent.scss";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {IClientAppointmentsFilterState} from "../../../shared/models/client.model";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import ClientAppointmentsTableComponent from "../client-appointments-table/ClientAppointmentsTableComponent";
import {APIConfig} from "../../../constants";
import AutoCompleteComponent from "../../../shared/components/form-controls/auto-complete/AutoCompleteComponent";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import SelectComponent from "../../../shared/components/form-controls/select/SelectComponent";
import {IRootReducerState} from "../../../store/reducers";
import {CommonService} from "../../../shared/services";

const CLIENT_APPOINTMENTS_LIST_TABLE = "ClientListScreen";

interface ClientAppointmentsComponentProps {

}

const ClientAppointmentsComponent = (props: ClientAppointmentsComponentProps) => {
    const dispatch = useDispatch();
    const {clientId} = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const {appointmentStatus}: any = useSelector((store: IRootReducerState) => store.staticData);
    const [clientAppointmentListFilterState, setClientAppointmentListFilterState] = useState<IClientAppointmentsFilterState>({
        status: "",
        provider_id: "",
    });

    useEffect(() => {
        const referrer: any = searchParams.get("referrer");
        dispatch(setCurrentNavParams("Client Details", null, () => {
            if (referrer) {
                navigate(referrer);
            } else {
                navigate(CommonService._routeConfig.ClientList());
            }
        }));
    }, [searchParams, navigate, dispatch]);

    return (
        <div className={'client-appointments-list-screen'}>
            <div className="ts-row pdd-top-6">
                <div className="ts-col-md-6 ts-col-lg-3">
                    <AutoCompleteComponent
                        size={'small'}
                        label={'Search'}
                        placeholder={'Search using Provider'}
                        value={clientAppointmentListFilterState?.provider_id}
                        dataListKey={'data'}
                        displayWith={item => item ? item?.provider_name || (item?.first_name + ' ' + item?.last_name) : ''}
                        keyExtractor={item => item?.provider_id || item?._id}
                        valueExtractor={item => item}
                        searchMode={'serverSide'}
                        url={APIConfig.USER_LIST_LITE.URL}
                        method={APIConfig.USER_LIST_LITE.METHOD}
                        fullWidth={true}
                        extraPayload={{role: 'provider', is_active: true}}
                        clearDefaultData={true}
                        freeSolo={true}
                        openOnFocus={true}
                        onUpdate={
                            (value) => {
                                setClientAppointmentListFilterState({
                                    ...clientAppointmentListFilterState,
                                    provider_id: value
                                })
                            }
                        }
                    />
                </div>
                <div className="ts-col-md-6 ts-col-lg-3">
                    <SelectComponent
                        label={"Status"}
                        size={"small"}
                        fullWidth={true}
                        options={appointmentStatus}
                        displayWith={(item: any) => item?.admin_title}
                        value={clientAppointmentListFilterState?.status}
                        keyExtractor={(item: any) => item.code}
                        onUpdate={(value: any) => {
                            setClientAppointmentListFilterState(
                                {...clientAppointmentListFilterState, ...(value !== '' ? {status: value} : {})})
                        }}
                    />
                </div>

            </div>
            <div className="list-content-wrapper">
                <ClientAppointmentsTableComponent
                    clientId={clientId}
                    clientAppointmentListFilterState={clientAppointmentListFilterState}
                    moduleName={CLIENT_APPOINTMENTS_LIST_TABLE}
                />
            </div>
        </div>
    );

};

export default ClientAppointmentsComponent;
