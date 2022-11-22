import "./ServiceCategoriesListScreen.scss";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {setCurrentNavParams} from "../../../../store/actions/navigation.action";

interface ServiceCategoriesListScreenProps {

}

const ServiceCategoriesListScreen = (props: ServiceCategoriesListScreenProps) => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setCurrentNavParams("Admin"));
    }, [dispatch]);

    return (
        <div className={'ServiceCategoriesListScreen'}>
            <div>ServiceCategoriesListScreen</div>
        </div>
    );

};

export default ServiceCategoriesListScreen;