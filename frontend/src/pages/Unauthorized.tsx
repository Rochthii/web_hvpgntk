import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const Unauthorized: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-red-100 max-w-md w-full text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <ShieldAlert size={32} className="text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Truy Cập Bị Từ Chối</h1>
                <p className="text-gray-600 mb-8">
                    Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn nghĩ đây là một sự nhầm lẫn.
                </p>
                <div className="space-y-3">
                    <Link
                        to="/"
                        className="block w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                        Về Trang Chủ
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
