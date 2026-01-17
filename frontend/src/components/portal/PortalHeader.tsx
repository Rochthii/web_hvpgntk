import React from 'react';
import { Menu, User, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface PortalHeaderProps {
    role: 'content' | 'teacher';
    onMenuClick: () => void;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({ role, onMenuClick }) => {
    const { user } = useAuth();

    // Format Role Display
    const roleMap: Record<string, string> = {
        'content': 'Biên Tập Viên',
        'teacher': 'Giáo Thọ Sư',
        'admin': 'Quản Trị Viên'
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30 px-4 md:px-8">
            <div className="h-full flex items-center justify-between">
                {/* Left: Mobile Menu + Title */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onMenuClick}
                        className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        <Menu size={24} />
                    </button>
                    <h1 className="text-lg font-bold text-gray-800 hidden sm:block">
                        Cổng Thông Tin {roleMap[role] || role}
                    </h1>
                </div>

                {/* Right: User Info */}
                <div className="flex items-center space-x-4">
                    {/* Notifications (Mock) */}
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>

                    {/* Divider */}
                    <div className="h-8 w-px bg-gray-200 mx-2"></div>

                    {/* Profile */}
                    <div className="flex items-center space-x-3">
                        <div className="text-right hidden sm:block">
                            <div className="font-bold text-sm text-gray-900">{user?.display_name || 'User'}</div>
                            <div className="text-xs text-gray-500">{user?.email}</div>
                        </div>
                        <div className="w-9 h-9 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 border border-amber-200">
                            <User size={20} />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
