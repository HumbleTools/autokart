import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer } from "react-toastify";

export const Toaster = () => {
    return <ToastContainer 
    position="bottom-center"
    autoClose={3000}
    hideProgressBar
    newestOnTop
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable={false}
    theme={'colored'}
    pauseOnHover />;
};
