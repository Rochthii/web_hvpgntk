import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import {
    LayoutDashboard,
    Users,
    FileText,
    Calendar,
    Settings,
    LogOut,
    BookOpen,
    GraduationCap,
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, to, active }: any) => (
    <Link
        to={to}
        className={cn(
            "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors mb-1",
            active
                ? "bg-primary text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100 hover:text-primary"
        )}
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </Link>
);

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

import {
    canViewCMS,
    canViewStudents,
    canApprovePetitions,
    canViewAudit
} from '../../lib/permissions';

// ... Inside Sidebar component ...
export const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
    const location = useLocation();
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname.startsWith(path);

    // Permission Checks
    const showDashboard = true; // Everyone with admin access can see dashboard (view restricted by API content)
    const showApprovals = canApprovePetitions(user);
    const showStaff = user?.role === 'admin'; // Only admin manages staff
    const showStudents = canViewStudents(user);
    const showCMS = canViewCMS(user);
    const showSettings = user?.role === 'admin';

    return (
        <aside
            className={cn(
                "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-200 ease-in-out lg:transform-none flex flex-col",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}
        >
            <div className="h-16 flex items-center justify-center border-b border-gray-100 px-6">
                <Link to="/" className="flex items-center space-x-2">
                    <img src="/logo-hvpgntk.png" alt="Logo" className="h-8 w-8" />
                    <span className="font-bold text-gray-800 text-lg">HVPG Admin</span>
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-3">
                <div className="mb-6 px-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Quản Lý</p>
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/admin/dashboard" active={isActive('/admin/dashboard')} />

                    {showApprovals && (
                        <SidebarItem icon={FileText} label="Duyệt Đơn Từ" to="/admin/approvals" active={isActive('/admin/approvals')} />
                    )}

                    {showStaff && (
                        <SidebarItem icon={Users} label="Nhân Sự & Admin" to="/admin/staff" active={isActive('/admin/staff')} />
                    )}

                    {showStudents && (
                        <SidebarItem icon={GraduationCap} label="Sinh Viên & Điểm" to="/admin/students" active={isActive('/admin/students')} />
                    )}
                </div>

                {showCMS && (
                    <div className="mb-6 px-4">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nội Dung</p>
                        <SidebarItem icon={FileText} label="Trang Tĩnh & Giới Thiệu" to="/admin/pages" active={isActive('/admin/pages')} />
                        <SidebarItem icon={BookOpen} label="Tin Tức & Bài Viết" to="/admin/news" active={isActive('/admin/news')} />
                        <SidebarItem icon={Calendar} label="Lịch & Sự Kiện" to="/admin/events" active={isActive('/admin/events')} />
                    </div>
                )}

                {showSettings && (
                    <div className="px-4">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Hệ Thống</p>
                        <SidebarItem icon={Settings} label="Cài Đặt" to="/admin/settings" active={isActive('/admin/settings')} />
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between mb-4 px-2">
                    <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                            {user?.display_name?.charAt(0) || 'A'}
                        </div>
                        <div className="text-sm">
                            <p className="font-bold text-gray-700 truncate w-32">{user?.display_name}</p>
                            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-gray-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                >
                    <LogOut size={16} />
                    <span>Đăng xuất</span>
                </button>
            </div>
        </aside>
    );
};
