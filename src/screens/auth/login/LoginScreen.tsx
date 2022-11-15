import "./LoginScreen.scss";

interface LoginScreenProps {

}

const LoginScreen = (props: LoginScreenProps) => {

    return (
        <div className={'login-screen screen'}>
            <div>Welcome!</div>
            <div>Login to continue</div>
        </div>
    );

};

export default LoginScreen;