
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { approvalsApi, StudentRequest } from '../../api/approvals';
import { ROUTES } from '../../router/routes';
import { ArrowLeft, Plus, FileText, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { showToast } from '../../lib/toast';
import { cn } from '../../lib/utils';

const MyRequests: React.FC = () => {
    const [requests, setRequests] = useState<StudentRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await approvalsApi.getMyRequests();
            setRequests(res.data);
        } catch (error) {
            console.error(error);
            showToast.error('Không thể tải danh sách đơn');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'text-green-600 bg-green-50 border-green-200';
            case 'REJECTED': return 'text-red-600 bg-red-50 border-red-200';
            case 'PENDING': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'CANCELLED': return 'text-gray-500 bg-gray-50 border-gray-200';
            default: return 'text-blue-600 bg-blue-50 border-blue-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'APPROVED': return <CheckCircle size={16} className="mr-1" />;
            case 'REJECTED': return <XCircle size={16} className="mr-1" />;
            case 'PENDING': return <Clock size={16} className="mr-1" />;
            case 'CANCELLED': return <AlertCircle size={16} className="mr-1" />;
            default: return <Clock size={16} className="mr-1" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link to={ROUTES.STUDENT_PORTAL} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-xl font-serif font-bold text-secondary">Đơn Từ Trực Tuyến</h1>
                    </div>

                    <Link
                        to={ROUTES.CREATE_REQUEST}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark shadow-sm"
                    >
                        <Plus size={18} />
                        <span className="hidden sm:inline">Tạo đơn mới</span>
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-700 mb-2">Chưa có đơn từ nào</h3>
                        <p className="text-gray-500 mb-6">Bạn chưa gửi yêu cầu nào lên nhà trường.</p>
                        <Link
                            to={ROUTES.CREATE_REQUEST}
                            className="inline-flex items-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-accent"
                        >
                            <Plus size={18} className="mr-2" /> Tạo đơn ngay
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {requests.map(req => (
                            <div key={req.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-5">
                                <div className="flex justify-between items-start mb-3">
                                    <span className={cn("text-xs font-bold px-2 py-1 rounded-full border flex items-center", getStatusColor(req.status))}>
                                        {getStatusIcon(req.status)}
                                        {req.status_display}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(req.created_at).toLocaleDateString()}
                                    </span>
                                </div>

                                <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-1" title={req.title}>
                                    {req.title}
                                </h3>
                                <p className="text-sm text-primary font-medium mb-3">{req.request_type_name}</p>

                                <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">
                                    {req.reason}
                                </p>

                                {req.admin_response && (
                                    <div className="bg-gray-50 p-3 rounded-lg text-sm mb-4 border border-gray-100">
                                        <span className="font-bold text-gray-700 block text-xs uppercase mb-1">Phản hồi:</span>
                                        <span className="text-gray-600 italic">"{req.admin_response}"</span>
                                    </div>
                                )}

                                <div className="flex justify-end pt-3 border-t border-gray-100">
                                    {req.status === 'PENDING' && (
                                        <button
                                            onClick={async () => {
                                                if (window.confirm('Hủy đơn này?')) {
                                                    await approvalsApi.cancelRequest(req.id);
                                                    fetchRequests();
                                                }
                                            }}
                                            className="text-xs text-red-500 hover:text-red-700 font-medium px-3 py-1.5 hover:bg-red-50 rounded"
                                        >
                                            Hủy đơn
                                        </button>
                                    )}
                                    <button className="text-xs text-secondary hover:text-secondary-accent font-medium px-3 py-1.5 hover:bg-gray-50 rounded ml-2">
                                        Xem chi tiết
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyRequests;
