import "./ClientListScreen.scss";
import ClientListTableComponent from "../client-list-table/ClientListTableComponent";
import {useDispatch} from "react-redux";
import {useCallback, useEffect, useState} from "react";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import SearchComponent from "../../../shared/components/search/SearchComponent";
import {IClientListFilterState} from "../../../shared/models/client.model";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../constants";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import {CommonService} from "../../../shared/services";

interface ClientListScreenProps {

}


const ClientListScreen = (props: ClientListScreenProps) => {

    const dispatch = useDispatch();
    const [clientListFilterState, setClientListFilterState] = useState<IClientListFilterState>({
        search: "",
        sort: {}
    });

    useEffect(() => {
        dispatch(setCurrentNavParams('Clients'));
    }, [dispatch]);

    const handleClientSort = useCallback((key: string, order: string) => {
        setClientListFilterState((oldState) => {
            const newState = {...oldState};
            newState["sort"][key] = order;
            return newState;
        });
    }, []);

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
                    <LinkComponent route={CommonService._routeConfig.ClientAdd()}>
                        <ButtonComponent prefixIcon={<ImageConfig.AddIcon/>}>
                            Add Client
                        </ButtonComponent>
                    </LinkComponent>
                </div>
            </div>
            <div className="list-content-wrapper">
                <ClientListTableComponent
                    clientListFilterState={clientListFilterState}
                    onSort={handleClientSort}
                />
            </div>
        </div>
    );

};

export default ClientListScreen;