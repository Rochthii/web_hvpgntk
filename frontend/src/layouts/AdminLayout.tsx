import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import {
    LayoutDashboard,
    Users,
    FileText,
    Calendar,
    Settings,
    LogOut,
    Menu,
    X,
    BookOpen,
    GraduationCap,
    Bell
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { NotificationBell } from '../layout/NotificationBell';

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

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname.startsWith(path);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Mobile Sidebar Overlay */}
            <div
                className={cn("fixed inset-0 bg-black/50 z-40 lg:hidden", sidebarOpen ? "block" : "hidden")}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
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
                        <SidebarItem icon={FileText} label="Duyệt Đơn Từ" to="/admin/approvals" active={isActive('/admin/approvals')} />
                        <SidebarItem icon={Users} label="Nhân Sự & Admin" to="/admin/staff" active={isActive('/admin/staff')} />
                        <SidebarItem icon={GraduationCap} label="Sinh Viên & Điểm" to="/admin/students" active={isActive('/admin/students')} />
                    </div>

                    <div className="mb-6 px-4">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nội Dung</p>
                        <SidebarItem icon={BookOpen} label="Tin Tức & Bài Viết" to="/admin/news" active={isActive('/admin/news')} />
                        <SidebarItem icon={Calendar} label="Lịch & Sự Kiện" to="/admin/events" active={isActive('/admin/events')} />
                    </div>

                    <div className="px-4">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Hệ Thống</p>
                        <SidebarItem icon={Settings} label="Cài Đặt" to="/admin/settings" active={isActive('/admin/settings')} />
                    </div>
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

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center space-x-4 ml-auto">
                        <NotificationBell />
                    </div>
                </header>

                {/* Content Body */}
                <main className="flex-1 overflow-auto p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};
