import "./ClientListScreen.scss";
import ClientListTableComponent from "../client-list-table/ClientListTableComponent";
import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import SearchComponent from "../../../shared/components/search/SearchComponent";
import {IClientListFilterState} from "../../../shared/models/client.model";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../constants";

interface ClientListScreenProps {

}


const ClientListScreen = (props: ClientListScreenProps) => {

    const dispatch = useDispatch();
    const [clientListFilterState, setClientListFilterState] = useState<IClientListFilterState>({
        search: "",
        sort: {
            key: "",
            order: undefined
        }
    });

    useEffect(() => {
        dispatch(setCurrentNavParams('Clients'));
    }, [dispatch]);

    return (
        <div className={'client-list-screen list-screen'}>
            <div className={'list-screen-header'}>
                <div className={'list-search-filters'}>
                    <SearchComponent
                        label={"Search for clients"}
                        value={clientListFilterState.search}
                        onSearchChange={(value) => {
                            setClientListFilterState({...clientListFilterState, search: value})
                        }}
                    />
                </div>
                <div className="list-options">
                    <ButtonComponent prefixIcon={<ImageConfig.AddIcon/>}>
                        Add Client
                    </ButtonComponent>
                </div>
            </div>
            <div className="list-content-wrapper">
                <ClientListTableComponent
                    clientListFilterState={clientListFilterState}
                    onSort={(key, order) => {
                        setClientListFilterState({
                            ...clientListFilterState, sort: {
                                key,
                                order
                            }
                        })
                    }}
                />
            </div>
        </div>
    );

};

export default ClientListScreen;