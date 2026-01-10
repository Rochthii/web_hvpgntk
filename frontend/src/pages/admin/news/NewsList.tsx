import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { showToast } from '../../../lib/toast';
import { cmsApi, NewsItem } from '../../../api/cms';

export const NewsList: React.FC = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const res = await cmsApi.getNews();
            // Depending on DRF pagination, data might be in res.data.results or res.data
            // Assuming default list for now or pagination off in prev steps
            // We set pagination_class = None in view for simplicity initially
            setNews(Array.isArray(res.data) ? res.data : (res.data as any).results || []);
        } catch (error) {
            console.error(error);
            showToast.error("Lỗi tải danh sách tin tức");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản Lý Tin Tức</h1>
                    <p className="text-gray-500">Danh sách bài viết, thông báo và sự kiện</p>
                </div>
                <Link
                    to="/admin/news/create"
                    className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                >
                    <Plus size={20} />
                    <span>Viết bài mới</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="py-4 px-6 font-medium text-gray-500 text-sm w-1/2">Tiêu đề</th>
                            <th className="py-4 px-6 font-medium text-gray-500 text-sm">Danh mục</th>
                            <th className="py-4 px-6 font-medium text-gray-500 text-sm">Trạng thái</th>
                            <th className="py-4 px-6 font-medium text-gray-500 text-sm">Ngày đăng</th>
                            <th className="py-4 px-6 font-medium text-gray-500 text-sm text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={5} className="py-8 text-center text-gray-500">Đang tải...</td></tr>
                        ) : news.length === 0 ? (
                            <tr><td colSpan={5} className="py-8 text-center text-gray-500">Chưa có bài viết nào</td></tr>
                        ) : (
                            news.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <p className="font-medium text-gray-800 line-clamp-1">{item.title_vi}</p>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <span className="text-xs text-gray-400">/{item.slug}</span>
                                            <a href={`/news/${item.slug}`} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline flex items-center">
                                                <LinkIcon size={10} className="mr-0.5" /> Xem
                                            </a>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-600 capitalize">
                                        {item.category.replace('_', ' ')}
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={cn(
                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize",
                                            item.status === 'published' ? "bg-green-100 text-green-800 border-green-200" :
                                                "bg-gray-100 text-gray-800 border-gray-200"
                                        )}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-500">
                                        {item.published_at ? new Date(item.published_at).toLocaleDateString('vi-VN') : '-'}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Link to={`/admin/news/edit/${item.id}`} className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                                                <Edit size={18} />
                                            </Link>
                                            <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
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
