import {toast, ToastOptions, TypeOptions} from "react-toastify";
import {ToastPosition} from "react-toastify/dist/types";
// import {AlertCloseButton} from "../components/alert/alertComponent";

const AlertPosition: ToastPosition = "top-right";

const showToast = (message: string, type: TypeOptions = 'info', options: ToastOptions = {}) => {

    // const toastOptions: ToastOptions = {
    //     pauseOnFocusLoss: false,
    //     closeButton: AlertCloseButton,
    //     ...options,
    // };

    switch (type) {
        case 'info':
            toast.info(message, options);
            break;
        case 'success':
            toast.success(message, options);
            break;
        case 'error':
            toast.error(message, options);
            break;
        case 'warning':
            toast.warning(message, options);
            break;
        default:
            toast.dark(message, options);
            break;
    }
}

const AlertService = {
    showToast,
    AlertPosition
}

export default AlertService;
