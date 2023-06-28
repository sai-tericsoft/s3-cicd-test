import "./UserAccountDetailsEditComponent.scss";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate, useParams, useSearchParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {IRootReducerState} from "../../../store/reducers";
import {getUserBasicDetails} from "../../../store/actions/user.action";
import {setCurrentNavParams} from "../../../store/actions/navigation.action";
import {CommonService} from "../../../shared/services";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import CommunicationPreferencesEditComponent
    from "../communication-preferences-edit/CommunicationPreferencesEditComponent";
import UserPasswordChangeEditComponent from "../user-password-change-edit/UserPasswordChangeEditComponent";

interface UserAccountDetailsEditComponentProps {

}

const UserAccountDetailsEditComponent = (props: UserAccountDetailsEditComponentProps) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [currentStep, setCurrentStep] = useState<string>('');
    const location: any = useLocation();
    const path = location.pathname;
    const {userId} = useParams()

    const {
        isUserBasicDetailsLoaded,
        isUserBasicDetailsLoading,
        isUserBasicDetailsLoadingFailed,
        userBasicDetails,
    } = useSelector((state: IRootReducerState) => state.user);

    useEffect(() => {
        if (userId) {
            dispatch(getUserBasicDetails(userId));
        }
    }, [userId, dispatch])

    useEffect(() => {
        dispatch(setCurrentNavParams('Edit User', null, () => {
            if (path.includes('settings')) {
                navigate(CommonService._routeConfig.PersonalDetails());
            } else {
                navigate(CommonService._routeConfig.UserPersonalDetails() + '?userId=' + userBasicDetails?._id)
            }
        }));
    }, [dispatch, userBasicDetails, navigate, path]);

    useEffect(() => {
        let currentStep: any = searchParams.get("currentStep");
        setCurrentStep(currentStep);
    }, [searchParams]);

    return (
        <div className={'user-account-details-edit-component'}>
            <>
                {
                    isUserBasicDetailsLoading && <div>
                        <LoaderComponent/>
                    </div>
                }
                {
                    isUserBasicDetailsLoadingFailed &&
                    <StatusCardComponent title={"Failed to fetch client Details"}/>
                }
            </>
            {isUserBasicDetailsLoaded &&

            <>
                {currentStep === 'communication_preferences' &&
                <>
                    <CommunicationPreferencesEditComponent/>
                </>
                }

                {currentStep === 'reset_password' &&
                <>
                    <UserPasswordChangeEditComponent/>
                </>
                }
            </>
            }
        </div>
    );

};

export default UserAccountDetailsEditComponent;