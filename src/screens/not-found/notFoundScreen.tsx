import React from 'react';
import { Link } from "react-router-dom";
import "./notFoundScreen.scss";

export interface NotFoundScreenProps {
    backUrl?: string
}

const NotFoundScreen = (props: NotFoundScreenProps) => {
    return (
        <div className="not-found-screen screen">
            <div className="not-found-wrapper">
                <h2>Oops. You are kind of lost it seems..!</h2>
                <Link to={'/'}>
                    {/*<ButtonComponent*/}
                    {/*    fullWidth={true}*/}
                    {/*>*/}
                    {/*    Go back to Home*/}
                    {/*</ButtonComponent>*/}
                </Link>
            </div>
        </div>

    )
};

export default NotFoundScreen;
