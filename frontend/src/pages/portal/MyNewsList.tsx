import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
// import { cmsApi } from '../../services/api'; // Remove comment when API is ready

interface NewsItem {
    id: number;
    title_vi: string;
    title_km?: string;
    category_vi: string;
    status: 'draft' | 'pending' | 'approved' | 'published' | 'archived';
    created_at: string;
    views: number;
    author_id: number;
    course_name?: string; // Optional if sometimes present
}

export const MyNewsList: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [news, setNews] = useState<NewsItem[]>([]);
    const [filter, setFilter] = useState<'all' | 'draft' | 'published'>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyNews();
    }, []);

    const fetchMyNews = async () => {
        try {
            setLoading(true);
            // In real implementation: await cmsApi.getNews({ author: user.id })
            const mockData: NewsItem[] = [
                { id: 1, title_vi: 'Lễ Khai giảng năm học 2024', title_km: 'ពិធីបើកសាលាឆ្នាំសិក្សា២០២៤', category_vi: 'Sự kiện', status: 'published', created_at: '2024-01-15', views: 245, author_id: user?.id ? Number(user.id) : 1 },
                { id: 2, title_vi: 'Thông báo tuyển sinh Khóa 2025', category_vi: 'Thông báo', status: 'draft', created_at: '2024-01-14', views: 0, author_id: user?.id ? Number(user.id) : 1 },
                { id: 3, title_vi: 'Hoạt động từ thiện tháng 12', category_vi: 'Hoạt động', status: 'published', created_at: '2024-01-10', views: 128, author_id: user?.id ? Number(user.id) : 1 },
            ];
            setNews(mockData);
        } catch (error) {
            console.error('Failed to fetch news:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredNews = news.filter(item =>
        filter === 'all' || item.status === filter
    );

    const handleDelete = async (id: number) => {
        if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return;

        try {
            // await cmsApi.deleteNews(id);
            setNews(prev => prev.filter(item => item.id !== id));
            alert('Đã xóa bài viết!');
        } catch (error) {
            alert('Lỗi khi xóa bài viết!');
        }
    };

    if (loading) {
        return <div className="text-center py-10">Đang tải danh sách tin...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Tin tức của tôi</h2>
                    <p className="text-gray-500 text-sm">{filteredNews.length} bài viết</p>
                </div>
                <button
                    onClick={() => navigate('/portal/content/news/create')}
                    className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    <Plus size={20} />
                    <span>Tạo tin mới</span>
                </button>
            </div>

            {/* Filters */}
            <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg w-fit">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-md transition-colors ${filter === 'all' ? 'bg-white shadow-sm font-medium' : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    Tất cả ({news.length})
                </button>
                <button
                    onClick={() => setFilter('published')}
                    className={`px-4 py-2 rounded-md transition-colors ${filter === 'published' ? 'bg-white shadow-sm font-medium' : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    Đã đăng ({news.filter(n => n.status === 'published').length})
                </button>
                <button
                    onClick={() => setFilter('draft')}
                    className={`px-4 py-2 rounded-md transition-colors ${filter === 'draft' ? 'bg-white shadow-sm font-medium' : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    Nháp ({news.filter(n => n.status === 'draft').length})
                </button>
            </div>

            {/* News List */}
            <div className="space-y-4">
                {filteredNews.length > 0 ? (
                    filteredNews.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${item.status === 'published' ? 'bg-green-100 text-green-800' :
                                                    item.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                                                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            item.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                                                                'bg-gray-100 text-gray-600' // Draft
                                                }`}>
                                                {item.status === 'published' ? 'Đã xuất bản' :
                                                    item.status === 'approved' ? 'Đã duyệt' :
                                                        item.status === 'pending' ? 'Chờ duyệt' :
                                                            item.status === 'archived' ? 'Lưu trữ' :
                                                                'Bản nháp'}
                                            </span>
                                            {item.course_name && (
                                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                                    {item.course_name}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-2">
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-700 transition line-clamp-2">
                                            {item.title_vi}
                                        </h3>
                                        {item.title_km && (
                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium inline-block mt-1">🇰🇭 {item.title_km}</span>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <span className="font-medium text-blue-600">{item.category_vi}</span>
                                        <span>•</span>
                                        <span>{new Date(item.created_at).toLocaleDateString('vi-VN')}</span>
                                        <span>•</span>
                                        <span className="flex items-center">
                                            <Eye size={14} className="mr-1" />
                                            {item.views} lượt xem
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 ml-4">
                                    <button
                                        onClick={() => navigate(`/portal/content/news/edit/${item.id}`)}
                                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                        title="Chỉnh sửa"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                        title="Xóa"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-500">Chưa có bài viết nào</p>
                        <button
                            onClick={() => navigate('/portal/content/news/create')}
                            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Tạo bài viết đầu tiên →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
