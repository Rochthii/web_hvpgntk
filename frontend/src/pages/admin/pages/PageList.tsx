import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Link as LinkIcon, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { showToast } from '../../../lib/toast';
import { cmsApi, Page } from '../../../api/cms';

export const PageList: React.FC = () => {
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const res = await cmsApi.getPages();
            setPages(Array.isArray(res.data) ? res.data : (res.data as any).results || []);
        } catch (error) {
            console.error(error);
            showToast.error("Lỗi tải danh sách trang");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa trang này?")) return;
        try {
            await cmsApi.deletePage(id);
            setPages(pages.filter(p => p.id !== id));
            showToast.success("Đã xóa trang thành công");
        } catch (error) {
            showToast.error("Lỗi khi xóa trang");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý Trang Tĩnh</h1>
                    <p className="text-gray-500 mt-1">Quản lý các trang giới thiệu, thông tin chung</p>
                </div>
                <Link
                    to="/admin/pages/create"
                    className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    <span>Tạo trang mới</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="py-4 px-6 font-medium text-gray-500 text-sm w-1/2">Tiêu đề</th>
                            <th className="py-4 px-6 font-medium text-gray-500 text-sm">Đường dẫn (Slug)</th>
                            <th className="py-4 px-6 font-medium text-gray-500 text-sm">Trạng thái</th>
                            <th className="py-4 px-6 font-medium text-gray-500 text-sm">Cập nhật cuối</th>
                            <th className="py-4 px-6 font-medium text-gray-500 text-sm text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-gray-500">Đang tải...</td>
                            </tr>
                        ) : pages.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-gray-500">Chưa có trang nào.</td>
                            </tr>
                        ) : (
                            pages.map((page) => (
                                <tr key={page.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="font-medium text-gray-900">{page.title_vi}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs font-mono">
                                            /{page.slug}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={cn(
                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                            page.status === 'published' ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                        )}>
                                            {page.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-500">
                                        {new Date(page.updated_at).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <a
                                                href={`/page/${page.slug}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                title="Xem trang"
                                            >
                                                <LinkIcon size={18} />
                                            </a>
                                            <Link
                                                to={`/admin/pages/edit/${page.id}`}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Chỉnh sửa"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(page.id)}
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
