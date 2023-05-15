import {toast, ToastOptions, TypeOptions} from "react-toastify";
import {ToastPosition} from "react-toastify/dist/types";
import {AlertCloseButton} from "../components/alert/alertComponent";

const AlertPosition: ToastPosition = "top-right";

const showToast = (message: string, type: TypeOptions = 'info', options: ToastOptions = {}) => {

    const toastOptions: ToastOptions = {
        pauseOnFocusLoss: false,
        closeButton: AlertCloseButton,
        ...options,
    };

    switch (type) {
        case 'info':
            toast.info(message, toastOptions);
            break;
        case 'success':
            toast.success(message, toastOptions);
            break;
        case 'error':
            toast.error(message, toastOptions);
            break;
        case 'warning':
            toast.warning(message, toastOptions);
            break;
        default:
            toast.dark(message, toastOptions);
            break;
    }
}

const AlertService = {
    showToast,
    AlertPosition
}

export default AlertService;
