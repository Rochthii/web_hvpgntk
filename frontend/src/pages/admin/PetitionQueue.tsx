import React, { useEffect, useState } from 'react';
import { approvalsApi, StudentRequest } from '../../api/approvals';
import { showToast } from '../../lib/toast';
import { CheckCircle, XCircle, Clock, Eye, Filter } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

export const PetitionQueue: React.FC = () => {
    const [requests, setRequests] = useState<StudentRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'processed'>('pending');

    useEffect(() => {
        // In real implementations, we would filter via API
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            // TODO: Implement getPendingRequests/getAllRequests API for admin
            // For now reusing getMyRequests (which returns student's own requests) 
            // BUT WE NEED ADMIN ENDPOINT. 
            // Using a temporary mock or needing to update approvals.ts and backend.
            // Let's assume we update backend to allow listing all requests for admin.

            // Temporary: Fetching from same endpoint but assuming backend handles permission to return ALL
            const res = await approvalsApi.getMyRequests();
            setRequests(res.data);
        } catch (error) {
            console.error(error);
            showToast.error("Không thể tải danh sách đơn");
        } finally {
            setLoading(false);
        }
    };

    const filteredRequests = requests.filter(r => {
        if (filter === 'pending') return r.status === 'PENDING' || r.status === 'REVIEWING';
        if (filter === 'processed') return ['APPROVED', 'REJECTED', 'CANCELLED'].includes(r.status);
        return true;
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Duyệt Đơn Từ & Yêu Cầu</h1>
                <div className="flex space-x-2 bg-white p-1 rounded-lg border border-gray-200">
                    <button
                        onClick={() => setFilter('pending')}
                        className={cn("px-3 py-1.5 text-sm font-medium rounded-md transition-colors", filter === 'pending' ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50")}
                    >
                        Chờ duyệt
                    </button>
                    <button
                        onClick={() => setFilter('processed')}
                        className={cn("px-3 py-1.5 text-sm font-medium rounded-md transition-colors", filter === 'processed' ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50")}
                    >
                        Đã xử lý
                    </button>
                    <button
                        onClick={() => setFilter('all')}
                        className={cn("px-3 py-1.5 text-sm font-medium rounded-md transition-colors", filter === 'all' ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50")}
                    >
                        Tất cả
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="py-4 px-6 font-medium text-gray-500 text-sm">Sinh viên</th>
                            <th className="py-4 px-6 font-medium text-gray-500 text-sm">Loại đơn</th>
                            <th className="py-4 px-6 font-medium text-gray-500 text-sm">Tiêu đề</th>
                            <th className="py-4 px-6 font-medium text-gray-500 text-sm">Ngày gửi</th>
                            <th className="py-4 px-6 font-medium text-gray-500 text-sm">Trạng thái</th>
                            <th className="py-4 px-6 font-medium text-gray-500 text-sm text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredRequests.map(req => (
                            <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-6 text-sm font-medium text-gray-900">
                                    {/* Mock student data if missing from API response */}
                                    ID: {req.id.substring(0, 4)}...
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-600">{req.request_type_name}</td>
                                <td className="py-4 px-6 text-sm text-gray-800 font-medium">{req.title}</td>
                                <td className="py-4 px-6 text-sm text-gray-500">{new Date(req.created_at).toLocaleDateString()}</td>
                                <td className="py-4 px-6">
                                    <span className={cn(
                                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                        req.status === 'APPROVED' ? "bg-green-100 text-green-800 border-green-200" :
                                            req.status === 'REJECTED' ? "bg-red-100 text-red-800 border-red-200" :
                                                req.status === 'PENDING' ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                                                    "bg-gray-100 text-gray-800 border-gray-200"
                                    )}>
                                        {req.status === 'APPROVED' && <CheckCircle size={10} className="mr-1" />}
                                        {req.status === 'REJECTED' && <XCircle size={10} className="mr-1" />}
                                        {req.status === 'PENDING' && <Clock size={10} className="mr-1" />}
                                        {req.status_display}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <button className="text-secondary hover:text-secondary-accent font-medium text-sm flex items-center justify-end ml-auto">
                                        <Eye size={16} className="mr-1" /> Xem
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredRequests.length === 0 && (
                    <div className="p-12 text-center text-gray-500">Chưa có dữ liệu</div>
                )}
            </div>
        </div>
    );
};
