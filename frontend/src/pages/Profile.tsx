import React from 'react';
import { useAuth } from '../contexts/AuthContext';
// import { User, Book, Key } from 'lucide-react'; // Removing to avoid potential icon errors if unused

const Profile: React.FC = () => {
    const { user, logout } = useAuth();
    // const [isEditing, setIsEditing] = useState(false); // Can implement edit later

    if (!user) return <div className="p-8 text-center">Vui lòng đăng nhập</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-[#6B2C2C] h-32 relative">
                        <div className="absolute -bottom-16 left-8">
                            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-4xl overflow-hidden">
                                {user.avatar_url ? (
                                    <img src={user.avatar_url} alt={user.display_name} className="w-full h-full object-cover" />
                                ) : (
                                    <span>👤</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 px-8 pb-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-3xl font-serif font-bold text-gray-800">{user.display_name}</h1>
                                <p className="text-gray-500">{user.email}</p>
                                <span className="inline-block mt-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wide">
                                    {user.role}
                                </span>
                            </div>
                            <button
                                onClick={logout}
                                className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-bold"
                            >
                                Đăng xuất
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-8">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-[#DAA520] pl-3">Thông tin cá nhân</h3>
                                <dl className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <dt className="text-gray-500">Pháp danh:</dt>
                                        <dd className="font-medium text-gray-900">{user.monk_profile?.dharma_name_khmer || 'N/A'}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-gray-500">Hạ lạp:</dt>
                                        <dd className="font-medium text-gray-900">{user.monk_profile?.vassa_count || 0} hạ</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-gray-500">Chùa hiện tại:</dt>
                                        <dd className="font-medium text-gray-900">{user.monk_profile?.current_temple || 'Chưa cập nhật'}</dd>
                                    </div>
                                </dl>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-[#DAA520] pl-3">Thông tin tài khoản</h3>
                                <dl className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <dt className="text-gray-500">Ngày tham gia:</dt>
                                        <dd className="font-medium text-gray-900">{new Date().toLocaleDateString('vi-VN')}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-gray-500">Trạng thái:</dt>
                                        <dd className="font-medium text-green-600">Đang hoạt động</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        {/* Additional Info Section */}
                        <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                            <p className="text-sm text-yellow-800 text-center italic">
                                "Tâm dẫn đầu các pháp, tâm là chủ, tâm tạo tác..." - Pháp Cú
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
