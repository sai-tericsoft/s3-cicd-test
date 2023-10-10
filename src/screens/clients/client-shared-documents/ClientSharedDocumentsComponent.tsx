import "./ClientSharedDocumentsComponent.scss";
import {useParams} from "react-router-dom";
import DateRangePickerComponent
    from "../../../shared/components/form-controls/date-range-picker/DateRangePickerComponent";
import moment from "moment/moment";
import React, {useState} from "react";
import {IClientDocumentsFilterState} from "../../../shared/models/client.model";
import ClientDocumentsTableComponent from "../client-documents-table/ClientDocumentsTableComponent";

const CLIENT_DOCUMENT_LIST_TABLE = "ClientListScreen";

interface ClientSharedDocumentsComponentProps {

}

const ClientSharedDocumentsComponent = (props: ClientSharedDocumentsComponentProps) => {
    const {clientId} = useParams();

    const [clientDocumentListFilterState, setClientDocumentListFilterState] = useState<IClientDocumentsFilterState>({
        posted_by: "",
        date_range: [null, null],
        is_shared: true,
        start_date: null,
        end_date: null,
    });


    return (
        <div className={'client-shared-documents'}>
            <div className="date-range-wrapper">
                <DateRangePickerComponent
                    label={"Select Date Range"}
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
