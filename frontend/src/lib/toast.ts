/**
 * Toast Notification Utilities
 * Wrapper around react-hot-toast for consistent notifications
 */
import toast from 'react-hot-toast';

export const showToast = {
    success: (message: string) => toast.success(message, {
        duration: 3000,
        position: 'top-right',
        style: {
            background: '#10B981',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
        },
    }),

    error: (message: string) => toast.error(message, {
        duration: 4000,
        position: 'top-right',
        style: {
            background: '#EF4444',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
        },
    }),

    loading: (message: string) => toast.loading(message, {
        position: 'top-right',
    }),

    dismiss: (toastId: string) => toast.dismiss(toastId),

    promise: <T,>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string;
            error: string;
        }
    ) => toast.promise(promise, messages, {
        position: 'top-right',
    }),
};
