import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { showToast } from '../../../lib/toast';
import { cmsApi } from '../../../api/cms';

export const StaffEditor: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [displayName, setDisplayName] = useState('');
    const [position, setPosition] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [displayOrder, setDisplayOrder] = useState('0');
    const [bio, setBio] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            setLoading(true);
            cmsApi.getStaffDetail(id).then(res => {
                const data = res.data;
                setDisplayName(data.display_name_vi);
                setPosition(data.position);
                setPhotoUrl(data.photo_url || data.image_url || '');
                setDisplayOrder(String(data.display_order || 0));
                setBio(data.bio_vi || '');
            }).catch(err => {
                showToast.error("Không tìm thấy nhân sự");
                navigate('/admin/staff');
            }).finally(() => setLoading(false));
        }
    }, [id, navigate]);

    const handleSave = async () => {
        if (!displayName) return showToast.error("Vui lòng nhập tên");

        const data = {
            display_name_vi: displayName,
            position,
            photo_url: photoUrl,
            image_url: photoUrl, // Compatibility
            display_order: parseInt(displayOrder) || 0,
            bio_vi: bio,
        };

        try {
            if (id) {
                await cmsApi.updateStaff(id, data);
            } else {
                await cmsApi.createStaff(data);
            }
            showToast.success(id ? "Cập nhật thành công" : "Thêm nhân sự thành công");
            navigate('/admin/staff');
        } catch (error) {
            console.error(error);
            showToast.error("Lỗi khi lưu thông tin");
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/staff')}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {id ? 'Chỉnh sửa Nhân Sự' : 'Thêm Nhân Sự Mới'}
                    </h1>
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-sm disabled:opacity-50"
                >
                    <Save size={20} />
                    <span>{id ? 'Cập nhật' : 'Thêm mới'}</span>
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="col-span-1 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Họ và Tên</label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                placeholder="VD: HT. Thích Minh Thanh"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Chức vụ</label>
                            <input
                                type="text"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                placeholder="VD: Hiệu trưởng"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Thứ tự hiển thị</label>
                            <input
                                type="number"
                                value={displayOrder}
                                onChange={(e) => setDisplayOrder(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* Photo Upload Mock */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh đại diện</label>
                        <div className="space-y-3">
                            <div className="aspect-[3/4] w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center relative group">
                                {photoUrl ? (
                                    <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon className="text-gray-400 w-12 h-12" />
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        onClick={() => {
                                            const url = window.prompt("URL Ảnh:");
                                            if (url) setPhotoUrl(url);
                                        }}
                                        className="bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-medium"
                                    >
                                        Thay đổi ảnh
                                    </button>
                                </div>
                            </div>
                            <input
                                type="text"
                                value={photoUrl}
                                onChange={(e) => setPhotoUrl(e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg text-gray-500"
                                placeholder="Hoặc dán URL ảnh tại đây"
                            />
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Giới thiệu ngắn (Bio)</label>
                        <textarea
                            rows={4}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                            placeholder="Mô tả ngắn về kinh nghiệm, tiểu sử..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
