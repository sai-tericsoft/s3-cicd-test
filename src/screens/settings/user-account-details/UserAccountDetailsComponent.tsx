import "./UserAccountDetailsComponent.scss";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import {CommonService} from "../../../shared/services";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../constants";
import React, {useEffect} from "react";
import CardComponent from "../../../shared/components/card/CardComponent";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {useLocation, useNavigate} from "react-router-dom";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";

interface UserAccountDetailsComponentProps {

}

const UserAccountDetailsComponent = (props: UserAccountDetailsComponentProps) => {

    const location: any = useLocation();
    const path = location.pathname;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        isUserBasicDetailsLoaded,
        userBasicDetails,
    } = useSelector((state: IRootReducerState) => state.user);

    useEffect(() => {
        if (path.includes('admin')) {
            dispatch(setCurrentNavParams('User List', null, () => {
                navigate(CommonService._routeConfig.UserList());
            }));
        }
    }, [dispatch, userBasicDetails, navigate, path]);

    return (
        <div className={'user-account-details-component'}>
            <div>
                {/*{*/}
                {/*    isUserBasicDetailsLoading && <div>*/}
                {/*        <LoaderComponent/>*/}
                {/*    </div>*/}
                {/*}*/}
                {/*{*/}
                {/*    isUserBasicDetailsLoadingFailed &&*/}
                {/*    <StatusCardComponent title={"Failed to fetch client Details"}/>*/}
                {/*}*/}
                {
                    (isUserBasicDetailsLoaded && userBasicDetails) && <>
                        <CardComponent title={'Password'} actions={<LinkComponent
                            route={path.includes('settings') ? CommonService._user.NavigateToSettingsAccountDetailsEdit(userBasicDetails._id, "reset_password") : CommonService._user.NavigateToUserAccountDetailsEdit(userBasicDetails._id, "reset_password")}>
                            <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>} size={"small"}>
                                Edit
                            </ButtonComponent>
                        </LinkComponent>}>
                            <DataLabelValueComponent label={'Password'}>
                                **********
                            </DataLabelValueComponent>

                        </CardComponent>
                        <CardComponent title={'Communication Preferences'} actions={<LinkComponent
                            route={path.includes('settings') ? CommonService._user.NavigateToSettingsAccountDetailsEdit(userBasicDetails._id, "communication_preferences") : CommonService._user.NavigateToUserAccountDetailsEdit(userBasicDetails._id, "communication_preferences")}>

                            <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>} size={"small"}>
                                Edit
                            </ButtonComponent>
                        </LinkComponent>}>
                            <DataLabelValueComponent label={'Appointment Reminders'}>
                                {userBasicDetails?.communication_preferences?.appointment_reminders}
                            </DataLabelValueComponent>

                        </CardComponent>
                    </>
                }
            </div>


        </div>
    );

};

export default UserAccountDetailsComponent;