import "./UserAccountDetailsComponent.scss";
import LinkComponent from "../../../shared/components/link/LinkComponent";
import {CommonService} from "../../../shared/services";
import ButtonComponent from "../../../shared/components/button/ButtonComponent";
import {ImageConfig} from "../../../constants";
import React from "react";
import CardComponent from "../../../shared/components/card/CardComponent";
import DataLabelValueComponent from "../../../shared/components/data-label-value/DataLabelValueComponent";
import LoaderComponent from "../../../shared/components/loader/LoaderComponent";
import StatusCardComponent from "../../../shared/components/status-card/StatusCardComponent";
import {useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {useLocation} from "react-router-dom";

interface UserAccountDetailsComponentProps {

}

const UserAccountDetailsComponent = (props: UserAccountDetailsComponentProps) => {

    const location: any = useLocation();
    const path = location.pathname;
    const {
        isUserBasicDetailsLoaded,
        isUserBasicDetailsLoading,
        isUserBasicDetailsLoadingFailed,
        userBasicDetails,
    } = useSelector((state: IRootReducerState) => state.user);
    
    console.log('userBasicDetails',userBasicDetails);


    return (
        <div className={'user-account-details-component'}>
            <div>
                {
                    isUserBasicDetailsLoading && <div>
                        <LoaderComponent/>
                    </div>
                }
                {
                    isUserBasicDetailsLoadingFailed &&
                    <StatusCardComponent title={"Failed to fetch client Details"}/>
                }
                {
                    (isUserBasicDetailsLoaded && userBasicDetails) && <>
                        <CardComponent title={'Password'} actions={<LinkComponent
                            route={''}>
                            <ButtonComponent prefixIcon={<ImageConfig.EditIcon/>} size={"small"}>
                                Edit
                            </ButtonComponent>
                        </LinkComponent>}>
                            <DataLabelValueComponent label={'Password'}>
                                **********
                            </DataLabelValueComponent>

                        </CardComponent>
                        <CardComponent title={'Communication Preferences'} actions={<LinkComponent
                            route={path === '/settings/account-details' ? CommonService._user.NavigateToAccountDetailsEdit(userBasicDetails._id, "communication_preferences") : '' }>
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