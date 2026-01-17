import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../router/routes';
import { Shield, Lock, User } from 'lucide-react';

export const StaffLogin: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ login_id: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await authApi.login(credentials);
            const user = res.data.user;

            if (user.role === 'student' || user.role === 'teacher' || user.role === 'content') {
                setError('Giảng viên, Biên tập viên và Tăng sinh vui lòng đăng nhập tại Cổng Tăng Sinh.');
                setLoading(false);
                return;
            }

            login(res.data);

            // Redirect based on role
            switch (user.role) {
                case 'admin':
                case 'abbot':
                    navigate('/admin/dashboard');
                    break;
                default:
                    navigate('/admin');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.detail || 'Đăng nhập thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col md:flex-row">
                {/* Form Section */}
                <div className="w-full p-8 md:p-10">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4 text-red-600">
                            <Shield size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Cổng Quản Trị</h1>
                        <p className="text-gray-500 text-sm mt-1">Dành cho Ban Điều Hành & Giảng Viên</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center">
                                <Shield size={16} className="mr-2 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Tài khoản</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                    placeholder="Username / Email"
                                    value={credentials.login_id}
                                    onChange={e => setCredentials({ ...credentials, login_id: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Mật khẩu</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                    placeholder="••••••••"
                                    value={credentials.password}
                                    onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-black transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Đang xác thực...' : 'Đăng Nhập Quản Trị'}
                        </button>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-gray-100">
                        <a href="/" className="text-gray-400 hover:text-gray-600 text-sm">Quay về Trang chủ</a>
                    </div>
                </div>
            </div>
        </div>
    );
};
