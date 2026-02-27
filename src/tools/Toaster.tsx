import 'react-toastify/dist/ReactToastify.min.css';
import { toast, ToastContainer } from "react-toastify";

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

export const basicCatchToast = (error: any) => {
  console.error(error)
  toast.error('Something went wrong...')
};
