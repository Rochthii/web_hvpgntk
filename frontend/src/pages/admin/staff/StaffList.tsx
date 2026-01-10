import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { showToast } from '../../../lib/toast';
import { cmsApi, StaffMember } from '../../../api/cms';

export const StaffList: React.FC = () => {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const res = await cmsApi.getStaffList();
            setStaff(Array.isArray(res.data) ? res.data : (res.data as any).results || []);
        } catch (error) {
            console.error(error);
            showToast.error("Lỗi tải danh sách nhân sự");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa nhân sự này?")) return;
        try {
            await cmsApi.deleteStaff(id);
            setStaff(staff.filter(s => s.id !== id));
            showToast.success("Đã xóa nhân sự");
        } catch (error) {
            showToast.error("Lỗi khi xóa nhân sự");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý Nhân Sự</h1>
                    <p className="text-gray-500 mt-1">Danh sách Ban lãnh đạo và Giảng viên</p>
                </div>
                <Link
                    to="/admin/staff/create"
                    className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    <span>Thêm nhân sự</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="py-4 px-6 font-medium text-gray-500 text-sm">Hình ảnh</th>
                            <th className="py-4 px-6 font-medium text-gray-500 text-sm">Họ và Tên</th>
                            <th className="py-4 px-6 font-medium text-gray-500 text-sm">Chức vụ</th>
                            <th className="py-4 px-6 font-medium text-gray-500 text-sm">Thứ tự</th>
                            <th className="py-4 px-6 font-medium text-gray-500 text-sm text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-gray-500">Đang tải...</td>
                            </tr>
                        ) : staff.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-gray-500">Chưa có nhân sự nào.</td>
                            </tr>
                        ) : (
                            staff.map((member) => (
                                <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 ring-2 ring-gray-50">
                                            {member.photo_url || member.image_url ? (
                                                <img
                                                    src={member.photo_url || member.image_url}
                                                    alt={member.display_name_vi}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <User size={20} />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="font-medium text-gray-900">{member.display_name_vi}</div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-600">
                                        {member.position}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-500">
                                        {member.display_order || 0}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                to={`/admin/staff/edit/${member.id}`}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Chỉnh sửa"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(member.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Xóa"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
