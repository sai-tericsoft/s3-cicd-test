import "./SystemLockComponent.scss";
import {useDispatch, useSelector} from "react-redux";
import {IRootReducerState} from "../../../store/reducers";
import {useCallback, useEffect, useState} from "react";
import {setSystemLocked} from "../../../store/actions/account.action";
import ModalComponent from "../modal/ModalComponent";
import moment from "moment";
import ButtonComponent from "../button/ButtonComponent";
import {ImageConfig, Misc} from "../../../constants";
import {CommonService} from "../../services";
import {useNavigate} from "react-router-dom";
import {IAPIResponseType} from "../../models/api.model";
import {ILoginResponse} from "../../models/account.model";
import {Field, FieldProps, Form, Formik} from "formik";
import FormikPasswordInputComponent from "../form-controls/formik-password-input/FormikPasswordInputComponent";
import * as Yup from "yup";
import LottieFileGenerationComponent from "../lottie-file-generation/LottieFileGenerationComponent";

const resumeSessionFormValidationSchema = Yup.object({
    password: Yup.string()
        .min(8, "Password must be 8 characters")
        .max(16, "Password must be max 16 characters")
        .required("Password is required")
});

interface SystemLockLockComponentProps {

}

const SystemLockComponent = (props: SystemLockLockComponentProps) => {

    const {
        account
    } = useSelector((state: IRootReducerState) => state);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<'prompt' | 'login'>('prompt');
    const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

    useEffect(() => {
        if (!account.isSystemLocked) {
            const interval = setInterval(() => {
                if (account?.currentUser && account?.lastActivityTime) {
                    if (moment().unix().toString() === (account?.lastActivityTime + (account?.currentUser?.auto_lock_minutes || 0) * 60).toString()) {
                        dispatch(setSystemLocked(true, 'auto'));
                        clearInterval(interval);
                    }
                }
            }, 1000);
            return () => {
                clearInterval(interval);
            }
        }
    }, [dispatch, account.lastActivityTime, account.isSystemLocked, account.currentUser]);

    const handleSessionExit = useCallback(() => {
        dispatch(setSystemLocked(false, 'auto'));
        CommonService._account.LogoutAPICall()
        .then((response:any)=>{
            navigate(CommonService._routeConfig.LoginRoute());

        })

        // dispatch(logout());
    }, [dispatch, navigate]);

    const handleSessionResume = useCallback((values: any) => {
        setIsLoggingIn(true);
        CommonService._account.ResumeSessionAPICall(values)
            .then((response: IAPIResponseType<ILoginResponse>) => {
                CommonService._alert.showToast(response[Misc.API_RESPONSE_MESSAGE_KEY], "success");
                dispatch(setSystemLocked(false, 'auto'));
                setIsLoggingIn(false);
            })
            .catch((error: any) => {
                CommonService._alert.showToast(error.error || "Error resuming session", "error");
                setIsLoggingIn(false);
            })
    }, [dispatch]);


    useEffect(() => {
        if (!account.isSystemLocked) {
            setCurrentStep('prompt');
            document.getElementById('root')?.classList.remove('system-locked');
        } else {
            document.getElementById('root')?.classList.add('system-locked');
        }
    }, [account.isSystemLocked]);

    return (
        <div className={'system-lock-component'}>
            <ModalComponent isOpen={(account.isSystemLocked === true && !!account.token)}
                            className={'system-lock-wrapper'}
                            closeOnBackDropClick={false}
                            closeOnEsc={false}>
                {
                    currentStep === "prompt" && <div className={"t-form"}>
                        <div className={"system-lock-icon"}>
                            <LottieFileGenerationComponent loop={true}
                                                           autoplay={true}
                                                           animationData={ImageConfig.LockLottie}/>
                        </div>
                        <div className={"system-lock-title"}>
                            {account.systemLockReason === 'auto' ? "You still there?" : "System Locked!"}
                        </div>
                        <div className={"system-lock-sub-title"}>
                            {account.systemLockReason === 'auto' ?
                                <span className={'text-center'}>To return to the application, <br/>  select the "Yes, I'm back" button.</span> :
                                <span> To continue using the application, <br/> Please enter your password.</span>}
                        </div>
                        <div className="t-form-actions mrg-bottom-0">
                            <ButtonComponent
                                variant={"outlined"}
                                className={"pdd-left-30 pdd-right-30"}
                                onClick={handleSessionExit}
                            >
                                Exit Session
                            </ButtonComponent>&nbsp;&nbsp;
                            <ButtonComponent
                                className={"pdd-left-30 pdd-right-30 mrg-left-25"}
                                onClick={() => {
                                    setCurrentStep("login");
                                }
                                }
                            >
                                {account.systemLockReason === 'auto' ? "Yes, I’m back" : "Enter Password"}
                            </ButtonComponent>
                        </div>
                    </div>
                }
                {
                    currentStep === "login" && <Formik
                        validationSchema={resumeSessionFormValidationSchema}
                        initialValues={{password: ""}}
                        validateOnChange={false}
                        validateOnBlur={true}
                        enableReinitialize={true}
                        validateOnMount={true}
                        onSubmit={handleSessionResume}
                    >
                        {({values, validateForm}) => {
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            useEffect(() => {
                                validateForm();
                            }, [validateForm, values]);
                            return (
                                <Form className="t-form" noValidate={true}>
                                    <div className={"system-lock-back-navigation"}
                                         onClick={() => {
                                             setCurrentStep('prompt');
                                         }}
                                    >
                                        <ImageConfig.NavigateBack/>&nbsp;Back
                                    </div>
                                    <div className={"system-lock-title"}>
                                        Welcome back!
                                    </div>
                                    <div className={"system-lock-sub-title"}>
                                        Enter your password to log in and access your account.
                                    </div>
                                    <div className={"system-lock-password-field"}>
                                        <Field name={'password'} className="t-form-control">
                                            {
                                                (field: FieldProps) => (
                                                    <FormikPasswordInputComponent
                                                        label={'Password'}
                                                        placeholder={'Enter Password'}
                                                        required={true}
                                                        formikField={field}
                                                        canToggle={true}
                                                        fullWidth={true}
                                                        id={"password_input"}
                                                    />
                                                )
                                            }
                                        </Field>
                                    </div>
                                    <div className="t-form-actions mrg-top-0 mrg-bottom-0">
                                        <ButtonComponent
                                            type={"submit"}
                                            // className={"pdd-left-30 pdd-right-30"}
                                            disabled={isLoggingIn}
                                            isLoading={isLoggingIn}
                                            size={"large"}
                                        >
                                            Proceed
                                        </ButtonComponent>
                                    </div>
                                </Form>
                            )
                        }
                        }
                    </Formik>
                }
            </ModalComponent>
        </div>
    );

};

export default SystemLockComponent;
