import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, Send } from 'lucide-react';
import { RichTextEditor } from '../../components/portal/RichTextEditor';
import { FileUploader } from '../../components/portal/FileUploader';
import { ROUTES } from '../../router/routes';

interface NewsFormData {
    title_vi: string;
    title_km: string;
    content_vi: string;
    content_km: string;
    excerpt_vi: string;
    excerpt_km: string;
    category_vi: string;
    category_km: string;
    thumbnail_url?: string;
    attachment_url?: string;
    attachment_name?: string;
    status: 'draft' | 'pending' | 'published';
}

export const NewsEditorPortal: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<NewsFormData>({
        title_vi: '',
        title_km: '',
        content_vi: '',
        content_km: '',
        excerpt_vi: '',
        excerpt_km: '',
        category_vi: 'Sự kiện', // Default
        category_km: 'ព្រឹត្តិការណ៍',
        status: 'draft',
    });

    useEffect(() => {
        if (isEditing) {
            // Mock fetch data
            setFormData({
                title_vi: 'Lễ Khai giảng năm học 2024',
                title_km: 'ពិធីបើកសាលាឆ្នាំសិក្សា២០២៤',
                content_vi: '<p>Nội dung mẫu...</p>',
                content_km: '<p>ខ្លឹមសារគំរូ...</p>',
                excerpt_vi: 'Tóm tắt mẫu...',
                excerpt_km: 'សេចក្តីសង្ខេបគំរូ...',
                category_vi: 'Sự kiện',
                category_km: 'ព្រឹត្តិការណ៍',
                status: 'published',
            });
        }
    }, [isEditing]);

    const handleChange = (field: keyof NewsFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Simulate API call
            console.log('Saving news:', formData);
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert(isEditing ? 'Đã cập nhật bài viết!' : 'Đã tạo bài viết mới!');
            navigate(ROUTES.PORTAL.CONTENT_NEWS);
        } catch (error) {
            console.error('Error saving news:', error);
            alert('Có lỗi xảy ra!');
        } finally {
            setLoading(false);
        }
    };

    // Helper to check if optional Khmer content is entered
    const hasKhmerContent = formData.title_km || formData.content_km;

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(ROUTES.PORTAL.CONTENT_NEWS)}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {isEditing ? 'Chỉnh sửa tin tức' : 'Tạo tin tức mới'}
                    </h1>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                {/* 1. Basic Info */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                    <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Thông tin chung</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Vietnamese Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tiêu đề (Tiếng Việt) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.title_vi}
                                onChange={(e) => handleChange('title_vi', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                placeholder="Nhập tiêu đề tiếng Việt..."
                            />
                        </div>

                        {/* Khmer Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 font-khmer">
                                ចំណងជើង (ភាសាខ្មែរ)
                            </label>
                            <input
                                type="text"
                                value={formData.title_km}
                                onChange={(e) => handleChange('title_km', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition font-khmer"
                                placeholder="បញ្ចូលចំណងជើងភាសាខ្មែរ..."
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Danh mục <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.category_vi}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    let kmValue = '';
                                    if (value === 'Sự kiện') kmValue = 'ព្រឹត្តិការណ៍';
                                    else if (value === 'Thông báo') kmValue = 'សេចក្តីជូនដំណឹង';
                                    else kmValue = 'ព័ត៌មានទូទៅ'; // General

                                    setFormData(prev => ({ ...prev, category_vi: value, category_km: kmValue }));
                                }}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="Sự kiện">Sự kiện</option>
                                <option value="Thông báo">Thông báo</option>
                                <option value="Tin tức">Tin tức</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 2. Content */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                    <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Nội dung chi tiết</h2>

                    {/* Tab/Switcher for Language could be added here, for now split view */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nội dung (Tiếng Việt) <span className="text-red-500">*</span>
                            </label>
                            <RichTextEditor
                                value={formData.content_vi}
                                onChange={(content) => handleChange('content_vi', content)}
                                language="vi"
                                height={300}
                                placeholder="Nhập nội dung bài viết..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 font-khmer">
                                ខ្លឹមសារ (ភាសាខ្មែរ)
                            </label>
                            <RichTextEditor
                                value={formData.content_km}
                                onChange={(content) => handleChange('content_km', content)}
                                language="km"
                                height={300}
                                placeholder="បញ្ចូលខ្លឹមសារអត្ថបទ..."
                            />
                        </div>
                    </div>
                </div>

                {/* 3. Attachments */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                    <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Tài liệu đính kèm</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Thumbnail */}
                        {/* (Thumbnail input logic here - keeping simple for now) */}
                    </div>

                    {/* Document Upload */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tệp đính kèm (PDF, Word, Excel)
                        </label>
                        <FileUploader
                            onUpload={(url, name) => {
                                handleChange('attachment_url', url);
                                handleChange('attachment_name', name);
                            }}
                            currentFile={
                                formData.attachment_url ?
                                    { url: formData.attachment_url, name: formData.attachment_name || 'document.pdf' } :
                                    undefined
                            }
                        />
                    </div>
                </div>

                {/* Validation Summary */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-2">Trạng thái hoàn thành</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className={`flex items-center ${formData.title_vi && formData.content_vi ? 'text-green-600' : 'text-red-600'}`}>
                            <span className="mr-2">{formData.title_vi && formData.content_vi ? '✓' : '✗'}</span>
                            Tiếng Việt (Bắt buộc)
                        </div>
                        <div className={`flex items-center ${hasKhmerContent ? 'text-green-600' : 'text-gray-400'}`}>
                            <span className="mr-2">{hasKhmerContent ? '✓' : '○'}</span>
                            ភាសាខ្មែរ (Tùy chọn)
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-6 bg-white p-4 rounded-xl shadow-sm sticky bottom-4 z-10">
                    <button
                        type="button"
                        onClick={() => navigate(ROUTES.PORTAL.CONTENT_NEWS)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                        <ArrowLeft size={20} />
                        Hủy bỏ
                    </button>
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={loading}
                            onClick={() => setFormData(prev => ({ ...prev, status: 'draft' }))}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 flex items-center gap-2"
                        >
                            <Save size={20} />
                            Lưu nháp
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            onClick={() => setFormData(prev => ({ ...prev, status: 'pending' }))}
                            className="px-4 py-2 bg-orange-700 text-white rounded-md hover:bg-orange-800 disabled:opacity-50 flex items-center gap-2"
                        >
                            <Send size={20} />
                            Gửi duyệt
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
