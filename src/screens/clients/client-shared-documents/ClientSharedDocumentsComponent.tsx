import "./ClientSharedDocumentsComponent.scss";
import {useNavigate, useParams} from "react-router-dom";
import moment from "moment/moment";
import React, {useEffect, useState} from "react";
import {IClientDocumentsFilterState} from "../../../shared/models/client.model";
import ClientDocumentsTableComponent from "../client-documents-table/ClientDocumentsTableComponent";
import DateRangePickerComponentV2
    from "../../../shared/components/form-controls/date-range-pickerV2/DateRangePickerComponentV2";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {CommonService} from "../../../shared/services";
import {useDispatch} from "react-redux";

const CLIENT_DOCUMENT_LIST_TABLE = "ClientListScreen";

interface ClientSharedDocumentsComponentProps {

}

const ClientSharedDocumentsComponent = (props: ClientSharedDocumentsComponentProps) => {
    const {clientId} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [clientDocumentListFilterState, setClientDocumentListFilterState] = useState<IClientDocumentsFilterState>({
        posted_by: "",
        date_range: [null, null],
        is_shared: true,
        start_date: null,
        end_date: null,
    });

    useEffect(() => {
        dispatch(setCurrentNavParams("Client Details", null, () => {
            clientId && navigate(CommonService._routeConfig.ClientDocuments(clientId));
        }));
    }, [navigate, dispatch]);


    return (
        <div className={'client-shared-documents'}>
            <div className="date-range-wrapper">
                <DateRangePickerComponentV2
                    value={clientDocumentListFilterState.date_range}
                    onDateChange={(value: any) => {
                        if (value) {
                            setClientDocumentListFilterState({
                                ...clientDocumentListFilterState,
                                start_date: moment(value[0]).format('YYYY-MM-DD'),
                                end_date: moment(value[1]).format('YYYY-MM-DD'),
                                date_range: value
                            })
                        }
                    }}
                />
            </div>
            <>
                <ClientDocumentsTableComponent
                    clientId={clientId}
                    clientDocumentListFilterState={clientDocumentListFilterState}
                    moduleName={CLIENT_DOCUMENT_LIST_TABLE}
                />
            </>
        </div>
    );

};

export default ClientSharedDocumentsComponent;
