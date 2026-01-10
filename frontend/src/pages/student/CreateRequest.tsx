
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { approvalsApi, RequestType } from '../../api/approvals';
import { ROUTES } from '../../router/routes';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { showToast } from '../../lib/toast';

const CreateRequest: React.FC = () => {
    const navigate = useNavigate();
    const [types, setTypes] = useState<RequestType[]>([]);
    const [loading, setLoading] = useState(false); // For submitting

    const [formData, setFormData] = React.useState({
        type_id: '',
        title: '',
        reason: '',
        attachment: null as File | null
    });

    useEffect(() => {
        approvalsApi.getRequestTypes().then(res => setTypes(res.data)).catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.type_id || !formData.title || !formData.reason) {
            showToast.error('Vui lòng điền đầy đủ thông tin');
            return;
        }

        setLoading(true);

        // Create FormData object for file upload
        const data = new FormData();
        data.append('request_type', formData.type_id);
        data.append('title', formData.title);
        data.append('reason', formData.reason);
        if (formData.attachment) {
            data.append('attachment', formData.attachment);
        }

        try {
            await approvalsApi.createRequest(data);
            showToast.success('Gửi đơn thành công!');
            navigate(ROUTES.MY_REQUESTS);
        } catch (error: any) {
            console.error(error);
            showToast.error('Gửi đơn thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-4 h-16 flex items-center space-x-4">
                    <Link to={ROUTES.MY_REQUESTS} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-xl font-serif font-bold text-secondary">Tạo Đơn Mới</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Loại đơn <span className="text-red-500">*</span></label>
                            <select
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow bg-white"
                                value={formData.type_id}
                                onChange={e => setFormData({ ...formData, type_id: e.target.value })}
                                required
                            >
                                <option value="">-- Chọn loại đơn --</option>
                                {types.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                            {formData.type_id && (
                                <p className="mt-2 text-sm text-gray-500 italic bg-gray-50 p-2 rounded">
                                    {types.find(t => t.id === formData.type_id)?.description}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                                placeholder="Ví dụ: Xin nghỉ học ngày 20/01 do bệnh"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Lý do chi tiết <span className="text-red-500">*</span></label>
                            <textarea
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow min-h-[120px]"
                                placeholder="Trình bày rõ lý do..."
                                value={formData.reason}
                                onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tệp đính kèm (nếu có)</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors cursor-pointer relative">
                                <div className="space-y-1 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none">
                                            <span>Tải tệp lên</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="sr-only"
                                                onChange={e => setFormData({ ...formData, attachment: e.target.files?.[0] || null })}
                                            />
                                        </label>
                                        <p className="pl-1">hoặc kéo thả vào đây</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
                                    {formData.attachment && (
                                        <p className="text-sm font-bold text-green-600 mt-2">
                                            Đã chọn: {formData.attachment.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end space-x-4">
                            <Link
                                to={ROUTES.MY_REQUESTS}
                                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                            >
                                Hủy
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark shadow-sm disabled:opacity-70 flex items-center"
                            >
                                {loading ? 'Đang gửi...' : <><Save size={18} className="mr-2" /> Gửi Đơn</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateRequest;
