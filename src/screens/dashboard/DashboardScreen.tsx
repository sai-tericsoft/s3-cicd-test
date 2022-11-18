import "./DashboardScreen.scss";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {setCurrentNavParams} from "../../store/actions/navigation.action";

interface DashboardScreenProps {

}

const DashboardScreen = (props: DashboardScreenProps) => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setCurrentNavParams("Dashboard"));
    }, [dispatch]);

    return (
        <div className={'DashboardScreen'}>
            <div>DashboardScreen</div>
        </div>
    );

};

export default DashboardScreen;