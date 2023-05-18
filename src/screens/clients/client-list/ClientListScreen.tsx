import "./ClientListScreen.scss";
import ClientListTableComponent from "../client-list-table/ClientListTableComponent";
import {useDispatch, useSelector} from "react-redux";
import {useCallback, useEffect, useState} from "react";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import SearchComponent from "../../../shared/components/search/SearchComponent";
import {IClientListFilterState} from "../../../shared/models/client.model";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../constants";
import SelectComponent from "../../../shared/components/form-controls/select/SelectComponent";
import {IRootReducerState} from "../../../store/reducers";
import DrawerComponent from "../../../shared/components/drawer/DrawerComponent";
import ClientAddComponent from "../client-compact-add/ClientAddComponent";
import {CommonService} from "../../../shared/services";

interface ClientListScreenProps {

}

const CLIENT_LIST_TABLE = "ClientListScreen";

const ClientListScreen = (props: ClientListScreenProps) => {

    const dispatch = useDispatch();
    const {statusList} = useSelector((store: IRootReducerState) => store.staticData);
    const [clientListFilterState, setClientListFilterState] = useState<IClientListFilterState>({
        search: "",
        is_active: undefined,
        sort: {}
    });
    const [isClientAddDrawerOpen, setIsClientAddDrawerOpen] = useState<boolean>(false);

    useEffect(() => {
        dispatch(setCurrentNavParams('Clients'));
    }, [dispatch]);

    const handleClientSort = useCallback((key: string, order: string) => {
        console.log(key, order);
        setClientListFilterState((oldState) => {
            const newState = {...oldState};
            newState["sort"] = {
                key,
                order
            }
            return newState;
        });
    }, []);

    const openClientAddDrawer = useCallback(() => {
        setIsClientAddDrawerOpen(true);
    }, []);

    const closeClientAddDrawer = useCallback(() => {
        setIsClientAddDrawerOpen(false);
    }, []);

    const handleClientAdd = useCallback(() => {
        CommonService._communications.TableWrapperRefreshSubject.next({
            moduleName: CLIENT_LIST_TABLE,
        });
        closeClientAddDrawer();
    }, [closeClientAddDrawer]);

    return (
        <div className={'client-list-screen list-screen'}>
            <div className={'list-screen-header'}>
                <div className={'list-search-filters'}>
                    <div className="ts-row">
                        <div className="ts-col-md-6 ts-col-lg-3">
                            <SearchComponent
                                label={"Search for clients"}
                                value={clientListFilterState.search}
                                onSearchChange={(value) => {
                                    setClientListFilterState({...clientListFilterState, search: value})
                                }}
                            />
                        </div>
                        <div className="ts-col-md-6 ts-col-lg-3">
                            <SelectComponent
                                label={"Status"}
                                size={"small"}
                                fullWidth={true}
                                options={statusList}
                                value={clientListFilterState.is_active}
                                keyExtractor={(item) => item.code}
                                onUpdate={(value) => {
                                    delete clientListFilterState.is_active;
                                    setClientListFilterState({...clientListFilterState, ...(value !== '' ? {is_active: value} : {})})
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="list-options">
                    <ButtonComponent id={'add_client_btn'} prefixIcon={<ImageConfig.AddIcon/>}
                                     onClick={openClientAddDrawer}>
                        Add Client
                    </ButtonComponent>
                </div>
            </div>
            <div className="list-content-wrapper">
                <ClientListTableComponent
                    clientListFilterState={clientListFilterState}
                    onSort={handleClientSort}
                    moduleName={CLIENT_LIST_TABLE}
                />
            </div>
            <DrawerComponent isOpen={isClientAddDrawerOpen}
                             showClose={true}
                             onClose={closeClientAddDrawer}>
                <ClientAddComponent onAdd={handleClientAdd}/>
            </DrawerComponent>
        </div>
    );

};

export default ClientListScreen;
