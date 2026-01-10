import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full border border-red-200">
                        <h1 className="text-2xl font-bold text-red-800 mb-4">Đã xảy ra lỗi!</h1>
                        <p className="text-gray-600 mb-4">Rất tiếc, trang web gặp sự cố không mong muốn.</p>
                        <div className="bg-gray-100 p-4 rounded text-sm text-red-600 font-mono mb-6 overflow-auto max-h-48">
                            {this.state.error?.message}
                        </div>
                        <button
                            className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
                            onClick={() => window.location.assign('/')}
                        >
                            Quay lại Trang chủ
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
