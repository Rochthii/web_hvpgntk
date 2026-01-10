import React, { useEffect, useState } from 'react';
import { Save, Globe, Phone, Mail, MapPin, Facebook, Youtube } from 'lucide-react';
import { showToast } from '../../../lib/toast';
import { cmsApi, SiteSettings } from '../../../api/cms';

export const SiteSettingsPage: React.FC = () => {
    const [settings, setSettings] = useState<Partial<SiteSettings>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await cmsApi.getSettings();
            setSettings(res.data);
        } catch (error) {
            console.error(error);
            showToast.error("Lỗi tải cấu hình");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await cmsApi.updateSettings(settings);
            showToast.success("Đã lưu cấu hình");
        } catch (error) {
            console.error(error);
            showToast.error("Lỗi lưu cấu hình");
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (key: keyof SiteSettings, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Đang tải cấu hình...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Cấu hình Hệ thống</h1>
                    <p className="text-gray-500 mt-1">Thông tin chung, liên hệ và mạng xã hội</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-sm disabled:opacity-50"
                >
                    <Save size={20} />
                    <span>{saving ? 'Đang lưu...' : 'Lưu cấu hình'}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* General Info */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4 md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                        <Globe size={18} /> Thông tin chung
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên Website (VI)</label>
                            <input
                                type="text"
                                value={settings.site_name_vi || ''}
                                onChange={e => handleChange('site_name_vi', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Khẩu hiệu (VI)</label>
                            <input
                                type="text"
                                value={settings.site_slogan_vi || ''}
                                onChange={e => handleChange('site_slogan_vi', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên Website (KM)</label>
                            <input
                                type="text"
                                value={settings.site_name_km || ''}
                                onChange={e => handleChange('site_name_km', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 font-khmer"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Khẩu hiệu (KM)</label>
                            <input
                                type="text"
                                value={settings.site_slogan_km || ''}
                                onChange={e => handleChange('site_slogan_km', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 font-khmer"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                        <Phone size={18} /> Liên hệ
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                <input
                                    type="email"
                                    value={settings.contact_email || ''}
                                    onChange={e => handleChange('contact_email', e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    value={settings.contact_phone || ''}
                                    onChange={e => handleChange('contact_phone', e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    value={settings.contact_address || ''}
                                    onChange={e => handleChange('contact_address', e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                        Mạng xã hội
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                            <div className="relative">
                                <Facebook className="absolute left-3 top-2.5 text-blue-600" size={16} />
                                <input
                                    type="text"
                                    value={settings.facebook_url || ''}
                                    onChange={e => handleChange('facebook_url', e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Youtube URL</label>
                            <div className="relative">
                                <Youtube className="absolute left-3 top-2.5 text-red-600" size={16} />
                                <input
                                    type="text"
                                    value={settings.youtube_url || ''}
                                    onChange={e => handleChange('youtube_url', e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Assets */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4 md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Hình ảnh & Logo</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                            <input
                                type="text"
                                value={settings.logo_url || ''}
                                onChange={e => handleChange('logo_url', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Favicon URL</label>
                            <input
                                type="text"
                                value={settings.favicon_url || ''}
                                onChange={e => handleChange('favicon_url', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
