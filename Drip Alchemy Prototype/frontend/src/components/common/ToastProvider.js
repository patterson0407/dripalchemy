// src/components/common/ToastProvider.js
import React from 'react';
import { Toaster, toast } from 'react-hot-toast';

const ToastContext = React.createContext({
    notifySuccess: (message) => {},
    notifyError: (message) => {},
    notifyLoading: (message) => {},
    dismissToast: (id) => {},
});

export const useToasts = () => React.useContext(ToastContext);

const ToastProvider = ({ children }) => {
    const notifySuccess = (message) => toast.success(message);
    const notifyError = (message) => toast.error(message);
    const notifyLoading = (message) => toast.loading(message);
    const dismissToast = (id) => toast.dismiss(id);

    return (
        <ToastContext.Provider value={{ notifySuccess, notifyError, notifyLoading, dismissToast }}>
            {children}
            <Toaster
                position="bottom-right"
                reverseOrder={false}
                toastOptions={{
                    className: '',
                    duration: 4000,
                    style: {
                        background: '#333', // Dark background
                        color: '#fff',      // White text
                        border: '1px solid #555',
                        borderRadius: '8px'
                    },
                    success: { duration: 3000 },
                    error: { duration: 5000 },
                }}
            />
        </ToastContext.Provider>
    );
};

export default ToastProvider;