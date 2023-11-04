import "./ClientDocumentsComponent.scss";
import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {IClientDocumentsFilterState} from "../../../shared/models/client.model";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import moment from "moment";
import ClientDocumentsTableComponent from "../client-documents-table/ClientDocumentsTableComponent";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {CommonService} from "../../../shared/services";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import DateRangePickerComponentV2
    from "../../../shared/components/form-controls/date-range-pickerV2/DateRangePickerComponentV2";

const CLIENT_DOCUMENT_LIST_TABLE = "ClientListScreen";

interface ClientDocumentsComponentProps {

}

const ClientDocumentsComponent = (props: ClientDocumentsComponentProps) => {
    const dispatch = useDispatch();
    const {clientId} = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [clientDocumentListFilterState, setClientDocumentListFilterState] = useState<IClientDocumentsFilterState>({
        posted_by: "",
        date_range: [null, null],
        start_date: null,
        end_date: null,
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
        <div className={'client-document-list-screen'}>
            <div className="client-documents-header-wrapper">
                {/*<div className="ts-col-md-6 ts-col-lg-5">*/}
                {/*    <AutoCompleteComponent*/}
                {/*        size={'small'}*/}
                {/*        label={'Search '}*/}
                {/*        value={clientDocumentListFilterState?.posted_by}*/}
                {/*        placeholder={'Search using Posted by'}*/}
                {/*        dataListKey={'data'}*/}
                {/*        displayWith={item => item ? (item?.first_name + ' ' + item?.last_name) : ''}*/}
                {/*        keyExtractor={item => item?._id}*/}
                {/*        valueExtractor={item => item}*/}
                {/*        searchMode={'serverSide'}*/}
                {/*        url={APIConfig.USER_LIST_LITE.URL}*/}
                {/*        method={APIConfig.USER_LIST_LITE.METHOD}*/}
                {/*        fullWidth={true}*/}
                {/*        clearDefaultData={true}*/}
                {/*        freeSolo={true}*/}
                {/*        openOnFocus={true}*/}
                {/*        onUpdate={*/}
                {/*            (value) => {*/}
                {/*                setClientDocumentListFilterState({*/}
                {/*                    ...clientDocumentListFilterState,*/}
                {/*                    posted_by: value*/}
                {/*                })*/}
                {/*            }*/}
                {/*        }*/}
                {/*    />*/}
                {/*</div>*/}
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
                <div>
                    <ButtonComponent
                        prefixIcon={<RemoveRedEyeRoundedIcon/>}
                        onClick={() => {
                            clientId && navigate(CommonService._routeConfig.ClientSharedDocuments(clientId));
                        }}
                    >
                        View Shared Documents
                    </ButtonComponent>
                </div>
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

export default ClientDocumentsComponent;
