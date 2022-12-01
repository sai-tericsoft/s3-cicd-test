import "./ClientAddScreen.scss";
import ClientBasicDetailsFormComponent from "../client-basic-details-form/ClientBasicDetailsFormComponent";
import {useEffect} from "react";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {useDispatch} from "react-redux";

interface ClientAddScreenProps {

}

const ClientAddScreen = (props: ClientAddScreenProps) => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setCurrentNavParams('Add Client'));
    }, [dispatch]);

    return (
        <div className={'client-add-screen'}>
            <ClientBasicDetailsFormComponent mode={"add"}/>
        </div>
    );

};

export default ClientAddScreen;